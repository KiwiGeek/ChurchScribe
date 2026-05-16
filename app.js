const translationLibrary = {};

const noteEditor = document.querySelector("#note-editor");
const saveStatus = document.querySelector("#save-status");
const toolbarButtons = document.querySelectorAll(".tool-button");
const newNoteActions = document.querySelector("#new-note-actions");
const deleteNoteButton = document.querySelector("#delete-note-button");
const manageNotesButton = document.querySelector("#manage-notes-button");
const settingsButton = document.querySelector("#settings-button");
const noteDetailsButton = document.querySelector("#note-details-button");
const activeNoteLabel = document.querySelector("#active-note-label");
const activeNoteTitle = document.querySelector("#active-note-title");
const activeNoteEditButton = document.querySelector("#active-note-edit-button");
const activeNoteMeta = document.querySelector("#active-note-meta");
const noteMetaBar = document.querySelector("#note-meta-bar");
const metadataSummary = document.querySelector("#metadata-summary");
const noteMetaFields = document.querySelector("#note-meta-fields");
const translationSelect = document.querySelector("#translation-select");
const bookSelect = document.querySelector("#book-select");
const chapterSelect = document.querySelector("#chapter-select");
const verseReference = document.querySelector("#verse-reference");
const chapterText = document.querySelector("#chapter-text");
const verseTranslation = document.querySelector("#verse-translation");
const verseDisplay = document.querySelector("#verse-display");
const scriptureSearchInput = document.querySelector("#scripture-search-input");
const scriptureSearchResults = document.querySelector("#scripture-search-results");
const paneGrid = document.querySelector(".pane-grid");
const noteManagerDialog = document.querySelector("#note-manager-dialog");
const noteManagerList = document.querySelector("#note-manager-list");
const noteBrowserDetails = document.querySelector("#note-browser-details");
const noteBrowserFilterInput = document.querySelector("#note-browser-filter");
const noteBrowserTypeFilterSelect = document.querySelector("#note-browser-type-filter");
const noteBrowserSortSelect = document.querySelector("#note-browser-sort");
const noteDetailsDialog = document.querySelector("#note-details-dialog");
const settingsDialog = document.querySelector("#settings-dialog");
const settingsTabNav = document.querySelector("#settings-tab-nav");
const settingsPanels = document.querySelectorAll("[data-settings-panel]");
const typeSelect = document.querySelector("#type-select");
const typeEditorEmpty = document.querySelector("#type-editor-empty");
const typeEditorForm = document.querySelector("#type-editor-form");
const typeNameInput = document.querySelector("#type-name-input");
const cardTitleFieldSelect = document.querySelector("#card-title-field-select");
const cardSubtitleFieldSelect = document.querySelector("#card-subtitle-field-select");
const metadataFieldList = document.querySelector("#metadata-field-list");
const aliasList = document.querySelector("#alias-list");
const cloudProviderSelect = document.querySelector("#cloud-provider-select");
const cloudPollIntervalSelect = document.querySelector("#cloud-poll-interval-select");
const cloudStatusInput = document.querySelector("#cloud-status-input");
const cloudStatusLabel = document.querySelector("#cloud-status-label");
const cloudLastSyncInput = document.querySelector("#cloud-last-sync-input");
const providerSettingsContainer = document.querySelector("#provider-settings-container");
const googleConnectButton = document.querySelector("#google-connect-button");
const googleDisconnectButton = document.querySelector("#google-disconnect-button");
const googleSyncNowButton = document.querySelector("#google-sync-now-button");
const officialTranslationLanguageSearch = document.querySelector("#official-translation-language-search");
const officialTranslationLanguageFilter = document.querySelector("#official-translation-language-filter");
const clearOfficialLanguageFiltersButton = document.querySelector("#clear-official-language-filters-button");
const availableTranslationSearch = document.querySelector("#available-translation-search");
const availableTranslationList = document.querySelector("#available-translation-list");
const installedTranslationList = document.querySelector("#installed-translation-list");
const downloadBackupButton = document.querySelector("#download-backup-button");
const restoreBackupButton = document.querySelector("#restore-backup-button");
const restoreBackupFile = document.querySelector("#restore-backup-file");
const clearLocalButton = document.querySelector("#clear-local-button");
const clearRemoteButton = document.querySelector("#clear-remote-button");
const clearAllButton = document.querySelector("#clear-all-button");
const addTypeButton = document.querySelector("#add-type-button");
const addMetadataFieldButton = document.querySelector("#add-metadata-field-button");
const deleteTypeButton = document.querySelector("#delete-type-button");
const overflowMenu = document.querySelector(".overflow-menu");
const openOnboardingButton = document.querySelector("#open-onboarding-button");
const syncConflictDialog = document.querySelector("#sync-conflict-dialog");
const conflictDialogTitle = document.querySelector("#conflict-dialog-title");
const conflictDialogDescription = document.querySelector("#conflict-dialog-description");
const conflictLocalTime = document.querySelector("#conflict-local-time");
const conflictRemoteTime = document.querySelector("#conflict-remote-time");
const conflictKeepLocalButton = document.querySelector("#conflict-keep-local-button");
const conflictUseCloudButton = document.querySelector("#conflict-use-cloud-button");
const firstSyncKeepLocalButton = document.querySelector("#first-sync-keep-local-button");
const firstSyncUseCloudButton = document.querySelector("#first-sync-use-cloud-button");
const firstSyncCancelButton = document.querySelector("#first-sync-cancel-button");
const aboutVersionInfo = document.querySelector("#about-version-info");
const mobileWarning = document.querySelector("#mobile-warning");
const mobileWarningDismissButton = document.querySelector("#mobile-warning-dismiss");
const onboardingDialog = document.querySelector("#onboarding-dialog");
const onboardingStepKicker = document.querySelector("#onboarding-step-kicker");
const onboardingStepTitle = document.querySelector("#onboarding-step-title");
const onboardingStepCopy = document.querySelector("#onboarding-step-copy");
const onboardingStepPoints = document.querySelector("#onboarding-step-points");
const onboardingStepCallout = document.querySelector("#onboarding-step-callout");
const onboardingStepCounter = document.querySelector("#onboarding-step-counter");
const onboardingStepDots = document.querySelector("#onboarding-step-dots");
const onboardingProgress = document.querySelector("#onboarding-progress");
const onboardingBackButton = document.querySelector("#onboarding-back-button");
const onboardingNextButton = document.querySelector("#onboarding-next-button");
const onboardingFinishButton = document.querySelector("#onboarding-finish-button");
const insertTableButton = document.querySelector("#insert-table-button");
const tableToolbar = document.querySelector("#table-toolbar");
const tableDialog = document.querySelector("#table-dialog");
const tableRowsInput = document.querySelector("#table-rows-input");
const tableColumnsInput = document.querySelector("#table-columns-input");
const tableInsertConfirmButton = document.querySelector("#table-insert-confirm-button");
const tableContextMenu = document.querySelector("#table-context-menu");
const insertImageButton = document.querySelector("#insert-image-button");
const insertImageFile = document.querySelector("#insert-image-file");

// TODO: Remove legacyDbName migration after a future release when the old name can be retired.
const legacyDbName = "churchscribe-db";
const dbName = "scriptoria-db";
const dbVersion = 1;
const dbStoreName = "kv";
const workspaceStorageKey = "service-notes-workspace";
const notesStorageKey = "service-notes";
const legacyNotesStorageKey = "service-notes-content";
const themeStorageKey = "service-notes-theme";
const themeMirrorStorageKey = "service-notes-theme-mirror";
const paneOrderStorageKey = "service-notes-pane-order";
const paneSplitStorageKey = "service-notes-pane-split";
const translationStorageKey = "service-notes-translation";
const translationRegistryStorageKey = "service-notes-translation-registry";
const cloudSyncStorageKey = "service-notes-cloud-sync";
const colorThemeStorageKey = "service-notes-color-theme";
const colorThemeMirrorStorageKey = "service-notes-color-theme-mirror";
const lastBookChapterStorageKey = "service-notes-last-book-chapter";
const onboardingStorageKey = "service-notes-onboarding-seen";
const autoCloudSyncDelayMs = 10000;

// noOpProvider — defensive fallback used as the initial value of activeProvider
// and whenever providerRegistry lookup misses.  Lives in storage/noopprovider.js
// alongside the other (real) provider implementations; we just alias the global
// here so the rest of this file keeps the short name.
const noOpProvider = window.NoOpProvider;

const providerRegistry = {};

if (window.NullProvider) {
  providerRegistry[window.NullProvider.id] = window.NullProvider;
}

if (window.LocalDriveProvider) {
  providerRegistry[window.LocalDriveProvider.id] = window.LocalDriveProvider;
}

if (window.GoogleDriveProvider) {
  providerRegistry[window.GoogleDriveProvider.id] = window.GoogleDriveProvider;
}

if (window.OneDriveProvider) {
  providerRegistry[window.OneDriveProvider.id] = window.OneDriveProvider;
}

if (!Object.keys(providerRegistry).length) {
  console.error("No storage providers registered. Ensure provider scripts (e.g. gdrive.js, localdrive.js, onedrive.js) are loaded before app.js.");
}

