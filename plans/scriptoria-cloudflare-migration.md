# Scriptoria Cloudflare Migration

Move Scriptoria from GitHub Pages (joshua.penman.dev/ChurchScribe) to Cloudflare
(scriptoria.penman.dev), take the 949 MB bible catalog out of the public repo and
serve it from R2 behind an origin check (bibles.scriptoria.penman.dev), and add a
stateless Worker API (api.scriptoria.penman.dev) that brokers OAuth refresh tokens
for Google Drive and Microsoft (OneDrive/OneNote) so cloud sync stops dying when
access tokens expire. No user accounts — refresh tokens are AES-encrypted into
HttpOnly cookies; nothing is stored server-side.

## Decisions (agreed with user, 2026-07-04)

- **Token model:** stateless Worker; refresh token encrypted (AES-256-GCM, key in a
  Worker secret) into an HttpOnly cookie on api.scriptoria.penman.dev. Both Google
  and Microsoft go through the API.
- **Catalog pipeline:** builder commits to a NEW private GitHub repo; a GitHub
  Action syncs changed files to an R2 bucket; a Worker serves the bucket with an
  Origin/Referer allowlist (scriptoria.penman.dev + localhost). Light protection
  only — curl with faked headers still works; user accepts this.
- **Public repo history:** `bibles/` is removed going forward only; NO history
  rewrite. User accepts that old content remains fetchable from git history.
- **Migration of existing users:** export/import notice — final GitHub Pages build
  gets a migration banner; users manually export a backup and import at the new
  domain. No automated data bridge.
- **API code location:** `api/` folder in this (public) ChurchScribe repo. Secrets
  live only in Cloudflare secret bindings, never in code.

## Key facts a future agent needs

- App repo: `KiwiGeek/ChurchScribe` (public), deployed by
  `.github/workflows/deploy.yml` to GitHub Pages on push to `master`.
- Catalog: `bibles/` — 274 JSON files, 949 MB, largest 18 MB. Fetched relative
  (`translations/manager.js` line ~17 `CATALOG_INDEX_URL = "bibles/catalog/index.json"`),
  partially precached in `sw.js` (~lines 101-110). `sw.js` only caches same-origin
  today; the catalog becomes cross-origin and needs an explicit allowlist there.
- Builder: `W:\ScriptoriaTranslationBuilder` (repo `KiwiGeek/ScriptoriaTranslationBuilder`),
  .NET 10 console app. `sync` command = download → decode → build →
  `git add`/`git commit` into the app repo (`Program.cs` `CommitGeneratedFiles()`,
  ~line 728). Paths configured via `bible-catalog.local` (keys include `app_repo`,
  `commit_message`, etc.). It commits but does not push.
- Google auth today: GIS token client in `storage/gdrive.js`, client ID
  `711830335817-2enpiqrmso0sqgq2fnh8o4ef4r60ede0` — access tokens only (~1 h), no
  refresh possible in-browser. This is the acute bug being fixed.
- Microsoft auth today: MSAL.js 2.39 (CDN, pinned SRI hash in index.html/mobile.html)
  in `storage/onedrive.js` and `storage/onenote.js`, client ID
  `60869d80-c4cb-4d64-a753-ddecd3bb2752`. SPA refresh tokens cap at 24 h.
- Scopes vary by `locationMode` (app folder vs main storage) — see
  `docs-cloud-setup.md`. The API must accept a requested scope set, not hardcode one.
- DNS for penman.dev is already on Cloudflare. Free tier is assumed everywhere
  (Workers 100k req/day, R2 10 GB storage + free egress, Pages 500 builds/month).

## Branch & deployment safety strategy (CRITICAL — read before committing anything)

The GitHub Pages workflow deploys **every push to `master`** to the live site at
joshua.penman.dev/ChurchScribe. The live site must keep working, untouched, until
the entire migration is verified. Therefore:

- **All app-repo changes in Phases 4–7 happen on a long-lived branch
  `cloudflare-migration`** — never on `master`. Pushing app changes to `master`
  before cutover would deploy half-migrated code (new catalog origin + new auth)
  to the old domain, where the origin-checked catalog Worker and the API's CORS
  allowlist would reject it. Broken live site.
- **Cloudflare Pages production branch is `cloudflare-migration` during
  development.** scriptoria.penman.dev serves the migration branch for testing;
  at cutover the Pages production branch is switched to `master` (dashboard
  setting, instant).
