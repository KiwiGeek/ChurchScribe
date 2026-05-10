window.ScriptoriaModules = window.ScriptoriaModules || {};

// ─── Scripture full-text search ─────────────────────────────────────────────
// Owns the search input + results list inside the right pane.  Search is a
// linear scan of the active translation's text — at most a million-ish verses,
// which is comfortably fast for a synchronous filter on modern devices, so no
// indexing work is needed.
//
// Cross-module touchpoints:
//   • Reads the active translation through getCurrentScriptureLibrary
//     (scripture-viewer module).
//   • On result click, jumps the viewer pane via navigateToVerse.  We don't
//     re-parse a reference here because search already resolved (book,
//     chapter, verse) from the index walk — handing those values to the
//     viewer skips a regex round-trip.
window.ScriptoriaModules.createScriptureSearch = (deps) => {
  const {
    scriptureSearchInput,
    scriptureSearchResults,
    verseDisplay,
    getCurrentScriptureLibrary,
    navigateToVerse,
    escapeRegExp,
    debounce
  } = deps;

  const MAX_SCRIPTURE_SEARCH_RESULTS = 100;

  // Last submitted query, kept in lower-case form ready for matching.  Other
  // modules read this via getQuery so the viewer can re-run search after a
  // translation switch without us re-tokenising the input.
  let scriptureSearchQuery = "";

  // Parse a search query into bare-word terms and quoted phrases.
  // e.g. `"Lord God" grace` → { terms: ["grace"], phrases: ["lord god"] }
  const parseSearchQuery = (query) => {
    const terms = [];
    const phrases = [];
    // Auto-close an unclosed " anywhere in the string by appending one at the end.
    let lower = query.trim().toLowerCase();
    if ((lower.match(/"/g) ?? []).length % 2 !== 0) {
      lower += '"';
    }
    const regex = /"([^"]+)"|(\S+)/g;

    for (const match of lower.matchAll(regex)) {
      if (match[1]) {
        phrases.push(match[1].trim());
      } else if (match[2]) {
        terms.push(match[2]);
      }
    }

    return { terms, phrases };
  };

  // Wrap matched substrings in <mark> while leaving the rest as plain text
  // nodes, so React-flavored XSS isn't a concern (we never inject the verse
  // text via innerHTML).
  const buildHighlightedTextContent = (text, patterns) => {
    if (!patterns.length) {
      return document.createTextNode(text);
    }

    // Phrases before bare words so the longer match wins in regex alternation.
    const pattern = new RegExp(`(${patterns.map(escapeRegExp).join("|")})`, "gi");
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    for (const match of text.matchAll(pattern)) {
      if (match.index > lastIndex) {
        fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      const mark = document.createElement("mark");
      mark.textContent = match[0];
      fragment.append(mark);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      fragment.append(document.createTextNode(text.slice(lastIndex)));
    }

    return fragment;
  };

  const closeResultsPanel = () => {
    scriptureSearchInput.value = "";
    scriptureSearchQuery = "";
    scriptureSearchResults.classList.add("is-hidden");
    verseDisplay.classList.remove("is-hidden");
  };

  const renderScriptureSearchResults = (results, terms) => {
    scriptureSearchResults.innerHTML = "";

    if (!results.length) {
      const empty = document.createElement("p");
      empty.className = "scripture-search-empty";
      empty.textContent = "No verses found. Try different search words.";
      scriptureSearchResults.append(empty);
      return;
    }

    const count = document.createElement("p");
    count.className = "scripture-search-count";
    count.textContent = results.length === MAX_SCRIPTURE_SEARCH_RESULTS
      ? `Showing first ${MAX_SCRIPTURE_SEARCH_RESULTS} results`
      : `${results.length} ${results.length === 1 ? "verse" : "verses"} found`;
    scriptureSearchResults.append(count);

    results.forEach(({ book, chapter, verse, text }) => {
      const item = document.createElement("div");
      item.className = "scripture-search-result";
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");

      const ref = document.createElement("p");
      ref.className = "scripture-search-result-ref";
      ref.textContent = `${book} ${chapter}:${verse}`;

      const body = document.createElement("p");
      body.className = "scripture-search-result-text";
      body.append(buildHighlightedTextContent(text, terms));

      item.append(ref, body);

      const navigate = () => {
        navigateToVerse(book, chapter, verse);
        closeResultsPanel();
      };

      item.addEventListener("click", navigate);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate();
        }
      });

      scriptureSearchResults.append(item);
    });
  };

  const performScriptureSearch = (query) => {
    scriptureSearchQuery = query.trim().toLowerCase();

    if (!scriptureSearchQuery) {
      scriptureSearchResults.classList.add("is-hidden");
      verseDisplay.classList.remove("is-hidden");
      return;
    }

    const { terms, phrases } = parseSearchQuery(query);
    const scriptureLibrary = getCurrentScriptureLibrary();
    const results = [];

    for (const [bookName, chapters] of Object.entries(scriptureLibrary)) {
      if (results.length >= MAX_SCRIPTURE_SEARCH_RESULTS) {
        break;
      }

      for (const chapter of chapters) {
        if (results.length >= MAX_SCRIPTURE_SEARCH_RESULTS) {
          break;
        }

        for (const verse of chapter.verses) {
          if (results.length >= MAX_SCRIPTURE_SEARCH_RESULTS) {
            break;
          }

          const verseText = verse.text ?? "";
          const verseTextLower = verseText.toLowerCase();

          const matchesAll =
            phrases.every((phrase) => verseTextLower.includes(phrase)) &&
            terms.every((term) => verseTextLower.includes(term));

          if (matchesAll) {
            results.push({ book: bookName, chapter: chapter.chapter, verse: verse.verse, text: verseText });
          }
        }
      }
    }

    verseDisplay.classList.add("is-hidden");
    scriptureSearchResults.classList.remove("is-hidden");
    // Phrases first so longer patterns take priority in regex alternation during highlighting.
    renderScriptureSearchResults(results, [...phrases, ...terms]);
  };

  const debouncedPerformScriptureSearch = debounce((query) => {
    performScriptureSearch(query);
  }, 180);

  scriptureSearchInput.addEventListener("input", () => {
    debouncedPerformScriptureSearch(scriptureSearchInput.value);
  });

  return {
    performScriptureSearch,
    getQuery: () => scriptureSearchQuery
  };
};