if (aboutVersionInfo) {
  const commit = window.APP_COMMIT ?? "dev";
  const buildDate = window.APP_BUILD_DATE ?? "dev";
  aboutVersionInfo.textContent = `Commit ${commit} · Built ${buildDate}`;
}

let activeProvider = noOpProvider;

// bookAliasMap, normalizeBookName, the BOOK_ALIASES table, and the explicit/
// contextual scripture-reference regexes have moved to scripture/aliases.js;
// scripture parsing helpers have moved to scripture/references.js.  The bindings
// destructured from those modules (further down in this file) keep the same
// names, so existing callers continue to work without a search-and-replace.
// Editor-only constants — domainValidationCache, knownTlds, URL_LINKIFY_PATTERNS,
// MIN_EMBED_WIDTH, EDITOR_HORIZONTAL_PADDING, BLOCK_LEVEL_ELEMENTS — have moved
// into the editor/* modules that consume them (links.js, media.js, controller.js).

// Scripture-related state (translation code, focus, search query) lives inside
// the scripture/* modules now.  Other modules read it via accessor calls on
// viewerApi / searchApi.
let activeSettingsTabId = "ui-settings";
// currentThemeMode + currentColorThemeId moved to theme/controller.js.  Read
// via themeApi.getCurrentThemeMode() / getCurrentColorThemeId().
// currentPaneSplit moved to layout/panes.js.  Read via
// paneLayoutApi.getCurrentPaneSplit().
let noteBrowserFilter = "";
let noteBrowserTypeFilter = "all";
let noteBrowserSort = "updated-desc";
let noteBrowserSelectedNoteId = null;
let dbPromise;
// systemThemeMediaQuery moved into theme/controller.js (only consumer was the
// theme code).

const workspace = {
  noteTypes: [],
  notes: [],
  activeNoteId: null,
  selectedNewNoteTypeId: null,
  customBookAliases: {},
  updatedAt: null
};

const settingsTabs = [
  {
    id: "ui-settings",
    label: "Display"
  },
  {
    id: "note-types",
    label: "Entry Types"
  },
  {
    id: "scripture-aliases",
    label: "Abbreviations"
  },
  {
    id: "cloud-sync",
    label: "Synchronization"
  },
  {
    id: "translations",
    label: "Translations"
  },
  {
    id: "data",
    label: "Data Management"
  },
  {
    id: "about",
    label: "About"
  }
];

const colorThemes = window.colorThemes || [];

const cloudSyncSettings = {
  provider: "none",
  pollIntervalSeconds: 60,
  status: "Not connected",
  lastSyncAt: null,
  localSettingsUpdatedAt: null,
  connectedEmail: "",
  remoteSettingsFileId: "",
  remoteNoteFileIds: {},
  remoteWorkspaceFileId: "",
  remoteWorkspaceParentId: "",
  lastError: "",
  providerSettings: {}
};

const normalizeCloudSyncSettings = (value = {}) => ({
  provider: typeof value.provider === "string" ? value.provider : "none",
  pollIntervalSeconds: Number(value.pollIntervalSeconds) || 60,
  status: typeof value.status === "string" && value.status ? value.status : "Not connected",
  lastSyncAt: typeof value.lastSyncAt === "string" ? value.lastSyncAt : null,
  localSettingsUpdatedAt: typeof value.localSettingsUpdatedAt === "string" ? value.localSettingsUpdatedAt : null,
  connectedEmail: typeof value.connectedEmail === "string" ? value.connectedEmail : "",
  remoteSettingsFileId: typeof value.remoteSettingsFileId === "string" ? value.remoteSettingsFileId : "",
  remoteNoteFileIds: value.remoteNoteFileIds && typeof value.remoteNoteFileIds === "object" && !Array.isArray(value.remoteNoteFileIds)
    ? value.remoteNoteFileIds
    : {},
  remoteWorkspaceFileId: typeof value.remoteWorkspaceFileId === "string" ? value.remoteWorkspaceFileId : "",
  remoteWorkspaceParentId: typeof value.remoteWorkspaceParentId === "string" ? value.remoteWorkspaceParentId : "",
  lastError: typeof value.lastError === "string" ? value.lastError : "",
  providerSettings: value.providerSettings && typeof value.providerSettings === "object" && !Array.isArray(value.providerSettings)
    ? value.providerSettings
    : {}
});

let syncStatusApi = null;
let syncPayloadApi = null;
let syncCloudApi = null;

const persistCloudSyncSettings = (...args) => syncCloudApi.persistCloudSyncSettings(...args);
const markLocalSettingsUpdated = (...args) => syncCloudApi.markLocalSettingsUpdated(...args);
const resetTransientCloudSessionState = (...args) => syncCloudApi.resetTransientCloudSessionState(...args);
const restoreCloudSyncSettings = (...args) => syncCloudApi.restoreCloudSyncSettings(...args);
const buildCloudStatusText = (...args) => syncStatusApi.buildCloudStatusText(...args);
const buildSaveStatusText = (...args) => syncStatusApi.buildSaveStatusText(...args);
const refreshSaveStatus = (...args) => syncStatusApi.refreshSaveStatus(...args);
const getActiveProviderSettings = (...args) => syncStatusApi.getActiveProviderSettings(...args);
const getCloudTargetLabel = (...args) => syncStatusApi.getCloudTargetLabel(...args);
const buildProviderStatusLabel = (...args) => syncStatusApi.buildProviderStatusLabel(...args);
const buildCloudSettingsPayload = (...args) => syncPayloadApi.buildCloudSettingsPayload(...args);
const buildCloudNotesPayload = (...args) => syncPayloadApi.buildCloudNotesPayload(...args);
const buildCloudSyncPayload = (...args) => syncPayloadApi.buildCloudSyncPayload(...args);
const applyCloudPayload = (...args) => syncPayloadApi.applyCloudPayload(...args);
const pullFromCloud = (...args) => syncCloudApi.pullFromCloud(...args);
const stopCloudPolling = (...args) => syncCloudApi.stopCloudPolling(...args);
const startCloudPolling = (...args) => syncCloudApi.startCloudPolling(...args);
const syncWorkspaceToCloud = (...args) => syncCloudApi.syncWorkspaceToCloud(...args);
const scheduleAutoCloudSync = (...args) => syncCloudApi.scheduleAutoCloudSync(...args);
const connectCloud = (...args) => syncCloudApi.connectCloud(...args);
const disconnectCloud = (...args) => syncCloudApi.disconnectCloud(...args);
const reconnectCloud = (...args) => syncCloudApi.reconnectCloud(...args);
const clearPendingAutoSync = (...args) => syncCloudApi.clearPendingAutoSync(...args);
const consumeQueuedCloudSync = (...args) => syncCloudApi.consumeQueuedCloudSync(...args);

// getCurrentTranslation / getCurrentScriptureLibrary moved to scripture/viewer.js;
// they're destructured back into this scope where viewerApi is created.
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const debounce = (callback, delayMs) => {
  let timerId = null;
  return (...args) => {
    if (timerId) {
      window.clearTimeout(timerId);
    }
    timerId = window.setTimeout(() => {
      timerId = null;
      callback(...args);
    }, delayMs);
  };
};
const createId = (prefix) => `${prefix}-${crypto.randomUUID()}`;
const formatSyncTimestamp = (value) => value ? new Date(value).toLocaleString() : "Not synced yet";
// normalizeThemeMode + getSystemTheme moved to theme/controller.js.
// normalizeThemeMode is re-exported from themeApi (re-bound below) so callers
// like sync/payloads.js and settings/backup-restore.js still receive it
// through their existing dep wiring.

