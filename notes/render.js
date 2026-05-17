window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createNotesRender = (deps) => {
  const {
    workspace,
    newNoteActions,
    activeNoteLabel,
    activeNoteTitle,
    activeNoteMeta,
    metadataSummary,
    noteMetaBar,
    noteMetaFields,
    noteEditor,
    noteManagerDialog,
    settingsDialog,
    processUrlEmbeds,
    linkifyScriptureReferences,
    linkifyUrls,
    refreshTableUi,
    ensureTrailingParagraph,
    trimEditorLeadingSpacerNodes,
    updateNoteEditorPlaceholderState,
    noteBrowserSelectedNoteIdRef
  } = deps;

  // Delegate to the shared display helpers (notes/display.js).
  const { getNoteDisplayTitle, getNoteDisplayMeta, getNoteSearchableText } =
    window.ScriptoriaModules.createNotesDisplay({
      getNoteTypeById: deps.getNoteTypeById,
      formatNoteDate: deps.formatNoteDate
    });

  const renderNoteTypeOptions = () => {
    const showTypeChoices = workspace.noteTypes.length > 1;
    newNoteActions.innerHTML = "";

    if (!workspace.noteTypes.length) {
      return;
    }

    if (!showTypeChoices) {
      const singleTypeButton = document.createElement("button");
      singleTypeButton.type = "button";
      singleTypeButton.className = "ghost-button overflow-action";
      singleTypeButton.dataset.newNoteType = workspace.noteTypes[0].id;
      singleTypeButton.textContent = "New entry";
      newNoteActions.append(singleTypeButton);
      return;
    }

    const menu = document.createElement("details");
    menu.className = "inline-action-menu";

    const summary = document.createElement("summary");
    summary.className = "ghost-button overflow-action";
    summary.textContent = "New entry ▾";

    const panel = document.createElement("div");
    panel.className = "overflow-menu-panel inline-action-panel";

    workspace.noteTypes.forEach((type) => {
      const typeButton = document.createElement("button");
      typeButton.type = "button";
      typeButton.className = "ghost-button overflow-action";
      typeButton.dataset.newNoteType = type.id;
      typeButton.textContent = type.name;
      panel.append(typeButton);
    });

    menu.append(summary, panel);
    newNoteActions.append(menu);
  };

  const renderMetadataSummary = () => {
    const activeNote = deps.getActiveNote();
    const type = deps.getNoteTypeById(activeNote.typeId);
    metadataSummary.innerHTML = "";

    const populatedFields = type.fields
      .map((field) => ({
        id: field.id,
        label: field.label,
        value: (activeNote.metadata[field.id] ?? "").trim()
      }))
      .filter((field) => field.value)
      .filter((field) => field.id !== type.cardTitleFieldId && field.id !== type.cardSubtitleFieldId);

    if (!populatedFields.length) {
      noteMetaBar.classList.add("is-hidden");
      return;
    }

    noteMetaBar.classList.remove("is-hidden");

    populatedFields.forEach((field) => {
      const chip = document.createElement("div");
      chip.className = "metadata-chip";

      const label = document.createElement("span");
      label.className = "metadata-chip-label";
      label.textContent = field.label;

      const value = document.createElement("span");
      value.className = "metadata-chip-value";
      value.textContent = field.value;

      chip.append(label, value);
      metadataSummary.append(chip);
    });
  };

  const renderNoteMetadataFields = () => {
    const activeNote = deps.getActiveNote();
    const type = deps.getNoteTypeById(activeNote.typeId);
    noteMetaFields.innerHTML = "";

    if (workspace.noteTypes.length > 1) {
      const typeField = document.createElement("label");
      typeField.className = "field note-meta-primary-field";

      const typeLabel = document.createElement("span");
      typeLabel.textContent = "Entry type";

      const typeSelect = document.createElement("select");
      typeSelect.name = "active-note-type";
      typeSelect.dataset.noteTypeChange = activeNote.id;

      workspace.noteTypes.forEach((noteType) => {
        const option = document.createElement("option");
        option.value = noteType.id;
        option.textContent = noteType.name;
        typeSelect.append(option);
      });

      typeSelect.value = activeNote.typeId;
      typeField.append(typeLabel, typeSelect);
      noteMetaFields.append(typeField);
    }

    type.fields.forEach((field) => {
      const label = document.createElement("label");
      label.className = "field";

      const title = document.createElement("span");
      title.textContent = field.label;

      const input = document.createElement("input");
      input.type = "text";
      input.name = field.id;
      input.dataset.fieldId = field.id;
      input.placeholder = field.placeholder || `Optional ${field.label.toLowerCase()}`;
      input.value = activeNote.metadata[field.id] ?? "";

      label.append(title, input);
      noteMetaFields.append(label);
    });
  };

  const renderActiveNoteSummary = () => {
    const activeNote = deps.getActiveNote();
    const type = deps.getNoteTypeById(activeNote.typeId);
    const secondaryMeta = getNoteDisplayMeta(activeNote);
    const metaBits = [];

    if (secondaryMeta) {
      metaBits.push(secondaryMeta);
    }

    metaBits.push(`Updated ${deps.formatNoteDate(activeNote.updatedAt)}`);
    activeNoteLabel.textContent = type.name || "Entries";
    activeNoteTitle.textContent = getNoteDisplayTitle(activeNote);
    activeNoteMeta.textContent = metaBits.join(" • ");
  };

  const renderActiveNote = () => {
    const activeNote = deps.getActiveNote();

    if (!activeNote) {
      return;
    }

    workspace.activeNoteId = activeNote.id;
    renderNoteTypeOptions();
    renderActiveNoteSummary();
    renderMetadataSummary();
    renderNoteMetadataFields();
    noteEditor.innerHTML = activeNote.content;
    trimEditorLeadingSpacerNodes();
    if (!noteEditor.firstChild) {
      noteEditor.innerHTML = "<p><br></p>";
    }
    linkifyScriptureReferences();
    linkifyUrls();
    processUrlEmbeds();
    refreshTableUi();
    ensureTrailingParagraph();
    updateNoteEditorPlaceholderState();
  };

  const refreshNoteSurfaces = () => {
    renderActiveNoteSummary();
    renderNoteTypeOptions();
    renderMetadataSummary();

    if (noteManagerDialog.open) {
      deps.renderNoteManager();
    }
  };

  const renderWorkspace = () => {
    deps.ensureWorkspaceConsistency();
    renderActiveNote();

    if (noteManagerDialog.open) {
      deps.renderNoteManager();
    }

    if (settingsDialog.open) {
      deps.renderSettings();
    }
  };

  return {
    getNoteDisplayTitle,
    getNoteDisplayMeta,
    getNoteSearchableText,
    renderNoteTypeOptions,
    renderMetadataSummary,
    renderNoteMetadataFields,
    renderActiveNoteSummary,
    renderActiveNote,
    refreshNoteSurfaces,
    renderWorkspace
  };
};
