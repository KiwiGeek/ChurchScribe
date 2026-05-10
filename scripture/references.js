window.ScriptoriaModules = window.ScriptoriaModules || {};

// ─── Scripture reference parsing ────────────────────────────────────────────
// Pure parsing/formatting logic.  No DOM, no state of its own.  Given a string
// like "John 3:16-17, 19" it returns a structured object with the canonical
// book, chapter, verses, and chapter highlights; given a structured object
// it can format it back into a canonical "John 3:16-17, 19" string.
//
// Two flavors of input:
//   • Explicit references like "Heb 2:1" — handled by parseScriptureReference
//     and parseExplicitReferenceParts.  These need an alias-aware regex.
//   • Contextual references like "v3" — handled by
//     parseContextualScriptureReference.  These resolve relative to a prior
//     reference's book + chapter (the "context").
//
// All validation funnels through isValidScriptureReference, which checks the
// CURRENTLY-active translation's book/chapter/verse counts.  That means a
// reference can be valid in KJV but invalid in a translation missing certain
// books, and the picker behaves correctly when the user switches translation.
window.ScriptoriaModules.createScriptureReferences = (deps) => {
  const {
    bookAliasMap,
    normalizeBookName,
    getFullExplicitPattern,
    getCurrentScriptureLibrary
  } = deps;

  const isValidScriptureReference = (canonicalBook, chapter, verseStart = null, verseEnd = null) => {
    const scriptureLibrary = getCurrentScriptureLibrary();
    const bookChapters = scriptureLibrary[canonicalBook];

    if (!bookChapters) {
      return false;
    }

    const chapterData = bookChapters.find((c) => c.chapter === chapter);

    if (!chapterData) {
      return false;
    }

    if (verseStart === null) {
      return true;
    }

    const maxVerse = chapterData.verses[chapterData.verses.length - 1]?.verse ?? 0;
    const effectiveVerseEnd = verseEnd ?? verseStart;

    return verseStart >= 1 && effectiveVerseEnd <= maxVerse;
  };

  const isSingleChapterBook = (canonicalBook) => {
    const scriptureLibrary = getCurrentScriptureLibrary();
    return (scriptureLibrary[canonicalBook]?.length ?? 0) === 1;
  };

  const parseScriptureReference = (referenceText) => {
    const match = referenceText.match(getFullExplicitPattern());

    if (!match) {
      return null;
    }

    const canonicalBook = bookAliasMap.get(normalizeBookName(match[1]));
    const referenceBody = match[2];

    if (!canonicalBook) {
      return null;
    }

    const segments = referenceBody.split(/\s*,\s*/);
    const chapterHighlights = new Map();
    let currentChapter = null;
    let firstVerse = null;

    for (const segment of segments) {
      const fullChapterSegment = segment.match(/^(\d+)(?::(\d+)(?:-(\d+))?)?$/);
      const crossChapterSegment = segment.match(/^(\d+):(\d+)(?:-(\d+))?$/);
      const verseOnlySegment = segment.match(/^(\d+)(?:-(\d+))?$/);

      if (!fullChapterSegment) {
        return null;
      }

      if (crossChapterSegment) {
        currentChapter = Number(crossChapterSegment[1]);
        const verseStart = Number(crossChapterSegment[2]);
        const verseEnd = Number(crossChapterSegment[3] ?? crossChapterSegment[2]);

        if (!isValidScriptureReference(canonicalBook, currentChapter, verseStart, verseEnd)) {
          return null;
        }

        const verses = chapterHighlights.get(currentChapter) ?? new Set();

        for (let verse = verseStart; verse <= verseEnd; verse += 1) {
          verses.add(verse);
        }

        chapterHighlights.set(currentChapter, verses);

        if (firstVerse === null) {
          firstVerse = verseStart;
        }

        continue;
      }

      if (segment.includes(":")) {
        currentChapter = Number(fullChapterSegment[1]);
        const verseStart = Number(fullChapterSegment[2]);
        const verseEnd = Number(fullChapterSegment[3] ?? fullChapterSegment[2]);

        if (!isValidScriptureReference(canonicalBook, currentChapter, verseStart, verseEnd)) {
          return null;
        }

        const verses = chapterHighlights.get(currentChapter) ?? new Set();

        for (let verse = verseStart; verse <= verseEnd; verse += 1) {
          verses.add(verse);
        }

        chapterHighlights.set(currentChapter, verses);

        if (firstVerse === null) {
          firstVerse = verseStart;
        }

        continue;
      }

      if (currentChapter === null) {
        const parsedNum = Number(fullChapterSegment[1]);

        if (!isValidScriptureReference(canonicalBook, parsedNum)) {
          if (!isSingleChapterBook(canonicalBook) || !isValidScriptureReference(canonicalBook, 1, parsedNum)) {
            return null;
          }

          currentChapter = 1;
          const singleChapterVerses = chapterHighlights.get(1) ?? new Set();
          singleChapterVerses.add(parsedNum);
          chapterHighlights.set(1, singleChapterVerses);

          if (firstVerse === null) {
            firstVerse = parsedNum;
          }

          continue;
        }

        currentChapter = parsedNum;
        continue;
      }

      if (!verseOnlySegment) {
        return null;
      }

      const verseStart = Number(verseOnlySegment[1]);
      const verseEnd = Number(verseOnlySegment[2] ?? verseOnlySegment[1]);

      if (!isValidScriptureReference(canonicalBook, currentChapter, verseStart, verseEnd)) {
        return null;
      }

      const verses = chapterHighlights.get(currentChapter) ?? new Set();

      for (let verse = verseStart; verse <= verseEnd; verse += 1) {
        verses.add(verse);
      }

      chapterHighlights.set(currentChapter, verses);

      if (firstVerse === null) {
        firstVerse = verseStart;
      }
    }

    return {
      book: canonicalBook,
      chapter: currentChapter,
      firstVerse,
      chapterHighlights
    };
  };

  // Resolve a single comma-delimited segment of a multi-part reference like
  // "1:2, 3:4-5".  Used by parseExplicitReferenceParts to break a multi-part
  // reference into individual link-able pieces.
  const resolveReferenceSegment = (canonicalBook, segment, currentChapter) => {
    const chapterVerseMatch = segment.match(/^(\d+):(\d+)(?:-(\d+))?$/);
    const verseOnlyMatch = segment.match(/^(\d+)(?:-(\d+))?$/);

    if (chapterVerseMatch) {
      const chapter = Number(chapterVerseMatch[1]);
      const verseStart = Number(chapterVerseMatch[2]);
      const verseEnd = Number(chapterVerseMatch[3] ?? chapterVerseMatch[2]);

      if (!isValidScriptureReference(canonicalBook, chapter, verseStart, verseEnd)) {
        return null;
      }

      const verses = new Set();

      for (let verse = verseStart; verse <= verseEnd; verse += 1) {
        verses.add(verse);
      }

      return {
        parsedReference: {
          book: canonicalBook,
          chapter,
          firstVerse: verseStart,
          chapterHighlights: new Map([[chapter, verses]])
        },
        currentChapter: chapter
      };
    }

    if (!verseOnlyMatch) {
      return null;
    }

    if (segment.includes(":")) {
      return null;
    }

    if (currentChapter === null) {
      const parsedNum = Number(verseOnlyMatch[1]);

      if (!isValidScriptureReference(canonicalBook, parsedNum)) {
        if (!isSingleChapterBook(canonicalBook) || !isValidScriptureReference(canonicalBook, 1, parsedNum)) {
          return null;
        }

        const verseSet = new Set([parsedNum]);
        return {
          parsedReference: {
            book: canonicalBook,
            chapter: 1,
            firstVerse: parsedNum,
            chapterHighlights: new Map([[1, verseSet]])
          },
          currentChapter: 1
        };
      }

      return {
        parsedReference: {
          book: canonicalBook,
          chapter: parsedNum,
          firstVerse: null,
          chapterHighlights: new Map()
        },
        currentChapter: parsedNum
      };
    }

    const verseStart = Number(verseOnlyMatch[1]);
    const verseEnd = Number(verseOnlyMatch[2] ?? verseOnlyMatch[1]);

    if (!isValidScriptureReference(canonicalBook, currentChapter, verseStart, verseEnd)) {
      return null;
    }

    const verses = new Set();

    for (let verse = verseStart; verse <= verseEnd; verse += 1) {
      verses.add(verse);
    }

    return {
      parsedReference: {
        book: canonicalBook,
        chapter: currentChapter,
        firstVerse: verseStart,
        chapterHighlights: new Map([[currentChapter, verses]])
      },
      currentChapter
    };
  };

  // Like parseScriptureReference but returns each comma-delimited segment as
  // its own part (with display text + parsed object).  Used by the linkifier
  // so each piece of "John 3:16, 18" becomes its own clickable anchor.
  const parseExplicitReferenceParts = (referenceText) => {
    const match = referenceText.match(getFullExplicitPattern());

    if (!match) {
      return [];
    }

    const originalBookText = match[1];
    const canonicalBook = bookAliasMap.get(normalizeBookName(originalBookText));
    const referenceBody = match[2];

    if (!canonicalBook) {
      return [];
    }

    const segments = referenceBody.split(/(,\s*)/);
    const parts = [];
    let currentChapter = null;
    let pendingDelimiter = "";

    segments.forEach((segment, index) => {
      if (!segment) {
        return;
      }

      if (index % 2 === 1) {
        pendingDelimiter = segment;
        return;
      }

      const resolved = resolveReferenceSegment(canonicalBook, segment.trim(), currentChapter);

      if (!resolved) {
        pendingDelimiter = "";
        return;
      }

      currentChapter = resolved.currentChapter;
      const displayText = parts.length === 0
        ? `${originalBookText} ${segment.trim()}`
        : `${pendingDelimiter}${segment.trim()}`;

      parts.push({
        text: displayText,
        parsedReference: resolved.parsedReference
      });

      pendingDelimiter = "";
    });

    return parts;
  };

  // Resolve a contextual reference (e.g. "v5", "verse 12-14") against a
  // book+chapter context carried over from a prior explicit reference.
  const parseContextualScriptureReference = (referenceText, context) => {
    if (!context?.book || !context?.chapter) {
      return null;
    }

    const match = referenceText.match(/^v(?:erse)?\.?\s*(\d+)(?:-(\d+))?$/i);

    if (!match) {
      return null;
    }

    const verseStart = Number(match[1]);
    const verseEnd = Number(match[2] ?? match[1]);

    if (!isValidScriptureReference(context.book, context.chapter, verseStart, verseEnd)) {
      return null;
    }

    const verses = new Set();

    for (let verse = verseStart; verse <= verseEnd; verse += 1) {
      verses.add(verse);
    }

    return {
      book: context.book,
      chapter: context.chapter,
      firstVerse: verseStart,
      chapterHighlights: new Map([[context.chapter, verses]])
    };
  };

  // Render a parsed reference back to canonical "Book C:V-V" form, collapsing
  // consecutive verses into ranges.
  const formatResolvedReference = (parsedReference) => {
    const verses = [...(parsedReference.chapterHighlights.get(parsedReference.chapter) ?? [])];

    if (!verses.length) {
      return `${parsedReference.book} ${parsedReference.chapter}`;
    }

    const ranges = [];
    let rangeStart = verses[0];
    let previousVerse = verses[0];

    for (let index = 1; index < verses.length; index += 1) {
      const verse = verses[index];

      if (verse === previousVerse + 1) {
        previousVerse = verse;
        continue;
      }

      ranges.push(rangeStart === previousVerse ? `${rangeStart}` : `${rangeStart}-${previousVerse}`);
      rangeStart = verse;
      previousVerse = verse;
    }

    ranges.push(rangeStart === previousVerse ? `${rangeStart}` : `${rangeStart}-${previousVerse}`);
    return `${parsedReference.book} ${parsedReference.chapter}:${ranges.join(", ")}`;
  };

  // Strip a parsed reference down to the (book, chapter) tuple needed to
  // resolve subsequent contextual references like "v5".
  const getReferenceContext = (parsedReference) => ({
    book: parsedReference.book,
    chapter: parsedReference.chapter
  });

  return {
    isValidScriptureReference,
    isSingleChapterBook,
    parseScriptureReference,
    resolveReferenceSegment,
    parseExplicitReferenceParts,
    parseContextualScriptureReference,
    formatResolvedReference,
    getReferenceContext
  };
};