- **`bibles/` stays in `master` until cutover.** Its deletion happens on the
  migration branch and only reaches `master` via the final merge. (The old
  deployed site fetches the catalog relatively, so it needs those files present.)
- **The old site is preserved via a `legacy` branch**, snapshotted from `master`
  immediately before the cutover merge, with only the migration banner added. The
  GH Pages workflow is repointed to deploy from `legacy`. The legacy site keeps
  the old auth (GIS/MSAL) and its own relative `bibles/` copy, so it remains fully
  functional for export — indefinitely, frozen.
- **Catalog/builder work (Phases 2–3) is safe on `master`-independent repos** and
  can proceed anytime. Side effect: once the builder repoints (Phase 3), `master`'s
  `bibles/` stops receiving catalog updates — accepted; the old site serves a
  slightly stale catalog during the migration window.
- **Cutover sequence** (Phase 8) is strictly ordered: freeze legacy first, repoint
  GH Pages to legacy, THEN merge to master and flip Cloudflare Pages to master.
  Consequence: Azure SPA platform, old Google Picker referrers, and old-origin
  OAuth config must stay in place as long as the legacy site is up.

## API design (implement in Phase 4)

Endpoints on `api.scriptoria.penman.dev`, one set per provider (`google`, `microsoft`):

- `GET /auth/{provider}/start?scopes=...&return=...` → 302 to provider consent.
  `state` = signed nonce + return URL (must be on the origin allowlist). Google:
  `access_type=offline&prompt=consent` to guarantee a refresh token. Microsoft:
  include `offline_access` scope, `consumers` tenant endpoint.
- `GET /auth/{provider}/callback` → exchange code + client secret, encrypt the
  refresh token into cookie `scriptoria_{provider}_rt` (HttpOnly; Secure;
  SameSite=Lax; host-only; Path=/auth; Max-Age 180 days), 302 back to return URL
  with `#auth={provider}:ok` fragment.
- `POST /auth/{provider}/token` (credentials: include) → decrypt cookie, call the
  provider's refresh grant, return `{access_token, expires_in, scope}`. If the
  provider rotates the refresh token (Microsoft does), re-encrypt and re-set the
  cookie. 401 with `{error:"reconnect_required"}` if cookie missing/refresh revoked.
- `POST /auth/{provider}/logout` → best-effort revoke, clear cookie.
- CORS on everything: allow origins `https://scriptoria.penman.dev` and
  `http://localhost:8000`, `Access-Control-Allow-Credentials: true`. Reject other
  origins.
- Secrets (wrangler secret put): `GOOGLE_CLIENT_SECRET`, `MS_CLIENT_SECRET`,
  `TOKEN_ENC_KEY` (32 random bytes, base64). Client IDs are plain vars in
  wrangler.toml.

Catalog Worker on `bibles.scriptoria.penman.dev`: R2 bucket binding; reject unless
Origin or Referer matches allowlist (scriptoria.penman.dev, localhost) → 403;
otherwise stream object with `Content-Type: application/json`,
`Access-Control-Allow-Origin: <requesting origin>`, long `Cache-Control` +
`caches.default` edge caching to keep R2 reads low.

## For Future Agents
As work proceeds: mark checkboxes `- [x]` as items complete; when a phase is done,
set its status to `Complete` and write its **Phase Summary** (what was done, key
decisions, anything needed to continue with zero context); run the phase's
**Verification Plan** and record the result before moving on. When all phases are
done, fill in **Final Recap** and **Deployment Plan**. Items tagged **[USER]** are
manual dashboard/console steps only the user can perform — ask, don't attempt.

## Phase 1: Cloudflare & OAuth console groundwork
Status: Not started

- [ ] **[USER]** Cloudflare: create R2 bucket `scriptoria-bibles`; generate an R2
      API token (Object Read & Write, scoped to that bucket) for the GitHub Action;
      note the S3 endpoint URL.
- [ ] **[USER]** Cloudflare DNS: no records needed yet — Workers custom domains and
      Pages will create `scriptoria`, `api.scriptoria`, `bibles.scriptoria`
      subdomains in later phases. Confirm penman.dev zone is active.
- [ ] **[USER]** Google Cloud console (project of client `711830335817-...`): the
      existing OAuth client — if it's a "Web application" client, create/download a
      client secret and add redirect URI
      `https://api.scriptoria.penman.dev/auth/google/callback`; if it can't take a
      secret, create a new Web application client with that redirect URI and record
      both the new ID and secret.
