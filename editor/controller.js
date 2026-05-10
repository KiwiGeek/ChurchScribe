window.ScriptoriaModules = window.ScriptoriaModules || {};

// CSS selector matching the block-level elements that contenteditable lets the
// user toggle between (paragraph, heading, list-item, blockquote).  The "Block"
// toolbar button uses this when figuring out which element the caret is in.
const BLOCK_LEVEL_ELEMENTS = "p, h2, h3, h4, h5, h6, li, blockquote";

window.ScriptoriaModules.createEditorController = (deps) => {
  const {
    noteEditor,
    noteMetaFields,
    toolbarButtons,
    insertTableButton,
    tableInsertConfirmButton,
    tableToolbar,
    tableContextMenu,
    getActiveNote,
    touchNote,
    persistWorkspace,
    refreshSaveStatus,
    getCaretBlock,
    linkifyScriptureReferences,
    linkifyUrls,
    processUrlEmbeds,
    focusTableCell,
    getTableCellFromSelection,
    getTableContext,
    closeTableContextMenu,
    refreshTableUi,
    isLastTableCell,
    getNextTableCell,
    insertTableRow,
    runTableAction,
    openInsertTableDialog,
    confirmInsertTable,
    windowObject,
    documentObject
  } = deps;

  // Color-picker DOM refs are queried here rather than passed in via deps —
  // they're consumed only by this module's color-picker logic, so there's no
  // value in surfacing them at the bootstrap call site.
  const colorPickerWrapper = documentObject.querySelector("#color-picker-wrapper");
  const colorPickerTrigger = documentObject.querySelector("#color-picker-trigger");
  const colorPickerDropdown = documentObject.querySelector("#color-picker-dropdown");
  const colorButtonSwatch = documentObject.querySelector("#color-button-swatch");

  const colorPalette = [
    { label: "Black", hex: "#000000" },
    { label: "Dark Gray", hex: "#404040" },
    { label: "Gray", hex: "#808080" },
    { label: "Silver", hex: "#c0c0c0" },
    { label: "White", hex: "#ffffff" },
    { label: "Dark Red", hex: "#c00000" },
    { label: "Red", hex: "#ff0000" },
    { label: "Orange", hex: "#ff6600" },
    { label: "Yellow", hex: "#ffff00" },
    { label: "Light Green", hex: "#92d050" },
    { label: "Green", hex: "#00b050" },
    { label: "Light Blue", hex: "#00b0f0" },
    { label: "Blue", hex: "#0070c0" },
    { label: "Dark Blue", hex: "#002060" },
    { label: "Purple", hex: "#7030a0" },
    { label: "Pink", hex: "#ff00ff" }
  ];

  let activeTextColor = null;
  let pendingEditorWorkTimer = null;
  let pendingEditorPersistTimer = null;
  let pendingEditorInputType = null;
  let pendingEditorWorkDirty = false;
  let pendingEditorPersistDirty = false;
  const editorWorkDebounceMs = 150;
  const editorPersistDebounceMs = 1000;

  const applyCommand = (command) => {
    noteEditor.focus();
    documentObject.execCommand(command, false);
  };

  const getEditorRange = () => {
    const selection = windowObject.getSelection();

    if (!selection || !selection.rangeCount) {
      return null;
    }

    const range = selection.getRangeAt(0);
    return noteEditor.contains(range.commonAncestorContainer) ? range : null;
  };

  const getClosestEditorElement = (node, selector) => {
    if (!node) {
      return null;
    }

    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return element?.closest(selector) ?? null;
  };

  const applyBlock = (block) => {
    noteEditor.focus();
    const range = getEditorRange();
    const currentBlock = range
      ? getClosestEditorElement(range.commonAncestorContainer, BLOCK_LEVEL_ELEMENTS)
      : null;
    const isActive = currentBlock?.tagName.toLowerCase() === block.toLowerCase();
    documentObject.execCommand("formatBlock", false, isActive ? "p" : block);
  };

  const saveEditorSelection = () => {
    const range = getEditorRange();
    return range ? range.cloneRange() : null;
  };

  const restoreEditorSelection = (savedRange) => {
    if (!savedRange) {
      return false;
    }

    const selection = windowObject.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);
    return true;
  };

  const isEditorSpacerNode = (node) => {
    if (!node) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return !node.textContent.replace(/\u200b/g, "").trim();
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const tagName = node.tagName;

    if (tagName === "BR") {
      return true;
    }

    if (!["P", "DIV"].includes(tagName)) {
      return false;
    }

    if (node.querySelector("table, img, iframe, ul, ol, blockquote, h2, h3, h4, h5, h6")) {
      return false;
    }

    const textContent = node.textContent.replace(/\u200b/g, "").replace(/\u00a0/g, "").trim();

    if (textContent) {
      return false;
    }

    const htmlWithoutBreaks = node.innerHTML
      .replace(/<br\s*\/?>/gi, "")
      .replace(/&nbsp;/gi, "")
      .replace(/\s+/g, "");

    return htmlWithoutBreaks === "";
  };

  const trimEditorLeadingSpacerNodes = () => {
    while (isEditorSpacerNode(noteEditor.firstChild)) {
      noteEditor.firstChild.remove();
    }
  };

  const isEditorEffectivelyEmpty = () => {
    if (!noteEditor.childNodes.length) {
      return true;
    }

    return [...noteEditor.childNodes].every((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return !node.textContent.replace(/\u200b/g, "").replace(/\u00a0/g, "").trim();
      }

      return isEditorSpacerNode(node);
    });
  };

  const updateNoteEditorPlaceholderState = () => {
    noteEditor.classList.toggle("is-empty", isEditorEffectivelyEmpty());
  };

  const serializeNoteEditorContent = () => {
    const hasMutationMarkers = noteEditor.querySelector(
      "[data-embed-ghost], [data-embed-dragging]"
    ) !== null;

    let serializedContent;

    if (hasMutationMarkers) {
      const editorClone = noteEditor.cloneNode(true);

      editorClone.querySelectorAll("[data-embed-ghost]").forEach((ghost) => {
        const empty = !ghost.textContent && (!ghost.innerHTML || ghost.innerHTML === "<br>");

        if (empty) {
          ghost.remove();
        } else {
          ghost.removeAttribute("data-embed-ghost");
        }
      });

      editorClone.querySelectorAll("[data-embed-dragging]").forEach((el) => {
        el.removeAttribute("data-embed-dragging");
      });

      serializedContent = editorClone.innerHTML;
    } else {
      serializedContent = noteEditor.innerHTML;
    }

    return serializedContent;
  };

  const syncActiveNoteMetadata = (note) => {
    noteMetaFields.querySelectorAll("[data-field-id]").forEach((input) => {
      note.metadata[input.dataset.fieldId] = input.value;
    });
  };

  const syncActiveNoteFromEditor = ({ syncMetadata = false } = {}) => {
    const activeNote = getActiveNote();

    if (!activeNote) {
      return null;
    }

    activeNote.content = serializeNoteEditorContent();

    if (syncMetadata) {
      syncActiveNoteMetadata(activeNote);
    }

    touchNote(activeNote);
    return activeNote;
  };

  const runPendingEditorPersistence = () => {
    pendingEditorPersistTimer = null;

    if (!pendingEditorPersistDirty) {
      return;
    }

    pendingEditorPersistDirty = false;
    persistWorkspace();
    refreshSaveStatus();
  };

  const scheduleEditorPersistence = () => {
    pendingEditorPersistDirty = true;

    if (pendingEditorPersistTimer) {
      windowObject.clearTimeout(pendingEditorPersistTimer);
    }

    pendingEditorPersistTimer = windowObject.setTimeout(
      runPendingEditorPersistence,
      editorPersistDebounceMs
    );
  };

  const runPendingEditorWork = () => {
    pendingEditorWorkTimer = null;

    if (!pendingEditorWorkDirty) {
      return;
    }

    pendingEditorWorkDirty = false;
    const inputType = pendingEditorInputType;
    pendingEditorInputType = null;
    const caretBlock = inputType === "insertFromPaste" ? null : getCaretBlock();

    linkifyScriptureReferences({ jumpToCaretReference: true, scope: caretBlock });
    linkifyUrls({
      suppressAtCaret: inputType !== "insertFromPaste",
      scope: caretBlock
    });
    processUrlEmbeds(caretBlock);

    const selection = windowObject.getSelection();
    const container = selection.rangeCount ? selection.getRangeAt(0).startContainer : null;

    if (container && (!noteEditor.contains(container) || container === noteEditor)) {
      const emptyParagraph = [...noteEditor.querySelectorAll("p")]
        .findLast((paragraph) => !paragraph.textContent.trim());

      if (emptyParagraph) {
        const range = documentObject.createRange();
        range.setStart(emptyParagraph, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    if (syncActiveNoteFromEditor()) {
      pendingEditorPersistDirty = true;
      refreshSaveStatus();
      scheduleEditorPersistence();
    }
  };

  const scheduleEditorWork = (inputType) => {
    pendingEditorWorkDirty = true;

    if (inputType === "insertFromPaste" || pendingEditorInputType !== "insertFromPaste") {
      pendingEditorInputType = inputType;
    }

    if (pendingEditorWorkTimer) {
      windowObject.clearTimeout(pendingEditorWorkTimer);
    }

    pendingEditorWorkTimer = windowObject.setTimeout(runPendingEditorWork, editorWorkDebounceMs);
  };

  const flushEditorWorkNow = () => {
    if (pendingEditorWorkTimer) {
      windowObject.clearTimeout(pendingEditorWorkTimer);
      pendingEditorWorkTimer = null;
    }

    if (pendingEditorWorkDirty) {
      runPendingEditorWork();
    }

    if (pendingEditorPersistTimer) {
      windowObject.clearTimeout(pendingEditorPersistTimer);
      pendingEditorPersistTimer = null;
    }

    if (pendingEditorPersistDirty) {
      runPendingEditorPersistence();
    }
  };

  const saveActiveNote = () => {
    const activeNote = getActiveNote();

    if (!activeNote) {
      return;
    }

    if (pendingEditorPersistTimer) {
      windowObject.clearTimeout(pendingEditorPersistTimer);
      pendingEditorPersistTimer = null;
    }
    pendingEditorPersistDirty = false;

    activeNote.content = serializeNoteEditorContent();
    syncActiveNoteMetadata(activeNote);
    touchNote(activeNote);
    persistWorkspace();
    refreshSaveStatus();
  };

  const applyTextColor = (color) => {
    noteEditor.focus();

    if (color === null) {
      const selection = windowObject.getSelection();

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        noteEditor.querySelectorAll("[style]").forEach((el) => {
          if (el.style.color && range.intersectsNode(el)) {
            el.style.removeProperty("color");
            if (!el.getAttribute("style")) {
              el.removeAttribute("style");
            }
          }
        });

        noteEditor.querySelectorAll("font[color]").forEach((el) => {
          if (range.intersectsNode(el)) {
            el.removeAttribute("color");
            if (el.attributes.length === 0) {
              el.replaceWith(...el.childNodes);
            }
          }
        });
      }

      activeTextColor = null;
    } else {
      documentObject.execCommand("styleWithCSS", false, true);
      documentObject.execCommand("foreColor", false, color);
      activeTextColor = color;
    }

    colorButtonSwatch.style.background = color || "var(--text)";
  };

  const buildColorPickerDropdown = () => {
    colorPickerDropdown.innerHTML = "";

    const automaticBtn = documentObject.createElement("button");
    automaticBtn.type = "button";
    automaticBtn.className = "color-automatic-btn";
    const icon = documentObject.createElement("span");
    icon.className = "color-automatic-icon";
    const label = documentObject.createElement("span");
    label.textContent = "Automatic";
    automaticBtn.append(icon, label);
    automaticBtn.addEventListener("click", () => {
      applyTextColor(null);
      closeColorPicker();
    });
    colorPickerDropdown.append(automaticBtn);

    const sectionLabel = documentObject.createElement("p");
    sectionLabel.className = "color-section-label";
    sectionLabel.textContent = "Standard Colors";
    colorPickerDropdown.append(sectionLabel);

    const grid = documentObject.createElement("div");
    grid.className = "color-swatch-grid";

    colorPalette.forEach(({ label: colorLabel, hex }) => {
      const swatch = documentObject.createElement("button");
      swatch.type = "button";
      swatch.className = "color-swatch";
      if (activeTextColor === hex) {
        swatch.classList.add("is-selected");
      }
      swatch.style.background = hex;
      swatch.setAttribute("aria-label", colorLabel);
      swatch.setAttribute("title", colorLabel);
      swatch.addEventListener("click", () => {
        applyTextColor(hex);
        closeColorPicker();
      });
      grid.append(swatch);
    });

    colorPickerDropdown.append(grid);
  };

  const openColorPicker = () => {
    buildColorPickerDropdown();
    colorPickerDropdown.hidden = false;
    colorPickerTrigger.setAttribute("aria-expanded", "true");
  };

  const closeColorPicker = () => {
    colorPickerDropdown.hidden = true;
    colorPickerTrigger.setAttribute("aria-expanded", "false");
  };

  const seedEmptyParagraphIfNeeded = () => {
    if (!noteEditor.firstChild) {
      const paragraph = documentObject.createElement("p");
      paragraph.innerHTML = "<br>";
      noteEditor.appendChild(paragraph);
    }
  };

  const handleNoteEditorInput = (event) => {
    if (event.inputType === "insertParagraph" || event.inputType === "insertLineBreak") {
      const selection = windowObject.getSelection();
      const savedContainer = selection.rangeCount ? selection.getRangeAt(0).startContainer : null;
      const savedOffset = selection.rangeCount ? selection.getRangeAt(0).startOffset : 0;

      linkifyUrls({ suppressAtCaret: false });
      processUrlEmbeds();

      if (savedContainer && noteEditor.contains(savedContainer)) {
        try {
          const range = documentObject.createRange();
          range.setStart(savedContainer, savedOffset);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch {
          // Leave the cursor wherever the browser placed it.
        }
      }

      scheduleEditorWork(event.inputType);
      return;
    }

    trimEditorLeadingSpacerNodes();
    seedEmptyParagraphIfNeeded();
    updateNoteEditorPlaceholderState();
    scheduleEditorWork(event.inputType);
  };

  const handleTableTabKeydown = (event) => {
    if (event.key !== "Tab" || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const context = getTableContext(getTableCellFromSelection());

    if (!context) {
      return;
    }

    event.preventDefault();

    if (isLastTableCell(context)) {
      insertTableRow(context, 1, 0);
      saveActiveNote();
      refreshTableUi();
      return;
    }

    focusTableCell(getNextTableCell(context));
    refreshTableUi();
  };

  const attach = () => {
    toolbarButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const { command, block } = button.dataset;

        if (command) {
          applyCommand(command);
          return;
        }

        if (block) {
          applyBlock(block);
        }
      });
    });

    insertTableButton.addEventListener("click", () => {
      openInsertTableDialog();
    });

    tableInsertConfirmButton.addEventListener("click", () => {
      confirmInsertTable();
    });

    [tableToolbar, tableContextMenu].forEach((container) => {
      container.addEventListener("mousedown", (event) => {
        if (event.target.closest("[data-table-action]")) {
          event.preventDefault();
        }
      });

      container.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-table-action]");

        if (!actionButton) {
          return;
        }

        runTableAction(actionButton.dataset.tableAction);
      });
    });

    colorPickerTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (colorPickerDropdown.hidden) {
        openColorPicker();
      } else {
        closeColorPicker();
      }
    });

    documentObject.addEventListener("click", (event) => {
      if (!colorPickerWrapper.contains(event.target)) {
        closeColorPicker();
      }

      if (!tableContextMenu.hidden && !tableContextMenu.contains(event.target)) {
        closeTableContextMenu();
      }
    });

    documentObject.addEventListener("contextmenu", (event) => {
      if (!tableContextMenu.hidden && !tableContextMenu.contains(event.target)) {
        closeTableContextMenu();
      }
    });

    documentObject.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !tableContextMenu.hidden) {
        closeTableContextMenu();
        return;
      }

      if (event.key === "Escape" && !colorPickerDropdown.hidden) {
        closeColorPicker();
        colorPickerTrigger.focus();
      }
    });

    noteEditor.addEventListener("keydown", handleTableTabKeydown);
    noteEditor.addEventListener("input", handleNoteEditorInput);
    noteEditor.addEventListener("keyup", refreshTableUi);
    noteEditor.addEventListener("mouseup", refreshTableUi);
    noteEditor.addEventListener("scroll", closeTableContextMenu);
    documentObject.addEventListener("selectionchange", refreshTableUi);
  };

  return {
    applyCommand,
    applyBlock,
    getEditorRange,
    saveEditorSelection,
    restoreEditorSelection,
    getClosestEditorElement,
    trimEditorLeadingSpacerNodes,
    updateNoteEditorPlaceholderState,
    saveActiveNote,
    flushEditorWorkNow,
    attach
  };
};
