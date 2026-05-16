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
    handleTranslationSelection,
    getFallbackTranslationId,
    // Aliases module
    buildBookAliasMap,
    // Late-bound (search module is created after viewer)
    performScriptureSearch,
    getScriptureSearchQuery,
    // Sync hooks
    markLocalSettingsUpdated,
    scheduleAutoCloudSync
  } = deps;

  let currentTranslationCode = "en:KJV";
  let activeScriptureFocus = null;

  const getCurrentTranslation = () => translationLibrary[currentTranslationCode];
  const getCurrentScriptureLibrary = () => getCurrentTranslation().books;

  /** Non-empty `verseDisplaysAs` when the builder kept a publisher-only label; otherwise null. */
  const publisherVerseLabel = (row) => {
    if (!row || typeof row.verseDisplaysAs !== "string") {
      return null;
    }
    const t = row.verseDisplaysAs.trim();
    return t.length > 0 ? t : null;
  };

  const getPreferredTranslation = async () => {
    // Goes through migrateLegacyPreference so users coming from the pre-IDB
    // localStorage build still pick up their saved translation on first load.
    const saved = await migrateLegacyPreference(translationStorageKey);
    const fallbackTranslationId = typeof getFallbackTranslationId === "function"
      ? getFallbackTranslationId()
      : "en:KJV";
    return translationLibrary[saved] ? saved : fallbackTranslationId;
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

    const rowCoverage = (row) => {
      const c = Array.isArray(row.coversVerses) ? row.coversVerses : null;
      if (c && c.length > 0) {
        return c;
      }
      return [row.verse];
    };

    const labelForPassageRow = (row) => {
      const pub = publisherVerseLabel(row);
      if (pub) {
        return pub;
      }
      const c = rowCoverage(row);
      if (c.length > 1) {
        const lo = c[0];
        const hi = c[c.length - 1];
        return lo === hi ? String(lo) : `${lo}–${hi}`;
      }
      return String(row.verse);
    };

    const verseToRows = new Map();
    for (const row of chapter.verses) {
      for (const n of rowCoverage(row)) {
        if (!verseToRows.has(n)) {
          verseToRows.set(n, []);
        }
        verseToRows.get(n).push(row);
      }
    }

    const continuationPeersFor = (verse, covers) => {
      const currentIndex = chapter.verses.indexOf(verse);
      const covThis = covers && covers.length > 0 ? covers : [verse.verse];
      const rowHighlighted = [...highlightedVerses].some((v) => covThis.includes(v));
      if (!rowHighlighted || highlightedVerses.size === 0) {
        return [];
      }
      const peers = [];
      const seenAnchors = new Set();
      for (const hv of highlightedVerses) {
        if (!covThis.includes(hv)) {
          continue;
        }
        for (const peer of verseToRows.get(hv) || []) {
          if (peer === verse) {
            continue;
          }
          if (chapter.verses.indexOf(peer) <= currentIndex) {
            continue;
          }
          const covP = rowCoverage(peer);
          if (!covThis.some((c) => covP.includes(c))) {
            continue;
          }
          const a = peer.verse;
          if (seenAnchors.has(a)) {
            continue;
          }
          seenAnchors.add(a);
          peers.push(peer);
        }
      }
      peers.sort((a, b) => chapter.verses.indexOf(a) - chapter.verses.indexOf(b));
      return peers;
    };

    const usesPassageLayout = chapter.verses.some(
      (v) => Array.isArray(v.coversVerses) && v.coversVerses.length > 1
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

      const covers = Array.isArray(verse.coversVerses) ? verse.coversVerses : null;
      if (covers && covers.length > 0) {
        line.dataset.verses = covers.join(",");
      }

      const rowCoversCanonical = (v) => (covers && covers.length > 0 ? covers.includes(v) : v === verse.verse);

      if ([...highlightedVerses].some((v) => rowCoversCanonical(v))) {
        line.classList.add("is-highlighted");
      }

      const number = document.createElement("span");
      number.className = "chapter-verse-number";
      const pub = publisherVerseLabel(verse);
      if (pub) {
        number.textContent = pub;
      } else if (covers && covers.length > 1) {
        const lo = covers[0];
        const hi = covers[covers.length - 1];
        number.textContent = lo === hi ? String(lo) : `${lo}–${hi}`;
      } else {
        number.textContent = verse.verse;
      }

      const text = document.createElement("span");
      text.className = "chapter-verse-text";

      if (typeof verse.html === "string") {
        text.innerHTML = verse.html;
      } else {
        text.textContent = verse.text;
      }

      line.append(number, text);

      const peers = continuationPeersFor(verse, covers);
      if (peers.length > 0) {
        const ctn = document.createElement("span");
        ctn.className = "chapter-verse-continues";
        ctn.append(document.createTextNode(" · "));
        peers.forEach((peer, i) => {
          if (i > 0) {
            ctn.append(document.createTextNode(" · "));
          }
          const a = document.createElement("a");
          a.href = "#";
          a.className = "chapter-verse-continues-link";
          a.textContent = `Continues in ${labelForPassageRow(peer)}`;
          a.addEventListener("click", (ev) => {
            ev.preventDefault();
            const target = rowCoverage(peer)[0];
            navigateToVerse(selectedBook, chapter.chapter, target);
          });
          ctn.append(a);
        });
        line.append(ctn);
      }

      chapterText.append(line);
    });

    const unit = usesPassageLayout ? "passages" : "verses";
    const translation = getCurrentTranslation();
    verseTranslation.innerHTML = "";
    const metaLine = document.createElement("span");
    metaLine.textContent = `${translation.label} • ${chapter.verses.length} ${unit}`;
    verseTranslation.append(metaLine);
    if (translation.copyright) {
      const copyrightLine = document.createElement("span");
      copyrightLine.className = "chapter-copyright";
      copyrightLine.textContent = translation.copyright;
      verseTranslation.append(copyrightLine);
    }

    if (activeScriptureFocus && activeScriptureFocus.book === selectedBook && activeScriptureFocus.chapter === chapter.chapter) {
      const fv = activeScriptureFocus.firstVerse;
      const targetRow = chapter.verses.find((v) => {
        const cov = Array.isArray(v.coversVerses) ? v.coversVerses : null;
        if (cov && cov.length > 0) {
          return cov.includes(fv);
        }
        return v.verse === fv;
      });
      const anchor = targetRow ? targetRow.verse : fv;
      const targetVerse = chapterText.querySelector(`[data-verse="${anchor}"]`);

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
    if (typeof handleTranslationSelection === "function") {
      const shouldContinue = await handleTranslationSelection(translationSelect.value);

      if (!shouldContinue) {
        return;
      }
    }

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
