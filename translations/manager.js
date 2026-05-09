window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createTranslationsManager = (deps) => {
  const {
    translationLibrary,
    readStoredValue,
    writeStoredValue,
    customTranslationsStorageKey,
    translationStorageKey,
    translationSelect,
    downloadAllTranslationsButton,
    downloadAllTranslationsStatus,
    getCurrentTranslationCode,
    applyTranslation
  } = deps;

  const BUILTIN_TRANSLATION_CODES = new Set(Object.keys(translationLibrary));
  const builtinTranslationCacheKeyPrefix = "service-notes-builtin-";
  const offlineAvailableTranslations = new Set();
  let downloadAllTranslationsInFlight = false;

  const getUserTranslations = () => deps.getUserTranslations();
  const setUserTranslations = (value) => deps.setUserTranslations(value);

  const parseTranslationJs = (content) => {
    const trimmed = content.trim();
    const match = trimmed.match(/window\.([A-Z][A-Z0-9_]*)_BIBLE\s*=\s*/);

    if (!match) {
      throw new Error("File does not look like a translation file. Expected: window.CODE_BIBLE = {...}");
    }

    const code = match[1];
    const jsonPart = trimmed.slice(match.index + match[0].length).replace(/;\s*$/, "");
    let data;

    try {
      data = JSON.parse(jsonPart);
    } catch (e) {
      throw new Error(`Could not parse translation data: ${e.message}`);
    }

    const labelMatch = trimmed.match(new RegExp(`window\\.${code}_LABEL\\s*=\\s*"([^"]+)"`));
    const label = labelMatch ? labelMatch[1] : code;

    const languageMatch = trimmed.match(new RegExp(`window\\.${code}_LANGUAGE\\s*=\\s*"([^"]+)"`));
    const language = languageMatch ? languageMatch[1] : null;

    const copyrightMatch = trimmed.match(new RegExp(`window\\.${code}_COPYRIGHT\\s*=\\s*"([^"]+)"`));
    const copyright = copyrightMatch ? copyrightMatch[1] : null;

    const versionMatch = trimmed.match(new RegExp(`window\\.${code}_VERSION\\s*=\\s*(\\d+)`));
    const version = versionMatch ? Number(versionMatch[1]) : null;

    return { code, label, language, copyright, version, data };
  };

  const refreshOfflineTranslationAvailability = async () => {
    offlineAvailableTranslations.clear();

    for (const [code, entry] of Object.entries(translationLibrary)) {
      if (entry.books) {
        offlineAvailableTranslations.add(code);
        continue;
      }

      if (entry.scriptSrc) {
        const cached = await readStoredValue(`${builtinTranslationCacheKeyPrefix}${code}`);
        if (cached && typeof cached === "object" && !Array.isArray(cached)) {
          const cachedVersion = cached._version ?? null;
          const currentVersion = entry.version ?? null;
          const versionOk = (currentVersion !== null && cachedVersion === currentVersion)
            || (currentVersion === null && cached.books);
          if (versionOk) {
            offlineAvailableTranslations.add(code);
          }
        }
      } else {
        offlineAvailableTranslations.add(code);
      }
    }
  };

  const ensureTranslationLoaded = async (code) => {
    const entry = translationLibrary[code];

    if (!entry || entry.books) {
      if (entry) {
        offlineAvailableTranslations.add(code);
      }
      return;
    }

    const cached = await readStoredValue(`${builtinTranslationCacheKeyPrefix}${code}`);

    if (cached && typeof cached === "object" && !Array.isArray(cached)) {
      const cachedVersion = cached._version ?? null;
      const currentVersion = entry.version ?? null;

      if (currentVersion !== null && cachedVersion === currentVersion) {
        entry.books = cached.books ?? cached;
        offlineAvailableTranslations.add(code);
        return;
      }

      if (currentVersion === null && cached.books) {
        entry.books = cached.books;
        offlineAvailableTranslations.add(code);
        return;
      }
    }

    const response = await fetch(entry.scriptSrc);

    if (!response.ok) {
      throw new Error(`Failed to load translation "${code}": ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    const { data } = parseTranslationJs(text);
    entry.books = data;
    void writeStoredValue(`${builtinTranslationCacheKeyPrefix}${code}`, { _version: entry.version ?? null, books: data });
    offlineAvailableTranslations.add(code);
  };

  const validateTranslationData = (data) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return false;
    }

    const books = Object.keys(data);

    if (books.length === 0) {
      return false;
    }

    for (const book of books.slice(0, 3)) {
      const chapters = data[book];

      if (!Array.isArray(chapters) || chapters.length === 0) {
        return false;
      }

      const chapter = chapters[0];

      if (!chapter || typeof chapter.chapter !== "number" || !Array.isArray(chapter.verses) || chapter.verses.length === 0) {
        return false;
      }

      const verse = chapter.verses[0];

      if (!verse || typeof verse.verse !== "number" || typeof verse.text !== "string") {
        return false;
      }
    }

    return true;
  };

  const populateTranslationSelect = () => {
    const current = translationSelect.value || getCurrentTranslationCode();
    translationSelect.innerHTML = "";

    const languages = new Set(
      Object.values(translationLibrary)
        .map((entry) => entry.language)
        .filter(Boolean)
    );
    const showLanguage = languages.size > 1;

    const sorted = Object.entries(translationLibrary).sort(([, a], [, b]) => {
      const aLabel = a.label ?? "";
      const bLabel = b.label ?? "";
      return aLabel.localeCompare(bLabel, undefined, { sensitivity: "base" });
    });

    const offline = !navigator.onLine;

    sorted.forEach(([code, entry]) => {
      const option = document.createElement("option");
      option.value = code;
      const baseLabel = entry.label ?? code;
      const labelWithLang = showLanguage && entry.language ? `${baseLabel} (${entry.language})` : baseLabel;

      if (offline && !offlineAvailableTranslations.has(code)) {
        option.textContent = `${labelWithLang} — not downloaded`;
        option.disabled = true;
      } else {
        option.textContent = labelWithLang;
      }

      translationSelect.append(option);
    });

    const preferred = translationLibrary[current] && !(offline && !offlineAvailableTranslations.has(current))
      ? current
      : null;

    if (preferred) {
      translationSelect.value = preferred;
    } else if (translationLibrary.KJV && (!offline || offlineAvailableTranslations.has("KJV"))) {
      translationSelect.value = "KJV";
    } else {
      const fallback = sorted.find(([code]) => !offline || offlineAvailableTranslations.has(code));
      translationSelect.value = fallback ? fallback[0] : (Object.keys(translationLibrary)[0] ?? "");
    }
  };

  const registerCustomTranslation = (code, label, language, copyright, data) => {
    translationLibrary[code] = { label, language: language ?? null, copyright: copyright ?? null, books: data };
    const nextUserTranslations = getUserTranslations().filter((entry) => entry.code !== code);
    nextUserTranslations.push({ code, label, language: language ?? null, copyright: copyright ?? null, data });
    setUserTranslations(nextUserTranslations);
    void writeStoredValue(customTranslationsStorageKey, nextUserTranslations);
    populateTranslationSelect();
  };

  const loadCustomTranslations = async () => {
    const stored = await readStoredValue(customTranslationsStorageKey);

    if (!Array.isArray(stored)) {
      return;
    }

    const nextUserTranslations = [];

    stored.forEach(({ code, label, language, copyright, data }) => {
      if (code && label && validateTranslationData(data)) {
        translationLibrary[code] = { label, language: language ?? null, copyright: copyright ?? null, books: data };
        nextUserTranslations.push({ code, label, language: language ?? null, copyright: copyright ?? null, data });
      }
    });

    setUserTranslations(nextUserTranslations);
  };

  const importTranslationFromFile = async (file) => {
    const content = await file.text();
    const { code, label, language, copyright, data } = parseTranslationJs(content);

    if (!validateTranslationData(data)) {
      throw new Error(`"${file.name}" does not contain valid Bible translation data.`);
    }

    if (BUILTIN_TRANSLATION_CODES.has(code)) {
      throw new Error(`"${code}" is already a built-in translation and cannot be overwritten.`);
    }

    registerCustomTranslation(code, label, language, copyright, data);
    return code;
  };

  const importTranslationFromUrl = async (url) => {
    let content;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }

      content = await response.text();
    } catch (e) {
      throw new Error(`Failed to download translation: ${e.message}`);
    }

    const { code, label, language, copyright, data } = parseTranslationJs(content);

    if (!validateTranslationData(data)) {
      throw new Error("The downloaded file does not contain valid Bible translation data.");
    }

    if (BUILTIN_TRANSLATION_CODES.has(code)) {
      throw new Error(`"${code}" is already a built-in translation and cannot be overwritten.`);
    }

    registerCustomTranslation(code, label, language, copyright, data);
    return code;
  };

  const deleteCustomTranslation = async (code) => {
    if (BUILTIN_TRANSLATION_CODES.has(code)) {
      return;
    }

    delete translationLibrary[code];
    const nextUserTranslations = getUserTranslations().filter((entry) => entry.code !== code);
    setUserTranslations(nextUserTranslations);
    void writeStoredValue(customTranslationsStorageKey, nextUserTranslations);

    if (getCurrentTranslationCode() === code) {
      await applyTranslation("KJV");
      void writeStoredValue(translationStorageKey, "KJV");
    }

    populateTranslationSelect();
  };

  const refreshDownloadAllTranslationsUi = () => {
    if (!downloadAllTranslationsButton || !downloadAllTranslationsStatus) {
      return;
    }

    const builtinCodes = [...BUILTIN_TRANSLATION_CODES];
    const missing = builtinCodes.filter((code) => !offlineAvailableTranslations.has(code));
    const offline = !navigator.onLine;

    if (downloadAllTranslationsInFlight) {
      return;
    }

    if (missing.length === 0) {
      downloadAllTranslationsButton.disabled = true;
      downloadAllTranslationsButton.textContent = "All downloaded";
      downloadAllTranslationsStatus.textContent = `${builtinCodes.length} of ${builtinCodes.length} available offline.`;
      return;
    }

    downloadAllTranslationsButton.textContent = "Download all for offline use";

    if (offline) {
      downloadAllTranslationsButton.disabled = true;
      downloadAllTranslationsStatus.textContent = `You're offline — ${missing.length} of ${builtinCodes.length} not yet downloaded. Reconnect to download the rest.`;
      return;
    }

    downloadAllTranslationsButton.disabled = false;
    downloadAllTranslationsStatus.textContent = `${builtinCodes.length - missing.length} of ${builtinCodes.length} available offline.`;
  };

  const renderTranslationsPanel = () => {
    const builtinList = document.querySelector("#builtin-translation-list");
    const userList = document.querySelector("#user-translation-list");
    const emptyNote = document.querySelector("#user-translations-empty-note");

    if (!builtinList || !userList || !emptyNote) {
      return;
    }

    builtinList.innerHTML = "";
    [...BUILTIN_TRANSLATION_CODES]
      .sort((a, b) => {
        const aLabel = translationLibrary[a]?.label ?? a;
        const bLabel = translationLibrary[b]?.label ?? b;
        return aLabel.localeCompare(bLabel, undefined, { sensitivity: "base" });
      })
      .forEach((code) => {
        const entry = translationLibrary[code];

        if (!entry) {
          return;
        }

        const li = document.createElement("li");
        li.className = "translation-list-item";

        const info = document.createElement("span");
        info.className = "translation-list-item-info";

        const codeEl = document.createElement("span");
        codeEl.className = "translation-list-item-code";
        codeEl.textContent = code;

        const labelEl = document.createElement("span");
        labelEl.className = "translation-list-item-label";
        labelEl.textContent = entry.label;

        const tag = document.createElement("span");
        tag.className = "translation-list-item-tag";
        if (offlineAvailableTranslations.has(code)) {
          tag.textContent = "Downloaded";
          tag.dataset.state = "downloaded";
        } else {
          tag.textContent = "Not downloaded";
          tag.dataset.state = "missing";
        }

        info.append(codeEl, labelEl, tag);
        li.append(info);
        builtinList.append(li);
      });

    refreshDownloadAllTranslationsUi();

    userList.innerHTML = "";
    const hasUser = getUserTranslations().length > 0;
    emptyNote.hidden = hasUser;

    [...getUserTranslations()]
      .sort((a, b) => (a.label ?? a.code).localeCompare(b.label ?? b.code, undefined, { sensitivity: "base" }))
      .forEach(({ code, label }) => {
        const li = document.createElement("li");
        li.className = "translation-list-item";

        const info = document.createElement("span");
        info.className = "translation-list-item-info";

        const codeEl = document.createElement("span");
        codeEl.className = "translation-list-item-code";
        codeEl.textContent = code;

        const labelEl = document.createElement("span");
        labelEl.className = "translation-list-item-label";
        labelEl.textContent = label;

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "ghost-button ghost-button--danger ghost-button--small";
        deleteBtn.textContent = "Delete";
        deleteBtn.dataset.deleteTranslation = code;

        info.append(codeEl, labelEl);
        li.append(info, deleteBtn);
        userList.append(li);
      });
  };

  const downloadAllBuiltinTranslations = async () => {
    if (downloadAllTranslationsInFlight) {
      return;
    }

    if (!navigator.onLine) {
      if (downloadAllTranslationsStatus) {
        downloadAllTranslationsStatus.textContent = "You're offline — connect to download.";
      }
      return;
    }

    const builtinCodes = [...BUILTIN_TRANSLATION_CODES];
    const missing = builtinCodes.filter((code) => !offlineAvailableTranslations.has(code));

    if (missing.length === 0) {
      return;
    }

    downloadAllTranslationsInFlight = true;
    if (downloadAllTranslationsButton) {
      downloadAllTranslationsButton.disabled = true;
    }

    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < missing.length; i += 1) {
      const code = missing[i];
      const entry = translationLibrary[code];
      const label = entry?.label ?? code;

      if (downloadAllTranslationsButton) {
        downloadAllTranslationsButton.textContent = `Downloading ${i + 1} of ${missing.length}…`;
      }
      if (downloadAllTranslationsStatus) {
        downloadAllTranslationsStatus.textContent = `Downloading ${label}…`;
      }

      try {
        await ensureTranslationLoaded(code);
        succeeded += 1;
      } catch (err) {
        console.warn(`[Translation] Bulk download failed for "${code}":`, err);
        failed += 1;
        if (!navigator.onLine) {
          break;
        }
      }
    }

    downloadAllTranslationsInFlight = false;

    if (deps.isTranslationsSettingsOpen()) {
      renderTranslationsPanel();
    }
    populateTranslationSelect();

    if (downloadAllTranslationsStatus) {
      if (failed === 0) {
        downloadAllTranslationsStatus.textContent = `Downloaded ${succeeded} translation${succeeded === 1 ? "" : "s"}. All available offline.`;
      } else {
        downloadAllTranslationsStatus.textContent = `Downloaded ${succeeded}, failed ${failed}. Click again to retry.`;
      }
    }

    refreshDownloadAllTranslationsUi();
  };

  if (downloadAllTranslationsButton) {
    downloadAllTranslationsButton.addEventListener("click", () => {
      void downloadAllBuiltinTranslations();
    });
  }

  return {
    BUILTIN_TRANSLATION_CODES,
    offlineAvailableTranslations,
    parseTranslationJs,
    refreshOfflineTranslationAvailability,
    ensureTranslationLoaded,
    validateTranslationData,
    populateTranslationSelect,
    registerCustomTranslation,
    loadCustomTranslations,
    importTranslationFromFile,
    importTranslationFromUrl,
    deleteCustomTranslation,
    refreshDownloadAllTranslationsUi,
    downloadAllBuiltinTranslations,
    renderTranslationsPanel
  };
};
