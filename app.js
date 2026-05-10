const translationLibrary = {
  KJV: {
    label: "King James Version",
    language: "en",
    copyright: "Public Domain",
    version: 1,
    scriptSrc: "translations\\kjv.js",
    books: null
  },
  NKJV: {
    label: "New King James Version",
    language: "en",
    copyright: "Copyright \u00a9 1982 by Thomas Nelson, Inc.",
    version: 1,
    scriptSrc: "translations\\nkjv.js",
    books: null
  },
  ASV: {
    label: "American Standard Version",
    language: "en",
    copyright: "Public Domain",
    version: 1,
    scriptSrc: "translations\\asv.js",
    books: null
  },
  WEB: {
    label: "World English Bible",
    language: "en",
    copyright: "Public Domain",
    version: 1,
    scriptSrc: "translations\\web.js",
    books: null
  }
};

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
const downloadAllTranslationsButton = document.querySelector("#download-all-translations-button");
const downloadAllTranslationsStatus = document.querySelector("#download-all-translations-status");
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
const cloudSyncStorageKey = "service-notes-cloud-sync";
const colorThemeStorageKey = "service-notes-color-theme";
const colorThemeMirrorStorageKey = "service-notes-color-theme-mirror";
const lastBookChapterStorageKey = "service-notes-last-book-chapter";
const onboardingStorageKey = "service-notes-onboarding-seen";
const customTranslationsStorageKey = "service-notes-custom-translations";
const autoCloudSyncDelayMs = 10000;

const noOpProvider = {
  id: "none",
  displayName: "Storage",
  isAvailable: () => false,
  hasActiveSession: () => false,
  ensureTokenClient: () => {},
  waitForReady: () => {},
  connect: () => Promise.reject(new Error("No storage provider configured.")),
  disconnect: () => {},
  attemptSilentReconnect: () => Promise.reject(new Error("No storage provider configured.")),
  getSettingsFields: () => [],
  getSettingsValues: () => ({}),
  applySettingChange: () => ({}),
  getLocationLabel: () => "",
  upload: () => Promise.reject(new Error("No storage provider configured.")),
  download: () => Promise.reject(new Error("No storage provider configured.")),
  clearRemote: () => Promise.resolve()
};

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
const domainValidationCache = new Map();
const MIN_EMBED_WIDTH = 240;
const EDITOR_HORIZONTAL_PADDING = 40;
const BLOCK_LEVEL_ELEMENTS = "p, h2, h3, h4, h5, h6, li, blockquote";
const knownTlds = [
  "ac","ad","ae","af","ag","ai","al","am","ao","ar","as","at","au","aw","az",
  "ba","bb","bd","be","bf","bg","bh","bi","bj","bm","bn","bo","br","bs","bt","bw","by","bz",
  "ca","cc","cd","cf","cg","ch","ci","ck","cl","cm","cn","co","cr","cu","cv","cw","cx","cy","cz",
  "de","dj","dk","dm","do","dz","ec","ee","eg","er","es","et","eu",
  "fi","fj","fk","fm","fo","fr","ga","gb","gd","ge","gf","gg","gh","gi","gl","gm","gn","gp","gq",
  "gr","gs","gt","gu","gw","gy","hk","hn","hr","ht","hu",
  "id","ie","il","im","in","io","iq","ir","is","it","je","jm","jo","jp",
  "ke","kg","kh","ki","km","kn","kr","kw","ky","kz","la","lb","lc","li","lk","lr","ls","lt","lu","lv","ly",
  "ma","mc","md","me","mg","mh","mk","ml","mm","mn","mo","mp","mq","mr","ms","mt","mu","mv","mw","mx","my","mz",
  "na","nc","ne","nf","ng","ni","nl","no","np","nr","nu","nz",
  "om","pa","pe","pf","pg","ph","pk","pl","pm","pn","pr","ps","pt","pw","py",
  "qa","re","ro","rs","ru","rw","sa","sb","sc","sd","se","sg","sh","si","sk","sl","sm","sn","so",
  "sr","ss","st","sv","sx","sy","sz","tc","td","tf","tg","th","tj","tk","tl","tm","tn","to","tr","tt","tv","tz",
  "ua","ug","us","uy","uz","va","vc","ve","vg","vi","vn","vu","wf","ws",
  "ye","yt","za","zm","zw",
  "com","aero","app","asia","bible","biz","blog","cat","church","cloud","coop","dev",
  "digital","edu","faith","global","gov","health","info","int","io","live",
  "media","mil","ministry","mobi","museum","name","net","news","online","org",
  "pro","shop","site","store","tech","travel","tv","wiki"
];