- [ ] **[USER]** Azure portal (app registration `60869d80-...`): Certificates &
      secrets → new client secret (record value immediately); Authentication → Add
      platform → **Web** → redirect URI
      `https://api.scriptoria.penman.dev/auth/microsoft/callback`. Keep the
      existing SPA platform for now (old deployment still uses MSAL until Phase 7).
- [ ] **[USER]** GitHub: create private repo `KiwiGeek/ScriptoriaBibles` (empty).
- [ ] Record the non-secret values (R2 endpoint, bucket name, client IDs, redirect
      URIs) in this plan's Phase Summary for later phases. Secrets go only into
      Cloudflare/GitHub secret stores.

### Verification Plan
- User confirms each console step done; agent curls
  `https://<accountid>.r2.cloudflarestorage.com` reachability is NOT testable
  without creds — instead verify by listing the bucket with the provided token via
  `rclone lsd` (creds supplied at runtime, never written to disk unencrypted).
- `git ls-remote https://github.com/KiwiGeek/ScriptoriaBibles.git` succeeds (PAT in
  memory `reference_github_pat.md`; note sandbox may not reach api.github.com —
  fall back to asking user).

### Phase Summary
_(write when phase completes)_

## Phase 2: Catalog private repo + R2 sync pipeline
Status: Not started

- [ ] Seed `ScriptoriaBibles` repo: copy current `bibles/` content (structure:
      `bibles/catalog/...`, `bibles/content/...` kept as-is), plus a README
      explaining the pipeline and that the content is not licensed for reuse.
- [ ] Add `.github/workflows/sync-r2.yml` to ScriptoriaBibles: on push to master,
      rclone sync `bibles/` → R2 bucket (strip the `bibles/` prefix so keys are
      `catalog/...` and `content/...`). Secrets: `R2_ACCESS_KEY_ID`,
      `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`. Use `--checksum` so only changed files
      upload.
- [ ] **[USER]** Add those three secrets to the ScriptoriaBibles repo settings.
- [ ] Push seed commit; confirm Action populates the bucket (274 objects).
- [ ] Create `catalog-worker/` in ScriptoriaBibles (or `api/` repo — keep with the
      data): Worker per the design above (origin check, R2 binding, CORS, edge
      cache). Deploy with custom domain `bibles.scriptoria.penman.dev`.
- [ ] **[USER]** `wrangler login` / provide CLOUDFLARE_API_TOKEN so the agent can
      `wrangler deploy`; attach the custom domain in the dashboard if wrangler
      can't.

### Verification Plan
- `curl -s -o /dev/null -w "%{http_code}" -H "Origin: https://scriptoria.penman.dev" https://bibles.scriptoria.penman.dev/catalog/index.json` → `200`.
- Same URL with no Origin/Referer → `403`.
- `curl -H "Origin: https://scriptoria.penman.dev" .../catalog/index.json | python3 -c "import json,sys; json.load(sys.stdin); print('valid json')"` → valid json.
- Compare object count: rclone `size`/`ls | wc -l` vs `find bibles -type f | wc -l` (274).

### Phase Summary
_(write when phase completes)_

## Phase 3: Repoint TranslationBuilder at the private repo
Status: Not started

Work happens in `W:\ScriptoriaTranslationBuilder` (mounted separately). C# / .NET 10.

- [ ] Change `sync` to target the ScriptoriaBibles working copy instead of the app
      repo: new `bible-catalog.local` key (e.g. `catalog_repo`) with `app_repo`
      kept working but deprecated (warn if it points at ChurchScribe).
- [ ] Update `--builtin-config` default/docs — `builtin-translations.json` lives in
      the app repo; the builder still reads it from there (read-only), only OUTPUT
      moves.
- [ ] Add `git push` after commit in `CommitGeneratedFiles()` (config-gated,
      default on for the catalog repo) so the R2 sync Action actually fires.
- [ ] Update README.md typical-workflow examples for the new paths.
- [ ] Run a real `sync` end-to-end: builder → private repo commit → push → Action →
      R2 → served on bibles.scriptoria.penman.dev.

### Verification Plan
- `dotnet build bible-catalog-updater.sln` → 0 errors.
- `dotnet test` (existing tests in `tests/`) → pass.
- `status` command against the new catalog repo path shows expected output, no writes.
- After the real `sync`: `git -C <ScriptoriaBibles> log -1` shows the builder's
  commit; curl of an updated file on bibles.scriptoria.penman.dev returns the new
  content (compare a changed timestamp/field).

