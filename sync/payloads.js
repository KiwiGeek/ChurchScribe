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

    ensureWorkspaceConsistency();
    buildBookAliasMap();
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