// Memoised URL detection patterns.  These used to be rebuilt inside linkifyUrls()
// on every keystroke (including a `[...knownTlds].sort()` and a fresh RegExp
// compile for the bare-domain pattern); both knownTlds and the regexes are
// constant for the life of the page, so we build them exactly once here.
const URL_LINKIFY_PATTERNS = (() => {
  const tldGroup = [...knownTlds].sort((a, b) => b.length - a.length).join("|");
  return [
    {
      regex: /\b(https?|ftp|spotify):\/\/[^\s<>"'\)\]]+/gi,
      type: "explicit"
    },
    {
      regex: /\bgopher:\/\/([^\s<>"'\)\]]+)/gi,
      type: "gopher"
    },
    {
      regex: /\bwww\.[a-zA-Z0-9][a-zA-Z0-9\-]*(?:\.[a-zA-Z0-9][a-zA-Z0-9\-]*)+(?:\/[^\s<>"'\)\]]*)?/gi,
      type: "www"
    },
    {
      regex: /\b[a-zA-Z0-9_%+\-]+(?:\.[a-zA-Z0-9_%+\-]+)*@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/gi,
      type: "email"
    },
    {
      regex: new RegExp(
        `\\b(?!www\\.)([a-zA-Z][a-zA-Z0-9\\-]*(?:\\.[a-zA-Z0-9][a-zA-Z0-9\\-]*)*\\.(?:${tldGroup}))(?:\\/[^\\s<>"'\\)\\]]*)?`,
        "gi"
      ),
      type: "bare"
    }
  ];
})();

// Scripture-related state (translation code, focus, search query) lives inside
// the scripture/* modules now.  Other modules read it via accessor calls on
// viewerApi / searchApi.
let activeSettingsTabId = "ui-settings";
let currentColorThemeId = "default";
let currentThemeMode = "system";
let currentPaneSplit = 0.6;
let noteBrowserFilter = "";
let noteBrowserTypeFilter = "all";
let noteBrowserSort = "updated-desc";
let noteBrowserSelectedNoteId = null;
let savedSelectionForTableInsert = null;
let activeTableCell = null;
let contextMenuTableCell = null;
let dbPromise;
let userTranslations = [];
const systemThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

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
    label: "Scripture Abbreviations"
  },
  {
    id: "cloud-sync",
    label: "Sync & Backup"
  },
  {
    id: "translations",
    label: "Bible Translations"
  },
  {
    id: "data",
    label: "Backup & Reset"
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
const normalizeThemeMode = (value) => ["light", "dark", "system"].includes(value) ? value : "system";
const getSystemTheme = () => systemThemeMediaQuery.matches ? "dark" : "light";

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

const syncThemePreferenceMirrors = () => {
  writeMirroredPreference(themeMirrorStorageKey, normalizeThemeMode(currentThemeMode));
  writeMirroredPreference(colorThemeMirrorStorageKey, currentColorThemeId || "default");
};

const clearThemePreferenceMirrors = () => {
  writeMirroredPreference(themeMirrorStorageKey, null);
  writeMirroredPreference(colorThemeMirrorStorageKey, null);
};

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

const getPreferredTheme = async () => {
  const savedTheme = await migrateLegacyPreference(themeStorageKey);

  return normalizeThemeMode(savedTheme ?? readMirroredPreference(themeMirrorStorageKey));
};

const getPreferredPaneOrder = async () => {
  const savedOrder = await migrateLegacyPreference(paneOrderStorageKey);
  return savedOrder === "scripture-first" ? "scripture-first" : "notes-first";
};

const getPreferredSplit = async () => {
  const saved = await readStoredValue(paneSplitStorageKey);
  return typeof saved === "number" && saved >= 0.2 && saved <= 0.8 ? saved : 0.6;
};

// getPreferredTranslation, saveLastBookChapter, and restoreLastBookChapter
// have moved to scripture/viewer.js and are destructured back into this scope
// from viewerApi above.

const getResolvedThemeForMode = (mode = currentThemeMode, themeId = currentColorThemeId) => {
  const normalizedMode = normalizeThemeMode(mode);
  const requestedTheme = normalizedMode === "system" ? getSystemTheme() : normalizedMode;
  const themeDef = colorThemes.find((theme) => theme.id === themeId);

  if (themeDef?.supports === "light") {
    return "light";
  }

  if (themeDef?.supports === "dark") {
    return "dark";
  }

  return requestedTheme;
};

const syncThemeModeControl = (mode = currentThemeMode) => {
  const select = document.querySelector("#ui-theme-mode-select");

  if (select) {
    select.value = normalizeThemeMode(mode);
  }
};

const applyThemeMode = (mode, { persist = false, markChange = false, rerender = true } = {}) => {
  currentThemeMode = normalizeThemeMode(mode);
  document.documentElement.dataset.theme = getResolvedThemeForMode(currentThemeMode);
  syncThemeModeControl(currentThemeMode);
  syncThemePreferenceMirrors();

  if (persist) {
    void writeStoredValue(themeStorageKey, currentThemeMode);
  }

  if (markChange) {
    markLocalSettingsUpdated();
    scheduleAutoCloudSync();
  }

  if (rerender) {
    if (settingsDialog.open) {
      renderSettings();
    }
  }
};

const syncPaneOrderToggle = (order) => {
  const scriptureFirst = order === "scripture-first";
  const btn = document.querySelector("#ui-scripture-left-toggle");

  if (btn) {
    btn.setAttribute("aria-pressed", String(scriptureFirst));
    const state = btn.querySelector(".ui-toggle-state");

    if (state) {
      state.textContent = scriptureFirst ? "On" : "Off";
    }
  }
};

const applySplit = (fraction) => {
  currentPaneSplit = Math.max(0.2, Math.min(0.8, fraction));
  const isScriptureFirst = paneGrid.dataset.order === "scripture-first";

  if (isScriptureFirst) {
    paneGrid.style.gridTemplateColumns = `minmax(0, ${1 - currentPaneSplit}fr) 20px minmax(320px, ${currentPaneSplit}fr)`;
  } else {
    paneGrid.style.gridTemplateColumns = `minmax(0, ${currentPaneSplit}fr) 20px minmax(320px, ${1 - currentPaneSplit}fr)`;
  }
};

const applyPaneOrder = (order) => {
  paneGrid.dataset.order = order;
  syncPaneOrderToggle(order);
  applySplit(currentPaneSplit);
};

const togglePaneOrder = () => {
  const currentOrder = paneGrid.dataset.order === "scripture-first" ? "scripture-first" : "notes-first";
  const nextOrder = currentOrder === "scripture-first" ? "notes-first" : "scripture-first";
  void writeStoredValue(paneOrderStorageKey, nextOrder);
  applyPaneOrder(nextOrder);
  markLocalSettingsUpdated();
  scheduleAutoCloudSync();
};

const getPreferredColorTheme = async () => {
  const saved = await readStoredValue(colorThemeStorageKey);
  const mirrored = readMirroredPreference(colorThemeMirrorStorageKey);
  const validIds = colorThemes.map((t) => t.id);
  if (validIds.includes(saved)) {
    return saved;
  }

  return validIds.includes(mirrored) ? mirrored : "default";
};

const applyColorTheme = (themeId) => {
  currentColorThemeId = themeId;

  if (themeId === "default") {
    document.documentElement.removeAttribute("data-color-theme");
  } else {
    document.documentElement.dataset.colorTheme = themeId;
  }

  const themeDef = colorThemes.find((t) => t.id === themeId);

  if (themeDef) {
    if (themeDef.supports === "light" && currentThemeMode === "dark") {
      applyThemeMode("light", { persist: true, rerender: false });
    } else if (themeDef.supports === "dark" && currentThemeMode === "light") {
      applyThemeMode("dark", { persist: true, rerender: false });
    } else {
      document.documentElement.dataset.theme = getResolvedThemeForMode(currentThemeMode, themeId);
    }
  }

  if (settingsDialog.open) {
    renderSettings();
  }

  syncThemePreferenceMirrors();
};

// populateBookOptions / populateChapterOptions / renderChapter / applyTranslation
// have moved to scripture/viewer.js.



// parseSearchQuery / buildHighlightedTextContent / renderScriptureSearchResults
// / performScriptureSearch have moved to scripture/search.js.

const applyCommand = (command) => {
  noteEditor.focus();
  document.execCommand(command, false);
};

const applyBlock = (block) => {
  noteEditor.focus();
  const range = getEditorRange();
  const currentBlock = range
    ? getClosestEditorElement(range.commonAncestorContainer, BLOCK_LEVEL_ELEMENTS)
    : null;
  const isActive = currentBlock?.tagName.toLowerCase() === block.toLowerCase();
  document.execCommand("formatBlock", false, isActive ? "p" : block);
};

const getEditorRange = () => {
  const selection = window.getSelection();

  if (!selection || !selection.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);
  return noteEditor.contains(range.commonAncestorContainer) ? range : null;
};

const saveEditorSelection = () => {
  const range = getEditorRange();
  return range ? range.cloneRange() : null;
};

const restoreEditorSelection = (savedRange) => {
  if (!savedRange) {
    return false;
  }

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(savedRange);
  return true;
};

const getClosestEditorElement = (node, selector) => {
  if (!node) {
    return null;
  }

  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  return element?.closest(selector) ?? null;
};

const ensureEditableCellContent = (cell) => {
  if (!cell) {
    return;
  }

  if (!cell.innerHTML.trim()) {
    cell.innerHTML = "<br>";
  }
};

const focusTableCell = (cell) => {
  if (!cell) {
    return;
  }

  ensureEditableCellContent(cell);
  noteEditor.focus();
  const range = document.createRange();
  range.selectNodeContents(cell);
  range.collapse(true);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

const getTableCellFromSelection = () => {
  const range = getEditorRange();

  if (!range) {
    return null;
  }

  const candidate = getClosestEditorElement(range.startContainer, "td, th");
  return candidate && noteEditor.contains(candidate) ? candidate : null;
};

const getTableContext = (cell) => {
  if (!cell) {
    return null;
  }

  const table = cell.closest("table");
  const row = cell.parentElement;

  if (!table || !row) {
    return null;
  }

  return {
    cell,
    row,
    table,
    rowIndex: [...table.rows].indexOf(row),
    columnIndex: [...row.cells].indexOf(cell)
  };
};

const isEditorSpacerNode = (node) => {
  if (!node) {
    return false;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    return !node.textContent.replace(/\u200b/g, "").trim();
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const tagName = node.tagName;

  if (tagName === "BR") {
    return true;
  }

  if (!["P", "DIV"].includes(tagName)) {
    return false;
  }

  if (node.querySelector("table, img, iframe, ul, ol, blockquote, h2, h3, h4, h5, h6")) {
    return false;
  }

  const textContent = node.textContent.replace(/\u200b/g, "").replace(/\u00a0/g, "").trim();

  if (textContent) {
    return false;
  }

  const htmlWithoutBreaks = node.innerHTML
    .replace(/<br\s*\/?>/gi, "")
    .replace(/&nbsp;/gi, "")
    .replace(/\s+/g, "");

  return htmlWithoutBreaks === "";
};

const trimEditorLeadingSpacerNodes = () => {
  while (isEditorSpacerNode(noteEditor.firstChild)) {
    noteEditor.firstChild.remove();
  }
};

const isEditorEffectivelyEmpty = () => {
  if (!noteEditor.childNodes.length) {
    return true;
  }

  return [...noteEditor.childNodes].every((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return !node.textContent.replace(/\u200b/g, "").replace(/\u00a0/g, "").trim();
    }

    return isEditorSpacerNode(node);
  });
};

const updateNoteEditorPlaceholderState = () => {
  noteEditor.classList.toggle("is-empty", isEditorEffectivelyEmpty());
};

const getCaretTextOffset = (root) => {
  const selection = window.getSelection();

  if (!selection.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);

  if (!root.contains(range.startContainer)) {
    return null;
  }

  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(root);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  return preCaretRange.toString().length;
};

const restoreCaretTextOffset = (root, targetOffset) => {
  if (targetOffset === null) {
    return;
  }

  const selection = window.getSelection();
  const range = document.createRange();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentOffset = 0;
  let currentNode;

  while ((currentNode = walker.nextNode())) {
    const nextOffset = currentOffset + currentNode.nodeValue.length;

    if (targetOffset <= nextOffset) {
      range.setStart(currentNode, targetOffset - currentOffset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    currentOffset = nextOffset;
  }

  range.selectNodeContents(root);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

// Return the top-level block under noteEditor that contains `node`, or null if
// `node` is not within the editor.  Used to scope linkification to just the
// paragraph the user is editing, instead of re-scanning the whole document.
const getEditorBlockContaining = (node) => {
  if (!node) {
    return null;
  }

  let element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;

  while (element && element.parentElement && element.parentElement !== noteEditor) {
    element = element.parentElement;
  }

  if (!element || element === noteEditor || !noteEditor.contains(element)) {
    return null;
  }

  return element.parentElement === noteEditor ? element : null;
};

// The block currently containing the caret, or null.
const getCaretBlock = () => {
  const selection = window.getSelection();

  if (!selection || !selection.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);

  if (!noteEditor.contains(range.startContainer)) {
    return null;
  }

  return getEditorBlockContaining(range.startContainer);
};

// ─── BEGIN scripture-functions-removed-block ──────────────────────────────
// Everything from isValidScriptureReference through jumpToScripture has moved
// to scripture/references.js (parsing/formatting) and scripture/viewer.js
// (jumpTo*).  The original definitions used to live here; the destructured
// bindings near the top of this file (referencesApi / viewerApi) re-export
// the same names back into the app.js scope so the linkify code below
// continues to work without per-call changes.
const unwrapAutoScriptureLinks = (root = noteEditor) => {
  root.querySelectorAll("a[data-auto-scripture-link='true']").forEach((link) => {
    link.replaceWith(document.createTextNode(link.textContent));
  });

  root.normalize();
};

// Find the most recent scripture reference (in document order) BEFORE `scope`.
// Used to seed `currentContext` when linkification is restricted to a single
// block — a contextual reference like "v3" in the current paragraph still needs
// to know the most recent book/chapter from earlier paragraphs.
const findScriptureContextBefore = (scope) => {
  if (!scope) {
    return null;
  }

  const allLinks = noteEditor.querySelectorAll("a[data-scripture-ref]");

  for (let i = allLinks.length - 1; i >= 0; i--) {
    const link = allLinks[i];
    const cmp = scope.compareDocumentPosition(link);

    // PRECEDING set means `link` comes before `scope` in document order.
    if ((cmp & Node.DOCUMENT_POSITION_PRECEDING) && !(cmp & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
      const parsed = parseScriptureReference(link.dataset.scriptureRef);
      if (parsed) {
        return getReferenceContext(parsed);
      }
    }
  }

  return null;
};

const linkifyScriptureReferences = ({ jumpToCaretReference = false, scope = null } = {}) => {
  const root = (scope && noteEditor.contains(scope)) ? scope : noteEditor;
  const caretOffset = getCaretTextOffset(root);
  unwrapAutoScriptureLinks(root);
  // Read regex patterns through the alias-module getters: they're rebuilt
  // whenever buildBookAliasMap runs (translation switch / alias edit), so
  // capturing them via a stale local would silently miss references after a
  // rebuild.
  const explicitPattern = aliasesApi.getExplicitPattern();
  const contextualPattern = aliasesApi.getContextualPattern();
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        if (node.parentElement?.closest("a")) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let currentNode;
  // When scoped to a single block, seed currentContext from the latest scripture
  // reference in earlier blocks so contextual matches like "v5" still resolve.
  let currentContext = root === noteEditor ? null : findScriptureContextBefore(root);
  let traversedOffset = 0;
  let lastReferenceBeforeCaret = null;

  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode);
  }

  textNodes.forEach((textNode) => {
    const sourceText = textNode.nodeValue;
    explicitPattern.lastIndex = 0;
    contextualPattern.lastIndex = 0;
    const explicitMatches = [...sourceText.matchAll(explicitPattern)];
    const contextualMatches = [...sourceText.matchAll(contextualPattern)];
    const matches = [...explicitMatches, ...contextualMatches]
      .sort((left, right) => left.index - right.index);

    if (!matches.length) {
      traversedOffset += sourceText.length;
      return;
    }

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let hadResolvedMatch = false;

    matches.forEach((match) => {
      const matchedText = match[0];
      const resolvedParts = match.length > 2
        ? parseExplicitReferenceParts(matchedText).map((part) => ({
            text: part.text,
            parsedReference: part.parsedReference
          }))
        : [{
            text: matchedText,
            parsedReference: parseContextualScriptureReference(matchedText, currentContext)
          }].filter((part) => part.parsedReference);

      if (!resolvedParts.length) {
        return;
      }

      if (match.index > lastIndex) {
        fragment.append(document.createTextNode(sourceText.slice(lastIndex, match.index)));
      }

      resolvedParts.forEach((part) => {
        const link = document.createElement("a");
        link.href = "#";
        link.className = "scripture-link";
        link.dataset.autoScriptureLink = "true";
        link.dataset.scriptureRef = formatResolvedReference(part.parsedReference);
        link.textContent = part.text;
        fragment.append(link);
        currentContext = getReferenceContext(part.parsedReference);
        hadResolvedMatch = true;
      });

      lastIndex = match.index + matchedText.length;

      if (caretOffset !== null && traversedOffset + lastIndex <= caretOffset) {
        lastReferenceBeforeCaret = resolvedParts[resolvedParts.length - 1].parsedReference;
      }
    });

    if (!hadResolvedMatch) {
      traversedOffset += sourceText.length;
      return;
    }

    if (lastIndex < sourceText.length) {
      fragment.append(document.createTextNode(sourceText.slice(lastIndex)));
    }

    textNode.parentNode.replaceChild(fragment, textNode);
    traversedOffset += sourceText.length;
  });

  restoreCaretTextOffset(root, caretOffset);

  if (jumpToCaretReference && lastReferenceBeforeCaret) {
    jumpToResolvedScripture(lastReferenceBeforeCaret);
  }
};

const unwrapAutoUrlLinks = (root = noteEditor) => {
  root.querySelectorAll("a[data-auto-url-link='true']").forEach((link) => {
    link.replaceWith(document.createTextNode(link.textContent));
  });

  root.normalize();
};

// Unified embed selector — derived at runtime from the registered embed classes so
// that adding a new embed type only requires registering it in its own file.
const EMBED_SELECTOR = EmbedBase.selector;

const ensureTrailingParagraph = () => {
  const last = noteEditor.lastElementChild;

  if (last && last.matches(EMBED_SELECTOR)) {
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    noteEditor.appendChild(p);
  }
};

const ensureLeadingParagraph = () => {
  const first = noteEditor.firstElementChild;

  if (first && first.matches(EMBED_SELECTOR)) {
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    noteEditor.prepend(p);
  }
};


const insertImageAtCaret = (src, width = ImageEmbed.DEFAULT_WIDTH) => {
  noteEditor.focus();
  const embed = new ImageEmbed().create(src, { width });
  const emptyParagraph = document.createElement("p");
  emptyParagraph.innerHTML = "<br>";

  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);

    if (noteEditor.contains(range.commonAncestorContainer)) {
      let block = range.startContainer;

      while (block && block.parentNode !== noteEditor) {
        block = block.parentNode;
      }

      if (block && block !== noteEditor) {
        const blockText = block.textContent.trim();
        const blockHtml = block.innerHTML?.trim() ?? "";

        if (!blockText && (!blockHtml || blockHtml === "<br>")) {
          block.replaceWith(embed, emptyParagraph);
        } else {
          block.after(embed, emptyParagraph);
        }
      } else {
        noteEditor.append(embed, emptyParagraph);
      }
    } else {
      noteEditor.append(embed, emptyParagraph);
    }
  } else {
    noteEditor.append(embed, emptyParagraph);
  }

  const newRange = document.createRange();
  newRange.setStart(emptyParagraph, 0);
  newRange.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(newRange);

  saveActiveNote();
};

const buildTableMarkup = (rows, columns, markerId) => {
  const safeRows = Math.max(1, Math.min(20, rows));
  const safeColumns = Math.max(1, Math.min(12, columns));
  let body = "";

  for (let rowIndex = 0; rowIndex < safeRows; rowIndex += 1) {
    let cells = "";

    for (let columnIndex = 0; columnIndex < safeColumns; columnIndex += 1) {
      cells += "<td><br></td>";
    }

    body += `<tr>${cells}</tr>`;
  }

  return `<table class="note-table" data-table-marker="${markerId}"><tbody>${body}</tbody></table><p><br></p>`;
};

const closeTableContextMenu = () => {
  tableContextMenu.hidden = true;
  contextMenuTableCell = null;
};

const refreshTableUi = () => {
  const currentCell = getTableCellFromSelection();
  activeTableCell = currentCell;
  tableToolbar.toggleAttribute("hidden", !currentCell);

  if (!currentCell) {
    closeTableContextMenu();
  }
};

const insertTableAtSelection = (rows, columns) => {
  noteEditor.focus();
  const restoredSelection = restoreEditorSelection(savedSelectionForTableInsert);

  if (!restoredSelection && !getEditorRange()) {
    const range = document.createRange();
    range.selectNodeContents(noteEditor);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  const markerId = `table-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const currentTable = getTableCellFromSelection()?.closest("table");
  let insertedTable = null;

  if (currentTable && noteEditor.contains(currentTable)) {
    const fragmentHost = document.createElement("div");
    fragmentHost.innerHTML = buildTableMarkup(rows, columns, markerId);
    const insertedNodes = [...fragmentHost.childNodes];
    currentTable.after(...insertedNodes);
    insertedTable = insertedNodes.find((node) => node.nodeName === "TABLE") ?? null;
  } else {
    document.execCommand("insertHTML", false, buildTableMarkup(rows, columns, markerId));
    insertedTable = noteEditor.querySelector(`[data-table-marker="${markerId}"]`);
  }

  if (!insertedTable) {
    saveActiveNote();
    refreshTableUi();
    return;
  }

  insertedTable.removeAttribute("data-table-marker");
  const firstCell = insertedTable.rows[0]?.cells[0] ?? null;

  if (firstCell) {
    focusTableCell(firstCell);
  }

  savedSelectionForTableInsert = null;
  saveActiveNote();
  refreshTableUi();
};

const getTableActionContext = () => getTableContext(contextMenuTableCell ?? activeTableCell);

const isLastTableCell = (context) => {
  if (!context) {
    return false;
  }

  const isLastRow = context.rowIndex === context.table.rows.length - 1;
  const isLastColumn = context.columnIndex === context.row.cells.length - 1;
  return isLastRow && isLastColumn;
};

const getNextTableCell = (context) => {
  if (!context) {
    return null;
  }

  const nextCellInRow = context.row.cells[context.columnIndex + 1];

  if (nextCellInRow) {
    return nextCellInRow;
  }

  const nextRow = context.table.rows[context.rowIndex + 1];
  return nextRow?.cells[0] ?? null;
};

const createEmptyParagraph = () => {
  const paragraph = document.createElement("p");
  paragraph.innerHTML = "<br>";
  return paragraph;
};

const focusAfterTableRemoval = (table) => {
  let focusTarget = table.nextElementSibling;

  if (!focusTarget || !noteEditor.contains(focusTarget)) {
    focusTarget = createEmptyParagraph();
    table.after(focusTarget);
  }

  noteEditor.focus();
  const range = document.createRange();
  range.selectNodeContents(focusTarget);
  range.collapse(true);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

const insertTableRow = (context, offset, focusColumnIndex = context.columnIndex) => {
  const { table, rowIndex, columnIndex } = context;
  const insertIndex = offset < 0 ? rowIndex : rowIndex + 1;
  const columnCount = table.rows[0]?.cells.length ?? 0;
  const row = table.insertRow(insertIndex);

  for (let index = 0; index < columnCount; index += 1) {
    const cell = row.insertCell();
    cell.innerHTML = "<br>";
  }

  focusTableCell(row.cells[Math.min(focusColumnIndex, row.cells.length - 1)] ?? row.cells[0] ?? null);
};

const deleteTableRow = (context) => {
  const { table, rowIndex, columnIndex } = context;

  if (table.rows.length <= 1) {
    focusAfterTableRemoval(table);
    table.remove();
    return;
  }

  table.deleteRow(rowIndex);
  const nextRow = table.rows[Math.min(rowIndex, table.rows.length - 1)];
  focusTableCell(nextRow?.cells[Math.min(columnIndex, nextRow.cells.length - 1)] ?? nextRow?.cells[0] ?? null);
};

const insertTableColumn = (context, offset) => {
  const { table, columnIndex, rowIndex } = context;
  const insertIndex = offset < 0 ? columnIndex : columnIndex + 1;

  [...table.rows].forEach((row) => {
    const cell = row.insertCell(insertIndex);
    cell.innerHTML = "<br>";
  });

  const targetRow = table.rows[rowIndex] ?? table.rows[0];
  focusTableCell(targetRow?.cells[insertIndex] ?? null);
};

const deleteTableColumn = (context) => {
  const { table, columnIndex, rowIndex } = context;
  const columnCount = table.rows[0]?.cells.length ?? 0;

  if (columnCount <= 1) {
    focusAfterTableRemoval(table);
    table.remove();
    return;
  }

  [...table.rows].forEach((row) => {
    if (row.cells[columnIndex]) {
      row.deleteCell(columnIndex);
    }
  });

  const targetRow = table.rows[Math.min(rowIndex, table.rows.length - 1)] ?? null;
  const nextColumnIndex = Math.min(columnIndex, (targetRow?.cells.length ?? 1) - 1);
  focusTableCell(targetRow?.cells[nextColumnIndex] ?? null);
};

const deleteTableAtContext = (context) => {
  const { table } = context;
  focusAfterTableRemoval(table);
  table.remove();
};

const runTableAction = (action) => {
  const context = getTableActionContext();

  if (!context) {
    return;
  }

  switch (action) {
    case "insert-row-above":
      insertTableRow(context, -1);
      break;
    case "insert-row-below":
      insertTableRow(context, 1);
      break;
    case "delete-row":
      deleteTableRow(context);
      break;
    case "insert-column-left":
      insertTableColumn(context, -1);
      break;
    case "insert-column-right":
      insertTableColumn(context, 1);
      break;
    case "delete-column":
      deleteTableColumn(context);
      break;
    case "delete-table":
      deleteTableAtContext(context);
      break;
    default:
      return;
  }

  closeTableContextMenu();
  saveActiveNote();
  refreshTableUi();
};

const openTableContextMenu = (cell, x, y) => {
  contextMenuTableCell = cell;
  const margin = 12;
  tableContextMenu.hidden = false;
  const menuRect = tableContextMenu.getBoundingClientRect();
  const maxX = window.innerWidth - menuRect.width - margin;
  const maxY = window.innerHeight - menuRect.height - margin;
  tableContextMenu.style.left = `${Math.max(margin, Math.min(x, maxX))}px`;
  tableContextMenu.style.top = `${Math.max(margin, Math.min(y, maxY))}px`;
};

const processImageFiles = (files) => {
  [...files].forEach((file) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      insertImageAtCaret(e.target.result);
    };

    reader.readAsDataURL(file);
  });
};

// Returns the nearest block-level ancestor of `link` that is a direct (or nested) child of
// noteEditor, but never noteEditor itself.  Includes <div> because Chrome's contenteditable
// wraps paragraphs in <div> elements by default.
const findLinkBlock = (link) => {
  const block = link.closest("p, div, h2, h3, h4, h5, h6, li, blockquote");
  return (block && block !== noteEditor) ? block : null;
};

const processUrlEmbeds = (scope = null) => {
  const root = (scope && noteEditor.contains(scope)) ? scope : noteEditor;

  root.querySelectorAll("a[data-auto-url-link='true']").forEach((link) => {
    const match = EmbedBase.matchUrl(link.href);

    if (!match) {
      return;
    }

    const block = findLinkBlock(link);

    if (!block) {
      return;
    }

    const cloned = block.cloneNode(true);
    cloned.querySelectorAll("a").forEach((anchor) => anchor.remove());
    const remainingText = cloned.textContent.trim();

    if (remainingText) {
      return;
    }

    const embed = match.handler.create(match.data);
    const emptyParagraph = document.createElement("p");
    emptyParagraph.innerHTML = "<br>";
    block.replaceWith(embed, emptyParagraph);
  });

  ensureTrailingParagraph();
};

const validateDomainWithDoh = async (domain) => {
  domainValidationCache.set(domain, "pending");

  try {
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`,
      { headers: { Accept: "application/dns-json" }, signal: AbortSignal.timeout(5000) }
    );
    const data = await response.json();
    const isValid = data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
    domainValidationCache.set(domain, isValid);

    if (isValid) {
      linkifyUrls();
      processUrlEmbeds();
    }
  } catch {
    domainValidationCache.set(domain, false);
  }
};

const linkifyUrls = ({ suppressAtCaret = false, scope = null } = {}) => {
  // urlPatterns is a module-level constant (URL_LINKIFY_PATTERNS) — recompiled
  // exactly once at startup, not on every keystroke.
  const urlPatterns = URL_LINKIFY_PATTERNS;
  const root = (scope && noteEditor.contains(scope)) ? scope : noteEditor;

  const caretOffset = getCaretTextOffset(root);
  unwrapAutoUrlLinks(root);

  const globalOffsets = new Map();

  if (suppressAtCaret && caretOffset !== null) {
    const allTextWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let offset = 0;
    let n;

    while ((n = allTextWalker.nextNode())) {
      globalOffsets.set(n, offset);
      offset += n.nodeValue.length;
    }
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        if (node.parentElement?.closest("a")) {
          return NodeFilter.FILTER_REJECT;
        }

        if (node.parentElement?.closest(EMBED_SELECTOR)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let currentNode;

  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode);
  }

  textNodes.forEach((textNode) => {
    const sourceText = textNode.nodeValue;
    const nodeGlobalStart = globalOffsets.get(textNode) ?? 0;

    const allMatches = [];

    for (const { regex, type } of urlPatterns) {
      regex.lastIndex = 0;

      for (const match of sourceText.matchAll(regex)) {
        allMatches.push({ match, type });
      }
    }

    if (!allMatches.length) {
      return;
    }

    allMatches.sort((a, b) => a.match.index - b.match.index);

    const deduped = [];
    let lastEnd = 0;

    for (const item of allMatches) {
      if (item.match.index >= lastEnd) {
        deduped.push(item);
        lastEnd = item.match.index + item.match[0].length;
      }
    }

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let anyLinksAdded = false;

    for (const { match, type } of deduped) {
      const matchedText = match[0];
      let href;

      if (type === "bare") {
        const domain = matchedText.split("/")[0].split("?")[0].split("#")[0];
        const cacheEntry = domainValidationCache.get(domain);

        if (!cacheEntry) {
          validateDomainWithDoh(domain);
          continue;
        }

        if (cacheEntry !== true) {
          continue;
        }

        href = `https://${matchedText}`;
      } else if (type === "explicit") {
        const spotifyWebMatch = matchedText.match(/^https?:\/\/open\.spotify\.com\/([a-zA-Z]+)\/([a-zA-Z0-9]+)/);
        href = spotifyWebMatch ? `spotify:${spotifyWebMatch[1]}:${spotifyWebMatch[2]}` : matchedText;
      } else if (type === "gopher") {
        href = `https://gopherproxy.meulie.net/${match[1]}`;
      } else if (type === "www") {
        href = `https://${matchedText}`;
      } else if (type === "email") {
        href = `mailto:${matchedText}`;
      }

      if (suppressAtCaret && caretOffset !== null && caretOffset === nodeGlobalStart + match.index + match[0].length) {
        continue;
      }

      if (match.index > lastIndex) {
        fragment.append(document.createTextNode(sourceText.slice(lastIndex, match.index)));
      }

      const link = document.createElement("a");
      link.href = href;
      link.className = "url-link";
      link.dataset.autoUrlLink = "true";
      link.textContent = matchedText;

      if (type !== "email") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      fragment.append(link);
      lastIndex = match.index + matchedText.length;
      anyLinksAdded = true;
    }

    if (!anyLinksAdded) {
      return;
    }

    if (lastIndex < sourceText.length) {
      fragment.append(document.createTextNode(sourceText.slice(lastIndex)));
    }

    textNode.parentNode.replaceChild(fragment, textNode);
  });

  restoreCaretTextOffset(root, caretOffset);
};

const getPreviousNodeFromCaret = (root, node) => {
  let current = node;

  while (current && current !== root) {
    if (current.previousSibling) {
      current = current.previousSibling;

      while (current.lastChild) {
        current = current.lastChild;
      }

      return current;
    }

    current = current.parentNode;
  }

  return null;
};

const findAutoLinkBeforeCaret = () => {
  const selection = window.getSelection();

  if (!selection.rangeCount || !selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0);
  let candidate = null;

  if (range.startContainer.nodeType === Node.TEXT_NODE) {
    if (range.startOffset !== 0) {
      return null;
    }

    candidate = getPreviousNodeFromCaret(noteEditor, range.startContainer);
  } else if (range.startOffset > 0) {
    candidate = range.startContainer.childNodes[range.startOffset - 1];

    while (candidate?.lastChild) {
      candidate = candidate.lastChild;
    }
  }

  if (candidate?.nodeType === Node.TEXT_NODE) {
    candidate = candidate.parentElement;
  }

  return candidate?.matches?.("a[data-auto-scripture-link='true'], a[data-auto-url-link='true']") ? candidate : null;
};

const findAutoLinkAtCaret = () => {
  const selection = window.getSelection();

  if (!selection.rangeCount || !selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0);

  if (range.startContainer.nodeType === Node.TEXT_NODE) {
    const parentLink = range.startContainer.parentElement?.closest("a[data-auto-scripture-link='true'], a[data-auto-url-link='true']");

    if (parentLink && range.startOffset === range.startContainer.nodeValue.length) {
      return parentLink;
    }
  }

  if (range.startContainer.nodeType === Node.ELEMENT_NODE && range.startOffset > 0) {
    const previousNode = range.startContainer.childNodes[range.startOffset - 1];
    const previousLink = previousNode?.nodeType === Node.ELEMENT_NODE
      ? previousNode.closest?.("a[data-auto-scripture-link='true'], a[data-auto-url-link='true']") ?? previousNode
      : previousNode?.parentElement?.closest("a[data-auto-scripture-link='true'], a[data-auto-url-link='true']");

    if (previousLink?.matches?.("a[data-auto-scripture-link='true'], a[data-auto-url-link='true']")) {
      return previousLink;
    }
  }

  return findAutoLinkBeforeCaret();
};

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

const saveActiveNote = () => {
  const activeNote = getActiveNote();

  if (!activeNote) {
    return;
  }

  if (pendingEditorPersistTimer) {
    window.clearTimeout(pendingEditorPersistTimer);
    pendingEditorPersistTimer = null;
  }
  pendingEditorPersistDirty = false;

  activeNote.content = serializeNoteEditorContent();
  syncActiveNoteMetadata(activeNote);
  touchNote(activeNote);
  persistWorkspace();
  // Phase 3: refreshNoteSurfaces() rebuilds the active note summary, the
  // new-note-type selector, and the metadata summary.  None of those depend on
  // editor *content* (they're driven by metadata + types), so we no longer
  // refresh them on every editor save.  The metadata-fields input handler
  // (noteMetaFields "input" listener) is responsible for refreshing surfaces
  // when metadata actually changes.
  refreshSaveStatus();
};

const serializeNoteEditorContent = () => {
  // Hot-path optimisation: cloneNode(true) on the whole editor + a follow-up innerHTML
  // serialisation is the most expensive thing this function does.  When typing, the
  // editor almost never contains [data-embed-ghost] (only present while keyboard-
  // navigating around an embed) or [data-embed-dragging] (only during drag).  In the
  // common case we can skip the clone entirely and read innerHTML directly.
  const hasMutationMarkers = noteEditor.querySelector(
    "[data-embed-ghost], [data-embed-dragging]"
  ) !== null;

  let serializedContent;

  if (hasMutationMarkers) {
    // Produce a clean copy of the editor content:
    // • remove empty ghost paragraphs (they only exist for keyboard navigation)
    // • strip the ghost marker from non-empty paragraphs (user typed there)
    // • strip the drag-state marker so it is never persisted
    const editorClone = noteEditor.cloneNode(true);

    editorClone.querySelectorAll("[data-embed-ghost]").forEach((ghost) => {
      const empty = !ghost.textContent && (!ghost.innerHTML || ghost.innerHTML === "<br>");

      if (empty) {
        ghost.remove();
      } else {
        ghost.removeAttribute("data-embed-ghost");
      }
    });

    editorClone.querySelectorAll("[data-embed-dragging]").forEach((el) => {
      el.removeAttribute("data-embed-dragging");
    });

    serializedContent = editorClone.innerHTML;
  } else {
    serializedContent = noteEditor.innerHTML;
  }

  return serializedContent;
};

const syncActiveNoteMetadata = (note) => {
  noteMetaFields.querySelectorAll("[data-field-id]").forEach((input) => {
    note.metadata[input.dataset.fieldId] = input.value;
  });
};

const syncActiveNoteFromEditor = ({ syncMetadata = false } = {}) => {
  const activeNote = getActiveNote();

  if (!activeNote) {
    return null;
  }

  activeNote.content = serializeNoteEditorContent();

  if (syncMetadata) {
    syncActiveNoteMetadata(activeNote);
  }

  touchNote(activeNote);
  return activeNote;
};

let pendingEditorWorkTimer = null;
let pendingEditorPersistTimer = null;
let pendingEditorInputType = null;
let pendingEditorWorkDirty = false;
let pendingEditorPersistDirty = false;
const editorWorkDebounceMs = 150;
const editorPersistDebounceMs = 1000;

const runPendingEditorPersistence = () => {
  pendingEditorPersistTimer = null;

  if (!pendingEditorPersistDirty) {
    return;
  }

  pendingEditorPersistDirty = false;
  persistWorkspace();
  refreshSaveStatus();
};

// ── Editor work scheduler ─────────────────────────────────────────────────────
// Every keystroke in noteEditor used to synchronously run the full set of:
//   • linkifyScriptureReferences (full-document tree walk + giant alias regex)
//   • linkifyUrls                (full-document tree walk + 5 regex patterns)
//   • processUrlEmbeds           (auto-link → embed conversion)
//   • saveActiveNote             (cloneNode + innerHTML + persistWorkspace)
// In a long note the cumulative cost dwarfs the actual character insert and
// produces visible lag.  We coalesce all of that work into a trailing-debounced
// pass that runs ~150 ms after the user stops typing.  Anything that needs to
// see the latest content immediately (note switching, manual sync, beforeunload)
// calls flushEditorWorkNow() to drain the pending pass synchronously.
const runPendingEditorWork = () => {
  pendingEditorWorkTimer = null;

  if (!pendingEditorWorkDirty) {
    return;
  }

  pendingEditorWorkDirty = false;
  const inputType = pendingEditorInputType;
  pendingEditorInputType = null;

  // Phase 2: scope the heavy regex/text-node walks to just the block currently
  // containing the caret.  When the user is typing in one paragraph there's no
  // need to re-scan the rest of the document.  Paste is the exception — pasted
  // content can span multiple blocks, so fall back to a full scan.
  const caretBlock = inputType === "insertFromPaste" ? null : getCaretBlock();

  linkifyScriptureReferences({ jumpToCaretReference: true, scope: caretBlock });
  linkifyUrls({
    suppressAtCaret: inputType !== "insertFromPaste",
    scope: caretBlock
  });
  processUrlEmbeds(caretBlock);

  // If the cursor was orphaned because an embed replaced its containing block
  // (e.g. user pressed Space after a lone URL), move it to the trailing empty
  // paragraph.  Same logic that used to live inline at the end of the input
  // handler — kept here so it runs after the (now-deferred) embed pass.
  const sel = window.getSelection();
  const container = sel.rangeCount ? sel.getRangeAt(0).startContainer : null;

  if (container && (!noteEditor.contains(container) || container === noteEditor)) {
    const emptyPara = [...noteEditor.querySelectorAll("p")]
      .findLast((p) => !p.textContent.trim());

    if (emptyPara) {
      const r = document.createRange();
      r.setStart(emptyPara, 0);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  }

  if (syncActiveNoteFromEditor()) {
    pendingEditorPersistDirty = true;
    refreshSaveStatus();
    scheduleEditorPersistence();
  }
};

const scheduleEditorWork = (inputType) => {
  pendingEditorWorkDirty = true;
  // If a paste is mixed with subsequent typing, "insertFromPaste" must win so the
  // pasted URL is not treated as caret-adjacent and suppressed.  Otherwise keep
  // the most recent inputType.
  if (inputType === "insertFromPaste" || pendingEditorInputType !== "insertFromPaste") {
    pendingEditorInputType = inputType;
  }

  if (pendingEditorWorkTimer) {
    window.clearTimeout(pendingEditorWorkTimer);
  }

  pendingEditorWorkTimer = window.setTimeout(runPendingEditorWork, editorWorkDebounceMs);
};

const scheduleEditorPersistence = () => {
  pendingEditorPersistDirty = true;

  if (pendingEditorPersistTimer) {
    window.clearTimeout(pendingEditorPersistTimer);
  }

  pendingEditorPersistTimer = window.setTimeout(runPendingEditorPersistence, editorPersistDebounceMs);
};

const flushEditorWorkNow = () => {
  if (pendingEditorWorkTimer) {
    window.clearTimeout(pendingEditorWorkTimer);
    pendingEditorWorkTimer = null;
  }

  if (pendingEditorWorkDirty) {
    runPendingEditorWork();
  }

  if (pendingEditorPersistTimer) {
    window.clearTimeout(pendingEditorPersistTimer);
    pendingEditorPersistTimer = null;
  }

  if (pendingEditorPersistDirty) {
    runPendingEditorPersistence();
  }
};

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
  getCurrentThemeMode: () => currentThemeMode,
  getCurrentPaneSplit: () => currentPaneSplit,
  getCurrentTranslationCode: () => viewerApi.getCurrentTranslationCode(),
  getCurrentColorThemeId: () => currentColorThemeId,
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

toolbarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { command, block } = button.dataset;

    if (command) {
      applyCommand(command);
      return;
    }

    if (block) {
      applyBlock(block);
    }
  });
});

insertTableButton.addEventListener("click", () => {
  savedSelectionForTableInsert = saveEditorSelection();
  tableRowsInput.value = "3";
  tableColumnsInput.value = "3";
  openDialog(tableDialog);
  window.setTimeout(() => {
    tableRowsInput.focus();
    tableRowsInput.select();
  }, 0);
});

tableInsertConfirmButton.addEventListener("click", () => {
  const rows = Number.parseInt(tableRowsInput.value, 10);
  const columns = Number.parseInt(tableColumnsInput.value, 10);
  tableDialog.close();
  insertTableAtSelection(Number.isFinite(rows) ? rows : 3, Number.isFinite(columns) ? columns : 3);
});

// ── Color picker ───────────────────────────────────────────────────────
const colorPickerWrapper = document.querySelector("#color-picker-wrapper");
const colorPickerTrigger = document.querySelector("#color-picker-trigger");
const colorPickerDropdown = document.querySelector("#color-picker-dropdown");
const colorButtonSwatch = document.querySelector("#color-button-swatch");

const colorPalette = [
  { label: "Black",       hex: "#000000" },
  { label: "Dark Gray",   hex: "#404040" },
  { label: "Gray",        hex: "#808080" },
  { label: "Silver",      hex: "#c0c0c0" },
  { label: "White",       hex: "#ffffff" },
  { label: "Dark Red",    hex: "#c00000" },
  { label: "Red",         hex: "#ff0000" },
  { label: "Orange",      hex: "#ff6600" },
  { label: "Yellow",      hex: "#ffff00" },
  { label: "Light Green", hex: "#92d050" },
  { label: "Green",       hex: "#00b050" },
  { label: "Light Blue",  hex: "#00b0f0" },
  { label: "Blue",        hex: "#0070c0" },
  { label: "Dark Blue",   hex: "#002060" },
  { label: "Purple",      hex: "#7030a0" },
  { label: "Pink",        hex: "#ff00ff" },
];

let activeTextColor = null;

const buildColorPickerDropdown = () => {
  colorPickerDropdown.innerHTML = "";

  const automaticBtn = document.createElement("button");
  automaticBtn.type = "button";
  automaticBtn.className = "color-automatic-btn";
  const icon = document.createElement("span");
  icon.className = "color-automatic-icon";
  const label = document.createElement("span");
  label.textContent = "Automatic";
  automaticBtn.append(icon, label);
  automaticBtn.addEventListener("click", () => {
    applyTextColor(null);
    closeColorPicker();
  });
  colorPickerDropdown.append(automaticBtn);

  const sectionLabel = document.createElement("p");
  sectionLabel.className = "color-section-label";
  sectionLabel.textContent = "Standard Colors";
  colorPickerDropdown.append(sectionLabel);

  const grid = document.createElement("div");
  grid.className = "color-swatch-grid";

  colorPalette.forEach(({ label: colorLabel, hex }) => {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "color-swatch";
    if (activeTextColor === hex) {
      swatch.classList.add("is-selected");
    }
    swatch.style.background = hex;
    swatch.setAttribute("aria-label", colorLabel);
    swatch.setAttribute("title", colorLabel);
    swatch.addEventListener("click", () => {
      applyTextColor(hex);
      closeColorPicker();
    });
    grid.append(swatch);
  });

  colorPickerDropdown.append(grid);
};

const applyTextColor = (color) => {
  noteEditor.focus();
  if (color === null) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      // Strip inline color from every element in the editor that overlaps the selection.
      // We never call execCommand("foreColor", "inherit") because browsers resolve
      // "inherit" as a literal color value (often red) rather than removing the color.
      noteEditor.querySelectorAll("[style]").forEach((el) => {
        if (el.style.color && range.intersectsNode(el)) {
          el.style.removeProperty("color");
          if (!el.getAttribute("style")) {
            el.removeAttribute("style");
          }
        }
      });
      noteEditor.querySelectorAll("font[color]").forEach((el) => {
        if (range.intersectsNode(el)) {
          el.removeAttribute("color");
          if (el.attributes.length === 0) {
            el.replaceWith(...el.childNodes);
          }
        }
      });
    }
    activeTextColor = null;
  } else {
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("foreColor", false, color);
    activeTextColor = color;
  }
  colorButtonSwatch.style.background = color ? color : "var(--text)";
};

