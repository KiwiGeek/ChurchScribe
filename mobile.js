/**
 * mobile.js — Scriptoria mobile controller
 *
 * Wires up the same shared modules (themes, translations, scripture,
 * sync, notes model) that the desktop app uses, but replaces the editor,
 * pane layout, and full settings UI with a mobile-specific shell:
 *
 *   • Bottom-tab navigation (Bible | Notes)
 *   • Read-only notes list and detail view
 *   • Scripture-reference bottom sheet (tap a ref in a note → see the passage)
 *   • Landscape split-view: Bible pane + note side-by-side (CSS-driven)
 *   • Cloud sync pull on load; auto-resolves first-sync / conflict to "use cloud"
 */

'use strict';

// ── Storage constants ─────────────────────────────────────────────────────────
const workspaceStorageKey        = "service-notes-workspace";
const notesStorageKey            = "service-notes";
const legacyNotesStorageKey      = "service-notes-content";
const themeStorageKey            = "service-notes-theme";
const themeMirrorStorageKey      = "service-notes-theme-mirror";
const paneOrderStorageKey        = "service-notes-pane-order";
const paneSplitStorageKey        = "service-notes-pane-split";
const translationStorageKey      = "service-notes-translation";
const translationRegistryStorageKey = "service-notes-translation-registry";
const cloudSyncStorageKey        = "service-notes-cloud-sync";
const colorThemeStorageKey       = "service-notes-color-theme";
const colorThemeMirrorStorageKey = "service-notes-color-theme-mirror";
const lastBookChapterStorageKey  = "service-notes-last-book-chapter";
const onboardingStorageKey       = "service-notes-onboarding-seen";
const THEME_MODE_OPTIONS = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
];

// ── Utility functions ─────────────────────────────────────────────────────────
const translationLibrary = {};

const escapeRegExp  = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const createId      = (prefix) => `${prefix}-${crypto.randomUUID()}`;
const formatSyncTimestamp = (v) => v ? new Date(v).toLocaleString() : "Not synced yet";
const normalizeFieldLabel = (v) => v.trim().toLowerCase();

// Storage helpers and IndexedDB utilities — provided by core/storage.js.
const {
  openDatabase,
  readStoredValue,
  writeStoredValue,
  deleteStoredValue,
  migrateLegacyPreference,
  readMirroredPreference,
  writeMirroredPreference
} = window.ScriptoriaStorage;

const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; fn(...args); }, delay);
  };
};

const escapeHtml = (str) => {
  const d = document.createElement("div");
  d.textContent = String(str ?? "");
  return d.innerHTML;
};

// ── App-level state ───────────────────────────────────────────────────────────
const workspace = {
  noteTypes: [], notes: [], activeNoteId: null,
  selectedNewNoteTypeId: null, customBookAliases: {}, updatedAt: null
};

const cloudSyncSettings = {
  provider: "none", pollIntervalSeconds: 60, status: "Not connected",
  lastSyncAt: null, localSettingsUpdatedAt: null, connectedEmail: "",
  remoteSettingsFileId: "", remoteNoteFileIds: {}, remoteWorkspaceFileId: "",
  remoteWorkspaceParentId: "", lastError: "", providerSettings: {}
};

let activeProvider = window.NoOpProvider;

const providerRegistry = {};
if (window.NullProvider)       providerRegistry[window.NullProvider.id]       = window.NullProvider;
if (window.LocalDriveProvider) providerRegistry[window.LocalDriveProvider.id] = window.LocalDriveProvider;
if (window.GoogleDriveProvider) providerRegistry[window.GoogleDriveProvider.id] = window.GoogleDriveProvider;
if (window.OneDriveProvider)   providerRegistry[window.OneDriveProvider.id]   = window.OneDriveProvider;

const mobileState = {
  currentView:     "bible",  // "bible" | "notes"
  noteDetailId:    null,     // null = notes list; string id = note detail
  isCloudConnected: false,
  notesFilter:     "",
};

// ── DOM refs ──────────────────────────────────────────────────────────────────
const translationSelect      = document.querySelector("#translation-select");
const bookSelect             = document.querySelector("#book-select");
const chapterSelect          = document.querySelector("#chapter-select");
const verseDisplay           = document.querySelector("#verse-display");
const verseReference         = document.querySelector("#verse-reference");
const chapterText            = document.querySelector("#chapter-text");
const verseTranslation       = document.querySelector("#verse-translation");
const scriptureSearchInput   = document.querySelector("#scripture-search-input");
const scriptureSearchResults = document.querySelector("#scripture-search-results");

const mobApp          = document.querySelector("#mob-app");
const mobTitle        = document.querySelector("#mob-title");
const mobBackBtn      = document.querySelector("#mob-back-btn");
const mobSettingsBtn  = document.querySelector("#mob-settings-btn");
const mobSyncBarEl    = document.querySelector("#mob-sync-bar");
const mobSyncBarText  = document.querySelector("#mob-sync-bar-text");
const bibleView       = document.querySelector("#bible-view");
const notesView       = document.querySelector("#notes-view");
const noteDetailView  = document.querySelector("#note-detail-view");
const noteDetailHeader = document.querySelector("#note-detail-header");
const noteDetailBody  = document.querySelector("#note-detail-body");
const mobTabbar       = document.querySelector("#mob-tabbar");

const scriptureSheet     = document.querySelector("#scripture-sheet");
const sheetRefLabel      = document.querySelector("#sheet-ref-label");
const sheetVerseContent  = document.querySelector("#sheet-verse-content");
const sheetTranslationLabel = document.querySelector("#sheet-translation-label");
const sheetGotoBtn       = document.querySelector("#sheet-goto-btn");

const settingsSheet        = document.querySelector("#settings-sheet");
const settingsSheetContent = document.querySelector("#settings-sheet-content");
const mobSettingsCloseBtn  = document.querySelector("#mob-settings-close-btn");

// Conflict-resolution elements (hidden; auto-resolved below)
const syncConflictDialog       = document.querySelector("#sync-conflict-dialog");
const conflictDialogTitle      = document.querySelector("#conflict-dialog-title");
const conflictDialogDescription = document.querySelector("#conflict-dialog-description");
const conflictLocalTime        = document.querySelector("#conflict-local-time");
const conflictRemoteTime       = document.querySelector("#conflict-remote-time");
const conflictKeepLocalButton  = document.querySelector("#conflict-keep-local-button");
const conflictUseCloudButton   = document.querySelector("#conflict-use-cloud-button");
const firstSyncKeepLocalButton = document.querySelector("#first-sync-keep-local-button");
const firstSyncUseCloudButton  = document.querySelector("#first-sync-use-cloud-button");
const firstSyncCancelButton    = document.querySelector("#first-sync-cancel-button");

