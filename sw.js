// ─────────────────────────────────────────────────────────────────────────────
// Scriptoria Service Worker
//
// Strategy:
//   • Precache the app shell (HTML/CSS/JS, all themes/embeds/storage providers,
//     all built-in translations) at install time.  A user who has visited the
//     site once can then load it fully offline.
//   • Cache-first for same-origin GETs (fall through to network if missing,
//     populating the cache on the way back).  Navigation requests fall back to
//     the cached index.html when the network is unreachable.
//   • Stale-while-revalidate for Google Fonts (fonts.googleapis.com CSS and
//     fonts.gstatic.com woff2 binaries) in a separate, version-agnostic cache.
//   • Pass-through (no SW involvement) for cross-origin auth scripts, cloud
//     storage APIs, DoH validation, and embed providers.  Those endpoints need
//     fresh data and shouldn't be cached.
//
// Cache versioning:
//   • In production, version.js is rewritten by the GitHub Pages deploy with
//     the commit SHA in window.APP_COMMIT.  The SW imports version.js and uses
//     that SHA as the cache name so each deploy gets a fresh cache and old
//     ones are cleaned up on activate.
//   • In local dev (APP_COMMIT === "dev"), we use a Date.now() suffix captured
//     at SW parse time so each SW reinstall gets a guaranteed-fresh cache.
//     The browser reinstalls the SW whenever sw.js changes byte-for-byte, so
//     this gives clean iteration without manual cache clearing.
// ─────────────────────────────────────────────────────────────────────────────

// version.js sets `window.APP_COMMIT`, but the SW global has no `window`.
// Shim it before importing so the assignment lands on `self` (= SW global).
self.window = self;
try {
  importScripts("version.js");
} catch (err) {
  // If version.js can't be reached we fall back to dev-mode cache naming.
}

const APP_VERSION = (typeof self.APP_COMMIT === "string" && self.APP_COMMIT && self.APP_COMMIT !== "dev")
  ? self.APP_COMMIT
  : null;

const CACHE_NAME = APP_VERSION
  ? `scriptoria-v-${APP_VERSION}`
  : `scriptoria-dev-${Date.now()}`;

// Google Fonts cache is intentionally version-agnostic: CSS may change with new
// weights, but woff2 files are immutable per URL and worth keeping across
// deploys.  Same key on every install; we just keep adding to it.
const FONTS_CACHE = "scriptoria-fonts-v1";

// ── Precache list ────────────────────────────────────────────────────────────
// Same-origin assets the page loads at startup (and the four built-in
// translations app.js fetches on demand).  Themes are precached too — they're
// small and folding them into the install means the user can switch themes
// while offline.
const PRECACHE_URLS = [
  "./",
  "index.html",
  "styles.css",
  "version.js",
  "app.js",
  "manifest.json",
  "embed/base.js",
  "embed/image.js",
  "embed/pdf.js",
  "embed/spotify.js",
  "embed/youtube.js",
  "editor/controller.js",
  "editor/links.js",
  "editor/media.js",
  "editor/navigation.js",
  "editor/tables.js",
  "layout/panes.js",
  "notes/browser.js",
  "notes/model.js",
  "notes/render.js",
  "scripture/aliases.js",
  "scripture/references.js",
  "scripture/viewer.js",
  "scripture/search.js",
  "settings/backup-restore.js",
  "settings/note-types.js",
  "settings/onboarding.js",
  "settings/ui.js",
  "storage/gdrive.js",
  "storage/localdrive.js",
  "storage/noopprovider.js",
  "storage/nullprovider.js",
  "storage/onedrive.js",
  "sync/cloud-sync.js",
  "sync/payloads.js",
  "sync/status.js",
  "theme/controller.js",
  "translations/manager.js",

  // Themes (62 of them, but each is small)
  "themes/default.js",
  "themes/amber-warmth.js",
  "themes/arctic-frost.js",
  "themes/aurora-borealis.js",
  "themes/autumn-harvest.js",
  "themes/azure-sky.js",
  "themes/blood-moon.js",
  "themes/candlelight.js",
  "themes/cherry-blossom.js",
  "themes/cherry-noir.js",
  "themes/coastal-breeze.js",
  "themes/coffee-house.js",
  "themes/copper-craft.js",
  "themes/coral-reef.js",
  "themes/crimson-faith.js",
  "themes/cyberpunk.js",
  "themes/deep-space.js",
  "themes/desert-bloom.js",
  "themes/ember-glow.js",
  "themes/forest-vespers.js",
  "themes/fuchsia-faith.js",
  "themes/golden-hour.js",
  "themes/graphite.js",
  "themes/hot-pink.js",
  "themes/indigo-depths.js",
  "themes/ivory-grace.js",
  "themes/lavender-grace.js",
  "themes/linen-sunlit.js",
  "themes/marigold.js",
  "themes/midnight-cathedral.js",
  "themes/mint-fresh.js",
  "themes/monochrome.js",
  "themes/morning-mist.js",
  "themes/neon-sermon.js",
  "themes/neon-tokyo.js",
  "themes/northern-lights.js",
  "themes/ocean-executive.js",
  "themes/olive-grove.js",
  "themes/papyrus-script.js",
  "themes/peach-blossom.js",
  "themes/pine-grove.js",
  "themes/plum-twilight.js",
  "themes/renaissance.js",
  "themes/retro-arcade.js",
  "themes/rose-garden.js",
  "themes/royal-purple.js",
  "themes/saffron-spice.js",
  "themes/sage-chapel.js",
  "themes/sand-dune.js",
  "themes/sepia-memoir.js",
  "themes/slate-clean.js",
  "themes/solar-flare.js",
  "themes/spring-meadow.js",
  "themes/steel-resolve.js",
  "themes/storm-grey.js",
  "themes/sunset-revival.js",
  "themes/tangerine-dream.js",
  "themes/teal-modern.js",
  "themes/terracotta-sun.js",
  "themes/twilight-prayer.js",
  "themes/velvet-night.js",
  "themes/void-scripture.js",
  "themes/volcanic-rock.js"
];