const openColorPicker = () => {
  buildColorPickerDropdown();
  colorPickerDropdown.hidden = false;
  colorPickerTrigger.setAttribute("aria-expanded", "true");
};

const closeColorPicker = () => {
  colorPickerDropdown.hidden = true;
  colorPickerTrigger.setAttribute("aria-expanded", "false");
};

const closeOverflowMenu = () => {
  overflowMenu.removeAttribute("open");
  overflowMenu.querySelectorAll("details[open]").forEach((menu) => {
    menu.removeAttribute("open");
  });
};

colorPickerTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  if (colorPickerDropdown.hidden) {
    openColorPicker();
  } else {
    closeColorPicker();
  }
});

document.addEventListener("click", (e) => {
  if (!colorPickerWrapper.contains(e.target)) {
    closeColorPicker();
  }

  if (!overflowMenu.contains(e.target)) {
    closeOverflowMenu();
  }

  if (!tableContextMenu.hidden && !tableContextMenu.contains(e.target)) {
    closeTableContextMenu();
  }
});

document.addEventListener("contextmenu", (event) => {
  if (!tableContextMenu.hidden && !tableContextMenu.contains(event.target)) {
    closeTableContextMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !tableContextMenu.hidden) {
    closeTableContextMenu();
    return;
  }

  if (e.key === "Escape" && !colorPickerDropdown.hidden) {
    closeColorPicker();
    colorPickerTrigger.focus();
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

noteEditor.addEventListener("keydown", (event) => {
  if (event.key !== "Tab" || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  const context = getTableContext(getTableCellFromSelection());

  if (!context) {
    return;
  }

  event.preventDefault();

  if (isLastTableCell(context)) {
    insertTableRow(context, 1, 0);
    saveActiveNote();
    refreshTableUi();
    return;
  }

  focusTableCell(getNextTableCell(context));
  refreshTableUi();
});

noteEditor.addEventListener("input", (event) => {
  if (event.inputType === "insertParagraph" || event.inputType === "insertLineBreak") {
    // Save the browser's cursor position (in the newly-created empty paragraph) using a
    // DOM Range rather than a plain text offset.  restoreCaretTextOffset() cannot find
    // empty paragraphs (they contain no text nodes), so it would move the cursor back to
    // the end of the previous paragraph's text — exactly the "cursor jumps" bug.
    const sel = window.getSelection();
    const savedContainer = sel.rangeCount ? sel.getRangeAt(0).startContainer : null;
    const savedOffset   = sel.rangeCount ? sel.getRangeAt(0).startOffset   : 0;

    // suppressAtCaret: false — after Enter the caret is in the *new* empty paragraph, whose
    // global text offset happens to equal the end of the URL in the previous paragraph.
    // Using true would therefore suppress that URL and prevent embed creation.
    linkifyUrls({ suppressAtCaret: false });
    processUrlEmbeds();

    // Restore cursor to the saved DOM position (the new empty paragraph).
    // If processUrlEmbeds() replaced the old paragraph with an embed,
    // the new paragraph (savedContainer) is still in the DOM and the cursor is correct.
    if (savedContainer && noteEditor.contains(savedContainer)) {
      try {
        const r = document.createRange();
        r.setStart(savedContainer, savedOffset);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      } catch {
        // Range became invalid (e.g. savedContainer was inside the replaced block); leave
        // the cursor wherever the browser placed it.
      }
    }

    // Pool the save with any follow-up typing.  flushEditorWorkNow() on note-switch
    // / sync / unload guarantees this debounced save still lands in time.
    scheduleEditorWork(event.inputType);
    return;
  }

  // Trim browser-injected leading whitespace/BR nodes that can appear during normal typing.
  // This is intentionally NOT called from saveActiveNote: doing so would immediately remove
  // any empty leading paragraph the user just created (e.g. by pressing Enter at position 0),
  // making the Enter key appear broken at the start of a document.
  trimEditorLeadingSpacerNodes();
  // Defensive: if trim left the editor completely empty, re-seed it with an empty paragraph
  // so Chrome wraps subsequent typing in <p> rather than bare text nodes.
  if (!noteEditor.firstChild) {
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    noteEditor.appendChild(p);
  }

  updateNoteEditorPlaceholderState();
  // Heavy work (linkification, embed materialization, autosave) is debounced.
  // See runPendingEditorWork() for the deferred steps.
  scheduleEditorWork(event.inputType);
});

noteEditor.addEventListener("keydown", (event) => {
  const selection = window.getSelection();

  if (!selection.rangeCount || !selection.isCollapsed) {
    return;
  }

  const range = selection.getRangeAt(0);

  // Helper: get the top-level block inside noteEditor that contains a node
  const getEditorBlock = (node) => {
    let el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;

    while (el && el.parentElement !== noteEditor) {
      el = el.parentElement;
    }

    return el;
  };

  if (event.key === "Backspace") {
    // --- Backspace over an embed immediately before the caret block ---
    const block = getEditorBlock(range.startContainer);

    if (block) {
      const prevSibling = block.previousElementSibling;

      if (prevSibling?.matches(EMBED_SELECTOR)) {
        const blockRange = document.createRange();
        blockRange.selectNodeContents(block);
        const atBlockStart = range.compareBoundaryPoints(Range.START_TO_START, blockRange) === 0;

        if (atBlockStart) {
          event.preventDefault();
          prevSibling.remove();
          ensureTrailingParagraph();
          saveActiveNote();
          return;
        }
      }
    }

    // --- Backspace from start of empty block whose previous block ends with an auto-link ---
    // First Backspace: move cursor to the end of the link (no delink yet).
    // Second Backspace: cursor is now directly after the link, triggering the delink below.
    if (block) {
      const blockHtml = block.innerHTML?.trim() ?? "";
      const isEmptyBlock = !block.textContent.trim() && (!blockHtml || blockHtml === "<br>");

      if (isEmptyBlock && block.previousElementSibling) {
        const prevBlock = block.previousElementSibling;
        const autoLinks = prevBlock.querySelectorAll(
          "a[data-auto-url-link='true'], a[data-auto-scripture-link='true']"
        );

        if (autoLinks.length) {
          const lastLink = autoLinks[autoLinks.length - 1];

          // Only act if nothing meaningful follows the link inside its block.
          let trailingNode = lastLink.nextSibling;
          let onlyTrivialTrailing = true;

          while (trailingNode) {
            if (trailingNode.nodeType === Node.TEXT_NODE && trailingNode.nodeValue.trim()) {
              onlyTrivialTrailing = false;
              break;
            }

            if (trailingNode.nodeType === Node.ELEMENT_NODE && trailingNode.tagName !== "BR") {
              onlyTrivialTrailing = false;
              break;
            }

            trailingNode = trailingNode.nextSibling;
          }

          if (onlyTrivialTrailing) {
            event.preventDefault();
            const r = document.createRange();
            r.setStartAfter(lastLink);
            r.collapse(true);
            selection.removeAllRanges();
            selection.addRange(r);
            return;
          }
        }
      }
    }

    // --- Original: Backspace collapses an auto-link ---
    const autoLink = findAutoLinkAtCaret();

    if (!autoLink) {
      return;
    }

    event.preventDefault();
    const textNode = document.createTextNode(autoLink.textContent);
    autoLink.replaceWith(textNode);

    const newRange = document.createRange();
    newRange.setStart(textNode, textNode.textContent.length);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);
    saveActiveNote();
    return;
  }

  if (event.key === "Delete") {
    // --- Delete over an embed immediately after the caret block ---
    const block = getEditorBlock(range.startContainer);

    if (block) {
      const nextSibling = block.nextElementSibling;

      if (nextSibling?.matches(EMBED_SELECTOR)) {
        const blockRange = document.createRange();
        blockRange.selectNodeContents(block);
        const atBlockEnd = range.compareBoundaryPoints(Range.START_TO_END, blockRange) === 0;

        if (atBlockEnd) {
          event.preventDefault();
          nextSibling.remove();
          ensureTrailingParagraph();
          saveActiveNote();
          return;
        }
      }
    }
  }
});

// ── Smart ghost-paragraph navigation ─────────────────────────────────────────
// When the cursor is at the edge of an embed (first or last direct child of
// noteEditor, or a gap between consecutive embeds), pressing an arrow key
// inserts a temporary empty paragraph so the user can type there.  Once the
// cursor moves away without typing anything, the paragraph is removed.

noteEditor.addEventListener("keydown", (event) => {
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    return;
  }

  const sel = window.getSelection();

  if (!sel || !sel.rangeCount || !sel.isCollapsed) {
    return;
  }

  const range = sel.getRangeAt(0);

  const getEditorBlock = (node) => {
    let el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;

    while (el && el.parentElement !== noteEditor) {
      el = el.parentElement;
    }

    return el;
  };

  const block = getEditorBlock(range.startContainer);

  if (!block) {
    return;
  }

  const isAtBlockEnd = () => {
    const blockRange = document.createRange();
    blockRange.selectNodeContents(block);

    return range.compareBoundaryPoints(Range.START_TO_END, blockRange) === 0;
  };

  const isAtBlockStart = () => {
    const blockRange = document.createRange();
    blockRange.selectNodeContents(block);

    return range.compareBoundaryPoints(Range.START_TO_START, blockRange) === 0;
  };

  // Visual-line helpers: check whether the caret sits on the first/last
  // rendered line of the block (regardless of character offset).  These are
  // used for ArrowUp/Down so that a user positioned anywhere on the first or
  // last visual line of a paragraph can navigate into/out of an adjacent embed.
  const isOnFirstVisualLine = () => {
    if (!block.textContent) return true;

    // Build a range from the block's start to the current caret.
    // If getClientRects() returns ≤ 1 rect the range fits on a single visual
    // line, meaning the caret is on the first line of the block.
    const r = document.createRange();
    r.setStart(block, 0);
    r.setEnd(range.startContainer, range.startOffset);

    return r.getClientRects().length <= 1;
  };

  const isOnLastVisualLine = () => {
    if (!block.textContent) return true;

    const r = document.createRange();
    r.setStart(range.startContainer, range.startOffset);
    r.setEnd(block, block.childNodes.length);

    return r.getClientRects().length <= 1;
  };

  const insertGhostAndFocus = (insertFn) => {
    event.preventDefault();
    const ghost = document.createElement("p");
    ghost.innerHTML = "<br>";
    ghost.dataset.embedGhost = "true";
    insertFn(ghost);
    const r = document.createRange();
    r.setStart(ghost, 0);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
  };

  const isGhostBlock = block.dataset.embedGhost === "true";

  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    // For Down, fire when the caret is on the last visual line (cursor may be
    // anywhere horizontally within that line). For Right, only fire when the
    // caret is at the very last character position so Left/Right navigation
    // within a line is unaffected.
    const atEnd = event.key === "ArrowDown" ? isOnLastVisualLine() : isAtBlockEnd();

    if (!atEnd) {
      return;
    }

    const nextEmbed = block.nextElementSibling;

    if (!nextEmbed || !nextEmbed.matches(EMBED_SELECTOR)) {
      return;
    }

    if (!isGhostBlock) {
      // Non-ghost paragraph above an embed. Look past the embed to decide
      // whether a ghost is needed.
      const afterNextEmbed = nextEmbed.nextElementSibling;

      if (!afterNextEmbed) {
        // Embed is the last child — ghost must go after it.
        insertGhostAndFocus((ghost) => noteEditor.appendChild(ghost));
      } else if (afterNextEmbed.matches(EMBED_SELECTOR)) {
        // Another embed follows — ghost goes between the two embeds.
        insertGhostAndFocus((ghost) => nextEmbed.after(ghost));
      }
      // A real paragraph already follows the embed — the browser will
      // navigate there naturally; no ghost needed.
    } else {
      // Already in a ghost between two embeds: step past the next embed.
      const afterNextEmbed = nextEmbed.nextElementSibling;

      if (!afterNextEmbed) {
        // nextEmbed is the last child — ghost goes after it (at editor end).
        insertGhostAndFocus((ghost) => noteEditor.appendChild(ghost));
      } else if (afterNextEmbed.matches(EMBED_SELECTOR)) {
        // Another embed follows nextEmbed — ghost goes between those two embeds.
        insertGhostAndFocus((ghost) => nextEmbed.after(ghost));
      }
      // If a real paragraph follows nextEmbed, the browser navigates naturally.
    }
  } else {
    // ArrowUp or ArrowLeft
    // For Up, fire when the caret is on the first visual line. For Left, only
    // fire when the caret is at the very first character position.
    const atStart = event.key === "ArrowUp" ? isOnFirstVisualLine() : isAtBlockStart();

    if (!atStart) {
      return;
    }

    const prevEmbed = block.previousElementSibling;

    if (!prevEmbed || !prevEmbed.matches(EMBED_SELECTOR)) {
      return;
    }

    if (!isGhostBlock) {
      // Non-ghost paragraph below an embed. Look past the embed to decide
      // whether a ghost is needed.
      const beforePrevEmbed = prevEmbed.previousElementSibling;

      if (!beforePrevEmbed) {
        // Embed is the first child — ghost must go before it.
        insertGhostAndFocus((ghost) => noteEditor.prepend(ghost));
      } else if (beforePrevEmbed.matches(EMBED_SELECTOR)) {
        // Another embed precedes — ghost goes between the two embeds.
        insertGhostAndFocus((ghost) => prevEmbed.before(ghost));
      }
      // A real paragraph already precedes the embed — the browser will
      // navigate there naturally; no ghost needed.
    } else {
      // Already in a ghost between two embeds: step past the preceding embed.
      const beforePrevEmbed = prevEmbed.previousElementSibling;

      if (!beforePrevEmbed) {
        // prevEmbed is the first child — ghost goes before it (at editor start).
        insertGhostAndFocus((ghost) => noteEditor.prepend(ghost));
      } else if (beforePrevEmbed.matches(EMBED_SELECTOR)) {
        // Another embed precedes prevEmbed — ghost goes between those two embeds.
        insertGhostAndFocus((ghost) => prevEmbed.before(ghost));
      }
      // If a real paragraph precedes prevEmbed, the browser navigates naturally.
    }
  }
});

// Remove ghost paragraphs once the cursor leaves them (if still empty).
document.addEventListener("selectionchange", () => {
  const sel = window.getSelection();
  const container = sel && sel.rangeCount ? sel.getRangeAt(0).startContainer : null;

  noteEditor.querySelectorAll("[data-embed-ghost]").forEach((ghost) => {
    if (ghost.contains(container)) {
      return; // cursor is still inside — leave it
    }

    const empty = !ghost.textContent && (!ghost.innerHTML || ghost.innerHTML === "<br>");

    if (empty) {
      ghost.remove();
    } else {
      // User typed something — promote to a real paragraph.
      ghost.removeAttribute("data-embed-ghost");
    }
  });
});

// Strips all formatting from pasted HTML except: bold, italic, underline,
// bullet/numbered lists, headings (normalised to h2), blockquotes, tables,
// hyperlinks, and foreground colour on inline elements.  Background colour,
// font family, font size, and all other presentational attributes are removed
// so that pasted content inherits the editor's own typeface and size.
const sanitizePastedHtml = (html) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const BLOCK_PASS    = new Set(["p", "ul", "ol", "li", "blockquote"]);
  const HEADING_TAGS  = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
  const INLINE_PASS   = new Set(["b", "strong", "i", "em", "u"]);
  const DROP_SUBTREE  = new Set(["script", "style", "noscript", "svg", "video", "audio", "canvas", "iframe", "object", "embed", "picture"]);
  const TABLE_CELL    = new Set(["td", "th"]);
  const TABLE_STRUCT  = new Set(["table", "thead", "tbody", "tfoot", "tr", "colgroup", "col", "caption"]);
  const BLOCK_UNWRAP  = new Set(["div", "section", "article", "main", "header", "footer", "nav", "aside", "figure", "figcaption", "form", "fieldset", "details", "summary", "html", "body"]);
  const CELL_ATTRS    = new Set(["colspan", "rowspan"]);

  const getFgColor = (el) => el.style?.color || null;

  const processChildren = (node) => {
    const out = [];
    for (const child of node.childNodes) {
      out.push(...processNode(child));
    }
    return out;
  };

  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return [node.cloneNode()];
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return [];
    }

    const tag = node.tagName.toLowerCase();

    if (DROP_SUBTREE.has(tag)) {
      return [];
    }

    const children = processChildren(node);

    if (tag === "br") {
      return [document.createElement("br")];
    }

    if (HEADING_TAGS.has(tag)) {
      const el = document.createElement("h2");
      const color = getFgColor(node);
      if (color) el.style.color = color;
      children.forEach((ch) => el.appendChild(ch));
      return [el];
    }

    if (BLOCK_PASS.has(tag)) {
      const el = document.createElement(tag);
      const color = getFgColor(node);
      if (color) el.style.color = color;
      children.forEach((ch) => el.appendChild(ch));
      return [el];
    }

    if (INLINE_PASS.has(tag)) {
      const el = document.createElement(tag);
      const color = getFgColor(node);
      if (color) el.style.color = color;
      children.forEach((ch) => el.appendChild(ch));
      return [el];
    }

    // span / font / mark: keep only if carrying a foreground colour
    if (tag === "span" || tag === "font" || tag === "mark") {
      const color = getFgColor(node);
      if (color) {
        const el = document.createElement("span");
        el.style.color = color;
        children.forEach((ch) => el.appendChild(ch));
        return [el];
      }
      return children;
    }

    // Hyperlinks: keep href and target, strip everything else
    if (tag === "a") {
      const el = document.createElement("a");
      const href = node.getAttribute("href");
      const target = node.getAttribute("target");
      if (href) el.setAttribute("href", href);
      if (target) el.setAttribute("target", target);
      const color = getFgColor(node);
      if (color) el.style.color = color;
      children.forEach((ch) => el.appendChild(ch));
      return [el];
    }

    // Table cells: keep colspan/rowspan, strip everything else
    if (TABLE_CELL.has(tag)) {
      const el = document.createElement(tag);
      CELL_ATTRS.forEach((attr) => {
        const val = node.getAttribute(attr);
        if (val) el.setAttribute(attr, val);
      });
      const color = getFgColor(node);
      if (color) el.style.color = color;
      children.forEach((ch) => el.appendChild(ch));
      return [el];
    }

    // Table structure: keep the element, strip all attributes
    if (TABLE_STRUCT.has(tag)) {
      const el = document.createElement(tag);
      children.forEach((ch) => el.appendChild(ch));
      return [el];
    }

    // Generic block wrappers (div, section, etc.): unwrap if they already
    // contain block-level children, otherwise promote to a paragraph.
    if (BLOCK_UNWRAP.has(tag)) {
      const hasBlockChild = children.some(
        (ch) =>
          ch.nodeType === Node.ELEMENT_NODE &&
          (BLOCK_PASS.has(ch.tagName.toLowerCase()) ||
            HEADING_TAGS.has(ch.tagName.toLowerCase()) ||
            BLOCK_UNWRAP.has(ch.tagName.toLowerCase()))
      );
      if (hasBlockChild || !children.length) {
        return children;
      }
      const el = document.createElement("p");
      children.forEach((ch) => el.appendChild(ch));
      return [el];
    }

    // Anything else (unknown / presentational tags): unwrap
    return children;
  };

  const result = document.createElement("div");
  processChildren(temp).forEach((n) => result.appendChild(n));
  return result.innerHTML;
};