// Dummy elements for module compatibility
const noteMetaFields = document.querySelector("#note-meta-fields");
const noteEditor     = document.querySelector("#note-editor");
const dummyPaneGrid  = document.createElement("div");
dummyPaneGrid.className = "pane-grid";

// ── Late-bound module references ──────────────────────────────────────────────
let syncStatusApi            = null;
let syncPayloadApi           = null;
let syncCloudApi             = null;
let translationsManagerApiRef = null;
let scriptureSearchApiRef    = null;
let viewerApi                = null;
let aliasesApi               = null;
let referencesApi            = null;
let themeApi                 = null;

// Functions populated after module creation (same late-binding pattern as app.js)
let getNoteDisplayTitle  = () => "";
let getNoteDisplayMeta   = () => "";
let getNoteTypeById;
let getActiveNote;
let formatNoteDate;
let buildMetadataForType;
let getSuggestedCardTitleFieldId;
let getDefaultCardSubtitleFieldId;
let createDefaultNoteType;
let createEmptyNote;
let touchNote;
let createMetadataField;
let ensureSelectedTypeForManager;
let applyThemeMode;
let applyColorTheme;
let applyTranslation;
let getPreferredTranslation;
let restoreLastBookChapter;
let buildBookAliasMap;
let populateTranslationSelect;
let initializeTranslations;
let updateInstalledTranslationsInBackground;
let refreshOfflineTranslationAvailability;
let parseScriptureReference;
let formatResolvedReference;

// Thunk wrappers — safe to call before modules are created (no-ops until wired)
const persistCloudSyncSettings = (...a) => syncCloudApi?.persistCloudSyncSettings(...a);
const markLocalSettingsUpdated  = () => {};          // Mobile is read-only; suppress outgoing sync
const scheduleAutoCloudSync     = () => {};          // No writes from mobile
const reconnectCloud            = (...a) => syncCloudApi?.reconnectCloud(...a);
const connectCloud              = (...a) => syncCloudApi?.connectCloud(...a);
const disconnectCloud           = (...a) => syncCloudApi?.disconnectCloud(...a);
const pullFromCloud             = (...a) => syncCloudApi?.pullFromCloud(...a);
const startCloudPolling         = (...a) => syncCloudApi?.startCloudPolling(...a);
const stopCloudPolling          = (...a) => syncCloudApi?.stopCloudPolling(...a);
const buildProviderStatusLabel  = (...a) => syncStatusApi?.buildProviderStatusLabel(...a);
const getActiveProviderSettings = (...a) => syncStatusApi?.getActiveProviderSettings(...a);
const buildCloudSyncPayload     = (...a) => syncPayloadApi?.buildCloudSyncPayload(...a);
const applyCloudPayload         = (...a) => syncPayloadApi?.applyCloudPayload(...a);
const refreshSaveStatus         = () => {};          // No save-status bar on mobile

// Mobile is always read-only — workspace writes are suppressed
const persistWorkspace = () => {};

// ── Status bar helper ─────────────────────────────────────────────────────────
const updateSyncBar = () => {
  if (mobileState.isCloudConnected) {
    const providerName = activeProvider.displayName ?? "cloud";
    const when = cloudSyncSettings.lastSyncAt
      ? new Date(cloudSyncSettings.lastSyncAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : null;
    mobSyncBarText.textContent = when
      ? `Synced with ${providerName} · ${when}`
      : `Connected to ${providerName}`;
    mobSyncBarEl.className = "mob-sync-bar mob-sync-bar--connected";
    mobSyncBarEl.hidden = false;
  } else if (cloudSyncSettings.provider !== "none") {
    mobSyncBarText.textContent = "Cloud not connected — showing local data";
    mobSyncBarEl.className = "mob-sync-bar mob-sync-bar--error";
    mobSyncBarEl.hidden = false;
  } else {
    mobSyncBarEl.hidden = true;
  }
};

// Temporary status message (4 s auto-dismiss)
const showTransientStatus = (msg) => {
  mobSyncBarText.textContent = msg;
  mobSyncBarEl.className = "mob-sync-bar mob-sync-bar--connected";
  mobSyncBarEl.hidden = false;
  clearTimeout(showTransientStatus._timer);
  showTransientStatus._timer = setTimeout(() => updateSyncBar(), 4000);
};
showTransientStatus._timer = null;

// updateSaveStatus is called by some modules; route to showTransientStatus
const updateSaveStatus = (msg) => {
  if (typeof msg === "string") showTransientStatus(msg);
};

// Workspace logic — normalizeCloudSyncSettings, ensureWorkspaceConsistency,
// migrateFromLegacyDatabase, migrateLegacyNotes, and restoreWorkspace are all
// provided by core/workspace.js (wired up in bootstrap below).

// ── Mobile UI ─────────────────────────────────────────────────────────────────

/**
 * Set the active view and update header / tab bar accordingly.
 * For landscape split-view the CSS handles showing both panes simultaneously
 * when #mob-app has .note-detail-mode; JS just needs to populate them.
 */
const setView = (view) => {
  mobileState.currentView = view;

  const inNoteDetail = view === "notes" && mobileState.noteDetailId !== null;

  bibleView.classList.toggle("active",       view === "bible");
  notesView.classList.toggle("active",       view === "notes" && !inNoteDetail);
  noteDetailView.classList.toggle("active",  inNoteDetail);

  // Landscape split-view class
  mobApp.classList.toggle("note-detail-mode", inNoteDetail);

  // Tab bar highlight (hide active indicator when inside note detail on portrait)
  document.querySelectorAll(".mob-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === view && !inNoteDetail);
  });

  // Header
  mobBackBtn.hidden = !inNoteDetail;
  mobTitle.textContent = view === "bible" ? "Scriptoria" : "Entries";
};

const renderMobileApp = () => {
  setView(mobileState.currentView);
  if (mobileState.currentView === "notes") {
    if (mobileState.noteDetailId) {
      renderNoteDetail(mobileState.noteDetailId);
    } else {
      renderNotesView();
    }
  }
  updateSyncBar();
};

