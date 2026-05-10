/**
 * No-op storage provider for Scriptoria.
 *
 * Exposes window.NoOpProvider — a defensive fallback used internally as the
 * value of activeProvider before the user has chosen a real provider, and as
 * the safety net when a configured-but-now-unregistered provider is loaded
 * from disk (e.g. user disabled the gdrive script for some reason).  Its
 * methods either resolve as no-ops or reject with a clear "no provider
 * configured" error, so any code path that defensively calls activeProvider.X
 * gets a sensible response instead of a TypeError.
 *
 * NoOpProvider is intentionally NOT registered in the providerRegistry — the
 * user-facing "None" option is window.NullProvider (storage/nullprovider.js),
 * which is similar but shows up in the provider picker and reports
 * isAvailable() === true so it's a valid user choice.  NoOpProvider's
 * isAvailable() returns false because it represents the absence of any
 * provider, not a real one.
 *
 * See gdrive.js for the full StorageProvider interface documentation.
 */
(() => {
  "use strict";

  const noProviderError = () => new Error("No storage provider configured.");

  window.NoOpProvider = {
    id: "none",
    displayName: "Storage",
    isAvailable: () => false,
    hasActiveSession: () => false,
    ensureTokenClient: () => {},
    waitForReady: () => {},
    connect: () => Promise.reject(noProviderError()),
    disconnect: () => {},
    attemptSilentReconnect: () => Promise.reject(noProviderError()),
    getSettingsFields: () => [],
    getSettingsValues: () => ({}),
    applySettingChange: () => ({}),
    getLocationLabel: () => "",
    upload: () => Promise.reject(noProviderError()),
    download: () => Promise.reject(noProviderError()),
    clearRemote: () => Promise.resolve()
  };
})();
