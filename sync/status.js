window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createSyncStatus = (deps) => {
  const {
    cloudSyncSettings,
    getActiveProvider,
    getActiveNote,
    updateSaveStatus
  } = deps;

  const getCloudTargetLabel = () =>
    getActiveProvider().getLocationLabel(cloudSyncSettings.providerSettings[getActiveProvider().id] ?? {});

  const buildProviderStatusLabel = () => {
    const suffix = getCloudTargetLabel();
    return suffix ? `${getActiveProvider().displayName} (${suffix})` : getActiveProvider().displayName;
  };

  const buildCloudStatusText = () => {
    const activeProvider = getActiveProvider();

    if (activeProvider.id === "none") {
      return "No sync & backup provider configured";
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
    const syncLabel = !navigator.onLine && getActiveProvider().hasActiveSession()
      ? "Offline — sync paused"
      : cloudSyncSettings.status.startsWith("Syncing")
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
    ...cloudSyncSettings.providerSettings[getActiveProvider().id],
    activeNoteId: getActiveNote()?.id ?? null,
    syncReason: "",
    remoteSettingsFileId: cloudSyncSettings.remoteSettingsFileId,
    remoteNoteFileIds: structuredClone(cloudSyncSettings.remoteNoteFileIds),
    remoteWorkspaceFileId: cloudSyncSettings.remoteWorkspaceFileId,
    remoteWorkspaceParentId: cloudSyncSettings.remoteWorkspaceParentId
  });

  return {
    getCloudTargetLabel,
    buildProviderStatusLabel,
    buildCloudStatusText,
    buildSaveStatusText,
    refreshSaveStatus,
    getActiveProviderSettings
  };
};