noteEditor.addEventListener("paste", (event) => {
  const imageItems = [...event.clipboardData.items].filter((item) => item.type.startsWith("image/"));

  if (imageItems.length) {
    event.preventDefault();
    imageItems.forEach((item) => {
      const file = item.getAsFile();
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => insertImageAtCaret(e.target.result);
      reader.readAsDataURL(file);
    });
    return;
  }

  const htmlData = event.clipboardData.getData("text/html");

  if (!htmlData) {
    return; // plain-text paste — let the browser handle it natively
  }

  event.preventDefault();
  document.execCommand("insertHTML", false, sanitizePastedHtml(htmlData));
});

// ── Embed drag-and-drop ────────────────────────────────────────────────────
// Embeds expose draggable="true" (set by EmbedBase._makeContainer).  We
// serialise the outer HTML into the dataTransfer on dragstart and re-insert
// it on drop.  The original embed is removed when the drop completes.

noteEditor.addEventListener("dragstart", (event) => {
  const embed = event.target.closest(EMBED_SELECTOR);

  if (!embed || !noteEditor.contains(embed)) {
    return;
  }

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", embed.outerHTML);
  event.dataTransfer.setData("application/x-scriptoria-embed", "true");
  embed.dataset.embedDragging = "true";
});

noteEditor.addEventListener("dragend", () => {
  noteEditor.querySelectorAll("[data-embed-dragging]").forEach((el) => {
    el.removeAttribute("data-embed-dragging");
  });
});