// Cross-origin endpoints that should NEVER be cached — auth scripts, cloud
// storage APIs, the DoH validator, and embed iframes.  We just don't intercept
// these in the fetch handler.
const PASSTHROUGH_HOSTS = new Set([
  "accounts.google.com",
  "www.googleapis.com",
  "oauth2.googleapis.com",
  "content.googleapis.com",
  "graph.microsoft.com",
  "login.microsoftonline.com",
  "login.live.com",
  "cdn.jsdelivr.net",      // MSAL is loaded fresh; not safe to cache across deploys
  "cloudflare-dns.com",
  "www.youtube.com",
  "youtube.com",
  "open.spotify.com"
]);

const FONT_HOSTS = new Set([
  "fonts.googleapis.com",
  "fonts.gstatic.com"
]);

// ── Install: precache the shell ──────────────────────────────────────────────
// We use Promise.allSettled rather than cache.addAll() so that a single
// missing/erroring asset doesn't cause the whole install to roll back.  In
// practice every URL should resolve, but a partial cache is more useful than
// no cache.
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    await Promise.allSettled(
      PRECACHE_URLS.map(async (url) => {
        try {
          // cache: "reload" bypasses the HTTP cache so we always get the
          // freshest copy of each asset for this version's cache.
          const response = await fetch(url, { cache: "reload" });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (err) {
          // Asset unreachable at install time — skip; runtime fetches will
          // try again and populate the cache opportunistically.
        }
      })
    );

    // Activate immediately rather than waiting for all clients to close.  The
    // page-side registration handler decides whether to reload existing tabs.
    await self.skipWaiting();
  })());
});

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map((key) => {
        if (key === CACHE_NAME || key === FONTS_CACHE) {
          return null;
        }
        return caches.delete(key);
      })
    );

    // Take control of any already-open clients.  Combined with skipWaiting()
    // in install, this means a deploy can reach existing tabs without forcing
    // the user to close and reopen the app.
    await self.clients.claim();
  })());
});

// ── Fetch handlers ───────────────────────────────────────────────────────────

// Cache-first.  On hit, return the cached copy.  On miss, network-fetch and
// populate the cache.  On a network failure during a navigation, fall back to
// the cached index.html so the SPA shell still loads offline.
const cacheFirst = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    // Only cache successful, basic responses.  Opaque responses (cross-origin
    // without CORS) and error responses shouldn't be persisted.
    if (response.ok && response.type === "basic") {
      cache.put(request, response.clone());
    }

    return response;
  } catch (err) {
    if (request.mode === "navigate") {
      const fallback = await cache.match("index.html");
      if (fallback) {
        return fallback;
      }
    }
    throw err;
  }
};

// Stale-while-revalidate: serve cached immediately if present, fire off a
// background revalidation, and use the network as fallback only when nothing
// is cached.  Used for Google Fonts.
const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    // Don't await networkPromise — it updates the cache in the background.
    return cached;
  }

  const networkResponse = await networkPromise;
  return networkResponse ?? Response.error();
};

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only ever intercept GET.  POST/PUT to cloud APIs must always go to the
  // network and aren't safely cacheable.
  if (request.method !== "GET") {
    return;
  }

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Same origin → cache-first against the versioned cache.
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Google Fonts → stale-while-revalidate against the long-lived fonts cache.
  if (FONT_HOSTS.has(url.hostname)) {
    event.respondWith(staleWhileRevalidate(request, FONTS_CACHE));
    return;
  }

  // Auth, cloud, DoH, embed providers — explicitly pass through.  We don't
  // call event.respondWith(); the browser handles the request normally.
  if (PASSTHROUGH_HOSTS.has(url.hostname)) {
    return;
  }

  // Anything else cross-origin — also pass through.  Better to skip caching
  // unknown origins than to risk poisoning the cache with stale content.
});

// ── Page-driven control messages ─────────────────────────────────────────────
// The page can postMessage("skip-waiting") to tell a waiting SW to activate
// immediately (used for the "new version available — reload" prompt flow).
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") {
    self.skipWaiting();
  }
});
