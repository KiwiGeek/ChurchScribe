window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createTranslationsManager = (deps) => {
  const {
    translationLibrary,
    readStoredValue,
    writeStoredValue,
    deleteStoredValue,
    translationRegistryStorageKey,
    translationStorageKey,
    translationSelect,
    getCurrentTranslationCode,
    applyTranslation,
    openOfficialTranslationsSettings
  } = deps;

  const CATALOG_INDEX_URL = "bibles/catalog/index.json";
  const GET_MORE_TRANSLATIONS_VALUE = "__get_more_translations__";
  const translationContentCacheKeyPrefix = "service-notes-translation-content-";
  const translationManifestCacheKeyPrefix = "service-notes-translation-manifest-";
  const USER_SOURCE_TYPE = "user";
  const OFFICIAL_SOURCE_TYPE = "official";
  const BUILTIN_SOURCE_TYPE = "builtin";

  const offlineAvailableTranslations = new Set();

  let catalogIndex = null;
  let translationRegistry = null;
  let officialLanguageSearch = "";
  let officialLanguageFilters = new Set();
  let availableTranslationSearch = "";
  const catalogEntries = new Map();
  const loadedLanguageTags = new Set();

  const fetchJson = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  const normalizeInstalledTranslations = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(value)
        .filter(([, record]) => record && typeof record === "object" && !Array.isArray(record))
        .map(([translationId, record]) => [
          translationId,
          {
            sourceType: typeof record.sourceType === "string" ? record.sourceType : OFFICIAL_SOURCE_TYPE,
            version: Number(record.version) || 1,
            installedAt: typeof record.installedAt === "string" ? record.installedAt : new Date().toISOString(),
            contentHash: typeof record.contentHash === "string" ? record.contentHash : null
          }
        ])
    );
  };

  const normalizeUserTranslations = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(value)
        .filter(([, record]) =>
          record
          && typeof record === "object"
          && !Array.isArray(record)
          && record.manifest
          && record.content
        )
    );
  };

  const normalizeTranslationRegistry = (value = {}) => ({
    schemaVersion: 1,
    catalogVersionSeen: typeof value.catalogVersionSeen === "string" ? value.catalogVersionSeen : null,
    decoderVersionSeen: typeof value.decoderVersionSeen === "number" ? value.decoderVersionSeen : null,
    selectedTranslationId: typeof value.selectedTranslationId === "string" ? value.selectedTranslationId : null,
    installedTranslations: normalizeInstalledTranslations(value.installedTranslations),
    userTranslations: normalizeUserTranslations(value.userTranslations)
  });

  const getInstalledTranslations = () => translationRegistry?.installedTranslations ?? {};
  const getInstalledOfficialIds = () =>
    Object.entries(getInstalledTranslations())
      .filter(([, record]) => record.sourceType === OFFICIAL_SOURCE_TYPE)
      .map(([translationId]) => translationId)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  const getUserTranslations = () =>
    Object.values(translationRegistry?.userTranslations ?? {})
      .map((record) => ({
        translationId: record.manifest.translationId,
        code: record.manifest.code,
        label: record.manifest.label,
        languageTag: record.manifest.languageTag,
        languageCode3: record.manifest.languageCode3 ?? null,
        version: record.manifest.version,
        manifest: structuredClone(record.manifest),
        content: structuredClone(record.content)
      }))
      .sort((a, b) => (a.label ?? a.code).localeCompare(b.label ?? b.code, undefined, { sensitivity: "base" }));

  const getDefaultTranslationId = () =>
    Object.keys(translationRegistry?.installedTranslations ?? {})[0]
    ?? Object.keys(translationLibrary)[0]
    ?? "en:KJV";

  const buildContentHash = (value) => `${JSON.stringify(value).length}:${JSON.stringify(value).slice(0, 64)}`;

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

  const normalizeCatalogEntry = (entry) => {
    const languageTag = typeof entry.languageTag === "string" && entry.languageTag
      ? entry.languageTag
      : "und";
    const code = typeof entry.code === "string" && entry.code
      ? entry.code
      : (typeof entry.translationId === "string" ? entry.translationId.split(":").at(-1) : "UNK");
    const translationId = typeof entry.translationId === "string" && entry.translationId
      ? entry.translationId
      : `${languageTag}:${code}`;

    const existingBooks = translationLibrary[translationId]?.books ?? null;
    const existingInstalled = getInstalledTranslations()[translationId];

    return {
      translationId,
      code,
      label: typeof entry.label === "string" && entry.label ? entry.label : code,
      language: languageTag,
      languageTag,
      languageCode3: typeof entry.languageCode3 === "string" && entry.languageCode3 ? entry.languageCode3 : null,
      sourceType: entry.sourceType === BUILTIN_SOURCE_TYPE ? BUILTIN_SOURCE_TYPE : entry.sourceType === USER_SOURCE_TYPE ? USER_SOURCE_TYPE : OFFICIAL_SOURCE_TYPE,
      version: Number(entry.version) || 1,
      manifestUrl: typeof entry.manifestUrl === "string" && entry.manifestUrl ? entry.manifestUrl : null,
      contentUrl: typeof entry.contentUrl === "string" && entry.contentUrl ? entry.contentUrl : null,
      contentHash: typeof entry.contentHash === "string" ? entry.contentHash : null,
      copyright: typeof entry.copyright === "string" ? entry.copyright : null,
      downloadSizeBytes: Number(entry.downloadSizeBytes) || null,
      bookOrder: typeof entry.bookOrder === "string" ? entry.bookOrder : null,
      features: entry.features && typeof entry.features === "object" ? entry.features : {},
      books: existingBooks,
      installed: !!existingInstalled || entry.sourceType === USER_SOURCE_TYPE,
      hasUpdate: !!existingInstalled && (
        existingInstalled.version < (Number(entry.version) || 1)
        || (typeof entry.contentHash === "string" && typeof existingInstalled.contentHash === "string" && entry.contentHash !== existingInstalled.contentHash)
      )
    };
  };

  const setCatalogEntry = (entry) => {
    const normalized = normalizeCatalogEntry(entry);
    catalogEntries.set(normalized.translationId, normalized);
    return normalized;
  };

  const persistTranslationRegistry = async () => {
    if (!translationRegistry) {
      return;
    }

    await writeStoredValue(translationRegistryStorageKey, translationRegistry);
  };

  const loadTranslationRegistry = async () => {
    translationRegistry = normalizeTranslationRegistry(await readStoredValue(translationRegistryStorageKey));
  };

  // Migration: any translation recorded in installedTranslations with sourceType "builtin"
  // must become "official" so it stays visible and consistent with the new unified model.
  // This is naturally idempotent — once promoted there are no "builtin" entries left.
  // TODO: Remove this function and its call in initializeTranslations once enough time
  // has passed that no user would still have un-migrated "builtin" entries (~November 2026).
  const migrateBuiltinBibles = async () => {
    const entries = Object.entries(translationRegistry.installedTranslations);
    const toPromote = entries.filter(([, record]) => record.sourceType === BUILTIN_SOURCE_TYPE);

    if (toPromote.length === 0) {
      return;
    }

    for (const [translationId, record] of toPromote) {
      record.sourceType = OFFICIAL_SOURCE_TYPE;
      console.info(`[Migration] Promoted "${translationId}" from builtin to official.`);
    }

    await persistTranslationRegistry();
  };

  const ensureCatalogIndexLoaded = async () => {
    if (catalogIndex) {
      return catalogIndex;
    }

    catalogIndex = await fetchJson(CATALOG_INDEX_URL);
    officialLanguageFilters = new Set(translationRegistry?.officialLanguageFilters ?? []);

    // If the decoder version has changed, all cached translation content is potentially
    // stale (the decoder may have changed how it renders text). Clear every installed
    // translation's content and manifest caches so they are re-fetched on next use.
    const freshDecoderVersion = typeof catalogIndex.decoderVersion === "number" ? catalogIndex.decoderVersion : null;
    if (freshDecoderVersion !== null && freshDecoderVersion !== translationRegistry.decoderVersionSeen) {
      console.info(`[Cache] Decoder version changed (${translationRegistry.decoderVersionSeen} → ${freshDecoderVersion}). Clearing all translation content caches.`);
      const installedIds = Object.keys(translationRegistry.installedTranslations);
      for (const translationId of installedIds) {
        await deleteStoredValue(`${translationContentCacheKeyPrefix}${translationId}`);
        await deleteStoredValue(`${translationManifestCacheKeyPrefix}${translationId}`);
      }
      translationRegistry.decoderVersionSeen = freshDecoderVersion;
      await persistTranslationRegistry();
    }

    return catalogIndex;
  };

  const getCatalogLanguageEntries = () => {
    const languages = Array.isArray(catalogIndex?.languages)
      ? catalogIndex.languages
      : Object.keys(catalogIndex?.languageShards ?? {}).map((languageTag) => ({
        languageTag,
        displayName: languageTag,
        shardUrl: catalogIndex.languageShards[languageTag]
      }));

    return languages
      .filter((entry) => entry && typeof entry.languageTag === "string")
      .map((entry) => ({
        languageTag: entry.languageTag,
        displayName: typeof entry.displayName === "string" && entry.displayName ? entry.displayName : entry.languageTag,
        shardUrl: typeof entry.shardUrl === "string" && entry.shardUrl ? entry.shardUrl : catalogIndex.languageShards?.[entry.languageTag] ?? null
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }));
  };

  const ensureLanguageCatalogLoaded = async (languageTag) => {
    await ensureCatalogIndexLoaded();

    if (loadedLanguageTags.has(languageTag)) {
      return;
    }

    const languageEntry = getCatalogLanguageEntries().find((entry) => entry.languageTag === languageTag);

    if (!languageEntry?.shardUrl) {
      return;
    }

    const shard = await fetchJson(languageEntry.shardUrl);

    (shard.translations ?? []).forEach((entry) => {
      setCatalogEntry(entry);
    });

    loadedLanguageTags.add(languageTag);
  };

  const ensureCatalogEntriesLoaded = async (translationIds) => {
    const languageTags = [...new Set(
      translationIds
        .filter((translationId) => typeof translationId === "string" && translationId.includes(":") && !translationId.startsWith("user:"))
        .map((translationId) => translationId.split(":")[0])
    )];

    await Promise.all(languageTags.map((languageTag) => ensureLanguageCatalogLoaded(languageTag)));
  };

  const getVisibleTranslationIds = () =>
    Object.keys(translationRegistry?.installedTranslations ?? {});

  const rebuildTranslationLibrary = () => {
    const visibleIds = new Set(getVisibleTranslationIds());

    Object.keys(translationLibrary).forEach((translationId) => {
      if (!visibleIds.has(translationId)) {
        delete translationLibrary[translationId];
      }
    });

    visibleIds.forEach((translationId) => {
      const userRecord = translationRegistry?.userTranslations?.[translationId];

      if (userRecord) {
        translationLibrary[translationId] = {
          translationId,
          code: userRecord.manifest.code,
          label: userRecord.manifest.label,
          language: userRecord.manifest.languageTag,
          languageTag: userRecord.manifest.languageTag,
          languageCode3: userRecord.manifest.languageCode3 ?? null,
          sourceType: USER_SOURCE_TYPE,
          version: userRecord.manifest.version,
          manifestUrl: null,
          contentUrl: null,
          contentHash: userRecord.manifest.contentHash ?? buildContentHash(userRecord.content),
          copyright: userRecord.manifest.copyright ?? null,
          books: structuredClone(userRecord.content.books),
          installed: true,
          hasUpdate: false,
          features: userRecord.manifest.features ?? {},
          bookOrder: userRecord.manifest.bookOrder ?? null
        };
        return;
      }

      const catalogEntry = catalogEntries.get(translationId);

      if (catalogEntry) {
        translationLibrary[translationId] = {
          ...catalogEntry,
          books: translationLibrary[translationId]?.books ?? catalogEntry.books ?? null
        };
      }
    });
  };

  const getTranslationEntry = (translationId) =>
    translationLibrary[translationId] ?? catalogEntries.get(translationId) ?? null;

  const writeInstalledRecord = async (translationId, entry, contentHash = null) => {
    // Normalize builtin → official so the registry is always consistent.
    // The "builtin" sourceType is a catalog/builder concept only; in the installed
    // registry every catalog-sourced translation is "official".
    const sourceType = entry.sourceType === BUILTIN_SOURCE_TYPE
      ? OFFICIAL_SOURCE_TYPE
      : entry.sourceType;
    translationRegistry.installedTranslations[translationId] = {
      sourceType,
      version: entry.version,
      installedAt: new Date().toISOString(),
      contentHash
    };
    await persistTranslationRegistry();
  };

  const markRegistrySelection = async (translationId) => {
    translationRegistry.selectedTranslationId = translationId;
    await persistTranslationRegistry();
  };

  const refreshOfflineTranslationAvailability = async () => {
    offlineAvailableTranslations.clear();

    for (const translationId of getVisibleTranslationIds()) {
      const entry = getTranslationEntry(translationId);

      if (!entry) {
        continue;
      }

      if (entry.books) {
        offlineAvailableTranslations.add(translationId);
        continue;
      }

      const cached = await readStoredValue(`${translationContentCacheKeyPrefix}${translationId}`);

      if (cached?.books && Number(cached.version) === Number(entry.version)) {
        offlineAvailableTranslations.add(translationId);
      }
    }
  };

  const ensureTranslationLoaded = async (translationId) => {
    await ensureCatalogEntriesLoaded([translationId]);
    rebuildTranslationLibrary();

    const entry = getTranslationEntry(translationId);

    if (!entry) {
      throw new Error(`Unknown translation "${translationId}".`);
    }

    if (entry.books) {
      offlineAvailableTranslations.add(translationId);
      return;
    }

    const cachedContent = await readStoredValue(`${translationContentCacheKeyPrefix}${translationId}`);
    const installedRecord = getInstalledTranslations()[translationId];
    const contentHashMatch = !entry.contentHash
      || !installedRecord?.contentHash
      || entry.contentHash === installedRecord.contentHash;

    if (cachedContent?.books && Number(cachedContent.version) === Number(entry.version) && contentHashMatch) {
      entry.books = cachedContent.books;
      translationLibrary[translationId].books = cachedContent.books;
      offlineAvailableTranslations.add(translationId);
      return;
    }

    if (!entry.manifestUrl) {
      throw new Error(`No manifest URL is available for "${entry.label}".`);
    }

    const manifest = await fetchJson(entry.manifestUrl);
    const resolvedContentUrl = manifest.contentUrl ?? entry.contentUrl;

    if (!resolvedContentUrl) {
      throw new Error(`No content URL is available for "${entry.label}".`);
    }

    const content = await fetchJson(resolvedContentUrl);

    if (!validateTranslationData(content.books)) {
      throw new Error(`"${entry.label}" does not contain valid translation content.`);
    }

    const contentHash = typeof manifest.contentHash === "string" ? manifest.contentHash : buildContentHash(content.books);
    entry.version = Number(manifest.version) || entry.version;
    entry.books = content.books;
    entry.contentHash = contentHash;
    entry.bookOrder = typeof manifest.bookOrder === "string" ? manifest.bookOrder : entry.bookOrder;
    entry.features = manifest.features && typeof manifest.features === "object" ? manifest.features : entry.features;
    translationLibrary[translationId] = { ...translationLibrary[translationId], ...entry };

    await writeStoredValue(`${translationManifestCacheKeyPrefix}${translationId}`, manifest);
    await writeStoredValue(`${translationContentCacheKeyPrefix}${translationId}`, {
      schemaVersion: 1,
      translationId,
      version: entry.version,
      books: content.books
    });
    await writeInstalledRecord(translationId, entry, contentHash);
    offlineAvailableTranslations.add(translationId);
  };

  const populateTranslationSelect = () => {
    const current = translationSelect.value || getCurrentTranslationCode();
    translationSelect.innerHTML = "";

    const visibleEntries = Object.values(translationLibrary).sort((a, b) =>
      (a.label ?? a.code).localeCompare(b.label ?? b.code, undefined, { sensitivity: "base" })
    );
    const languages = new Set(visibleEntries.map((entry) => entry.languageTag).filter(Boolean));
    const showLanguage = languages.size > 1;
    const offline = !navigator.onLine;

    visibleEntries.forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.translationId;
      const baseLabel = entry.label ?? entry.code ?? entry.translationId;
      const labelWithLang = showLanguage && entry.languageTag ? `${baseLabel} (${entry.languageTag})` : baseLabel;

      if (offline && !offlineAvailableTranslations.has(entry.translationId)) {
        option.textContent = `${labelWithLang} — not downloaded`;
        option.disabled = true;
      } else {
        option.textContent = labelWithLang;
      }

      translationSelect.append(option);
    });

    const getMoreOption = document.createElement("option");
    getMoreOption.value = GET_MORE_TRANSLATIONS_VALUE;
    getMoreOption.textContent = "Get more translations…";
    translationSelect.append(getMoreOption);

    const preferred = translationLibrary[current] && !(offline && !offlineAvailableTranslations.has(current))
      ? current
      : null;
    const defaultTranslationId = getDefaultTranslationId();

    if (preferred) {
      translationSelect.value = preferred;
    } else if (translationLibrary[defaultTranslationId] && (!offline || offlineAvailableTranslations.has(defaultTranslationId))) {
      translationSelect.value = defaultTranslationId;
    } else {
      const fallback = visibleEntries.find((entry) => !offline || offlineAvailableTranslations.has(entry.translationId));
      translationSelect.value = fallback ? fallback.translationId : defaultTranslationId;
    }
  };


  const renderOfficialLanguageOptions = () => {
    const pillsContainer = document.querySelector("#translation-language-pills");
    if (!pillsContainer) {
      return;
    }

    const languages = getCatalogLanguageEntries();
    pillsContainer.innerHTML = "";

    languages.forEach((entry) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "translation-language-pill";
      button.textContent = entry.displayName;
      button.dataset.languageTag = entry.languageTag;
      button.setAttribute("aria-pressed", officialLanguageFilters.has(entry.languageTag) ? "true" : "false");

      button.addEventListener("click", () => {
        if (officialLanguageFilters.has(entry.languageTag)) {
          officialLanguageFilters.delete(entry.languageTag);
        } else {
          officialLanguageFilters.add(entry.languageTag);
        }
        button.setAttribute("aria-pressed", officialLanguageFilters.has(entry.languageTag) ? "true" : "false");
        void renderTranslationsPanel();
      });

      pillsContainer.append(button);
    });
  };

  const getOfficialDiscoveryEntries = async () => {
    const selectedTags = officialLanguageFilters.size > 0
      ? [...officialLanguageFilters]
      : getCatalogLanguageEntries().map((entry) => entry.languageTag);

    await Promise.all(selectedTags.map((languageTag) => ensureLanguageCatalogLoaded(languageTag)));

    const search = availableTranslationSearch.trim().toLowerCase();

    return [...catalogEntries.values()]
      .filter((entry) => entry.sourceType === OFFICIAL_SOURCE_TYPE || entry.sourceType === BUILTIN_SOURCE_TYPE)
      .filter((entry) => selectedTags.includes(entry.languageTag))
      .filter((entry) => !getInstalledTranslations()[entry.translationId])
      .filter((entry) =>
        !search
        || (entry.label ?? "").toLowerCase().includes(search)
        || (entry.code ?? "").toLowerCase().includes(search)
      )
      .sort((a, b) => (a.label ?? a.code).localeCompare(b.label ?? b.code, undefined, { sensitivity: "base" }));
  };

  const renderTranslationsPanel = async () => {
    const installedList = document.querySelector("#installed-translation-list");
    const installedEmptyNote = document.querySelector("#installed-translations-empty-note");
    const availableList = document.querySelector("#available-translation-list");
    const availableEmptyNote = document.querySelector("#available-translations-empty-note");

    if (!installedList || !availableList) {
      return;
    }

    renderOfficialLanguageOptions();

    // ── Installed ────────────────────────────────────────────────────────────
    installedList.innerHTML = "";
    const installedEntries = Object.values(translationLibrary)
      .sort((a, b) => (a.label ?? a.code).localeCompare(b.label ?? b.code, undefined, { sensitivity: "base" }));
    const onlyOne = installedEntries.length === 1;

    if (installedEmptyNote) {
      installedEmptyNote.hidden = installedEntries.length > 0;
    }

    installedEntries.forEach((entry) => {
      const li = document.createElement("li");
      li.className = "translation-list-item translation-list-item--actionable";

      const info = document.createElement("span");
      info.className = "translation-list-item-info";

      const codeEl = document.createElement("span");
      codeEl.className = "translation-list-item-code";
      codeEl.textContent = entry.code;

      const labelEl = document.createElement("span");
      labelEl.className = "translation-list-item-label";
      labelEl.textContent = entry.languageTag
        ? `${entry.label ?? entry.code} (${entry.languageTag})`
        : (entry.label ?? entry.code);

      const header = document.createElement("span");
      header.className = "translation-list-item-header";
      header.append(codeEl);
      info.append(header, labelEl);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-button ghost-button--danger ghost-button--small";
      button.dataset.uninstallTranslation = entry.translationId;
      button.textContent = "Uninstall";
      button.disabled = onlyOne;
      if (onlyOne) {
        button.title = "You must have at least one translation installed.";
      }

      li.append(info, button);
      installedList.append(li);
    });

    // ── Available ─────────────────────────────────────────────────────────────
    availableList.innerHTML = "";
    const availableEntries = await getOfficialDiscoveryEntries();

    if (availableEmptyNote) {
      availableEmptyNote.hidden = availableEntries.length > 0;
    }

    availableEntries.forEach((entry) => {
      const li = document.createElement("li");
      li.className = "translation-list-item translation-list-item--actionable";

      const info = document.createElement("span");
      info.className = "translation-list-item-info";

      const codeEl = document.createElement("span");
      codeEl.className = "translation-list-item-code";
      codeEl.textContent = entry.code;

      const labelEl = document.createElement("span");
      labelEl.className = "translation-list-item-label";
      labelEl.textContent = `${entry.label ?? entry.code} (${entry.languageTag})`;

      const header = document.createElement("span");
      header.className = "translation-list-item-header";
      header.append(codeEl);
      info.append(header, labelEl);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-button ghost-button--small";
      button.dataset.installOfficialTranslation = entry.translationId;
      button.textContent = "Install";

      li.append(info, button);
      availableList.append(li);
    });
  };

  const installOfficialTranslation = async (translationId) => {
    await ensureCatalogEntriesLoaded([translationId]);
    rebuildTranslationLibrary();
    await ensureTranslationLoaded(translationId);
    rebuildTranslationLibrary();
    await refreshOfflineTranslationAvailability();
    populateTranslationSelect();
    await renderTranslationsPanel();
  };

  const buildUserTranslationPackage = (rawPackage) => {
    if (!rawPackage || typeof rawPackage !== "object" || Array.isArray(rawPackage)) {
      throw new Error("Invalid translation package: expected a JSON object.");
    }

    const manifest = rawPackage.translation;
    const content = rawPackage.content;

    if (!manifest || typeof manifest !== "object" || !content || typeof content !== "object") {
      throw new Error("Invalid translation package: missing translation metadata or content.");
    }

    const translationId = typeof manifest.translationId === "string" && manifest.translationId
      ? manifest.translationId
      : null;

    if (!translationId || !translationId.startsWith("user:")) {
      throw new Error("User translations must use a translationId in the \"user:*\" namespace.");
    }

    if (!validateTranslationData(content.books)) {
      throw new Error("The translation package does not contain valid Bible content.");
    }

    const code = typeof manifest.code === "string" && manifest.code ? manifest.code : translationId.replace(/^user:/, "").toUpperCase();

    return {
      manifest: {
        schemaVersion: 1,
        translationId,
        code,
        label: typeof manifest.label === "string" && manifest.label ? manifest.label : code,
        languageTag: typeof manifest.languageTag === "string" && manifest.languageTag ? manifest.languageTag : "und",
        languageCode3: typeof manifest.languageCode3 === "string" && manifest.languageCode3 ? manifest.languageCode3 : null,
        sourceType: USER_SOURCE_TYPE,
        version: Number(manifest.version) || 1,
        copyright: typeof manifest.copyright === "string" ? manifest.copyright : null,
        bookOrder: typeof manifest.bookOrder === "string" ? manifest.bookOrder : null,
        features: manifest.features && typeof manifest.features === "object" ? manifest.features : {},
        contentHash: buildContentHash(content.books)
      },
      content: {
        schemaVersion: 1,
        translationId,
        version: Number(content.version) || Number(manifest.version) || 1,
        books: structuredClone(content.books)
      }
    };
  };

  const importTranslationFromFile = async (file) => {
    const text = await file.text();
    let rawPackage;

    try {
      rawPackage = JSON.parse(text);
    } catch (error) {
      throw new Error(`Could not parse JSON: ${error.message}`);
    }

    const translationPackage = buildUserTranslationPackage(rawPackage);
    const { manifest, content } = translationPackage;

    if (catalogEntries.has(manifest.translationId)) {
      throw new Error(`"${manifest.translationId}" is already defined by the catalog.`);
    }

    translationRegistry.userTranslations[manifest.translationId] = { manifest, content };
    translationRegistry.installedTranslations[manifest.translationId] = {
      sourceType: USER_SOURCE_TYPE,
      version: manifest.version,
      installedAt: new Date().toISOString(),
      contentHash: manifest.contentHash
    };
    await persistTranslationRegistry();
    await writeStoredValue(`${translationContentCacheKeyPrefix}${manifest.translationId}`, content);

    rebuildTranslationLibrary();
    await refreshOfflineTranslationAvailability();
    populateTranslationSelect();
    await renderTranslationsPanel();
    return manifest.translationId;
  };

  const uninstallTranslation = async (translationId) => {
    // Guard: never allow removing the last installed translation.
    if (Object.keys(translationRegistry.installedTranslations).length <= 1) {
      return;
    }

    const isUserTranslation = !!translationRegistry.userTranslations[translationId];
    if (isUserTranslation) {
      delete translationRegistry.userTranslations[translationId];
    }
    delete translationRegistry.installedTranslations[translationId];
    delete translationLibrary[translationId];

    await deleteStoredValue(`${translationContentCacheKeyPrefix}${translationId}`);
    await deleteStoredValue(`${translationManifestCacheKeyPrefix}${translationId}`);
    await persistTranslationRegistry();

    if (getCurrentTranslationCode() === translationId) {
      const fallback = getDefaultTranslationId();
      await applyTranslation(fallback);
      await writeStoredValue(translationStorageKey, fallback);
      await markRegistrySelection(fallback);
    }

    rebuildTranslationLibrary();
    await refreshOfflineTranslationAvailability();
    populateTranslationSelect();
    await renderTranslationsPanel();
  };

  const setOfficialLanguageSearch = (value) => {
    officialLanguageSearch = typeof value === "string" ? value : "";
  };

  const setOfficialLanguageFilters = async (values) => {
    officialLanguageFilters = new Set(values.filter(Boolean));
    await renderTranslationsPanel();
  };

  const clearOfficialLanguageFilters = async () => {
    officialLanguageFilters = new Set();
    await renderTranslationsPanel();
  };

  const setAvailableTranslationSearch = (value) => {
    availableTranslationSearch = typeof value === "string" ? value.trim().toLowerCase() : "";
    void renderTranslationsPanel();
  };

  const handleTranslationSelection = async (translationId) => {
    if (translationId !== GET_MORE_TRANSLATIONS_VALUE) {
      await markRegistrySelection(translationId);
      return true;
    }

    openOfficialTranslationsSettings();
    populateTranslationSelect();
    translationSelect.value = getCurrentTranslationCode() || getDefaultTranslationId();
    return false;
  };

  const getTranslationStateForBackup = () => ({
    installedOfficialIds: getInstalledOfficialIds(),
    userTranslations: getUserTranslations()
  });

  const restoreTranslationState = async (translationState = {}) => {
    const previousTranslationIds = new Set([
      ...Object.keys(translationRegistry.userTranslations ?? {}),
      ...Object.keys(translationRegistry.installedTranslations ?? {})
    ]);
    const nextUserTranslations = {};

    for (const rawPackage of translationState.userTranslations ?? []) {
      const translationPackage = buildUserTranslationPackage({
        translation: rawPackage.manifest ?? rawPackage.translation ?? rawPackage,
        content: rawPackage.content
      });
      nextUserTranslations[translationPackage.manifest.translationId] = translationPackage;
    }

    translationRegistry.userTranslations = nextUserTranslations;

    const officialIds = Array.isArray(translationState.installedOfficialIds)
      ? translationState.installedOfficialIds.filter((translationId) => typeof translationId === "string")
      : [];

    await ensureCatalogEntriesLoaded(officialIds);

    const nextInstalledTranslations = {};

    officialIds.forEach((translationId) => {
      const entry = getTranslationEntry(translationId);

      if (entry) {
        nextInstalledTranslations[translationId] = {
          sourceType: OFFICIAL_SOURCE_TYPE,
          version: entry.version,
          installedAt: new Date().toISOString(),
          contentHash: entry.contentHash ?? null
        };
      }
    });

    Object.values(nextUserTranslations).forEach(({ manifest }) => {
      nextInstalledTranslations[manifest.translationId] = {
        sourceType: USER_SOURCE_TYPE,
        version: manifest.version,
        installedAt: new Date().toISOString(),
        contentHash: manifest.contentHash ?? null
      };
    });

    translationRegistry.installedTranslations = nextInstalledTranslations;
    await persistTranslationRegistry();

    for (const translationId of previousTranslationIds) {
      if (!nextInstalledTranslations[translationId] && !nextUserTranslations[translationId]) {
        await deleteStoredValue(`${translationContentCacheKeyPrefix}${translationId}`);
        await deleteStoredValue(`${translationManifestCacheKeyPrefix}${translationId}`);
      }
    }

    for (const { manifest, content } of Object.values(nextUserTranslations)) {
      await writeStoredValue(`${translationContentCacheKeyPrefix}${manifest.translationId}`, content);
    }

    rebuildTranslationLibrary();
    await refreshOfflineTranslationAvailability();
    populateTranslationSelect();
    await renderTranslationsPanel();
  };

  const getTranslationStateForSync = () => ({
    installedOfficialIds: getInstalledOfficialIds()
  });

  const applySyncedTranslationState = async (translationState = {}) => {
    await restoreTranslationState({
      installedOfficialIds: translationState.installedOfficialIds ?? [],
      userTranslations: getUserTranslations()
    });
  };

  const clearTranslationState = async () => {
    const translationIds = new Set([
      ...Object.keys(translationRegistry?.installedTranslations ?? {}),
      ...Object.keys(translationRegistry?.userTranslations ?? {})
    ]);

    for (const translationId of translationIds) {
      await deleteStoredValue(`${translationContentCacheKeyPrefix}${translationId}`);
      await deleteStoredValue(`${translationManifestCacheKeyPrefix}${translationId}`);
    }

    translationRegistry = normalizeTranslationRegistry({});
    rebuildTranslationLibrary();
    offlineAvailableTranslations.clear();
    await persistTranslationRegistry();
  };

  // Auto-installs KJV for first-time users (installedTranslations empty after migration).
  // Does nothing if at least one translation is already installed.
  const autoInstallDefaultTranslation = async () => {
    if (Object.keys(translationRegistry.installedTranslations).length === 0) {
      await ensureCatalogEntriesLoaded(["en:KJV"]);
      await ensureTranslationLoaded("en:KJV");
      console.info("[Init] Auto-installed KJV as default translation.");
    }
  };

  // TODO: Remove migrateBuiltinBibles once enough time has passed that no user
  // would still have un-migrated "builtin" entries (~November 2026).
  const initializeTranslations = async () => {
    await loadTranslationRegistry();
    await migrateBuiltinBibles();
    await autoInstallDefaultTranslation();
    await ensureCatalogIndexLoaded();
    await ensureCatalogEntriesLoaded(getInstalledOfficialIds());
    rebuildTranslationLibrary();
  };

  return {
    GET_MORE_TRANSLATIONS_VALUE,
    offlineAvailableTranslations,
    validateTranslationData,
    initializeTranslations,
    refreshOfflineTranslationAvailability,
    ensureTranslationLoaded,
    populateTranslationSelect,
    renderTranslationsPanel,
    importTranslationFromFile,
    uninstallTranslation,
    installOfficialTranslation,
    setOfficialLanguageSearch,
    setOfficialLanguageFilters,
    clearOfficialLanguageFilters,
    setAvailableTranslationSearch,
    handleTranslationSelection,
    getDefaultTranslationId,
    getInstalledOfficialIds,
    getTranslationStateForBackup,
    restoreTranslationState,
    getTranslationStateForSync,
    applySyncedTranslationState,
    clearTranslationState
  };
};