// ── Notes list ────────────────────────────────────────────────────────────────
const renderNotesView = () => {
  const providerSet = cloudSyncSettings.provider !== "none";

  if (!providerSet && !mobileState.isCloudConnected) {
    // Prompt to connect
    notesView.innerHTML = `
      <div class="mob-connect-hero">
        <div class="mob-connect-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
          </svg>
        </div>
        <h2 class="mob-connect-title">Browse your notes</h2>
        <p class="mob-connect-desc">Connect a cloud provider to read the entries you've written in the desktop app.</p>
        <button class="mob-connect-btn" id="mob-gdrive-connect">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Connect Google Drive
        </button>
        <button class="mob-connect-btn" id="mob-onedrive-connect">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Connect OneDrive
        </button>
      </div>
    `;

    document.querySelector("#mob-gdrive-connect")?.addEventListener("click", () => initiateCloudConnect("google-drive"));
    document.querySelector("#mob-onedrive-connect")?.addEventListener("click", () => initiateCloudConnect("onedrive"));
    return;
  }

  // Render notes list
  const filter = mobileState.notesFilter.toLowerCase();
  const sorted = [...workspace.notes]
    .filter((note) => {
      if (!filter) return true;
      const title   = getNoteDisplayTitle(note).toLowerCase();
      const meta    = getNoteDisplayMeta(note).toLowerCase();
      const content = note.content.replace(/<[^>]+>/g, " ").toLowerCase();
      return title.includes(filter) || meta.includes(filter) || content.includes(filter);
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  notesView.innerHTML = `
    <div class="mob-notes-filter-bar">
      <input type="search" class="mob-filter-input" id="mob-notes-filter"
             placeholder="Filter entries…" autocomplete="off"
             value="${escapeHtml(mobileState.notesFilter)}">
    </div>
    <div class="mob-notes-list" id="mob-notes-list" role="list">
      ${sorted.length
        ? sorted.map((note) => {
            const type  = getNoteTypeById(note.typeId);
            const title = getNoteDisplayTitle(note);
            const meta  = getNoteDisplayMeta(note);
            return `
              <button class="mob-note-card" data-note-id="${escapeHtml(note.id)}" role="listitem">
                <div class="mob-note-card-inner">
                  <span class="mob-note-type-chip">${escapeHtml(type?.name ?? "Note")}</span>
                  <p class="mob-note-title">${escapeHtml(title)}</p>
                  ${meta ? `<p class="mob-note-meta">${escapeHtml(meta)}</p>` : ""}
                  <p class="mob-note-date">${escapeHtml(formatNoteDate(note.updatedAt))}</p>
                </div>
                <svg class="mob-note-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            `;
          }).join("")
        : `<p class="mob-notes-empty">No entries found.</p>`}
    </div>
  `;

  document.querySelector("#mob-notes-filter")?.addEventListener("input", (e) => {
    mobileState.notesFilter = e.target.value;
    renderNotesView();
  });

  document.querySelector("#mob-notes-list")?.addEventListener("click", (e) => {
    const card = e.target.closest("[data-note-id]");
    if (card) navigateToNote(card.dataset.noteId);
  });
};

// ── Note detail ───────────────────────────────────────────────────────────────
const renderNoteDetail = (noteId) => {
  const note = workspace.notes.find((n) => n.id === noteId);
  if (!note) {
    mobileState.noteDetailId = null;
    renderNotesView();
    setView("notes");
    return;
  }

  const type  = getNoteTypeById(note.typeId);
  const title = getNoteDisplayTitle(note);

  // Metadata chips — skip the field already shown as the title to avoid duplication
  const chips = type.fields
    .map((f) => {
      if (f.id === type.cardTitleFieldId) return "";
      const v = note.metadata[f.id]?.trim();
      return v ? `<span class="mob-detail-chip">${escapeHtml(f.label)}: ${escapeHtml(v)}</span>` : "";
    })
    .filter(Boolean)
    .join("");

  noteDetailHeader.innerHTML = `
    <p class="mob-detail-type">${escapeHtml(type?.name ?? "Note")}</p>
    <p class="mob-detail-title">${escapeHtml(title)}</p>
    ${chips ? `<div class="mob-detail-chips">${chips}</div>` : ""}
    <p class="mob-detail-date">Updated ${escapeHtml(formatNoteDate(note.updatedAt))}</p>
  `;

  // Build read-only content container
  const contentEl = document.createElement("div");
  contentEl.className = "mob-note-content";
  contentEl.innerHTML = note.content || `<p class="mob-note-empty">This entry has no content.</p>`;

  // Make scripture-link anchors tappable.
  // The desktop editor saves these as <a class="scripture-link" data-scripture-ref="John 3:16">.
  contentEl.querySelectorAll("a[data-scripture-ref], a.scripture-link").forEach((link) => {
    const ref = link.dataset.scriptureRef ?? link.textContent.trim();
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showScriptureSheet(ref);
    });
  });

  // Block all other links from navigating away
  contentEl.querySelectorAll("a:not([data-scripture-ref]):not(.scripture-link)").forEach((link) => {
    link.addEventListener("click", (e) => e.preventDefault());
  });

  // Scan text nodes and linkify any un-linked scripture references
  linkifyPlainScriptureRefs(contentEl);

  noteDetailBody.innerHTML = "";
  noteDetailBody.appendChild(contentEl);
};

/**
 * Walk text nodes inside `container` and wrap any scripture references
 * that aren't already inside an <a> element.
 */
const linkifyPlainScriptureRefs = (container) => {
  const pattern = aliasesApi?.getFullExplicitPattern?.();
  if (!pattern) return;

  const re = new RegExp(pattern.source, "gi");
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => node.parentElement.closest("a") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
  });

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  textNodes.forEach((textNode) => {
    const text = textNode.textContent;
    const matches = [...text.matchAll(re)];
    if (!matches.length) return;

    const frag = document.createDocumentFragment();
    let last = 0;
    matches.forEach((m) => {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const a = document.createElement("a");
      a.href = "#";
      a.className = "mob-scripture-ref";
      a.textContent = m[0];
      a.addEventListener("click", (e) => { e.preventDefault(); showScriptureSheet(m[0]); });
      frag.appendChild(a);
      last = m.index + m[0].length;
    });
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    textNode.parentNode.replaceChild(frag, textNode);
  });
};

// ── Navigation ────────────────────────────────────────────────────────────────
const navigateToNote = (noteId) => {
  mobileState.noteDetailId = noteId;
  setView("notes");
  renderNoteDetail(noteId);
  // Push a history entry so the back button works
  window.history.pushState({ view: "notes", noteId }, "");
};

const navigateBack = () => {
  if (mobileState.noteDetailId !== null) {
    mobileState.noteDetailId = null;
    setView("notes");
    renderNotesView();
  } else {
    setView("bible");
  }
};

window.addEventListener("popstate", (e) => {
  if (e.state?.noteId) {
    mobileState.noteDetailId = e.state.noteId;
    setView("notes");
    renderNoteDetail(e.state.noteId);
  } else {
    mobileState.noteDetailId = null;
    setView(mobileState.currentView);
    if (mobileState.currentView === "notes") renderNotesView();
  }
});

// ── Scripture bottom sheet ────────────────────────────────────────────────────
let sheetCurrentRef = null;

const showScriptureSheet = (referenceText) => {
  sheetCurrentRef = referenceText;

  if (!parseScriptureReference || !viewerApi) {
    sheetRefLabel.textContent = referenceText;
    sheetVerseContent.innerHTML = "<p>Translation not ready — open the Bible tab first.</p>";
    sheetTranslationLabel.textContent = "";
    scriptureSheet.hidden = false;
    return;
  }

  const resolved    = parseScriptureReference(referenceText);
  const translation = viewerApi.getCurrentTranslation?.();
  const library     = viewerApi.getCurrentScriptureLibrary?.();

  if (!resolved || !library) {
    sheetRefLabel.textContent = referenceText;
    sheetVerseContent.innerHTML = "<p>Reference not found in current translation.</p>";
    sheetTranslationLabel.textContent = translation?.label ?? "";
    scriptureSheet.hidden = false;
    return;
  }

  // library[book] is an array of chapter objects: { chapter: N, verses: [{verse, text, html, coversVerses}] }
  // resolved has: { book, chapter, firstVerse, chapterHighlights: Map<chapterNum, Set<verseNums>> }
  const chapterArray = library[resolved.book];
  const chapterObj   = chapterArray?.find((c) => c.chapter === resolved.chapter);

  if (!chapterArray || !chapterObj) {
    sheetRefLabel.textContent = referenceText;
    sheetVerseContent.innerHTML = `<p>${escapeHtml(resolved.book)} ${resolved.chapter} not found in this translation.</p>`;
    sheetTranslationLabel.textContent = translation?.label ?? "";
    scriptureSheet.hidden = false;
    return;
  }

  // The set of verse numbers we want to show for this chapter
  const verseSet = resolved.chapterHighlights.get(resolved.chapter) ?? new Set();
  const isWholeChapter = verseSet.size === 0;

  // Collect verse rows, deduplicating rows that cover multiple verse numbers
  const seenRows = new Set();
  const rows = [];

  if (isWholeChapter) {
    // Whole-chapter reference — show first 5 verse rows
    for (const row of chapterObj.verses.slice(0, 5)) {
      rows.push(row);
    }
  } else {
    // Show rows that cover any of the highlighted verse numbers, in order
    for (const verseNum of [...verseSet].sort((a, b) => a - b)) {
      const row = chapterObj.verses.find((v) =>
        v.verse === verseNum ||
        (Array.isArray(v.coversVerses) && v.coversVerses.includes(verseNum))
      );
      if (row && !seenRows.has(row)) {
        seenRows.add(row);
        rows.push(row);
      }
    }
  }

  sheetRefLabel.textContent = referenceText;

  if (rows.length) {
    sheetVerseContent.innerHTML = rows.map((row) => {
      // Build a verse label: "16" or "16–17" for combined rows
      const covers = Array.isArray(row.coversVerses) && row.coversVerses.length > 1
        ? row.coversVerses : null;
      const label = covers
        ? `${covers[0]}–${covers[covers.length - 1]}`
        : String(row.verse);

      // Prefer plain text; strip HTML tags if only html is available
      const text = typeof row.text === "string" && row.text
        ? row.text
        : (typeof row.html === "string" ? row.html.replace(/<[^>]+>/g, " ").trim() : "");

      return `<div class="mob-sheet-verse">
        <span class="mob-sheet-vnum">${escapeHtml(label)}</span>
        <span class="mob-sheet-vtext">${escapeHtml(text)}</span>
      </div>`;
    }).join("") + (isWholeChapter
      ? `<p class="mob-sheet-more">Showing first 5 verses — tap "View in Bible reader" for the full chapter.</p>`
      : "");
  } else {
    sheetVerseContent.innerHTML = "<p>Verses not found in this translation.</p>";
  }

  sheetTranslationLabel.textContent = translation?.label ?? "";
  scriptureSheet.hidden = false;
};

const hideScriptureSheet = () => {
  scriptureSheet.hidden = true;
  sheetCurrentRef = null;
};

sheetGotoBtn?.addEventListener("click", () => {
  if (sheetCurrentRef && viewerApi?.jumpToResolvedScripture && parseScriptureReference) {
    const resolved = parseScriptureReference(sheetCurrentRef);
    if (resolved) viewerApi.jumpToResolvedScripture(resolved);
  }
  hideScriptureSheet();
  mobileState.noteDetailId = null;
  setView("bible");
});

scriptureSheet?.addEventListener("click", (e) => {
  if (e.target === scriptureSheet) hideScriptureSheet();
});

// ── Settings sheet ────────────────────────────────────────────────────────────
const renderSettingsSheet = () => {
  const providerName      = mobileState.isCloudConnected ? (activeProvider.displayName ?? "cloud") : null;
  const modeVal           = themeApi?.getCurrentThemeMode?.() ?? "system";
  const currentColorTheme = themeApi?.getCurrentColorThemeId?.() ?? "default";
  const allThemes         = window.colorThemes || [];
  const getThemeSupportMode = (supportsValue) => {
    if (supportsValue === "dark") return "dark";
    if (supportsValue === "both") return "both";
    return "light";
  };
  const themeSupportMeta = {
    light: { label: "light mode only", badge: "L" },
    dark: { label: "dark mode only", badge: "D" },
    both: { label: "light and dark mode", badge: "L/D" }
  };
  const modeButtons = THEME_MODE_OPTIONS.map(({ value, label }) => `
    <button
      type="button"
      class="mob-theme-toggle"
      data-theme-mode="${value}"
      aria-pressed="${modeVal === value}">
      ${label}
    </button>
  `).join("");

  // Build swatch grid — two-tone circles using the first two swatches of each theme
  const swatchGrid = allThemes.map((theme) => {
    const c0 = theme.swatches?.[0] ?? "#ccc";
    const c1 = theme.swatches?.[1] ?? "#888";
    const isActive = theme.id === currentColorTheme;
    const supports = getThemeSupportMode(theme.supports);
    const supportLabel = themeSupportMeta[supports].label;
    const supportBadge = themeSupportMeta[supports].badge;
    return `<button class="mob-color-swatch mob-color-swatch--${supports}${isActive ? " active" : ""}"
              data-color-theme="${escapeHtml(theme.id)}"
              aria-label="${escapeHtml(`${theme.name} (${supportLabel})`)}"
              aria-pressed="${isActive}"
              style="background: linear-gradient(135deg, ${c0} 50%, ${c1} 50%)"
              title="${escapeHtml(`${theme.name} — ${supportLabel}`)}">
              <span class="mob-color-swatch-mode" aria-hidden="true">${supportBadge}</span>
            </button>`;
  }).join("");

  settingsSheetContent.innerHTML = `
    <div class="mob-settings-section">
      <p class="mob-settings-label">Appearance</p>
      <div class="mob-theme-toggle-group" id="mob-theme-toggle-group" role="group" aria-label="Theme mode selection">
        ${modeButtons}
      </div>
      <p class="mob-settings-label mob-settings-label--spaced" id="mob-color-theme-label">Color theme</p>
      <div class="mob-color-theme-grid" id="mob-color-theme-grid" aria-labelledby="mob-color-theme-label">${swatchGrid}</div>
    </div>
    <div class="mob-settings-section">
      <p class="mob-settings-label">Translations</p>
      <p class="mob-settings-label mob-settings-label--spaced">Installed</p>
      <p class="mob-settings-help" id="installed-translations-empty-note" hidden>No translations installed.</p>
      <div class="mob-settings-list-scroll">
        <ul id="installed-translation-list" class="mob-settings-list" aria-label="Installed translations"></ul>
      </div>
      <details class="mob-settings-disclosure" id="mob-translation-adder">
        <summary>Add translation</summary>
        <p class="mob-settings-help">Search and install from the catalog.</p>
        <input id="mob-translation-search" class="mob-settings-search" type="search" placeholder="Search available translations" aria-label="Search available translations" autocomplete="off">
        <div id="translation-language-pills" class="mob-language-pill-wrap"></div>
        <p class="mob-settings-label mob-settings-label--spaced">Available</p>
        <p class="mob-settings-help" id="available-translations-empty-note" hidden>No translations found for this filter.</p>
        <div class="mob-settings-list-scroll mob-settings-list-scroll--available">
          <ul id="available-translation-list" class="mob-settings-list" aria-label="Available translations"></ul>
        </div>
      </details>
    </div>
    <div class="mob-settings-section">
      <p class="mob-settings-label">Sync &amp; Storage</p>
      ${providerName ? `
        <div class="mob-settings-row">
          <span>Provider</span>
          <span class="mob-settings-value">${escapeHtml(providerName)}</span>
        </div>
        ${cloudSyncSettings.connectedEmail ? `
          <div class="mob-settings-row">
            <span>Account</span>
            <span class="mob-settings-value">${escapeHtml(cloudSyncSettings.connectedEmail)}</span>
          </div>` : ""}
        <div class="mob-settings-row">
          <span>Last sync</span>
          <span class="mob-settings-value">${escapeHtml(formatSyncTimestamp(cloudSyncSettings.lastSyncAt))}</span>
        </div>
        <button class="mob-settings-action" id="mob-sync-now">Sync now</button>
        <button class="mob-settings-action mob-settings-action--danger" id="mob-disconnect">Disconnect</button>
      ` : `
        <p class="mob-settings-help">Connect a provider to browse your notes.</p>
        <button class="mob-settings-action" id="mob-connect-gdrive-settings">Connect Google Drive</button>
        <button class="mob-settings-action" id="mob-connect-onedrive-settings">Connect OneDrive</button>
      `}
    </div>
    <div class="mob-settings-section">
      <p class="mob-settings-label">Full editor</p>
      <p class="mob-settings-help">The Scriptoria editor and all settings are available on desktop browsers.</p>
      <a href="index.html?desktop=1" class="mob-settings-action">Open desktop version →</a>
    </div>
  `;

  document.querySelector("#mob-theme-toggle-group")?.addEventListener("click", (e) => {
    const button = e.target.closest("[data-theme-mode]");
    if (!button) return;
    const selectedMode = button.dataset.themeMode;
    applyThemeMode?.(selectedMode);
    document.querySelectorAll("#mob-theme-toggle-group .mob-theme-toggle").forEach((toggle) => {
      toggle.setAttribute("aria-pressed", String(toggle.dataset.themeMode === selectedMode));
    });
  });

  document.querySelector("#mob-color-theme-grid")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-color-theme]");
    if (!btn) return;
    applyColorTheme?.(btn.dataset.colorTheme);
    // Update active state without re-rendering the whole sheet
    document.querySelectorAll(".mob-color-swatch").forEach((s) => {
      const isNowActive = s.dataset.colorTheme === btn.dataset.colorTheme;
      s.classList.toggle("active", isNowActive);
      s.setAttribute("aria-pressed", isNowActive);
    });
  });

  document.querySelector("#mob-translation-search")?.addEventListener("input", (event) => {
    translationsManagerApiRef?.setAvailableTranslationSearch?.(event.target.value);
  });

  document.querySelector("#available-translation-list")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-install-official-translation]");
    if (!button) return;
    if (!translationsManagerApiRef?.installOfficialTranslation) return;

    const translationId = button.dataset.installOfficialTranslation;
    const label = translationLibrary[translationId]?.label ?? translationId;
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Installing…";

    void translationsManagerApiRef.installOfficialTranslation(translationId).then(() => {
      showTransientStatus(`"${label}" installed.`);
    }).catch((err) => {
      button.disabled = false;
      button.textContent = originalLabel;
      window.alert(`Couldn't install translation: ${err.message}`);
    });
  });

  document.querySelector("#installed-translation-list")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-uninstall-translation]");
    if (!button) return;
    if (!translationsManagerApiRef?.uninstallTranslation) return;

    const translationId = button.dataset.uninstallTranslation;
    const label = translationLibrary[translationId]?.label ?? translationId;

    if (!window.confirm(`Uninstall "${label}"? You can reinstall it from Available.`)) {
      return;
    }

    void translationsManagerApiRef.uninstallTranslation(translationId).catch((err) => {
      window.alert(`Couldn't uninstall translation: ${err.message}`);
    });
  });

  if (translationsManagerApiRef?.renderTranslationsPanel) {
    void translationsManagerApiRef.renderTranslationsPanel().catch((err) => {
      console.warn("[Mobile] Failed to render translations panel:", err);
    });
  }

  document.querySelector("#mob-sync-now")?.addEventListener("click", async () => {
    showTransientStatus("Syncing…");
    try {
      await pullFromCloud();
      renderMobileApp();
    } catch (err) {
      showTransientStatus("Sync failed — check your connection.");
    }
  });

  document.querySelector("#mob-disconnect")?.addEventListener("click", () => {
    disconnectCloud();
    mobileState.isCloudConnected = false;
    updateSyncBar();
    settingsSheet.hidden = true;
    renderNotesView();
    renderSettingsSheet();
  });

  document.querySelector("#mob-connect-gdrive-settings")?.addEventListener("click", () => {
    settingsSheet.hidden = true;
    initiateCloudConnect("google-drive");
  });

  document.querySelector("#mob-connect-onedrive-settings")?.addEventListener("click", () => {
    settingsSheet.hidden = true;
    initiateCloudConnect("onedrive");
  });
};