const openDatabase = () => {
  if (!("indexedDB" in window)) {
    return Promise.reject(new Error("IndexedDB is not available in this browser."));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(dbStoreName)) {
          db.createObjectStore(dbStoreName, { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return dbPromise;
};

// Copies all records from the legacy churchscribe-db into scriptoria-db on first run.
// Only runs when the new database has no workspace data yet.
// TODO: Remove this migration after a future release when churchscribe-db can be retired.
const migrateFromLegacyDatabase = async () => {
  if (typeof window.indexedDB.databases !== "function") {
    return;
  }

  const databases = await window.indexedDB.databases();

  if (!databases.some((db) => db.name === legacyDbName)) {
    return;
  }

  const legacyDb = await new Promise((resolve) => {
    const req = window.indexedDB.open(legacyDbName);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });

  if (!legacyDb) {
    return;
  }

  try {
    if (!legacyDb.objectStoreNames.contains(dbStoreName)) {
      return;
    }

    const records = await new Promise((resolve, reject) => {
      const tx = legacyDb.transaction(dbStoreName, "readonly");
      const req = tx.objectStore(dbStoreName).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (!records.length) {
      return;
    }

    const hasNewData = (await readStoredValue(workspaceStorageKey)) !== undefined;

    if (hasNewData) {
      return;
    }

    const newDb = await openDatabase();
    await new Promise((resolve, reject) => {
      const tx = newDb.transaction(dbStoreName, "readwrite");
      const store = tx.objectStore(dbStoreName);
      records.forEach((record) => store.put(record));
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });

    console.info("[Migration] Migrated data from churchscribe-db to scriptoria-db.");
  } catch (err) {
    console.error("[Migration] Failed to migrate from legacy database:", err);
  } finally {
    legacyDb.close();
  }
};

const readStoredValue = async (key) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(dbStoreName, "readonly");
    const store = transaction.objectStore(dbStoreName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result?.value);
    request.onerror = () => reject(request.error);
  });
};

const writeStoredValue = async (key, value) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(dbStoreName, "readwrite");
    const store = transaction.objectStore(dbStoreName);
    const request = store.put({ key, value });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const deleteStoredValue = async (key) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(dbStoreName, "readwrite");
    const store = transaction.objectStore(dbStoreName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const migrateLegacyPreference = async (key, parser = (value) => value) => {
  const existingValue = await readStoredValue(key);

  if (typeof existingValue !== "undefined") {
    return existingValue;
  }

  const legacyValue = window.localStorage.getItem(key);

  if (legacyValue === null) {
    return undefined;
  }

  const parsedValue = parser(legacyValue);
  await writeStoredValue(key, parsedValue);
  window.localStorage.removeItem(key);
  return parsedValue;
};

const readMirroredPreference = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeMirroredPreference = (key, value) => {
  try {
    if (value == null) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, String(value));
  } catch {
    // Ignore synchronous storage failures and fall back to IndexedDB-backed preferences.
  }
};

// syncThemePreferenceMirrors / clearThemePreferenceMirrors moved to
// theme/controller.js.  Both are re-exported on themeApi and rebound below.

// ── Theme controller ──────────────────────────────────────────────────────
// Owns light/dark mode + colour theme + the localStorage mirror that lets the
// inline boot script in index.html avoid a flash of the wrong theme.
// applyThemeMode / applyColorTheme / etc. used to live inline in this file;
// the names below are destructured from the module so existing callers
// (sync/payloads, settings/ui, settings/backup-restore, bootstrap) keep
// working without per-call changes.
const themeApi = window.ScriptoriaModules.createThemeController({
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
  // sync hooks — late-bound through the syncCloudApi thunks declared above
  // so they no-op safely until the sync module is wired up later in this file.
  markLocalSettingsUpdated: (...args) => markLocalSettingsUpdated(...args),
  scheduleAutoCloudSync: (...args) => scheduleAutoCloudSync(...args),
  // Settings rerender — late-bound because renderSettings is a `let`
  // placeholder that gets its real value when settings/ui.js is created.
  isSettingsOpen: () => settingsDialog.open,
  renderSettings: () => renderSettings()
});

const {
  applyThemeMode,
  applyColorTheme,
  getResolvedThemeForMode,
  syncThemeModeControl,
  getPreferredTheme,
  getPreferredColorTheme,
  syncThemePreferenceMirrors,
  clearThemePreferenceMirrors,
  normalizeThemeMode
} = themeApi;

// ── Pane layout ───────────────────────────────────────────────────────────
// Owns the split-pane layout (notes-first vs scripture-first ordering, plus
// the divider-drag resize behaviour).  The pane-divider DOM ref is queried
// here only to thread it into the module — nothing else in app.js touches
// it.  Names are destructured back into local scope to match how
// applyPaneOrder / applySplit / togglePaneOrder are passed as deps to other
// modules (settings/ui, sync/payloads, settings/backup-restore).
const paneDivider = document.querySelector("#pane-divider");

const paneLayoutApi = window.ScriptoriaModules.createPaneLayout({
  paneGrid,
  paneDivider,
  documentObject: document,
  readStoredValue,
  writeStoredValue,
  migrateLegacyPreference,
  paneOrderStorageKey,
  paneSplitStorageKey,
  // Late-bound through the syncCloudApi thunks declared above so they no-op
  // safely until the sync module is wired up later in this file.
  markLocalSettingsUpdated: (...args) => markLocalSettingsUpdated(...args),
  scheduleAutoCloudSync: (...args) => scheduleAutoCloudSync(...args)
});

const {
  applySplit,
  applyPaneOrder,
  togglePaneOrder,
  getPreferredPaneOrder,
  getPreferredSplit
} = paneLayoutApi;

// normalizeBookName + addBookAlias moved to scripture/aliases.js.
const normalizeFieldLabel = (value) => value.trim().toLowerCase();

let getNoteDisplayTitle = () => "";
let getNoteDisplayMeta = () => "";
let getNoteSearchableText = () => "";
let renderNoteMetadataFields = () => {};
let renderWorkspace = () => {};
let renderNoteManager = () => {};
let openNotesBrowser = () => {};
let renderSettings = () => {};
let downloadWorkspaceBackup = () => {};
let restoreWorkspaceFromBackup = async () => {};
let clearLocalWorkspace = async () => {};
let clearRemoteWorkspace = async () => {};
let clearAllData = async () => {};
let openOnboarding = () => {};
let goToPreviousOnboardingStep = () => {};
let goToNextOnboardingStep = () => {};
let finishOnboarding = () => {};
let editorControllerApi = null;

const getEditorRange = () => editorControllerApi?.getEditorRange() ?? null;
const saveEditorSelection = () => editorControllerApi?.saveEditorSelection() ?? null;
const restoreEditorSelection = (savedRange) => editorControllerApi?.restoreEditorSelection(savedRange) ?? false;
const getClosestEditorElement = (node, selector) => editorControllerApi?.getClosestEditorElement(node, selector) ?? null;
const trimEditorLeadingSpacerNodes = () => editorControllerApi?.trimEditorLeadingSpacerNodes();
const updateNoteEditorPlaceholderState = () => editorControllerApi?.updateNoteEditorPlaceholderState();
const saveActiveNote = () => editorControllerApi?.saveActiveNote();
const flushEditorWorkNow = () => editorControllerApi?.flushEditorWorkNow();

const {
  createMetadataField,
  createDefaultNoteType,
  createEmptyNote,
  formatNoteDate,
  getNoteTypeById,
  getActiveNote,
  buildMetadataForType,
  getSuggestedCardTitleFieldId,
  getDefaultCardSubtitleFieldId,
  touchNote,
  createNote,
  duplicateNote,
  switchNote,
  deleteNoteById,
  changeNoteType
} = window.ScriptoriaModules.createNotesModel({
  workspace,
  createId,
  normalizeFieldLabel,
  noteMetaFields,
  noteEditor,
  persistWorkspace: () => persistWorkspace(),
  refreshSaveStatus: () => refreshSaveStatus(),
  flushEditorWorkNow: () => flushEditorWorkNow(),
  saveActiveNote: () => saveActiveNote(),
  windowObject: window,
  renderWorkspace: () => renderWorkspace(),
  getNoteDisplayTitle: (note) => getNoteDisplayTitle(note)
});

const {
  ensureSelectedTypeForManager,
  getSelectedTypeForManager,
  setSelectedTypeForManager,
  addNoteType,
  updateSelectedTypeName,
  updateSelectedTypeCardFields,
  addMetadataFieldToSelectedType,
  updateMetadataField,
  removeMetadataField,
  updateCustomAliases,
  deleteSelectedType
} = window.ScriptoriaModules.createSettingsNoteTypes({
  workspace,
  createId,
  createMetadataField,
  buildMetadataForType,
  getSuggestedCardTitleFieldId,
  getDefaultCardSubtitleFieldId,
  touchNote,
  persistWorkspace: () => persistWorkspace(),
  renderWorkspace: () => renderWorkspace(),
  refreshSaveStatus: () => refreshSaveStatus(),
  buildBookAliasMap: () => buildBookAliasMap(),
  getSelectedCardTitleFieldId: () => cardTitleFieldSelect.value,
  getSelectedCardSubtitleFieldId: () => cardSubtitleFieldSelect.value,
  windowObject: window
});

// ── Scripture modules ──────────────────────────────────────────────────────
// Four modules cooperate to handle everything in the right pane plus the
// scripture-aware features in the editor:
//
//   aliases    → owns the book-alias table, the bookAliasMap, and the three
//                regex patterns derived from the alias inventory.
//   references → pure parsing/formatting of scripture references; reads
//                aliases for its regex inputs.
//   viewer     → owns the right-pane DOM, the active translation code, and
//                the scripture-focus state; uses references when jumping to
//                a typed reference; calls into search to re-rank an active
//                query when the user switches translation.
//   search     → owns the search input + results list; delegates to the
//                viewer to actually navigate to a clicked verse.
//
// The translations-manager / sync / settings-ui modules are created later in
// this file and have circular dependencies with the scripture modules
// (translations needs applyTranslation, viewer needs ensureTranslationLoaded,
// etc.).  We break the cycles with thunk-based late binding: a few `let`
// placeholders below get assigned once translationsManagerApi exists, and
// every cross-module call goes through a thunk that re-resolves at call time.
let translationsManagerApiRef = null;
let scriptureSearchApiRef = null;

const aliasesApi = window.ScriptoriaModules.createScriptureAliases({
  workspace,
  escapeRegExp,
  getCurrentTranslation: () => viewerApi.getCurrentTranslation()
});

const {
  bookAliasMap,
  normalizeBookName,
  getEffectiveAliasesForBook
} = aliasesApi;

const buildBookAliasMap = () => aliasesApi.buildBookAliasMap();

const referencesApi = window.ScriptoriaModules.createScriptureReferences({
  bookAliasMap: aliasesApi.bookAliasMap,
  normalizeBookName: aliasesApi.normalizeBookName,
  getFullExplicitPattern: () => aliasesApi.getFullExplicitPattern(),
  getCurrentScriptureLibrary: () => viewerApi.getCurrentScriptureLibrary()
});

const {
  parseScriptureReference,
  parseExplicitReferenceParts,
  parseContextualScriptureReference,
  formatResolvedReference,
  getReferenceContext
} = referencesApi;

const viewerApi = window.ScriptoriaModules.createScriptureViewer({
  bookSelect,
  chapterSelect,
  chapterText,
  verseReference,
  verseTranslation,
  translationSelect,
  verseDisplay,
  translationLibrary,
  readStoredValue: (...args) => readStoredValue(...args),
  writeStoredValue: (...args) => writeStoredValue(...args),
  migrateLegacyPreference: (...args) => migrateLegacyPreference(...args),
  lastBookChapterStorageKey,
  translationStorageKey,
  ensureTranslationLoaded: (...args) =>
    translationsManagerApiRef.ensureTranslationLoaded(...args),
  isTranslationOfflineAvailable: (code) =>
    !!translationsManagerApiRef
    && translationsManagerApiRef.offlineAvailableTranslations.has(code),
  handleTranslationSelection: (...args) =>
    translationsManagerApiRef.handleTranslationSelection(...args),
  getFallbackTranslationId: () =>
    translationsManagerApiRef ? translationsManagerApiRef.getDefaultTranslationId() : "en:KJV",
  buildBookAliasMap: () => aliasesApi.buildBookAliasMap(),
  performScriptureSearch: (query) => {
    if (scriptureSearchApiRef) {
      scriptureSearchApiRef.performScriptureSearch(query);
    }
  },
  getScriptureSearchQuery: () =>
    scriptureSearchApiRef ? scriptureSearchApiRef.getQuery() : "",
  markLocalSettingsUpdated: (...args) => markLocalSettingsUpdated(...args),
  scheduleAutoCloudSync: (...args) => scheduleAutoCloudSync(...args)
});

const {
  applyTranslation,
  jumpToResolvedScripture,
  navigateToVerse,
  populateBookOptions,
  populateChapterOptions,
  renderChapter,
  saveLastBookChapter,
  restoreLastBookChapter,
  getCurrentTranslation,
  getCurrentScriptureLibrary,
  getPreferredTranslation
} = viewerApi;

const jumpToScripture = (referenceText) =>
  viewerApi.jumpToResolvedScripture(parseScriptureReference(referenceText));

const searchApi = window.ScriptoriaModules.createScriptureSearch({
  scriptureSearchInput,
  scriptureSearchResults,
  verseDisplay,
  getCurrentScriptureLibrary: () => viewerApi.getCurrentScriptureLibrary(),
  navigateToVerse: (book, chapter, verse) =>
    viewerApi.navigateToVerse(book, chapter, verse),
  escapeRegExp,
  debounce
});
scriptureSearchApiRef = searchApi;

const performScriptureSearch = (...args) =>
  searchApi.performScriptureSearch(...args);

const editorLinksApi = window.ScriptoriaModules.createEditorLinks({
  noteEditor,
  getExplicitPattern: () => aliasesApi.getExplicitPattern(),
  getContextualPattern: () => aliasesApi.getContextualPattern(),
  parseScriptureReference,
  parseExplicitReferenceParts,
  parseContextualScriptureReference,
  formatResolvedReference,
  getReferenceContext,
  jumpToResolvedScripture,
  windowObject: window
});

const {
  getCaretBlock,
  linkifyScriptureReferences,
  linkifyUrls,
  processUrlEmbeds,
  ensureTrailingParagraph,
  ensureLeadingParagraph,
  findAutoLinkAtCaret
} = editorLinksApi;

// BOOK_ALIASES table + getBuiltInAliasesForBook + getEffectiveAliasesForBook
// have moved to scripture/aliases.js.  getEffectiveAliasesForBook is
// destructured back into this scope above via aliasesApi for the few callers
// (settings UI, sync payloads) that still reach for it through app.js.

const ensureWorkspaceConsistency = () => {
  if (!Array.isArray(workspace.noteTypes) || !workspace.noteTypes.length) {
    workspace.noteTypes = [createDefaultNoteType()];
  }

  workspace.noteTypes = workspace.noteTypes.map((type, index) => {
    const normalizedType = {
      id: typeof type.id === "string" && type.id ? type.id : createId("type"),
      name: typeof type.name === "string" && type.name.trim() ? type.name.trim() : `Type ${index + 1}`,
      fields: Array.isArray(type.fields)
        ? type.fields
            .map((field, fieldIndex) => ({
              id: typeof field.id === "string" && field.id ? field.id : createId("field"),
              label: typeof field.label === "string" && field.label.trim() ? field.label.trim() : `Field ${fieldIndex + 1}`,
              placeholder: typeof field.placeholder === "string" ? field.placeholder : ""
            }))
        : []
    };

    normalizedType.cardTitleFieldId = typeof type.cardTitleFieldId === "string"
      ? (type.cardTitleFieldId === "" || normalizedType.fields.some((field) => field.id === type.cardTitleFieldId)
          ? type.cardTitleFieldId
          : getSuggestedCardTitleFieldId(normalizedType))
      : getSuggestedCardTitleFieldId(normalizedType);
    normalizedType.cardSubtitleFieldId = typeof type.cardSubtitleFieldId === "string"
      ? (type.cardSubtitleFieldId === "" || normalizedType.fields.some((field) => field.id === type.cardSubtitleFieldId)
          ? type.cardSubtitleFieldId
          : getDefaultCardSubtitleFieldId(normalizedType))
      : getDefaultCardSubtitleFieldId(normalizedType);

    return normalizedType;
  });

  const firstType = workspace.noteTypes[0];

  workspace.notes = Array.isArray(workspace.notes)
    ? workspace.notes.map((note) => {
        const resolvedType = getNoteTypeById(note.typeId) ?? firstType;
        return {
          id: typeof note.id === "string" && note.id ? note.id : createId("note"),
          typeId: resolvedType.id,
          metadata: buildMetadataForType(resolvedType, typeof note.metadata === "object" && note.metadata ? note.metadata : {}),
          content: typeof note.content === "string" ? note.content : "",
          createdAt: typeof note.createdAt === "string" ? note.createdAt : new Date().toISOString(),
          updatedAt: typeof note.updatedAt === "string" ? note.updatedAt : new Date().toISOString()
        };
      })
    : [];

  if (!workspace.notes.length) {
    workspace.notes = [createEmptyNote(firstType.id, buildMetadataForType(firstType))];
  }

  if (!workspace.notes.some((note) => note.id === workspace.activeNoteId)) {
    workspace.activeNoteId = workspace.notes[0].id;
  }

  if (!workspace.noteTypes.some((type) => type.id === workspace.selectedNewNoteTypeId)) {
    workspace.selectedNewNoteTypeId = getActiveNote().typeId;
  }

  ensureSelectedTypeForManager();

  workspace.customBookAliases = typeof workspace.customBookAliases === "object" && workspace.customBookAliases
    ? Object.fromEntries(
        Object.entries(workspace.customBookAliases).map(([book, aliases]) => [
          book,
          Array.isArray(aliases)
            ? aliases.filter((alias) => typeof alias === "string").map((alias) => alias.trim()).filter(Boolean)
            : []
        ])
      )
    : {};

  workspace.updatedAt = typeof workspace.updatedAt === "string" ? workspace.updatedAt : null;
};

const persistWorkspace = () => {
  // Phase 3: ensureWorkspaceConsistency() used to run here on every keystroke,
  // walking and rebuilding every note in the workspace.  It's idempotent and only
  // matters when foreign data shapes enter the workspace; the load/import paths
  // (restoreWorkspace, applyCloudPayload, migrateLegacyNotes) already invoke it.
  // Removed from the typing hot path.
  //
  // structuredClone(workspace) used to snapshot the entire workspace before
  // handing it to writeStoredValue.  IndexedDB.put performs a structured clone
  // synchronously when invoked, so the value is captured before this function
  // returns — the hand-rolled clone was redundant work.
  workspace.updatedAt = new Date().toISOString();
  void writeStoredValue(workspaceStorageKey, workspace);
  scheduleAutoCloudSync();
};

const updateSaveStatus = (message) => {
  saveStatus.replaceChildren();

  if (typeof message === "string") {
    saveStatus.textContent = message;
    return;
  }

  const { localLabel, syncLabel } = message;

  const localText = document.createTextNode(`${localLabel} • `);
  const syncButton = document.createElement("button");
  syncButton.type = "button";
  syncButton.className = "save-status-sync";
  syncButton.textContent = syncLabel;
  syncButton.addEventListener("click", async () => {
    await syncWorkspaceToCloud({ reason: "manual" });
  });

  saveStatus.append(localText, syncButton);
};

const migrateLegacyNotes = (savedNotes, legacyNotes) => {
  const defaultType = createDefaultNoteType();
  const [titleField, speakerField] = defaultType.fields;
  const migratedNotes = [];

  if (Array.isArray(savedNotes) && savedNotes.length) {
    savedNotes.forEach((note) => {
      migratedNotes.push({
        id: typeof note.id === "string" && note.id ? note.id : createId("note"),
        typeId: defaultType.id,
        metadata: {
          [titleField.id]: typeof note.title === "string" ? note.title : "",
          [speakerField.id]: typeof note.speaker === "string" ? note.speaker : ""
        },
        content: typeof note.content === "string" ? note.content : "",
        createdAt: typeof note.createdAt === "string" ? note.createdAt : new Date().toISOString(),
        updatedAt: typeof note.updatedAt === "string" ? note.updatedAt : new Date().toISOString()
      });
    });
  } else if (typeof legacyNotes === "string" && legacyNotes) {
    migratedNotes.push({
      ...createEmptyNote(defaultType.id, {
        [titleField.id]: "",
        [speakerField.id]: ""
      }),
      content: legacyNotes
    });
  } else {
    migratedNotes.push(createEmptyNote(defaultType.id, buildMetadataForType(defaultType)));
  }

  workspace.noteTypes = [defaultType];
  workspace.notes = migratedNotes;
  workspace.activeNoteId = migratedNotes[0].id;
  workspace.selectedNewNoteTypeId = defaultType.id;
  ensureWorkspaceConsistency();
  persistWorkspace();
};

const restoreWorkspace = async () => {
  const savedWorkspace = await readStoredValue(workspaceStorageKey);
  const savedNotes = await migrateLegacyPreference(notesStorageKey, JSON.parse);
  const legacyNotes = await migrateLegacyPreference(legacyNotesStorageKey);

  if (savedWorkspace) {
    workspace.noteTypes = savedWorkspace.noteTypes;
    workspace.notes = savedWorkspace.notes;
    workspace.activeNoteId = savedWorkspace.activeNoteId;
    workspace.selectedNewNoteTypeId = savedWorkspace.selectedNewNoteTypeId;
    workspace.customBookAliases = savedWorkspace.customBookAliases ?? {};
    workspace.updatedAt = savedWorkspace.updatedAt ?? null;
  } else if (savedNotes || legacyNotes) {
    migrateLegacyNotes(savedNotes ?? null, legacyNotes);
    updateSaveStatus("Converted your existing entries into typed entries.");
  } else {
    const defaultType = createDefaultNoteType();
    workspace.noteTypes = [defaultType];
    workspace.notes = [createEmptyNote(defaultType.id, buildMetadataForType(defaultType))];
    workspace.activeNoteId = workspace.notes[0].id;
    workspace.selectedNewNoteTypeId = defaultType.id;
  }

  ensureWorkspaceConsistency();
  buildBookAliasMap();
  renderWorkspace();

  if (!savedWorkspace && !savedNotes && !legacyNotes) {
    refreshSaveStatus();
  }
};

// getPreferredTheme moved to theme/controller.js (re-exported on themeApi).

// getPreferredTranslation, saveLastBookChapter, and restoreLastBookChapter
// have moved to scripture/viewer.js and are destructured back into this scope
// from viewerApi above.

// getResolvedThemeForMode / syncThemeModeControl / applyThemeMode moved to
// theme/controller.js.

// getPreferredPaneOrder / getPreferredSplit / syncPaneOrderToggle / applySplit
// / applyPaneOrder / togglePaneOrder moved to layout/panes.js.

// getPreferredColorTheme / applyColorTheme moved to theme/controller.js.

// populateBookOptions / populateChapterOptions / renderChapter / applyTranslation
// have moved to scripture/viewer.js.



// parseSearchQuery / buildHighlightedTextContent / renderScriptureSearchResults
// / performScriptureSearch have moved to scripture/search.js.
// The four colour-picker DOM refs (wrapper, trigger, dropdown, swatch) are
// queried inside editor/controller.js now, since they were only consumed there.

const editorTablesApi = window.ScriptoriaModules.createEditorTables({
  noteEditor,
  tableToolbar,
  tableDialog,
  tableRowsInput,
  tableColumnsInput,
  tableContextMenu,
  saveEditorSelection,
  restoreEditorSelection,
  getEditorRange,
  getClosestEditorElement,
  saveActiveNote: () => saveActiveNote(),
  showInsertTableDialog: () => openDialog(tableDialog),
  windowObject: window
});

const {
  focusTableCell,
  getTableCellFromSelection,
  getTableContext,
  closeTableContextMenu,
  refreshTableUi,
  isLastTableCell,
  getNextTableCell,
  insertTableRow,
  runTableAction,
  openTableContextMenu,
  openInsertTableDialog,
  confirmInsertTable
} = editorTablesApi;

window.ScriptoriaModules.createEditorNavigation({
  noteEditor,
  ensureTrailingParagraph,
  saveActiveNote: () => saveActiveNote(),
  findAutoLinkAtCaret,
  windowObject: window,
  documentObject: document
}).attach();

editorControllerApi = window.ScriptoriaModules.createEditorController({
  noteEditor,
  noteMetaFields,
  toolbarButtons,
  insertTableButton,
  tableInsertConfirmButton,
  tableToolbar,
  tableContextMenu,
  getActiveNote,
  touchNote,
  persistWorkspace: () => persistWorkspace(),
  refreshSaveStatus: () => refreshSaveStatus(),
  getCaretBlock,
  linkifyScriptureReferences,
  linkifyUrls,
  processUrlEmbeds,
  focusTableCell,
  getTableCellFromSelection,
  getTableContext,
  closeTableContextMenu,
  refreshTableUi,
  isLastTableCell,
  getNextTableCell,
  insertTableRow,
  runTableAction,
  openInsertTableDialog,
  confirmInsertTable,
  windowObject: window,
  documentObject: document
});
editorControllerApi.attach();

window.ScriptoriaModules.createEditorMedia({
  noteEditor,
  insertImageButton,
  insertImageFile,
  ensureTrailingParagraph,
  saveActiveNote: () => saveActiveNote(),
  saveEditorSelection,
  restoreEditorSelection,
  closeTableContextMenu,
  focusTableCell,
  openTableContextMenu,
  refreshTableUi,
  jumpToScripture,
  imageEmbedClass: ImageEmbed,
  embedBaseClass: EmbedBase,
  windowObject: window,
  documentObject: document
}).attach();

let refreshNoteSurfaces = () => {};

({
  getNoteDisplayTitle,
  getNoteDisplayMeta,
  getNoteSearchableText,
  renderNoteMetadataFields,
  refreshNoteSurfaces,
  renderWorkspace
} = window.ScriptoriaModules.createNotesRender({
  workspace,
  newNoteActions,
  activeNoteLabel,
  activeNoteTitle,
  activeNoteMeta,
  metadataSummary,
  noteMetaBar,
  noteMetaFields,
  noteEditor,
  noteManagerDialog,
  settingsDialog,
  processUrlEmbeds,
  linkifyScriptureReferences,
  linkifyUrls,
  refreshTableUi,
  ensureTrailingParagraph,
  trimEditorLeadingSpacerNodes,
  updateNoteEditorPlaceholderState,
  noteBrowserSelectedNoteIdRef: () => noteBrowserSelectedNoteId,
  getNoteTypeById,
  getActiveNote,
  formatNoteDate,
  ensureWorkspaceConsistency,
  renderNoteManager: () => renderNoteManager(),
  renderSettings: () => renderSettings()
}));

syncStatusApi = window.ScriptoriaModules.createSyncStatus({
  cloudSyncSettings,
  getActiveProvider: () => activeProvider,
  getActiveNote,
  updateSaveStatus
});

syncPayloadApi = window.ScriptoriaModules.createSyncPayloads({
  workspace,
  cloudSyncSettings,
  paneGrid,
  getCurrentThemeMode: () => themeApi.getCurrentThemeMode(),
  getCurrentPaneSplit: () => paneLayoutApi.getCurrentPaneSplit(),
  getCurrentTranslationCode: () => viewerApi.getCurrentTranslationCode(),
  getCurrentColorThemeId: () => themeApi.getCurrentColorThemeId(),
  getTranslationStateForSync: () =>
    translationsManagerApiRef ? translationsManagerApiRef.getTranslationStateForSync() : { installedOfficialIds: [] },
  flushEditorWorkNow: () => flushEditorWorkNow(),
  applyThemeMode,
  normalizeThemeMode,
  writeStoredValue,
  themeStorageKey,
  applyPaneOrder,
  paneOrderStorageKey,
  applySplit,
  paneSplitStorageKey,
  applyTranslation,
  translationStorageKey,
  applyColorTheme,
  colorThemeStorageKey,
  applySyncedTranslationState: (...args) =>
    translationsManagerApiRef ? translationsManagerApiRef.applySyncedTranslationState(...args) : Promise.resolve(),
  ensureWorkspaceConsistency,
  buildBookAliasMap: () => buildBookAliasMap(),
  renderWorkspace: () => renderWorkspace(),
  workspaceStorageKey
});

syncCloudApi = window.ScriptoriaModules.createCloudSync({
  readStoredValue,
  writeStoredValue,
  cloudSyncStorageKey,
  cloudSyncSettings,
  normalizeCloudSyncSettings,
  providerRegistry,
  noOpProvider,
  getActiveProvider: () => activeProvider,
  setActiveProvider: (value) => {
    activeProvider = value;
  },
  workspace,
  renderSettings: () => renderSettings(),
  refreshSaveStatus: () => refreshSaveStatus(),
  buildProviderStatusLabel: () => buildProviderStatusLabel(),
  getActiveProviderSettings: () => getActiveProviderSettings(),
  buildCloudSyncPayload: () => buildCloudSyncPayload(),
  applyCloudPayload: (...args) => applyCloudPayload(...args),
  syncStatusDialog: syncConflictDialog,
  conflictDialogTitle,
  conflictDialogDescription,
  conflictLocalTime,
  conflictRemoteTime,
  conflictKeepLocalButton,
  conflictUseCloudButton,
  firstSyncKeepLocalButton,
  firstSyncUseCloudButton,
  firstSyncCancelButton,
  autoCloudSyncDelayMs,
  isSettingsOpen: () => settingsDialog.open
});

const openDialog = (dialog) => {
  if (typeof dialog.showModal === "function") {
    const handleBackdropClick = (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    };
    const handleClose = () => {
      dialog.removeEventListener("click", handleBackdropClick);
      dialog.removeEventListener("close", handleClose);
    };
    dialog.addEventListener("click", handleBackdropClick);
    dialog.addEventListener("close", handleClose);
    dialog.showModal();
  }
};

({
  renderNoteManager,
  openNotesBrowser
} = window.ScriptoriaModules.createNotesBrowser({
  workspace,
  noteManagerList,
  noteBrowserDetails,
  noteBrowserTypeFilterSelect,
  noteBrowserFilterInput,
  noteBrowserSortSelect,
  overflowMenu,
  noteManagerDialog,
  openDialog,
  getNoteBrowserSort: () => noteBrowserSort,
  getNoteBrowserFilter: () => noteBrowserFilter,
  getNoteBrowserTypeFilter: () => noteBrowserTypeFilter,
  getNoteBrowserSelectedNoteId: () => noteBrowserSelectedNoteId,
  setNoteBrowserSelectedNoteId: (value) => {
    noteBrowserSelectedNoteId = value;
  },
  getNoteDisplayTitle: (note) => getNoteDisplayTitle(note),
  getNoteDisplayMeta: (note) => getNoteDisplayMeta(note),
  getNoteSearchableText: (note) => getNoteSearchableText(note),
  getNoteTypeById,
  formatNoteDate
}));

const closeOverflowMenu = () => {
  overflowMenu.removeAttribute("open");
  overflowMenu.querySelectorAll("details[open]").forEach((menu) => {
    menu.removeAttribute("open");
  });
};

document.addEventListener("click", (e) => {
  if (!overflowMenu.contains(e.target)) {
    closeOverflowMenu();
  }
});

newNoteActions.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-new-note-type]");

  if (!trigger) {
    return;
  }

  createNote(trigger.dataset.newNoteType);
  closeOverflowMenu();
});
deleteNoteButton.addEventListener("click", () => {
  deleteNoteById(workspace.activeNoteId);
  closeOverflowMenu();
});
noteDetailsButton.addEventListener("click", () => {
  renderNoteMetadataFields();
  openDialog(noteDetailsDialog);
});

