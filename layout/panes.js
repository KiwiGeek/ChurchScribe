window.ScriptoriaModules = window.ScriptoriaModules || {};

// ─── Pane layout controller ─────────────────────────────────────────────────
// Owns the two-pane split layout: the order (notes-first vs scripture-first),
// the split fraction (the share of width given to the notes pane), and the
// scripture-only mode that hides the editor entirely.  Preferences are
// persisted to IndexedDB via the storage helpers in deps and read back on
// bootstrap so the user's last-used layout sticks across loads.
//
// Settings exposes these as one tri-state control (notes left / scripture left /
// scripture only).  Under the hood paneOrder and scriptureOnly stay separate
// so cloud sync and backups remain compatible with older clients.
//
// Also owns the drag-to-resize behaviour on the pane divider.  Dragging
// updates the split live; mouseup persists the final value and pings the
// sync hooks so cloud-sync notices the preference changed.
window.ScriptoriaModules.createPaneLayout = (deps) => {
  const {
    paneGrid,
    paneDivider,
    documentObject,
    readStoredValue,
    writeStoredValue,
    migrateLegacyPreference,
    paneOrderStorageKey,
    paneSplitStorageKey,
    scriptureOnlyStorageKey,
    markLocalSettingsUpdated,
    scheduleAutoCloudSync
  } = deps;

  // Default to a slightly notes-leaning split (0.6 of the width).  Clamped on
  // every assignment to [0.2, 0.8] so a corrupted or hand-edited storage value
  // can't push the divider off-screen.
  let currentPaneSplit = 0.6;
  let scriptureOnly = false;

  const normalizeScriptureLayoutMode = (mode) => {
    if (mode === "scripture-only" || mode === "scripture-left") {
      return mode;
    }

    return "notes-left";
  };

  const getScriptureLayoutMode = () => {
    if (scriptureOnly) {
      return "scripture-only";
    }

    return paneGrid.dataset.order === "scripture-first" ? "scripture-left" : "notes-left";
  };

  const getPreferredPaneOrder = async () => {
    const savedOrder = await migrateLegacyPreference(paneOrderStorageKey);
    return savedOrder === "scripture-first" ? "scripture-first" : "notes-first";
  };

  const getPreferredSplit = async () => {
    const saved = await readStoredValue(paneSplitStorageKey);
    return typeof saved === "number" && saved >= 0.2 && saved <= 0.8 ? saved : 0.6;
  };

  const getPreferredScriptureOnly = async () => {
    const saved = await readStoredValue(scriptureOnlyStorageKey);
    return saved === true;
  };

  // Keep the Settings tri-state select in sync when layout is applied from
  // bootstrap, sync, or backup.  Best-effort: the select may not exist yet.
  const syncScriptureLayoutControl = (mode = getScriptureLayoutMode()) => {
    const select = documentObject.querySelector("#ui-scripture-layout-select");

    if (select) {
      select.value = normalizeScriptureLayoutMode(mode);
    }
  };

  // Reshape the grid columns to put `currentPaneSplit` worth of width on the
  // notes side and the rest on the scripture side, swapping which side gets
  // which fraction depending on pane order.  The 20px middle column is the
  // divider's gutter.  Both content columns use minmax(0, …) so neither has a
  // hard pixel minimum — they shrink gracefully at any window width rather than
  // overflowing the container and creating a blank strip on the right.  The
  // split is clamped to [0.2, 0.8] so a drag can never push either panel to
  // effectively zero by accident.
  //
  // When scripture-only mode is active the grid is a single full-width column;
  // we still update `currentPaneSplit` so the prior split restores cleanly when
  // the editor is shown again.
  const applySplit = (fraction) => {
    currentPaneSplit = Math.max(0.2, Math.min(0.8, fraction));

    if (scriptureOnly) {
      paneGrid.style.gridTemplateColumns = "minmax(0, 1fr)";
      return;
    }

    const isScriptureFirst = paneGrid.dataset.order === "scripture-first";

    if (isScriptureFirst) {
      paneGrid.style.gridTemplateColumns =
        `minmax(0, ${1 - currentPaneSplit}fr) 20px minmax(0, ${currentPaneSplit}fr)`;
    } else {
      paneGrid.style.gridTemplateColumns =
        `minmax(0, ${currentPaneSplit}fr) 20px minmax(0, ${1 - currentPaneSplit}fr)`;
    }
  };

  const applyPaneOrder = (order) => {
    paneGrid.dataset.order = order;
    applySplit(currentPaneSplit);
    syncScriptureLayoutControl();
  };

  const applyScriptureOnly = (enabled) => {
    scriptureOnly = Boolean(enabled);
    paneGrid.classList.toggle("is-scripture-only", scriptureOnly);

    const notePanel = paneGrid.querySelector(".note-panel");

    if (notePanel) {
      notePanel.setAttribute("aria-hidden", String(scriptureOnly));

      // Don't leave keyboard focus inside a display:none notes pane.
      if (scriptureOnly) {
        const active = documentObject.activeElement;
        if (active && notePanel.contains(active)) {
          const scripturePanel = paneGrid.querySelector(".scripture-panel");
          const focusTarget = scripturePanel?.querySelector(
            "select, button:not([hidden]), [href], input:not([type='hidden']), textarea, [tabindex]:not([tabindex='-1'])"
          );
          if (focusTarget && typeof focusTarget.focus === "function") {
            focusTarget.focus({ preventScroll: true });
          } else if (typeof active.blur === "function") {
            active.blur();
          }
        }
      }
    }

    if (paneDivider) {
      paneDivider.setAttribute("aria-hidden", String(scriptureOnly));
    }

    applySplit(currentPaneSplit);
    syncScriptureLayoutControl();
  };

  const applyScriptureLayoutMode = (mode) => {
    const normalized = normalizeScriptureLayoutMode(mode);

    if (normalized === "scripture-only") {
      applyScriptureOnly(true);
      return;
    }

    applyScriptureOnly(false);
    applyPaneOrder(normalized === "scripture-left" ? "scripture-first" : "notes-first");
  };

  const setScriptureLayoutMode = (mode) => {
    const normalized = normalizeScriptureLayoutMode(mode);

    if (normalized === "scripture-only") {
      void writeStoredValue(scriptureOnlyStorageKey, true);
      applyScriptureOnly(true);
    } else {
      const order = normalized === "scripture-left" ? "scripture-first" : "notes-first";
      void writeStoredValue(scriptureOnlyStorageKey, false);
      void writeStoredValue(paneOrderStorageKey, order);
      applyScriptureOnly(false);
      applyPaneOrder(order);
    }

    markLocalSettingsUpdated();
    scheduleAutoCloudSync();
  };

  // Drag-to-resize on the pane divider.  We use Pointer Events rather than
  // separate mouse + touch handlers so a single code path covers mouse, touch,
  // and stylus.  setPointerCapture redirects subsequent move/up events to the
  // divider element regardless of where the pointer drifts, so the drag keeps
  // working past the edges of the divider strip.  CSS sets
  // `touch-action: none` on the divider so the browser doesn't try to scroll
  // or pinch when the user touches it on an iPad.
  //
  // We persist + sync only on pointerup (not pointermove) so a single drag
  // session counts as one preference change, not dozens.
  if (paneDivider) {
    paneDivider.addEventListener("pointerdown", (startEvent) => {
      // Scripture-only mode hides the editor and divider; ignore any stray events.
      if (scriptureOnly) {
        return;
      }

      // Mouse: only start a drag on the primary (left) button.  Touch and
      // pen events report button === 0 too, so this also doesn't filter
      // those out.
      if (startEvent.pointerType === "mouse" && startEvent.button !== 0) {
        return;
      }

      startEvent.preventDefault();
      documentObject.body.classList.add("is-pane-dragging");

      // Capture the pointer so the divider keeps receiving move/up events
      // even when the pointer wanders off the divider strip during the drag.
      try {
        paneDivider.setPointerCapture(startEvent.pointerId);
      } catch {
        // Older browsers without setPointerCapture — drag still works,
        // just less robustly when the cursor moves off the divider.
      }

      const gridRect = paneGrid.getBoundingClientRect();
      const availableWidth = gridRect.width - 20;

      const onPointerMove = (moveEvent) => {
        const rawFraction = (moveEvent.clientX - gridRect.left) / availableWidth;
        const isScriptureFirst = paneGrid.dataset.order === "scripture-first";
        const noteFraction = isScriptureFirst ? 1 - rawFraction : rawFraction;
        applySplit(noteFraction);
      };

      const onPointerEnd = () => {
        paneDivider.removeEventListener("pointermove", onPointerMove);
        paneDivider.removeEventListener("pointerup", onPointerEnd);
        // pointercancel fires when the OS or browser interrupts the gesture
        // (e.g. an incoming notification on iPad, or the page entering bfcache);
        // treat it the same as a normal release so we don't leave the body
        // stuck in the is-pane-dragging state.
        paneDivider.removeEventListener("pointercancel", onPointerEnd);
        documentObject.body.classList.remove("is-pane-dragging");
        void writeStoredValue(paneSplitStorageKey, currentPaneSplit);
        markLocalSettingsUpdated();
        scheduleAutoCloudSync();
      };

      paneDivider.addEventListener("pointermove", onPointerMove);
      paneDivider.addEventListener("pointerup", onPointerEnd);
      paneDivider.addEventListener("pointercancel", onPointerEnd);
    });
  }

  return {
    applySplit,
    applyPaneOrder,
    applyScriptureOnly,
    applyScriptureLayoutMode,
    setScriptureLayoutMode,
    getScriptureLayoutMode,
    syncScriptureLayoutControl,
    getPreferredPaneOrder,
    getPreferredSplit,
    getPreferredScriptureOnly,
    getCurrentPaneSplit: () => currentPaneSplit,
    isScriptureOnly: () => scriptureOnly
  };
};