noteEditor.addEventListener("dragover", (event) => {
  const types = [...event.dataTransfer.types];

  // TODO: Remove application/x-churchscribe-embed fallback after a future release.
  const isEmbedDrag = types.includes("application/x-scriptoria-embed") || types.includes("application/x-churchscribe-embed");

  if (types.includes("Files") || isEmbedDrag) {
    event.preventDefault();
    event.dataTransfer.dropEffect = types.includes("Files") ? "copy" : "move";
  }
});

noteEditor.addEventListener("drop", (event) => {
  const types = [...event.dataTransfer.types];

  // Helper: resolve drop caret position.
  const getDropRange = () => {
    if (document.caretRangeFromPoint) {
      return document.caretRangeFromPoint(event.clientX, event.clientY);
    }

    if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(event.clientX, event.clientY);

      if (pos) {
        const r = document.createRange();
        r.setStart(pos.offsetNode, pos.offset);
        r.collapse(true);

        return r;
      }
    }

    return null;
  };

  // ── Embed-move drop ──────────────────────────────────────────────────────
  // TODO: Remove application/x-churchscribe-embed fallback after a future release.
  if (types.includes("application/x-scriptoria-embed") || types.includes("application/x-churchscribe-embed")) {
    event.preventDefault();

    const embedHtml = event.dataTransfer.getData("text/html");
    const draggedEmbed = noteEditor.querySelector("[data-embed-dragging]");

    if (!embedHtml) {
      if (draggedEmbed) {
        draggedEmbed.removeAttribute("data-embed-dragging");
      }

      return;
    }

    const temp = document.createElement("div");
    temp.innerHTML = embedHtml;
    const newEmbed = temp.firstElementChild;

    if (!newEmbed) {
      return;
    }

    newEmbed.removeAttribute("data-embed-dragging");

    const dropRange = getDropRange();
    let targetBlock = null;

    if (dropRange && noteEditor.contains(dropRange.commonAncestorContainer)) {
      let el = dropRange.startContainer;
      el = el.nodeType === Node.TEXT_NODE ? el.parentElement : el;

      while (el && el.parentElement !== noteEditor) {
        el = el.parentElement;
      }

      targetBlock = el && el !== noteEditor ? el : null;
    }

    // Remove the original embed before inserting the clone.
    if (draggedEmbed) {
      draggedEmbed.remove();
    }

    if (targetBlock) {
      targetBlock.before(newEmbed);
    } else {
      noteEditor.appendChild(newEmbed);
    }

    ensureTrailingParagraph();
    saveActiveNote();

    return;
  }

  // ── Image-file drop ──────────────────────────────────────────────────────
  const imageFiles = [...event.dataTransfer.files].filter((file) => file.type.startsWith("image/"));

  if (!imageFiles.length) {
    return;
  }

  event.preventDefault();

  const dropRange = getDropRange();

  if (dropRange && noteEditor.contains(dropRange.commonAncestorContainer)) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(dropRange);
  }

  processImageFiles(imageFiles);
});

