window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createCloudSync = (deps) => {
  const {
    readStoredValue,
    writeStoredValue,
    cloudSyncStorageKey,
    cloudSyncSettings,
    normalizeCloudSyncSettings,
    providerRegistry,
    noOpProvider,
    getActiveProvider,
    setActiveProvider,
    workspace,
    renderSettings,
    refreshSaveStatus,
    buildProviderStatusLabel,
    getActiveProviderSettings,
    buildCloudSyncPayload,
    applyCloudPayload,
    syncStatusDialog,
    conflictDialogTitle,
    conflictDialogDescription,
    conflictLocalTime,
    conflictRemoteTime,
    conflictKeepLocalButton,
    conflictUseCloudButton,
    firstSyncKeepLocalButton,
    firstSyncUseCloudButton,
    firstSyncCancelButton
  } = deps;

  let pendingAutoSyncTimer = null;
  let syncInFlightPromise = null;
  let isPullInFlight = false;
  let cloudPollTimer = null;
  let cloudSyncQueuedWhileOffline = false;

  const persistCloudSyncSettings = () => {
    void writeStoredValue(cloudSyncStorageKey, structuredClone(cloudSyncSettings));
  };

  const markLocalSettingsUpdated = () => {
    cloudSyncSettings.localSettingsUpdatedAt = new Date().toISOString();
    persistCloudSyncSettings();
  };

  const resetTransientCloudSessionState = () => {
    if (getActiveProvider().hasActiveSession()) {
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

    setActiveProvider(providerRegistry[cloudSyncSettings.provider] ?? noOpProvider);

    const providerId = getActiveProvider().id;
    const defaults = getActiveProvider().getSettingsValues();

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

  const normalizeNoteForComparison = (note) => ({
    id: note.id,
    typeId: note.typeId,
    content: note.content,
    metadata: note.metadata,
    updatedAt: note.updatedAt
  });

  const normalizeWorkspaceForComparison = () => ({
    noteTypes: structuredClone(workspace.noteTypes),
    activeNoteId: workspace.activeNoteId,
    selectedNewNoteTypeId: workspace.selectedNewNoteTypeId,
    customBookAliases: structuredClone(workspace.customBookAliases)
  });

  const sortById = (items) =>
    [...items].sort((left, right) => String(left.id).localeCompare(String(right.id)));

  const remotePayloadDiffersFromLocal = (remotePayload) => {
    const remoteWorkspaceComparable = JSON.stringify({
      noteTypes: structuredClone(remotePayload.workspace?.noteTypes ?? []),
      activeNoteId: remotePayload.workspace?.activeNoteId ?? null,
      selectedNewNoteTypeId: remotePayload.workspace?.selectedNewNoteTypeId ?? null,
      customBookAliases: structuredClone(remotePayload.workspace?.customBookAliases ?? {})
    });
    const localWorkspaceComparable = JSON.stringify(normalizeWorkspaceForComparison());

    const remoteNotes = remotePayload.notes ?? [];
    const localComparableNotes = remotePayload.notesArePartial
      ? workspace.notes.filter((note) => remoteNotes.some((remoteNote) => remoteNote.id === note.id))
      : workspace.notes;
    const remoteNotesComparable = JSON.stringify(sortById(remoteNotes.map(normalizeNoteForComparison)));
    const localNotesComparable = JSON.stringify(sortById(localComparableNotes.map(normalizeNoteForComparison)));

    return remoteWorkspaceComparable !== localWorkspaceComparable ||
      remoteNotesComparable !== localNotesComparable;
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

    const isFirstSync = mode === "first-sync";

    if (isFirstSync) {
      conflictDialogTitle.textContent = "Existing Cloud Data Found";
      conflictDialogDescription.textContent = "This provider already contains a workspace. Choose how you want to proceed.";
      syncStatusDialog.classList.add("is-first-sync");
    } else {
      conflictDialogTitle.textContent = "Sync Conflict Detected";
      conflictDialogDescription.textContent = "Your local data and the cloud copy have both been changed since the last sync. Choose which version to keep.";
      syncStatusDialog.classList.remove("is-first-sync");
    }

    conflictLocalTime.textContent = localTime;
    conflictRemoteTime.textContent = remoteTime;

    const handleKeepLocal = () => {
      cleanup();
      resolve("local");
    };

    const handleUseCloud = () => {
      cleanup();
      resolve("remote");
    };

    const handleCancel = (event) => {
      if (isFirstSync) {
        cleanup();
        resolve("cancel");
      } else {
        event.preventDefault();
      }
    };

    const handleFirstSyncCancel = () => {
      cleanup();
      resolve("cancel");
    };

    const cleanup = () => {
      conflictKeepLocalButton.removeEventListener("click", handleKeepLocal);
      conflictUseCloudButton.removeEventListener("click", handleUseCloud);
      firstSyncKeepLocalButton.removeEventListener("click", handleKeepLocal);
      firstSyncUseCloudButton.removeEventListener("click", handleUseCloud);
      firstSyncCancelButton.removeEventListener("click", handleFirstSyncCancel);
      syncStatusDialog.removeEventListener("cancel", handleCancel);
      syncStatusDialog.close();
    };

    if (isFirstSync) {
      firstSyncKeepLocalButton.addEventListener("click", handleKeepLocal);
      firstSyncUseCloudButton.addEventListener("click", handleUseCloud);
      firstSyncCancelButton.addEventListener("click", handleFirstSyncCancel);
    } else {
      conflictKeepLocalButton.addEventListener("click", handleKeepLocal);
      conflictUseCloudButton.addEventListener("click", handleUseCloud);
    }
    syncStatusDialog.addEventListener("cancel", handleCancel);
    syncStatusDialog.showModal();
  });

  const stopCloudPolling = () => {
    if (cloudPollTimer) {
      window.clearInterval(cloudPollTimer);
      cloudPollTimer = null;
      console.log("[CloudSync] Background polling stopped.");
    }
  };

  const pullFromCloud = async () => {
    if (!getActiveProvider().hasActiveSession() || !navigator.onLine || syncInFlightPromise || isPullInFlight) {
      return false;
    }

    isPullInFlight = true;

    try {
      const result = await getActiveProvider().download(getActiveProviderSettings());

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

      if (result.providerSettingsPatch && typeof result.providerSettingsPatch === "object") {
        cloudSyncSettings.providerSettings[getActiveProvider().id] = {
          ...(cloudSyncSettings.providerSettings[getActiveProvider().id] ?? {}),
          ...result.providerSettingsPatch
        };
        persistCloudSyncSettings();
      }

      const remotePayload = result.data;

      if (!remotePayload) {
        cloudSyncSettings.status = `OneNote is empty. Starting initial export to ${buildProviderStatusLabel()}...`;
        persistCloudSyncSettings();
        renderSettings();
        refreshSaveStatus();
        console.log("[CloudSync] Pull found no valid remote payload; scheduling initial upload.");
        void syncWorkspaceToCloud({ reason: "initial" });
        return true;
      }

      const remoteUpdatedAt = remotePayload.updatedAt ? new Date(remotePayload.updatedAt) : null;
      const lastSyncAt = cloudSyncSettings.lastSyncAt ? new Date(cloudSyncSettings.lastSyncAt) : null;
      console.log("[CloudSync] Pull received remote payload", {
        remoteUpdatedAt: remoteUpdatedAt?.toISOString() ?? null,
        lastSyncAt: lastSyncAt?.toISOString() ?? null,
        remoteNoteCount: Array.isArray(remotePayload.notes) ? remotePayload.notes.length : null
      });

      if (lastSyncAt && remoteUpdatedAt && remoteUpdatedAt <= lastSyncAt) {
        // Remote has not changed since our last successful sync. Any pending
        // local edits are pushed by the follow-up idle sync — this is never a
        // conflict, regardless of whether local currently differs from remote.
        return true;
      }

      const localHasChanges = hasLocalChangesSinceLastSync();

      let resolution;

      if (!lastSyncAt) {
        resolution = await showSyncConflictDialog(remotePayload, "first-sync");
      } else if (!localHasChanges) {
        resolution = "remote";
      } else if (!remotePayloadDiffersFromLocal(remotePayload)) {
        // Remote timestamp is newer but its content matches local (e.g. the
        // provider bumped its modified time after our own upload). Nothing to
        // reconcile — keep local and let the push refresh lastSyncAt.
        console.log("[CloudSync] Remote newer by timestamp but content matches local; resolving as local without prompting the user.");
        resolution = "local";
      } else {
        resolution = await showSyncConflictDialog(remotePayload);
      }

      if (resolution === "remote") {
        console.log("[CloudSync] Applying remote payload after conflict resolution", {
          remoteNoteCount: Array.isArray(remotePayload.notes) ? remotePayload.notes.length : null,
          remoteUpdatedAt: remotePayload.updatedAt ?? null
        });
        await applyCloudPayload(remotePayload);

        if (remotePayload.updatedAt) {
          cloudSyncSettings.lastSyncAt = remotePayload.updatedAt;
          cloudSyncSettings.localSettingsUpdatedAt = remotePayload.updatedAt;
        } else {
          cloudSyncSettings.localSettingsUpdatedAt = new Date().toISOString();
        }

        cloudSyncSettings.lastError = "";
        persistCloudSyncSettings();
        renderSettings();
        refreshSaveStatus();
        return true;
      } else if (resolution === "cancel") {
        disconnectCloud();
        return false;
      } else {
        void syncWorkspaceToCloud({ reason: "conflict-keep-local" });
        return true;
      }
    } catch (error) {
      console.error("[CloudSync] Pull failed:", error);
      return false;
    } finally {
      isPullInFlight = false;
    }
  };

  const startCloudPolling = () => {
    stopCloudPolling();

    if (!getActiveProvider().hasActiveSession()) {
      return;
    }

    cloudPollTimer = window.setInterval(() => {
      void pullFromCloud();
    }, cloudSyncSettings.pollIntervalSeconds * 1000);
  };

  const syncWorkspaceToCloud = async ({ reason = "manual" } = {}) => {
    if (!getActiveProvider().hasActiveSession()) {
      cloudSyncSettings.status = "Connect to cloud storage first.";
      persistCloudSyncSettings();
      renderSettings();
      refreshSaveStatus();
      return false;
    }

    if (!navigator.onLine) {
      cloudSyncQueuedWhileOffline = true;
      cloudSyncSettings.status = "Offline — sync paused";
      persistCloudSyncSettings();
      renderSettings();
      refreshSaveStatus();
      return false;
    }

    if (syncInFlightPromise) {
      return syncInFlightPromise;
    }

    syncInFlightPromise = (async () => {
      try {
        cloudSyncSettings.status = reason === "idle"
          ? `Syncing changes to ${buildProviderStatusLabel()}...`
          : reason === "initial"
            ? `Performing initial OneNote export to ${buildProviderStatusLabel()}...`
          : `Syncing to ${buildProviderStatusLabel()}...`;
        cloudSyncSettings.lastError = "";
        persistCloudSyncSettings();
        renderSettings();
        refreshSaveStatus();

        const result = await getActiveProvider().upload(buildCloudSyncPayload(), {
          ...getActiveProviderSettings(),
          syncReason: reason
        });

        cloudSyncSettings.remoteSettingsFileId = result.remoteSettingsFileId;
        cloudSyncSettings.remoteNoteFileIds = result.remoteNoteFileIds ?? {};
        cloudSyncSettings.remoteWorkspaceFileId = result.remoteWorkspaceFileId;
        cloudSyncSettings.remoteWorkspaceParentId = result.remoteWorkspaceParentId;
        if (result.providerSettingsPatch && typeof result.providerSettingsPatch === "object") {
          cloudSyncSettings.providerSettings[getActiveProvider().id] = {
            ...(cloudSyncSettings.providerSettings[getActiveProvider().id] ?? {}),
            ...result.providerSettingsPatch
          };
        }
        cloudSyncSettings.lastSyncAt = new Date().toISOString();
        cloudSyncSettings.localSettingsUpdatedAt = cloudSyncSettings.lastSyncAt;
        cloudSyncSettings.status = `Connected to ${buildProviderStatusLabel()}`;
        cloudSyncSettings.lastError = "";
        persistCloudSyncSettings();
        renderSettings();
        refreshSaveStatus();
        return true;
      } catch (error) {
        const errorMessage = error.message || "Unknown cloud sync error.";
        cloudSyncSettings.status = `${getActiveProvider().displayName} sync failed: ${errorMessage}`;
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
    if (!getActiveProvider().hasActiveSession()) {
      return;
    }

    if (!navigator.onLine) {
      cloudSyncQueuedWhileOffline = true;
      return;
    }

    if (pendingAutoSyncTimer) {
      window.clearTimeout(pendingAutoSyncTimer);
    }

    pendingAutoSyncTimer = window.setTimeout(async () => {
      pendingAutoSyncTimer = null;

      if (!navigator.onLine) {
        cloudSyncQueuedWhileOffline = true;
        return;
      }

      await pullFromCloud();
      await syncWorkspaceToCloud({ reason: "idle" });
    }, deps.autoCloudSyncDelayMs);
  };

  const connectCloud = async () => {
    if (!getActiveProvider().isAvailable()) {
      cloudSyncSettings.status = "Cloud provider is still loading.";
      persistCloudSyncSettings();
      renderSettings();
      return;
    }

    getActiveProvider().ensureTokenClient();
    cloudSyncSettings.status = "Waiting for sign-in...";
    persistCloudSyncSettings();
    renderSettings();

    try {
      // Provider settings are passed so providers with configurable storage
      // locations (e.g. Drive/OneDrive "main storage" mode) request the right
      // OAuth scopes for the configured location.
      const { email } = await getActiveProvider().connect(getActiveProviderSettings());
      cloudSyncSettings.connectedEmail = email;
      cloudSyncSettings.status = `Connected to ${buildProviderStatusLabel()}`;
      cloudSyncSettings.lastError = "";
      persistCloudSyncSettings();
      renderSettings();
      startCloudPolling();
      void pullFromCloud();
    } catch (error) {
      cloudSyncSettings.status = `Sign-in failed: ${error.message}`;
      persistCloudSyncSettings();
      renderSettings();
      throw error;
    }
  };

  const clearPendingAutoSync = () => {
    if (pendingAutoSyncTimer) {
      window.clearTimeout(pendingAutoSyncTimer);
      pendingAutoSyncTimer = null;
    }
  };

  const disconnectCloud = () => {
    getActiveProvider().disconnect();
    stopCloudPolling();
    clearPendingAutoSync();
    resetTransientCloudSessionState();
    persistCloudSyncSettings();
    renderSettings();
  };

  const reconnectCloud = async () => {
    if (getActiveProvider().id === "none" || getActiveProvider().hasActiveSession()) {
      return;
    }

    cloudSyncSettings.status = "Verifying connection...";
    cloudSyncSettings.lastError = "";
    persistCloudSyncSettings();

    try {
      getActiveProvider().ensureTokenClient();
      const { email } = await getActiveProvider().attemptSilentReconnect(getActiveProviderSettings());
      cloudSyncSettings.connectedEmail = email;
      cloudSyncSettings.status = `Connected to ${buildProviderStatusLabel()}`;
      cloudSyncSettings.lastError = "";
      persistCloudSyncSettings();
      renderSettings();
      startCloudPolling();
    } catch {
      resetTransientCloudSessionState();
      persistCloudSyncSettings();
      if (deps.isSettingsOpen()) {
        renderSettings();
      }
    }
  };

  const consumeQueuedCloudSync = () => {
    const queued = cloudSyncQueuedWhileOffline;
    cloudSyncQueuedWhileOffline = false;
    return queued;
  };

  return {
    persistCloudSyncSettings,
    markLocalSettingsUpdated,
    resetTransientCloudSessionState,
    restoreCloudSyncSettings,
    pullFromCloud,
    stopCloudPolling,
    startCloudPolling,
    syncWorkspaceToCloud,
    scheduleAutoCloudSync,
    connectCloud,
    disconnectCloud,
    reconnectCloud,
    clearPendingAutoSync,
    consumeQueuedCloudSync
  };
};
