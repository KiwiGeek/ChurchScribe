window.ScriptoriaModules = window.ScriptoriaModules || {};

// ── Shared workspace logic ────────────────────────────────────────────────────
// Functions that must stay identical between the desktop (app.js) and mobile
// (mobile.js) entry points:
//
//   normalizeCloudSyncSettings   — sanitises raw IDB data into the expected shape
//   ensureWorkspaceConsistency   — normalises the full workspace object
//   migrateFromLegacyDatabase    — one-time copy from churchscribe-db → scriptoria-db
//   migrateLegacyNotes           — converts flat legacy notes into typed notes
//   restoreWorkspace             — loads the workspace from IDB on startup
//
// Depends on window.ScriptoriaStorage (core/storage.js) being loaded first.
// ─────────────────────────────────────────────────────────────────────────────

window.ScriptoriaModules.createWorkspace = (deps) => {
  const {
    workspace,
    workspaceStorageKey,
    notesStorageKey,
    legacyNotesStorageKey,
    createId,
    createDefaultNoteType,
    createEmptyNote,
    buildMetadataForType,
    getNoteTypeById,
    getActiveNote,
    getSuggestedCardTitleFieldId,
    getDefaultCardSubtitleFieldId,
    ensureSelectedTypeForManager,
    readStoredValue,
    migrateLegacyPreference,
    openDatabase,
    buildBookAliasMap,
    renderWorkspace,
    persistWorkspace,
    updateSaveStatus,
    refreshSaveStatus
  } = deps;

  const { legacyDbName, dbStoreName } = window.ScriptoriaStorage;

  // ── Cloud sync settings normaliser ─────────────────────────────────────────
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

  // ── Workspace consistency ───────────────────────────────────────────────────
  // Normalises the workspace object after loading from IDB or applying a cloud
  // payload.  Must be kept in sync with the workspace schema; having one copy
  // here is the main motivation for this extraction.
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

  // ── Legacy DB migration ─────────────────────────────────────────────────────
  // Copies all records from the legacy churchscribe-db into scriptoria-db on
  // first run.  Only runs when the new database has no workspace data yet.
  // TODO: Remove this migration after a future release when churchscribe-db can
  //       be retired.
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

  // ── Legacy notes migration ──────────────────────────────────────────────────
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

  // ── Workspace restore ───────────────────────────────────────────────────────
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

  return {
    normalizeCloudSyncSettings,
    ensureWorkspaceConsistency,
    migrateFromLegacyDatabase,
    migrateLegacyNotes,
    restoreWorkspace
  };
};
