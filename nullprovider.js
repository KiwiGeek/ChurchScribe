/**
 * Null auxiliary storage provider for ChurchScribe.
 *
 * Exposes window.NullProvider, which implements the StorageProvider interface.
 * This provider performs no operations and is the default selection for users
 * who do not want auxiliary cloud or local-drive storage. Selecting it prevents
 * any sign-in prompts from appearing on startup.
 *
 * See gdrive.js for the full StorageProvider interface documentation.
 */
(() => {
  "use strict";

  window.NullProvider = {
    id: "none",
    displayName: "None",
    isAvailable: () => true,
    hasActiveSession: () => false,
    ensureTokenClient: () => {},
    waitForReady: (onReady) => { onReady(); },
    connect: () => Promise.reject(new Error("No auxiliary provider configured.")),
    disconnect: () => {},
    attemptSilentReconnect: () => Promise.reject(new Error("No auxiliary provider configured.")),
    getSettingsFields: () => [],
    getSettingsValues: () => ({}),
    applySettingChange: () => ({}),
    getLocationLabel: () => "",
    upload: () => Promise.reject(new Error("No auxiliary provider configured.")),
    download: () => Promise.reject(new Error("No auxiliary provider configured.")),
    clearRemote: () => Promise.resolve()
  };
})();