activeNoteEditButton.addEventListener("click", () => {
  renderNoteMetadataFields();
  openDialog(noteDetailsDialog);
});

manageNotesButton.addEventListener("click", () => {
  openNotesBrowser();
});

settingsButton.addEventListener("click", () => {
  renderSettings();
  closeOverflowMenu();
  openDialog(settingsDialog);
});

cardTitleFieldSelect.addEventListener("change", updateSelectedTypeCardFields);
cardSubtitleFieldSelect.addEventListener("change", updateSelectedTypeCardFields);

const debouncedRenderNoteManager = debounce(() => {
  renderNoteManager();
}, 120);

// debouncedPerformScriptureSearch + the scripture-search input listener live
// inside scripture/search.js now.

noteBrowserFilterInput.addEventListener("input", () => {
  noteBrowserFilter = noteBrowserFilterInput.value;
  debouncedRenderNoteManager();
});

noteBrowserTypeFilterSelect.addEventListener("change", () => {
  noteBrowserTypeFilter = noteBrowserTypeFilterSelect.value;
  renderNoteManager();
});

noteBrowserSortSelect.addEventListener("change", () => {
  noteBrowserSort = noteBrowserSortSelect.value;
  renderNoteManager();
});

noteMetaFields.addEventListener("input", () => {
  const activeNote = getActiveNote();

  if (!activeNote) {
    return;
  }

  noteMetaFields.querySelectorAll("[data-field-id]").forEach((input) => {
    activeNote.metadata[input.dataset.fieldId] = input.value;
  });
  touchNote(activeNote);
  persistWorkspace();
  refreshNoteSurfaces();
  refreshSaveStatus();
});

