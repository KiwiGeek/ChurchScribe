window.ScriptoriaModules = window.ScriptoriaModules || {};

// ─── Scripture book aliases ─────────────────────────────────────────────────
// Owns the canonical list of book name → abbreviation mappings used throughout
// the app (typing "Heb 2:1" should resolve to Hebrews; the verse picker should
// know "Ps", "Pslm", and "Psalm" all refer to Psalms).  Also owns the Map and
// regex patterns derived from those aliases — they get rebuilt every time the
// active translation changes (since some translations include or omit certain
// books) or the user edits their custom alias overrides.
window.ScriptoriaModules.createScriptureAliases = (deps) => {
  const {
    workspace,
    escapeRegExp,
    getCurrentTranslation
  } = deps;

  // Mutable: rebuilt by buildBookAliasMap.  Exposed as a Map reference so other
  // modules can hold onto it once and read entries that change over time.
  const bookAliasMap = new Map();

  // Mutable regex patterns.  These are reassigned by buildBookAliasMap when the
  // alias inventory changes; consumers must read them through the getters
  // below rather than capturing the variable directly, otherwise they'd see a
  // stale (or undefined) RegExp.
  let explicitScriptureReferencePattern;
  let fullExplicitScriptureReferencePattern;
  let contextualScriptureReferencePattern;

  const normalizeBookName = (value) =>
    value.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
  const normalizeAliasForRegex = (value) =>
    value.toLowerCase().replace(/\s+/g, " ").trim();

  const addBookAlias = (alias, canonicalBook) => {
    const normalizedAlias = normalizeBookName(alias);

    if (normalizedAlias) {
      bookAliasMap.set(normalizedAlias, canonicalBook);
    }
  };

  const BOOK_ALIASES = {
    "Genesis":         ["Gen", "Ge", "Gn"],
    "Exodus":          ["Exo", "Ex"],
    "Leviticus":       ["Lev", "Le", "Lv"],
    "Numbers":         ["Num", "Nu", "Nm", "Nb"],
    "Deuteronomy":     ["Deut", "Dt", "De", "Deu"],
    "Joshua":          ["Josh", "Jos", "Jsh"],
    "Judges":          ["Judg", "Jdg", "Jg", "Jdgs"],
    "Ruth":            ["Rth", "Ru", "Rut"],
    "1 Samuel":        ["I Samuel", "I Sam", "1 Sam", "1 Sm", "1 Sa", "1 S", "1Sam", "1Sm", "1Sa", "1S"],
    "2 Samuel":        ["II Samuel", "II Sam", "2 Sam", "2 Sm", "2 Sa", "2 S", "2Sam", "2Sm", "2Sa", "2S"],
    "1 Kings":         ["I Kings", "I Kgs", "1 Kgs", "1 Kin", "1 Ki", "1 K", "1Kgs", "1Kin", "1Ki", "1K"],
    "2 Kings":         ["II Kings", "II Kgs", "2 Kgs", "2 Kin", "2 Ki", "2 K", "2Kgs", "2Kin", "2Ki", "2K"],
    "1 Chronicles":    ["I Chronicles", "I Chr", "1 Chr", "1 Ch", "1 Chron", "1Ch", "1Chr", "1Chron"],
    "2 Chronicles":    ["II Chronicles", "II Chr", "2 Chr", "2 Ch", "2 Chron", "2Ch", "2Chr", "2Chron"],
    "Ezra":            ["Ezr", "Ez"],
    "Nehemiah":        ["Neh", "Ne"],
    "Esther":          ["Esth", "Est", "Es"],
    "Job":             ["Jb"],
    "Psalms":          ["Psalm", "Ps", "Pslm", "Psa", "Psm"],
    "Proverbs":        ["Prov", "Prv", "Pr", "Pro"],
    "Ecclesiastes":    ["Eccles", "Eccle", "Ecc", "Ec"],
    "Song of Solomon": ["Song", "Sng", "Song of Songs", "SOS"],
    "Isaiah":          ["Isa", "Is"],
    "Jeremiah":        ["Jer", "Je", "Jr"],
    "Lamentations":    ["Lam", "La"],
    "Ezekiel":         ["Ezek", "Eze", "Ezk"],
    "Daniel":          ["Dan", "Da", "Dn"],
    "Hosea":           ["Hos", "Ho"],
    "Joel":            ["Jl", "Jol"],
    "Amos":            ["Am", "Amo"],
    "Obadiah":         ["Oba", "Obd"],
    "Jonah":           ["Jon"],
    "Micah":           ["Mic", "Mc"],
    "Nahum":           ["Nah", "Na", "Nam"],
    "Habakkuk":        ["Hab"],
    "Zephaniah":       ["Zeph", "Zep", "Zp"],
    "Haggai":          ["Hag", "Hg"],
    "Zechariah":       ["Zech", "Zec", "Zc"],
    "Malachi":         ["Mal", "Ml"],
    "Matthew":         ["Matt", "Mat", "Mt"],
    "Mark":            ["Mk", "Mrk"],
    "Luke":            ["Luk", "Lk"],
    "John":            ["Jhn", "Jn"],
    "Acts":            ["Act"],
    "Romans":          ["Rom", "Ro", "Rm"],
    "1 Corinthians":   ["I Corinthians", "I Cor", "1 Cor", "1Cor", "1 Co", "1Co"],
    "2 Corinthians":   ["II Corinthians", "II Cor", "2 Cor", "2Cor", "2 Co", "2Co"],
    "Galatians":       ["Gal", "Ga"],
    "Ephesians":       ["Eph", "Ephes"],
    "Philippians":     ["Phil", "Php", "Pp"],
    "Colossians":      ["Col"],
    "1 Thessalonians": ["I Thessalonians", "I Thess", "1 Thess", "1Thess", "1 Thes", "1Thes", "1 Th", "1Th"],
    "2 Thessalonians": ["II Thessalonians", "II Thess", "2 Thess", "2Thess", "2 Thes", "2Thes", "2 Th", "2Th"],
    "1 Timothy":       ["I Timothy", "I Tim", "1 Tim", "1 Ti", "1Tim", "1Ti"],
    "2 Timothy":       ["II Timothy", "II Tim", "2 Tim", "2 Ti", "2Tim", "2Ti"],
    "Titus":           ["Tit", "Ti"],
    "Philemon":        ["Philem", "Phm", "Pm"],
    "Hebrews":         ["Heb"],
    "James":           ["Jas", "Jm"],
    "1 Peter":         ["I Peter", "I Pet", "1 Pet", "1 Pe", "1 Pt", "1 P", "1Pet", "1Pe", "1Pt", "1P"],
    "2 Peter":         ["II Peter", "II Pet", "2 Pet", "2 Pe", "2 Pt", "2 P", "2Pet", "2Pe", "2Pt", "2P"],
    "1 John":          ["I John", "I Jn", "1 Jn", "1 Jhn", "1 J", "1Jn", "1Jhn", "1J"],
    "2 John":          ["II John", "II Jn", "2 Jn", "2 Jhn", "2 J", "2Jn", "2Jhn", "2J"],
    "3 John":          ["III John", "III Jn", "3 Jn", "3 Jhn", "3 J", "3Jn", "3Jhn", "3J"],
    "Jude":            ["Jud", "Jd"],
    "Revelation":      ["Rev", "Rv"],
  };
  const NON_ABBREVIATED_BUILTIN_ALIASES = new Set([
    "I Samuel",
    "II Samuel",
    "I Kings",
    "II Kings",
    "I Chronicles",
    "II Chronicles",
    "Psalm",
    "Song of Songs",
    "I Corinthians",
    "II Corinthians",
    "I Thessalonians",
    "II Thessalonians",
    "I Timothy",
    "II Timothy",
    "I Peter",
    "II Peter",
    "I John",
    "II John",
    "III John"
  ].map((alias) => normalizeAliasForRegex(alias)));

  // For books not in BOOK_ALIASES (e.g. apocryphal books in some translations),
  // synthesize a small set of likely abbreviations from the canonical name.
  const getBuiltInAliasesForBook = (book) => {
    const aliases = new Set([book, book.replace(/\s+/g, "")]);

    if (Object.prototype.hasOwnProperty.call(BOOK_ALIASES, book)) {
      BOOK_ALIASES[book].forEach((alias) => aliases.add(alias));
      BOOK_ALIASES[book].forEach((alias) => {
        if (!alias.endsWith(".") && !NON_ABBREVIATED_BUILTIN_ALIASES.has(normalizeAliasForRegex(alias))) {
          aliases.add(`${alias}.`);
        }
      });
      return [...aliases];
    }

    const numberedMatch = book.match(/^([1-3])\s+(.+)$/);

    if (numberedMatch) {
      const [, number, rest] = numberedMatch;
      const abbreviation = rest.slice(0, Math.min(rest.length, 4));
      aliases.add(`${number} ${abbreviation}`);
      aliases.add(`${number}${abbreviation}`);
      aliases.add(`${number} ${rest}`);
      aliases.add(`${number}${rest}`);
    } else if (!book.includes(" ") && book.length > 4) {
      aliases.add(book.slice(0, 4));
    }

    return [...aliases];
  };

  // User overrides (managed in settings → Scripture Abbreviations) take
  // precedence over the built-in alias table.
  const getEffectiveAliasesForBook = (book) => {
    if (Object.prototype.hasOwnProperty.call(workspace.customBookAliases, book)) {
      return workspace.customBookAliases[book];
    }

    return getBuiltInAliasesForBook(book);
  };

  // Rebuild bookAliasMap and the three reference regexes from the current
  // translation's book list and the user's alias overrides.  Called at startup
  // (after the active translation loads) and again when the user edits
  // aliases or switches translation.
  const buildBookAliasMap = () => {
    const currentBooks = getCurrentTranslation()?.books;

    if (!currentBooks) {
      return;
    }

    bookAliasMap.clear();
    const regexAliasSet = new Set();
    Object.keys(currentBooks).forEach((book) => {
      getEffectiveAliasesForBook(book).forEach((alias) => {
        addBookAlias(alias, book);
        const regexAlias = normalizeAliasForRegex(alias);

        if (regexAlias) {
          regexAliasSet.add(regexAlias);
        }
      });
    });

    // Sort longest-first so e.g. "1 Cor" matches before "1 C" in regex
    // alternation; if the shorter alias came first, the regex engine would
    // match it greedily and miss the more specific one.
    const aliasPattern = [...regexAliasSet]
      .sort((left, right) => right.length - left.length)
      .map((alias) => escapeRegExp(alias))
      .join("|");

    explicitScriptureReferencePattern = new RegExp(
      `\\b(${aliasPattern})\\s+(\\d+)(?::\\d+(?:-\\d+)?)?(?:\\s*,\\s*(?:(?:\\d+:)?\\d+(?:-\\d+)?))*`,
      "gi"
    );
    fullExplicitScriptureReferencePattern = new RegExp(
      `^(${aliasPattern})\\s+((?:\\d+)(?::\\d+(?:-\\d+)?)?(?:\\s*,\\s*(?:(?:\\d+:)?\\d+(?:-\\d+)?))*)$`,
      "i"
    );
    contextualScriptureReferencePattern = /\b(v(?:erse)?\.?\s*\d+(?:-\d+)?)\b/gi;
  };

  return {
    bookAliasMap,
    BOOK_ALIASES,
    normalizeBookName,
    addBookAlias,
    getBuiltInAliasesForBook,
    getEffectiveAliasesForBook,
    buildBookAliasMap,
    // Pattern getters: read these via function call so consumers always see
    // the latest compiled version after a buildBookAliasMap rebuild.
    getExplicitPattern: () => explicitScriptureReferencePattern,
    getFullExplicitPattern: () => fullExplicitScriptureReferencePattern,
    getContextualPattern: () => contextualScriptureReferencePattern
  };
};
