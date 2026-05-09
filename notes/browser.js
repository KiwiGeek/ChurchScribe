window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createNotesBrowser = (deps) => {
  const {
    workspace,
    noteManagerList,
    noteBrowserDetails,
    noteBrowserTypeFilterSelect,
    noteBrowserFilterInput,
    noteBrowserSortSelect,
    overflowMenu,
    noteManagerDialog,
    openDialog
  } = deps;

  const sortNotes = (notes) => {
    const sortedNotes = notes.slice();
    const noteBrowserSort = deps.getNoteBrowserSort();

    if (noteBrowserSort === "created-desc") {
      return sortedNotes.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
    }

    if (noteBrowserSort === "title-asc") {
      return sortedNotes.sort((left, right) => deps.getNoteDisplayTitle(left).localeCompare(deps.getNoteDisplayTitle(right)));
    }

    return sortedNotes.sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
  };

  const getFilteredNotes = () => {
    const query = deps.getNoteBrowserFilter().trim().toLowerCase();
    const rawTypeFilter = deps.getNoteBrowserTypeFilter();
    const activeTypeFilter = workspace.noteTypes.some((type) => type.id === rawTypeFilter)
      ? rawTypeFilter
      : "all";

    return sortNotes(
      workspace.notes.filter((note) => {
        if (activeTypeFilter !== "all" && note.typeId !== activeTypeFilter) {
          return false;
        }

        if (!query) {
          return true;
        }

        return deps.getNoteSearchableText(note).includes(query);
      })
    );
  };

  const getSelectedBrowserNote = (filteredNotes) => {
    const selected = filteredNotes.find((note) => note.id === deps.getNoteBrowserSelectedNoteId());

    if (selected) {
      return selected;
    }

    const active = filteredNotes.find((note) => note.id === workspace.activeNoteId);

    if (active) {
      deps.setNoteBrowserSelectedNoteId(active.id);
      return active;
    }

    deps.setNoteBrowserSelectedNoteId(filteredNotes[0]?.id ?? null);
    return filteredNotes[0] ?? null;
  };

  const getNotePreviewText = (note) => note.content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const renderNoteManager = () => {
    const filteredNotes = getFilteredNotes();
    noteManagerList.innerHTML = "";
    noteBrowserDetails.innerHTML = "";

    noteBrowserTypeFilterSelect.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All entry types";
    noteBrowserTypeFilterSelect.append(allOption);
    workspace.noteTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.name;
      noteBrowserTypeFilterSelect.append(option);
    });
    noteBrowserFilterInput.value = deps.getNoteBrowserFilter();
    noteBrowserTypeFilterSelect.value = workspace.noteTypes.some((type) => type.id === deps.getNoteBrowserTypeFilter())
      ? deps.getNoteBrowserTypeFilter()
      : "all";
    noteBrowserSortSelect.value = deps.getNoteBrowserSort();

    if (!filteredNotes.length) {
      const emptyState = document.createElement("p");
      emptyState.className = "note-browser-empty";
      emptyState.textContent = deps.getNoteBrowserFilter() || deps.getNoteBrowserTypeFilter() !== "all"
        ? "No entries match the current filter."
        : "No entries available.";
      noteManagerList.append(emptyState);
      deps.setNoteBrowserSelectedNoteId(null);
      return;
    }

    const selectedNote = getSelectedBrowserNote(filteredNotes);

    workspace.noteTypes
      .map((type) => ({
        type,
        notes: filteredNotes.filter((note) => note.typeId === type.id)
      }))
      .filter((entry) => entry.notes.length)
      .forEach(({ type, notes }) => {
        const group = document.createElement("section");
        group.className = "note-browser-group";

        const groupHeader = document.createElement("div");
        groupHeader.className = "note-browser-group-header";

        const heading = document.createElement("h3");
        heading.className = "note-browser-group-title";
        heading.textContent = type.name;

        const count = document.createElement("span");
        count.className = "note-browser-group-count";
        count.textContent = `${notes.length} entr${notes.length === 1 ? "y" : "ies"}`;

        groupHeader.append(heading, count);
        group.append(groupHeader);

        notes.forEach((note) => {
          const row = document.createElement("button");
          row.type = "button";
          row.className = `note-browser-list-item${note.id === deps.getNoteBrowserSelectedNoteId() ? " is-selected" : ""}`;
          row.dataset.noteSelect = note.id;

          const title = document.createElement("span");
          title.className = "note-browser-list-title";
          title.textContent = deps.getNoteDisplayTitle(note);

          const meta = document.createElement("span");
          meta.className = "note-browser-list-meta";
          const cardMeta = deps.getNoteDisplayMeta(note);
          meta.textContent = cardMeta
            ? `${cardMeta} • ${deps.formatNoteDate(note.updatedAt)}`
            : deps.formatNoteDate(note.updatedAt);

          row.append(title, meta);
          group.append(row);
        });

        noteManagerList.append(group);
      });

    const detailType = deps.getNoteTypeById(selectedNote.typeId);
    const previewText = getNotePreviewText(selectedNote);
    const detailHeader = document.createElement("div");
    detailHeader.className = "note-browser-detail-header";

    const detailLabel = document.createElement("p");
    detailLabel.className = "active-note-label";
    detailLabel.textContent = detailType.name;

    const detailTitle = document.createElement("h3");
    detailTitle.className = "note-browser-detail-title";
    detailTitle.textContent = deps.getNoteDisplayTitle(selectedNote);

    const detailMeta = document.createElement("p");
    detailMeta.className = "note-browser-detail-meta";
    detailMeta.textContent = `Created ${deps.formatNoteDate(selectedNote.createdAt)} • Updated ${deps.formatNoteDate(selectedNote.updatedAt)}`;

    detailHeader.append(detailLabel, detailTitle, detailMeta);

    const actions = document.createElement("div");
    actions.className = "note-browser-detail-actions";

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "ghost-button primary-button";
    openButton.dataset.noteAction = "open";
    openButton.dataset.noteId = selectedNote.id;
    openButton.textContent = "Open";

    const duplicateButton = document.createElement("button");
    duplicateButton.type = "button";
    duplicateButton.className = "ghost-button";
    duplicateButton.dataset.noteAction = "duplicate";
    duplicateButton.dataset.noteId = selectedNote.id;
    duplicateButton.textContent = "Copy";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost-button";
    deleteButton.dataset.noteAction = "delete";
    deleteButton.dataset.noteId = selectedNote.id;
    deleteButton.textContent = "Delete";

    actions.append(openButton, duplicateButton, deleteButton);

    const metadataBlock = document.createElement("div");
    metadataBlock.className = "note-browser-detail-block";

    const metadataTitle = document.createElement("p");
    metadataTitle.className = "note-browser-detail-block-title";
    metadataTitle.textContent = "Details";
    metadataBlock.append(metadataTitle);

    const populatedFields = detailType.fields
      .map((field) => ({
        label: field.label,
        value: (selectedNote.metadata[field.id] ?? "").trim()
      }))
      .filter((field) => field.value);

    if (populatedFields.length) {
      const metadataList = document.createElement("div");
      metadataList.className = "note-browser-detail-metadata";
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
        metadataList.append(chip);
      });
      metadataBlock.append(metadataList);
    } else {
      const emptyMetadata = document.createElement("p");
      emptyMetadata.className = "note-browser-empty";
      emptyMetadata.textContent = "No entry details added yet.";
      metadataBlock.append(emptyMetadata);
    }

    const previewBlock = document.createElement("div");
    previewBlock.className = "note-browser-detail-block";

    const previewTitle = document.createElement("p");
    previewTitle.className = "note-browser-detail-block-title";
    previewTitle.textContent = "Preview";

    const preview = document.createElement("p");
    preview.className = "note-browser-detail-preview";
    preview.textContent = previewText || "This entry is still empty.";

    previewBlock.append(previewTitle, preview);
    noteBrowserDetails.append(detailHeader, actions, metadataBlock, previewBlock);
  };

  const openNotesBrowser = () => {
    deps.setNoteBrowserSelectedNoteId(workspace.activeNoteId);
    renderNoteManager();
    overflowMenu.removeAttribute("open");
    openDialog(noteManagerDialog);
    noteBrowserFilterInput.focus();
    noteBrowserFilterInput.select();
  };

  return {
    sortNotes,
    getFilteredNotes,
    getSelectedBrowserNote,
    getNotePreviewText,
    renderNoteManager,
    openNotesBrowser
  };
};