noteMetaFields.addEventListener("change", (event) => {
  const typeSelect = event.target.closest("[data-note-type-change]");

  if (!typeSelect) {
    return;
  }

  changeNoteType(typeSelect.dataset.noteTypeChange, typeSelect.value);
});

// translationSelect / bookSelect / chapterSelect / scriptureSearchInput
// listeners now live inside scripture/viewer.js and scripture/search.js.
// The systemThemeMediaQuery "change" listener moved into theme/controller.js.

noteManagerList.addEventListener("click", (event) => {
  const selectionButton = event.target.closest("[data-note-select]");

  if (selectionButton) {
    if (event.detail > 1) {
      switchNote(selectionButton.dataset.noteSelect);
      noteManagerDialog.close();
      return;
    }

    noteBrowserSelectedNoteId = selectionButton.dataset.noteSelect;
    renderNoteManager();
  }
});

noteBrowserDetails.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-note-action]");

  if (!actionButton) {
    return;
  }

  const { noteAction, noteId } = actionButton.dataset;

  if (noteAction === "open") {
    switchNote(noteId);
    noteManagerDialog.close();
    return;
  }

  if (noteAction === "duplicate") {
    duplicateNote(noteId);
    noteBrowserSelectedNoteId = workspace.activeNoteId;
    return;
  }

  if (noteAction === "delete") {
    deleteNoteById(noteId);
  }
});