settingsSheet?.addEventListener("click", (e) => {
  if (e.target === settingsSheet) settingsSheet.hidden = true;
});

mobSettingsCloseBtn?.addEventListener("click", () => {
  settingsSheet.hidden = true;
});

mobSettingsBtn?.addEventListener("click", () => {
  renderSettingsSheet();
  settingsSheet.hidden = false;
});

// ── Cloud connect helper ──────────────────────────────────────────────────────
const initiateCloudConnect = async (providerId) => {
  cloudSyncSettings.provider = providerId;
  activeProvider = providerRegistry[providerId] ?? window.NoOpProvider;
  await persistCloudSyncSettings();

  activeProvider.waitForReady(async () => {
    try {
      await connectCloud();
      mobileState.isCloudConnected = activeProvider.hasActiveSession();
      updateSyncBar();

      if (mobileState.isCloudConnected) {
        showTransientStatus("Connected — pulling your notes…");
        await pullFromCloud();
      }
    } catch (err) {
      console.error("[Mobile] Connect failed:", err);
      // Reset provider back to "none" so the connect prompt reappears instead
      // of showing the notes list (which would hide the connect buttons).
      cloudSyncSettings.provider = "none";
      activeProvider = window.NoOpProvider;
      await persistCloudSyncSettings();
      showTransientStatus("Connection failed — please try again.");
    }

    renderMobileApp();
  });
};

