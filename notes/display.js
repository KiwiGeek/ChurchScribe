window.ScriptoriaModules = window.ScriptoriaModules || {};

// ── Notes display helpers ─────────────────────────────────────────────────────
// Pure, DOM-free functions that compute the display title, subtitle, and
// searchable text for a note.  Extracted from notes/render.js so that
// mobile.js can use the same logic without loading the full render module
// (which has heavy editor and DOM dependencies).
//
// notes/render.js delegates to this module internally.
// mobile.js loads this file directly instead of reimplementing the helpers.
// ─────────────────────────────────────────────────────────────────────────────

window.ScriptoriaModules.createNotesDisplay = (deps) => {
  const { getNoteTypeById, formatNoteDate } = deps;

  const getNoteDisplayTitle = (note) => {
    if (!note) return "";
    const type = getNoteTypeById(note.typeId);
    const preferredField = type.fields.find((field) => field.id === type.cardTitleFieldId) ?? null;
    const titleValue = preferredField ? note.metadata[preferredField.id]?.trim() : "";

    if (titleValue) {
      return titleValue;
    }

    return formatNoteDate(note.createdAt);
  };

  const getNoteDisplayMeta = (note) => {
    if (!note) return "";
    const type = getNoteTypeById(note.typeId);
    const secondaryField = type.fields.find((field) => field.id === type.cardSubtitleFieldId) ?? null;
    const secondaryValue = secondaryField ? note.metadata[secondaryField.id]?.trim() : "";

    return secondaryValue || "";
  };

  const getNoteSearchableText = (note) => {
    if (!note) return "";
    const metadataText = Object.values(note.metadata)
      .filter((value) => typeof value === "string" && value.trim())
      .join(" ");
    const contentText = note.content.replace(/<[^>]+>/g, " ");
    return [getNoteDisplayTitle(note), getNoteDisplayMeta(note), metadataText, contentText].join(" ").toLowerCase();
  };

  return { getNoteDisplayTitle, getNoteDisplayMeta, getNoteSearchableText };
};
