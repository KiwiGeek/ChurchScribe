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
const activeNoteTitle = document.querySelector("#active-note-title");
const activeNoteMeta = document.querySelector("#active-note-meta");
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

const dbName = "churchscribe-db";
const dbVersion = 1;
const dbStoreName = "kv";
const workspaceStorageKey = "service-notes-workspace";
const notesStorageKey = "service-notes";
const legacyNotesStorageKey = "service-notes-content";
const themeStorageKey = "service-notes-theme";
const paneOrderStorageKey = "service-notes-pane-order";
const paneSplitStorageKey = "service-notes-pane-split";
const translationStorageKey = "service-notes-translation";
const cloudSyncStorageKey = "service-notes-cloud-sync";
const colorThemeStorageKey = "service-notes-color-theme";
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

const bookAliasMap = new Map();
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
let explicitScriptureReferencePattern;
let fullExplicitScriptureReferencePattern;
let contextualScriptureReferencePattern;
let activeScriptureFocus = null;
let currentTranslationCode = "KJV";
let activeTypeEditorId = null;
let activeSettingsTabId = "ui-settings";
let currentColorThemeId = "default";
let currentThemeMode = "system";
let currentPaneSplit = 0.6;
let noteBrowserFilter = "";
let noteBrowserTypeFilter = "all";
let noteBrowserSort = "updated-desc";
let noteBrowserSelectedNoteId = null;
let scriptureSearchQuery = "";
let savedSelectionForTableInsert = null;
let activeTableCell = null;
let contextMenuTableCell = null;
let activeOnboardingStepIndex = 0;
let dbPromise;
let pendingAutoSyncTimer = null;
let syncInFlightPromise = null;
let isPullInFlight = false;
let cloudPollTimer = null;
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
    label: "Note Types"
  },
  {
    id: "scripture-aliases",
    label: "Scripture Abbreviations"
  },
  {
    id: "cloud-sync",
    label: "Auxiliary Storage"
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

const onboardingSteps = [
  {
    kicker: "Welcome",
    title: "ChurchScribe keeps your notes on your device",
    copy: "ChurchScribe is designed to feel lightweight and private. Your notes live in your browser on your own computer unless you explicitly connect an auxiliary storage provider.",
    points: [
      "Nothing is automatically sent to a server run by ChurchScribe.",
      "You stay in control of when and where any backups or sync copies are created.",
      "You can clear or export your workspace later from Settings if you ever need to."
    ],
    callout: "Good to know: the default experience is local-first and privacy-friendly."
  },
  {
    kicker: "Taking Notes",
    title: "The note editor works like a focused writing surface",
    copy: "Each note is its own editable document. Use the toolbar for quick formatting, lists, headings, quotes, images, and tables while you capture sermon points, study notes, or prayer requests.",
    points: [
      "The main note area saves locally as you type.",
      "Use the notes browser to jump between notes when your library grows.",
      "Formatting is intentionally simple so you can stay in the flow during live note-taking."
    ],
    callout: "Tip: the app is optimized for desktop and tablet use, especially during active note-taking."
  },
  {
    kicker: "Scripture Linking",
    title: "Verse references are matched automatically",
    copy: "When you type a Bible reference in your notes, ChurchScribe tries to recognize it and turn it into a clickable scripture link automatically.",
    points: [
      "Matched references can jump you straight to the passage in the Scripture pane.",
      "Common abbreviations are supported, and you can fine-tune them in Settings.",
      "Copying verses from the Scripture pane keeps useful formatting like emphasis where possible."
    ],
    callout: "If a book abbreviation is unusual in your church context, check the Scripture Abbreviations section in Settings."
  },
  {
    kicker: "Note Types",
    title: "Note types shape the details attached to each note",
    copy: "ChurchScribe lets you define note types such as sermon notes, Bible studies, Sabbath School, or anything else you need. Each type can have its own metadata fields.",
    points: [
      "Use Settings → Note Types to add, rename, or adjust note types.",
      "Metadata fields can be customized to match the information you track most often.",
      "The note options dialog lets you switch a note to a different type when that actually matters."
    ],
    callout: "This is one of the app’s best customization points: shape the workspace around your ministry context."
  },
  {
    kicker: "Make It Yours",
    title: "Explore themes and optional cloud sync next",
    copy: "Once the basics feel comfortable, check out the color themes and display settings, then consider connecting auxiliary storage if you want another copy of your notes outside this device.",
    points: [
      "Themes and layout settings can make the app feel much more personal.",
      "Auxiliary storage is optional, but useful if you want backup or cross-device workflows.",
      "You can reopen this tutorial any time from Settings → About."
    ],
    callout: "Recommended next steps: try a different theme, review your note types, and then decide whether cloud sync is worth setting up."
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

const getCurrentTranslation = () => translationLibrary[currentTranslationCode];
const getCurrentScriptureLibrary = () => getCurrentTranslation().books;
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

const normalizeBookName = (value) =>
  value.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();

const normalizeFieldLabel = (value) => value.trim().toLowerCase();

const addBookAlias = (alias, canonicalBook) => {
  const normalizedAlias = normalizeBookName(alias);

  if (normalizedAlias) {
    bookAliasMap.set(normalizedAlias, canonicalBook);
  }
};

const createMetadataField = (label = "Field", placeholder = "") => ({
  id: createId("field"),
  label,
  placeholder
});

const createDefaultNoteType = () => ({
  id: createId("type"),
  name: "Bible Study",
  fields: [
    createMetadataField("Title", "Optional note title"),
    createMetadataField("Speaker", "Optional speaker name")
  ],
  cardTitleFieldId: null,
  cardSubtitleFieldId: null
});

const createEmptyNote = (typeId, metadata = {}) => ({
  id: createId("note"),
  typeId,
  metadata,
  content: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const formatNoteDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

const getNoteTypeById = (typeId) => workspace.noteTypes.find((type) => type.id === typeId) ?? workspace.noteTypes[0];
const getActiveNote = () => workspace.notes.find((note) => note.id === workspace.activeNoteId) ?? workspace.notes[0];
const getSelectedTypeForManager = () => workspace.noteTypes.find((type) => type.id === activeTypeEditorId) ?? null;

const buildMetadataForType = (type, sourceMetadata = {}, sourceType = null) => {
  const nextMetadata = {};
  const byId = new Map(Object.entries(sourceMetadata));
  const byLabel = new Map();

  if (sourceType) {
    sourceType.fields.forEach((field) => {
      byLabel.set(normalizeFieldLabel(field.label), sourceMetadata[field.id] ?? "");
    });
  }

  type.fields.forEach((field) => {
    const byFieldIdValue = byId.get(field.id);
    const byFieldLabelValue = byLabel.get(normalizeFieldLabel(field.label));
    nextMetadata[field.id] = typeof byFieldIdValue === "string"
      ? byFieldIdValue
      : typeof byFieldLabelValue === "string"
        ? byFieldLabelValue
        : "";
  });

  return nextMetadata;
};

const getDefaultCardTitleFieldId = (type) => {
  const titleField = type.fields.find((field) => normalizeFieldLabel(field.label) === "title");
  return titleField?.id ?? type.fields[0]?.id ?? "";
};

const getDefaultCardSubtitleFieldId = (type) => {
  const speakerField = type.fields.find((field) => normalizeFieldLabel(field.label) === "speaker");

  if (speakerField) {
    return speakerField.id;
  }

  const titleFieldId = getDefaultCardTitleFieldId(type);
  const fallbackField = type.fields.find((field) => field.id !== titleFieldId);
  return fallbackField?.id ?? "";
};

const BOOK_ALIASES = {
  "Genesis":         ["Gen", "Ge", "Gn"],
  "Exodus":          ["Exo", "Ex"],
  "Leviticus":       ["Lev", "Le", "Lv"],
  "Numbers":         ["Num", "Nu", "Nm", "Nb"],
  "Deuteronomy":     ["Deut", "Dt", "De", "Deu"],
  "Joshua":          ["Josh", "Jos", "Jsh"],
  "Judges":          ["Judg", "Jdg", "Jg", "Jdgs"],
  "Ruth":            ["Rth", "Ru", "Rut"],
  "1 Samuel":        ["I Samuel", "I Sam", "1 Sam", "1 Sm", "1 Sa", "1 S", "1Sam", "1Sm", "1Sa", "1S"],
  "2 Samuel":        ["II Samuel", "II Sam", "2 Sam", "2 Sm", "2 Sa", "2 S", "2Sam", "2Sm", "2Sa", "2S"],
  "1 Kings":         ["I Kings", "I Kgs", "1 Kgs", "1 Kin", "1 Ki", "1 K", "1Kgs", "1Kin", "1Ki", "1K"],
  "2 Kings":         ["II Kings", "II Kgs", "2 Kgs", "2 Kin", "2 Ki", "2 K", "2Kgs", "2Kin", "2Ki", "2K"],
  "1 Chronicles":    ["I Chronicles", "I Chr", "1 Chr", "1 Ch", "1 Chron", "1Ch", "1Chr", "1Chron"],
  "2 Chronicles":    ["II Chronicles", "II Chr", "2 Chr", "2 Ch", "2 Chron", "2Ch", "2Chr", "2Chron"],
  "Ezra":            ["Ezr", "Ez"],
  "Nehemiah":        ["Neh", "Ne"],
  "Esther":          ["Esth", "Est", "Es"],
  "Job":             ["Jb"],
  "Psalms":          ["Psalm", "Ps", "Pslm", "Psa", "Psm"],
  "Proverbs":        ["Prov", "Prv", "Pr", "Pro"],
  "Ecclesiastes":    ["Eccles", "Eccle", "Ecc", "Ec"],
  "Song of Solomon": ["Song", "Sng", "Song of Songs", "SOS"],
  "Isaiah":          ["Isa", "Is"],
  "Jeremiah":        ["Jer", "Je", "Jr"],
  "Lamentations":    ["Lam", "La"],
  "Ezekiel":         ["Ezek", "Eze", "Ezk"],
  "Daniel":          ["Dan", "Da", "Dn"],
  "Hosea":           ["Hos", "Ho"],
  "Joel":            ["Jl", "Jol"],
  "Amos":            ["Am", "Amo"],
  "Obadiah":         ["Oba", "Obd"],
  "Jonah":           ["Jon"],
  "Micah":           ["Mic", "Mc"],
  "Nahum":           ["Nah", "Na", "Nam"],
  "Habakkuk":        ["Hab"],
  "Zephaniah":       ["Zeph", "Zep", "Zp"],
  "Haggai":          ["Hag", "Hg"],
  "Zechariah":       ["Zech", "Zec", "Zc"],
  "Malachi":         ["Mal", "Ml"],
  "Matthew":         ["Matt", "Mat", "Mt"],
  "Mark":            ["Mk", "Mrk"],
  "Luke":            ["Luk", "Lk"],
  "John":            ["Jhn", "Jn"],
  "Acts":            ["Act"],
  "Romans":          ["Rom", "Ro", "Rm"],
  "1 Corinthians":   ["I Corinthians", "I Cor", "1 Cor", "1Cor", "1 Co", "1Co"],
  "2 Corinthians":   ["II Corinthians", "II Cor", "2 Cor", "2Cor", "2 Co", "2Co"],
  "Galatians":       ["Gal", "Ga"],
  "Ephesians":       ["Eph", "Ephes"],
  "Philippians":     ["Phil", "Php", "Pp"],
  "Colossians":      ["Col"],
  "1 Thessalonians": ["I Thessalonians", "I Thess", "1 Thess", "1Thess", "1 Thes", "1Thes", "1 Th", "1Th"],
  "2 Thessalonians": ["II Thessalonians", "II Thess", "2 Thess", "2Thess", "2 Thes", "2Thes", "2 Th", "2Th"],
  "1 Timothy":       ["I Timothy", "I Tim", "1 Tim", "1 Ti", "1Tim", "1Ti"],
  "2 Timothy":       ["II Timothy", "II Tim", "2 Tim", "2 Ti", "2Tim", "2Ti"],
  "Titus":           ["Tit", "Ti"],
  "Philemon":        ["Philem", "Phm", "Pm"],
  "Hebrews":         ["Heb"],
  "James":           ["Jas", "Jm"],
  "1 Peter":         ["I Peter", "I Pet", "1 Pet", "1 Pe", "1 Pt", "1 P", "1Pet", "1Pe", "1Pt", "1P"],
  "2 Peter":         ["II Peter", "II Pet", "2 Pet", "2 Pe", "2 Pt", "2 P", "2Pet", "2Pe", "2Pt", "2P"],
  "1 John":          ["I John", "I Jn", "1 Jn", "1 Jhn", "1 J", "1Jn", "1Jhn", "1J"],
  "2 John":          ["II John", "II Jn", "2 Jn", "2 Jhn", "2 J", "2Jn", "2Jhn", "2J"],
  "3 John":          ["III John", "III Jn", "3 Jn", "3 Jhn", "3 J", "3Jn", "3Jhn", "3J"],
  "Jude":            ["Jud", "Jd"],
  "Revelation":      ["Rev", "Rv"],
};

const getBuiltInAliasesForBook = (book) => {
  const aliases = new Set([book, book.replace(/\s+/g, "")]);

  if (Object.prototype.hasOwnProperty.call(BOOK_ALIASES, book)) {
    BOOK_ALIASES[book].forEach((alias) => aliases.add(alias));
    return [...aliases];
  }

  const numberedMatch = book.match(/^([1-3])\s+(.+)$/);

  if (numberedMatch) {
    const [, number, rest] = numberedMatch;
    const abbreviation = rest.slice(0, Math.min(rest.length, 4));
    aliases.add(`${number} ${abbreviation}`);
    aliases.add(`${number}${abbreviation}`);
    aliases.add(`${number} ${rest}`);
    aliases.add(`${number}${rest}`);
  } else if (!book.includes(" ") && book.length > 4) {
    aliases.add(book.slice(0, 4));
  }

  return [...aliases];
};

const getEffectiveAliasesForBook = (book) => {
  if (Object.prototype.hasOwnProperty.call(workspace.customBookAliases, book)) {
    return workspace.customBookAliases[book];
  }

  return getBuiltInAliasesForBook(book);
};

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

    normalizedType.cardTitleFieldId = normalizedType.fields.some((field) => field.id === type.cardTitleFieldId)
      ? type.cardTitleFieldId
      : getDefaultCardTitleFieldId(normalizedType);
    normalizedType.cardSubtitleFieldId = normalizedType.fields.some((field) => field.id === type.cardSubtitleFieldId)
      ? type.cardSubtitleFieldId
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

  if (!workspace.noteTypes.some((type) => type.id === activeTypeEditorId)) {
    activeTypeEditorId = workspace.noteTypes[0].id;
  }

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
  ensureWorkspaceConsistency();
  workspace.updatedAt = new Date().toISOString();
  void writeStoredValue(workspaceStorageKey, structuredClone(workspace));
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

const persistCloudSyncSettings = () => {
  void writeStoredValue(cloudSyncStorageKey, structuredClone(cloudSyncSettings));
};

const markLocalSettingsUpdated = () => {
  cloudSyncSettings.localSettingsUpdatedAt = new Date().toISOString();
  persistCloudSyncSettings();
};

const resetTransientCloudSessionState = () => {
  if (activeProvider.hasActiveSession()) {
    return;
  }

  cloudSyncSettings.connectedEmail = "";

  if (
    cloudSyncSettings.status.startsWith("Connected to") ||
    cloudSyncSettings.status.startsWith("Syncing")
  ) {
    cloudSyncSettings.status = "Not connected";
  }
};

const restoreCloudSyncSettings = async () => {
  const savedSettings = await readStoredValue(cloudSyncStorageKey);
  Object.assign(cloudSyncSettings, normalizeCloudSyncSettings(savedSettings));

  activeProvider = providerRegistry[cloudSyncSettings.provider] ?? noOpProvider;

  const providerId = activeProvider.id;
  const defaults = activeProvider.getSettingsValues();

  if (!cloudSyncSettings.providerSettings[providerId]) {
    cloudSyncSettings.providerSettings[providerId] = { ...defaults };
  } else {
    cloudSyncSettings.providerSettings[providerId] = {
      ...defaults,
      ...cloudSyncSettings.providerSettings[providerId]
    };
  }

  resetTransientCloudSessionState();
  persistCloudSyncSettings();
};

const buildCloudStatusText = () => {
  if (activeProvider.id === "none") {
    return "No auxiliary provider configured";
  }

  const isLocalDrive = activeProvider.id === "local-drive";

  if (!activeProvider.isAvailable()) {
    return isLocalDrive
      ? "Local file access not supported in this browser"
      : "Storage provider not available";
  }

  if (isLocalDrive) {
    if (!activeProvider.hasActiveSession()) {
      return "No folder selected";
    }

    const folderName = getCloudTargetLabel();
    return folderName ? `Folder: ${folderName}` : "Folder selected";
  }

  if (
    cloudSyncSettings.status &&
    !cloudSyncSettings.status.startsWith("Connected to") &&
    cloudSyncSettings.status !== "Not connected"
  ) {
    return cloudSyncSettings.status;
  }

  if (cloudSyncSettings.connectedEmail) {
    return `Connected as ${cloudSyncSettings.connectedEmail}`;
  }

  return cloudSyncSettings.status;
};

const buildSaveStatusText = (savedAt = new Date(), syncedAt = cloudSyncSettings.lastSyncAt) => {
  const localLabel = `Saved locally ${new Date(savedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  const syncLabel = cloudSyncSettings.status.startsWith("Syncing")
    ? "Syncing ..."
    : cloudSyncSettings.lastError
      ? `Sync failed: ${cloudSyncSettings.lastError}`
      : syncedAt
        ? `Synced ${new Date(syncedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
        : "Not synced yet";

  return { localLabel, syncLabel };
};

const refreshSaveStatus = () => {
  const activeNote = getActiveNote();
  const savedAt = activeNote?.updatedAt ?? new Date();
  updateSaveStatus(buildSaveStatusText(savedAt));
};

const getActiveProviderSettings = () => ({
  ...cloudSyncSettings.providerSettings[activeProvider.id],
  remoteSettingsFileId: cloudSyncSettings.remoteSettingsFileId,
  remoteNoteFileIds: structuredClone(cloudSyncSettings.remoteNoteFileIds),
  remoteWorkspaceFileId: cloudSyncSettings.remoteWorkspaceFileId,
  remoteWorkspaceParentId: cloudSyncSettings.remoteWorkspaceParentId
});

const getCloudTargetLabel = () =>
  activeProvider.getLocationLabel(cloudSyncSettings.providerSettings[activeProvider.id] ?? {});

const buildProviderStatusLabel = () => {
  const suffix = getCloudTargetLabel();
  return suffix ? `${activeProvider.displayName} (${suffix})` : activeProvider.displayName;
};

const buildCloudSettingsPayload = (updatedAt = new Date().toISOString()) => ({
  version: 2,
  updatedAt,
  workspace: {
    noteTypes: structuredClone(workspace.noteTypes),
    activeNoteId: workspace.activeNoteId,
    selectedNewNoteTypeId: workspace.selectedNewNoteTypeId,
    customBookAliases: structuredClone(workspace.customBookAliases),
    updatedAt: workspace.updatedAt ?? updatedAt
  },
  preferences: {
    theme: currentThemeMode,
    paneOrder: paneGrid.dataset.order === "scripture-first" ? "scripture-first" : "notes-first",
    paneSplit: currentPaneSplit,
    translation: currentTranslationCode,
    colorTheme: currentColorThemeId
  },
  syncSettings: {
    provider: cloudSyncSettings.provider,
    pollIntervalSeconds: cloudSyncSettings.pollIntervalSeconds
  },
  customTranslations: structuredClone(userTranslations)
});

const buildCloudNotesPayload = (updatedAt = new Date().toISOString()) => ({
  version: 2,
  updatedAt,
  notes: structuredClone(workspace.notes)
});

const buildCloudSyncPayload = () => {
  const updatedAt = new Date().toISOString();

  return {
    updatedAt,
    settings: buildCloudSettingsPayload(updatedAt),
    notes: buildCloudNotesPayload(updatedAt)
  };
};

const applyCloudPayload = async (payload) => {
  if (payload.workspace) {
    workspace.noteTypes = payload.workspace.noteTypes;
    workspace.activeNoteId = payload.workspace.activeNoteId;
    workspace.selectedNewNoteTypeId = payload.workspace.selectedNewNoteTypeId;
    workspace.customBookAliases = payload.workspace.customBookAliases ?? {};
    workspace.updatedAt = payload.workspace.updatedAt ?? payload.updatedAt ?? new Date().toISOString();
  }

  if (Array.isArray(payload.notes)) {
    workspace.notes = payload.notes;
  }

  // Apply custom translations first so they are available when preferences (translation code) are applied.
  if (Array.isArray(payload.customTranslations)) {
    userTranslations = [];

    for (const { code, label, data } of payload.customTranslations) {
      if (code && label && !BUILTIN_TRANSLATION_CODES.has(code) && validateTranslationData(data)) {
        translationLibrary[code] = { label, books: data };
        userTranslations.push({ code, label, data });
      }
    }

    void writeStoredValue(customTranslationsStorageKey, userTranslations);
    populateTranslationSelect();
  }

  if (payload.preferences) {
    if (payload.preferences.theme) {
      applyThemeMode(payload.preferences.theme, { rerender: false });
      void writeStoredValue(themeStorageKey, normalizeThemeMode(payload.preferences.theme));
    }

    if (payload.preferences.paneOrder) {
      applyPaneOrder(payload.preferences.paneOrder);
      void writeStoredValue(paneOrderStorageKey, payload.preferences.paneOrder);
    }

    if (typeof payload.preferences.paneSplit === "number") {
      applySplit(payload.preferences.paneSplit);
      void writeStoredValue(paneSplitStorageKey, currentPaneSplit);
    }

    if (payload.preferences.translation) {
      await applyTranslation(payload.preferences.translation);
      void writeStoredValue(translationStorageKey, payload.preferences.translation);
    }

    if (payload.preferences.colorTheme) {
      applyColorTheme(payload.preferences.colorTheme);
      void writeStoredValue(colorThemeStorageKey, payload.preferences.colorTheme);
    }
  }

  ensureWorkspaceConsistency();
  buildBookAliasMap();
  renderWorkspace();
  void writeStoredValue(workspaceStorageKey, structuredClone(workspace));
};

const hasLocalNoteData = () =>
  workspace.notes.some((note) => note.content || Object.values(note.metadata).some(Boolean));

const hasLocalCloudData = () =>
  Boolean(cloudSyncSettings.localSettingsUpdatedAt || workspace.updatedAt || hasLocalNoteData());

const hasLocalChangesSinceLastSync = () => {
  if (!cloudSyncSettings.lastSyncAt) {
    return hasLocalCloudData();
  }

  const lastSync = new Date(cloudSyncSettings.lastSyncAt);

  return Boolean(
    (cloudSyncSettings.localSettingsUpdatedAt && new Date(cloudSyncSettings.localSettingsUpdatedAt) > lastSync) ||
    (workspace.updatedAt && new Date(workspace.updatedAt) > lastSync) ||
    workspace.notes.some((note) => new Date(note.updatedAt) > lastSync)
  );
};

const showSyncConflictDialog = (remotePayload, mode = "conflict") => new Promise((resolve) => {
  const mostRecentNote = workspace.notes.reduce(
    (latest, note) => (!latest || new Date(note.updatedAt) > new Date(latest.updatedAt) ? note : latest),
    null
  );
  const localTime = mostRecentNote
    ? `Last modified ${new Date(mostRecentNote.updatedAt).toLocaleString()}`
    : "No local notes";
  const remoteTime = remotePayload.updatedAt
    ? new Date(remotePayload.updatedAt).toLocaleString()
    : "Timestamp unavailable";

  console.log(`[CloudSync] Showing conflict dialog — local: ${localTime}, cloud: ${remoteTime}`);

  const isFirstSync = mode === "first-sync";

  if (isFirstSync) {
    conflictDialogTitle.textContent = "Existing Cloud Data Found";
    conflictDialogDescription.textContent = "This provider already contains a workspace. Choose how you want to proceed.";
    syncConflictDialog.classList.add("is-first-sync");
  } else {
    conflictDialogTitle.textContent = "Sync Conflict Detected";
    conflictDialogDescription.textContent = "Your local data and the cloud copy have both been changed since the last sync. Choose which version to keep.";
    syncConflictDialog.classList.remove("is-first-sync");
  }

  conflictLocalTime.textContent = localTime;
  conflictRemoteTime.textContent = remoteTime;

  const handleKeepLocal = () => {
    console.log("[CloudSync] User chose: keep local data.");
    cleanup();
    resolve("local");
  };

  const handleUseCloud = () => {
    console.log("[CloudSync] User chose: use cloud data.");
    cleanup();
    resolve("remote");
  };

  const handleCancel = (event) => {
    if (isFirstSync) {
      console.log("[CloudSync] User cancelled first-sync dialog.");
      cleanup();
      resolve("cancel");
    } else {
      event.preventDefault();
    }
  };

  const handleFirstSyncCancel = () => {
    console.log("[CloudSync] User chose: not now.");
    cleanup();
    resolve("cancel");
  };

  const cleanup = () => {
    conflictKeepLocalButton.removeEventListener("click", handleKeepLocal);
    conflictUseCloudButton.removeEventListener("click", handleUseCloud);
    firstSyncKeepLocalButton.removeEventListener("click", handleKeepLocal);
    firstSyncUseCloudButton.removeEventListener("click", handleUseCloud);
    firstSyncCancelButton.removeEventListener("click", handleFirstSyncCancel);
    syncConflictDialog.removeEventListener("cancel", handleCancel);
    syncConflictDialog.close();
  };

  if (isFirstSync) {
    firstSyncKeepLocalButton.addEventListener("click", handleKeepLocal);
    firstSyncUseCloudButton.addEventListener("click", handleUseCloud);
    firstSyncCancelButton.addEventListener("click", handleFirstSyncCancel);
  } else {
    conflictKeepLocalButton.addEventListener("click", handleKeepLocal);
    conflictUseCloudButton.addEventListener("click", handleUseCloud);
  }
  syncConflictDialog.addEventListener("cancel", handleCancel);
  syncConflictDialog.showModal();
});

const pullFromCloud = async () => {
  if (!activeProvider.hasActiveSession()) {
    console.log("[CloudSync] Pull skipped: no active cloud session.");
    return;
  }

  if (syncInFlightPromise) {
    console.log("[CloudSync] Pull skipped: upload is currently in progress.");
    return;
  }

  if (isPullInFlight) {
    console.log("[CloudSync] Pull skipped: another pull is already in progress.");
    return;
  }

  isPullInFlight = true;
  console.log("[CloudSync] Starting pull from cloud...");

  try {
    const result = await activeProvider.download(getActiveProviderSettings());

    if (result.remoteSettingsFileId !== cloudSyncSettings.remoteSettingsFileId ||
        JSON.stringify(result.remoteNoteFileIds ?? {}) !== JSON.stringify(cloudSyncSettings.remoteNoteFileIds) ||
        result.remoteWorkspaceFileId !== cloudSyncSettings.remoteWorkspaceFileId ||
        result.remoteWorkspaceParentId !== cloudSyncSettings.remoteWorkspaceParentId) {
      cloudSyncSettings.remoteSettingsFileId = result.remoteSettingsFileId;
      cloudSyncSettings.remoteNoteFileIds = result.remoteNoteFileIds ?? {};
      cloudSyncSettings.remoteWorkspaceFileId = result.remoteWorkspaceFileId;
      cloudSyncSettings.remoteWorkspaceParentId = result.remoteWorkspaceParentId;
      persistCloudSyncSettings();
    }

    const remotePayload = result.data;

    if (!remotePayload) {
      console.log("[CloudSync] No remote file found; uploading local workspace.");
      void syncWorkspaceToCloud({ reason: "initial" });
      return;
    }

    const remoteUpdatedAt = remotePayload.updatedAt ? new Date(remotePayload.updatedAt) : null;
    const lastSyncAt = cloudSyncSettings.lastSyncAt ? new Date(cloudSyncSettings.lastSyncAt) : null;

    console.log(`[CloudSync] Remote updatedAt: ${remoteUpdatedAt?.toISOString() ?? "missing"}`);
    console.log(`[CloudSync] Last synced at:   ${lastSyncAt?.toISOString() ?? "never"}`);

    if (lastSyncAt && remoteUpdatedAt && remoteUpdatedAt <= lastSyncAt) {
      console.log("[CloudSync] Remote data is not newer than last sync; nothing to apply.");
      return;
    }

    const localHasChanges = hasLocalChangesSinceLastSync();
    console.log(`[CloudSync] Local changes since last sync: ${localHasChanges}`);

    let resolution;

    if (!lastSyncAt) {
      console.log("[CloudSync] First sync — showing first-sync dialog.");
      resolution = await showSyncConflictDialog(remotePayload, "first-sync");
    } else if (localHasChanges) {
      console.log("[CloudSync] Both sides changed since last sync — showing conflict dialog.");
      resolution = await showSyncConflictDialog(remotePayload);
    } else {
      console.log("[CloudSync] No local changes since last sync — auto-applying remote data.");
      resolution = "remote";
    }

    console.log(`[CloudSync] Conflict resolution: ${resolution}`);

    if (resolution === "remote") {
      await applyCloudPayload(remotePayload);

      if (remotePayload.updatedAt) {
        cloudSyncSettings.lastSyncAt = remotePayload.updatedAt;
        cloudSyncSettings.localSettingsUpdatedAt = remotePayload.updatedAt;
      } else {
        console.warn("[CloudSync] Remote payload is missing updatedAt timestamp; unable to update last sync time. Sync state may be inconsistent.");
        cloudSyncSettings.localSettingsUpdatedAt = new Date().toISOString();
      }

      cloudSyncSettings.lastError = "";
      persistCloudSyncSettings();
      renderSettings();
      refreshSaveStatus();
      console.log("[CloudSync] Remote data applied successfully.");
    } else if (resolution === "cancel") {
      console.log("[CloudSync] User deferred first-sync decision; disconnecting provider.");
      disconnectCloud();
    } else {
      console.log("[CloudSync] Keeping local data; scheduling upload to overwrite cloud.");
      void syncWorkspaceToCloud({ reason: "conflict-keep-local" });
    }
  } catch (error) {
    console.error("[CloudSync] Pull failed:", error);
  } finally {
    isPullInFlight = false;
  }
};

const stopCloudPolling = () => {
  if (cloudPollTimer) {
    window.clearInterval(cloudPollTimer);
    cloudPollTimer = null;
    console.log("[CloudSync] Background polling stopped.");
  }
};

const startCloudPolling = () => {
  stopCloudPolling();

  if (!activeProvider.hasActiveSession()) {
    console.log(`[CloudSync] Background polling not started (connected=${activeProvider.hasActiveSession()}).`);
    return;
  }

  cloudPollTimer = window.setInterval(() => {
    console.log("[CloudSync] Poll timer fired.");
    void pullFromCloud();
  }, cloudSyncSettings.pollIntervalSeconds * 1000);

  console.log(`[CloudSync] Background polling started (interval: ${cloudSyncSettings.pollIntervalSeconds}s).`);
};

const syncWorkspaceToCloud = async ({ reason = "manual" } = {}) => {
  if (!activeProvider.hasActiveSession()) {
    cloudSyncSettings.status = "Connect to cloud storage first.";
    persistCloudSyncSettings();
    renderSettings();
    refreshSaveStatus();
    return false;
  }

  if (syncInFlightPromise) {
    console.log("[CloudSync] Upload already in progress; awaiting existing request.");
    return syncInFlightPromise;
  }

  console.log(`[CloudSync] Starting upload (reason: ${reason})...`);

  syncInFlightPromise = (async () => {
    try {
      cloudSyncSettings.status = reason === "idle"
        ? `Syncing changes to ${buildProviderStatusLabel()}...`
        : `Syncing to ${buildProviderStatusLabel()}...`;
      cloudSyncSettings.lastError = "";
      persistCloudSyncSettings();
      renderSettings();
      refreshSaveStatus();

      const result = await activeProvider.upload(buildCloudSyncPayload(), getActiveProviderSettings());

      cloudSyncSettings.remoteSettingsFileId = result.remoteSettingsFileId;
      cloudSyncSettings.remoteNoteFileIds = result.remoteNoteFileIds ?? {};
      cloudSyncSettings.remoteWorkspaceFileId = result.remoteWorkspaceFileId;
      cloudSyncSettings.remoteWorkspaceParentId = result.remoteWorkspaceParentId;
      cloudSyncSettings.lastSyncAt = new Date().toISOString();
      cloudSyncSettings.localSettingsUpdatedAt = cloudSyncSettings.lastSyncAt;
      cloudSyncSettings.status = `Connected to ${buildProviderStatusLabel()}`;
      cloudSyncSettings.lastError = "";
      persistCloudSyncSettings();
      renderSettings();
      refreshSaveStatus();
      console.log(`[CloudSync] Upload succeeded (reason: ${reason}). lastSyncAt=${cloudSyncSettings.lastSyncAt}`);
      return true;
    } catch (error) {
      console.error("[CloudSync] Upload failed:", error);
      const errorMessage = error.message || "Unknown cloud sync error.";
      cloudSyncSettings.status = `${activeProvider.displayName} sync failed: ${errorMessage}`;
      cloudSyncSettings.lastError = errorMessage;
      persistCloudSyncSettings();
      renderSettings();
      refreshSaveStatus();
      return false;
    } finally {
      syncInFlightPromise = null;
    }
  })();

  return syncInFlightPromise;
};

const scheduleAutoCloudSync = () => {
  if (!activeProvider.hasActiveSession()) {
    return;
  }

  if (pendingAutoSyncTimer) {
    window.clearTimeout(pendingAutoSyncTimer);
  }

  pendingAutoSyncTimer = window.setTimeout(async () => {
    pendingAutoSyncTimer = null;
    console.log("[CloudSync] Idle auto-sync fired; checking for remote changes before uploading...");
    await pullFromCloud();
    await syncWorkspaceToCloud({ reason: "idle" });
  }, autoCloudSyncDelayMs);
};

const connectCloud = async () => {
  if (!activeProvider.isAvailable()) {
    cloudSyncSettings.status = "Cloud provider is still loading.";
    persistCloudSyncSettings();
    renderSettings();
    return;
  }

  activeProvider.ensureTokenClient();
  cloudSyncSettings.status = "Waiting for sign-in...";
  persistCloudSyncSettings();
  renderSettings();

  try {
    const { email } = await activeProvider.connect();
    cloudSyncSettings.connectedEmail = email;
    cloudSyncSettings.status = `Connected to ${buildProviderStatusLabel()}`;
    cloudSyncSettings.lastError = "";
    persistCloudSyncSettings();
    renderSettings();
    console.log(`[CloudSync] Connected as ${email || "(unknown)"}.`);
    startCloudPolling();
    void pullFromCloud();
  } catch (error) {
    cloudSyncSettings.status = `Sign-in failed: ${error.message}`;
    persistCloudSyncSettings();
    renderSettings();
    throw error;
  }
};

const disconnectCloud = () => {
  activeProvider.disconnect();
  stopCloudPolling();

  if (pendingAutoSyncTimer) {
    window.clearTimeout(pendingAutoSyncTimer);
    pendingAutoSyncTimer = null;
  }

  resetTransientCloudSessionState();
  persistCloudSyncSettings();
  renderSettings();
};

const reconnectCloud = async () => {
  if (activeProvider.id === "none" || activeProvider.hasActiveSession()) {
    return;
  }

  cloudSyncSettings.status = "Verifying connection...";
  cloudSyncSettings.lastError = "";
  persistCloudSyncSettings();

  try {
    activeProvider.ensureTokenClient();
    const { email } = await activeProvider.attemptSilentReconnect();
    cloudSyncSettings.connectedEmail = email;
    cloudSyncSettings.status = `Connected to ${buildProviderStatusLabel()}`;
    cloudSyncSettings.lastError = "";
    persistCloudSyncSettings();
    renderSettings();
    console.log(`[CloudSync] Silently reconnected as ${email || "(unknown)"}.`);
    startCloudPolling();
  } catch {
    resetTransientCloudSessionState();
    persistCloudSyncSettings();
    if (settingsDialog.open) {
      renderSettings();
    }
  }
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
    updateSaveStatus("Converted your existing notes into typed notes.");
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

  return normalizeThemeMode(savedTheme);
};

const getPreferredPaneOrder = async () => {
  const savedOrder = await migrateLegacyPreference(paneOrderStorageKey);
  return savedOrder === "scripture-first" ? "scripture-first" : "notes-first";
};

const getPreferredSplit = async () => {
  const saved = await readStoredValue(paneSplitStorageKey);
  return typeof saved === "number" && saved >= 0.2 && saved <= 0.8 ? saved : 0.6;
};

const getPreferredTranslation = async () => {
  const savedTranslation = await migrateLegacyPreference(translationStorageKey);
  return translationLibrary[savedTranslation] ? savedTranslation : "KJV";
};

const saveLastBookChapter = () => {
  void writeStoredValue(lastBookChapterStorageKey, { book: bookSelect.value, chapter: chapterSelect.value });
};

const restoreLastBookChapter = async () => {
  const saved = await readStoredValue(lastBookChapterStorageKey);

  if (!saved?.book) {
    return;
  }

  const scriptureLibrary = getCurrentScriptureLibrary();

  if (!scriptureLibrary[saved.book]) {
    return;
  }

  if (saved.chapter == null) {
    return;
  }

  const chapterIndex = Number(saved.chapter);

  if (isNaN(chapterIndex) || chapterIndex < 0 || chapterIndex >= scriptureLibrary[saved.book].length) {
    return;
  }

  bookSelect.value = saved.book;
  populateChapterOptions(saved.book);
  chapterSelect.value = String(chapterIndex);
  renderChapter();
};

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

  if (persist) {
    void writeStoredValue(themeStorageKey, currentThemeMode);
  }

  if (markChange) {
    markLocalSettingsUpdated();
    scheduleAutoCloudSync();
  }

  if (rerender) {
    const uiContent = document.querySelector("#ui-settings-content");

    if (uiContent) {
      renderUiSettings(uiContent);
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
  const validIds = colorThemes.map((t) => t.id);
  return validIds.includes(saved) ? saved : "default";
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

  const uiContent = document.querySelector("#ui-settings-content");

  if (uiContent) {
    renderUiSettings(uiContent);
  }
};

const populateBookOptions = () => {
  const scriptureLibrary = getCurrentScriptureLibrary();
  bookSelect.innerHTML = "";

  Object.keys(scriptureLibrary).forEach((book) => {
    const option = document.createElement("option");
    option.value = book;
    option.textContent = book;
    bookSelect.append(option);
  });
};

const populateChapterOptions = (book) => {
  const scriptureLibrary = getCurrentScriptureLibrary();
  chapterSelect.innerHTML = "";

  scriptureLibrary[book].forEach((chapter, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `Chapter ${chapter.chapter}`;
    chapterSelect.append(option);
  });
};

const renderChapter = () => {
  const scriptureLibrary = getCurrentScriptureLibrary();
  const selectedBook = bookSelect.value;
  const selectedIndex = Number(chapterSelect.value);
  const chapter = scriptureLibrary[selectedBook][selectedIndex];
  const highlightedVerses = new Set(
    activeScriptureFocus &&
    activeScriptureFocus.book === selectedBook &&
    activeScriptureFocus.chapter === chapter.chapter
      ? activeScriptureFocus.verses
      : []
  );

  verseReference.textContent = `${selectedBook} ${chapter.chapter}`;
  chapterText.innerHTML = "";

  if (chapter.heading) {
    const headingEl = document.createElement("h3");
    headingEl.className = "chapter-section-heading";
    headingEl.textContent = chapter.heading;
    chapterText.append(headingEl);
  }

  if (chapter.subheading) {
    const subEl = document.createElement("h4");
    subEl.className = "chapter-subheading";
    subEl.textContent = chapter.subheading;
    chapterText.append(subEl);
  }

  if (chapter.superscription) {
    const supEl = document.createElement("p");
    supEl.className = "chapter-superscription";
    supEl.textContent = chapter.superscription;
    chapterText.append(supEl);
  }

  chapter.verses.forEach((verse) => {
    if (verse.heading) {
      const headingEl = document.createElement("h3");
      headingEl.className = "chapter-section-heading";
      headingEl.textContent = verse.heading;
      chapterText.append(headingEl);
    }

    if (verse.subheading) {
      const subEl = document.createElement("h4");
      subEl.className = "chapter-subheading";
      subEl.textContent = verse.subheading;
      chapterText.append(subEl);
    }

    const line = document.createElement("p");
    line.className = "chapter-verse";
    line.dataset.verse = String(verse.verse);

    if (highlightedVerses.has(verse.verse)) {
      line.classList.add("is-highlighted");
    }

    const number = document.createElement("span");
    number.className = "chapter-verse-number";
    number.textContent = verse.verse;

    const text = document.createElement("span");
    text.className = "chapter-verse-text";

    if (typeof verse.html === "string") {
      text.innerHTML = verse.html;
    } else {
      text.textContent = verse.text;
    }

    line.append(number, text);
    chapterText.append(line);
  });

  verseTranslation.textContent = `${getCurrentTranslation().label} • ${chapter.verses.length} verses`;

  if (activeScriptureFocus && activeScriptureFocus.book === selectedBook && activeScriptureFocus.chapter === chapter.chapter) {
    const targetVerse = chapterText.querySelector(`[data-verse="${activeScriptureFocus.firstVerse}"]`);

    if (targetVerse) {
      targetVerse.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }
};

const applyTranslation = async (translationCode) => {
  if (!translationLibrary[translationCode]) {
    return;
  }

  await ensureTranslationLoaded(translationCode);

  currentTranslationCode = translationCode;
  translationSelect.value = translationCode;

  const scriptureLibrary = getCurrentScriptureLibrary();
  const currentBook = scriptureLibrary[bookSelect.value] ? bookSelect.value : Object.keys(scriptureLibrary)[0];
  const requestedChapterNumber = Number(chapterSelect.selectedOptions[0]?.textContent.replace("Chapter ", "") ?? 1);
  const chapterIndex = scriptureLibrary[currentBook].findIndex((chapter) => chapter.chapter === requestedChapterNumber);

  populateBookOptions();
  bookSelect.value = currentBook;
  populateChapterOptions(currentBook);
  chapterSelect.value = String(chapterIndex >= 0 ? chapterIndex : 0);
  renderChapter();

  if (scriptureSearchQuery) {
    performScriptureSearch(scriptureSearchQuery);
  }
};

const MAX_SCRIPTURE_SEARCH_RESULTS = 100;

// Parse a search query into bare-word terms and quoted phrases.
// e.g. `"Lord God" grace` → { terms: ["grace"], phrases: ["lord god"] }
const parseSearchQuery = (query) => {
  const terms = [];
  const phrases = [];
  // Auto-close an unclosed " anywhere in the string by appending one at the end.
  let lower = query.trim().toLowerCase();
  if ((lower.match(/"/g) ?? []).length % 2 !== 0) {
    lower += '"';
  }
  const regex = /"([^"]+)"|(\S+)/g;

  for (const match of lower.matchAll(regex)) {
    if (match[1]) {
      phrases.push(match[1].trim());
    } else if (match[2]) {
      terms.push(match[2]);
    }
  }

  return { terms, phrases };
};

const buildHighlightedTextContent = (text, patterns) => {
  if (!patterns.length) {
    return document.createTextNode(text);
  }

  // Phrases before bare words so the longer match wins in regex alternation.
  const pattern = new RegExp(`(${patterns.map(escapeRegExp).join("|")})`, "gi");
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    if (match.index > lastIndex) {
      fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));
    }

    const mark = document.createElement("mark");
    mark.textContent = match[0];
    fragment.append(mark);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    fragment.append(document.createTextNode(text.slice(lastIndex)));
  }

  return fragment;
};

const renderScriptureSearchResults = (results, terms) => {
  scriptureSearchResults.innerHTML = "";

  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "scripture-search-empty";
    empty.textContent = "No verses found. Try different search words.";
    scriptureSearchResults.append(empty);
    return;
  }

  const count = document.createElement("p");
  count.className = "scripture-search-count";
  count.textContent = results.length === MAX_SCRIPTURE_SEARCH_RESULTS
    ? `Showing first ${MAX_SCRIPTURE_SEARCH_RESULTS} results`
    : `${results.length} ${results.length === 1 ? "verse" : "verses"} found`;
  scriptureSearchResults.append(count);

  results.forEach(({ book, chapter, verse, text }) => {
    const item = document.createElement("div");
    item.className = "scripture-search-result";
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");

    const ref = document.createElement("p");
    ref.className = "scripture-search-result-ref";
    ref.textContent = `${book} ${chapter}:${verse}`;

    const body = document.createElement("p");
    body.className = "scripture-search-result-text";
    body.append(buildHighlightedTextContent(text, terms));

    item.append(ref, body);

    const navigate = () => {
      const scriptureLibrary = getCurrentScriptureLibrary();
      const chapterIndex = scriptureLibrary[book].findIndex((c) => c.chapter === chapter);

      if (chapterIndex === -1) {
        return;
      }

      activeScriptureFocus = { book, chapter, firstVerse: verse, verses: [verse] };
      bookSelect.value = book;
      populateChapterOptions(book);
      chapterSelect.value = String(chapterIndex);
      renderChapter();
      saveLastBookChapter();

      scriptureSearchInput.value = "";
      scriptureSearchQuery = "";
      scriptureSearchResults.classList.add("is-hidden");
      verseDisplay.classList.remove("is-hidden");
    };

    item.addEventListener("click", navigate);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        navigate();
      }
    });

    scriptureSearchResults.append(item);
  });
};

const performScriptureSearch = (query) => {
  scriptureSearchQuery = query.trim().toLowerCase();

  if (!scriptureSearchQuery) {
    scriptureSearchResults.classList.add("is-hidden");
    verseDisplay.classList.remove("is-hidden");
    return;
  }

  const { terms, phrases } = parseSearchQuery(query);
  const scriptureLibrary = getCurrentScriptureLibrary();
  const results = [];

  for (const [bookName, chapters] of Object.entries(scriptureLibrary)) {
    if (results.length >= MAX_SCRIPTURE_SEARCH_RESULTS) {
      break;
    }

    for (const chapter of chapters) {
      if (results.length >= MAX_SCRIPTURE_SEARCH_RESULTS) {
        break;
      }

      for (const verse of chapter.verses) {
        if (results.length >= MAX_SCRIPTURE_SEARCH_RESULTS) {
          break;
        }

        const verseText = verse.text ?? "";
        const verseTextLower = verseText.toLowerCase();

        const matchesAll =
          phrases.every((phrase) => verseTextLower.includes(phrase)) &&
          terms.every((term) => verseTextLower.includes(term));

        if (matchesAll) {
          results.push({ book: bookName, chapter: chapter.chapter, verse: verse.verse, text: verseText });
        }
      }
    }
  }

  verseDisplay.classList.add("is-hidden");
  scriptureSearchResults.classList.remove("is-hidden");
  // Phrases first so longer patterns take priority in regex alternation during highlighting.
  renderScriptureSearchResults(results, [...phrases, ...terms]);
};

const applyCommand = (command) => {
  noteEditor.focus();
  document.execCommand(command, false);
};

const applyBlock = (block) => {
  noteEditor.focus();
  document.execCommand("formatBlock", false, block);
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

const isValidScriptureReference = (canonicalBook, chapter, verseStart = null, verseEnd = null) => {
  const scriptureLibrary = getCurrentScriptureLibrary();
  const bookChapters = scriptureLibrary[canonicalBook];

  if (!bookChapters) {
    return false;
  }

  const chapterData = bookChapters.find((c) => c.chapter === chapter);

  if (!chapterData) {
    return false;
  }

  if (verseStart === null) {
    return true;
  }

  const maxVerse = chapterData.verses[chapterData.verses.length - 1]?.verse ?? 0;
  const effectiveVerseEnd = verseEnd ?? verseStart;

  return verseStart >= 1 && effectiveVerseEnd <= maxVerse;
};

const isSingleChapterBook = (canonicalBook) => {
  const scriptureLibrary = getCurrentScriptureLibrary();
  return (scriptureLibrary[canonicalBook]?.length ?? 0) === 1;
};

const parseScriptureReference = (referenceText) => {
  const match = referenceText.match(fullExplicitScriptureReferencePattern);

  if (!match) {
    return null;
  }

  const canonicalBook = bookAliasMap.get(normalizeBookName(match[1]));
  const referenceBody = match[2];

  if (!canonicalBook) {
    return null;
  }

  const segments = referenceBody.split(/\s*,\s*/);
  const chapterHighlights = new Map();
  let currentChapter = null;
  let firstVerse = null;

  for (const segment of segments) {
    const fullChapterSegment = segment.match(/^(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    const crossChapterSegment = segment.match(/^(\d+):(\d+)(?:-(\d+))?$/);
    const verseOnlySegment = segment.match(/^(\d+)(?:-(\d+))?$/);

    if (!fullChapterSegment) {
      return null;
    }

    if (crossChapterSegment) {
      currentChapter = Number(crossChapterSegment[1]);
      const verseStart = Number(crossChapterSegment[2]);
      const verseEnd = Number(crossChapterSegment[3] ?? crossChapterSegment[2]);

      if (!isValidScriptureReference(canonicalBook, currentChapter, verseStart, verseEnd)) {
        return null;
      }

      const verses = chapterHighlights.get(currentChapter) ?? new Set();

      for (let verse = verseStart; verse <= verseEnd; verse += 1) {
        verses.add(verse);
      }

      chapterHighlights.set(currentChapter, verses);

      if (firstVerse === null) {
        firstVerse = verseStart;
      }

      continue;
    }

    if (segment.includes(":")) {
      currentChapter = Number(fullChapterSegment[1]);
      const verseStart = Number(fullChapterSegment[2]);
      const verseEnd = Number(fullChapterSegment[3] ?? fullChapterSegment[2]);

      if (!isValidScriptureReference(canonicalBook, currentChapter, verseStart, verseEnd)) {
        return null;
      }

      const verses = chapterHighlights.get(currentChapter) ?? new Set();

      for (let verse = verseStart; verse <= verseEnd; verse += 1) {
        verses.add(verse);
      }

      chapterHighlights.set(currentChapter, verses);

      if (firstVerse === null) {
        firstVerse = verseStart;
      }

      continue;
    }

    if (currentChapter === null) {
      const parsedNum = Number(fullChapterSegment[1]);

      if (!isValidScriptureReference(canonicalBook, parsedNum)) {
        if (!isSingleChapterBook(canonicalBook) || !isValidScriptureReference(canonicalBook, 1, parsedNum)) {
          return null;
        }

        currentChapter = 1;
        const singleChapterVerses = chapterHighlights.get(1) ?? new Set();
        singleChapterVerses.add(parsedNum);
        chapterHighlights.set(1, singleChapterVerses);

        if (firstVerse === null) {
          firstVerse = parsedNum;
        }

        continue;
      }

      currentChapter = parsedNum;
      continue;
    }

    if (!verseOnlySegment) {
      return null;
    }

    const verseStart = Number(verseOnlySegment[1]);
    const verseEnd = Number(verseOnlySegment[2] ?? verseOnlySegment[1]);

    if (!isValidScriptureReference(canonicalBook, currentChapter, verseStart, verseEnd)) {
      return null;
    }

    const verses = chapterHighlights.get(currentChapter) ?? new Set();

    for (let verse = verseStart; verse <= verseEnd; verse += 1) {
      verses.add(verse);
    }

    chapterHighlights.set(currentChapter, verses);

    if (firstVerse === null) {
      firstVerse = verseStart;
    }
  }

  return {
    book: canonicalBook,
    chapter: currentChapter,
    firstVerse,
    chapterHighlights
  };
};

const resolveReferenceSegment = (canonicalBook, segment, currentChapter) => {
  const chapterVerseMatch = segment.match(/^(\d+):(\d+)(?:-(\d+))?$/);
  const verseOnlyMatch = segment.match(/^(\d+)(?:-(\d+))?$/);

  if (chapterVerseMatch) {
    const chapter = Number(chapterVerseMatch[1]);
    const verseStart = Number(chapterVerseMatch[2]);
    const verseEnd = Number(chapterVerseMatch[3] ?? chapterVerseMatch[2]);

    if (!isValidScriptureReference(canonicalBook, chapter, verseStart, verseEnd)) {
      return null;
    }

    const verses = new Set();

    for (let verse = verseStart; verse <= verseEnd; verse += 1) {
      verses.add(verse);
    }

    return {
      parsedReference: {
        book: canonicalBook,
        chapter,
        firstVerse: verseStart,
        chapterHighlights: new Map([[chapter, verses]])
      },
      currentChapter: chapter
    };
  }

  if (!verseOnlyMatch) {
    return null;
  }

  if (segment.includes(":")) {
    return null;
  }

  if (currentChapter === null) {
    const parsedNum = Number(verseOnlyMatch[1]);

    if (!isValidScriptureReference(canonicalBook, parsedNum)) {
      if (!isSingleChapterBook(canonicalBook) || !isValidScriptureReference(canonicalBook, 1, parsedNum)) {
        return null;
      }

      const verseSet = new Set([parsedNum]);
      return {
        parsedReference: {
          book: canonicalBook,
          chapter: 1,
          firstVerse: parsedNum,
          chapterHighlights: new Map([[1, verseSet]])
        },
        currentChapter: 1
      };
    }

    return {
      parsedReference: {
        book: canonicalBook,
        chapter: parsedNum,
        firstVerse: null,
        chapterHighlights: new Map()
      },
      currentChapter: parsedNum
    };
  }

  const verseStart = Number(verseOnlyMatch[1]);
  const verseEnd = Number(verseOnlyMatch[2] ?? verseOnlyMatch[1]);

  if (!isValidScriptureReference(canonicalBook, currentChapter, verseStart, verseEnd)) {
    return null;
  }

  const verses = new Set();

  for (let verse = verseStart; verse <= verseEnd; verse += 1) {
    verses.add(verse);
  }

  return {
    parsedReference: {
      book: canonicalBook,
      chapter: currentChapter,
      firstVerse: verseStart,
      chapterHighlights: new Map([[currentChapter, verses]])
    },
    currentChapter
  };
};

const parseExplicitReferenceParts = (referenceText) => {
  const match = referenceText.match(fullExplicitScriptureReferencePattern);

  if (!match) {
    return [];
  }

  const originalBookText = match[1];
  const canonicalBook = bookAliasMap.get(normalizeBookName(originalBookText));
  const referenceBody = match[2];

  if (!canonicalBook) {
    return [];
  }

  const segments = referenceBody.split(/(,\s*)/);
  const parts = [];
  let currentChapter = null;
  let pendingDelimiter = "";

  segments.forEach((segment, index) => {
    if (!segment) {
      return;
    }

    if (index % 2 === 1) {
      pendingDelimiter = segment;
      return;
    }

    const resolved = resolveReferenceSegment(canonicalBook, segment.trim(), currentChapter);

    if (!resolved) {
      pendingDelimiter = "";
      return;
    }

    currentChapter = resolved.currentChapter;
    const displayText = parts.length === 0
      ? `${originalBookText} ${segment.trim()}`
      : `${pendingDelimiter}${segment.trim()}`;

    parts.push({
      text: displayText,
      parsedReference: resolved.parsedReference
    });

    pendingDelimiter = "";
  });

  return parts;
};

const parseContextualScriptureReference = (referenceText, context) => {
  if (!context?.book || !context?.chapter) {
    return null;
  }

  const match = referenceText.match(/^v(?:erse)?\.?\s*(\d+)(?:-(\d+))?$/i);

  if (!match) {
    return null;
  }

  const verseStart = Number(match[1]);
  const verseEnd = Number(match[2] ?? match[1]);

  if (!isValidScriptureReference(context.book, context.chapter, verseStart, verseEnd)) {
    return null;
  }

  const verses = new Set();

  for (let verse = verseStart; verse <= verseEnd; verse += 1) {
    verses.add(verse);
  }

  return {
    book: context.book,
    chapter: context.chapter,
    firstVerse: verseStart,
    chapterHighlights: new Map([[context.chapter, verses]])
  };
};

const formatResolvedReference = (parsedReference) => {
  const verses = [...(parsedReference.chapterHighlights.get(parsedReference.chapter) ?? [])];

  if (!verses.length) {
    return `${parsedReference.book} ${parsedReference.chapter}`;
  }

  const ranges = [];
  let rangeStart = verses[0];
  let previousVerse = verses[0];

  for (let index = 1; index < verses.length; index += 1) {
    const verse = verses[index];

    if (verse === previousVerse + 1) {
      previousVerse = verse;
      continue;
    }

    ranges.push(rangeStart === previousVerse ? `${rangeStart}` : `${rangeStart}-${previousVerse}`);
    rangeStart = verse;
    previousVerse = verse;
  }

  ranges.push(rangeStart === previousVerse ? `${rangeStart}` : `${rangeStart}-${previousVerse}`);
  return `${parsedReference.book} ${parsedReference.chapter}:${ranges.join(", ")}`;
};

const getReferenceContext = (parsedReference) => ({
  book: parsedReference.book,
  chapter: parsedReference.chapter
});

const jumpToResolvedScripture = (parsedReference) => {
  if (!parsedReference) {
    return;
  }

  const scriptureLibrary = getCurrentScriptureLibrary();
  const chapterIndex = scriptureLibrary[parsedReference.book].findIndex(
    (chapter) => chapter.chapter === parsedReference.chapter
  );

  if (chapterIndex === -1) {
    return;
  }

  activeScriptureFocus = {
    book: parsedReference.book,
    chapter: parsedReference.chapter,
    firstVerse: parsedReference.firstVerse,
    verses: [...(parsedReference.chapterHighlights.get(parsedReference.chapter) ?? [])]
  };

  bookSelect.value = parsedReference.book;
  populateChapterOptions(parsedReference.book);
  chapterSelect.value = String(chapterIndex);
  renderChapter();
  saveLastBookChapter();
};

const jumpToScripture = (referenceText) => {
  jumpToResolvedScripture(parseScriptureReference(referenceText));
};

const unwrapAutoScriptureLinks = () => {
  noteEditor.querySelectorAll("a[data-auto-scripture-link='true']").forEach((link) => {
    link.replaceWith(document.createTextNode(link.textContent));
  });

  noteEditor.normalize();
};

const linkifyScriptureReferences = ({ jumpToCaretReference = false } = {}) => {
  const caretOffset = getCaretTextOffset(noteEditor);
  unwrapAutoScriptureLinks();
  const walker = document.createTreeWalker(
    noteEditor,
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
  let currentContext = null;
  let traversedOffset = 0;
  let lastReferenceBeforeCaret = null;

  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode);
  }

  textNodes.forEach((textNode) => {
    const sourceText = textNode.nodeValue;
    explicitScriptureReferencePattern.lastIndex = 0;
    contextualScriptureReferencePattern.lastIndex = 0;
    const explicitMatches = [...sourceText.matchAll(explicitScriptureReferencePattern)];
    const contextualMatches = [...sourceText.matchAll(contextualScriptureReferencePattern)];
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

  restoreCaretTextOffset(noteEditor, caretOffset);

  if (jumpToCaretReference && lastReferenceBeforeCaret) {
    jumpToResolvedScripture(lastReferenceBeforeCaret);
  }
};

const unwrapAutoUrlLinks = () => {
  noteEditor.querySelectorAll("a[data-auto-url-link='true']").forEach((link) => {
    link.replaceWith(document.createTextNode(link.textContent));
  });

  noteEditor.normalize();
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

const processUrlEmbeds = () => {
  noteEditor.querySelectorAll("a[data-auto-url-link='true']").forEach((link) => {
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

const linkifyUrls = ({ suppressAtCaret = false } = {}) => {
  const tldGroup = [...knownTlds].sort((a, b) => b.length - a.length).join("|");
  const urlPatterns = [
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

  const caretOffset = getCaretTextOffset(noteEditor);
  unwrapAutoUrlLinks();

  const globalOffsets = new Map();

  if (suppressAtCaret && caretOffset !== null) {
    const allTextWalker = document.createTreeWalker(noteEditor, NodeFilter.SHOW_TEXT);
    let offset = 0;
    let n;

    while ((n = allTextWalker.nextNode())) {
      globalOffsets.set(n, offset);
      offset += n.nodeValue.length;
    }
  }

  const walker = document.createTreeWalker(
    noteEditor,
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

  restoreCaretTextOffset(noteEditor, caretOffset);
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

const getNoteDisplayTitle = (note) => {
  const type = getNoteTypeById(note.typeId);
  const preferredField = type.fields.find((field) => field.id === type.cardTitleFieldId) ?? type.fields[0];
  const titleValue = preferredField ? note.metadata[preferredField.id]?.trim() : "";

  if (titleValue) {
    return titleValue;
  }

  const anyValue = type.fields
    .map((field) => note.metadata[field.id]?.trim())
    .find(Boolean);

  return anyValue || formatNoteDate(note.createdAt);
};

const getNoteDisplayMeta = (note) => {
  const type = getNoteTypeById(note.typeId);
  const secondaryField = type.fields.find((field) => field.id === type.cardSubtitleFieldId) ?? null;
  const secondaryValue = secondaryField ? note.metadata[secondaryField.id]?.trim() : "";

  return secondaryValue || "";
};

const getNoteSearchableText = (note) => {
  const metadataText = Object.values(note.metadata)
    .filter((value) => typeof value === "string" && value.trim())
    .join(" ");
  const contentText = note.content.replace(/<[^>]+>/g, " ");
  return [getNoteDisplayTitle(note), getNoteDisplayMeta(note), metadataText, contentText].join(" ").toLowerCase();
};

const sortNotes = (notes) => {
  const sortedNotes = notes.slice();

  if (noteBrowserSort === "created-desc") {
    return sortedNotes.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  }

  if (noteBrowserSort === "title-asc") {
    return sortedNotes.sort((left, right) => getNoteDisplayTitle(left).localeCompare(getNoteDisplayTitle(right)));
  }

  return sortedNotes.sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
};

const getFilteredNotes = () => {
  const query = noteBrowserFilter.trim().toLowerCase();
  const activeTypeFilter = workspace.noteTypes.some((type) => type.id === noteBrowserTypeFilter)
    ? noteBrowserTypeFilter
    : "all";

  return sortNotes(
    workspace.notes.filter((note) => {
      if (activeTypeFilter !== "all" && note.typeId !== activeTypeFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return getNoteSearchableText(note).includes(query);
    })
  );
};

const getSelectedBrowserNote = (filteredNotes) => {
  const selected = filteredNotes.find((note) => note.id === noteBrowserSelectedNoteId);

  if (selected) {
    return selected;
  }

  const active = filteredNotes.find((note) => note.id === workspace.activeNoteId);

  if (active) {
    noteBrowserSelectedNoteId = active.id;
    return active;
  }

  noteBrowserSelectedNoteId = filteredNotes[0]?.id ?? null;
  return filteredNotes[0] ?? null;
};

const getNotePreviewText = (note) => note.content
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const renderNoteTypeOptions = () => {
  const showTypeChoices = workspace.noteTypes.length > 1;
  newNoteActions.innerHTML = "";

  if (!workspace.noteTypes.length) {
    return;
  }

  if (!showTypeChoices) {
    const singleTypeButton = document.createElement("button");
    singleTypeButton.type = "button";
    singleTypeButton.className = "ghost-button overflow-action";
    singleTypeButton.dataset.newNoteType = workspace.noteTypes[0].id;
    singleTypeButton.textContent = "New note";
    newNoteActions.append(singleTypeButton);
    return;
  }

  const menu = document.createElement("details");
  menu.className = "inline-action-menu";

  const summary = document.createElement("summary");
  summary.className = "ghost-button overflow-action";
  summary.textContent = "New note ▾";

  const panel = document.createElement("div");
  panel.className = "overflow-menu-panel inline-action-panel";

  workspace.noteTypes.forEach((type) => {
    const typeButton = document.createElement("button");
    typeButton.type = "button";
    typeButton.className = "ghost-button overflow-action";
    typeButton.dataset.newNoteType = type.id;
    typeButton.textContent = type.name;
    panel.append(typeButton);
  });

  menu.append(summary, panel);
  newNoteActions.append(menu);
};

const renderMetadataSummary = () => {
  const activeNote = getActiveNote();
  const type = getNoteTypeById(activeNote.typeId);
  metadataSummary.innerHTML = "";

  const populatedFields = type.fields
    .map((field) => ({
      label: field.label,
      value: (activeNote.metadata[field.id] ?? "").trim()
    }))
    .filter((field) => field.value);

  if (!populatedFields.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "metadata-summary-empty";
    emptyState.textContent = "No note details added yet.";
    metadataSummary.append(emptyState);
    return;
  }

  populatedFields.forEach((field) => {
    const chip = document.createElement("div");
    chip.className = "metadata-chip";

    const label = document.createElement("span");
    label.className = "metadata-chip-label";
    label.textContent = field.label;

    const value = document.createElement("span");
    value.className = "metadata-chip-value";
    value.textContent = field.value;

    chip.append(label, value);
    metadataSummary.append(chip);
  });
};

const renderNoteMetadataFields = () => {
  const activeNote = getActiveNote();
  const type = getNoteTypeById(activeNote.typeId);
  noteMetaFields.innerHTML = "";

  if (workspace.noteTypes.length > 1) {
    const typeField = document.createElement("label");
    typeField.className = "field note-meta-primary-field";

    const typeLabel = document.createElement("span");
    typeLabel.textContent = "Note type";

    const typeSelect = document.createElement("select");
    typeSelect.name = "active-note-type";
    typeSelect.dataset.noteTypeChange = activeNote.id;

    workspace.noteTypes.forEach((noteType) => {
      const option = document.createElement("option");
      option.value = noteType.id;
      option.textContent = noteType.name;
      typeSelect.append(option);
    });

    typeSelect.value = activeNote.typeId;
    typeField.append(typeLabel, typeSelect);
    noteMetaFields.append(typeField);
  }

  type.fields.forEach((field) => {
    const label = document.createElement("label");
    label.className = "field";

    const title = document.createElement("span");
    title.textContent = field.label;

    const input = document.createElement("input");
    input.type = "text";
    input.name = field.id;
    input.dataset.fieldId = field.id;
    input.placeholder = field.placeholder || `Optional ${field.label.toLowerCase()}`;
    input.value = activeNote.metadata[field.id] ?? "";

    label.append(title, input);
    noteMetaFields.append(label);
  });
};

const renderActiveNoteSummary = () => {
  const activeNote = getActiveNote();
  const type = getNoteTypeById(activeNote.typeId);
  const metaBits = [type.name];
  const secondaryMeta = getNoteDisplayMeta(activeNote);

  if (secondaryMeta) {
    metaBits.push(secondaryMeta);
  }

  metaBits.push(`Updated ${formatNoteDate(activeNote.updatedAt)}`);
  activeNoteTitle.textContent = getNoteDisplayTitle(activeNote);
  activeNoteMeta.textContent = metaBits.join(" • ");
};

const renderActiveNote = () => {
  const activeNote = getActiveNote();

  if (!activeNote) {
    return;
  }

  workspace.activeNoteId = activeNote.id;
  renderNoteTypeOptions();
  renderActiveNoteSummary();
  renderMetadataSummary();
  renderNoteMetadataFields();
  noteEditor.innerHTML = activeNote.content;
  // Trim browser-injected leading spacers first, then guarantee at least one
  // block-level element.  The guard MUST come after trimming: for a blank note
  // whose saved content is "<p><br></p>", the trim would remove that element
  // and leave the editor empty — causing Chrome to inject content as bare text
  // nodes or <div>s instead of <p>s, which breaks findLinkBlock and embed creation.
  trimEditorLeadingSpacerNodes();
  if (!noteEditor.firstChild) {
    noteEditor.innerHTML = "<p><br></p>";
  }
  linkifyScriptureReferences();
  linkifyUrls();
  processUrlEmbeds();
  refreshTableUi();
  ensureTrailingParagraph();
};

const renderNoteManager = () => {
  const filteredNotes = getFilteredNotes();
  noteManagerList.innerHTML = "";
  noteBrowserDetails.innerHTML = "";

  noteBrowserTypeFilterSelect.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All note types";
  noteBrowserTypeFilterSelect.append(allOption);
  workspace.noteTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.name;
    noteBrowserTypeFilterSelect.append(option);
  });
  noteBrowserFilterInput.value = noteBrowserFilter;
  noteBrowserTypeFilterSelect.value = workspace.noteTypes.some((type) => type.id === noteBrowserTypeFilter)
    ? noteBrowserTypeFilter
    : "all";
  noteBrowserSortSelect.value = noteBrowserSort;

  if (!filteredNotes.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "note-browser-empty";
    emptyState.textContent = noteBrowserFilter || noteBrowserTypeFilter !== "all"
      ? "No notes match the current filter."
      : "No notes available.";
    noteManagerList.append(emptyState);
    noteBrowserSelectedNoteId = null;
    return;
  }

  const selectedNote = getSelectedBrowserNote(filteredNotes);

  workspace.noteTypes
    .map((type) => ({
      type,
      notes: filteredNotes.filter((note) => note.typeId === type.id)
    }))
    .filter((entry) => entry.notes.length)
    .forEach(({ type, notes }) => {
      const group = document.createElement("section");
      group.className = "note-browser-group";

      const groupHeader = document.createElement("div");
      groupHeader.className = "note-browser-group-header";

      const heading = document.createElement("h3");
      heading.className = "note-browser-group-title";
      heading.textContent = type.name;

      const count = document.createElement("span");
      count.className = "note-browser-group-count";
      count.textContent = `${notes.length} note${notes.length === 1 ? "" : "s"}`;

      groupHeader.append(heading, count);
      group.append(groupHeader);

      notes.forEach((note) => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = `note-browser-list-item${note.id === noteBrowserSelectedNoteId ? " is-selected" : ""}`;
        row.dataset.noteSelect = note.id;

        const title = document.createElement("span");
        title.className = "note-browser-list-title";
        title.textContent = getNoteDisplayTitle(note);

        const meta = document.createElement("span");
        meta.className = "note-browser-list-meta";
        const cardMeta = getNoteDisplayMeta(note);
        meta.textContent = cardMeta
          ? `${cardMeta} • ${formatNoteDate(note.updatedAt)}`
          : formatNoteDate(note.updatedAt);

        row.append(title, meta);
        group.append(row);
      });

      noteManagerList.append(group);
    });

  const detailType = getNoteTypeById(selectedNote.typeId);
  const previewText = getNotePreviewText(selectedNote);
  const detailHeader = document.createElement("div");
  detailHeader.className = "note-browser-detail-header";

  const detailLabel = document.createElement("p");
  detailLabel.className = "active-note-label";
  detailLabel.textContent = detailType.name;

  const detailTitle = document.createElement("h3");
  detailTitle.className = "note-browser-detail-title";
  detailTitle.textContent = getNoteDisplayTitle(selectedNote);

  const detailMeta = document.createElement("p");
  detailMeta.className = "note-browser-detail-meta";
  detailMeta.textContent = `Created ${formatNoteDate(selectedNote.createdAt)} • Updated ${formatNoteDate(selectedNote.updatedAt)}`;

  detailHeader.append(detailLabel, detailTitle, detailMeta);

  const actions = document.createElement("div");
  actions.className = "note-browser-detail-actions";

        const openButton = document.createElement("button");
        openButton.type = "button";
        openButton.className = "ghost-button primary-button";
        openButton.dataset.noteAction = "open";
        openButton.dataset.noteId = selectedNote.id;
        openButton.textContent = "Open note";

  const duplicateButton = document.createElement("button");
  duplicateButton.type = "button";
  duplicateButton.className = "ghost-button";
  duplicateButton.dataset.noteAction = "duplicate";
  duplicateButton.dataset.noteId = selectedNote.id;
  duplicateButton.textContent = "Copy";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "ghost-button";
  deleteButton.dataset.noteAction = "delete";
  deleteButton.dataset.noteId = selectedNote.id;
  deleteButton.textContent = "Delete";

  actions.append(openButton, duplicateButton, deleteButton);

  const metadataBlock = document.createElement("div");
  metadataBlock.className = "note-browser-detail-block";

  const metadataTitle = document.createElement("p");
  metadataTitle.className = "note-browser-detail-block-title";
  metadataTitle.textContent = "Details";
  metadataBlock.append(metadataTitle);

  const populatedFields = detailType.fields
    .map((field) => ({
      label: field.label,
      value: (selectedNote.metadata[field.id] ?? "").trim()
    }))
    .filter((field) => field.value);

  if (populatedFields.length) {
    const metadataList = document.createElement("div");
    metadataList.className = "note-browser-detail-metadata";
    populatedFields.forEach((field) => {
      const chip = document.createElement("div");
      chip.className = "metadata-chip";

      const label = document.createElement("span");
      label.className = "metadata-chip-label";
      label.textContent = field.label;

      const value = document.createElement("span");
      value.className = "metadata-chip-value";
      value.textContent = field.value;

      chip.append(label, value);
      metadataList.append(chip);
    });
    metadataBlock.append(metadataList);
  } else {
    const emptyMetadata = document.createElement("p");
    emptyMetadata.className = "note-browser-empty";
    emptyMetadata.textContent = "No note details added yet.";
    metadataBlock.append(emptyMetadata);
  }

  const previewBlock = document.createElement("div");
  previewBlock.className = "note-browser-detail-block";

  const previewTitle = document.createElement("p");
  previewTitle.className = "note-browser-detail-block-title";
  previewTitle.textContent = "Preview";

  const preview = document.createElement("p");
  preview.className = "note-browser-detail-preview";
  preview.textContent = previewText || "This note is still empty.";

  previewBlock.append(previewTitle, preview);
  noteBrowserDetails.append(detailHeader, actions, metadataBlock, previewBlock);
};

const renderProviderSettings = () => {
  providerSettingsContainer.innerHTML = "";
  const fields = activeProvider.getSettingsFields();

  if (!fields.length) {
    return;
  }

  const currentValues = cloudSyncSettings.providerSettings[activeProvider.id] ?? {};
  const grid = document.createElement("div");
  grid.className = "display-field-grid";

  fields.forEach((field) => {
    const label = document.createElement("label");

    const span = document.createElement("span");
    span.textContent = field.label;

    if (field.type === "checkbox") {
      label.className = "field checkbox-field";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.providerSettingKey = field.key;
      input.checked = Boolean(currentValues[field.key] ?? false);
      label.append(span, input);
    } else if (field.type === "select") {
      label.className = "field";
      const select = document.createElement("select");
      select.dataset.providerSettingKey = field.key;
      (field.options ?? []).forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.label;
        select.append(opt);
      });
      select.value = String(currentValues[field.key] ?? "");
      label.append(span, select);
    } else {
      label.className = "field";
      const input = document.createElement("input");
      input.type = "text";
      input.dataset.providerSettingKey = field.key;
      input.value = String(currentValues[field.key] ?? "");
      label.append(span, input);
    }

    if (field.helpText) {
      const help = document.createElement("p");
      help.className = "settings-copy";
      help.textContent = field.helpText;
      label.append(help);
    }

    grid.append(label);
  });

  providerSettingsContainer.append(grid);
};

const renderUiSettings = (container) => {
  container.innerHTML = "";

  const toggleSection = document.createElement("div");
  toggleSection.className = "ui-settings-section";

  const toggleTitle = document.createElement("p");
  toggleTitle.className = "ui-settings-section-title";
  toggleTitle.textContent = "Layout & Mode";
  toggleSection.append(toggleTitle);

  const toggleRow = document.createElement("div");
  toggleRow.className = "ui-toggle-row";

  const themeModeField = document.createElement("label");
  themeModeField.className = "ui-inline-select";

  const themeModeLabel = document.createElement("span");
  themeModeLabel.textContent = "Theme mode";

  const themeModeSelect = document.createElement("select");
  themeModeSelect.id = "ui-theme-mode-select";
  [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" }
  ].forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.label;
    themeModeSelect.append(opt);
  });
  themeModeSelect.value = currentThemeMode;
  themeModeSelect.addEventListener("change", () => {
    applyThemeMode(themeModeSelect.value, { persist: true, markChange: true });
  });
  themeModeField.append(themeModeLabel, themeModeSelect);
  toggleRow.append(themeModeField);

  const currentOrder = paneGrid.dataset.order === "scripture-first" ? "scripture-first" : "notes-first";
  const paneBtn = document.createElement("button");
  paneBtn.type = "button";
  paneBtn.id = "ui-scripture-left-toggle";
  paneBtn.className = "ui-toggle-button";
  paneBtn.setAttribute("aria-pressed", String(currentOrder === "scripture-first"));
  paneBtn.innerHTML = `<span>Scripture left</span><span class="ui-toggle-state">${currentOrder === "scripture-first" ? "On" : "Off"}</span>`;
  paneBtn.addEventListener("click", () => {
    togglePaneOrder();
  });
  toggleRow.append(paneBtn);
  toggleSection.append(toggleRow);
  container.append(toggleSection);

  const themeSection = document.createElement("div");
  themeSection.className = "ui-settings-section";

  const themeTitle = document.createElement("p");
  themeTitle.className = "ui-settings-section-title";
  themeTitle.textContent = "Color Theme";
  themeSection.append(themeTitle);

  const themeGrid = document.createElement("div");
  themeGrid.className = "theme-grid";

  colorThemes.forEach((theme) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `theme-card${theme.id === currentColorThemeId ? " is-active" : ""}`;
    card.dataset.themeId = theme.id;

    const swatch = document.createElement("div");
    swatch.className = "theme-swatch";
    theme.swatches.forEach((color) => {
      const dot = document.createElement("div");
      dot.className = "theme-swatch-color";
      dot.style.background = color;
      swatch.append(dot);
    });

    const name = document.createElement("p");
    name.className = "theme-card-name";
    name.textContent = theme.name;

    const meta = document.createElement("p");
    meta.className = "theme-card-meta";
    const modeLabel = theme.supports === "both" ? "Light & dark" : theme.supports === "dark" ? "Dark only" : "Light only";
    meta.textContent = modeLabel;

    const check = document.createElement("span");
    check.className = "theme-card-check";
    check.setAttribute("aria-hidden", "true");
    check.textContent = "✓";

    card.append(swatch, name, meta, check);
    card.addEventListener("click", () => {
      void writeStoredValue(colorThemeStorageKey, theme.id);
      applyColorTheme(theme.id);
      markLocalSettingsUpdated();
      scheduleAutoCloudSync();
    });
    themeGrid.append(card);
  });

  themeSection.append(themeGrid);
  container.append(themeSection);
};

const downloadWorkspaceBackup = () => {
  const exportedAt = new Date().toISOString();
  const backup = {
    type: "churchscribe-backup",
    version: 1,
    exportedAt,
    workspace: {
      noteTypes: structuredClone(workspace.noteTypes),
      customBookAliases: structuredClone(workspace.customBookAliases),
      activeNoteId: workspace.activeNoteId,
      selectedNewNoteTypeId: workspace.selectedNewNoteTypeId
    },
    notes: structuredClone(workspace.notes),
    preferences: {
      theme: currentThemeMode,
      paneOrder: paneGrid.dataset.order === "scripture-first" ? "scripture-first" : "notes-first",
      paneSplit: currentPaneSplit,
      translation: currentTranslationCode,
      colorTheme: currentColorThemeId
    }
  };
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `churchscribe-backup-${exportedAt.split("T")[0]}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const restoreWorkspaceFromBackup = async (file) => {
  try {
    const text = await file.text();
    const backup = JSON.parse(text);

    if (!backup || typeof backup !== "object") {
      throw new Error("Invalid backup file: not a valid JSON object.");
    }

    if (!backup.workspace || !Array.isArray(backup.notes)) {
      throw new Error("The selected file does not appear to be a ChurchScribe backup.");
    }

    // eslint-disable-next-line no-alert
    if (!window.confirm("This will replace your current workspace with the backup. Your existing data will be overwritten. Continue?")) {
      return;
    }

    workspace.noteTypes = backup.workspace.noteTypes ?? workspace.noteTypes;
    workspace.customBookAliases = backup.workspace.customBookAliases ?? {};
    workspace.activeNoteId = backup.workspace.activeNoteId ?? workspace.activeNoteId;
    workspace.selectedNewNoteTypeId = backup.workspace.selectedNewNoteTypeId ?? workspace.selectedNewNoteTypeId;
    workspace.notes = backup.notes;

    if (backup.preferences) {
      const { preferences } = backup;

      if (preferences.theme) {
        applyThemeMode(preferences.theme, { rerender: false });
        void writeStoredValue(themeStorageKey, normalizeThemeMode(preferences.theme));
      }

      if (preferences.paneOrder) {
        applyPaneOrder(preferences.paneOrder);
        void writeStoredValue(paneOrderStorageKey, preferences.paneOrder);
      }

      if (typeof preferences.paneSplit === "number") {
        applySplit(preferences.paneSplit);
        void writeStoredValue(paneSplitStorageKey, currentPaneSplit);
      }

      if (preferences.translation) {
        await applyTranslation(preferences.translation);
        void writeStoredValue(translationStorageKey, preferences.translation);
      }

      if (preferences.colorTheme) {
        applyColorTheme(preferences.colorTheme);
        void writeStoredValue(colorThemeStorageKey, preferences.colorTheme);
      }
    }

    buildBookAliasMap();
    renderWorkspace();
    persistWorkspace();
    updateSaveStatus("Workspace restored from backup.");
  } catch (error) {
    console.error("[Backup] Restore failed:", error);
    // eslint-disable-next-line no-alert
    window.alert(`Failed to restore backup: ${error.message}`);
  }
};

const clearLocalWorkspace = async () => {
  // eslint-disable-next-line no-alert
  if (!window.confirm("This will permanently delete all local notes, note types, and settings. The app will reset to its default state. This cannot be undone.")) {
    return;
  }

  stopCloudPolling();

  if (pendingAutoSyncTimer) {
    window.clearTimeout(pendingAutoSyncTimer);
    pendingAutoSyncTimer = null;
  }

  activeProvider.disconnect();

  await Promise.all([
    deleteStoredValue(workspaceStorageKey),
    deleteStoredValue(cloudSyncStorageKey),
    deleteStoredValue(themeStorageKey),
    deleteStoredValue(paneOrderStorageKey),
    deleteStoredValue(paneSplitStorageKey),
    deleteStoredValue(translationStorageKey),
    deleteStoredValue(colorThemeStorageKey),
    deleteStoredValue(lastBookChapterStorageKey),
    deleteStoredValue(onboardingStorageKey),
    deleteStoredValue(notesStorageKey),
    deleteStoredValue(customTranslationsStorageKey)
  ]);

  window.location.reload();
};

const clearRemoteWorkspace = async () => {
  if (!activeProvider.hasActiveSession()) {
    // eslint-disable-next-line no-alert
    window.alert("No storage provider is connected. Connect a provider in Auxiliary Storage settings first.");
    return;
  }

  // eslint-disable-next-line no-alert
  if (!window.confirm(`This will permanently delete all workspace data stored on ${activeProvider.displayName}. Your local workspace will not be affected. This cannot be undone.`)) {
    return;
  }

  try {
    await activeProvider.clearRemote();

    cloudSyncSettings.remoteSettingsFileId = "";
    cloudSyncSettings.remoteNoteFileIds = {};
    cloudSyncSettings.remoteWorkspaceFileId = "";
    cloudSyncSettings.remoteWorkspaceParentId = "";
    cloudSyncSettings.lastSyncAt = null;
    persistCloudSyncSettings();
    renderSettings();
    refreshSaveStatus();
  } catch (error) {
    console.error("[Data] Clear remote failed:", error);
    // eslint-disable-next-line no-alert
    window.alert(`Failed to clear remote workspace: ${error.message}`);
  }
};

const clearAllData = async () => {
  const hasSession = activeProvider.hasActiveSession();
  const remoteLabel = hasSession ? ` and all data stored on ${activeProvider.displayName}` : "";

  // eslint-disable-next-line no-alert
  if (!window.confirm(`This will permanently delete all your local notes and settings${remoteLabel}. This cannot be undone.`)) {
    return;
  }

  if (hasSession) {
    try {
      await activeProvider.clearRemote();
    } catch (error) {
      console.error("[Data] Clear remote failed during clear-all:", error);
    }
  }

  stopCloudPolling();

  if (pendingAutoSyncTimer) {
    window.clearTimeout(pendingAutoSyncTimer);
    pendingAutoSyncTimer = null;
  }

  activeProvider.disconnect();

  await Promise.all([
    deleteStoredValue(workspaceStorageKey),
    deleteStoredValue(cloudSyncStorageKey),
    deleteStoredValue(themeStorageKey),
    deleteStoredValue(paneOrderStorageKey),
    deleteStoredValue(paneSplitStorageKey),
    deleteStoredValue(translationStorageKey),
    deleteStoredValue(colorThemeStorageKey),
    deleteStoredValue(lastBookChapterStorageKey),
    deleteStoredValue(onboardingStorageKey),
    deleteStoredValue(notesStorageKey),
    deleteStoredValue(customTranslationsStorageKey)
  ]);

  window.location.reload();
};

const renderSettings = () => {
  settingsTabNav.innerHTML = "";
  settingsTabs.forEach((tab) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `settings-tab-button${tab.id === activeSettingsTabId ? " is-active" : ""}`;
    button.dataset.settingsTab = tab.id;
    button.textContent = tab.label;
    settingsTabNav.append(button);
  });

  settingsPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.settingsPanel === activeSettingsTabId);
  });

  const uiContent = document.querySelector("#ui-settings-content");

  if (uiContent) {
    renderUiSettings(uiContent);
  }

  renderTranslationsPanel();

  cloudProviderSelect.value = cloudSyncSettings.provider;
  cloudPollIntervalSelect.value = String(cloudSyncSettings.pollIntervalSeconds);
  renderProviderSettings();
  const isNullProvider = activeProvider.id === "none";
  const isLocalDrive = activeProvider.id === "local-drive";
  cloudStatusLabel.textContent = isLocalDrive ? "Folder" : "Connection Status";
  cloudStatusInput.value = buildCloudStatusText();
  cloudLastSyncInput.value = formatSyncTimestamp(cloudSyncSettings.lastSyncAt);
  const hasActiveStorageSession = activeProvider.hasActiveSession();

  if (isNullProvider) {
    googleConnectButton.classList.add("is-hidden");
    googleConnectButton.disabled = true;
    googleDisconnectButton.classList.add("is-hidden");
    googleDisconnectButton.disabled = true;
    googleSyncNowButton.classList.add("is-hidden");
    googleSyncNowButton.disabled = true;
  } else if (isLocalDrive) {
    googleConnectButton.textContent = hasActiveStorageSession ? "Change Folder" : "Choose Folder";
    googleConnectButton.classList.remove("is-hidden");
    googleConnectButton.disabled = !activeProvider.isAvailable();
    googleDisconnectButton.classList.add("is-hidden");
    googleDisconnectButton.disabled = true;
    googleSyncNowButton.classList.toggle("is-hidden", !hasActiveStorageSession);
    googleSyncNowButton.disabled = !hasActiveStorageSession;
  } else {
    googleConnectButton.textContent = `Connect ${activeProvider.displayName}`;
    googleConnectButton.classList.toggle("is-hidden", hasActiveStorageSession);
    googleDisconnectButton.classList.toggle("is-hidden", !hasActiveStorageSession);
    googleSyncNowButton.classList.toggle("is-hidden", !hasActiveStorageSession);
    googleConnectButton.disabled = !activeProvider.isAvailable() || hasActiveStorageSession;
    googleDisconnectButton.disabled = !hasActiveStorageSession;
    googleSyncNowButton.disabled = !hasActiveStorageSession;
  }

  const selectedType = getSelectedTypeForManager();

  if (!selectedType) {
    typeEditorEmpty.hidden = false;
    typeEditorForm.hidden = true;
    return;
  }

  typeEditorEmpty.hidden = true;
  typeEditorForm.hidden = false;
  typeSelect.innerHTML = "";
  workspace.noteTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.name;
    typeSelect.append(option);
  });
  typeSelect.value = selectedType.id;
  typeNameInput.value = selectedType.name;
  metadataFieldList.innerHTML = "";
  cardTitleFieldSelect.innerHTML = "";
  cardSubtitleFieldSelect.innerHTML = "";

  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = "None";
  cardSubtitleFieldSelect.append(noneOption);

  selectedType.fields.forEach((field) => {
    const titleOption = document.createElement("option");
    titleOption.value = field.id;
    titleOption.textContent = field.label;
    cardTitleFieldSelect.append(titleOption);

    const subtitleOption = document.createElement("option");
    subtitleOption.value = field.id;
    subtitleOption.textContent = field.label;
    cardSubtitleFieldSelect.append(subtitleOption);
  });

  cardTitleFieldSelect.value = selectedType.cardTitleFieldId ?? "";
  cardSubtitleFieldSelect.value = selectedType.cardSubtitleFieldId ?? "";

  selectedType.fields.forEach((field) => {
    const row = document.createElement("div");
    row.className = "metadata-field-row";
    row.dataset.fieldId = field.id;

    const labelField = document.createElement("label");
    labelField.className = "field";

    const labelTitle = document.createElement("span");
    labelTitle.textContent = "Label";

    const labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.value = field.label;
    labelInput.dataset.fieldProp = "label";
    labelInput.dataset.fieldId = field.id;

    labelField.append(labelTitle, labelInput);

    const placeholderField = document.createElement("label");
    placeholderField.className = "field";

    const placeholderTitle = document.createElement("span");
    placeholderTitle.textContent = "Placeholder";

    const placeholderInput = document.createElement("input");
    placeholderInput.type = "text";
    placeholderInput.value = field.placeholder;
    placeholderInput.dataset.fieldProp = "placeholder";
    placeholderInput.dataset.fieldId = field.id;

    placeholderField.append(placeholderTitle, placeholderInput);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "ghost-button";
    removeButton.dataset.removeField = field.id;
    removeButton.textContent = "Remove";

    row.append(labelField, placeholderField, removeButton);
    metadataFieldList.append(row);
  });

  aliasList.innerHTML = "";

  Object.keys(getCurrentTranslation()?.books ?? {}).forEach((book) => {
    const row = document.createElement("div");
    row.className = "alias-row";

    const bookName = document.createElement("p");
    bookName.className = "alias-book";
    bookName.textContent = book;

    const aliasField = document.createElement("label");
    aliasField.className = "field";

    const aliasLabel = document.createElement("span");
    aliasLabel.textContent = "Aliases";

    const aliasInput = document.createElement("input");
    aliasInput.type = "text";
    aliasInput.dataset.aliasBook = book;
    aliasInput.placeholder = "Jn, Jon";
    aliasInput.value = getEffectiveAliasesForBook(book).join(", ");

    aliasField.append(aliasLabel, aliasInput);
    row.append(bookName, aliasField);
    aliasList.append(row);
  });
};

const renderWorkspace = () => {
  ensureWorkspaceConsistency();
  renderActiveNote();

  if (noteManagerDialog.open) {
    renderNoteManager();
  }

  if (settingsDialog.open) {
    renderSettings();
  }
};

const renderOnboardingStep = () => {
  const step = onboardingSteps[activeOnboardingStepIndex];

  onboardingStepKicker.textContent = step.kicker;
  onboardingStepTitle.textContent = step.title;
  onboardingStepCopy.textContent = step.copy;
  onboardingStepCallout.textContent = step.callout;
  onboardingStepPoints.innerHTML = "";

  step.points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    onboardingStepPoints.append(item);
  });

  onboardingProgress.textContent = `${activeOnboardingStepIndex + 1} of ${onboardingSteps.length}`;
  onboardingBackButton.disabled = activeOnboardingStepIndex === 0;
  onboardingNextButton.classList.toggle("is-hidden", activeOnboardingStepIndex === onboardingSteps.length - 1);
  onboardingFinishButton.classList.toggle("is-hidden", activeOnboardingStepIndex !== onboardingSteps.length - 1);
};

const openOnboarding = ({ markSeen = false, startAt = 0 } = {}) => {
  activeOnboardingStepIndex = Math.max(0, Math.min(startAt, onboardingSteps.length - 1));
  renderOnboardingStep();
  openDialog(onboardingDialog);

  if (markSeen) {
    void writeStoredValue(onboardingStorageKey, true);
  }
};

const touchNote = (note) => {
  note.updatedAt = new Date().toISOString();
};

const refreshNoteSurfaces = () => {
  renderActiveNoteSummary();
  renderNoteTypeOptions();
  renderMetadataSummary();

  if (noteManagerDialog.open) {
    renderNoteManager();
  }
};

const openNotesBrowser = () => {
  noteBrowserSelectedNoteId = workspace.activeNoteId;
  renderNoteManager();
  overflowMenu.removeAttribute("open");
  openDialog(noteManagerDialog);
  noteBrowserFilterInput.focus();
  noteBrowserFilterInput.select();
};

const saveActiveNote = () => {
  const activeNote = getActiveNote();

  if (!activeNote) {
    return;
  }

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

  activeNote.content = editorClone.innerHTML;
  noteMetaFields.querySelectorAll("[data-field-id]").forEach((input) => {
    activeNote.metadata[input.dataset.fieldId] = input.value;
  });
  touchNote(activeNote);
  persistWorkspace();
  refreshNoteSurfaces();
  refreshSaveStatus();
};

const createNote = (typeId = workspace.selectedNewNoteTypeId) => {
  const type = getNoteTypeById(typeId) ?? workspace.noteTypes[0];

  if (!type) {
    return;
  }

  workspace.selectedNewNoteTypeId = type.id;
  const note = createEmptyNote(type.id, buildMetadataForType(type));
  workspace.notes.unshift(note);
  workspace.activeNoteId = note.id;
  persistWorkspace();
  renderWorkspace();
  refreshSaveStatus();
  const firstInput = noteMetaFields.querySelector("input");
  (firstInput ?? noteEditor).focus();
};

const duplicateNote = (noteId = workspace.activeNoteId) => {
  const sourceNote = workspace.notes.find((note) => note.id === noteId);

  if (!sourceNote) {
    return;
  }

  const duplicate = {
    ...createEmptyNote(sourceNote.typeId, structuredClone(sourceNote.metadata)),
    content: sourceNote.content
  };

  workspace.notes.unshift(duplicate);
  workspace.activeNoteId = duplicate.id;
  persistWorkspace();
  renderWorkspace();
  refreshSaveStatus();
};

const switchNote = (noteId) => {
  if (noteId === workspace.activeNoteId) {
    return;
  }

  saveActiveNote();
  workspace.activeNoteId = noteId;
  persistWorkspace();
  renderWorkspace();
  refreshSaveStatus();
};

const deleteNoteById = (noteId) => {
  const note = workspace.notes.find((entry) => entry.id === noteId);

  if (!note) {
    return;
  }

  const confirmed = window.confirm(`Delete note "${getNoteDisplayTitle(note)}"? This cannot be undone.`);

  if (!confirmed) {
    return;
  }

  workspace.notes = workspace.notes.filter((entry) => entry.id !== noteId);

  if (!workspace.notes.length) {
    const fallbackType = workspace.noteTypes[0];
    const replacement = createEmptyNote(fallbackType.id, buildMetadataForType(fallbackType));
    workspace.notes = [replacement];
    workspace.activeNoteId = replacement.id;
  } else if (workspace.activeNoteId === noteId) {
    workspace.activeNoteId = workspace.notes[0].id;
  }

  persistWorkspace();
  renderWorkspace();
  refreshSaveStatus();
};

const changeNoteType = (noteId, nextTypeId) => {
  const note = workspace.notes.find((entry) => entry.id === noteId);
  const nextType = getNoteTypeById(nextTypeId);

  if (!note || !nextType || note.typeId === nextType.id) {
    return;
  }

  const currentType = getNoteTypeById(note.typeId);
  note.typeId = nextType.id;
  note.metadata = buildMetadataForType(nextType, note.metadata, currentType);
  touchNote(note);

  if (workspace.activeNoteId === noteId) {
    workspace.selectedNewNoteTypeId = nextType.id;
  }

  persistWorkspace();
  renderWorkspace();
  refreshSaveStatus();
};

const addNoteType = () => {
  const type = {
    id: createId("type"),
    name: "New Type",
    fields: [createMetadataField("Title", "Optional title")]
  };

  workspace.noteTypes.push(type);
  activeTypeEditorId = type.id;
  workspace.selectedNewNoteTypeId = type.id;
  persistWorkspace();
  renderWorkspace();
  refreshSaveStatus();
};

const syncNotesForType = (type) => {
  workspace.notes.forEach((note) => {
    if (note.typeId === type.id) {
      note.metadata = buildMetadataForType(type, note.metadata);
    }
  });
};

const updateSelectedTypeName = (name) => {
  const type = getSelectedTypeForManager();

  if (!type) {
    return;
  }

  type.name = name.trim() || "Untitled Type";
  persistWorkspace();
  renderWorkspace();
};

const updateSelectedTypeCardFields = () => {
  const type = getSelectedTypeForManager();

  if (!type) {
    return;
  }

  type.cardTitleFieldId = cardTitleFieldSelect.value || getDefaultCardTitleFieldId(type);
  type.cardSubtitleFieldId = cardSubtitleFieldSelect.value || "";
  persistWorkspace();
  renderWorkspace();
};

const addMetadataFieldToSelectedType = () => {
  const type = getSelectedTypeForManager();

  if (!type) {
    return;
  }

  type.fields.push(createMetadataField("New Field", ""));
  syncNotesForType(type);
  persistWorkspace();
  renderWorkspace();
  refreshSaveStatus();
};

const updateMetadataField = (fieldId, prop, value) => {
  const type = getSelectedTypeForManager();

  if (!type) {
    return;
  }

  const field = type.fields.find((entry) => entry.id === fieldId);

  if (!field) {
    return;
  }

  field[prop] = prop === "label" ? value.trim() || "Field" : value;
  syncNotesForType(type);
  persistWorkspace();
  renderWorkspace();
};

const removeMetadataField = (fieldId) => {
  const type = getSelectedTypeForManager();

  if (!type) {
    return;
  }

  const field = type.fields.find((entry) => entry.id === fieldId);

  if (!field) {
    return;
  }

  const confirmed = window.confirm(`Remove metadata field "${field.label}" from ${type.name}? Existing values for that field will be removed.`);

  if (!confirmed) {
    return;
  }

  type.fields = type.fields.filter((entry) => entry.id !== fieldId);
  if (type.cardTitleFieldId === fieldId) {
    type.cardTitleFieldId = getDefaultCardTitleFieldId(type);
  }

  if (type.cardSubtitleFieldId === fieldId) {
    type.cardSubtitleFieldId = getDefaultCardSubtitleFieldId(type);
  }
  syncNotesForType(type);
  persistWorkspace();
  renderWorkspace();
  refreshSaveStatus();
};

const updateCustomAliases = (book, inputValue) => {
  const aliases = inputValue
    .split(",")
    .map((alias) => alias.trim())
    .filter(Boolean)
    .filter((alias, index, allAliases) => allAliases.indexOf(alias) === index);

  workspace.customBookAliases[book] = aliases;
  persistWorkspace();
  buildBookAliasMap();
  refreshSaveStatus();
};

const deleteSelectedType = () => {
  const type = getSelectedTypeForManager();

  if (!type || workspace.noteTypes.length === 1) {
    window.alert("At least one note type is required.");
    return;
  }

  const replacementType = workspace.noteTypes.find((entry) => entry.id !== type.id);
  const confirmed = window.confirm(`Delete note type "${type.name}" and move its notes to "${replacementType.name}"?`);

  if (!confirmed) {
    return;
  }

  workspace.notes.forEach((note) => {
    if (note.typeId === type.id) {
      note.typeId = replacementType.id;
      note.metadata = buildMetadataForType(replacementType, note.metadata, type);
      touchNote(note);
    }
  });

  workspace.noteTypes = workspace.noteTypes.filter((entry) => entry.id !== type.id);
  activeTypeEditorId = replacementType.id;
  workspace.selectedNewNoteTypeId = replacementType.id;
  persistWorkspace();
  renderWorkspace();
  refreshSaveStatus();
};

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

noteBrowserFilterInput.addEventListener("input", () => {
  noteBrowserFilter = noteBrowserFilterInput.value;
  renderNoteManager();
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

    saveActiveNote();
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
  linkifyScriptureReferences({ jumpToCaretReference: true });
  linkifyUrls({ suppressAtCaret: event.inputType !== "insertFromPaste" });
  processUrlEmbeds();

  // If the cursor was orphaned because an embed replaced its containing block
  // (e.g. user pressed Space after a lone URL), move it to the trailing empty paragraph.
  // This also handles the case where Chrome updates the selection to point at noteEditor
  // itself (rather than a detached node) when the host <p> is replaced by the embed.
  {
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
  }

  saveActiveNote();
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

noteEditor.addEventListener("paste", (event) => {
  const imageItems = [...event.clipboardData.items].filter((item) => item.type.startsWith("image/"));

  if (!imageItems.length) {
    return;
  }

  event.preventDefault();

  imageItems.forEach((item) => {
    const file = item.getAsFile();

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      insertImageAtCaret(e.target.result);
    };

    reader.readAsDataURL(file);
  });
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
  event.dataTransfer.setData("application/x-churchscribe-embed", "true");
  embed.dataset.embedDragging = "true";
});

noteEditor.addEventListener("dragend", () => {
  noteEditor.querySelectorAll("[data-embed-dragging]").forEach((el) => {
    el.removeAttribute("data-embed-dragging");
  });
});

noteEditor.addEventListener("dragover", (event) => {
  const types = [...event.dataTransfer.types];

  if (types.includes("Files") || types.includes("application/x-churchscribe-embed")) {
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
  if (types.includes("application/x-churchscribe-embed")) {
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

translationSelect.addEventListener("change", async () => {
  activeScriptureFocus = null;
  void writeStoredValue(translationStorageKey, translationSelect.value);
  await applyTranslation(translationSelect.value);
  markLocalSettingsUpdated();
  scheduleAutoCloudSync();
});

scriptureSearchInput.addEventListener("input", () => {
  performScriptureSearch(scriptureSearchInput.value);
});

systemThemeMediaQuery.addEventListener("change", () => {
  if (currentThemeMode === "system") {
    applyThemeMode("system", { rerender: true });
  }
});

bookSelect.addEventListener("change", () => {
  activeScriptureFocus = null;
  populateChapterOptions(bookSelect.value);
  chapterSelect.value = "0";
  renderChapter();
  saveLastBookChapter();
});

chapterSelect.addEventListener("change", () => {
  activeScriptureFocus = null;
  renderChapter();
  saveLastBookChapter();
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
  activeTypeEditorId = typeSelect.value;
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
  if (activeOnboardingStepIndex === 0) {
    return;
  }

  activeOnboardingStepIndex -= 1;
  renderOnboardingStep();
});

onboardingNextButton.addEventListener("click", () => {
  if (activeOnboardingStepIndex >= onboardingSteps.length - 1) {
    return;
  }

  activeOnboardingStepIndex += 1;
  renderOnboardingStep();
});

onboardingFinishButton.addEventListener("click", () => {
  onboardingDialog.close();
  void writeStoredValue(onboardingStorageKey, true);
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

  if (pendingAutoSyncTimer) {
    window.clearTimeout(pendingAutoSyncTimer);
    pendingAutoSyncTimer = null;
  }

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

downloadBackupButton.addEventListener("click", downloadWorkspaceBackup);

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

const BUILTIN_TRANSLATION_CODES = new Set(Object.keys(translationLibrary));

/**
 * Parse a translation .js file of the form:
 *   window.CODE_BIBLE = { "Genesis": [...], ... }
 * Optionally also reads metadata declarations above it:
 *   window.CODE_LABEL = "Full Translation Name";
 *   window.CODE_LANGUAGE = "en";
 *   window.CODE_COPYRIGHT = "...";
 *   window.CODE_VERSION = 1;
 * The data portion is valid JSON so we use JSON.parse – no eval required.
 */
const parseTranslationJs = (content) => {
  const trimmed = content.trim();
  const match = trimmed.match(/window\.([A-Z][A-Z0-9_]*)_BIBLE\s*=\s*/);

  if (!match) {
    throw new Error("File does not look like a translation file. Expected: window.CODE_BIBLE = {...}");
  }

  const code = match[1];
  const jsonPart = trimmed.slice(match.index + match[0].length).replace(/;\s*$/, "");
  let data;

  try {
    data = JSON.parse(jsonPart);
  } catch (e) {
    throw new Error(`Could not parse translation data: ${e.message}`);
  }

  // Optionally extract metadata from declarations above the BIBLE assignment.
  const labelMatch = trimmed.match(new RegExp(`window\\.${code}_LABEL\\s*=\\s*"([^"]+)"`));
  const label = labelMatch ? labelMatch[1] : code;

  const languageMatch = trimmed.match(new RegExp(`window\\.${code}_LANGUAGE\\s*=\\s*"([^"]+)"`));
  const language = languageMatch ? languageMatch[1] : null;

  const copyrightMatch = trimmed.match(new RegExp(`window\\.${code}_COPYRIGHT\\s*=\\s*"([^"]+)"`));
  const copyright = copyrightMatch ? copyrightMatch[1] : null;

  const versionMatch = trimmed.match(new RegExp(`window\\.${code}_VERSION\\s*=\\s*(\\d+)`));
  const version = versionMatch ? Number(versionMatch[1]) : null;

  return { code, label, language, copyright, version, data };
};

const builtinTranslationCacheKeyPrefix = "service-notes-builtin-";

/**
 * Ensure a translation's book data is loaded. For built-in translations this
 * checks the IndexedDB cache first; if absent (or the cached version is older
 * than the current version) it fetches the .js file, parses it with
 * parseTranslationJs, and caches the result for future sessions.
 * Custom translations already have `books` populated when loaded from IndexedDB
 * so this is a no-op for them.
 */
const ensureTranslationLoaded = async (code) => {
  const entry = translationLibrary[code];

  if (!entry || entry.books) {
    return;
  }

  // Try the IndexedDB cache first.
  const cached = await readStoredValue(`${builtinTranslationCacheKeyPrefix}${code}`);

  if (cached && typeof cached === "object" && !Array.isArray(cached)) {
    // Only use cached data when the version matches. Old caches that pre-date
    // versioning (no _version field) are always considered stale when the
    // library entry declares a version.
    const cachedVersion = cached._version ?? null;
    const currentVersion = entry.version ?? null;

    if (currentVersion !== null && cachedVersion === currentVersion) {
      entry.books = cached.books ?? cached;
      return;
    }

    if (currentVersion === null && cached.books) {
      entry.books = cached.books;
      return;
    }

    // Version mismatch or stale legacy cache – fall through to re-fetch.
  }

  // Cache miss or stale version — fetch and parse the source file.
  const response = await fetch(entry.scriptSrc);

  if (!response.ok) {
    throw new Error(`Failed to load translation "${code}": ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const { data } = parseTranslationJs(text);
  entry.books = data;
  void writeStoredValue(`${builtinTranslationCacheKeyPrefix}${code}`, { _version: entry.version ?? null, books: data });
};

/**
 * Validate that a parsed translation object has the expected shape:
 * { BookName: [{ chapter: N, verses: [{ verse: N, text: "..." }, ...] }] }
 * We check only the first 3 books for performance — translation files are very
 * large (entire Bible) and a structural check of a representative sample is
 * sufficient to distinguish a valid translation from an unrelated file.
 */
const validateTranslationData = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }

  const books = Object.keys(data);

  if (books.length === 0) {
    return false;
  }

  for (const book of books.slice(0, 3)) {
    const chapters = data[book];

    if (!Array.isArray(chapters) || chapters.length === 0) {
      return false;
    }

    const chapter = chapters[0];

    if (!chapter || typeof chapter.chapter !== "number" || !Array.isArray(chapter.verses) || chapter.verses.length === 0) {
      return false;
    }

    const verse = chapter.verses[0];

    if (!verse || typeof verse.verse !== "number" || typeof verse.text !== "string") {
      return false;
    }
  }

  return true;
};

/** Populate the translation <select> from the current translationLibrary. */
const populateTranslationSelect = () => {
  const current = translationSelect.value || currentTranslationCode;
  translationSelect.innerHTML = "";

  // Determine whether there are multiple languages in the library so we can
  // show the ISO language code as a disambiguating suffix.
  const languages = new Set(
    Object.values(translationLibrary)
      .map((e) => e.language)
      .filter(Boolean)
  );
  const showLanguage = languages.size > 1;

  // Sort entries alphabetically by label.
  const sorted = Object.entries(translationLibrary).sort(([, a], [, b]) => {
    const aLabel = a.label ?? "";
    const bLabel = b.label ?? "";
    return aLabel.localeCompare(bLabel, undefined, { sensitivity: "base" });
  });

  sorted.forEach(([code, entry]) => {
    const option = document.createElement("option");
    option.value = code;
    const label = entry.label ?? code;
    option.textContent = showLanguage && entry.language ? `${label} (${entry.language})` : label;
    translationSelect.append(option);
  });

  if (translationLibrary[current]) {
    translationSelect.value = current;
  } else {
    translationSelect.value = translationLibrary["KJV"] ? "KJV" : (Object.keys(translationLibrary)[0] ?? "");
  }
};

/** Register a parsed translation into the live library and persist it. */
const registerCustomTranslation = (code, label, language, copyright, data) => {
  translationLibrary[code] = { label, language: language ?? null, copyright: copyright ?? null, books: data };
  userTranslations = userTranslations.filter((t) => t.code !== code);
  userTranslations.push({ code, label, language: language ?? null, copyright: copyright ?? null, data });
  void writeStoredValue(customTranslationsStorageKey, userTranslations);
  populateTranslationSelect();
};

/** Load user-added translations from IndexedDB and inject into translationLibrary. */
const loadCustomTranslations = async () => {
  const stored = await readStoredValue(customTranslationsStorageKey);

  if (!Array.isArray(stored)) {
    return;
  }

  stored.forEach(({ code, label, language, copyright, data }) => {
    if (code && label && validateTranslationData(data)) {
      translationLibrary[code] = { label, language: language ?? null, copyright: copyright ?? null, books: data };
      userTranslations.push({ code, label, language: language ?? null, copyright: copyright ?? null, data });
    }
  });
};

/**
 * Import a translation from a File object.
 * Returns a promise that resolves with the translation code on success.
 */
const importTranslationFromFile = async (file) => {
  const content = await file.text();
  const { code, label, language, copyright, data } = parseTranslationJs(content);

  if (!validateTranslationData(data)) {
    throw new Error(`"${file.name}" does not contain valid Bible translation data.`);
  }

  if (BUILTIN_TRANSLATION_CODES.has(code)) {
    throw new Error(`"${code}" is already a built-in translation and cannot be overwritten.`);
  }

  registerCustomTranslation(code, label, language, copyright, data);
  return code;
};

/**
 * Download and import a translation from a URL.
 * Returns a promise that resolves with the translation code on success.
 */
const importTranslationFromUrl = async (url) => {
  let content;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }

    content = await response.text();
  } catch (e) {
    throw new Error(`Failed to download translation: ${e.message}`);
  }

  const { code, label, language, copyright, data } = parseTranslationJs(content);

  if (!validateTranslationData(data)) {
    throw new Error("The downloaded file does not contain valid Bible translation data.");
  }

  if (BUILTIN_TRANSLATION_CODES.has(code)) {
    throw new Error(`"${code}" is already a built-in translation and cannot be overwritten.`);
  }

  registerCustomTranslation(code, label, language, copyright, data);
  return code;
};

/** Remove a user-added translation from the library and IndexedDB. */
const deleteCustomTranslation = async (code) => {
  if (BUILTIN_TRANSLATION_CODES.has(code)) {
    return;
  }

  delete translationLibrary[code];
  userTranslations = userTranslations.filter((t) => t.code !== code);
  void writeStoredValue(customTranslationsStorageKey, userTranslations);

  if (currentTranslationCode === code) {
    await applyTranslation("KJV");
    void writeStoredValue(translationStorageKey, "KJV");
  }

  populateTranslationSelect();
};

/** Render the Translations settings panel. */
const renderTranslationsPanel = () => {
  const builtinList = document.querySelector("#builtin-translation-list");
  const userList = document.querySelector("#user-translation-list");
  const emptyNote = document.querySelector("#user-translations-empty-note");

  if (!builtinList || !userList || !emptyNote) {
    return;
  }

  builtinList.innerHTML = "";
  [...BUILTIN_TRANSLATION_CODES]
    .sort((a, b) => {
      const aLabel = translationLibrary[a]?.label ?? a;
      const bLabel = translationLibrary[b]?.label ?? b;
      return aLabel.localeCompare(bLabel, undefined, { sensitivity: "base" });
    })
    .forEach((code) => {
    const entry = translationLibrary[code];

    if (!entry) {
      return;
    }

    const li = document.createElement("li");
    li.className = "translation-list-item";

    const info = document.createElement("span");
    info.className = "translation-list-item-info";

    const codeEl = document.createElement("span");
    codeEl.className = "translation-list-item-code";
    codeEl.textContent = code;

    const labelEl = document.createElement("span");
    labelEl.className = "translation-list-item-label";
    labelEl.textContent = entry.label;

    info.append(codeEl, labelEl);
    li.append(info);
    builtinList.append(li);
  });

  userList.innerHTML = "";
  const hasUser = userTranslations.length > 0;
  emptyNote.hidden = hasUser;

  [...userTranslations]
    .sort((a, b) => (a.label ?? a.code).localeCompare(b.label ?? b.code, undefined, { sensitivity: "base" }))
    .forEach(({ code, label }) => {
    const li = document.createElement("li");
    li.className = "translation-list-item";

    const info = document.createElement("span");
    info.className = "translation-list-item-info";

    const codeEl = document.createElement("span");
    codeEl.className = "translation-list-item-code";
    codeEl.textContent = code;

    const labelEl = document.createElement("span");
    labelEl.className = "translation-list-item-label";
    labelEl.textContent = label;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "ghost-button ghost-button--danger ghost-button--small";
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.deleteTranslation = code;

    info.append(codeEl, labelEl);
    li.append(info, deleteBtn);
    userList.append(li);
  });
};

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


const buildBookAliasMap = () => {
  const currentBooks = getCurrentTranslation()?.books;

  if (!currentBooks) {
    return;
  }

  bookAliasMap.clear();
  Object.keys(currentBooks).forEach((book) => {
    getEffectiveAliasesForBook(book).forEach((alias) => {
      addBookAlias(alias, book);
    });
  });

  const aliasPattern = [...bookAliasMap.keys()]
    .sort((left, right) => right.length - left.length)
    .map((alias) => escapeRegExp(alias))
    .join("|");

  explicitScriptureReferencePattern = new RegExp(
    `\\b(${aliasPattern})\\s+(\\d+)(?::\\d+(?:-\\d+)?)?(?:\\s*,\\s*(?:(?:\\d+:)?\\d+(?:-\\d+)?))*`,
    "gi"
  );
  fullExplicitScriptureReferencePattern = new RegExp(
    `^(${aliasPattern})\\s+((?:\\d+)(?::\\d+(?:-\\d+)?)?(?:\\s*,\\s*(?:(?:\\d+:)?\\d+(?:-\\d+)?))*)$`,
    "i"
  );
  contextualScriptureReferencePattern = /\b(v(?:erse)?\.?\s*\d+(?:-\d+)?)\b/gi;
};

const bootstrap = async () => {
  await loadCustomTranslations();
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

chapterText.addEventListener("copy", (event) => {
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