[tableToolbar, tableContextMenu].forEach((container) => {
  container.addEventListener("mousedown", (event) => {
    if (event.target.closest("[data-table-action]")) {
      event.preventDefault();
    }
  });

  container.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-table-action]");

    if (!actionButton) {
      return;
    }

    runTableAction(actionButton.dataset.tableAction);
  });
});

noteEditor.addEventListener("click", (event) => {
  closeTableContextMenu();

  // Unified delete-button handler — works for all embed types (old and new DOM).
  const deleteBtn = event.target.closest(
    ".embed-delete, .youtube-embed-delete, .spotify-embed-delete, .image-embed-delete"
  );

  if (deleteBtn) {
    event.preventDefault();
    const embed = deleteBtn.closest(EMBED_SELECTOR);

    if (embed) {
      embed.remove();
      ensureTrailingParagraph();
      saveActiveNote();
    }

    return;
  }

  const urlLink = event.target.closest("a[data-auto-url-link='true']");

  if (urlLink) {
    event.preventDefault();

    const osHandledSchemes = ["mailto:", "ftp:", "spotify:"];

    if (osHandledSchemes.some((scheme) => urlLink.href.startsWith(scheme))) {
      const tempLink = document.createElement("a");
      tempLink.href = urlLink.href;
      tempLink.click();
    } else {
      window.open(urlLink.href, "_blank", "noopener,noreferrer");
    }

    return;
  }

  const link = event.target.closest("a[data-auto-scripture-link='true']");

  if (!link) {
    return;
  }

  event.preventDefault();
  jumpToScripture(link.dataset.scriptureRef);
  return;
});