// ── Tab bar ───────────────────────────────────────────────────────────────────
mobTabbar?.addEventListener("click", (e) => {
  const tab = e.target.closest("[data-tab]");
  if (!tab) return;
  mobileState.noteDetailId = null;
  setView(tab.dataset.tab);
  if (tab.dataset.tab === "notes") renderNotesView();
});

mobBackBtn?.addEventListener("click", () => navigateBack());

// ── Auto-resolve sync conflicts to "use cloud" on mobile ─────────────────────
// Mobile is read-only. Whenever the sync module would show a conflict dialog,
// we silently choose the cloud version instead.
if (syncConflictDialog) {
  const origShowModal = syncConflictDialog.showModal?.bind(syncConflictDialog);
  if (typeof origShowModal === "function") {
    syncConflictDialog.showModal = () => {
      // Determine which path: first-sync vs. ongoing conflict
      const firstSyncVisible = document.querySelector("#first-sync-actions")?.style.display !== "none"
        ?? true;  // default to first-sync path if unsure
      if (firstSyncVisible && firstSyncUseCloudButton) {
        firstSyncUseCloudButton.click();
      } else if (conflictUseCloudButton) {
        conflictUseCloudButton.click();
      }
    };
  }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const bootstrap = async () => {
  // Create workspace API first so migrateFromLegacyDatabase can run immediately.
  // All notes-model deps are forwarded via thunks that resolve to the let
  // bindings populated after the modules are created below.
  const workspaceApi = window.ScriptoriaModules.createWorkspace({
    workspace,
    workspaceStorageKey,
    notesStorageKey,
    legacyNotesStorageKey,
    createId,
    createDefaultNoteType:        () => createDefaultNoteType(),
    createEmptyNote:              (...a) => createEmptyNote(...a),
    buildMetadataForType:         (...a) => buildMetadataForType(...a),
    getNoteTypeById:              (...a) => getNoteTypeById(...a),
    getActiveNote:                () => getActiveNote(),
    getSuggestedCardTitleFieldId: (...a) => getSuggestedCardTitleFieldId(...a),
    getDefaultCardSubtitleFieldId: (...a) => getDefaultCardSubtitleFieldId(...a),
    ensureSelectedTypeForManager: () => ensureSelectedTypeForManager?.(),
    readStoredValue,
    migrateLegacyPreference,
    openDatabase,
    buildBookAliasMap:  () => buildBookAliasMap?.(),
    renderWorkspace:    () => renderMobileApp(),
    persistWorkspace:   () => {},   // read-only on mobile
    updateSaveStatus,
    refreshSaveStatus:  () => {}    // no save-status bar on mobile
  });

  const {
    normalizeCloudSyncSettings,
    ensureWorkspaceConsistency,
    migrateFromLegacyDatabase,
    restoreWorkspace
  } = workspaceApi;

  await migrateFromLegacyDatabase();

  // ── Theme controller ──────────────────────────────────────────────────────
  const colorThemes = window.colorThemes || [];

  themeApi = window.ScriptoriaModules.createThemeController({
    documentObject: document,
    windowObject: window,
    colorThemes,
    readStoredValue,
    writeStoredValue,
    migrateLegacyPreference,
    readMirroredPreference,
    writeMirroredPreference,
    themeStorageKey,
    themeMirrorStorageKey,
    colorThemeStorageKey,
    colorThemeMirrorStorageKey,
    markLocalSettingsUpdated: () => {},
    scheduleAutoCloudSync:    () => {},
    isSettingsOpen:    () => !settingsSheet.hidden,
    renderSettings:    () => {}
  });

  applyThemeMode  = themeApi.applyThemeMode;
  applyColorTheme = themeApi.applyColorTheme;

  // ── Notes model ───────────────────────────────────────────────────────────
  const notesModel = window.ScriptoriaModules.createNotesModel({
    workspace,
    createId,
    normalizeFieldLabel,
    noteMetaFields,
    noteEditor,
    persistWorkspace: () => {},   // Read-only on mobile
    refreshSaveStatus: () => {},
    flushEditorWorkNow: () => {},
    saveActiveNote: () => {},
    windowObject: window,
    renderWorkspace: () => renderMobileApp(),
    getNoteDisplayTitle: (note) => getNoteDisplayTitle(note)
  });

  createDefaultNoteType      = notesModel.createDefaultNoteType;
  createEmptyNote            = notesModel.createEmptyNote;
  formatNoteDate             = notesModel.formatNoteDate;
  getNoteTypeById            = notesModel.getNoteTypeById;
  getActiveNote              = notesModel.getActiveNote;
  buildMetadataForType       = notesModel.buildMetadataForType;
  getSuggestedCardTitleFieldId  = notesModel.getSuggestedCardTitleFieldId;
  getDefaultCardSubtitleFieldId = notesModel.getDefaultCardSubtitleFieldId;
  touchNote                  = notesModel.touchNote;
  createMetadataField        = notesModel.createMetadataField;

  // ── Settings note-types (needed for ensureSelectedTypeForManager) ─────────
  const settingsNoteTypes = window.ScriptoriaModules.createSettingsNoteTypes({
    workspace,
    createId,
    createMetadataField,
    buildMetadataForType,
    getSuggestedCardTitleFieldId,
    getDefaultCardSubtitleFieldId,
    touchNote,
    persistWorkspace: () => {},
    renderWorkspace:  () => renderMobileApp(),
    refreshSaveStatus: () => {},
    buildBookAliasMap: () => buildBookAliasMap?.(),
    getSelectedCardTitleFieldId:    () => "",
    getSelectedCardSubtitleFieldId: () => "",
    windowObject: window
  });

  ensureSelectedTypeForManager = settingsNoteTypes.ensureSelectedTypeForManager;

  // ── Note display helpers — delegate to notes/display.js ──────────────────
  const displayApi = window.ScriptoriaModules.createNotesDisplay({
    getNoteTypeById: (...a) => getNoteTypeById(...a),
    formatNoteDate:  (...a) => formatNoteDate(...a)
  });
  getNoteDisplayTitle = displayApi.getNoteDisplayTitle;
  getNoteDisplayMeta  = displayApi.getNoteDisplayMeta;

  // ── Translations manager ──────────────────────────────────────────────────
  let viewerApiRef = null;   // late-bound after viewer is created

  const translationsManager = window.ScriptoriaModules.createTranslationsManager({
    translationLibrary,
    readStoredValue,
    writeStoredValue,
    deleteStoredValue,
    translationRegistryStorageKey,
    translationStorageKey,
    translationSelect,
    getCurrentTranslationCode: () => viewerApiRef?.getCurrentTranslationCode?.() ?? "en:KJV",
    applyTranslation: (...args) => viewerApiRef?.applyTranslation?.(...args),
    openOfficialTranslationsSettings: () => {
      renderSettingsSheet();
      settingsSheet.hidden = false;
    }
  });

  translationsManagerApiRef                = translationsManager;
  initializeTranslations                   = translationsManager.initializeTranslations;
  updateInstalledTranslationsInBackground  = translationsManager.updateInstalledTranslationsInBackground;
  refreshOfflineTranslationAvailability    = translationsManager.refreshOfflineTranslationAvailability;
  populateTranslationSelect                = translationsManager.populateTranslationSelect;

  // ── Scripture aliases ─────────────────────────────────────────────────────
  aliasesApi = window.ScriptoriaModules.createScriptureAliases({
    workspace,
    escapeRegExp,
    getCurrentTranslation: () => viewerApiRef?.getCurrentTranslation?.()
  });
  buildBookAliasMap = () => aliasesApi.buildBookAliasMap();

  // ── Scripture references ──────────────────────────────────────────────────
  referencesApi = window.ScriptoriaModules.createScriptureReferences({
    bookAliasMap:          aliasesApi.bookAliasMap,
    normalizeBookName:     aliasesApi.normalizeBookName,
    getFullExplicitPattern: () => aliasesApi.getFullExplicitPattern(),
    getCurrentScriptureLibrary: () => viewerApiRef?.getCurrentScriptureLibrary?.()
  });

  parseScriptureReference = referencesApi.parseScriptureReference;
  formatResolvedReference = referencesApi.formatResolvedReference;

  // ── Scripture viewer ──────────────────────────────────────────────────────
  viewerApi = window.ScriptoriaModules.createScriptureViewer({
    bookSelect,
    chapterSelect,
    chapterText,
    verseReference,
    verseTranslation,
    translationSelect,
    verseDisplay,
    translationLibrary,
    readStoredValue,
    writeStoredValue,
    migrateLegacyPreference,
    lastBookChapterStorageKey,
    translationStorageKey,
    ensureTranslationLoaded: (...args) => translationsManagerApiRef.ensureTranslationLoaded(...args),
    isTranslationOfflineAvailable: (code) => !!translationsManagerApiRef?.offlineAvailableTranslations?.has(code),
    handleTranslationSelection: (...args) => translationsManagerApiRef.handleTranslationSelection(...args),
    getFallbackTranslationId: () => translationsManagerApiRef?.getDefaultTranslationId?.() ?? "en:KJV",
    buildBookAliasMap:    () => aliasesApi.buildBookAliasMap(),
    performScriptureSearch: (q) => scriptureSearchApiRef?.performScriptureSearch?.(q),
    getScriptureSearchQuery: () => scriptureSearchApiRef?.getQuery?.() ?? "",
    markLocalSettingsUpdated: () => {},
    scheduleAutoCloudSync:    () => {}
  });

  viewerApiRef       = viewerApi;
  applyTranslation   = viewerApi.applyTranslation;
  getPreferredTranslation = viewerApi.getPreferredTranslation;
  restoreLastBookChapter  = viewerApi.restoreLastBookChapter;

  // ── Scripture search ──────────────────────────────────────────────────────
  const searchApi = window.ScriptoriaModules.createScriptureSearch({
    scriptureSearchInput,
    scriptureSearchResults,
    verseDisplay,
    getCurrentScriptureLibrary: () => viewerApi.getCurrentScriptureLibrary(),
    navigateToVerse: (book, chapter, verse) => viewerApi.navigateToVerse(book, chapter, verse),
    escapeRegExp,
    debounce
  });
  scriptureSearchApiRef = searchApi;

  // ── Sync status ───────────────────────────────────────────────────────────
  syncStatusApi = window.ScriptoriaModules.createSyncStatus({
    cloudSyncSettings,
    getActiveProvider: () => activeProvider,
    getActiveNote,
    updateSaveStatus
  });

  // ── Sync payloads ─────────────────────────────────────────────────────────
  syncPayloadApi = window.ScriptoriaModules.createSyncPayloads({
    workspace,
    cloudSyncSettings,
    paneGrid: dummyPaneGrid,
    getCurrentThemeMode:      () => themeApi.getCurrentThemeMode(),
    getCurrentPaneSplit:      () => 50,   // not used on mobile
    getCurrentTranslationCode: () => viewerApi.getCurrentTranslationCode(),
    getCurrentColorThemeId:   () => themeApi.getCurrentColorThemeId(),
    getTranslationStateForSync: () => translationsManagerApiRef?.getTranslationStateForSync?.() ?? { installedOfficialIds: [] },
    flushEditorWorkNow:       () => {},
    applyThemeMode:           themeApi.applyThemeMode,
    normalizeThemeMode:       themeApi.normalizeThemeMode,
    writeStoredValue,
    themeStorageKey,
    applyPaneOrder:           () => {},   // no-op
    paneOrderStorageKey,
    applySplit:               () => {},   // no-op
    paneSplitStorageKey,
    applyTranslation:         viewerApi.applyTranslation,
    translationStorageKey,
    applyColorTheme:          themeApi.applyColorTheme,
    colorThemeStorageKey,
    applySyncedTranslationState: (...args) => translationsManagerApiRef?.applySyncedTranslationState?.(...args) ?? Promise.resolve(),
    ensureWorkspaceConsistency,
    buildBookAliasMap:        () => aliasesApi.buildBookAliasMap(),
    renderWorkspace:          () => renderMobileApp(),
    workspaceStorageKey
  });

  // ── Cloud sync ────────────────────────────────────────────────────────────
  syncCloudApi = window.ScriptoriaModules.createCloudSync({
    readStoredValue,
    writeStoredValue,
    cloudSyncStorageKey,
    cloudSyncSettings,
    normalizeCloudSyncSettings,
    providerRegistry,
    noOpProvider:              window.NoOpProvider,
    getActiveProvider:         () => activeProvider,
    setActiveProvider:         (v) => { activeProvider = v; },
    workspace,
    renderSettings:            () => {},
    refreshSaveStatus:         () => {},
    buildProviderStatusLabel:  () => syncStatusApi.buildProviderStatusLabel(),
    getActiveProviderSettings: () => syncStatusApi.getActiveProviderSettings(),
    buildCloudSyncPayload:     () => syncPayloadApi.buildCloudSyncPayload(),
    applyCloudPayload:         (...args) => syncPayloadApi.applyCloudPayload(...args),
    syncStatusDialog:          syncConflictDialog,
    conflictDialogTitle,
    conflictDialogDescription,
    conflictLocalTime,
    conflictRemoteTime,
    conflictKeepLocalButton,
    conflictUseCloudButton,
    firstSyncKeepLocalButton,
    firstSyncUseCloudButton,
    firstSyncCancelButton,
    autoCloudSyncDelayMs:      10000,
    isSettingsOpen:            () => !settingsSheet.hidden
  });

  // ── Bootstrap sequence ────────────────────────────────────────────────────
  await initializeTranslations();
  await refreshOfflineTranslationAvailability();
  populateTranslationSelect();
  updateInstalledTranslationsInBackground();

  applyThemeMode(await themeApi.getPreferredTheme(), { rerender: false });
  await applyTranslation(await getPreferredTranslation());
  buildBookAliasMap();
  await restoreLastBookChapter();
  applyColorTheme(await themeApi.getPreferredColorTheme());

  // Restore cloud sync settings from IDB
  await syncCloudApi.restoreCloudSyncSettings();

  // Show initial UI with local data while cloud reconnect happens in background
  await restoreWorkspace();

  // Attempt silent cloud reconnect
  activeProvider.waitForReady(async () => {
    try {
      await syncCloudApi.reconnectCloud();
      mobileState.isCloudConnected = activeProvider.hasActiveSession();

      if (mobileState.isCloudConnected) {
        showTransientStatus("Pulling latest notes…");
        await syncCloudApi.pullFromCloud();
        syncCloudApi.startCloudPolling();
        // Re-render after cloud data arrives
        await restoreWorkspace();
      }
    } catch (err) {
      console.warn("[Mobile] Cloud reconnect failed:", err);
      mobileState.isCloudConnected = false;
    }
    updateSyncBar();
    if (mobileState.currentView === "notes") renderNotesView();
  });
};

void bootstrap();

// ── Service worker (same as desktop) ─────────────────────────────────────────
{
  const swParams = new URLSearchParams(location.search);
  if (!swParams.has("nosw") && "serviceWorker" in navigator) {
    let reloadingForUpdate = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloadingForUpdate) return;
      reloadingForUpdate = true;
      location.reload();
    });
    window.addEventListener("load", async () => {
      try {
        const reg = await navigator.serviceWorker.register("sw.js");
        if (reg.waiting) reg.waiting.postMessage("skip-waiting");
        reg.addEventListener("updatefound", () => {
          const w = reg.installing;
          if (!w) return;
          w.addEventListener("statechange", () => {
            if (w.state === "installed" && navigator.serviceWorker.controller) {
              w.postMessage("skip-waiting");
            }
          });
        });
      } catch (err) {
        console.warn("[Mobile/SW] registration failed:", err);
      }
    });
  }
}