### Phase Summary
_(write when phase completes)_

## Phase 4: Auth API Worker (api.scriptoria.penman.dev)
Status: Not started

All commits on branch `cloudflare-migration` (see safety strategy above). The
Worker itself deploys via wrangler independently of any branch, so deploying it
does not affect the live site.

- [ ] Create branch `cloudflare-migration` from `master`; push it. All Phase 4–7
      work commits here.
- [ ] Scaffold `api/` in ChurchScribe: `wrangler.toml` (name `scriptoria-api`,
      custom domain `api.scriptoria.penman.dev`, vars for client IDs + allowed
      origins), Worker source implementing the endpoint design above.
- [ ] Implement AES-256-GCM cookie encrypt/decrypt helpers (WebCrypto, key from
      `TOKEN_ENC_KEY`), with random IV per encryption, versioned payload
      `{v:1, provider, refresh_token, iat}`.
- [ ] Implement Google endpoints (`start`, `callback`, `token`, `logout`) against
      `oauth2.googleapis.com` / `accounts.google.com`.
- [ ] Implement Microsoft endpoints against
      `login.microsoftonline.com/consumers/oauth2/v2.0` (authorize + token) with
      refresh-token rotation → re-set cookie.
- [ ] CORS middleware + `state` signing/validation (HMAC with `TOKEN_ENC_KEY`).
- [ ] Unit tests with `vitest` + `@cloudflare/vitest-pool-workers` (or plain
      `wrangler dev` + scripted curl) covering: cookie round-trip, state tampering
      → 400, missing cookie → 401 reconnect_required, CORS rejection of foreign
      origins.
- [ ] **[USER]** `wrangler secret put GOOGLE_CLIENT_SECRET / MS_CLIENT_SECRET /
      TOKEN_ENC_KEY` (agent can generate the enc key: `openssl rand -base64 32`).
- [ ] Deploy; attach custom domain.

### Verification Plan
- `npm test` in `api/` → all pass.
- `curl -s https://api.scriptoria.penman.dev/auth/google/start?...` → 302 with
  `Location: https://accounts.google.com/...` containing correct client_id,
  redirect_uri, access_type=offline.
- `curl -s -X POST https://api.scriptoria.penman.dev/auth/google/token -H "Origin: https://scriptoria.penman.dev"` (no cookie) → 401 `reconnect_required`.
- OPTIONS preflight from allowed origin → correct CORS headers; from
  `https://evil.example` → no ACAO header.
- Full OAuth round-trip needs a real Google/Microsoft account → **[USER]** verifies
  once client wiring exists (Phase 6/7).

### Phase Summary
_(write when phase completes)_

## Phase 5: App changes — catalog URL + service worker
Status: Not started

All commits on `cloudflare-migration` — none of this may reach `master` until the
Phase 8 cutover merge.

- [ ] Add `core/config.js` (or extend existing config) exporting
      `CATALOG_BASE` — default `https://bibles.scriptoria.penman.dev`, overridable
      (e.g. `window.SCRIPTORIA_CATALOG_BASE`) for local testing against a local
      copy.
- [ ] `translations/manager.js`: build catalog URLs from `CATALOG_BASE`
      (`${base}/catalog/index.json` — note the `bibles/` prefix is stripped in R2
      keys).
- [ ] `sw.js`: precache list entries become absolute catalog URLs; add
      `bibles.scriptoria.penman.dev` as an explicitly cacheable cross-origin host
      (cache-first, same versioned cache), keeping the existing "unknown
      cross-origin = pass-through" rule for everything else. Ensure cached
      responses aren't opaque (requests must be CORS-mode with the Worker's ACAO
      headers).
- [ ] Delete `bibles/` on the `cloudflare-migration` branch (normal commit; user
      accepted history stays). It must remain in `master` until the cutover merge —
      the live old site fetches it relatively. Update `.gitignore` to ignore
      `bibles/` so a stray builder run pointed at the old path can't re-add it.
- [ ] Also on the migration branch: repoint `.github/workflows/deploy.yml` to
      trigger on `legacy` instead of `master`. GitHub reads workflow triggers from
      the pushed commit, so when this merges to `master` in Phase 8 the merge push
      will NOT deploy to GitHub Pages.
- [ ] Grep for any other `bibles/` references (embed/, scripture/, docs) and update.

