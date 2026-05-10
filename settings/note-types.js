window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createSettingsNoteTypes = (deps) => {
  let activeTypeEditorId = null;

  const ensureSelectedTypeForManager = () => {
    if (!deps.workspace.noteTypes.some((type) => type.id === activeTypeEditorId)) {
      activeTypeEditorId = deps.workspace.noteTypes[0]?.id ?? null;
    }

    return activeTypeEditorId;
  };

  const getSelectedTypeForManager = () => {
    ensureSelectedTypeForManager();
    return deps.workspace.noteTypes.find((type) => type.id === activeTypeEditorId) ?? null;
  };

  const setSelectedTypeForManager = (typeId) => {
    activeTypeEditorId = typeId;
    ensureSelectedTypeForManager();
  };

  const syncNotesForType = (type) => {
    deps.workspace.notes.forEach((note) => {
      if (note.typeId === type.id) {
        note.metadata = deps.buildMetadataForType(type, note.metadata);
      }
    });
  };

  const addNoteType = () => {
    const type = {
      id: deps.createId("type"),
      name: "New Type",
      fields: [deps.createMetadataField("Title", "Optional title")]
    };

    deps.workspace.noteTypes.push(type);
    activeTypeEditorId = type.id;
    deps.workspace.selectedNewNoteTypeId = type.id;
    deps.persistWorkspace();
    deps.renderWorkspace();
    deps.refreshSaveStatus();
  };

  const updateSelectedTypeName = (name) => {
    const type = getSelectedTypeForManager();

    if (!type) {
      return;
    }

    type.name = name.trim() || "Untitled Type";
    deps.persistWorkspace();
    deps.renderWorkspace();
  };

  const updateSelectedTypeCardFields = () => {
    const type = getSelectedTypeForManager();

    if (!type) {
      return;
    }

    type.cardTitleFieldId = deps.getSelectedCardTitleFieldId();
    type.cardSubtitleFieldId = deps.getSelectedCardSubtitleFieldId() || "";
    deps.persistWorkspace();
    deps.renderWorkspace();
  };

  const addMetadataFieldToSelectedType = () => {
    const type = getSelectedTypeForManager();

    if (!type) {
      return;
    }

    type.fields.push(deps.createMetadataField("New Field", ""));
    syncNotesForType(type);
    deps.persistWorkspace();
    deps.renderWorkspace();
    deps.refreshSaveStatus();
  };

  const updateMetadataField = (fieldId, prop, value) => {
    const type = getSelectedTypeForManager();

    if (!type) {
      return;
    }

    const field = type.fields.find((entry) => entry.id === fieldId);

    if (!field) {
      return;
    }

    field[prop] = prop === "label" ? value.trim() || "Field" : value;
    syncNotesForType(type);
    deps.persistWorkspace();
    deps.renderWorkspace();
  };

  const removeMetadataField = (fieldId) => {
    const type = getSelectedTypeForManager();

    if (!type) {
      return;
    }

    const field = type.fields.find((entry) => entry.id === fieldId);

    if (!field) {
      return;
    }

    const confirmed = deps.windowObject.confirm(
      `Remove metadata field "${field.label}" from ${type.name}? Existing values for that field will be removed.`
    );

    if (!confirmed) {
      return;
    }

    type.fields = type.fields.filter((entry) => entry.id !== fieldId);

    if (type.cardTitleFieldId === fieldId) {
      type.cardTitleFieldId = deps.getSuggestedCardTitleFieldId(type);
    }

    if (type.cardSubtitleFieldId === fieldId) {
      type.cardSubtitleFieldId = deps.getDefaultCardSubtitleFieldId(type);
    }

    syncNotesForType(type);
    deps.persistWorkspace();
    deps.renderWorkspace();
    deps.refreshSaveStatus();
  };

  const updateCustomAliases = (book, inputValue) => {
    const aliases = inputValue
      .split(",")
      .map((alias) => alias.trim())
      .filter(Boolean)
      .filter((alias, index, allAliases) => allAliases.indexOf(alias) === index);

    deps.workspace.customBookAliases[book] = aliases;
    deps.persistWorkspace();
    deps.buildBookAliasMap();
    deps.refreshSaveStatus();
  };

  const deleteSelectedType = () => {
    const type = getSelectedTypeForManager();

    if (!type || deps.workspace.noteTypes.length === 1) {
      deps.windowObject.alert("At least one entry type is required.");
      return;
    }

    const replacementType = deps.workspace.noteTypes.find((entry) => entry.id !== type.id);
    const confirmed = deps.windowObject.confirm(
      `Delete entry type "${type.name}" and move its entries to "${replacementType.name}"?`
    );

    if (!confirmed) {
      return;
    }

    deps.workspace.notes.forEach((note) => {
      if (note.typeId === type.id) {
        note.typeId = replacementType.id;
        note.metadata = deps.buildMetadataForType(replacementType, note.metadata, type);
        deps.touchNote(note);
      }
    });

    deps.workspace.noteTypes = deps.workspace.noteTypes.filter((entry) => entry.id !== type.id);
    activeTypeEditorId = replacementType.id;
    deps.workspace.selectedNewNoteTypeId = replacementType.id;
    deps.persistWorkspace();
    deps.renderWorkspace();
    deps.refreshSaveStatus();
  };

  return {
    ensureSelectedTypeForManager,
    getSelectedTypeForManager,
    setSelectedTypeForManager,
    addNoteType,
    updateSelectedTypeName,
    updateSelectedTypeCardFields,
    addMetadataFieldToSelectedType,
    updateMetadataField,
    removeMetadataField,
    updateCustomAliases,
    deleteSelectedType
  };
};
