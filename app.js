const translationLibrary = {
  KJV: {
    label: "King James Version",
    books: window.KJV_BIBLE
  },
  ASV: {
    label: "American Standard Version",
    books: window.ASV_BIBLE
  }
};

const noteEditor = document.querySelector("#note-editor");
const saveStatus = document.querySelector("#save-status");
const themeToggle = document.querySelector("#theme-toggle");
const themeToggleState = document.querySelector("#theme-toggle-state");
const themeToggleLabel = document.querySelector(".theme-toggle-label");
const paneOrderToggle = document.querySelector("#pane-order-toggle");
const paneOrderToggleState = document.querySelector("#pane-order-toggle-state");
const toolbarButtons = document.querySelectorAll(".tool-button");
const newNoteDirectButton = document.querySelector("#new-note-direct-button");
const newNoteButton = document.querySelector("#new-note-button");
const duplicateNoteButton = document.querySelector("#duplicate-note-button");
const deleteNoteButton = document.querySelector("#delete-note-button");
const manageNotesButton = document.querySelector("#manage-notes-button");
const settingsButton = document.querySelector("#settings-button");
const noteDetailsButton = document.querySelector("#note-details-button");
const noteList = document.querySelector("#note-list");
const noteTypeSelect = document.querySelector("#note-type-select");
const newNoteTypeSelect = document.querySelector("#new-note-type-select");
const newNoteTypeField = document.querySelector("#new-note-type-field");
const activeNoteTypeField = document.querySelector("#active-note-type-field");
const metadataSummary = document.querySelector("#metadata-summary");
const noteMetaFields = document.querySelector("#note-meta-fields");
const translationSelect = document.querySelector("#translation-select");
const bookSelect = document.querySelector("#book-select");
const chapterSelect = document.querySelector("#chapter-select");
const verseReference = document.querySelector("#verse-reference");
const chapterText = document.querySelector("#chapter-text");
const verseTranslation = document.querySelector("#verse-translation");
const paneGrid = document.querySelector(".pane-grid");
const noteManagerDialog = document.querySelector("#note-manager-dialog");
const noteManagerList = document.querySelector("#note-manager-list");
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
const cloudAutoSyncInput = document.querySelector("#cloud-auto-sync-input");
const cloudSyncTranslationsInput = document.querySelector("#cloud-sync-translations-input");
const cloudStatusInput = document.querySelector("#cloud-status-input");
const cloudLastSyncInput = document.querySelector("#cloud-last-sync-input");
const providerSettingsContainer = document.querySelector("#provider-settings-container");
const googleConnectButton = document.querySelector("#google-connect-button");
const googleDisconnectButton = document.querySelector("#google-disconnect-button");
const googleSyncNowButton = document.querySelector("#google-sync-now-button");
const addTypeButton = document.querySelector("#add-type-button");
const addMetadataFieldButton = document.querySelector("#add-metadata-field-button");
const deleteTypeButton = document.querySelector("#delete-type-button");
const newNoteMenu = document.querySelector("#new-note-menu");
const overflowMenu = document.querySelector(".overflow-menu");
const syncConflictDialog = document.querySelector("#sync-conflict-dialog");
const conflictLocalTime = document.querySelector("#conflict-local-time");
const conflictRemoteTime = document.querySelector("#conflict-remote-time");
const conflictKeepLocalButton = document.querySelector("#conflict-keep-local-button");
const conflictUseCloudButton = document.querySelector("#conflict-use-cloud-button");

const dbName = "churchscribe-db";
const dbVersion = 1;
const dbStoreName = "kv";
const workspaceStorageKey = "service-notes-workspace";
const notesStorageKey = "service-notes";
const legacyNotesStorageKey = "service-notes-content";
const themeStorageKey = "service-notes-theme";
const paneOrderStorageKey = "service-notes-pane-order";
const translationStorageKey = "service-notes-translation";
const cloudSyncStorageKey = "service-notes-cloud-sync";
const autoCloudSyncDelayMs = 10000;

const activeProvider = window.GoogleDriveProvider ?? {
  id: "none",
  displayName: "Cloud Storage",
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
  download: () => Promise.reject(new Error("No storage provider configured."))
};

if (!window.GoogleDriveProvider) {
  console.error("No storage provider registered. Ensure a provider script (e.g. gdrive.js) is loaded before app.js.");
}