### Verification Plan
- `python3 -m http.server` + headless check (or `node` fetch shim): app loads,
  catalog index fetch goes to bibles.scriptoria.penman.dev and succeeds (200, CORS
  ok). Check via browser tools or curl-simulated requests.
- `grep -rn "bibles/" --include="*.js" --include="*.html"` → only CATALOG_BASE
  construction remains, no stray relative references.
- On branch `cloudflare-migration`: `git ls-files bibles | wc -l` → 0. On
  `master`: still 274 (untouched).
- `git log master..cloudflare-migration` confirms all app changes are branch-only;
  `curl -s https://joshua.penman.dev/ChurchScribe/` still serves the unmodified
  live site.
- Service worker: after load, verify catalog responses land in the versioned cache
  (browser tools: `caches.keys()` / entries include bibles.scriptoria URLs).

### Phase Summary
_(write when phase completes)_

## Phase 6: Client auth rework — Google Drive
Status: Not started

- [ ] New shared module `sync/api-auth.js`: `startAuth(provider, scopes)` (popup to
      `/auth/{provider}/start`, listen for redirect-back fragment or poll),
      `getAccessToken(provider)` (POST `/token`, credentials:include, in-memory
      cache until `expires_in`, single-flight), `disconnect(provider)` (POST
      `/logout`). Handle popup-blocked → full-page redirect fallback (mobile PWA).
- [ ] Rewrite `storage/gdrive.js` to use `api-auth.js` instead of GIS
      `initTokenClient`: connect flow, silent reconnect on page load (just call
      `/token`; 401 → surface "reconnect" state), incremental scopes for
      `mainStorage` mode (re-run `start` with wider scope set).
- [ ] Remove the GIS script tag dependency for token flow (keep only what the
      Google Picker still needs — Picker uses the access token + API key, verify).
- [ ] Auto-refresh: `cloud-sync.js` retry-on-401 path calls `getAccessToken` with
      `force:true` once before surfacing an error.
- [ ] Preserve the existing provider interface (`hasActiveSession`,
      `ensureTokenClient`, header injection) so `sync/cloud-sync.js` and
      `sync/setup-wizard.js` changes stay minimal.

### Verification Plan
- Static: `node --check` on changed files; grep confirms no
  `initTokenClient`/`requestAccessToken` remain in gdrive.js.
- `wrangler dev` + local app: mock provider endpoints? No — **[USER]** performs a
  live test: connect Google Drive (app-folder mode), sync a note, wait >1 h (or
  revoke the access token via Google security page), sync again → succeeds without
  reconnect prompt.
- Main-storage mode + Picker still works (**[USER]** live test).

### Phase Summary
_(write when phase completes)_

## Phase 7: Client auth rework — Microsoft (OneDrive + OneNote)
Status: Not started

- [ ] Rewrite `storage/onedrive.js` to use `sync/api-auth.js` (provider
      `microsoft`), dropping MSAL: connect, silent reconnect via `/token`,
      incremental consent for `Files.ReadWrite` main-storage mode.
- [ ] Same for `storage/onenote.js` (shares the client ID and cookie — one
      Microsoft cookie serves both; scopes are the union requested at connect
      time. Decide: request union up-front vs re-consent when second feature
      enabled — implement re-consent path).
- [ ] Remove the msal-browser CDN `<script>` tags from `index.html` and
      `mobile.html`; drop MSAL entries from `sw.js` never-cache list.
- [ ] **[USER]** Only when the legacy site is eventually retired: remove the SPA
      platform from the Azure app registration (the frozen legacy site keeps
      using MSAL/SPA until then; the new site needs only Web platform + secret).

### Verification Plan
- `grep -rn "msal" --include="*.js" --include="*.html"` → no functional references.
- `node --check` on changed files.
- **[USER]** live tests: OneDrive app-folder sync, OneDrive main-storage,
  OneNote sync; then wait >24 h and sync again with no reconnect prompt (this is
  the specific failure being fixed).

### Phase Summary
_(write when phase completes)_

## Phase 8: Hosting cutover
Status: Not started

Strictly ordered. Until step (e), the live site at joshua.penman.dev/ChurchScribe
continues deploying only from untouched `master`; nothing before (e) can affect it.

**8a — Cloudflare Pages on the migration branch (safe anytime):**
- [ ] **[USER]** Cloudflare Pages: create project from `KiwiGeek/ChurchScribe`,
      production branch `cloudflare-migration`, no build command, output dir `/`,
      custom domain `scriptoria.penman.dev`. (Switched to `master` in 8f.)
