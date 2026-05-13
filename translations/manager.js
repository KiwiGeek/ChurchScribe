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
    downloadAllTranslationsButton,
    downloadAllTranslationsStatus,
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

  let downloadAllTranslationsInFlight = false;
  let catalogIndex = null;
  let translationRegistry = null;
  let officialLanguageSearch = "";
  let officialLanguageFilters = new Set();
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
    catalogIndex?.defaultBuiltinIds?.[0]
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
      hasUpdate: !!existingInstalled && existingInstalled.version < (Number(entry.version) || 1)
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

  // Migration: any previously-bundled bible the user had downloaded is recorded in
  // installedTranslations with sourceType "builtin". Now that only KJV is bundled,
  // those entries must become "official" so they stay visible in the selector.
  // This is naturally idempotent — once promoted there are no "builtin" entries left
  // (other than KJV, which remains bundled and is skipped).
  // TODO: Remove this function and its call in initializeTranslations once enough time
  // has passed that no user would still have un-migrated "builtin" entries (~November 2026).
  const migrateBuiltinBibles = async () => {
    const entries = Object.entries(translationRegistry.installedTranslations);
    const toPromote = entries.filter(
      ([translationId, record]) => record.sourceType === BUILTIN_SOURCE_TYPE && translationId !== "en:KJV"
    );

    if (toPromote.length === 0) {
      return;
    }

    for (const [translationId, record] of toPromote) {
      record.sourceType = OFFICIAL_SOURCE_TYPE;
      console.info(`[Migration] Promoted "${translationId}" from builtin to Added bible.`);
    }

    await persistTranslationRegistry();
  };

  const ensureCatalogIndexLoaded = async () => {
    if (catalogIndex) {
      return catalogIndex;
    }

    catalogIndex = await fetchJson(CATALOG_INDEX_URL);
    officialLanguageFilters = new Set(translationRegistry?.officialLanguageFilters ?? []);
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

  const getVisibleTranslationIds = () => {
    const builtinIds = catalogIndex?.defaultBuiltinIds ?? [];
    const officialIds = getInstalledOfficialIds();
    const userIds = Object.keys(translationRegistry?.userTranslations ?? {});
    return [...new Set([...builtinIds, ...officialIds, ...userIds])];
  };

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
    translationRegistry.installedTranslations[translationId] = {
      sourceType: entry.sourceType,
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

    if (cachedContent?.books && Number(cachedContent.version) === Number(entry.version)) {
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

  const refreshDownloadAllTranslationsUi = () => {
    if (!downloadAllTranslationsButton || !downloadAllTranslationsStatus) {
      return;
    }

    const builtinIds = catalogIndex?.defaultBuiltinIds ?? [];
    const missing = builtinIds.filter((translationId) => !offlineAvailableTranslations.has(translationId));
    const offline = !navigator.onLine;

    if (downloadAllTranslationsInFlight) {
      return;
    }

    if (missing.length === 0) {
      downloadAllTranslationsButton.disabled = true;
      downloadAllTranslationsButton.textContent = "All downloaded";
      downloadAllTranslationsStatus.textContent = `${builtinIds.length} of ${builtinIds.length} available offline.`;
      return;
    }

    downloadAllTranslationsButton.textContent = "Download all for offline use";

    if (offline) {
      downloadAllTranslationsButton.disabled = true;
      downloadAllTranslationsStatus.textContent = `You're offline — ${missing.length} of ${builtinIds.length} not yet downloaded. Reconnect to download the rest.`;
      return;
    }

    downloadAllTranslationsButton.disabled = false;
    downloadAllTranslationsStatus.textContent = `${builtinIds.length - missing.length} of ${builtinIds.length} available offline.`;
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

    const builtinIds = catalogIndex?.defaultBuiltinIds ?? [];
    const missing = builtinIds.filter((translationId) => !offlineAvailableTranslations.has(translationId));

    if (missing.length === 0) {
      return;
    }

    downloadAllTranslationsInFlight = true;

    if (downloadAllTranslationsButton) {
      downloadAllTranslationsButton.disabled = true;
    }

    let succeeded = 0;
    let failed = 0;

    for (let index = 0; index < missing.length; index += 1) {
      const translationId = missing[index];
      const entry = getTranslationEntry(translationId);

      if (downloadAllTranslationsButton) {
        downloadAllTranslationsButton.textContent = `Downloading ${index + 1} of ${missing.length}…`;
      }

      if (downloadAllTranslationsStatus) {
        downloadAllTranslationsStatus.textContent = `Downloading ${entry?.label ?? translationId}…`;
      }

      try {
        await ensureTranslationLoaded(translationId);
        succeeded += 1;
      } catch (error) {
        console.warn(`[Translation] Bulk download failed for "${translationId}":`, error);
        failed += 1;
      }
    }

    downloadAllTranslationsInFlight = false;
    populateTranslationSelect();
    renderTranslationsPanel();

    if (downloadAllTranslationsStatus) {
      downloadAllTranslationsStatus.textContent = failed === 0
        ? `Downloaded ${succeeded} translation${succeeded === 1 ? "" : "s"}. All available offline.`
        : `Downloaded ${succeeded}, failed ${failed}. Click again to retry.`;
    }

    refreshDownloadAllTranslationsUi();
  };

  const renderOfficialLanguageOptions = () => {
    const select = document.querySelector("#official-translation-language-filter");

    if (!select) {
      return;
    }

    const search = officialLanguageSearch.trim().toLowerCase();
    const languages = getCatalogLanguageEntries().filter((entry) =>
      !search
      || entry.displayName.toLowerCase().includes(search)
      || entry.languageTag.toLowerCase().includes(search)
    );

    select.innerHTML = "";
    languages.forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.languageTag;
      option.textContent = `${entry.displayName} (${entry.languageTag})`;
      option.selected = officialLanguageFilters.has(entry.languageTag);
      select.append(option);
    });
  };

  const getOfficialDiscoveryEntries = async () => {
    const selectedTags = officialLanguageFilters.size > 0
      ? [...officialLanguageFilters]
      : getCatalogLanguageEntries().map((entry) => entry.languageTag);

    await Promise.all(selectedTags.map((languageTag) => ensureLanguageCatalogLoaded(languageTag)));

    return [...catalogEntries.values()]
      .filter((entry) => entry.sourceType === OFFICIAL_SOURCE_TYPE)
      .filter((entry) => selectedTags.includes(entry.languageTag))
      .sort((a, b) => (a.label ?? a.code).localeCompare(b.label ?? b.code, undefined, { sensitivity: "base" }));
  };

  const renderTranslationsPanel = async () => {
    const builtinList = document.querySelector("#builtin-translation-list");
    const officialList = document.querySelector("#official-translation-list");
    const officialEmptyNote = document.querySelector("#official-translations-empty-note");
    const userList = document.querySelector("#user-translation-list");
    const userEmptyNote = document.querySelector("#user-translations-empty-note");

    if (!builtinList || !officialList || !userList || !userEmptyNote) {
      return;
    }

    renderOfficialLanguageOptions();

    builtinList.innerHTML = "";
    (catalogIndex?.defaultBuiltinIds ?? [])
      .map((translationId) => getTranslationEntry(translationId))
      .filter(Boolean)
      .sort((a, b) => (a.label ?? a.code).localeCompare(b.label ?? b.code, undefined, { sensitivity: "base" }))
      .forEach((entry) => {
        const li = document.createElement("li");
        li.className = "translation-list-item";

        const info = document.createElement("span");
        info.className = "translation-list-item-info";

        const codeEl = document.createElement("span");
        codeEl.className = "translation-list-item-code";
        codeEl.textContent = entry.code;

        const labelEl = document.createElement("span");
        labelEl.className = "translation-list-item-label";
        labelEl.textContent = entry.label;

        const tag = document.createElement("span");
        tag.className = "translation-list-item-tag";

        if (entry.hasUpdate) {
          tag.textContent = "Update available";
          tag.dataset.state = "missing";
        } else if (offlineAvailableTranslations.has(entry.translationId)) {
          tag.textContent = "Downloaded";
          tag.dataset.state = "downloaded";
        } else {
          tag.textContent = "Not downloaded";
          tag.dataset.state = "missing";
        }

        const header = document.createElement("span");
        header.className = "translation-list-item-header";
        header.append(codeEl, tag);
        info.append(header, labelEl);
        li.append(info);
        builtinList.append(li);
      });

    refreshDownloadAllTranslationsUi();

    officialList.innerHTML = "";
    const officialEntries = await getOfficialDiscoveryEntries();

    if (officialEmptyNote) {
      officialEmptyNote.hidden = officialEntries.length > 0;
    }

    officialEntries.forEach((entry) => {
      const li = document.createElement("li");
      li.className = "translation-list-item translation-list-item--actionable";

      const info = document.createElement("span");
      info.className = "translation-list-item-info";

      const codeEl = document.createElement("span");
      codeEl.className = "translation-list-item-code";
      codeEl.textContent = entry.code;

      const labelEl = document.createElement("span");
      labelEl.className = "translation-list-item-label";
      labelEl.textContent = `${entry.label} (${entry.languageTag})`;

      const tag = document.createElement("span");
      tag.className = "translation-list-item-tag";

      if (entry.hasUpdate) {
        tag.textContent = "Update available";
        tag.dataset.state = "missing";
      } else if (getInstalledTranslations()[entry.translationId]) {
        tag.textContent = "Added";
        tag.dataset.state = "downloaded";
      } else {
        tag.textContent = "Available";
        tag.dataset.state = "available";
      }

      const header = document.createElement("span");
      header.className = "translation-list-item-header";
      header.append(codeEl, tag);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-button ghost-button--small";
      button.dataset.installOfficialTranslation = entry.translationId;
      button.textContent = getInstalledTranslations()[entry.translationId] ? (entry.hasUpdate ? "Update" : "Added") : "Add";
      button.disabled = !!getInstalledTranslations()[entry.translationId] && !entry.hasUpdate;

      info.append(header, labelEl);
      li.append(info, button);
      officialList.append(li);
    });

    userList.innerHTML = "";
    const userTranslations = getUserTranslations();
    userEmptyNote.hidden = userTranslations.length > 0;

    userTranslations.forEach((entry) => {
      const li = document.createElement("li");
      li.className = "translation-list-item";

      const info = document.createElement("span");
      info.className = "translation-list-item-info";

      const codeEl = document.createElement("span");
      codeEl.className = "translation-list-item-code";
      codeEl.textContent = entry.code;

      const labelEl = document.createElement("span");
      labelEl.className = "translation-list-item-label";
      labelEl.textContent = `${entry.label} (${entry.languageTag})`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-button ghost-button--danger ghost-button--small";
      button.dataset.deleteTranslation = entry.translationId;
      button.textContent = "Delete";

      info.append(codeEl, labelEl);
      li.append(info, button);
      userList.append(li);
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

    if (catalogEntries.has(manifest.translationId) || (catalogIndex?.defaultBuiltinIds ?? []).includes(manifest.translationId)) {
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

  const deleteCustomTranslation = async (translationId) => {
    if (!translationRegistry.userTranslations[translationId]) {
      return;
    }

    delete translationRegistry.userTranslations[translationId];
    delete translationRegistry.installedTranslations[translationId];
    delete translationLibrary[translationId];
    await deleteStoredValue(`${translationContentCacheKeyPrefix}${translationId}`);
    await deleteStoredValue(`${translationManifestCacheKeyPrefix}${translationId}`);
    await persistTranslationRegistry();

    const fallbackTranslationId = getDefaultTranslationId();

    if (getCurrentTranslationCode() === translationId) {
      await applyTranslation(fallbackTranslationId);
      await writeStoredValue(translationStorageKey, fallbackTranslationId);
      await markRegistrySelection(fallbackTranslationId);
    }

    rebuildTranslationLibrary();
    await refreshOfflineTranslationAvailability();
    populateTranslationSelect();
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

    await ensureCatalogEntriesLoaded([
      ...(catalogIndex?.defaultBuiltinIds ?? []),
      ...officialIds
    ]);

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

  // TODO: Remove migrateBuiltinBibles and the PREVIOUSLY_BUNDLED_IDS / MIGRATION_BUNDLED_TO_OFFICIAL
  // constants once enough time has passed that no user would still have the old bundled bibles
  // in their cache without having run the migration (~November 2026).
  const initializeTranslations = async () => {
    await loadTranslationRegistry();
    await migrateBuiltinBibles();
    await ensureCatalogIndexLoaded();
    await ensureCatalogEntriesLoaded([
      ...(catalogIndex?.defaultBuiltinIds ?? []),
      ...getInstalledOfficialIds()
    ]);
    rebuildTranslationLibrary();
  };

  if (downloadAllTranslationsButton) {
    downloadAllTranslationsButton.addEventListener("click", () => {
      void downloadAllBuiltinTranslations();
    });
  }

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
    deleteCustomTranslation,
    installOfficialTranslation,
    setOfficialLanguageSearch,
    setOfficialLanguageFilters,
    clearOfficialLanguageFilters,
    handleTranslationSelection,
    downloadAllBuiltinTranslations,
    refreshDownloadAllTranslationsUi,
    getDefaultTranslationId,
    getInstalledOfficialIds,
    getTranslationStateForBackup,
    restoreTranslationState,
    getTranslationStateForSync,
    applySyncedTranslationState,
    clearTranslationState
  };
};
