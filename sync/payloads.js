window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createSyncPayloads = (deps) => {
  const {
    workspace,
    cloudSyncSettings,
    paneGrid,
    getCurrentThemeMode,
    getCurrentPaneSplit,
    getCurrentTranslationCode,
    getCurrentColorThemeId,
    getTranslationStateForSync,
    flushEditorWorkNow,
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
    applySyncedTranslationState,
    ensureWorkspaceConsistency,
    buildBookAliasMap,
    renderWorkspace
  } = deps;

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
      theme: getCurrentThemeMode(),
      paneOrder: paneGrid.dataset.order === "scripture-first" ? "scripture-first" : "notes-first",
      paneSplit: getCurrentPaneSplit(),
      translation: getCurrentTranslationCode(),
      colorTheme: getCurrentColorThemeId()
    },
    translationState: getTranslationStateForSync ? getTranslationStateForSync() : undefined,
    syncSettings: {
      provider: cloudSyncSettings.provider,
      pollIntervalSeconds: cloudSyncSettings.pollIntervalSeconds
    }
  });

  const buildCloudNotesPayload = (updatedAt = new Date().toISOString()) => ({
    version: 2,
    updatedAt,
    notes: structuredClone(workspace.notes)
  });

  const buildCloudSyncPayload = () => {
    flushEditorWorkNow();
    const updatedAt = new Date().toISOString();

    return {
      updatedAt,
      settings: buildCloudSettingsPayload(updatedAt),
      notes: buildCloudNotesPayload(updatedAt)
    };
  };

  const applyCloudPayload = async (payload) => {
    if (Array.isArray(payload.notes)) {
      console.log("[CloudSync] Applying remote notes payload", payload.notes.map((note) => ({
        id: note.id,
        typeId: note.typeId,
        updatedAt: note.updatedAt,
        metadata: note.metadata
      })));
    }

    if (payload.workspace) {
      workspace.noteTypes = payload.workspace.noteTypes;
      workspace.activeNoteId = payload.workspace.activeNoteId;
      workspace.selectedNewNoteTypeId = payload.workspace.selectedNewNoteTypeId;
      workspace.customBookAliases = payload.workspace.customBookAliases ?? {};
      workspace.updatedAt = payload.workspace.updatedAt ?? payload.updatedAt ?? new Date().toISOString();
    }

    if (Array.isArray(payload.notes)) {
      if (payload.notesArePartial) {
        const remoteNotesById = new Map(payload.notes.map((note) => [note.id, note]));
        const mergedNotes = workspace.notes.map((note) => remoteNotesById.get(note.id) ?? note);

        for (const note of payload.notes) {
          if (!mergedNotes.some((existing) => existing.id === note.id)) {
            mergedNotes.push(note);
          }
        }

        workspace.notes = mergedNotes;
      } else {
        workspace.notes = payload.notes;
      }
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
        void writeStoredValue(paneSplitStorageKey, getCurrentPaneSplit());
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

    if (payload.translationState && typeof applySyncedTranslationState === "function") {
      await applySyncedTranslationState(payload.translationState);
    }

    ensureWorkspaceConsistency();
    buildBookAliasMap();
    console.log("[CloudSync] Workspace after remote payload normalization", workspace.notes.map((note) => ({
      id: note.id,
      typeId: note.typeId,
      updatedAt: note.updatedAt,
      metadata: note.metadata
    })));
    renderWorkspace();
    void writeStoredValue(deps.workspaceStorageKey, workspace);
  };

  return {
    buildCloudSettingsPayload,
    buildCloudNotesPayload,
    buildCloudSyncPayload,
    applyCloudPayload
  };
};