typeSelect.addEventListener("change", () => {
  setSelectedTypeForManager(typeSelect.value);
  renderSettings();
});

settingsTabNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-settings-tab]");

  if (!button) {
    return;
  }

  activeSettingsTabId = button.dataset.settingsTab;
  renderSettings();
});

const translationFileInput = document.querySelector("#translation-file-input");
const importTranslationFileButton = document.querySelector("#import-translation-file-button");

importTranslationFileButton.addEventListener("click", () => {
  translationFileInput.click();
});

translationFileInput.addEventListener("change", () => {
  const [file] = translationFileInput.files ?? [];

  if (!file) {
    return;
  }

  importTranslationFileButton.disabled = true;
  importTranslationFileButton.textContent = "Importing…";

  importTranslationFromFile(file).then((translationId) => {
    translationFileInput.value = "";
    updateSaveStatus(`Translation "${translationId}" imported successfully.`);
    setTimeout(() => refreshSaveStatus(), 4000);
  }).catch((err) => {
    window.alert(`Import failed: ${err.message}`);
  }).finally(() => {
    importTranslationFileButton.disabled = false;
    importTranslationFileButton.textContent = "Import Translation JSON…";
  });
});

availableTranslationSearch?.addEventListener("input", () => {
  translationsManagerApiRef.setAvailableTranslationSearch(availableTranslationSearch.value);
});

officialTranslationLanguageSearch.addEventListener("input", () => {
  translationsManagerApiRef.setOfficialLanguageSearch(officialTranslationLanguageSearch.value);
  void renderTranslationsPanel();
});

officialTranslationLanguageFilter.addEventListener("change", () => {
  const selected = [...officialTranslationLanguageFilter.selectedOptions].map((option) => option.value);
  void translationsManagerApiRef.setOfficialLanguageFilters(selected);
});

clearOfficialLanguageFiltersButton.addEventListener("click", () => {
  if (availableTranslationSearch) {
    availableTranslationSearch.value = "";
  }
  translationsManagerApiRef.setAvailableTranslationSearch("");
  void translationsManagerApiRef.clearOfficialLanguageFilters();
});

availableTranslationList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-install-official-translation]");

  if (!button) {
    return;
  }

  button.disabled = true;
  button.textContent = "Installing…";
  const translationId = button.dataset.installOfficialTranslation;

  void translationsManagerApiRef.installOfficialTranslation(translationId).then(() => {
    updateSaveStatus(`"${translationId}" installed.`);
    setTimeout(() => refreshSaveStatus(), 4000);
  }).catch((err) => {
    window.alert(`Couldn't install translation: ${err.message}`);
  });
});

installedTranslationList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-uninstall-translation]");

  if (!button) {
    return;
  }

  const translationId = button.dataset.uninstallTranslation;
  const label = translationLibrary[translationId]?.label ?? translationId;

  // eslint-disable-next-line no-alert
  if (!window.confirm(`Uninstall "${label}"? You can reinstall it from the Available list.`)) {
    return;
  }

  void translationsManagerApiRef.uninstallTranslation(translationId);
});



