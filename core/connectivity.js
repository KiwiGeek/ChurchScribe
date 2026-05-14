window.ScriptoriaModules = window.ScriptoriaModules || {};

// ─── Online/offline awareness ────────────────────────────────────────────────
// Wires the window-level "online" and "offline" events into the parts of the
// UI that need to react: the save-status indicator, the translation picker
// (which greys out un-downloaded translations when offline), and the
// "Download all" button in the Translations settings panel.  When the user
// comes back online, any queued cloud sync gets replayed.
//
// Cloud sync is the only thing that genuinely needs network connectivity —
// notes, themes, cached translations, and locally-stored embeds keep
// working out of the SW cache regardless.  So this module's job is mostly
// to keep the UI's mental model of "are we connected?" in sync with reality.
window.ScriptoriaModules.createConnectivityWatcher = (deps) => {
  const {
    windowObject,
    refreshSaveStatus,
    populateTranslationSelect,
    isSettingsOpen,
    renderSettings,
    consumeQueuedCloudSync,
    hasActiveCloudSession,
    pullFromCloud,
    syncWorkspaceToCloud
  } = deps;

  const refreshNetworkSensitiveUi = () => {
    refreshSaveStatus();
    // Refresh the translation picker so any not-yet-downloaded translations
    // get greyed out (offline) or re-enabled (online).
    populateTranslationSelect();
    if (isSettingsOpen()) {
      renderSettings();
    }
  };

  const handleOnline = () => {
    refreshNetworkSensitiveUi();

    // Replay any sync work that was deferred while offline.  consumeQueuedCloudSync
    // returns true exactly when there's queued work — checking lets us skip
    // the "Connectivity restored" log spam on connectivity blips that didn't
    // actually leave anything behind.
    if (consumeQueuedCloudSync() && hasActiveCloudSession()) {
      console.log("[CloudSync] Connectivity restored — replaying queued sync.");
      // Match the auto-sync behaviour: pull first to surface any remote
      // changes, then upload.  Errors are already handled inside each call.
      void (async () => {
        await pullFromCloud();
        await syncWorkspaceToCloud({ reason: "online-resume" });
      })();
    }
  };

  const handleOffline = () => {
    refreshNetworkSensitiveUi();
  };

  const attach = () => {
    windowObject.addEventListener("online", handleOnline);
    windowObject.addEventListener("offline", handleOffline);
  };

  return { attach };
};
