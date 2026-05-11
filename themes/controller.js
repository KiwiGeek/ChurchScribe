window.ScriptoriaModules = window.ScriptoriaModules || {};

// ─── Theme controller ───────────────────────────────────────────────────────
// Owns the user's display-theme preferences: the light/dark mode (`system`,
// `light`, or `dark`) and the named colour theme (e.g. "default", "cyberpunk").
// Both pieces of state mutate `data-theme` and `data-color-theme` attributes
// on the document root, which the stylesheet keys off of.
//
// Persistence has two layers:
//   • IndexedDB (canonical, syncable) — read/written through the storage helpers
//     in deps.  These survive across devices via cloud sync.
//   • localStorage mirror (fast, synchronous) — written eagerly so the
//     bootstrap script in index.html can apply the theme before first paint
//     without waiting for IndexedDB.  This is what eliminates the "flash of
//     wrong theme" on load.
//
// The module also attaches a listener to (prefers-color-scheme: dark) so a
// user with mode="system" gets re-rendered when their OS theme flips.
window.ScriptoriaModules.createThemeController = (deps) => {
  const {
    documentObject,
    windowObject,
    colorThemes,
    readStoredValue,
    writeStoredValue,
    migrateLegacyPreference,
    readMirroredPreference,
    writeMirroredPreference,
    themeStorageKey,
    themeMirrorStorageKey,
    colorThemeStorageKey,
    colorThemeMirrorStorageKey,
    markLocalSettingsUpdated,
    scheduleAutoCloudSync,
    isSettingsOpen,
    renderSettings
  } = deps;

  let currentThemeMode = "system";
  let currentColorThemeId = "default";

  const systemThemeMediaQuery = windowObject.matchMedia("(prefers-color-scheme: dark)");

  const normalizeThemeMode = (value) =>
    ["light", "dark", "system"].includes(value) ? value : "system";

  const getSystemTheme = () => (systemThemeMediaQuery.matches ? "dark" : "light");

  // Resolve the mode + colour theme into one of "light" / "dark" — this is the
  // value that lands on documentElement.dataset.theme.  A colour theme that
  // declares supports="light" or supports="dark" forces that mode regardless
  // of the user's mode preference, mirroring the boot-script's coercion rule.
  const getResolvedThemeForMode = (mode = currentThemeMode, themeId = currentColorThemeId) => {
    const normalizedMode = normalizeThemeMode(mode);
    const requestedTheme = normalizedMode === "system" ? getSystemTheme() : normalizedMode;
    const themeDef = colorThemes.find((theme) => theme.id === themeId);

    if (themeDef?.supports === "light") {
      return "light";
    }

    if (themeDef?.supports === "dark") {
      return "dark";
    }

    return requestedTheme;
  };

  const syncThemeModeControl = (mode = currentThemeMode) => {
    const select = documentObject.querySelector("#ui-theme-mode-select");

    if (select) {
      select.value = normalizeThemeMode(mode);
    }
  };

  const syncThemePreferenceMirrors = () => {
    writeMirroredPreference(themeMirrorStorageKey, normalizeThemeMode(currentThemeMode));
    writeMirroredPreference(colorThemeMirrorStorageKey, currentColorThemeId || "default");
  };

  const clearThemePreferenceMirrors = () => {
    writeMirroredPreference(themeMirrorStorageKey, null);
    writeMirroredPreference(colorThemeMirrorStorageKey, null);
  };

  const applyThemeMode = (mode, { persist = false, markChange = false, rerender = true } = {}) => {
    currentThemeMode = normalizeThemeMode(mode);
    documentObject.documentElement.dataset.theme = getResolvedThemeForMode(currentThemeMode);
    syncThemeModeControl(currentThemeMode);
    syncThemePreferenceMirrors();

    if (persist) {
      void writeStoredValue(themeStorageKey, currentThemeMode);
    }

    if (markChange) {
      markLocalSettingsUpdated();
      scheduleAutoCloudSync();
    }

    if (rerender && isSettingsOpen()) {
      renderSettings();
    }
  };

  const applyColorTheme = (themeId) => {
    currentColorThemeId = themeId;

    if (themeId === "default") {
      documentObject.documentElement.removeAttribute("data-color-theme");
    } else {
      documentObject.documentElement.dataset.colorTheme = themeId;
    }

    const themeDef = colorThemes.find((t) => t.id === themeId);

    if (themeDef) {
      // A colour theme that supports only one mode forces that mode when the
      // user's current mode would clash.  We pass rerender:false because the
      // caller (this function) handles its own re-render after this branch.
      if (themeDef.supports === "light" && currentThemeMode === "dark") {
        applyThemeMode("light", { persist: true, rerender: false });
      } else if (themeDef.supports === "dark" && currentThemeMode === "light") {
        applyThemeMode("dark", { persist: true, rerender: false });
      } else {
        documentObject.documentElement.dataset.theme =
          getResolvedThemeForMode(currentThemeMode, themeId);
      }
    }

    if (isSettingsOpen()) {
      renderSettings();
    }

    syncThemePreferenceMirrors();
  };

  const getPreferredTheme = async () => {
    // migrateLegacyPreference picks up legacy localStorage values and copies
    // them into IndexedDB on first read — preserves prefs from pre-IDB builds.
    const savedTheme = await migrateLegacyPreference(themeStorageKey);
    return normalizeThemeMode(savedTheme ?? readMirroredPreference(themeMirrorStorageKey));
  };

  const getPreferredColorTheme = async () => {
    const saved = await readStoredValue(colorThemeStorageKey);
    const mirrored = readMirroredPreference(colorThemeMirrorStorageKey);
    const validIds = colorThemes.map((t) => t.id);

    if (validIds.includes(saved)) {
      return saved;
    }

    return validIds.includes(mirrored) ? mirrored : "default";
  };

  // OS-level theme change: only re-applies if the user's mode preference is
  // "system".  Manual "light" or "dark" choices stay where they are.
  systemThemeMediaQuery.addEventListener("change", () => {
    if (currentThemeMode === "system") {
      applyThemeMode("system", { rerender: true });
    }
  });

  return {
    // Apply
    applyThemeMode,
    applyColorTheme,
    // State accessors
    getCurrentThemeMode: () => currentThemeMode,
    getCurrentColorThemeId: () => currentColorThemeId,
    // Resolution
    getResolvedThemeForMode,
    syncThemeModeControl,
    // Preferences
    getPreferredTheme,
    getPreferredColorTheme,
    // Mirror helpers (used by the backup/restore / clear-data flows so they
    // can wipe localStorage in lockstep with IndexedDB).
    syncThemePreferenceMirrors,
    clearThemePreferenceMirrors,
    // Re-exported for sync/payloads + settings/backup-restore which take it
    // as a dep — they're consuming the canonical normalisation so all callers
    // agree on what "system" / fallback means.
    normalizeThemeMode
  };
};