openOnboardingButton.addEventListener("click", () => {
  openOnboarding();
});

onboardingBackButton.addEventListener("click", () => {
  goToPreviousOnboardingStep();
});

onboardingNextButton.addEventListener("click", () => {
  goToNextOnboardingStep();
});

onboardingFinishButton.addEventListener("click", () => {
  finishOnboarding();
});

typeNameInput.addEventListener("change", () => {
  updateSelectedTypeName(typeNameInput.value);
});

metadataFieldList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-field-id][data-field-prop]");

  if (!input) {
    return;
  }

  updateMetadataField(input.dataset.fieldId, input.dataset.fieldProp, input.value);
});

metadataFieldList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-field]");

  if (!removeButton) {
    return;
  }

  removeMetadataField(removeButton.dataset.removeField);
});

aliasList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-alias-book]");

  if (!input) {
    return;
  }

  updateCustomAliases(input.dataset.aliasBook, input.value);
});

cloudProviderSelect.addEventListener("change", () => {
  const newProviderId = cloudProviderSelect.value;

  // Persist current provider's settings before switching
  persistCloudSyncSettings();

  stopCloudPolling();
  clearPendingAutoSync();

  cloudSyncSettings.provider = newProviderId;
  activeProvider = providerRegistry[newProviderId] ?? noOpProvider;

  // Remote file/folder IDs and sync timestamps are provider-specific and must not carry over.
  cloudSyncSettings.remoteSettingsFileId = "";
  cloudSyncSettings.remoteNoteFileIds = {};
  cloudSyncSettings.remoteWorkspaceFileId = "";
  cloudSyncSettings.remoteWorkspaceParentId = "";
  cloudSyncSettings.lastSyncAt = null;

  const defaults = activeProvider.getSettingsValues();

  if (!cloudSyncSettings.providerSettings[newProviderId]) {
    cloudSyncSettings.providerSettings[newProviderId] = { ...defaults };
  }

  resetTransientCloudSessionState();
  persistCloudSyncSettings();
  renderSettings();

  activeProvider.waitForReady(() => {
    void reconnectCloud();

    if (settingsDialog.open) {
      renderSettings();
    }
  });
});

cloudPollIntervalSelect.addEventListener("change", () => {
  cloudSyncSettings.pollIntervalSeconds = Number(cloudPollIntervalSelect.value);
  persistCloudSyncSettings();
  markLocalSettingsUpdated();
  scheduleAutoCloudSync();
  startCloudPolling();
});

const handleProviderSettingChange = (key, value) => {
  const currentSettings = cloudSyncSettings.providerSettings[activeProvider.id] ?? {};
  currentSettings[key] = value;
  cloudSyncSettings.providerSettings[activeProvider.id] = currentSettings;

  const result = activeProvider.applySettingChange(key, value);

  if (result?.clearRemoteState) {
    cloudSyncSettings.remoteSettingsFileId = "";
    cloudSyncSettings.remoteNoteFileIds = {};
    cloudSyncSettings.remoteWorkspaceFileId = "";
    cloudSyncSettings.remoteWorkspaceParentId = "";
    cloudSyncSettings.lastError = "";
    if (activeProvider.hasActiveSession()) {
      cloudSyncSettings.status = `Connected to ${buildProviderStatusLabel()}`;
    }
  }

  persistCloudSyncSettings();
  cloudStatusInput.value = buildCloudStatusText();
  cloudLastSyncInput.value = formatSyncTimestamp(cloudSyncSettings.lastSyncAt);
  scheduleAutoCloudSync();
  refreshSaveStatus();
};

const handleProviderSettingInputEvent = (event) => {
  const input = event.target.closest("[data-provider-setting-key]");

  if (!input) {
    return;
  }

  const key = input.dataset.providerSettingKey;
  const value = input.type === "checkbox" ? input.checked : input.value;
  handleProviderSettingChange(key, value);
};

providerSettingsContainer.addEventListener("input", handleProviderSettingInputEvent);
providerSettingsContainer.addEventListener("change", handleProviderSettingInputEvent);

googleConnectButton.addEventListener("click", async () => {
  try {
    await connectCloud();
  } catch (error) {
    console.error(error);
  }
});

googleDisconnectButton.addEventListener("click", () => {
  disconnectCloud();
});

googleSyncNowButton.addEventListener("click", async () => {
  await pullFromCloud();
  await syncWorkspaceToCloud({ reason: "manual" });
});

downloadBackupButton.addEventListener("click", () => {
  downloadWorkspaceBackup();
});

restoreBackupButton.addEventListener("click", () => {
  restoreBackupFile.value = "";
  restoreBackupFile.click();
});

restoreBackupFile.addEventListener("change", () => {
  const file = restoreBackupFile.files?.[0];

  if (file) {
    void restoreWorkspaceFromBackup(file);
  }
});

clearLocalButton.addEventListener("click", () => {
  void clearLocalWorkspace();
});

clearRemoteButton.addEventListener("click", () => {
  void clearRemoteWorkspace();
});

clearAllButton.addEventListener("click", () => {
  void clearAllData();
});

addTypeButton.addEventListener("click", addNoteType);
addMetadataFieldButton.addEventListener("click", addMetadataFieldToSelectedType);
deleteTypeButton.addEventListener("click", deleteSelectedType);

// ── Translation catalog / user import wiring ───────────────────────────────

const translationsManagerApi = window.ScriptoriaModules.createTranslationsManager({
  translationLibrary,
  readStoredValue,
  writeStoredValue,
  deleteStoredValue,
  translationRegistryStorageKey,
  translationStorageKey,
  translationSelect,
  getCurrentTranslationCode: () => viewerApi.getCurrentTranslationCode(),
  applyTranslation: (...args) => applyTranslation(...args),
  openOfficialTranslationsSettings: () => {
    activeSettingsTabId = "translations";
    renderSettings();
    openDialog(settingsDialog);
    window.setTimeout(() => availableTranslationSearch?.focus(), 0);
  }
});

// Hand the live translations module to the scripture viewer so its thunks for
// ensureTranslationLoaded / offlineAvailableTranslations resolve to real
// implementations.  Until this assignment runs, viewer's thunks are no-ops —
// safe because they're only invoked from event handlers / bootstrap, both of
// which fire after this point.
translationsManagerApiRef = translationsManagerApi;

const {
  offlineAvailableTranslations,
  initializeTranslations,
  updateInstalledTranslationsInBackground,
  refreshOfflineTranslationAvailability,
  ensureTranslationLoaded,
  validateTranslationData,
  populateTranslationSelect,
  importTranslationFromFile,
  renderTranslationsPanel
} = translationsManagerApi;

({ renderSettings } = window.ScriptoriaModules.createSettingsUi({
  settingsTabNav,
  settingsTabs,
  settingsPanels,
  getActiveSettingsTabId: () => activeSettingsTabId,
  renderTranslationsPanel: () => renderTranslationsPanel(),
  cloudProviderSelect,
  cloudPollIntervalSelect,
  providerSettingsContainer,
  getActiveProvider: () => activeProvider,
  cloudSyncSettings,
  buildCloudStatusText: () => buildCloudStatusText(),
  formatSyncTimestamp,
  cloudStatusLabel,
  cloudStatusInput,
  cloudLastSyncInput,
  googleConnectButton,
  googleDisconnectButton,
  googleSyncNowButton,
  typeEditorEmpty,
  typeEditorForm,
  typeSelect,
  typeNameInput,
  metadataFieldList,
  cardTitleFieldSelect,
  cardSubtitleFieldSelect,
  aliasList,
  getSelectedTypeForManager,
  workspace,
  getCurrentTranslation: () => getCurrentTranslation(),
  getEffectiveAliasesForBook,
  applyThemeMode,
  getCurrentThemeMode: () => themeApi.getCurrentThemeMode(),
  paneGrid,
  togglePaneOrder,
  colorThemes,
  getCurrentColorThemeId: () => themeApi.getCurrentColorThemeId(),
  writeStoredValue,
  colorThemeStorageKey,
  applyColorTheme,
  markLocalSettingsUpdated,
  scheduleAutoCloudSync
}));

({
  downloadWorkspaceBackup,
  restoreWorkspaceFromBackup,
  clearLocalWorkspace,
  clearRemoteWorkspace,
  clearAllData
} = window.ScriptoriaModules.createSettingsBackupRestore({
  workspace,
  getTranslationStateForBackup: () => translationsManagerApi.getTranslationStateForBackup(),
  restoreTranslationState: (...args) => translationsManagerApi.restoreTranslationState(...args),
  clearTranslationState: (...args) => translationsManagerApi.clearTranslationState(...args),
  writeStoredValue,
  getCurrentThemeMode: () => themeApi.getCurrentThemeMode(),
  paneGrid,
  getCurrentPaneSplit: () => paneLayoutApi.getCurrentPaneSplit(),
  getCurrentTranslationCode: () => viewerApi.getCurrentTranslationCode(),
  getCurrentColorThemeId: () => themeApi.getCurrentColorThemeId(),
  applyThemeMode,
  normalizeThemeMode,
  themeStorageKey,
  applyPaneOrder,
  paneOrderStorageKey,
  applySplit,
  paneSplitStorageKey,
  applyTranslation,
  translationStorageKey,
  applyColorTheme,
  colorThemeStorageKey,
  buildBookAliasMap: () => buildBookAliasMap(),
  renderWorkspace: () => renderWorkspace(),
  persistWorkspace: () => persistWorkspace(),
  updateSaveStatus,
  stopCloudPolling,
  clearPendingAutoSync,
  getActiveProvider: () => activeProvider,
  deleteStoredValue,
  workspaceStorageKey,
  cloudSyncStorageKey,
  lastBookChapterStorageKey,
  onboardingStorageKey,
  notesStorageKey,
  translationRegistryStorageKey,
  clearThemePreferenceMirrors,
  cloudSyncSettings,
  persistCloudSyncSettings,
  renderSettings: () => renderSettings(),
  refreshSaveStatus: () => refreshSaveStatus()
}));

