window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createNotesModel = (deps) => {
  const {
    workspace,
    createId,
    normalizeFieldLabel,
    noteMetaFields,
    noteEditor,
    persistWorkspace,
    refreshSaveStatus,
    flushEditorWorkNow,
    saveActiveNote,
    windowObject
  } = deps;

  const createMetadataField = (label = "Field", placeholder = "") => ({
    id: createId("field"),
    label,
    placeholder
  });

  const createDefaultNoteType = () => ({
    id: createId("type"),
    name: "Bible Study",
    fields: [
      createMetadataField("Title", "Optional note title"),
      createMetadataField("Speaker", "Optional speaker name")
    ],
    cardTitleFieldId: null,
    cardSubtitleFieldId: null
  });

  const createEmptyNote = (typeId, metadata = {}) => ({
    id: createId("note"),
    typeId,
    metadata,
    content: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const formatNoteDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

  const getNoteTypeById = (typeId) => workspace.noteTypes.find((type) => type.id === typeId) ?? workspace.noteTypes[0];
  const getActiveNote = () => workspace.notes.find((note) => note.id === workspace.activeNoteId) ?? workspace.notes[0];

  const buildMetadataForType = (type, sourceMetadata = {}, sourceType = null) => {
    const nextMetadata = {};
    const byId = new Map(Object.entries(sourceMetadata));
    const byLabel = new Map();

    if (sourceType) {
      sourceType.fields.forEach((field) => {
        byLabel.set(normalizeFieldLabel(field.label), sourceMetadata[field.id] ?? "");
      });
    }

    type.fields.forEach((field) => {
      const byFieldIdValue = byId.get(field.id);
      const byFieldLabelValue = byLabel.get(normalizeFieldLabel(field.label));
      nextMetadata[field.id] = typeof byFieldIdValue === "string"
        ? byFieldIdValue
        : typeof byFieldLabelValue === "string"
          ? byFieldLabelValue
          : "";
    });

    return nextMetadata;
  };

  const getSuggestedCardTitleFieldId = (type) => {
    const titleField = type.fields.find((field) => normalizeFieldLabel(field.label) === "title");
    return titleField?.id ?? type.fields[0]?.id ?? "";
  };

  const getDefaultCardSubtitleFieldId = (type) => {
    const speakerField = type.fields.find((field) => normalizeFieldLabel(field.label) === "speaker");

    if (speakerField) {
      return speakerField.id;
    }

    const titleFieldId = getSuggestedCardTitleFieldId(type);
    const fallbackField = type.fields.find((field) => field.id !== titleFieldId);
    return fallbackField?.id ?? "";
  };

  const touchNote = (note) => {
    note.updatedAt = new Date().toISOString();
  };

  const createNote = (typeId = workspace.selectedNewNoteTypeId) => {
    const type = getNoteTypeById(typeId) ?? workspace.noteTypes[0];

    if (!type) {
      return;
    }

    workspace.selectedNewNoteTypeId = type.id;
    const note = createEmptyNote(type.id, buildMetadataForType(type));
    workspace.notes.unshift(note);
    workspace.activeNoteId = note.id;
    persistWorkspace();
    deps.renderWorkspace();
    refreshSaveStatus();
    const firstInput = noteMetaFields.querySelector("input");
    (firstInput ?? noteEditor).focus();
  };

  const duplicateNote = (noteId = workspace.activeNoteId) => {
    const sourceNote = workspace.notes.find((note) => note.id === noteId);

    if (!sourceNote) {
      return;
    }

    const duplicate = {
      ...createEmptyNote(sourceNote.typeId, structuredClone(sourceNote.metadata)),
      content: sourceNote.content
    };

    workspace.notes.unshift(duplicate);
    workspace.activeNoteId = duplicate.id;
    persistWorkspace();
    deps.renderWorkspace();
    refreshSaveStatus();
  };

  const switchNote = (noteId) => {
    if (noteId === workspace.activeNoteId) {
      return;
    }

    flushEditorWorkNow();
    saveActiveNote();
    workspace.activeNoteId = noteId;
    persistWorkspace();
    deps.renderWorkspace();
    refreshSaveStatus();
  };

  const deleteNoteById = (noteId) => {
    const note = workspace.notes.find((entry) => entry.id === noteId);

    if (!note) {
      return;
    }

    const confirmed = windowObject.confirm(`Delete entry "${deps.getNoteDisplayTitle(note)}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    workspace.notes = workspace.notes.filter((entry) => entry.id !== noteId);

    if (!workspace.notes.length) {
      const fallbackType = workspace.noteTypes[0];
      const replacement = createEmptyNote(fallbackType.id, buildMetadataForType(fallbackType));
      workspace.notes = [replacement];
      workspace.activeNoteId = replacement.id;
    } else if (workspace.activeNoteId === noteId) {
      workspace.activeNoteId = workspace.notes[0].id;
    }

    persistWorkspace();
    deps.renderWorkspace();
    refreshSaveStatus();
  };

  const changeNoteType = (noteId, nextTypeId) => {
    const note = workspace.notes.find((entry) => entry.id === noteId);
    const nextType = getNoteTypeById(nextTypeId);

    if (!note || !nextType || note.typeId === nextType.id) {
      return;
    }

    const currentType = getNoteTypeById(note.typeId);
    note.typeId = nextType.id;
    note.metadata = buildMetadataForType(nextType, note.metadata, currentType);
    touchNote(note);

    if (workspace.activeNoteId === noteId) {
      workspace.selectedNewNoteTypeId = nextType.id;
    }

    persistWorkspace();
    deps.renderWorkspace();
    refreshSaveStatus();
  };

  return {
    createMetadataField,
    createDefaultNoteType,
    createEmptyNote,
    formatNoteDate,
    getNoteTypeById,
    getActiveNote,
    buildMetadataForType,
    getSuggestedCardTitleFieldId,
    getDefaultCardSubtitleFieldId,
    touchNote,
    createNote,
    duplicateNote,
    switchNote,
    deleteNoteById,
    changeNoteType
  };
};