noteEditor.addEventListener("contextmenu", (event) => {
  const cell = event.target.closest("td, th");

  if (!cell || !noteEditor.contains(cell)) {
    closeTableContextMenu();
    refreshTableUi();
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  focusTableCell(cell);
  openTableContextMenu(cell, event.clientX, event.clientY);
  refreshTableUi();
});

noteEditor.addEventListener("keyup", refreshTableUi);
noteEditor.addEventListener("mouseup", refreshTableUi);
noteEditor.addEventListener("scroll", closeTableContextMenu);

document.addEventListener("selectionchange", refreshTableUi);

// Unified drag-resize handler — works for both YouTube and image embeds
// (and any future embed type that uses the shared .embed-resize-handle class).
noteEditor.addEventListener("mousedown", (event) => {
  const handle = event.target.closest(
    ".embed-resize-handle, .youtube-embed-resize-handle, .image-embed-resize-handle"
  );

  if (!handle) {
    return;
  }

  event.preventDefault();

  // Find the containing embed element then the inner wrapper and media.
  const embedEl = handle.closest(EMBED_SELECTOR);

  if (!embedEl) {
    return;
  }

  const handler = EmbedBase.findHandler(embedEl);
  const wrapper = handler ? handler.getWrapper(embedEl) : embedEl.firstElementChild;
  const mediaEl = handler ? handler.getMediaElement(embedEl) : embedEl.querySelector("iframe, img");

  if (!wrapper) {
    return;
  }

  const startX = event.clientX;
  const startWidth = wrapper.offsetWidth;
  const maxWidth = noteEditor.clientWidth - EDITOR_HORIZONTAL_PADDING;

  if (mediaEl) {
    mediaEl.style.pointerEvents = "none";
  }

  document.body.style.cursor = "ew-resize";

  const onMouseMove = (e) => {
    const newWidth = Math.min(maxWidth, Math.max(MIN_EMBED_WIDTH, startWidth + (e.clientX - startX)));
    wrapper.style.width = `${newWidth}px`;
  };

  const onMouseUp = () => {
    if (mediaEl) {
      mediaEl.style.pointerEvents = "";
    }

    document.body.style.cursor = "";
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    saveActiveNote();
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

// translationSelect / bookSelect / chapterSelect / scriptureSearchInput
// listeners now live inside scripture/viewer.js and scripture/search.js.

systemThemeMediaQuery.addEventListener("change", () => {
  if (currentThemeMode === "system") {
    applyThemeMode("system", { rerender: true });
  }
});

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

const translationUrlInput = document.querySelector("#translation-url-input");
const importTranslationUrlButton = document.querySelector("#import-translation-url-button");
const userTranslationList = document.querySelector("#user-translation-list");

importTranslationUrlButton.addEventListener("click", () => {
  const url = translationUrlInput.value.trim();

  if (!url) {
    return;
  }

  importTranslationUrlButton.disabled = true;
  importTranslationUrlButton.textContent = "Importing…";

  importTranslationFromUrl(url).then((code) => {
    translationUrlInput.value = "";
    renderTranslationsPanel();
    updateSaveStatus(`Translation "${code}" imported successfully.`);
    setTimeout(() => refreshSaveStatus(), 4000);
  }).catch((err) => {
    // eslint-disable-next-line no-alert
    window.alert(`Import failed: ${err.message}`);
  }).finally(() => {
    importTranslationUrlButton.disabled = false;
    importTranslationUrlButton.textContent = "Import from URL";
  });
});

userTranslationList.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-delete-translation]");

  if (!btn) {
    return;
  }

  const code = btn.dataset.deleteTranslation;

  // eslint-disable-next-line no-alert
  if (!window.confirm(`Delete the "${code}" translation? This cannot be undone.`)) {
    return;
  }

  void deleteCustomTranslation(code).then(() => renderTranslationsPanel());
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

let savedSelectionForImageInsert = null;

insertImageButton.addEventListener("click", () => {
  const selection = window.getSelection();

  if (
    selection &&
    selection.rangeCount > 0 &&
    noteEditor.contains(selection.getRangeAt(0).commonAncestorContainer)
  ) {
    savedSelectionForImageInsert = selection.getRangeAt(0).cloneRange();
  } else {
    savedSelectionForImageInsert = null;
  }

  insertImageFile.value = "";
  insertImageFile.click();
});

insertImageFile.addEventListener("change", () => {
  const files = [...insertImageFile.files];

  if (!files.length) {
    return;
  }

  noteEditor.focus();

  if (savedSelectionForImageInsert) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedSelectionForImageInsert);
    savedSelectionForImageInsert = null;
  }

  processImageFiles(files);
});

// ── Custom translation import ──────────────────────────────────────────────

const translationsManagerApi = window.ScriptoriaModules.createTranslationsManager({
  translationLibrary,
  readStoredValue,
  writeStoredValue,
  customTranslationsStorageKey,
  translationStorageKey,
  translationSelect,
  downloadAllTranslationsButton,
  downloadAllTranslationsStatus,
  getCurrentTranslationCode: () => viewerApi.getCurrentTranslationCode(),
  getUserTranslations: () => userTranslations,
  setUserTranslations: (value) => {
    userTranslations = value;
  },
  applyTranslation: (...args) => applyTranslation(...args),
  isTranslationsSettingsOpen: () => settingsDialog.open && activeSettingsTabId === "translations"
});

// Hand the live translations module to the scripture viewer so its thunks for
// ensureTranslationLoaded / offlineAvailableTranslations resolve to real
// implementations.  Until this assignment runs, viewer's thunks are no-ops —
// safe because they're only invoked from event handlers / bootstrap, both of
// which fire after this point.
translationsManagerApiRef = translationsManagerApi;

const {
  BUILTIN_TRANSLATION_CODES,
  offlineAvailableTranslations,
  parseTranslationJs,
  refreshOfflineTranslationAvailability,
  ensureTranslationLoaded,
  validateTranslationData,
  populateTranslationSelect,
  registerCustomTranslation,
  loadCustomTranslations,
  importTranslationFromFile,
  importTranslationFromUrl,
  deleteCustomTranslation,
  refreshDownloadAllTranslationsUi,
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
  getCurrentThemeMode: () => currentThemeMode,
  paneGrid,
  togglePaneOrder,
  colorThemes,
  getCurrentColorThemeId: () => currentColorThemeId,
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
  getUserTranslations: () => userTranslations,
  setUserTranslations: (value) => {
    userTranslations = value;
  },
  translationLibrary,
  BUILTIN_TRANSLATION_CODES,
  validateTranslationData,
  populateTranslationSelect,
  customTranslationsStorageKey,
  writeStoredValue,
  getCurrentThemeMode: () => currentThemeMode,
  paneGrid,
  getCurrentPaneSplit: () => currentPaneSplit,
  getCurrentTranslationCode: () => viewerApi.getCurrentTranslationCode(),
  getCurrentColorThemeId: () => currentColorThemeId,
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

// ── Document-level drag-and-drop for .js translation files ────────────────

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

  const jsFiles = [...event.dataTransfer.files].filter((f) => f.name.endsWith(".js"));

  if (jsFiles.length === 0) {
    // Not a translation file — prevent browser from navigating to it, but do nothing else.
    event.preventDefault();
    return;
  }

  event.preventDefault();

  jsFiles.forEach((file) => {
    importTranslationFromFile(file).then((code) => {
      updateSaveStatus(`Translation "${code}" imported successfully.`);
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
  await loadCustomTranslations();
  // Inspect IndexedDB for which built-in translations are already cached so the
  // picker can correctly mark un-cached ones as unavailable when offline.  Must
  // happen before populateTranslationSelect so the initial render is accurate.
  await refreshOfflineTranslationAvailability();
  populateTranslationSelect();
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

const paneDivider = document.querySelector("#pane-divider");

verseDisplay.addEventListener("copy", (event) => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return;
  }

  const fragment = selection.getRangeAt(0).cloneContents();
  const wrapper = document.createElement("div");
  wrapper.appendChild(fragment);

  wrapper.querySelectorAll("*").forEach((el) => {
    el.classList.remove("is-highlighted");
    el.style.removeProperty("background");
    el.style.removeProperty("background-color");
  });

  // Convert .verse-red-letter CSS-class color to an inline style so the notes
  // editor's "Automatic" button (which walks el.style.color) can clear it.
  const liveRedLetterEl = chapterText.querySelector(".verse-red-letter");
  const redLetterColor = liveRedLetterEl ? getComputedStyle(liveRedLetterEl).color : "";
  wrapper.querySelectorAll(".verse-red-letter").forEach((el) => {
    if (redLetterColor) {
      el.style.color = redLetterColor;
    }
    el.classList.remove("verse-red-letter");
  });

  // Convert .verse-added-words CSS-class italic to a plain <em> element so the
  // notes editor's italic button can toggle it off.
  // Note: this runs after the red-letter loop so el.style.color may already be
  // set on combined red-letter+added-words spans — carry it over to the <em>.
  wrapper.querySelectorAll(".verse-added-words").forEach((el) => {
    const em = document.createElement("em");
    if (el.style.color) {
      em.style.color = el.style.color;
    }
    em.append(...el.childNodes);
    el.replaceWith(em);
  });

  wrapper.querySelectorAll(".chapter-verse-number").forEach((numEl) => {
    numEl.replaceWith(`[${numEl.textContent.trim()}] `);
  });

  event.clipboardData.setData("text/html", wrapper.innerHTML);
  event.clipboardData.setData("text/plain", selection.toString());
  event.preventDefault();
});

paneDivider.addEventListener("mousedown", (startEvent) => {
  startEvent.preventDefault();
  document.body.classList.add("is-pane-dragging");

  const gridRect = paneGrid.getBoundingClientRect();
  const availableWidth = gridRect.width - 20;

  const onMouseMove = (moveEvent) => {
    const rawFraction = (moveEvent.clientX - gridRect.left) / availableWidth;
    const isScriptureFirst = paneGrid.dataset.order === "scripture-first";
    const noteFraction = isScriptureFirst ? 1 - rawFraction : rawFraction;
    applySplit(noteFraction);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.body.classList.remove("is-pane-dragging");
    void writeStoredValue(paneSplitStorageKey, currentPaneSplit);
    markLocalSettingsUpdated();
    scheduleAutoCloudSync();
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

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

// ── Online / offline awareness ───────────────────────────────────────────────
// Cloud sync is the only thing that genuinely needs network connectivity —
// everything else (notes, translations, themes, embeds-in-cache) keeps working
// from the SW cache.  The handlers below:
//   • refresh the save-status indicator so the user can see when sync is paused;
//   • replay any sync that was queued while offline as soon as we're back;
//   • update visible cloud-sync UI in Settings if it's open.

window.addEventListener("offline", () => {
  refreshSaveStatus();
  // Refresh the translation picker so any not-yet-downloaded translations get
  // greyed out with a "not downloaded" suffix.
  populateTranslationSelect();
  refreshDownloadAllTranslationsUi();
  if (typeof renderSettings === "function" && settingsDialog && settingsDialog.open) {
    renderSettings();
  }
});

window.addEventListener("online", () => {
  refreshSaveStatus();
  // Re-enable previously-disabled translation options now that fetches will
  // succeed again.
  populateTranslationSelect();
  refreshDownloadAllTranslationsUi();
  if (typeof renderSettings === "function" && settingsDialog && settingsDialog.open) {
    renderSettings();
  }

  // Replay any sync work that was deferred while offline.  scheduleAutoCloudSync
  // also covers the case where unsaved-but-not-yet-synced edits exist — it
  // resets the auto-sync timer so the next idle window picks them up.
  if (consumeQueuedCloudSync()) {
    if (activeProvider.hasActiveSession()) {
      console.log("[CloudSync] Connectivity restored — replaying queued sync.");
      // Match the auto-sync behaviour: pull first to surface any remote
      // changes, then upload.  Errors are already handled inside each call.
      void (async () => {
        await pullFromCloud();
        await syncWorkspaceToCloud({ reason: "online-resume" });
      })();
    }
  }
});

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