({
  openOnboarding,
  goToPreviousOnboardingStep,
  goToNextOnboardingStep,
  finishOnboarding
} = window.ScriptoriaModules.createOnboarding({
  onboardingDialog,
  onboardingStepKicker,
  onboardingStepTitle,
  onboardingStepCopy,
  onboardingStepPoints,
  onboardingStepCallout,
  onboardingStepCounter,
  onboardingStepDots,
  onboardingProgress,
  onboardingBackButton,
  onboardingNextButton,
  onboardingFinishButton,
  openDialog,
  writeStoredValue,
  onboardingStorageKey
}));

// ── Document-level drag-and-drop for .json translation files ──────────────

document.addEventListener("dragover", (event) => {
  if ([...event.dataTransfer.types].includes("Files")) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }
});

document.addEventListener("drop", (event) => {
  if (![...event.dataTransfer.types].includes("Files")) {
    return;
  }

  const jsonFiles = [...event.dataTransfer.files].filter((f) => f.name.endsWith(".json"));

  if (jsonFiles.length === 0) {
    // Not a translation file — prevent browser from navigating to it, but do nothing else.
    event.preventDefault();
    return;
  }

  event.preventDefault();

  jsonFiles.forEach((file) => {
    importTranslationFromFile(file).then((translationId) => {
      updateSaveStatus(`Translation "${translationId}" imported successfully.`);
      setTimeout(() => refreshSaveStatus(), 4000);

      if (settingsDialog.open && activeSettingsTabId === "translations") {
        renderTranslationsPanel();
      }
    }).catch((err) => {
      // eslint-disable-next-line no-alert
      window.alert(`Translation import failed: ${err.message}`);
    });
  });
});


// buildBookAliasMap has moved to scripture/aliases.js (and is re-exposed via
// the buildBookAliasMap thunk near the top of this file).

const bootstrap = async () => {
  await migrateFromLegacyDatabase();
  await initializeTranslations();
  // Inspect IndexedDB for which built-in translations are already cached so the
  // picker can correctly mark un-cached ones as unavailable when offline.  Must
  // happen before populateTranslationSelect so the initial render is accurate.
  await refreshOfflineTranslationAvailability();
  populateTranslationSelect();
  updateInstalledTranslationsInBackground();
  applyThemeMode(await getPreferredTheme(), { rerender: false });
  applyPaneOrder(await getPreferredPaneOrder());
  applySplit(await getPreferredSplit());
  await applyTranslation(await getPreferredTranslation());
  buildBookAliasMap();
  await restoreLastBookChapter();
  applyColorTheme(await getPreferredColorTheme());
  await restoreCloudSyncSettings();
  activeProvider.waitForReady(() => {
    void reconnectCloud();

    if (settingsDialog.open) {
      renderSettings();
    }
  });
  await restoreWorkspace();

  const hasSeenOnboarding = await readStoredValue(onboardingStorageKey);

  if (hasSeenOnboarding !== true) {
    openOnboarding({ markSeen: true });
  }
};

void bootstrap();

// The verseDisplay "copy" listener lives inside scripture/viewer.js now.
// The pane-divider mousedown listener moved into layout/panes.js (it's wired
// up at module construction time).

if (sessionStorage.getItem("mobile-warning-dismissed")) {
  mobileWarning.classList.add("is-hidden");
}

mobileWarningDismissButton.addEventListener("click", () => {
  mobileWarning.classList.add("is-hidden");
  sessionStorage.setItem("mobile-warning-dismissed", "1");
});

const betaBanner = document.querySelector("#beta-banner");
const betaBannerDismiss = document.querySelector("#beta-banner-dismiss");

betaBannerDismiss.addEventListener("click", () => {
  betaBanner.classList.add("is-hidden");
});

// ── Header clock ─────────────────────────────────────────────────────────────
// Shown only when the page is in fullscreen mode (CSS gates visibility via
// @media (display-mode: fullscreen)).  The element is updated regardless of
// whether it's visible — the cost of writing two text nodes on a minute
// boundary is trivially small, and not gating it on fullscreen state avoids
// wiring up fullscreenchange listeners.
//
// We render hours, separator, and minutes as three sibling spans so the
// stylesheet can colour the colon in --accent without touching the digits.
{
  const clock = document.querySelector("#header-clock");

  if (clock) {
    const hoursEl = document.createElement("span");
    const sepEl = document.createElement("span");
    const minutesEl = document.createElement("span");
    //sepEl.className = "header-clock-sep";
    sepEl.textContent = ":";
    clock.replaceChildren(hoursEl, sepEl, minutesEl);

    const tick = () => {
      const now = new Date();
      hoursEl.textContent = String(now.getHours()).padStart(2, "0");
      minutesEl.textContent = String(now.getMinutes()).padStart(2, "0");
    };

    tick();

    // Align the first re-tick to the next minute boundary so the displayed
    // time flips to the new minute on the second it actually changes; after
    // that, a plain 60s interval keeps it accurate.
    const msToNextMinute = 60_000 - (Date.now() % 60_000);
    window.setTimeout(() => {
      tick();
      window.setInterval(tick, 60_000);
    }, msToNextMinute);
  }
}

// ── Fullscreen toggle ─────────────────────────────────────────────────────────
{
  const fullscreenBtn = document.querySelector("#fullscreen-button");

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn("[Fullscreen] request failed:", err);
        });
      } else {
        document.exitFullscreen();
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        fullscreenBtn.setAttribute("aria-label", "Exit full screen");
      } else {
        fullscreenBtn.setAttribute("aria-label", "Enter full screen");
      }
    });
  }
}

// Online/offline window listeners and the post-reconnect cloud-sync replay
// live inside core/connectivity.js now.
window.ScriptoriaModules.createConnectivityWatcher({
  windowObject: window,
  refreshSaveStatus: () => refreshSaveStatus(),
  populateTranslationSelect: () => populateTranslationSelect(),
  isSettingsOpen: () => settingsDialog.open,
  renderSettings: () => renderSettings(),
  consumeQueuedCloudSync: () => consumeQueuedCloudSync(),
  hasActiveCloudSession: () => activeProvider.hasActiveSession(),
  pullFromCloud: () => pullFromCloud(),
  syncWorkspaceToCloud: (...args) => syncWorkspaceToCloud(...args)
}).attach();

// ── Service Worker registration ──────────────────────────────────────────────
// Registers sw.js (the offline cache + asset shell).  Two URL flags are
// supported for local testing:
//
//   ?nosw=1  — skip registration entirely.  Use when you want to load the
//              live, uncached version of the app without unregistering an
//              already-installed worker.  The next plain visit re-arms the SW.
//
//   ?reset=1 — unregister any existing SW, delete every cache the page can
//              see, then reload to a clean URL.  One-click clean slate for
//              local iteration.
//
// On a normal visit, when a new SW is installed and waiting, we tell it to
// activate immediately (skipWaiting message) and reload the page on
// `controllerchange` so the user picks up the new shell without a manual
// refresh.
{
  const swParams = new URLSearchParams(location.search);

  if (swParams.has("reset")) {
    // Clean-slate flag — unregister and clear, then redirect back to the page
    // without the flag so a normal load follows.
    (async () => {
      try {
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((reg) => reg.unregister()));
        }
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      } finally {
        const cleanUrl = new URL(location.href);
        cleanUrl.searchParams.delete("reset");
        location.replace(cleanUrl.toString());
      }
    })();
  } else if (!swParams.has("nosw") && "serviceWorker" in navigator) {
    let reloadingForUpdate = false;

    // When the SW that controls this page changes (i.e., a waiting worker
    // activated), reload once so the user gets the new shell.  Guard against
    // reload loops with a flag.
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloadingForUpdate) return;
      reloadingForUpdate = true;
      location.reload();
    });

    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("sw.js");

        // If there's already a waiting worker (page loaded while update was
        // pending), kick it to activate.
        if (registration.waiting) {
          registration.waiting.postMessage("skip-waiting");
        }

        // Future updates: when an update is found and reaches "installed", ask
        // it to skipWaiting so it activates immediately.  Combined with the
        // controllerchange handler above, this means deploys propagate without
        // requiring the user to close and reopen the tab.
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              newWorker.postMessage("skip-waiting");
            }
          });
        });
      } catch (err) {
        console.warn("[SW] registration failed:", err);
      }
    });
  }
}
