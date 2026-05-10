window.ScriptoriaModules = window.ScriptoriaModules || {};

// ─── Pane layout controller ─────────────────────────────────────────────────
// Owns the two-pane split layout: the order (notes-first vs scripture-first)
// and the split fraction (the share of width given to the notes pane).  Both
// preferences are persisted to IndexedDB via the storage helpers in deps and
// read back on bootstrap so the user's last-used layout sticks across loads.
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
    markLocalSettingsUpdated,
    scheduleAutoCloudSync
  } = deps;

  // Default to a slightly notes-leaning split (0.6 of the width).  Clamped on
  // every assignment to [0.2, 0.8] so a corrupted or hand-edited storage value
  // can't push the divider off-screen.
  let currentPaneSplit = 0.6;

  const getPreferredPaneOrder = async () => {
    const savedOrder = await migrateLegacyPreference(paneOrderStorageKey);
    return savedOrder === "scripture-first" ? "scripture-first" : "notes-first";
  };

  const getPreferredSplit = async () => {
    const saved = await readStoredValue(paneSplitStorageKey);
    return typeof saved === "number" && saved >= 0.2 && saved <= 0.8 ? saved : 0.6;
  };

  // Reflect the current pane order on the Settings UI's "Scripture on left"
  // toggle so the dialog opens in sync with reality.  Best-effort: the toggle
  // may not exist if the dialog hasn't been rendered yet.
  const syncPaneOrderToggle = (order) => {
    const scriptureFirst = order === "scripture-first";
    const btn = documentObject.querySelector("#ui-scripture-left-toggle");

    if (btn) {
      btn.setAttribute("aria-pressed", String(scriptureFirst));
      const state = btn.querySelector(".ui-toggle-state");

      if (state) {
        state.textContent = scriptureFirst ? "On" : "Off";
      }
    }
  };

  // Reshape the grid columns to put `currentPaneSplit` worth of width on the
  // notes side and the rest on the scripture side, swapping which side gets
  // which fraction depending on pane order.  The 20px middle column is the
  // divider's gutter.  minmax(320px, …) on the scripture side keeps the
  // verse picker readable even at extreme split values.
  const applySplit = (fraction) => {
    currentPaneSplit = Math.max(0.2, Math.min(0.8, fraction));
    const isScriptureFirst = paneGrid.dataset.order === "scripture-first";

    if (isScriptureFirst) {
      paneGrid.style.gridTemplateColumns =
        `minmax(0, ${1 - currentPaneSplit}fr) 20px minmax(320px, ${currentPaneSplit}fr)`;
    } else {
      paneGrid.style.gridTemplateColumns =
        `minmax(0, ${currentPaneSplit}fr) 20px minmax(320px, ${1 - currentPaneSplit}fr)`;
    }
  };

  const applyPaneOrder = (order) => {
    paneGrid.dataset.order = order;
    syncPaneOrderToggle(order);
    applySplit(currentPaneSplit);
  };

  const togglePaneOrder = () => {
    const currentOrder = paneGrid.dataset.order === "scripture-first"
      ? "scripture-first"
      : "notes-first";
    const nextOrder = currentOrder === "scripture-first" ? "notes-first" : "scripture-first";
    void writeStoredValue(paneOrderStorageKey, nextOrder);
    applyPaneOrder(nextOrder);
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
    togglePaneOrder,
    syncPaneOrderToggle,
    getPreferredPaneOrder,
    getPreferredSplit,
    getCurrentPaneSplit: () => currentPaneSplit
  };
};
