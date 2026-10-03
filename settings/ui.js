window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createSettingsUi = (deps) => {
  // Persist picker filters across settings re-renders within the session.
  let themeSupportFilter = "all";
  let themeMoodFilter = "all";

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

    const appearanceSection = document.createElement("div");
    appearanceSection.className = "ui-settings-section";

    const appearanceTitle = document.createElement("p");
    appearanceTitle.className = "ui-settings-section-title";
    appearanceTitle.textContent = "Appearance";
    appearanceSection.append(appearanceTitle);

    const appearanceRow = document.createElement("div");
    appearanceRow.className = "ui-toggle-row";

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
    appearanceRow.append(themeModeField);
    appearanceSection.append(appearanceRow);
    container.append(appearanceSection);

    const layoutSection = document.createElement("div");
    layoutSection.className = "ui-settings-section";

    const layoutTitle = document.createElement("p");
    layoutTitle.className = "ui-settings-section-title";
    layoutTitle.textContent = "Layout";
    layoutSection.append(layoutTitle);

    const layoutCopy = document.createElement("p");
    layoutCopy.className = "settings-copy";
    layoutCopy.textContent = "Choose which pane sits on the left, or hide the editor for scripture-only reading.";
    layoutSection.append(layoutCopy);

    const layoutRow = document.createElement("div");
    layoutRow.className = "ui-toggle-row";

    const layoutField = document.createElement("label");
    layoutField.className = "ui-inline-select";

    const layoutLabel = document.createElement("span");
    layoutLabel.textContent = "Panes";

    const layoutSelect = document.createElement("select");
    layoutSelect.id = "ui-scripture-layout-select";
    [
      { value: "notes-left", label: "Notes left" },
      { value: "scripture-left", label: "Scripture left" },
      { value: "scripture-only", label: "Scripture only" }
    ].forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.label;
      layoutSelect.append(opt);
    });

    const currentLayoutMode = typeof deps.getScriptureLayoutMode === "function"
      ? deps.getScriptureLayoutMode()
      : (deps.paneGrid.classList.contains("is-scripture-only")
        ? "scripture-only"
        : deps.paneGrid.dataset.order === "scripture-first"
          ? "scripture-left"
          : "notes-left");
    layoutSelect.value = currentLayoutMode;
    layoutSelect.addEventListener("change", () => {
      deps.setScriptureLayoutMode(layoutSelect.value);
    });
    layoutField.append(layoutLabel, layoutSelect);
    layoutRow.append(layoutField);
    layoutSection.append(layoutRow);
    container.append(layoutSection);

    const viewSection = document.createElement("div");
    viewSection.className = "ui-settings-section";

    const viewTitle = document.createElement("p");
    viewTitle.className = "ui-settings-section-title";
    viewTitle.textContent = "Device view";
    viewSection.append(viewTitle);

    const viewCopy = document.createElement("p");
    viewCopy.className = "settings-copy";
    viewCopy.textContent = "Use the compact mobile shell instead of this full editor. Your choice is remembered on this device.";
    viewSection.append(viewCopy);

    const mobileViewButton = document.createElement("button");
    mobileViewButton.type = "button";
    mobileViewButton.className = "about-link about-link--block";
    mobileViewButton.id = "switch-to-mobile-view";
    mobileViewButton.textContent = "Switch to mobile view";
    mobileViewButton.addEventListener("click", () => {
      if (typeof window.ScriptoriaModules.navigateToView === "function") {
        window.ScriptoriaModules.navigateToView("mobile");
        return;
      }
      try {
        localStorage.setItem("service-notes-view-preference", "mobile");
      } catch {
        // Ignore storage failures; still navigate.
      }
      window.location.assign("mobile.html");
    });
    viewSection.append(mobileViewButton);
    container.append(viewSection);

    const themeCatalog = window.ScriptoriaModules;
    if (typeof themeCatalog.enrichColorThemes === "function") {
      themeCatalog.enrichColorThemes(deps.colorThemes);
    }

    const parseHexColor = (value) => {
      if (typeof value !== "string") return null;
      let hex = value.trim().replace("#", "");
      if (hex.length === 3) {
        hex = hex.split("").map((part) => part + part).join("");
      }
      if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
      return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16)
      };
    };

    const toRgba = (color, alpha) => `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

    const mixHex = (a, b, amount) => {
      const mix = (from, to) => Math.round(from + (to - from) * amount);
      return `#${[mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b)]
        .map((channel) => channel.toString(16).padStart(2, "0"))
        .join("")}`;
    };

    const themeLooksDark = (theme) => {
      if (theme.supports === "dark") return true;
      if (theme.supports === "light") return false;
      const surface = parseHexColor((theme.swatches || [])[0]);
      if (!surface) return false;
      return (0.2126 * surface.r + 0.7152 * surface.g + 0.0722 * surface.b) / 255 < 0.42;
    };

    const createThemePreview = (theme, { size = "card" } = {}) => {
      const swatches = theme.swatches || [];
      const surface = parseHexColor(swatches[0]) || { r: 245, g: 245, b: 245 };
      const accent = parseHexColor(swatches[1]) || { r: 120, g: 90, b: 60 };
      const panel = parseHexColor(swatches[2]) || surface;
      const ink = parseHexColor(swatches[3]) || (themeLooksDark(theme)
        ? { r: 230, g: 230, b: 230 }
        : { r: 30, g: 30, b: 30 });
      const dark = themeLooksDark(theme);
      const pageBg = dark
        ? `radial-gradient(ellipse 80% 55% at 12% 0%, ${toRgba(accent, 0.34)} 0%, transparent 55%), linear-gradient(155deg, ${mixHex(surface, { r: 0, g: 0, b: 0 }, 0.12)} 0%, ${mixHex(surface, accent, 0.16)} 55%, ${mixHex(surface, accent, 0.08)} 100%)`
        : `radial-gradient(ellipse 90% 60% at 8% 0%, ${toRgba(accent, 0.22)} 0%, transparent 52%), linear-gradient(155deg, ${mixHex(surface, { r: 255, g: 255, b: 255 }, 0.35)} 0%, ${mixHex(surface, accent, 0.1)} 50%, ${mixHex(panel, accent, 0.12)} 100%)`;
      const panelFill = dark
        ? mixHex(panel, { r: 0, g: 0, b: 0 }, 0.18)
        : mixHex(panel, { r: 255, g: 255, b: 255 }, 0.55);
      const muted = toRgba(ink, dark ? 0.42 : 0.28);

      const preview = document.createElement("div");
      preview.className = `theme-preview theme-preview--${size}`;
      preview.setAttribute("aria-hidden", "true");
      preview.style.setProperty("--tp-bg", pageBg);
      preview.style.setProperty("--tp-surface", panelFill);
      preview.style.setProperty("--tp-accent", `#${[accent.r, accent.g, accent.b].map((n) => n.toString(16).padStart(2, "0")).join("")}`);
      preview.style.setProperty("--tp-text", `#${[ink.r, ink.g, ink.b].map((n) => n.toString(16).padStart(2, "0")).join("")}`);
      preview.style.setProperty("--tp-muted", muted);
      preview.style.setProperty("--tp-border", toRgba(ink, dark ? 0.18 : 0.12));

      preview.innerHTML = `
        <div class="theme-preview-chrome">
          <span class="theme-preview-brand"></span>
          <span class="theme-preview-actions">
            <i></i><i></i>
          </span>
        </div>
        <div class="theme-preview-panes">
          <div class="theme-preview-pane">
            <span class="theme-preview-line"></span>
            <span class="theme-preview-line theme-preview-line--mid"></span>
            <span class="theme-preview-line theme-preview-line--short"></span>
            <span class="theme-preview-line"></span>
          </div>
          <div class="theme-preview-pane theme-preview-pane--scripture">
            <span class="theme-preview-verse"><i></i><b></b></span>
            <span class="theme-preview-verse"><i></i><b></b></span>
            <span class="theme-preview-verse"><i></i><b class="theme-preview-line--short"></b></span>
          </div>
        </div>
      `;
      return preview;
    };

    const fillThemeSample = (sampleRoot, theme) => {
      if (!sampleRoot || !theme) return;
      sampleRoot.replaceChildren();

      const frame = document.createElement("div");
      frame.className = "theme-sample-frame";
      frame.append(createThemePreview(theme, { size: "hero" }));

      const caption = document.createElement("div");
      caption.className = "theme-sample-caption";

      const title = document.createElement("p");
      title.className = "theme-sample-name";
      title.textContent = theme.name;

      const detail = document.createElement("p");
      detail.className = "theme-sample-meta";
      const modeLabel = theme.supports === "both"
        ? "Light & dark"
        : theme.supports === "dark"
          ? "Dark only"
          : "Light only";
      detail.textContent = `${modeLabel} · sample layout`;

      caption.append(title, detail);
      sampleRoot.append(frame, caption);
      sampleRoot.dataset.themeId = theme.id;
    };

    const createThemeCard = (theme, { syncRoots = [], sampleRoot = null, size = "card" } = {}) => {
      const isActive = theme.id === deps.getCurrentColorThemeId();
      const card = document.createElement("button");
      card.type = "button";
      card.className = `theme-card${isActive ? " is-active" : ""}`;
      card.dataset.themeId = theme.id;
      card.setAttribute("aria-pressed", String(isActive));

      const preview = createThemePreview(theme, { size });

      const swatch = document.createElement("div");
      swatch.className = "theme-swatch";
      (theme.swatches || []).forEach((color) => {
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
      card.setAttribute("aria-label", `${theme.name}, ${modeLabel}. Hover to preview sample.`);

      const check = document.createElement("span");
      check.className = "theme-card-check";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";

      card.append(preview, swatch, name, meta, check);

      const showSample = () => fillThemeSample(sampleRoot, theme);
      card.addEventListener("pointerenter", showSample);
      card.addEventListener("focus", showSample);

      card.addEventListener("click", () => {
        void deps.writeStoredValue(deps.colorThemeStorageKey, theme.id);
        deps.applyColorTheme(theme.id);
        fillThemeSample(sampleRoot, theme);
        syncRoots.forEach((root) => {
          root.querySelectorAll(".theme-card").forEach((el) => {
            const active = el.dataset.themeId === theme.id;
            el.classList.toggle("is-active", active);
            el.setAttribute("aria-pressed", String(active));
          });
        });
        deps.markLocalSettingsUpdated();
        deps.scheduleAutoCloudSync();
      });
      return card;
    };

    const createFilterGroup = (label, options, selected, onSelect) => {
      const group = document.createElement("div");
      group.className = "theme-filter-group";
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", label);

      const caption = document.createElement("span");
      caption.className = "theme-filter-label";
      caption.textContent = label;
      group.append(caption);

      const chips = document.createElement("div");
      chips.className = "theme-filter-chips";

      options.forEach((option) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `theme-filter-chip${option.value === selected ? " is-active" : ""}`;
        chip.setAttribute("aria-pressed", String(option.value === selected));
        chip.textContent = option.label;
        chip.addEventListener("click", () => {
          onSelect(option.value);
          renderUiSettings(container);
        });
        chips.append(chip);
      });

      group.append(chips);
      return group;
    };

    const themeSection = document.createElement("div");
    themeSection.className = "ui-settings-section";

    const themeTitle = document.createElement("p");
    themeTitle.className = "ui-settings-section-title";
    themeTitle.textContent = "Color Theme";
    themeSection.append(themeTitle);

    const themeCopy = document.createElement("p");
    themeCopy.className = "settings-copy";
    themeCopy.textContent = "Hover a theme for a larger sample, then click to apply.";
    themeSection.append(themeCopy);

    const filteredThemes = typeof themeCatalog.filterColorThemes === "function"
      ? themeCatalog.filterColorThemes(deps.colorThemes, {
        support: themeSupportFilter,
        mood: themeMoodFilter
      })
      : deps.colorThemes;

    const featuredThemes = (typeof themeCatalog.getFeaturedThemes === "function"
      ? themeCatalog.getFeaturedThemes(deps.colorThemes)
      : deps.colorThemes.filter((theme) => theme.featured))
      .filter((theme) => filteredThemes.some((candidate) => candidate.id === theme.id));

    const sample = document.createElement("div");
    sample.className = "theme-sample";
    sample.setAttribute("aria-live", "polite");
    const activeTheme = deps.colorThemes.find((theme) => theme.id === deps.getCurrentColorThemeId())
      || featuredThemes[0]
      || filteredThemes[0]
      || deps.colorThemes[0];
    fillThemeSample(sample, activeTheme);
    themeSection.append(sample);

    const filterBar = document.createElement("div");
    filterBar.className = "theme-filter-bar";
    filterBar.append(
      createFilterGroup(
        "Support",
        [
          { value: "all", label: "All" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
          { value: "both", label: "Light & dark" }
        ],
        themeSupportFilter,
        (value) => { themeSupportFilter = value; }
      ),
      createFilterGroup(
        "Mood",
        [
          { value: "all", label: "All" },
          { value: "warm", label: "Warm" },
          { value: "cool", label: "Cool" },
          { value: "bold", label: "Bold" },
          { value: "minimal", label: "Minimal" }
        ],
        themeMoodFilter,
        (value) => { themeMoodFilter = value; }
      )
    );
    themeSection.append(filterBar);

    const featuredGrid = document.createElement("div");
    featuredGrid.className = "theme-grid theme-grid--featured";
    const allGrid = document.createElement("div");
    allGrid.className = "theme-grid";
    const syncRoots = [featuredGrid, allGrid];

    const restoreActiveSample = () => {
      const activeId = deps.getCurrentColorThemeId();
      const nextTheme = deps.colorThemes.find((entry) => entry.id === activeId) || activeTheme;
      fillThemeSample(sample, nextTheme);
    };

    const bindSampleRestore = (root) => {
      root.addEventListener("pointerleave", (event) => {
        if (root.contains(event.relatedTarget)) return;
        restoreActiveSample();
      });
      root.addEventListener("focusout", (event) => {
        if (root.contains(event.relatedTarget)) return;
        // Keep the hovered sample if the pointer is still over a card.
        if (root.querySelector(".theme-card:hover")) return;
        restoreActiveSample();
      });
    };

    bindSampleRestore(featuredGrid);
    bindSampleRestore(allGrid);

    if (featuredThemes.length > 0 && themeMoodFilter === "all") {
      const featuredTitle = document.createElement("p");
      featuredTitle.className = "theme-subsection-title";
      featuredTitle.textContent = "Featured";
      themeSection.append(featuredTitle);

      featuredThemes.forEach((theme) => {
        featuredGrid.append(createThemeCard(theme, {
          syncRoots,
          sampleRoot: sample,
          size: "featured"
        }));
      });
      themeSection.append(featuredGrid);
    }

    const allTitle = document.createElement("p");
    allTitle.className = "theme-subsection-title";
    allTitle.textContent = themeMoodFilter === "all" && themeSupportFilter === "all"
      ? "All themes"
      : `${filteredThemes.length} match${filteredThemes.length === 1 ? "" : "es"}`;
    themeSection.append(allTitle);

    if (filteredThemes.length === 0) {
      const empty = document.createElement("p");
      empty.className = "settings-copy";
      empty.textContent = "No themes match these filters.";
      themeSection.append(empty);
    } else {
      filteredThemes.forEach((theme) => {
        allGrid.append(createThemeCard(theme, {
          syncRoots,
          sampleRoot: sample,
          size: "card"
        }));
      });
      themeSection.append(allGrid);
    }

    container.append(themeSection);
  };

  const renderSettings = () => {
    deps.settingsTabNav.innerHTML = "";
    deps.settingsTabs.forEach((tab) => {
      const isActive = tab.id === deps.getActiveSettingsTabId();
      const button = document.createElement("button");
      button.type = "button";
      button.className = `settings-tab-button${isActive ? " is-active" : ""}`;
      button.dataset.settingsTab = tab.id;
      button.setAttribute("aria-selected", String(isActive));
      button.textContent = tab.label;
      deps.settingsTabNav.append(button);
    });

    deps.settingsPanels.forEach((panel) => {
      const isActive = panel.dataset.settingsPanel === deps.getActiveSettingsTabId();
      panel.classList.toggle("is-active", isActive);
      panel.toggleAttribute("hidden", !isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
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
