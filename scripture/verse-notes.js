window.ScriptoriaModules = window.ScriptoriaModules || {};

// Per-verse scripture notes (translation-independent). One plaintext note per
// canonical book+chapter+verse. Desktop shows a margin rail when the current
// chapter has notes; mobile uses a tap drawer. Notes sync via the settings
// cloud payload and local backups.
window.ScriptoriaModules.createVerseNotes = (deps) => {
  const {
    readStoredValue,
    writeStoredValue,
    verseNotesStorageKey = "service-notes-verse-notes",
    showMarginStorageKey = "service-notes-verse-notes-margin",
    markLocalSettingsUpdated = () => {},
    scheduleAutoCloudSync = () => {},
    syncUiSettingsToCloud = null,
    parseScriptureReference = null,
    getExplicitPattern = null,
    jumpToScripture = null,
    isMobileShell = false
  } = deps;

  let notesByKey = Object.create(null);
  let showMargin = true;
  let dialogEl = null;
  let editingKey = null;
  let editingMeta = null;

  const nowIso = () => new Date().toISOString();

  const makeKey = (book, chapter, verse) =>
    `${String(book)}|${Number(chapter)}|${Number(verse)}`;

  const parseKey = (key) => {
    const [book, chapter, verse] = String(key).split("|");
    return {
      book,
      chapter: Number(chapter),
      verse: Number(verse)
    };
  };

  const normalizeStore = (raw) => {
    const notes = Object.create(null);
    if (!raw || typeof raw !== "object") {
      return notes;
    }
    const source = raw.notes && typeof raw.notes === "object" ? raw.notes : raw;
    Object.entries(source).forEach(([key, value]) => {
      if (!key || !value || typeof value !== "object") {
        return;
      }
      const text = typeof value.text === "string" ? value.text : "";
      if (!text.trim()) {
        return;
      }
      notes[key] = {
        text,
        updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : nowIso()
      };
    });
    return notes;
  };

  const persistNotes = () => {
    const payload = {
      version: 1,
      updatedAt: nowIso(),
      notes: notesByKey
    };
    void writeStoredValue(verseNotesStorageKey, payload);
    markLocalSettingsUpdated();
    scheduleAutoCloudSync();
    if (typeof syncUiSettingsToCloud === "function") {
      void syncUiSettingsToCloud();
    }
  };

  const persistMarginPref = ({ sync = true } = {}) => {
    void writeStoredValue(showMarginStorageKey, showMargin);
    if (!sync) {
      return;
    }
    markLocalSettingsUpdated();
    scheduleAutoCloudSync();
    if (typeof syncUiSettingsToCloud === "function") {
      void syncUiSettingsToCloud();
    }
  };

  const load = async () => {
    const stored = await readStoredValue(verseNotesStorageKey);
    notesByKey = normalizeStore(stored);
    const marginPref = await readStoredValue(showMarginStorageKey);
    if (typeof marginPref === "boolean") {
      showMargin = marginPref;
    }
  };

  const getNote = (book, chapter, verse) => {
    const entry = notesByKey[makeKey(book, chapter, verse)];
    return entry ? { ...entry } : null;
  };

  const setNote = (book, chapter, verse, text) => {
    const key = makeKey(book, chapter, verse);
    const trimmed = String(text ?? "").replace(/\s+$/u, "");
    if (!trimmed.trim()) {
      if (notesByKey[key]) {
        delete notesByKey[key];
        persistNotes();
      }
      return null;
    }
    notesByKey[key] = { text: trimmed, updatedAt: nowIso() };
    persistNotes();
    return { ...notesByKey[key] };
  };

  const deleteNote = (book, chapter, verse) => {
    const key = makeKey(book, chapter, verse);
    if (!notesByKey[key]) {
      return false;
    }
    delete notesByKey[key];
    persistNotes();
    return true;
  };

  const coveredVersesForEl = (verseEl) => {
    const raw = verseEl?.dataset?.verses;
    if (raw) {
      return raw.split(",").map((part) => Number(part.trim())).filter((n) => Number.isFinite(n));
    }
    const single = Number(verseEl?.dataset?.verse);
    return Number.isFinite(single) ? [single] : [];
  };

  const notesForVerses = (book, chapter, verses) =>
    verses
      .map((verse) => {
        const note = getNote(book, chapter, verse);
        return note ? { verse, text: note.text, updatedAt: note.updatedAt } : null;
      })
      .filter(Boolean);

  const chapterHasNotes = (book, chapter) => {
    const prefix = `${book}|${Number(chapter)}|`;
    return Object.keys(notesByKey).some((key) => key.startsWith(prefix));
  };

  const formatRefLabel = (book, chapter, covers) => {
    if (!covers.length) {
      return `${book} ${chapter}`;
    }
    if (covers.length === 1) {
      return `${book} ${chapter}:${covers[0]}`;
    }
    return `${book} ${chapter}:${covers[0]}–${covers[covers.length - 1]}`;
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const linkifyPlainText = (text) => {
    const source = String(text ?? "");
    if (!source) {
      return "";
    }

    const urlRe = /\bhttps?:\/\/[^\s<]+/gi;
    const patternSource = typeof getExplicitPattern === "function" ? getExplicitPattern() : null;
    const scriptureRe = patternSource?.source
      ? new RegExp(patternSource.source, "gi")
      : null;

    const tokens = [];
    const pushText = (value) => {
      if (value) {
        tokens.push({ type: "text", value });
      }
    };

    // First split out URLs, then scripture refs inside remaining text.
    let cursor = 0;
    const urlMatches = [...source.matchAll(urlRe)];
    if (!urlMatches.length) {
      tokens.push({ type: "text", value: source });
    } else {
      urlMatches.forEach((match) => {
        pushText(source.slice(cursor, match.index));
        let href = match[0];
        // Trim trailing punctuation commonly glued to URLs.
        href = href.replace(/[.,;:!?)\]}'"]+$/u, "");
        tokens.push({ type: "url", value: href, raw: match[0].slice(0, href.length) });
        const trailing = match[0].slice(href.length);
        pushText(trailing);
        cursor = match.index + match[0].length;
      });
      pushText(source.slice(cursor));
    }

    const expanded = [];
    tokens.forEach((token) => {
      if (token.type !== "text" || !scriptureRe) {
        expanded.push(token);
        return;
      }
      let localCursor = 0;
      const textValue = token.value;
      const matches = [...textValue.matchAll(scriptureRe)];
      if (!matches.length) {
        expanded.push(token);
        return;
      }
      matches.forEach((match) => {
        if (match.index > localCursor) {
          expanded.push({ type: "text", value: textValue.slice(localCursor, match.index) });
        }
        const refText = match[0];
        const parsed = typeof parseScriptureReference === "function"
          ? parseScriptureReference(refText)
          : null;
        if (parsed) {
          expanded.push({ type: "scripture", value: refText, parsed });
        } else {
          expanded.push({ type: "text", value: refText });
        }
        localCursor = match.index + refText.length;
      });
      if (localCursor < textValue.length) {
        expanded.push({ type: "text", value: textValue.slice(localCursor) });
      }
    });

    return expanded.map((token) => {
      if (token.type === "url") {
        return `<a href="${escapeHtml(token.value)}" target="_blank" rel="noopener noreferrer">${escapeHtml(token.raw || token.value)}</a>`;
      }
      if (token.type === "scripture") {
        return `<a href="#" class="scripture-link verse-note-scripture-link" data-scripture-ref="${escapeHtml(token.value)}">${escapeHtml(token.value)}</a>`;
      }
      return escapeHtml(token.value).replace(/\n/g, "<br>");
    }).join("");
  };

  const ensureDialog = () => {
    if (dialogEl) {
      return dialogEl;
    }

    dialogEl = document.createElement("dialog");
    dialogEl.className = isMobileShell
      ? "mob-sheet-backdrop verse-note-sheet-backdrop"
      : "management-dialog compact-dialog verse-note-dialog";
    dialogEl.id = "verse-note-dialog";
    dialogEl.innerHTML = isMobileShell
      ? `
        <div class="mob-sheet verse-note-sheet" role="document">
          <div class="mob-sheet-handle" aria-hidden="true"></div>
          <div class="mob-sheet-title-row">
            <h2 class="mob-sheet-title" id="verse-note-title">Verse note</h2>
            <button type="button" class="mob-sheet-close" data-verse-note-cancel aria-label="Close">Done</button>
          </div>
          <p class="verse-note-help">Plain text. Scripture references and links are clickable when saved.</p>
          <textarea id="verse-note-input" class="verse-note-input" rows="8" placeholder="Add a note for this verse…"></textarea>
          <div class="verse-note-actions">
            <button type="button" class="mob-settings-action mob-settings-action--danger" data-verse-note-delete hidden>Delete note</button>
            <button type="button" class="mob-settings-action" data-verse-note-save>Save note</button>
          </div>
        </div>
      `
      : `
        <form class="dialog-shell compact-shell verse-note-shell" method="dialog">
          <div class="dialog-header verse-note-header">
            <div>
              <p class="panel-kicker">Scripture note</p>
              <h2 id="verse-note-title">Verse note</h2>
            </div>
            <button class="ghost-button" type="submit" data-verse-note-cancel>Close</button>
          </div>
          <div class="dialog-body verse-note-body">
            <textarea id="verse-note-input" class="verse-note-input" rows="5" placeholder="Write a note… References and URLs become links when saved."></textarea>
          </div>
          <div class="dialog-actions verse-note-actions">
            <button type="button" class="ghost-button verse-note-delete" data-verse-note-delete hidden>Delete</button>
            <button type="button" class="primary-button" data-verse-note-save>Save</button>
          </div>
        </form>
      `;

    document.body.append(dialogEl);

    dialogEl.addEventListener("click", (event) => {
      if (isMobileShell && event.target === dialogEl) {
        closeEditor();
      }
    });

    dialogEl.querySelectorAll("[data-verse-note-cancel]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        closeEditor();
      });
    });

    dialogEl.querySelector("[data-verse-note-save]")?.addEventListener("click", (event) => {
      event.preventDefault();
      saveEditor();
    });

    dialogEl.querySelector("[data-verse-note-delete]")?.addEventListener("click", (event) => {
      event.preventDefault();
      if (!editingMeta) {
        return;
      }
      if (!window.confirm("Delete this verse note?")) {
        return;
      }
      const { book, chapter, verse, onChanged } = editingMeta;
      deleteNote(book, chapter, verse);
      closeEditor();
      onChanged?.();
    });

    return dialogEl;
  };

  const closeEditor = () => {
    const dialog = ensureDialog();
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    }
    dialog.hidden = true;
    dialog.classList.remove("is-open");
    editingKey = null;
    editingMeta = null;
  };

  const saveEditor = () => {
    if (!editingMeta) {
      return;
    }
    const input = ensureDialog().querySelector("#verse-note-input");
    const { book, chapter, verse, onChanged } = editingMeta;
    setNote(book, chapter, verse, input?.value ?? "");
    closeEditor();
    onChanged?.();
  };

  const openEditor = ({ book, chapter, covers, onChanged }) => {
    const verseList = (covers && covers.length ? covers : []).map(Number).filter(Number.isFinite);
    if (!verseList.length) {
      return;
    }

    // Prefer an existing note in the passage row; otherwise edit the first verse.
    let verse = verseList[0];
    for (const candidate of verseList) {
      if (getNote(book, chapter, candidate)) {
        verse = candidate;
        break;
      }
    }

    editingMeta = { book, chapter, verse, covers: verseList, onChanged };
    editingKey = makeKey(book, chapter, verse);

    const dialog = ensureDialog();
    const title = dialog.querySelector("#verse-note-title");
    const input = dialog.querySelector("#verse-note-input");
    const deleteBtn = dialog.querySelector("[data-verse-note-delete]");
    const existing = getNote(book, chapter, verse);

    if (title) {
      title.textContent = formatRefLabel(book, chapter, verseList);
    }
    if (input) {
      input.value = existing?.text ?? "";
    }
    if (deleteBtn) {
      deleteBtn.hidden = !existing;
    }

    dialog.hidden = false;
    if (typeof dialog.showModal === "function" && !isMobileShell) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      dialog.classList.add("is-open");
    }

    queueMicrotask(() => input?.focus());
  };

  const renderMarginCard = (book, chapter, entry) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "verse-note-rail-card";
    card.dataset.verse = String(entry.verse);

    const label = document.createElement("span");
    label.className = "verse-note-rail-label";
    label.textContent = `v${entry.verse}`;

    const body = document.createElement("div");
    body.className = "verse-note-rail-body";
    body.innerHTML = linkifyPlainText(entry.text);

    card.append(label, body);
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      openEditor({
        book,
        chapter,
        covers: [entry.verse],
        onChanged: () => {
          // Caller re-decorates via afterChapterRender path.
          deps.refreshChapter?.();
        }
      });
    });
    return card;
  };

  const bindScriptureLinks = (root) => {
    root.querySelectorAll("a.verse-note-scripture-link[data-scripture-ref]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const ref = link.getAttribute("data-scripture-ref");
        if (ref && typeof jumpToScripture === "function") {
          jumpToScripture(ref);
        }
      });
    });
  };

  const decorateChapter = (chapterText, book, chapter) => {
    if (!chapterText) {
      return;
    }

    // Unwrap prior decoration wrappers if re-decorating after an in-place update.
    chapterText.querySelectorAll(".chapter-verse-block").forEach((block) => {
      const verse = block.querySelector(".chapter-verse");
      if (verse) {
        block.replaceWith(verse);
      }
    });
    chapterText.classList.remove("has-verse-note-margin");
    chapterText.querySelectorAll(".chapter-verse").forEach((verseEl) => {
      verseEl.classList.remove("has-verse-note", "is-note-target");
      verseEl.removeAttribute("role");
      verseEl.removeAttribute("tabindex");
      verseEl.removeAttribute("aria-label");
    });

    const hasNotes = chapterHasNotes(book, chapter);
    const useMargin = !isMobileShell && showMargin && hasNotes;

    if (useMargin) {
      chapterText.classList.add("has-verse-note-margin");
    }

    chapterText.querySelectorAll(".chapter-verse").forEach((verseEl) => {
      const covers = coveredVersesForEl(verseEl);
      const rowNotes = notesForVerses(book, chapter, covers);
      const hasRowNote = rowNotes.length > 0;

      verseEl.classList.add("is-note-target");
      verseEl.setAttribute("role", "button");
      verseEl.tabIndex = 0;
      const refLabel = formatRefLabel(book, chapter, covers);
      verseEl.setAttribute(
        "aria-label",
        hasRowNote ? `${refLabel}. Has note. Activate to edit.` : `${refLabel}. Activate to add a note.`
      );

      if (hasRowNote) {
        verseEl.classList.add("has-verse-note");
      }

      if (useMargin) {
        const block = document.createElement("div");
        block.className = "chapter-verse-block";
        verseEl.replaceWith(block);
        block.append(verseEl);

        const rail = document.createElement("aside");
        rail.className = "verse-note-rail";
        rail.setAttribute("aria-label", `Notes for ${refLabel}`);

        if (rowNotes.length) {
          rowNotes.forEach((entry) => {
            rail.append(renderMarginCard(book, chapter, entry));
          });
          bindScriptureLinks(rail);
          block.append(rail);
        }
      }
    });

    if (!chapterText.dataset.verseNotesBound) {
      chapterText.dataset.verseNotesBound = "1";

      chapterText.addEventListener("click", (event) => {
        if (event.target.closest(".chapter-verse-continues-link")) {
          return;
        }
        if (event.target.closest("a")) {
          return;
        }
        if (event.target.closest(".verse-note-rail-card")) {
          return;
        }
        const verseEl = event.target.closest(".chapter-verse");
        if (!verseEl || !chapterText.contains(verseEl)) {
          return;
        }
        const covers = coveredVersesForEl(verseEl);
        openEditor({
          book: chapterText.dataset.noteBook || book,
          chapter: Number(chapterText.dataset.noteChapter || chapter),
          covers,
          onChanged: () => deps.refreshChapter?.()
        });
      });

      chapterText.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }
        const verseEl = event.target.closest?.(".chapter-verse");
        if (!verseEl || !chapterText.contains(verseEl)) {
          return;
        }
        event.preventDefault();
        verseEl.click();
      });
    }

    chapterText.dataset.noteBook = book;
    chapterText.dataset.noteChapter = String(chapter);
  };

  const getSyncPayload = () => ({
    version: 1,
    updatedAt: nowIso(),
    notes: structuredClone(notesByKey)
  });

  const applySyncPayload = (payload, { persist = true } = {}) => {
    if (!payload) {
      return;
    }
    notesByKey = normalizeStore(payload);
    if (persist) {
      void writeStoredValue(verseNotesStorageKey, getSyncPayload());
    }
  };

  const mergeRemoteNotes = (remotePayload) => {
    // Settings sync chooses a whole local/remote winner, so a full replace is
    // appropriate. Per-key merge is used when both sides may have edits.
    if (!remotePayload) {
      return false;
    }
    const remoteNotes = normalizeStore(remotePayload);
    const merged = Object.create(null);
    const keys = new Set([...Object.keys(notesByKey), ...Object.keys(remoteNotes)]);
    keys.forEach((key) => {
      const local = notesByKey[key];
      const remote = remoteNotes[key];
      if (local && remote) {
        merged[key] = String(remote.updatedAt) > String(local.updatedAt) ? remote : local;
      } else {
        merged[key] = remote || local;
      }
    });
    notesByKey = merged;
    void writeStoredValue(verseNotesStorageKey, getSyncPayload());
    return true;
  };

  const setRefreshChapter = (fn) => {
    deps.refreshChapter = fn;
  };

  const getShowMargin = () => showMargin;
  const setShowMargin = (value, { sync = true } = {}) => {
    showMargin = Boolean(value);
    persistMarginPref({ sync });
  };

  return {
    load,
    getNote,
    setNote,
    deleteNote,
    chapterHasNotes,
    decorateChapter,
    openEditor,
    closeEditor,
    getShowMargin,
    setShowMargin,
    getSyncPayload,
    applySyncPayload,
    mergeRemoteNotes,
    setRefreshChapter,
    getStorageKeys: () => [verseNotesStorageKey, showMarginStorageKey]
  };
};