- [ ] Port the version-injection step (`version.js` with commit + build date) —
      Pages build command `bash scripts/inject-version.sh` (create it) or accept
      static version.js; pick and implement.
- [ ] Exclude `api/` and `plans/` from the Pages deploy if desired
      (`.cloudflare/pages` ignore or leave — they're harmless static files; decide
      and note).
- [ ] Full validation of the migration-branch deployment on scriptoria.penman.dev
      (Phases 5–7 verification plans, run against the real domain). **Do not
      proceed to 8b until everything works here.**

**8b — Prepare the legacy freeze:**
- [ ] Write the migration banner (dismissible, links to a short
      `docs-migration.md`): "Scriptoria has moved to scriptoria.penman.dev — export
      a backup (Settings → Backup) and import it at the new address." Keep the
      OLD app code otherwise untouched — old auth, relative catalog — so export
      keeps working forever on the frozen site.

**8c — Freeze legacy (first change the old site ever sees):**
- [ ] `git checkout -b legacy master` (snapshot of the still-working site); apply
      ONLY the banner commit + change its `deploy.yml` to trigger on `legacy`;
      push. GH Pages deploys the old app + banner from the `legacy` branch.
- [ ] Verify the old site: still fully functional (notes, catalog, existing cloud
      sync) and shows the banner.

**8d — Merge:**
- [ ] Merge `cloudflare-migration` → `master`. The merged `deploy.yml` triggers on
      `legacy` only, so this push does NOT deploy to GitHub Pages (verify no run
      starts in the Actions tab).

**8e/8f — Flip production:**
- [ ] **[USER]** Cloudflare Pages: switch production branch to `master`.
      scriptoria.penman.dev now tracks `master`; future `master` pushes deploy
      only to Cloudflare.
- [ ] Verify scriptoria.penman.dev serves the merge commit (check version.js /
      APP_COMMIT).

**8g — Docs & config:**
- [ ] Update README.md (deployment section) and `docs-cloud-setup.md` (new
      redirect URIs/origins; note legacy-branch arrangement).
- [ ] **[USER]** Google Picker API key referrers: ADD `https://scriptoria.penman.dev/*`
      — do not remove the old origin while the legacy site is up. Same rule for
      the Azure SPA platform: keep it as long as legacy lives.

### Verification Plan
- After 8c: `curl -s https://joshua.penman.dev/ChurchScribe/ | grep -i "moved"` →
  banner present; catalog fetch on old site still 200 (relative `bibles/` intact
  in legacy deploy); old-site cloud sync still connects (**[USER]**).
- After 8d: Actions tab shows NO Pages deploy triggered by the merge push;
  `git log -1 master` is the merge commit.
- After 8f: `curl -sI https://scriptoria.penman.dev` → 200; served commit matches
  `master` HEAD; full smoke test — create note, scripture panel loads a
  translation (catalog fetch), install as PWA, offline reload works.
- A trivial follow-up push to `master` deploys to Cloudflare Pages only (Actions
  tab quiet, Pages dashboard shows new deployment).

### Phase Summary
_(write when phase completes)_

## Phase 9: End-to-end verification & soak
Status: Not started

- [ ] Full matrix on scriptoria.penman.dev (**[USER]** where live accounts needed):
      Google Drive app-folder + main-storage, OneDrive app-folder + main-storage,
      OneNote, Local Drive (regression), no-provider local-only (regression).
- [ ] Token longevity: confirm sync still works >24 h (Microsoft) and >1 h (Google)
      after connect without any re-auth UI.
- [ ] Catalog: fresh browser profile loads translations; direct curl without Origin
      → 403; edge cache HIT on second request (check `cf-cache-status`).
- [ ] Builder: one more routine `sync` run publishes a catalog update end-to-end.
- [ ] Free-tier sanity: check Cloudflare dashboard analytics — Worker requests/day
      and R2 class A/B ops well under limits.
- [ ] Remove dead code/config found during soak; update this plan's Final Recap and
      Deployment Plan.

### Verification Plan
- The checklist above IS the verification; record pass/fail per row in the Phase
  Summary. Automatable rows (curl checks) run by agent; account-bound rows by user.

### Phase Summary
_(write when phase completes)_

## Final Recap
_(write when all phases complete: summary of the entire piece of work)_

## Deployment Plan
_(write when all phases complete: step-by-step deployment instructions)_
