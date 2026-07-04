/**
 * OneNote auxiliary storage provider for Scriptoria.
 *
 * Exposes window.OneNoteProvider, which implements the StorageProvider
 * interface used by the existing sync system.
 *
 * Azure App Registration Setup
 * 1. Open https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade
 * 2. Select the existing Scriptoria / ChurchScribe app registration used for
 *    OneDrive, or create a new SPA app registration if you want to isolate
 *    OneNote access.
 * 3. Under Authentication, confirm every local/dev/prod Scriptoria URL is
 *    added as a "Single-page application" redirect URI.
 * 4. Under API permissions, add Microsoft Graph delegated permissions:
 *    - Notes.ReadWrite
 *    - Notes.Create
 *    - User.Read
 * 5. Save the permission changes. Personal Microsoft accounts can consent
 *    during sign-in. Organizational accounts may require an admin grant.
 * 6. If you created a separate registration, replace clientId below with the
 *    Azure "Application (client) ID".
 */
(() => {
  "use strict";

  const clientId = "60869d80-c4cb-4d64-a753-ddecd3bb2752";
  const authority = "https://login.microsoftonline.com/common";
  const scopes = ["Notes.ReadWrite", "Notes.Create", "User.Read"];

  const GRAPH_BASE = "https://graph.microsoft.com/v1.0";
  const MSAL_POLL_INTERVAL_MS = 100;
  const MSAL_LOAD_TIMEOUT_MS = 10000;
  const providerVersion = 1;
  const notebookCreateOptionValue = "__create__";
  const syncSectionName = "Scriptoria Sync";
  const settingsPageTitle = "Scriptoria Workspace Settings";
  const settingsRootDataId = "scriptoria-settings-root";
  const noteRootDataId = "scriptoria-note-root";
  const noteMetaDataId = "scriptoria-note-meta";
  const noteBodyDataId = "scriptoria-note-body";
  const settingsPayloadMarker = "SCRIPTORIA_SYNC_STATE_V1";
  const legacySyncSectionNames = ["ChurchScribe Sync"];
  const legacySettingsPageTitles = ["ChurchScribe Workspace Settings"];
  const legacySettingsRootDataIds = ["churchscribe-settings-root"];
  const legacyNoteRootDataIds = ["churchscribe-note-root"];
  const legacyNoteBodyDataIds = ["churchscribe-note-body"];
  const legacySettingsPayloadMarkers = ["CHURCHSCRIBE_SYNC_STATE_V1"];

  let msalInstancePromise = null;
  let accessToken = null;
  let silentReconnectAttempted = false;
  let notebookCache = [];
  let sectionCacheByNotebookId = new Map();
  let throttleUntilMs = 0;

  const getRetryAfterMs = (retryAfterHeader) => {
    const retryAfterValue = String(retryAfterHeader || "").trim();
    if (!retryAfterValue) {
      return 15000;
    }

    const retryAfterSeconds = Number(retryAfterValue);
    if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
      return retryAfterSeconds * 1000;
    }

    const retryAtMs = Date.parse(retryAfterValue);
    if (Number.isFinite(retryAtMs)) {
      return Math.max(0, retryAtMs - Date.now());
    }

    return 15000;
  };

  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  const isAvailable = () => true;
  const hasActiveSession = () => Boolean(accessToken);

  const getMsalInstance = () => {
    if (!msalInstancePromise) {
      msalInstancePromise = new Promise((resolve, reject) => {
        let elapsed = 0;

        const tryCreate = () => {
          if (window.msal?.PublicClientApplication) {
            const instance = new window.msal.PublicClientApplication({
              auth: {
                clientId,
                authority,
                redirectUri: window.location.origin + window.location.pathname
              },
              cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: false
              }
            });

            instance.initialize().then(() => resolve(instance)).catch(reject);
            return;
          }

          elapsed += MSAL_POLL_INTERVAL_MS;
          if (elapsed >= MSAL_LOAD_TIMEOUT_MS) {
            reject(new Error("MSAL library did not load. Ensure the msal-browser script is present in index.html."));
            return;
          }

          window.setTimeout(tryCreate, MSAL_POLL_INTERVAL_MS);
        };

        tryCreate();
      });
    }

    return msalInstancePromise;
  };

  const ensureTokenClient = () => {
    void getMsalInstance();
  };

  const waitForReady = (onReady) => {
    onReady();
  };

  const apiFetch = async (url, options = {}) => {
    if (!accessToken) {
      throw new Error("OneNote is not connected in this browser session.");
    }

    const method = String(options.method || "GET").toUpperCase();
    if (Date.now() < throttleUntilMs) {
      const retryAfterMs = Math.max(0, throttleUntilMs - Date.now());
      const err = new Error(`Microsoft Graph is throttling OneNote sync. Retry in ${Math.ceil(retryAfterMs / 1000)} seconds.`);
      err.status = 429;
      err.retryAfter = String(Math.ceil(retryAfterMs / 1000));
      err.requestUrl = url;
      err.requestMethod = method;
      console.warn("[OneNoteSync] Graph request skipped during throttle window", {
        method,
        url,
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000)
      });
      throw err;
    }

    const headers = new Headers(options.headers ?? {});
    headers.set("Authorization", `Bearer ${accessToken}`);

    console.log("[OneNoteSync] Graph request", {
      method,
      url
    });

    const response = await fetch(url, { ...options, headers });

    console.log("[OneNoteSync] Graph response", {
      method,
      url,
      status: response.status,
      ok: response.ok,
      retryAfter: response.headers.get("Retry-After") || "",
      requestId: response.headers.get("request-id") || response.headers.get("x-ms-request-id") || ""
    });

    if (!response.ok) {
      const errorText = await response.text();
      const err = new Error(errorText || `OneNote request failed with status ${response.status}.`);
      err.status = response.status;
      err.retryAfter = response.headers.get("Retry-After") || "";
      err.requestUrl = url;
      err.requestMethod = method;
      if (response.status === 429) {
        throttleUntilMs = Date.now() + getRetryAfterMs(err.retryAfter);
      }
      console.error("[OneNoteSync] Graph error", {
        method,
        url,
        status: response.status,
        retryAfter: err.retryAfter,
        body: errorText
      });
      throw err;
    }

    return response;
  };

  const parseErrorMessage = (error) => {
    const fallback = "Unknown OneNote error.";

    if (!(error instanceof Error)) {
      return fallback;
    }

    const message = error.message?.trim() || fallback;

    try {
      const parsed = JSON.parse(message);
      return parsed.error?.message || parsed.error?.innerError?.message || message;
    } catch {
      return message;
    }
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;");

  const sanitizeSectionName = (value, fallback = "Untitled Section") => {
    const sanitized = String(value ?? "")
      .replace(/[?*\\/:<>|&#"%~]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return sanitized || fallback;
  };

  const sanitizePlainText = (value, fallback = "Untitled") => {
    const cleaned = String(value ?? "").replace(/\s+/g, " ").trim();
    return cleaned || fallback;
  };

  const normalizeFieldLabel = (value) =>
    String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");

  const getPreferredTitleFieldId = (noteType) => {
    if (!noteType || !Array.isArray(noteType.fields) || !noteType.fields.length) {
      return "";
    }

    if (
      typeof noteType.cardTitleFieldId === "string" &&
      noteType.cardTitleFieldId &&
      noteType.fields.some((field) => field.id === noteType.cardTitleFieldId)
    ) {
      return noteType.cardTitleFieldId;
    }

    const titleField = noteType.fields.find((field) => normalizeFieldLabel(field.label) === "title");
    return titleField?.id ?? noteType.fields[0]?.id ?? "";
  };

  const wrapManagedHtml = (title, bodyHtml, createdAt) => `<!DOCTYPE html>
<html>
  <head>
    <title>${escapeHtml(title)}</title>
    <meta name="created" content="${escapeHtml(createdAt || new Date().toISOString())}" />
  </head>
  <body>
    ${bodyHtml}
  </body>
</html>`;

  const serializeNodeChildren = (node) => {
    const wrapper = node.ownerDocument.createElement("div");
    wrapper.append(...[...node.childNodes].map((child) => child.cloneNode(true)));
    return wrapper.innerHTML;
  };

  const buildSettingsPageHtml = (payload) => {
    const json = escapeHtml(JSON.stringify(payload, null, 2));
    return wrapManagedHtml(
      settingsPageTitle,
      `<div data-id="${settingsRootDataId}">
        <p>This page is managed by Scriptoria for OneNote synchronization.</p>
        <pre>${settingsPayloadMarker}
${json}</pre>
      </div>`,
      payload.updatedAt
    );
  };

  const buildMetadataBlockHtml = (note, noteType) => {
    const lines = [
      `<p><b>Type:</b> ${escapeHtml(noteType?.name ?? "Unknown type")}</p>`,
      `<p><b>Created:</b> ${escapeHtml(note.createdAt ?? "")}</p>`,
      `<p><b>Updated:</b> ${escapeHtml(note.updatedAt ?? "")}</p>`
    ];

    const fields = Array.isArray(noteType?.fields) ? noteType.fields : [];
    for (const field of fields) {
      const value = sanitizePlainText(note.metadata?.[field.id] ?? "", "");
      if (value) {
        lines.push(`<p><b>${escapeHtml(field.label)}:</b> ${escapeHtml(value)}</p>`);
      }
    }

    return `<div data-id="${noteMetaDataId}">${lines.join("")}</div>`;
  };

  const BIBLE_DOT_COM_TRANSLATION_ID = 114;
  const BIBLE_DOT_COM_BOOK_CODES = {
    Genesis: "GEN",
    Exodus: "EXO",
    Leviticus: "LEV",
    Numbers: "NUM",
    Deuteronomy: "DEU",
    Joshua: "JOS",
    Judges: "JDG",
    Ruth: "RUT",
    "1 Samuel": "1SA",
    "2 Samuel": "2SA",
    "1 Kings": "1KI",
    "2 Kings": "2KI",
    "1 Chronicles": "1CH",
    "2 Chronicles": "2CH",
    Ezra: "EZR",
    Nehemiah: "NEH",
    Esther: "EST",
    Job: "JOB",
    Psalms: "PSA",
    Proverbs: "PRO",
    Ecclesiastes: "ECC",
    "Song of Solomon": "SNG",
    Isaiah: "ISA",
    Jeremiah: "JER",
    Lamentations: "LAM",
    Ezekiel: "EZK",
    Daniel: "DAN",
    Hosea: "HOS",
    Joel: "JOL",
    Amos: "AMO",
    Obadiah: "OBA",
    Jonah: "JON",
    Micah: "MIC",
    Nahum: "NAM",
    Habakkuk: "HAB",
    Zephaniah: "ZEP",
    Haggai: "HAG",
    Zechariah: "ZEC",
    Malachi: "MAL",
    Matthew: "MAT",
    Mark: "MRK",
    Luke: "LUK",
    John: "JHN",
    Acts: "ACT",
    Romans: "ROM",
    "1 Corinthians": "1CO",
    "2 Corinthians": "2CO",
    Galatians: "GAL",
    Ephesians: "EPH",
    Philippians: "PHP",
    Colossians: "COL",
    "1 Thessalonians": "1TH",
    "2 Thessalonians": "2TH",
    "1 Timothy": "1TI",
    "2 Timothy": "2TI",
    Titus: "TIT",
    Philemon: "PHM",
    Hebrews: "HEB",
    James: "JAS",
    "1 Peter": "1PE",
    "2 Peter": "2PE",
    "1 John": "1JN",
    "2 John": "2JN",
    "3 John": "3JN",
    Jude: "JUD",
    Revelation: "REV"
  };

  const parseSimpleBibleReference = (referenceText) => {
    const normalized = sanitizePlainText(referenceText, "");
    if (!normalized) {
      return null;
    }

    const match = normalized.match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z\s]+?)\s+(.+)$/);
    if (!match) {
      return null;
    }

    const book = match[1].replace(/\s+/g, " ").trim();
    const referenceBody = match[2].trim();
    const bookCode = BIBLE_DOT_COM_BOOK_CODES[book];

    if (!bookCode) {
      return null;
    }

    const segments = referenceBody.split(/\s*,\s*/);
    const verseSegments = [];
    let chapter = "";
    let sawVerse = false;

    for (const [index, segment] of segments.entries()) {
      const chapterVerseMatch = segment.match(/^(\d+):(\d+)(?:-(\d+))?$/);
      const chapterOnlyMatch = segment.match(/^(\d+)$/);
      const verseOnlyMatch = segment.match(/^(\d+)(?:-(\d+))?$/);

      if (chapterVerseMatch) {
        const nextChapter = chapterVerseMatch[1];
        const verseStart = chapterVerseMatch[2];
        const verseEnd = chapterVerseMatch[3] ?? "";

        if (!chapter) {
          chapter = nextChapter;
        } else if (chapter !== nextChapter) {
          return null;
        }

        verseSegments.push(verseEnd ? `${verseStart}-${verseEnd}` : verseStart);
        sawVerse = true;
        continue;
      }

      if (!chapter && chapterOnlyMatch && segments.length === 1) {
        chapter = chapterOnlyMatch[1];
        continue;
      }

      if (chapter && verseOnlyMatch) {
        const verseStart = verseOnlyMatch[1];
        const verseEnd = verseOnlyMatch[2] ?? "";
        verseSegments.push(verseEnd ? `${verseStart}-${verseEnd}` : verseStart);
        sawVerse = true;
        continue;
      }

      if (index === 0 && chapterOnlyMatch) {
        chapter = chapterOnlyMatch[1];
        continue;
      }

      return null;
    }

    if (!chapter) {
      return null;
    }

    return {
      bookCode,
      chapter,
      verseSpec: sawVerse ? verseSegments.join(",") : ""
    };
  };

  const getBibleDotComSearchQuery = (referenceText, translationCode = "") => {
    const normalizedReference = sanitizePlainText(referenceText, "");
    const normalizedTranslation = sanitizePlainText(
      String(translationCode || "")
        .split(":")
        .pop(),
      ""
    );

    return [normalizedReference, normalizedTranslation].filter(Boolean).join(" ");
  };

  const buildBibleDotComUrl = (referenceText, translationCode = "") => {
    const parsedReference = parseSimpleBibleReference(referenceText);
    if (parsedReference) {
      const versePart = parsedReference.verseSpec
        ? `.${parsedReference.verseSpec}`
        : "";
      return `https://www.bible.com/bible/${BIBLE_DOT_COM_TRANSLATION_ID}/${parsedReference.bookCode}.${parsedReference.chapter}${versePart}.NKJV`;
    }

    return `https://www.bible.com/search/bible?q=${encodeURIComponent(
      getBibleDotComSearchQuery(referenceText, translationCode)
    )}`;
  };

  const buildNoteBodyHtml = (note, { translationCode = "" } = {}) => {
    const doc = parser.parseFromString(`<div>${note.content || "<p><br></p>"}</div>`, "text/html");
    const root = doc.body.firstElementChild;

    root.querySelectorAll("script, style, form, iframe").forEach((el) => el.remove());
    root.querySelectorAll("[data-embed-ghost], [data-embed-dragging]").forEach((el) => {
      el.removeAttribute("data-embed-ghost");
      el.removeAttribute("data-embed-dragging");
    });

    root.querySelectorAll("a[data-scripture-ref]").forEach((anchor) => {
      const referenceText = sanitizePlainText(anchor.dataset.scriptureRef || anchor.textContent || "", "");
      if (!referenceText) {
        return;
      }

      anchor.href = buildBibleDotComUrl(referenceText, translationCode);
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    });

    root.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((attribute) => {
        if (["href", "src", "alt", "colspan", "rowspan", "style", "target", "rel"].includes(attribute.name)) {
          return;
        }
        if (attribute.name.startsWith("data-")) {
          return;
        }
        el.removeAttribute(attribute.name);
      });
    });

    return root.innerHTML || "<p><br /></p>";
  };

  const getPreferredTitle = (note, noteType) => {
    const preferredFieldId = noteType?.cardTitleFieldId;
    const preferredValue = preferredFieldId ? sanitizePlainText(note.metadata?.[preferredFieldId] ?? "", "") : "";

    if (preferredValue) {
      return preferredValue;
    }

    const metadataValues = Object.values(note.metadata ?? {})
      .map((value) => sanitizePlainText(value, ""))
      .filter(Boolean);

    if (metadataValues.length) {
      return metadataValues[0];
    }

    return `Note ${new Date(note.createdAt || Date.now()).toLocaleDateString()}`;
  };

  const buildNotePageHtml = (note, noteType, options = {}) => {
    const title = getPreferredTitle(note, noteType);
    const metadataHtml = buildMetadataBlockHtml(note, noteType);
    const bodyHtml = buildNoteBodyHtml(note, options);

    return {
      title,
      html: wrapManagedHtml(
        title,
        `<div data-id="${noteRootDataId}">
          ${metadataHtml}
          <div data-id="${noteBodyDataId}">${bodyHtml}</div>
        </div>`,
        note.createdAt
      )
    };
  };

  const queryByAnyDataId = (doc, ids) =>
    ids.map((id) => doc.querySelector(`[data-id="${id}"]`)).find(Boolean) ?? null;

  const parseSettingsPayloadText = (text) => {
    const sanitizedSource = String(text ?? "")
      .replaceAll("\uFFFC", "")
      .replaceAll("\u200B", "")
      .replaceAll("\u200C", "")
      .replaceAll("\u200D", "")
      .replaceAll("\uFEFF", "");
    const trimmed = sanitizedSource.trim();
    if (!trimmed) {
      return null;
    }

    const knownMarkers = [settingsPayloadMarker, ...legacySettingsPayloadMarkers];
    let jsonText = trimmed;

    for (const marker of knownMarkers) {
      if (trimmed.startsWith(marker)) {
        jsonText = trimmed.slice(marker.length).trim();
        break;
      }
    }

    try {
      const parsed = JSON.parse(jsonText);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return null;
    }

    return null;
  };

  const extractJsonObjectFromText = (text) => {
    const source = String(text ?? "");
    const firstBrace = source.indexOf("{");
    const lastBrace = source.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null;
    }

    return parseSettingsPayloadText(source.slice(firstBrace, lastBrace + 1));
  };

  const parseSettingsPageJson = (html) => {
    const doc = parser.parseFromString(html, "text/html");
    const root = queryByAnyDataId(doc, [settingsRootDataId, ...legacySettingsRootDataIds]);
    const preCandidates = [];

    if (root) {
      preCandidates.push(...root.querySelectorAll("pre"));
    }

    preCandidates.push(...doc.querySelectorAll("pre"));

    for (const pre of preCandidates) {
      const parsed = parseSettingsPayloadText(pre.textContent);
      if (parsed) {
        return parsed;
      }
    }

    const fullDocumentText = doc.body?.textContent ?? "";
    const parsedFromBodyText = extractJsonObjectFromText(fullDocumentText);
    if (parsedFromBodyText) {
      console.warn("[OneNoteSync] Recovered settings payload from normalized page text.");
      return parsedFromBodyText;
    }

    console.warn("[OneNoteSync] Failed to parse settings payload from page text", {
      bodyTextPreview: fullDocumentText.slice(0, 400)
    });

    throw new Error("Scriptoria settings page is missing its JSON payload.");
  };

  const looksLikeScriptureReference = (value) =>
    /^(?:[1-3]\s*)?[A-Za-z][A-Za-z.\s]+\s+\d+(?::\d+(?:-\d+)?)?(?:\s*,\s*(?:\d+(?::\d+)?(?:-\d+)?)?)*$/.test(
      sanitizePlainText(value, "")
    );

  const normalizeImportedScriptureLinks = (root) => {
    root.querySelectorAll("a").forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      const referenceText = sanitizePlainText(anchor.dataset.scriptureRef || anchor.textContent || "", "");
      const isBibleDotComLink = /:\/\/(?:www\.)?bible\.com\//i.test(href);

      if (!referenceText) {
        return;
      }

      if (!anchor.dataset.scriptureRef && !isBibleDotComLink) {
        return;
      }

      if (!looksLikeScriptureReference(referenceText)) {
        return;
      }

      anchor.dataset.scriptureRef = referenceText;
      anchor.dataset.autoScriptureLink = "true";
      anchor.classList.add("scripture-link");
      anchor.setAttribute("href", "#");
    });
  };

  const parseNotePage = (html) => {
    const doc = parser.parseFromString(html, "text/html");
    const title = doc.querySelector("title")?.textContent?.trim() ?? "";
    const bodyRoot = queryByAnyDataId(doc, [noteBodyDataId, ...legacyNoteBodyDataIds]);

    if (bodyRoot) {
      normalizeImportedScriptureLinks(bodyRoot);
      return {
        title,
        bodyHtml: serializeNodeChildren(bodyRoot)
      };
    }

    const wrapper = doc.body.firstElementChild;
    const fallbackBodyRoot = wrapper?.lastElementChild ?? doc.body;

    if (!fallbackBodyRoot) {
      throw new Error("Scriptoria-managed note body was not found on the OneNote page.");
    }

    console.warn("[OneNoteSync] Falling back to heuristic note-body parsing because managed body markers were not found.");
    normalizeImportedScriptureLinks(fallbackBodyRoot);
    return {
      title,
      bodyHtml: serializeNodeChildren(fallbackBodyRoot)
    };
  };

  const fetchUserEmail = async () => {
    const response = await apiFetch(`${GRAPH_BASE}/me?$select=mail,userPrincipalName`);
    const data = await response.json();
    return data.mail || data.userPrincipalName || "";
  };

  const listAll = async (url) => {
    const items = [];
    let nextUrl = url;

    while (nextUrl) {
      const response = await apiFetch(nextUrl);
      const data = await response.json();
      items.push(...(data.value ?? []));
      nextUrl = data["@odata.nextLink"] ?? null;
    }

    return items;
  };

  const refreshNotebookCache = async () => {
    notebookCache = await listAll(
      `${GRAPH_BASE}/me/onenote/notebooks?$select=id,displayName,createdDateTime,lastModifiedDateTime`
    );
    notebookCache.sort((left, right) => left.displayName.localeCompare(right.displayName));
  };

  const listSectionsForNotebook = async (notebookId) => {
    if (!notebookId) {
      return [];
    }

    const sections = await listAll(
      `${GRAPH_BASE}/me/onenote/notebooks/${encodeURIComponent(notebookId)}/sections?$select=id,displayName`
    );
    sectionCacheByNotebookId.set(notebookId, sections);
    return sections;
  };

  const createNotebook = async (displayName) => {
    const response = await apiFetch(`${GRAPH_BASE}/me/onenote/notebooks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName })
    });
    const created = await response.json();
    await refreshNotebookCache();
    return created;
  };

  const createConfiguredNotebook = async (settings) => {
    if (!accessToken) {
      throw new Error("Connect to OneNote first.");
    }

    if (settings.notebookId !== notebookCreateOptionValue) {
      throw new Error("Choose 'Create new notebook...' first.");
    }

    const notebookName = sanitizePlainText(settings.createNotebookName, "");
    if (!notebookName) {
      throw new Error("Enter a notebook name before creating the OneNote notebook.");
    }

    const existingByName = notebookCache.find((entry) =>
      entry.displayName.localeCompare(notebookName, undefined, { sensitivity: "accent" }) === 0
    );
    const notebook = existingByName ?? await createNotebook(notebookName);

    return {
      notebookId: notebook.id,
      displayName: notebook.displayName ?? notebookName,
      remoteWorkspaceParentId: notebook.id,
      providerSettingsPatch: {
        notebookId: notebook.id,
        createNotebookName: notebook.displayName ?? notebookName,
        sectionIdsByTypeId: {},
        notePageState: {},
        noteSnapshotsById: {},
        settingsPageLastModifiedAt: "",
        settingsSignature: ""
      }
    };
  };

  const ensureTargetNotebook = async (settings) => {
    if (settings.remoteWorkspaceParentId) {
      const existingByRemoteId = notebookCache.find((entry) => entry.id === settings.remoteWorkspaceParentId);
      if (existingByRemoteId) {
        return existingByRemoteId;
      }

      await refreshNotebookCache();
      const refreshedByRemoteId = notebookCache.find((entry) => entry.id === settings.remoteWorkspaceParentId);
      if (refreshedByRemoteId) {
        return refreshedByRemoteId;
      }
    }

    if (settings.notebookId && settings.notebookId !== notebookCreateOptionValue) {
      const existing = notebookCache.find((entry) => entry.id === settings.notebookId);
      if (existing) {
        return existing;
      }

      await refreshNotebookCache();
      const refreshed = notebookCache.find((entry) => entry.id === settings.notebookId);
      if (refreshed) {
        return refreshed;
      }
    }

    if (settings.notebookId === notebookCreateOptionValue) {
      throw new Error("Create the OneNote notebook first from Settings before syncing.");
    }

    throw new Error("Select an existing OneNote notebook or choose to create one.");
  };

  const ensureSection = async (notebookId, displayName) => {
    const safeName = sanitizeSectionName(displayName);
    const existingSections = sectionCacheByNotebookId.get(notebookId) ?? await listSectionsForNotebook(notebookId);
    const acceptedNames = [safeName];
    if (safeName === syncSectionName) {
      acceptedNames.push(...legacySyncSectionNames);
    }
    const existing = existingSections.find((section) =>
      acceptedNames.some((name) => section.displayName.localeCompare(name, undefined, { sensitivity: "accent" }) === 0)
    );

    if (existing) {
      return existing;
    }

    const response = await apiFetch(`${GRAPH_BASE}/me/onenote/notebooks/${encodeURIComponent(notebookId)}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: safeName })
    });
    const created = await response.json();
    sectionCacheByNotebookId.set(notebookId, [...existingSections, created]);
    return created;
  };

  const fetchPageHtml = async (pageId) => {
    const response = await apiFetch(
      `${GRAPH_BASE}/me/onenote/pages/${encodeURIComponent(pageId)}/content?includeIDs=true`
    );
    return response.text();
  };

  const fetchPageMetadata = async (pageId) => {
    const response = await apiFetch(
      `${GRAPH_BASE}/me/onenote/pages/${encodeURIComponent(pageId)}?$select=id,title,lastModifiedDateTime,parentSection`
    );
    return response.json();
  };

  const createPageInSection = async (sectionId, html) => {
    const response = await apiFetch(`${GRAPH_BASE}/me/onenote/sections/${encodeURIComponent(sectionId)}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        Accept: "application/json"
      },
      body: html
    });

    return response.json();
  };

  const patchPage = async (pageId, changes) => {
    await apiFetch(`${GRAPH_BASE}/me/onenote/pages/${encodeURIComponent(pageId)}/content`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes)
    });
  };

  const deletePage = async (pageId) => {
    await apiFetch(`${GRAPH_BASE}/me/onenote/pages/${encodeURIComponent(pageId)}`, {
      method: "DELETE"
    });
  };

  const upsertSettingsPage = async (sectionId, settingsPayload, existingPageId = "") => {
    const html = buildSettingsPageHtml(settingsPayload);
    const nextDoc = parser.parseFromString(html, "text/html");
    const nextRoot = nextDoc.querySelector(`[data-id="${settingsRootDataId}"]`);
    const nextRootHtml = nextRoot ? serializer.serializeToString(nextRoot) : "<div><p>Missing settings payload.</p></div>";

    if (!existingPageId) {
      const created = await createPageInSection(sectionId, html);
      return {
        pageId: created.id ?? "",
        lastModifiedDateTime: created.lastModifiedDateTime ?? settingsPayload.updatedAt
      };
    }

    try {
      await patchPage(existingPageId, [
        { target: "title", action: "replace", content: settingsPageTitle },
        { target: "body", action: "replace", content: nextRootHtml }
      ]);
      return {
        pageId: existingPageId,
        lastModifiedDateTime: settingsPayload.updatedAt
      };
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }

      const created = await createPageInSection(sectionId, html);
      return {
        pageId: created.id ?? "",
        lastModifiedDateTime: created.lastModifiedDateTime ?? settingsPayload.updatedAt
      };
    }
  };

  const upsertNotePage = async (sectionId, note, noteType, existingPageId = "", options = {}) => {
    const nextPage = buildNotePageHtml(note, noteType, options);
    const nextDoc = parser.parseFromString(nextPage.html, "text/html");
    const nextRoot = nextDoc.querySelector(`[data-id="${noteRootDataId}"]`);
    const nextRootHtml = nextRoot ? serializer.serializeToString(nextRoot) : `<div data-id="${noteRootDataId}"><p>Missing note body.</p></div>`;

    if (!existingPageId) {
      const created = await createPageInSection(sectionId, nextPage.html);
      return {
        pageId: created.id ?? "",
        title: nextPage.title,
        lastModifiedDateTime: created.lastModifiedDateTime ?? note.updatedAt
      };
    }

    try {
      await patchPage(existingPageId, [
        { target: "title", action: "replace", content: nextPage.title },
        { target: "body", action: "replace", content: nextRootHtml }
      ]);
      return {
        pageId: existingPageId,
        title: nextPage.title,
        lastModifiedDateTime: note.updatedAt
      };
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }

      const created = await createPageInSection(sectionId, nextPage.html);
      return {
        pageId: created.id ?? "",
        title: nextPage.title,
        lastModifiedDateTime: created.lastModifiedDateTime ?? note.updatedAt
      };
    }
  };

  const getNotebookOptionLabel = (settings) => {
    if (settings.notebookId === notebookCreateOptionValue) {
      return sanitizePlainText(settings.createNotebookName, "New notebook");
    }

    const notebook = notebookCache.find((entry) => entry.id === settings.notebookId);
    return notebook?.displayName ?? "";
  };

  const connect = async () => {
    const msalInst = await getMsalInstance();

    try {
      const result = await msalInst.acquireTokenPopup({ scopes, prompt: "select_account" });
      accessToken = result.accessToken;
      await refreshNotebookCache();
      const email = await fetchUserEmail().catch(() => "");
      return { email };
    } catch (error) {
      accessToken = null;
      throw new Error(parseErrorMessage(error));
    }
  };

  const disconnect = () => {
    accessToken = null;
    silentReconnectAttempted = false;
    notebookCache = [];
    sectionCacheByNotebookId = new Map();
    throttleUntilMs = 0;

    if (msalInstancePromise) {
      const stalePromise = msalInstancePromise;
      msalInstancePromise = null;

      stalePromise.then((msalInst) => {
        const accounts = msalInst.getAllAccounts();
        if (!accounts.length) {
          return;
        }

        const logoutFn = typeof msalInst.logoutSilent === "function"
          ? () => msalInst.logoutSilent({ account: accounts[0] })
          : typeof msalInst.clearCache === "function"
            ? () => msalInst.clearCache()
            : () => Promise.resolve();

        void logoutFn().catch(() => {});
      }).catch(() => {});
    }
  };

  const attemptSilentReconnect = async () => {
    if (silentReconnectAttempted) {
      throw new Error("Silent reconnect already attempted this session.");
    }

    silentReconnectAttempted = true;

    const msalInst = await getMsalInstance();
    const accounts = msalInst.getAllAccounts();

    if (!accounts.length) {
      throw new Error("No OneNote account found. Please connect first.");
    }

    try {
      const result = await msalInst.acquireTokenSilent({ scopes, account: accounts[0] });
      accessToken = result.accessToken;
      await refreshNotebookCache();
      const email = await fetchUserEmail().catch(() => "");
      return { email };
    } catch {
      throw new Error("Silent reconnect failed. Please connect manually.");
    }
  };

  const getSettingsFields = () => {
    const notebookOptions = [
      { value: "", label: hasActiveSession() ? "Select a notebook" : "Connect to load notebooks" },
      ...notebookCache.map((notebook) => ({ value: notebook.id, label: notebook.displayName })),
      { value: notebookCreateOptionValue, label: "Create new notebook..." }
    ];

    return [
      {
        key: "notebookId",
        label: "Notebook",
        type: "select",
        options: notebookOptions,
        helpText: "Choose an existing notebook, or choose 'Create new notebook...' and Scriptoria will create it during the first sync."
      },
      {
        key: "createNotebookName",
        label: "New Notebook Name",
        type: "text",
        placeholder: "Scriptoria",
        helpText: "Used only for the first sync when 'Create new notebook...' is selected."
      }
    ];
  };

  const getSettingsValues = () => ({
    notebookId: "",
    createNotebookName: "",
    sectionIdsByTypeId: {},
    notePageState: {},
    noteSnapshotsById: {},
    settingsPageLastModifiedAt: "",
    settingsSignature: ""
  });

  const applySettingChange = (key) => {
    if (key === "notebookId" || key === "createNotebookName") {
      return { clearRemoteState: true };
    }

    return {};
  };

  const getLocationLabel = (settings) => getNotebookOptionLabel(settings);

  const buildSettingsStoragePayload = (settingsPayload, noteMappings, noteSnapshots) => ({
    providerVersion,
    updatedAt: settingsPayload.updatedAt,
    settings: settingsPayload,
    noteMappings,
    noteSnapshots
  });

  const buildComparableSettingsPayload = (settingsPayload) => {
    const comparable = structuredClone(settingsPayload ?? {});

    delete comparable.updatedAt;
    if (comparable.workspace && typeof comparable.workspace === "object") {
      delete comparable.workspace.updatedAt;
    }

    return comparable;
  };

  const buildSettingsSignature = (settingsPayload, noteMappings, noteSnapshots) =>
    JSON.stringify({
      settings: buildComparableSettingsPayload(settingsPayload),
      noteMappings,
      noteSnapshots
    });

  const getSectionMapFromPageState = (notePageState) =>
    Object.fromEntries(
      Object.values(notePageState)
        .filter((mapping) => mapping?.typeId && mapping?.sectionId)
        .map((mapping) => [mapping.typeId, mapping.sectionId])
    );

  const upload = async (payload, settings) => {
    try {
      const notebook = await ensureTargetNotebook(settings);
      const syncSection = await ensureSection(notebook.id, syncSectionName);
      const noteTypes = payload.settings?.workspace?.noteTypes ?? [];
      const translationCode = payload.settings?.preferences?.translation ?? "";
      const activeNoteId = payload.settings?.workspace?.activeNoteId ?? settings.activeNoteId ?? "";
      const activeNote = (payload.notes?.notes ?? []).find((note) => note.id === activeNoteId) ?? null;
      const isInitialExport = settings.syncReason === "initial" || !settings.remoteSettingsFileId;
      const notesToSync = isInitialExport
        ? (payload.notes?.notes ?? [])
        : (activeNote ? [activeNote] : []);
      const sectionIdsByTypeId = isInitialExport ? {} : { ...(settings.sectionIdsByTypeId ?? {}) };
      const notePageState = isInitialExport ? {} : { ...(settings.notePageState ?? {}) };
      const noteSnapshotsById = isInitialExport ? {} : { ...(settings.noteSnapshotsById ?? {}) };
      const nextNoteFileIds = isInitialExport ? {} : structuredClone(settings.remoteNoteFileIds ?? {});

      if (isInitialExport) {
        for (const type of noteTypes) {
          const section = await ensureSection(notebook.id, type.name);
          sectionIdsByTypeId[type.id] = section.id;
        }
      }

      for (const note of notesToSync) {
        const noteType = noteTypes.find((type) => type.id === note.typeId) ?? noteTypes[0] ?? null;
        if (noteType) {
          const section = sectionIdsByTypeId[noteType.id]
            ? { id: sectionIdsByTypeId[noteType.id] }
            : await ensureSection(notebook.id, noteType.name);
          const sectionId = section.id;
          sectionIdsByTypeId[noteType.id] = sectionId;

          const existingPageId = settings.remoteNoteFileIds?.[note.id] || notePageState[note.id]?.pageId || "";
          const existingState = notePageState[note.id] ?? {};

          if (
            existingPageId &&
            existingState.localNoteUpdatedAt === note.updatedAt &&
            existingState.sectionId === sectionId &&
            existingState.typeId === note.typeId
          ) {
            nextNoteFileIds[note.id] = existingPageId;
          } else {
            const pageResult = await upsertNotePage(
              sectionId,
              note,
              noteType,
              existingPageId,
              { translationCode }
            );
            nextNoteFileIds[note.id] = pageResult.pageId;
            notePageState[note.id] = {
              pageId: pageResult.pageId,
              sectionId,
              lastModifiedDateTime: pageResult.lastModifiedDateTime,
              title: pageResult.title,
              typeId: note.typeId,
              localNoteUpdatedAt: note.updatedAt
            };
          }

          noteSnapshotsById[note.id] = {
            typeId: note.typeId,
            metadata: structuredClone(note.metadata ?? {}),
            createdAt: note.createdAt ?? payload.updatedAt
          };
        }
      }

      const settingsPayload = buildSettingsStoragePayload(payload.settings, notePageState, noteSnapshotsById);
      const settingsSignature = buildSettingsSignature(
        settingsPayload.settings,
        settingsPayload.noteMappings,
        settingsPayload.noteSnapshots
      );

      let settingsPageResult = {
        pageId: settings.remoteSettingsFileId || "",
        lastModifiedDateTime: settings.settingsPageLastModifiedAt || payload.updatedAt
      };

      if (!settingsPageResult.pageId || settings.settingsSignature !== settingsSignature) {
        settingsPageResult = await upsertSettingsPage(
          syncSection.id,
          settingsPayload,
          settings.remoteSettingsFileId || ""
        );
      }

      return {
        remoteSettingsFileId: settingsPageResult.pageId,
        remoteNoteFileIds: nextNoteFileIds,
        remoteWorkspaceFileId: "",
        remoteWorkspaceParentId: notebook.id,
        providerSettingsPatch: {
          notebookId: notebook.id,
          createNotebookName: settings.notebookId === notebookCreateOptionValue
            ? sanitizePlainText(settings.createNotebookName, notebook.displayName)
            : settings.createNotebookName,
          sectionIdsByTypeId,
          notePageState,
          noteSnapshotsById,
          settingsPageLastModifiedAt: settingsPageResult.lastModifiedDateTime,
          settingsSignature
        }
      };
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  const download = async (settings) => {
    try {
      const notebook = await ensureTargetNotebook(settings);
      const syncSection = await ensureSection(notebook.id, syncSectionName);
      let settingsPageId = settings.remoteSettingsFileId || "";
      let settingsPayload = null;
      let candidatePages = [];

      const tryLoadSettingsPayload = async (pageId) => {
        const html = await fetchPageHtml(pageId);
        return parseSettingsPageJson(html);
      };

      if (settingsPageId) {
        try {
          settingsPayload = await tryLoadSettingsPayload(settingsPageId);
        } catch (error) {
          if (!String(error.message || "").includes("missing its JSON payload")) {
            throw error;
          }

          console.warn("[OneNoteSync] Ignoring settings page without managed JSON payload", { pageId: settingsPageId });
          settingsPageId = "";
        }
      }

      if (!settingsPayload) {
        const pages = await listAll(
          `${GRAPH_BASE}/me/onenote/sections/${encodeURIComponent(syncSection.id)}/pages?$select=id,title,lastModifiedDateTime`
        );
        candidatePages = pages.filter((page) => [settingsPageTitle, ...legacySettingsPageTitles].includes(page.title));
        console.log("[OneNoteSync] Settings page discovery", {
          notebookId: notebook.id,
          syncSectionId: syncSection.id,
          requestedSettingsPageId: settings.remoteSettingsFileId || "",
          candidatePageCount: candidatePages.length,
          candidatePageIds: candidatePages.map((page) => page.id)
        });

        for (const page of candidatePages) {
          try {
            settingsPayload = await tryLoadSettingsPayload(page.id);
            settingsPageId = page.id;
            break;
          } catch (error) {
            if (!String(error.message || "").includes("missing its JSON payload")) {
              throw error;
            }

            console.warn("[OneNoteSync] Skipping candidate settings page without managed JSON payload", {
              pageId: page.id,
              title: page.title
            });
          }
        }
      }

      if (!settingsPageId) {
        console.log("[OneNoteSync] No valid managed settings page found; returning null remote data");
        return {
          data: null,
          remoteSettingsFileId: "",
          remoteNoteFileIds: {},
          remoteWorkspaceFileId: "",
          remoteWorkspaceParentId: notebook.id
        };
      }

      const noteMappings = settingsPayload.noteMappings && typeof settingsPayload.noteMappings === "object"
        ? settingsPayload.noteMappings
        : {};
      const noteSnapshots = settingsPayload.noteSnapshots && typeof settingsPayload.noteSnapshots === "object"
        ? settingsPayload.noteSnapshots
        : {};
      console.log("[OneNoteSync] Loaded managed settings payload", {
        settingsPageId,
        noteMappingCount: Object.keys(noteMappings).length,
        noteSnapshotCount: Object.keys(noteSnapshots).length,
        updatedAt: settingsPayload.updatedAt
      });
      const notes = [];
      const remoteNoteFileIds = Object.fromEntries(
        Object.entries(noteMappings)
          .filter(([, mapping]) => mapping?.pageId)
          .map(([noteId, mapping]) => [noteId, mapping.pageId])
      );
      const notePageState = structuredClone(settings.notePageState ?? {});
      const timestamps = [settingsPayload.updatedAt];
      const activeNoteId = settings.activeNoteId || settingsPayload.settings?.workspace?.activeNoteId || "";
      const activeMapping = activeNoteId ? noteMappings[activeNoteId] : null;

      if (activeNoteId && activeMapping?.pageId) {
        try {
          const pageMetadata = await fetchPageMetadata(activeMapping.pageId);
          const knownModifiedAt = notePageState[activeNoteId]?.lastModifiedDateTime ||
            activeMapping.lastModifiedDateTime ||
            "";
          const pageChangedRemotely = !knownModifiedAt ||
            (pageMetadata.lastModifiedDateTime && pageMetadata.lastModifiedDateTime !== knownModifiedAt);

          if (!pageChangedRemotely) {
            console.log("[OneNoteSync] Active page unchanged since last sync; skipping remote import", {
              noteId: activeNoteId,
              pageId: activeMapping.pageId,
              lastModifiedDateTime: pageMetadata.lastModifiedDateTime ?? ""
            });
          } else {
            const pageHtml = await fetchPageHtml(activeMapping.pageId);
            const parsed = parseNotePage(pageHtml);
            const resolvedTitle = sanitizePlainText(pageMetadata.title ?? parsed.title, parsed.title || "Untitled");
            const noteType = settingsPayload.settings?.workspace?.noteTypes?.find((type) => type.id === activeMapping.typeId) ?? null;
            const preferredTitleFieldId = getPreferredTitleFieldId(noteType);
            const storedSnapshot = noteSnapshots[activeNoteId] ?? {};
            const nextNote = {
              id: activeNoteId,
              typeId: storedSnapshot.typeId ?? activeMapping.typeId,
              metadata: structuredClone(storedSnapshot.metadata ?? {}),
              content: parsed.bodyHtml,
              createdAt: storedSnapshot.createdAt ?? settingsPayload.updatedAt,
              updatedAt: pageMetadata.lastModifiedDateTime ?? activeMapping.lastModifiedDateTime ?? settingsPayload.updatedAt
            };

            if (preferredTitleFieldId) {
              nextNote.metadata[preferredTitleFieldId] = resolvedTitle;
            }

            console.log("[OneNoteSync] Imported remote note title", {
              noteId: activeNoteId,
              pageId: activeMapping.pageId,
              graphTitle: pageMetadata.title ?? "",
              htmlTitle: parsed.title,
              resolvedTitle,
              preferredTitleFieldId,
              resultingTitleFieldValue: preferredTitleFieldId ? nextNote.metadata[preferredTitleFieldId] : ""
            });

            notes.push(nextNote);
            notePageState[activeNoteId] = {
              ...activeMapping,
              lastModifiedDateTime: pageMetadata.lastModifiedDateTime ?? activeMapping.lastModifiedDateTime,
              title: resolvedTitle,
              localNoteUpdatedAt: nextNote.updatedAt
            };
            timestamps.push(pageMetadata.lastModifiedDateTime ?? activeMapping.lastModifiedDateTime);
          }
        } catch (error) {
          if (error.status !== 404) {
            throw error;
          }
        }
      }

      const latestUpdatedAt = timestamps
        .filter(Boolean)
        .sort((left, right) => new Date(right) - new Date(left))[0] ?? settingsPayload.updatedAt ?? null;

      console.log("[OneNoteSync] Returning remote note payload", {
        settingsPageId,
        importedNoteCount: notes.length,
        remoteNoteFileIdCount: Object.keys(remoteNoteFileIds).length,
        latestUpdatedAt
      });

      return {
        data: {
          ...(settingsPayload.settings ?? {}),
          updatedAt: latestUpdatedAt,
          notes,
          notesArePartial: true
        },
        remoteSettingsFileId: settingsPageId,
        remoteNoteFileIds,
        remoteWorkspaceFileId: "",
        remoteWorkspaceParentId: notebook.id,
        providerSettingsPatch: {
          notebookId: notebook.id,
          sectionIdsByTypeId: {
            ...(settings.sectionIdsByTypeId ?? {}),
            ...getSectionMapFromPageState(notePageState)
          },
          notePageState,
          noteSnapshotsById: noteSnapshots,
          settingsPageLastModifiedAt: settingsPayload.updatedAt ?? "",
          settingsSignature: buildSettingsSignature(
            settingsPayload.settings ?? {},
            noteMappings,
            noteSnapshots
          )
        }
      };
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  const clearRemote = async (settings = {}) => {
    if (!accessToken) {
      throw new Error("Not connected to OneNote.");
    }

    try {
      const notebook = await ensureTargetNotebook(settings);
      const syncSection = await ensureSection(notebook.id, syncSectionName);
      const deletions = [];

      if (settings.remoteSettingsFileId) {
        deletions.push(deletePage(settings.remoteSettingsFileId).catch(() => {}));
      }

      for (const pageId of Object.values(settings.remoteNoteFileIds ?? {})) {
        if (pageId) {
          deletions.push(deletePage(pageId).catch(() => {}));
        }
      }

      const syncPages = await listAll(
        `${GRAPH_BASE}/me/onenote/sections/${encodeURIComponent(syncSection.id)}/pages?$select=id,title`
      );
      for (const page of syncPages) {
        deletions.push(deletePage(page.id).catch(() => {}));
      }

      await Promise.all(deletions);
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  window.OneNoteProvider = {
    id: "onenote",
    displayName: "OneNote",
    isAvailable,
    hasActiveSession,
    ensureTokenClient,
    waitForReady,
    connect,
    disconnect,
    attemptSilentReconnect,
    getSettingsFields,
    getSettingsValues,
    applySettingChange,
    getLocationLabel,
    createConfiguredNotebook,
    upload,
    download,
    clearRemote
  };
})();
