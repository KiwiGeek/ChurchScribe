window.ScriptoriaModules = window.ScriptoriaModules || {};

// Preferred mobile/desktop shell. Written when the user explicitly switches
// views so later visits reuse that choice instead of re-running auto-detect.
(function () {
  const VIEW_PREF_KEY = "service-notes-view-preference";

  const readPreferredView = () => {
    try {
      const value = localStorage.getItem(VIEW_PREF_KEY);
      return value === "mobile" || value === "desktop" ? value : null;
    } catch {
      return null;
    }
  };

  const setPreferredView = (view) => {
    if (view !== "mobile" && view !== "desktop") {
      return;
    }

    try {
      localStorage.setItem(VIEW_PREF_KEY, view);
    } catch {
      // Private mode / blocked storage — navigation still works for this load.
    }
  };

  const clearPreferredView = () => {
    try {
      localStorage.removeItem(VIEW_PREF_KEY);
    } catch {
      // Ignore.
    }
  };

  const navigateToView = (view) => {
    setPreferredView(view);

    if (view === "mobile") {
      window.location.assign("mobile.html");
      return;
    }

    window.location.assign("index.html");
  };

  window.ScriptoriaModules.VIEW_PREF_KEY = VIEW_PREF_KEY;
  window.ScriptoriaModules.readPreferredView = readPreferredView;
  window.ScriptoriaModules.setPreferredView = setPreferredView;
  window.ScriptoriaModules.clearPreferredView = clearPreferredView;
  window.ScriptoriaModules.navigateToView = navigateToView;
})();
