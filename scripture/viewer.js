window.ScriptoriaModules = window.ScriptoriaModules || {};

// ─── Scripture viewer / right pane ──────────────────────────────────────────
// Owns the right-pane scripture viewer: the translation/book/chapter dropdowns,
// the rendered chapter text, and the focus state when a reference is jumped to
// (highlighting + scroll).  Owns the active translation code (currentTranslationCode)
// and the scripture-focus state (activeScriptureFocus).
//
// Cross-module touchpoints:
//   • Pulls translation data through ensureTranslationLoaded (translationsManager).
//   • Calls performScriptureSearch (scripture-search module) when the user
//     switches translation while a query is active, so results re-rank against
//     the new translation's text.  Late-bound via the deps callback so the two
//     modules can be created in either order without an import cycle.
//   • Calls buildBookAliasMap (aliases module) on load so aliases get
//     compiled against the active translation's book list.
window.ScriptoriaModules.createScriptureViewer = (deps) => {
  const {
    // DOM refs
    bookSelect,
    chapterSelect,
    chapterText,
    verseReference,
    verseTranslation,
    translationSelect,
    verseDisplay,
    // Data + storage
    translationLibrary,
    readStoredValue,
    writeStoredValue,
    migrateLegacyPreference,
    lastBookChapterStorageKey,
    translationStorageKey,
    // Translation manager
    ensureTranslationLoaded,
    isTranslationOfflineAvailable,
    // Aliases module
    buildBookAliasMap,
    // Late-bound (search module is created after viewer)
    performScriptureSearch,
    getScriptureSearchQuery,
    // Sync hooks
    markLocalSettingsUpdated,
    scheduleAutoCloudSync
  } = deps;

  let currentTranslationCode = "KJV";
  let activeScriptureFocus = null;

  const getCurrentTranslation = () => translationLibrary[currentTranslationCode];
  const getCurrentScriptureLibrary = () => getCurrentTranslation().books;

  const getPreferredTranslation = async () => {
    // Goes through migrateLegacyPreference so users coming from the pre-IDB
    // localStorage build still pick up their saved translation on first load.
    const saved = await migrateLegacyPreference(translationStorageKey);
    return translationLibrary[saved] ? saved : "KJV";
  };

  const saveLastBookChapter = () => {
    void writeStoredValue(lastBookChapterStorageKey, { book: bookSelect.value, chapter: chapterSelect.value });
  };

  const restoreLastBookChapter = async () => {
    const saved = await readStoredValue(lastBookChapterStorageKey);

    if (!saved?.book) {
      return;
    }

    const scriptureLibrary = getCurrentScriptureLibrary();

    if (!scriptureLibrary[saved.book]) {
      return;
    }

    if (saved.chapter == null) {
      return;
    }

    const chapterIndex = Number(saved.chapter);

    if (isNaN(chapterIndex) || chapterIndex < 0 || chapterIndex >= scriptureLibrary[saved.book].length) {
      return;
    }

    bookSelect.value = saved.book;
    populateChapterOptions(saved.book);
    chapterSelect.value = String(chapterIndex);
    renderChapter();
  };

  const populateBookOptions = () => {
    const scriptureLibrary = getCurrentScriptureLibrary();
    bookSelect.innerHTML = "";

    Object.keys(scriptureLibrary).forEach((book) => {
      const option = document.createElement("option");
      option.value = book;
      option.textContent = book;
      bookSelect.append(option);
    });
  };

  const populateChapterOptions = (book) => {
    const scriptureLibrary = getCurrentScriptureLibrary();
    chapterSelect.innerHTML = "";

    scriptureLibrary[book].forEach((chapter, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Chapter ${chapter.chapter}`;
      chapterSelect.append(option);
    });
  };

  const renderChapter = () => {
    const scriptureLibrary = getCurrentScriptureLibrary();
    const selectedBook = bookSelect.value;
    const selectedIndex = Number(chapterSelect.value);
    const chapter = scriptureLibrary[selectedBook][selectedIndex];
    const highlightedVerses = new Set(
      activeScriptureFocus &&
      activeScriptureFocus.book === selectedBook &&
      activeScriptureFocus.chapter === chapter.chapter
        ? activeScriptureFocus.verses
        : []
    );

    verseReference.textContent = `${selectedBook} ${chapter.chapter}`;
    chapterText.innerHTML = "";

    if (chapter.heading) {
      const headingEl = document.createElement("h3");
      headingEl.className = "chapter-section-heading";
      headingEl.textContent = chapter.heading;
      chapterText.append(headingEl);
    }

    if (chapter.subheading) {
      const subEl = document.createElement("h4");
      subEl.className = "chapter-subheading";
      subEl.textContent = chapter.subheading;
      chapterText.append(subEl);
    }

    if (chapter.superscription) {
      const supEl = document.createElement("p");
      supEl.className = "chapter-superscription";
      supEl.textContent = chapter.superscription;
      chapterText.append(supEl);
    }

    chapter.verses.forEach((verse) => {
      if (verse.heading) {
        const headingEl = document.createElement("h3");
        headingEl.className = "chapter-section-heading";
        headingEl.textContent = verse.heading;
        chapterText.append(headingEl);
      }

      if (verse.subheading) {
        const subEl = document.createElement("h4");
        subEl.className = "chapter-subheading";
        subEl.textContent = verse.subheading;
        chapterText.append(subEl);
      }

      const line = document.createElement("p");
      line.className = "chapter-verse";
      line.dataset.verse = String(verse.verse);

      if (highlightedVerses.has(verse.verse)) {
        line.classList.add("is-highlighted");
      }

      const number = document.createElement("span");
      number.className = "chapter-verse-number";
      number.textContent = verse.verse;

      const text = document.createElement("span");
      text.className = "chapter-verse-text";

      if (typeof verse.html === "string") {
        text.innerHTML = verse.html;
      } else {
        text.textContent = verse.text;
      }

      line.append(number, text);
      chapterText.append(line);
    });

    verseTranslation.textContent = `${getCurrentTranslation().label} • ${chapter.verses.length} verses`;

    if (activeScriptureFocus && activeScriptureFocus.book === selectedBook && activeScriptureFocus.chapter === chapter.chapter) {
      const targetVerse = chapterText.querySelector(`[data-verse="${activeScriptureFocus.firstVerse}"]`);

      if (targetVerse) {
        targetVerse.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }
  };

  const applyTranslation = async (translationCode) => {
    if (!translationLibrary[translationCode]) {
      return;
    }

    // Offline + not yet cached → can't load this one.  Revert the picker to
    // whatever's currently active so the UI doesn't sit on an unloadable choice,
    // and surface a status message via the chapter pane.  We don't throw here
    // because the user clicking a disabled-looking option is recoverable, not an
    // error worth alarm.
    const entry = translationLibrary[translationCode];
    const alreadyInMemory = !!entry.books;
    if (!alreadyInMemory && !navigator.onLine && !isTranslationOfflineAvailable(translationCode)) {
      translationSelect.value = currentTranslationCode || translationSelect.value;
      if (chapterText) {
        chapterText.textContent = `"${entry.label ?? translationCode}" hasn't been downloaded yet, and you're currently offline. Connect to the internet and select it again to download.`;
      }
      return;
    }

    try {
      await ensureTranslationLoaded(translationCode);
    } catch (err) {
      // Fetch failed at runtime (offline race, server hiccup, etc.).  Roll the
      // picker back and keep the previous translation active rather than wedging
      // the app in a half-loaded state.
      console.warn(`[Translation] Failed to load "${translationCode}":`, err);
      translationSelect.value = currentTranslationCode || translationSelect.value;
      if (chapterText) {
        chapterText.textContent = `Couldn't load "${entry.label ?? translationCode}". Check your connection and try again.`;
      }
      return;
    }

    currentTranslationCode = translationCode;
    translationSelect.value = translationCode;

    const scriptureLibrary = getCurrentScriptureLibrary();
    const currentBook = scriptureLibrary[bookSelect.value] ? bookSelect.value : Object.keys(scriptureLibrary)[0];
    const requestedChapterNumber = Number(chapterSelect.selectedOptions[0]?.textContent.replace("Chapter ", "") ?? 1);
    const chapterIndex = scriptureLibrary[currentBook].findIndex((chapter) => chapter.chapter === requestedChapterNumber);

    populateBookOptions();
    bookSelect.value = currentBook;
    populateChapterOptions(currentBook);
    chapterSelect.value = String(chapterIndex >= 0 ? chapterIndex : 0);
    renderChapter();

    // Re-rank any active search query against the new translation's text.
    const currentQuery = getScriptureSearchQuery ? getScriptureSearchQuery() : "";
    if (currentQuery) {
      performScriptureSearch(currentQuery);
    }
  };

  const jumpToResolvedScripture = (parsedReference) => {
    if (!parsedReference) {
      return;
    }

    const scriptureLibrary = getCurrentScriptureLibrary();
    const chapterIndex = scriptureLibrary[parsedReference.book].findIndex(
      (chapter) => chapter.chapter === parsedReference.chapter
    );

    if (chapterIndex === -1) {
      return;
    }

    activeScriptureFocus = {
      book: parsedReference.book,
      chapter: parsedReference.chapter,
      firstVerse: parsedReference.firstVerse,
      verses: [...(parsedReference.chapterHighlights.get(parsedReference.chapter) ?? [])]
    };

    bookSelect.value = parsedReference.book;
    populateChapterOptions(parsedReference.book);
    chapterSelect.value = String(chapterIndex);
    renderChapter();
    saveLastBookChapter();
  };

  // Lighter-weight navigation used by the scripture search module: jump to a
  // specific verse without going through the parser.  Search has already
  // resolved (book, chapter, verse) from the indexed library data, so we skip
  // the regex round-trip.
  const navigateToVerse = (book, chapter, verse) => {
    const scriptureLibrary = getCurrentScriptureLibrary();
    const chapterIndex = scriptureLibrary[book]?.findIndex((c) => c.chapter === chapter) ?? -1;

    if (chapterIndex === -1) {
      return;
    }

    activeScriptureFocus = { book, chapter, firstVerse: verse, verses: [verse] };
    bookSelect.value = book;
    populateChapterOptions(book);
    chapterSelect.value = String(chapterIndex);
    renderChapter();
    saveLastBookChapter();
  };

  // ── Listeners ──────────────────────────────────────────────────────────────

  translationSelect.addEventListener("change", async () => {
    activeScriptureFocus = null;
    void writeStoredValue(translationStorageKey, translationSelect.value);
    await applyTranslation(translationSelect.value);
    markLocalSettingsUpdated();
    scheduleAutoCloudSync();
  });

  bookSelect.addEventListener("change", () => {
    activeScriptureFocus = null;
    populateChapterOptions(bookSelect.value);
    chapterSelect.value = "0";
    renderChapter();
    saveLastBookChapter();
  });

  chapterSelect.addEventListener("change", () => {
    activeScriptureFocus = null;
    renderChapter();
    saveLastBookChapter();
  });

  // Copy handler: when the user selects text in the verse display and copies
  // it, we rewrite the clipboard fragment so it pastes cleanly into the notes
  // editor.  Three transformations:
  //   • drop the .is-highlighted class + any inline background colour, so the
  //     bright "you jumped here" highlight doesn't follow into the note;
  //   • replace .verse-red-letter (a class-styled colour) with an inline
  //     style.color value, since the editor's colour-picker reads from the
  //     style attribute, not class names;
  //   • replace .verse-added-words (italic-via-class) with an actual <em>
  //     element so the editor's italic toggle can turn it off;
  //   • turn the chapter-verse-number spans into bracketed numbers like
  //     `[5] ` inline with the verse text.
  verseDisplay.addEventListener("copy", (event) => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return;
    }

    const fragment = selection.getRangeAt(0).cloneContents();
    const wrapper = document.createElement("div");
    wrapper.appendChild(fragment);

    wrapper.querySelectorAll("*").forEach((el) => {
      el.classList.remove("is-highlighted");
      el.style.removeProperty("background");
      el.style.removeProperty("background-color");
    });

    // Convert .verse-red-letter CSS-class color to an inline style so the notes
    // editor's "Automatic" button (which walks el.style.color) can clear it.
    const liveRedLetterEl = chapterText.querySelector(".verse-red-letter");
    const redLetterColor = liveRedLetterEl ? getComputedStyle(liveRedLetterEl).color : "";
    wrapper.querySelectorAll(".verse-red-letter").forEach((el) => {
      if (redLetterColor) {
        el.style.color = redLetterColor;
      }
      el.classList.remove("verse-red-letter");
    });

    // Convert .verse-added-words CSS-class italic to a plain <em> element so the
    // notes editor's italic button can toggle it off.
    // Note: this runs after the red-letter loop so el.style.color may already be
    // set on combined red-letter+added-words spans — carry it over to the <em>.
    wrapper.querySelectorAll(".verse-added-words").forEach((el) => {
      const em = document.createElement("em");
      if (el.style.color) {
        em.style.color = el.style.color;
      }
      em.append(...el.childNodes);
      el.replaceWith(em);
    });

    wrapper.querySelectorAll(".chapter-verse-number").forEach((numEl) => {
      numEl.replaceWith(`[${numEl.textContent.trim()}] `);
    });

    event.clipboardData.setData("text/html", wrapper.innerHTML);
    event.clipboardData.setData("text/plain", selection.toString());
    event.preventDefault();
  });

  return {
    // Rendering
    populateBookOptions,
    populateChapterOptions,
    renderChapter,
    // Translation / focus
    applyTranslation,
    jumpToResolvedScripture,
    navigateToVerse,
    // Persistence
    saveLastBookChapter,
    restoreLastBookChapter,
    getPreferredTranslation,
    // State accessors (used by other modules + bootstrap)
    getCurrentTranslation,
    getCurrentScriptureLibrary,
    getCurrentTranslationCode: () => currentTranslationCode,
    setActiveScriptureFocusToNull: () => { activeScriptureFocus = null; }
  };
};
