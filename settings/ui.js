window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createSettingsUi = (deps) => {
  // Renders the Sync & Backup summary card: provider, account, storage
  // location, and connection status.  Configuration itself happens in the
  // setup wizard (sync/setup-wizard.js).
  const renderCloudSummary = () => {
    const container = deps.cloudSyncSummaryContainer;

    if (!container) {
      return;
    }

    container.innerHTML = "";
    const activeProvider = deps.getActiveProvider();
    const isNullProvider = activeProvider.id === "none";

    const addRow = (label, value) => {
      const row = document.createElement("div");
      row.className = "cloud-sync-summary-row";

      const term = document.createElement("span");
      term.className = "cloud-sync-summary-label";
      term.textContent = label;

      const detail = document.createElement("span");
      detail.className = "cloud-sync-summary-value";
      detail.textContent = value;

      row.append(term, detail);
      container.append(row);
    };

    if (isNullProvider) {
      const empty = document.createElement("p");
      empty.className = "settings-copy";
      empty.textContent = "No sync & backup provider is configured. Your library lives only in this browser.";
      container.append(empty);
      return;
    }

    const currentSettings = deps.cloudSyncSettings.providerSettings[activeProvider.id] ?? {};
    const locationLabel = activeProvider.getLocationLabel?.(currentSettings) || "";
    const isLocalDrive = activeProvider.id === "local-drive";

    addRow("Provider", activeProvider.displayName);

    if (deps.cloudSyncSettings.connectedEmail) {
      addRow("Account", deps.cloudSyncSettings.connectedEmail);
    }

    addRow(
      isLocalDrive ? "Folder" : "Location",
      locationLabel || (isLocalDrive ? "No folder selected" : "App folder")
    );
    addRow("Status", deps.buildCloudStatusText());
  };

  const renderUiSettings = (container) => {
    container.innerHTML = "";

    const toggleSection = document.createElement("div");
    toggleSection.className = "ui-settings-section";

    const toggleTitle = document.createElement("p");
    toggleTitle.className = "ui-settings-section-title";
    toggleTitle.textContent = "Layout & Mode";
    toggleSection.append(toggleTitle);

    const toggleRow = document.createElement("div");
    toggleRow.className = "ui-toggle-row";

    const themeModeField = document.createElement("label");
    themeModeField.className = "ui-inline-select";

    const themeModeLabel = document.createElement("span");
    themeModeLabel.textContent = "Theme mode";

    const themeModeSelect = document.createElement("select");
    themeModeSelect.id = "ui-theme-mode-select";
    [
      { value: "system", label: "System" },
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" }
    ].forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.label;
      themeModeSelect.append(opt);
    });
    themeModeSelect.value = deps.getCurrentThemeMode();
    themeModeSelect.addEventListener("change", () => {
      deps.applyThemeMode(themeModeSelect.value, { persist: true, markChange: true });
    });
    themeModeField.append(themeModeLabel, themeModeSelect);
    toggleRow.append(themeModeField);

    const currentOrder = deps.paneGrid.dataset.order === "scripture-first" ? "scripture-first" : "notes-first";
    const paneBtn = document.createElement("button");
    paneBtn.type = "button";
    paneBtn.id = "ui-scripture-left-toggle";
    paneBtn.className = "ui-toggle-button";
    paneBtn.setAttribute("aria-pressed", String(currentOrder === "scripture-first"));
    paneBtn.innerHTML = `<span>Scripture left</span><span class="ui-toggle-state">${currentOrder === "scripture-first" ? "On" : "Off"}</span>`;
    paneBtn.addEventListener("click", () => {
      deps.togglePaneOrder();
    });
    toggleRow.append(paneBtn);
    toggleSection.append(toggleRow);
    container.append(toggleSection);

    const themeSection = document.createElement("div");
    themeSection.className = "ui-settings-section";

    const themeTitle = document.createElement("p");
    themeTitle.className = "ui-settings-section-title";
    themeTitle.textContent = "Color Theme";
    themeSection.append(themeTitle);

    const themeGrid = document.createElement("div");
    themeGrid.className = "theme-grid";

    deps.colorThemes.forEach((theme) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `theme-card${theme.id === deps.getCurrentColorThemeId() ? " is-active" : ""}`;
      card.dataset.themeId = theme.id;

      const swatch = document.createElement("div");
      swatch.className = "theme-swatch";
      theme.swatches.forEach((color) => {
        const dot = document.createElement("div");
        dot.className = "theme-swatch-color";
        dot.style.background = color;
        swatch.append(dot);
      });

      const name = document.createElement("p");
      name.className = "theme-card-name";
      name.textContent = theme.name;

      const meta = document.createElement("p");
      meta.className = "theme-card-meta";
      const modeLabel = theme.supports === "both" ? "Light & dark" : theme.supports === "dark" ? "Dark only" : "Light only";
      meta.textContent = modeLabel;

      const check = document.createElement("span");
      check.className = "theme-card-check";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";

      card.append(swatch, name, meta, check);
      card.addEventListener("click", () => {
        void deps.writeStoredValue(deps.colorThemeStorageKey, theme.id);
        deps.applyColorTheme(theme.id);
        deps.markLocalSettingsUpdated();
        deps.scheduleAutoCloudSync();
      });
      themeGrid.append(card);
    });

    themeSection.append(themeGrid);
    container.append(themeSection);
  };

  const renderSettings = () => {
    deps.settingsTabNav.innerHTML = "";
    deps.settingsTabs.forEach((tab) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `settings-tab-button${tab.id === deps.getActiveSettingsTabId() ? " is-active" : ""}`;
      button.dataset.settingsTab = tab.id;
      button.textContent = tab.label;
      deps.settingsTabNav.append(button);
    });

    deps.settingsPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.settingsPanel === deps.getActiveSettingsTabId());
    });

    const uiContent = document.querySelector("#ui-settings-content");

    if (uiContent) {
      renderUiSettings(uiContent);
    }

    deps.renderTranslationsPanel();

    const activeProvider = deps.getActiveProvider();
    deps.cloudPollIntervalSelect.value = String(deps.cloudSyncSettings.pollIntervalSeconds);
    renderCloudSummary();
    const isNullProvider = activeProvider.id === "none";
    const isLocalDrive = activeProvider.id === "local-drive";
    deps.cloudLastSyncInput.value = deps.formatSyncTimestamp(deps.cloudSyncSettings.lastSyncAt);
    const hasActiveStorageSession = activeProvider.hasActiveSession();

    deps.cloudSetupButton.textContent = isNullProvider
      ? "Set Up Synchronization…"
      : "Change Configuration…";

    if (isNullProvider) {
      deps.googleConnectButton.classList.add("is-hidden");
      deps.googleConnectButton.disabled = true;
      deps.googleDisconnectButton.classList.add("is-hidden");
      deps.googleDisconnectButton.disabled = true;
      deps.googleSyncNowButton.classList.add("is-hidden");
      deps.googleSyncNowButton.disabled = true;
    } else {
      // Reconnect appears only when a configured provider has lost its session
      // (e.g. expired token or, for Local Drive, a folder-permission lapse).
      deps.googleConnectButton.textContent = isLocalDrive ? "Grant Folder Access" : "Reconnect";
      deps.googleConnectButton.classList.toggle("is-hidden", hasActiveStorageSession);
      deps.googleConnectButton.disabled = hasActiveStorageSession || !activeProvider.isAvailable();
      deps.googleDisconnectButton.classList.toggle("is-hidden", !hasActiveStorageSession || isLocalDrive);
      deps.googleDisconnectButton.disabled = !hasActiveStorageSession;
      deps.googleSyncNowButton.classList.toggle("is-hidden", !hasActiveStorageSession);
      deps.googleSyncNowButton.disabled = !hasActiveStorageSession;
    }

    const selectedType = deps.getSelectedTypeForManager();

    if (!selectedType) {
      deps.typeEditorEmpty.hidden = false;
      deps.typeEditorForm.hidden = true;
      return;
    }

    deps.typeEditorEmpty.hidden = true;
    deps.typeEditorForm.hidden = false;
    deps.typeSelect.innerHTML = "";
    deps.workspace.noteTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.name;
      deps.typeSelect.append(option);
    });
    deps.typeSelect.value = selectedType.id;
    deps.typeNameInput.value = selectedType.name;
    deps.metadataFieldList.innerHTML = "";
    deps.cardTitleFieldSelect.innerHTML = "";
    deps.cardSubtitleFieldSelect.innerHTML = "";

    const noPrimaryOption = document.createElement("option");
    noPrimaryOption.value = "";
    noPrimaryOption.textContent = "None (use date)";
    deps.cardTitleFieldSelect.append(noPrimaryOption);

    const noneOption = document.createElement("option");
    noneOption.value = "";
    noneOption.textContent = "None";
    deps.cardSubtitleFieldSelect.append(noneOption);

    selectedType.fields.forEach((field) => {
      const titleOption = document.createElement("option");
      titleOption.value = field.id;
      titleOption.textContent = field.label;
      deps.cardTitleFieldSelect.append(titleOption);

      const subtitleOption = document.createElement("option");
      subtitleOption.value = field.id;
      subtitleOption.textContent = field.label;
      deps.cardSubtitleFieldSelect.append(subtitleOption);
    });

    deps.cardTitleFieldSelect.value = selectedType.cardTitleFieldId ?? "";
    deps.cardSubtitleFieldSelect.value = selectedType.cardSubtitleFieldId ?? "";

    selectedType.fields.forEach((field) => {
      const row = document.createElement("div");
      row.className = "metadata-field-row";
      row.dataset.fieldId = field.id;

      const labelField = document.createElement("label");
      labelField.className = "field";

      const labelTitle = document.createElement("span");
      labelTitle.textContent = "Label";

      const labelInput = document.createElement("input");
      labelInput.type = "text";
      labelInput.value = field.label;
      labelInput.dataset.fieldProp = "label";
      labelInput.dataset.fieldId = field.id;

      labelField.append(labelTitle, labelInput);

      const placeholderField = document.createElement("label");
      placeholderField.className = "field";

      const placeholderTitle = document.createElement("span");
      placeholderTitle.textContent = "Placeholder";

      const placeholderInput = document.createElement("input");
      placeholderInput.type = "text";
      placeholderInput.value = field.placeholder;
      placeholderInput.dataset.fieldProp = "placeholder";
      placeholderInput.dataset.fieldId = field.id;

      placeholderField.append(placeholderTitle, placeholderInput);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "ghost-button";
      removeButton.dataset.removeField = field.id;
      removeButton.textContent = "Remove";

      row.append(labelField, placeholderField, removeButton);
      deps.metadataFieldList.append(row);
    });

    deps.aliasList.innerHTML = "";

    Object.keys(deps.getCurrentTranslation()?.books ?? {}).forEach((book) => {
      const row = document.createElement("div");
      row.className = "alias-row";

      const bookName = document.createElement("p");
      bookName.className = "alias-book";
      bookName.textContent = book;

      const aliasField = document.createElement("label");
      aliasField.className = "field";

      const aliasLabel = document.createElement("span");
      aliasLabel.textContent = "Aliases";

      const aliasInput = document.createElement("input");
      aliasInput.type = "text";
      aliasInput.dataset.aliasBook = book;
      aliasInput.placeholder = "Jn, Jon";
      aliasInput.value = deps.getEffectiveAliasesForBook(book).join(", ");

      aliasField.append(aliasLabel, aliasInput);
      row.append(bookName, aliasField);
      deps.aliasList.append(row);
    });
  };

  return {
    renderSettings
  };
};
