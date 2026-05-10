window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createSettingsBackupRestore = (deps) => {
  const downloadWorkspaceBackup = () => {
    const exportedAt = new Date().toISOString();
    const backup = {
      type: "scriptoria-backup",
      version: 1,
      exportedAt,
      workspace: {
        noteTypes: structuredClone(deps.workspace.noteTypes),
        customBookAliases: structuredClone(deps.workspace.customBookAliases),
        activeNoteId: deps.workspace.activeNoteId,
        selectedNewNoteTypeId: deps.workspace.selectedNewNoteTypeId
      },
      notes: structuredClone(deps.workspace.notes),
      customTranslations: structuredClone(deps.getUserTranslations()),
      preferences: {
        theme: deps.getCurrentThemeMode(),
        paneOrder: deps.paneGrid.dataset.order === "scripture-first" ? "scripture-first" : "notes-first",
        paneSplit: deps.getCurrentPaneSplit(),
        translation: deps.getCurrentTranslationCode(),
        colorTheme: deps.getCurrentColorThemeId()
      }
    };
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scriptoria-backup-${exportedAt.split("T")[0]}.json`;
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
        throw new Error("The selected file does not appear to be a Scriptoria backup.");
      }

      if (!window.confirm("This will replace your current library with the backup. Your existing data will be overwritten. Continue?")) {
        return;
      }

      deps.workspace.noteTypes = backup.workspace.noteTypes ?? deps.workspace.noteTypes;
      deps.workspace.customBookAliases = backup.workspace.customBookAliases ?? {};
      deps.workspace.activeNoteId = backup.workspace.activeNoteId ?? deps.workspace.activeNoteId;
      deps.workspace.selectedNewNoteTypeId = backup.workspace.selectedNewNoteTypeId ?? deps.workspace.selectedNewNoteTypeId;
      deps.workspace.notes = backup.notes;

      if (Array.isArray(backup.customTranslations)) {
        deps.getUserTranslations().forEach(({ code }) => {
          if (!deps.BUILTIN_TRANSLATION_CODES.has(code)) {
            delete deps.translationLibrary[code];
          }
        });

        const restoredTranslations = [];

        backup.customTranslations.forEach(({ code, label, language, copyright, data }) => {
          if (code && label && !deps.BUILTIN_TRANSLATION_CODES.has(code) && deps.validateTranslationData(data)) {
            deps.translationLibrary[code] = { label, language: language ?? null, copyright: copyright ?? null, books: data };
            restoredTranslations.push({ code, label, language: language ?? null, copyright: copyright ?? null, data });
          }
        });

        deps.setUserTranslations(restoredTranslations);
        void deps.writeStoredValue(deps.customTranslationsStorageKey, restoredTranslations);
        deps.populateTranslationSelect();
      }

      if (backup.preferences) {
        const { preferences } = backup;

        if (preferences.theme) {
          deps.applyThemeMode(preferences.theme, { rerender: false });
          void deps.writeStoredValue(deps.themeStorageKey, deps.normalizeThemeMode(preferences.theme));
        }

        if (preferences.paneOrder) {
          deps.applyPaneOrder(preferences.paneOrder);
          void deps.writeStoredValue(deps.paneOrderStorageKey, preferences.paneOrder);
        }

        if (typeof preferences.paneSplit === "number") {
          deps.applySplit(preferences.paneSplit);
          void deps.writeStoredValue(deps.paneSplitStorageKey, deps.getCurrentPaneSplit());
        }

        if (preferences.translation) {
          await deps.applyTranslation(preferences.translation);
          void deps.writeStoredValue(deps.translationStorageKey, preferences.translation);
        }

        if (preferences.colorTheme) {
          deps.applyColorTheme(preferences.colorTheme);
          void deps.writeStoredValue(deps.colorThemeStorageKey, preferences.colorTheme);
        }
      }

      deps.buildBookAliasMap();
      deps.renderWorkspace();
      deps.persistWorkspace();
      deps.updateSaveStatus("Library restored from backup.");
    } catch (error) {
      console.error("[Backup] Restore failed:", error);
      window.alert(`Failed to restore backup: ${error.message}`);
    }
  };

  const clearLocalWorkspace = async () => {
    if (!window.confirm("This will permanently delete all local entries, entry types, and settings. The app will reset to its default state. This cannot be undone.")) {
      return;
    }

    deps.stopCloudPolling();
    deps.clearPendingAutoSync();
    deps.getActiveProvider().disconnect();

    await Promise.all([
      deps.deleteStoredValue(deps.workspaceStorageKey),
      deps.deleteStoredValue(deps.cloudSyncStorageKey),
      deps.deleteStoredValue(deps.themeStorageKey),
      deps.deleteStoredValue(deps.paneOrderStorageKey),
      deps.deleteStoredValue(deps.paneSplitStorageKey),
      deps.deleteStoredValue(deps.translationStorageKey),
      deps.deleteStoredValue(deps.colorThemeStorageKey),
      deps.deleteStoredValue(deps.lastBookChapterStorageKey),
      deps.deleteStoredValue(deps.onboardingStorageKey),
      deps.deleteStoredValue(deps.notesStorageKey),
      deps.deleteStoredValue(deps.customTranslationsStorageKey)
    ]);
    deps.clearThemePreferenceMirrors();

    window.location.reload();
  };

  const clearRemoteWorkspace = async () => {
    const activeProvider = deps.getActiveProvider();

    if (!activeProvider.hasActiveSession()) {
      window.alert("No storage provider is connected. Connect a provider in Sync & Backup settings first.");
      return;
    }

    if (!window.confirm(`This will permanently delete all library data stored on ${activeProvider.displayName}. Your local library will not be affected. This cannot be undone.`)) {
      return;
    }

    try {
      await activeProvider.clearRemote();

      deps.cloudSyncSettings.remoteSettingsFileId = "";
      deps.cloudSyncSettings.remoteNoteFileIds = {};
      deps.cloudSyncSettings.remoteWorkspaceFileId = "";
      deps.cloudSyncSettings.remoteWorkspaceParentId = "";
      deps.cloudSyncSettings.lastSyncAt = null;
      deps.persistCloudSyncSettings();
      deps.renderSettings();
      deps.refreshSaveStatus();
    } catch (error) {
      console.error("[Data] Clear remote failed:", error);
      window.alert(`Failed to clear remote library: ${error.message}`);
    }
  };

  const clearAllData = async () => {
    const activeProvider = deps.getActiveProvider();
    const hasSession = activeProvider.hasActiveSession();
    const remoteLabel = hasSession ? ` and all data stored on ${activeProvider.displayName}` : "";

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

    deps.stopCloudPolling();
    deps.clearPendingAutoSync();
    activeProvider.disconnect();

    await Promise.all([
      deps.deleteStoredValue(deps.workspaceStorageKey),
      deps.deleteStoredValue(deps.cloudSyncStorageKey),
      deps.deleteStoredValue(deps.themeStorageKey),
      deps.deleteStoredValue(deps.paneOrderStorageKey),
      deps.deleteStoredValue(deps.paneSplitStorageKey),
      deps.deleteStoredValue(deps.translationStorageKey),
      deps.deleteStoredValue(deps.colorThemeStorageKey),
      deps.deleteStoredValue(deps.lastBookChapterStorageKey),
      deps.deleteStoredValue(deps.onboardingStorageKey),
      deps.deleteStoredValue(deps.notesStorageKey),
      deps.deleteStoredValue(deps.customTranslationsStorageKey)
    ]);
    deps.clearThemePreferenceMirrors();

    window.location.reload();
  };

  return {
    downloadWorkspaceBackup,
    restoreWorkspaceFromBackup,
    clearLocalWorkspace,
    clearRemoteWorkspace,
    clearAllData
  };
};