const bookAliasMap = new Map();
let explicitScriptureReferencePattern;
let fullExplicitScriptureReferencePattern;
let contextualScriptureReferencePattern;
let activeScriptureFocus = null;
let currentTranslationCode = "KJV";
let activeTypeEditorId = null;
let activeSettingsTabId = "note-types";
let dbPromise;
let pendingAutoSyncTimer = null;
let syncInFlightPromise = null;
let isPullInFlight = false;
let cloudPollTimer = null;

const workspace = {
  noteTypes: [],
  notes: [],
  activeNoteId: null,
  selectedNewNoteTypeId: null,
  customBookAliases: {}
};

const settingsTabs = [
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
    label: "Cloud Sync"
  }
];

const cloudSyncSettings = {
  provider: "google-drive",
  autoSync: true,
  pollIntervalSeconds: 60,
  syncTranslations: false,
  status: "Not connected",
  lastSyncAt: null,
  connectedEmail: "",
  remoteWorkspaceFileId: "",
  remoteWorkspaceParentId: "",
  lastError: "",
  providerSettings: {}
};

const normalizeCloudSyncSettings = (value = {}) => ({
  provider: typeof value.provider === "string" ? value.provider : "google-drive",
  autoSync: typeof value.autoSync === "boolean" ? value.autoSync : true,
  pollIntervalSeconds: Number(value.pollIntervalSeconds) || 60,
  syncTranslations: typeof value.syncTranslations === "boolean" ? value.syncTranslations : false,
  status: typeof value.status === "string" && value.status ? value.status : "Not connected",
  lastSyncAt: typeof value.lastSyncAt === "string" ? value.lastSyncAt : null,
  connectedEmail: typeof value.connectedEmail === "string" ? value.connectedEmail : "",
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

const getBuiltInAliasesForBook = (book) => {
  const aliases = new Set([book, book.replace(/\s+/g, "")]);

  if (book === "Psalms") {
    aliases.add("Psalm");
    aliases.add("Ps");
    aliases.add("Psa");
  }

  if (book === "Song of Solomon") {
    aliases.add("Song");
    aliases.add("Song of Songs");
    aliases.add("SOS");
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
};

const persistWorkspace = () => {
  ensureWorkspaceConsistency();
  void writeStoredValue(workspaceStorageKey, structuredClone(workspace));
  scheduleAutoCloudSync();
};

const updateSaveStatus = (message) => {
  saveStatus.textContent = message;
};

const persistCloudSyncSettings = () => {
  void writeStoredValue(cloudSyncStorageKey, structuredClone(cloudSyncSettings));
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

  if (
    typeof savedSettings?.useVisibleDriveFolder === "boolean" &&
    !("useVisibleDriveFolder" in cloudSyncSettings.providerSettings[providerId])
  ) {
    cloudSyncSettings.providerSettings[providerId].useVisibleDriveFolder =
      savedSettings.useVisibleDriveFolder;
  }

  resetTransientCloudSessionState();
  persistCloudSyncSettings();
};

const buildCloudStatusText = () => {
  if (!activeProvider.isAvailable()) {
    return "Cloud provider not loaded";
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
  const cloudLabel = cloudSyncSettings.lastError
    ? `Cloud sync failed: ${cloudSyncSettings.lastError}`
    : syncedAt
      ? `Synced to cloud ${new Date(syncedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
      : "Not synced to cloud yet";

  return `${localLabel} • ${cloudLabel}`;
};

const refreshSaveStatus = () => {
  const activeNote = getActiveNote();
  const savedAt = activeNote?.updatedAt ?? new Date();
  updateSaveStatus(buildSaveStatusText(savedAt));
};

const buildCloudSyncPayload = () => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  workspace: structuredClone(workspace),
  preferences: {
    theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    paneOrder: paneGrid.dataset.order === "scripture-first" ? "scripture-first" : "notes-first",
    translation: currentTranslationCode
  },
  syncSettings: {
    provider: cloudSyncSettings.provider,
    autoSync: cloudSyncSettings.autoSync,
    pollIntervalSeconds: cloudSyncSettings.pollIntervalSeconds,
    syncTranslations: cloudSyncSettings.syncTranslations
  }
});

const getActiveProviderSettings = () => ({
  ...cloudSyncSettings.providerSettings[activeProvider.id],
  remoteWorkspaceFileId: cloudSyncSettings.remoteWorkspaceFileId,
  remoteWorkspaceParentId: cloudSyncSettings.remoteWorkspaceParentId
});

const getCloudTargetLabel = () =>
  activeProvider.getLocationLabel(cloudSyncSettings.providerSettings[activeProvider.id] ?? {});

const buildProviderStatusLabel = () => {
  const suffix = getCloudTargetLabel();
  return suffix ? `${activeProvider.displayName} (${suffix})` : activeProvider.displayName;
};

const applyCloudPayload = (payload) => {
  if (payload.workspace) {
    Object.assign(workspace, payload.workspace);
  }

  if (payload.preferences) {
    if (payload.preferences.theme) {
      applyTheme(payload.preferences.theme);
      void writeStoredValue(themeStorageKey, payload.preferences.theme);
    }

    if (payload.preferences.paneOrder) {
      applyPaneOrder(payload.preferences.paneOrder);
      void writeStoredValue(paneOrderStorageKey, payload.preferences.paneOrder);
    }

    if (payload.preferences.translation) {
      applyTranslation(payload.preferences.translation);
      void writeStoredValue(translationStorageKey, payload.preferences.translation);
    }
  }

  ensureWorkspaceConsistency();
  buildBookAliasMap();
  renderWorkspace();
  void writeStoredValue(workspaceStorageKey, structuredClone(workspace));
};

const hasLocalNoteData = () =>
  workspace.notes.some((note) => note.content || Object.values(note.metadata).some(Boolean));

const hasLocalChangesSinceLastSync = () => {
  if (!cloudSyncSettings.lastSyncAt) {
    return hasLocalNoteData();
  }

  const lastSync = new Date(cloudSyncSettings.lastSyncAt);

  return workspace.notes.some((note) => new Date(note.updatedAt) > lastSync);
};

const showSyncConflictDialog = (remotePayload) => new Promise((resolve) => {
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
    event.preventDefault();
  };

  const cleanup = () => {
    conflictKeepLocalButton.removeEventListener("click", handleKeepLocal);
    conflictUseCloudButton.removeEventListener("click", handleUseCloud);
    syncConflictDialog.removeEventListener("cancel", handleCancel);
    syncConflictDialog.close();
  };

  conflictKeepLocalButton.addEventListener("click", handleKeepLocal);
  conflictUseCloudButton.addEventListener("click", handleUseCloud);
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

    if (result.remoteWorkspaceFileId !== cloudSyncSettings.remoteWorkspaceFileId ||
        result.remoteWorkspaceParentId !== cloudSyncSettings.remoteWorkspaceParentId) {
      cloudSyncSettings.remoteWorkspaceFileId = result.remoteWorkspaceFileId;
      cloudSyncSettings.remoteWorkspaceParentId = result.remoteWorkspaceParentId;
      persistCloudSyncSettings();
    }

    const remotePayload = result.data;

    if (!remotePayload) {
      console.log("[CloudSync] No remote file found.");

      if (hasLocalNoteData()) {
        console.log("[CloudSync] Local data exists with no cloud copy; triggering initial upload.");
        void syncWorkspaceToCloud({ reason: "initial" });
      } else {
        console.log("[CloudSync] No local data to upload; nothing to do.");
      }

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
      const hasData = hasLocalNoteData();
      console.log(`[CloudSync] First sync — local has data: ${hasData}. ${hasData ? "Showing conflict dialog." : "Auto-applying remote."}`);
      resolution = hasData ? await showSyncConflictDialog(remotePayload) : "remote";
    } else if (localHasChanges) {
      console.log("[CloudSync] Both sides changed since last sync — showing conflict dialog.");
      resolution = await showSyncConflictDialog(remotePayload);
    } else {
      console.log("[CloudSync] No local changes since last sync — auto-applying remote data.");
      resolution = "remote";
    }

    console.log(`[CloudSync] Conflict resolution: ${resolution}`);

    if (resolution === "remote") {
      applyCloudPayload(remotePayload);

      if (remotePayload.updatedAt) {
        cloudSyncSettings.lastSyncAt = remotePayload.updatedAt;
      } else {
        console.warn("[CloudSync] Remote payload is missing updatedAt timestamp; unable to update last sync time. Sync state may be inconsistent.");
      }

      cloudSyncSettings.lastError = "";
      persistCloudSyncSettings();
      renderSettings();
      refreshSaveStatus();
      console.log("[CloudSync] Remote data applied successfully.");
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

  if (!cloudSyncSettings.autoSync || !activeProvider.hasActiveSession()) {
    console.log(`[CloudSync] Background polling not started (autoSync=${cloudSyncSettings.autoSync}, connected=${activeProvider.hasActiveSession()}).`);
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

      const result = await activeProvider.upload(buildCloudSyncPayload(), getActiveProviderSettings());

      cloudSyncSettings.remoteWorkspaceFileId = result.remoteWorkspaceFileId;
      cloudSyncSettings.remoteWorkspaceParentId = result.remoteWorkspaceParentId;
      cloudSyncSettings.lastSyncAt = new Date().toISOString();
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
  if (!cloudSyncSettings.autoSync || !activeProvider.hasActiveSession()) {
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
  if (activeProvider.hasActiveSession()) {
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

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getPreferredPaneOrder = async () => {
  const savedOrder = await migrateLegacyPreference(paneOrderStorageKey);
  return savedOrder === "scripture-first" ? "scripture-first" : "notes-first";
};

const getPreferredTranslation = async () => {
  const savedTranslation = await migrateLegacyPreference(translationStorageKey);
  return translationLibrary[savedTranslation] ? savedTranslation : "KJV";
};

const syncThemeToggle = (theme) => {
  const darkModeEnabled = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(darkModeEnabled));
  themeToggleLabel.textContent = "Dark mode";
  themeToggleState.textContent = darkModeEnabled ? "On" : "Off";
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  syncThemeToggle(theme);
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  void writeStoredValue(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
  scheduleAutoCloudSync();
};

const syncPaneOrderToggle = (order) => {
  const scriptureFirst = order === "scripture-first";
  paneOrderToggle.setAttribute("aria-pressed", String(scriptureFirst));
  paneOrderToggleState.textContent = scriptureFirst ? "On" : "Off";
};

const applyPaneOrder = (order) => {
  paneGrid.dataset.order = order;
  syncPaneOrderToggle(order);
};

const togglePaneOrder = () => {
  const currentOrder = paneGrid.dataset.order === "scripture-first" ? "scripture-first" : "notes-first";
  const nextOrder = currentOrder === "scripture-first" ? "notes-first" : "scripture-first";
  void writeStoredValue(paneOrderStorageKey, nextOrder);
  applyPaneOrder(nextOrder);
  scheduleAutoCloudSync();
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

  chapter.verses.forEach((verse) => {
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
    text.textContent = verse.text;

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

const applyTranslation = (translationCode) => {
  if (!translationLibrary[translationCode]) {
    return;
  }

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
};

const applyCommand = (command) => {
  noteEditor.focus();
  document.execCommand(command, false);
};

const applyBlock = (block) => {
  noteEditor.focus();
  document.execCommand("formatBlock", false, block);
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
      currentChapter = Number(fullChapterSegment[1]);
      continue;
    }

    if (!verseOnlySegment) {
      return null;
    }

    const verseStart = Number(verseOnlySegment[1]);
    const verseEnd = Number(verseOnlySegment[2] ?? verseOnlySegment[1]);
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
    return {
      parsedReference: {
        book: canonicalBook,
        chapter: Number(verseOnlyMatch[1]),
        firstVerse: null,
        chapterHighlights: new Map()
      },
      currentChapter: Number(verseOnlyMatch[1])
    };
  }

  const verseStart = Number(verseOnlyMatch[1]);
  const verseEnd = Number(verseOnlyMatch[2] ?? verseOnlyMatch[1]);
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

        if (node.parentElement?.closest("a[data-auto-scripture-link='true']")) {
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

  return candidate?.matches?.("a[data-auto-scripture-link='true']") ? candidate : null;
};

const findAutoLinkAtCaret = () => {
  const selection = window.getSelection();

  if (!selection.rangeCount || !selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0);

  if (range.startContainer.nodeType === Node.TEXT_NODE) {
    const parentLink = range.startContainer.parentElement?.closest("a[data-auto-scripture-link='true']");

    if (parentLink && range.startOffset === range.startContainer.nodeValue.length) {
      return parentLink;
    }
  }

  if (range.startContainer.nodeType === Node.ELEMENT_NODE && range.startOffset > 0) {
    const previousNode = range.startContainer.childNodes[range.startOffset - 1];
    const previousLink = previousNode?.nodeType === Node.ELEMENT_NODE
      ? previousNode.closest?.("a[data-auto-scripture-link='true']") ?? previousNode
      : previousNode?.parentElement?.closest("a[data-auto-scripture-link='true']");

    if (previousLink?.matches?.("a[data-auto-scripture-link='true']")) {
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

const renderNoteTypeOptions = () => {
  const activeNote = getActiveNote();
  const showTypeChoices = workspace.noteTypes.length > 1;
  noteTypeSelect.innerHTML = "";
  newNoteTypeSelect.innerHTML = "";

  workspace.noteTypes.forEach((type) => {
    const activeOption = document.createElement("option");
    activeOption.value = type.id;
    activeOption.textContent = type.name;
    noteTypeSelect.append(activeOption);

    const newNoteOption = document.createElement("option");
    newNoteOption.value = type.id;
    newNoteOption.textContent = type.name;
    newNoteTypeSelect.append(newNoteOption);
  });

  noteTypeSelect.value = activeNote.typeId;
  newNoteTypeSelect.value = workspace.selectedNewNoteTypeId;
  newNoteDirectButton.classList.toggle("is-hidden", showTypeChoices);
  newNoteMenu.classList.toggle("is-hidden", !showTypeChoices);
  newNoteTypeField.classList.toggle("is-hidden", !showTypeChoices);
  activeNoteTypeField.classList.toggle("is-hidden", !showTypeChoices);
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

const renderNoteList = () => {
  noteList.innerHTML = "";

  workspace.noteTypes.forEach((type) => {
    const notesForType = workspace.notes.filter((note) => note.typeId === type.id);

    if (!notesForType.length) {
      return;
    }

    const group = document.createElement("section");
    group.className = "note-group";

    const heading = document.createElement("h3");
    heading.className = "note-group-heading";
    heading.textContent = type.name;

    group.append(heading);

    notesForType
      .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
      .forEach((note) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `note-card${note.id === workspace.activeNoteId ? " is-active" : ""}`;
        button.setAttribute("role", "option");
        button.setAttribute("aria-selected", String(note.id === workspace.activeNoteId));
        button.dataset.noteId = note.id;

        const title = document.createElement("span");
        title.className = "note-card-title";
        title.textContent = getNoteDisplayTitle(note);

        const meta = document.createElement("span");
        meta.className = "note-card-meta";
        meta.textContent = getNoteDisplayMeta(note);

        const updated = document.createElement("span");
        updated.className = "note-card-date";
        updated.textContent = formatNoteDate(note.updatedAt);

        button.append(title);

        if (meta.textContent) {
          button.append(meta);
        }

        button.append(updated);
        group.append(button);
      });

    noteList.append(group);
  });
};

const renderActiveNote = () => {
  const activeNote = getActiveNote();

  if (!activeNote) {
    return;
  }

  workspace.activeNoteId = activeNote.id;
  renderNoteTypeOptions();
  renderMetadataSummary();
  renderNoteMetadataFields();
  noteEditor.innerHTML = activeNote.content;
  linkifyScriptureReferences();
  renderNoteList();
};

const renderNoteManager = () => {
  noteManagerList.innerHTML = "";

  workspace.notes
    .slice()
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
    .forEach((note) => {
      const row = document.createElement("div");
      row.className = "note-manager-row";
      row.dataset.noteId = note.id;

      const summary = document.createElement("div");
      summary.className = "note-manager-summary";

      const title = document.createElement("span");
      title.className = "note-manager-title";
      title.textContent = getNoteDisplayTitle(note);

      const meta = document.createElement("span");
      meta.className = "note-manager-meta";
      const cardMeta = getNoteDisplayMeta(note);
      meta.textContent = cardMeta
        ? `${getNoteTypeById(note.typeId).name} • ${cardMeta} • Updated ${formatNoteDate(note.updatedAt)}`
        : `${getNoteTypeById(note.typeId).name} • Updated ${formatNoteDate(note.updatedAt)}`;

      summary.append(title, meta);

      const typePicker = document.createElement("label");
      typePicker.className = "field";

      const typePickerLabel = document.createElement("span");
      typePickerLabel.textContent = "Type";

      const select = document.createElement("select");
      select.dataset.noteMove = note.id;

      workspace.noteTypes.forEach((type) => {
        const option = document.createElement("option");
        option.value = type.id;
        option.textContent = type.name;
        select.append(option);
      });

      select.value = note.typeId;
      typePicker.append(typePickerLabel, select);

      const openButton = document.createElement("button");
      openButton.type = "button";
      openButton.className = "ghost-button";
      openButton.dataset.noteAction = "open";
      openButton.dataset.noteId = note.id;
      openButton.textContent = "Open";

      const duplicateButton = document.createElement("button");
      duplicateButton.type = "button";
      duplicateButton.className = "ghost-button";
      duplicateButton.dataset.noteAction = "duplicate";
      duplicateButton.dataset.noteId = note.id;
      duplicateButton.textContent = "Copy";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "ghost-button";
      deleteButton.dataset.noteAction = "delete";
      deleteButton.dataset.noteId = note.id;
      deleteButton.textContent = "Delete";

      row.append(summary, typePicker, openButton, duplicateButton, deleteButton);
      noteManagerList.append(row);
    });
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

    grid.append(label);
  });

  providerSettingsContainer.append(grid);
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

  cloudProviderSelect.value = cloudSyncSettings.provider;
  cloudPollIntervalSelect.value = String(cloudSyncSettings.pollIntervalSeconds);
  cloudAutoSyncInput.checked = cloudSyncSettings.autoSync;
  cloudSyncTranslationsInput.checked = cloudSyncSettings.syncTranslations;
  renderProviderSettings();
  cloudStatusInput.value = buildCloudStatusText();
  cloudLastSyncInput.value = formatSyncTimestamp(cloudSyncSettings.lastSyncAt);
  const hasConnectedDriveSession = activeProvider.hasActiveSession();
  googleConnectButton.classList.toggle("is-hidden", hasConnectedDriveSession);
  googleDisconnectButton.classList.toggle("is-hidden", !hasConnectedDriveSession);
  googleSyncNowButton.classList.toggle("is-hidden", !hasConnectedDriveSession);
  googleConnectButton.disabled = !activeProvider.isAvailable() || hasConnectedDriveSession;
  googleDisconnectButton.disabled = !hasConnectedDriveSession;
  googleSyncNowButton.disabled = !hasConnectedDriveSession;

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

  Object.keys(translationLibrary.KJV.books).forEach((book) => {
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

const touchNote = (note) => {
  note.updatedAt = new Date().toISOString();
};

const refreshNoteSurfaces = () => {
  renderNoteList();
  renderNoteTypeOptions();
  renderMetadataSummary();

  if (noteManagerDialog.open) {
    renderNoteManager();
  }
};

const saveActiveNote = () => {
  const activeNote = getActiveNote();

  if (!activeNote) {
    return;
  }

  activeNote.content = noteEditor.innerHTML;
  noteMetaFields.querySelectorAll("[data-field-id]").forEach((input) => {
    activeNote.metadata[input.dataset.fieldId] = input.value;
  });
  touchNote(activeNote);
  persistWorkspace();
  refreshNoteSurfaces();
  refreshSaveStatus();
};

const setSelectedNewNoteType = (typeId) => {
  workspace.selectedNewNoteTypeId = typeId;
  persistWorkspace();
};

const createNote = () => {
  const type = getNoteTypeById(workspace.selectedNewNoteTypeId);
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

newNoteDirectButton.addEventListener("click", createNote);
newNoteButton.addEventListener("click", () => {
  createNote();
  newNoteMenu.removeAttribute("open");
});
duplicateNoteButton.addEventListener("click", () => {
  duplicateNote();
  overflowMenu.removeAttribute("open");
});
deleteNoteButton.addEventListener("click", () => {
  deleteNoteById(workspace.activeNoteId);
  overflowMenu.removeAttribute("open");
});
noteDetailsButton.addEventListener("click", () => {
  renderNoteMetadataFields();
  openDialog(noteDetailsDialog);
});

manageNotesButton.addEventListener("click", () => {
  renderNoteManager();
  overflowMenu.removeAttribute("open");
  openDialog(noteManagerDialog);
});

settingsButton.addEventListener("click", () => {
  renderSettings();
  overflowMenu.removeAttribute("open");
  openDialog(settingsDialog);
});

themeToggle.addEventListener("click", toggleTheme);
paneOrderToggle.addEventListener("click", togglePaneOrder);

noteTypeSelect.addEventListener("change", () => {
  changeNoteType(workspace.activeNoteId, noteTypeSelect.value);
});

newNoteTypeSelect.addEventListener("change", () => {
  setSelectedNewNoteType(newNoteTypeSelect.value);
});

cardTitleFieldSelect.addEventListener("change", updateSelectedTypeCardFields);
cardSubtitleFieldSelect.addEventListener("change", updateSelectedTypeCardFields);

noteList.addEventListener("click", (event) => {
  const noteButton = event.target.closest("[data-note-id]");

  if (noteButton) {
    switchNote(noteButton.dataset.noteId);
  }
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

noteEditor.addEventListener("input", (event) => {
  if (event.inputType === "insertParagraph" || event.inputType === "insertLineBreak") {
    saveActiveNote();
    return;
  }

  linkifyScriptureReferences({ jumpToCaretReference: true });
  saveActiveNote();
});

noteEditor.addEventListener("keydown", (event) => {
  if (event.key !== "Backspace") {
    return;
  }

  const autoLink = findAutoLinkAtCaret();

  if (!autoLink) {
    return;
  }

  event.preventDefault();
  const textNode = document.createTextNode(autoLink.textContent);
  autoLink.replaceWith(textNode);

  const range = document.createRange();
  range.setStart(textNode, textNode.textContent.length);
  range.collapse(true);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  saveActiveNote();
});

noteEditor.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-auto-scripture-link='true']");

  if (!link) {
    return;
  }

  event.preventDefault();
  jumpToScripture(link.dataset.scriptureRef);
});

translationSelect.addEventListener("change", () => {
  activeScriptureFocus = null;
  void writeStoredValue(translationStorageKey, translationSelect.value);
  applyTranslation(translationSelect.value);
  scheduleAutoCloudSync();
});

bookSelect.addEventListener("change", () => {
  activeScriptureFocus = null;
  populateChapterOptions(bookSelect.value);
  chapterSelect.value = "0";
  renderChapter();
});

chapterSelect.addEventListener("change", () => {
  activeScriptureFocus = null;
  renderChapter();
});

noteManagerList.addEventListener("click", (event) => {
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
    return;
  }

  if (noteAction === "delete") {
    deleteNoteById(noteId);
  }
});

noteManagerList.addEventListener("change", (event) => {
  const moveSelect = event.target.closest("[data-note-move]");

  if (!moveSelect) {
    return;
  }

  changeNoteType(moveSelect.dataset.noteMove, moveSelect.value);
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
  cloudSyncSettings.provider = cloudProviderSelect.value;
  persistCloudSyncSettings();
  scheduleAutoCloudSync();
});

cloudPollIntervalSelect.addEventListener("change", () => {
  cloudSyncSettings.pollIntervalSeconds = Number(cloudPollIntervalSelect.value);
  persistCloudSyncSettings();
  scheduleAutoCloudSync();
  startCloudPolling();
});

cloudAutoSyncInput.addEventListener("change", () => {
  cloudSyncSettings.autoSync = cloudAutoSyncInput.checked;
  persistCloudSyncSettings();

  if (cloudSyncSettings.autoSync) {
    startCloudPolling();
  } else {
    stopCloudPolling();

    if (pendingAutoSyncTimer) {
      window.clearTimeout(pendingAutoSyncTimer);
      pendingAutoSyncTimer = null;
    }
  }
});

cloudSyncTranslationsInput.addEventListener("change", () => {
  cloudSyncSettings.syncTranslations = cloudSyncTranslationsInput.checked;
  persistCloudSyncSettings();
  scheduleAutoCloudSync();
});

const handleProviderSettingChange = (key, value) => {
  const currentSettings = cloudSyncSettings.providerSettings[activeProvider.id] ?? {};
  currentSettings[key] = value;
  cloudSyncSettings.providerSettings[activeProvider.id] = currentSettings;

  const result = activeProvider.applySettingChange(key, value);

  if (result?.clearRemoteState) {
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

addTypeButton.addEventListener("click", addNoteType);
addMetadataFieldButton.addEventListener("click", addMetadataFieldToSelectedType);
deleteTypeButton.addEventListener("click", deleteSelectedType);

const buildBookAliasMap = () => {
  bookAliasMap.clear();
  Object.keys(translationLibrary.KJV.books).forEach((book) => {
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
  buildBookAliasMap();
  applyTheme(await getPreferredTheme());
  applyPaneOrder(await getPreferredPaneOrder());
  applyTranslation(await getPreferredTranslation());
  await restoreCloudSyncSettings();
  activeProvider.waitForReady(() => {
    void reconnectCloud();

    if (settingsDialog.open) {
      renderSettings();
    }
  });
  await restoreWorkspace();
};

void bootstrap();
