window.ScriptoriaModules = window.ScriptoriaModules || {};

/**
 * Sync & Backup setup wizard.
 *
 * A multi-page dialog that walks the user through configuring a storage
 * provider: choose provider → sign in → choose storage location → decide what
 * to do with existing data → confirm.  All choices are held in local wizard
 * state and only applied to cloudSyncSettings when the user clicks Finish, so
 * cancelling at any point leaves the previous configuration untouched.
 *
 * Steps adapt per provider:
 *   • Google Drive / OneDrive — location step offering the hidden app folder
 *     or a user-chosen folder in main storage (Google Picker / Graph folder
 *     browser respectively).
 *   • OneNote — location step offering notebook selection or creation.
 *   • Local Drive — the folder picker *is* the connect step; no location step.
 *   • None — disables sync after a confirm step.
 *
 * The existing-data step probes the chosen location with provider.download()
 * and, when a workspace already exists there, asks whether to keep the local
 * library (overwriting the cloud) or adopt the cloud library (overwriting
 * local).  In readOnly mode (mobile) the cloud copy always wins.
 */
window.ScriptoriaModules.createSyncSetupWizard = (deps) => {
  const {
    documentObject: doc,
    windowObject: win,
    providerRegistry,
    noOpProvider,
    cloudSyncSettings,
    persistCloudSyncSettings,
    getActiveProvider,
    setActiveProvider,
    stopCloudPolling,
    startCloudPolling,
    clearPendingAutoSync,
    applyCloudPayload,
    syncWorkspaceToCloud,
    renderSettings,
    refreshSaveStatus,
    workspace,
    readOnly = false,
    onFinished = null,
    // Invoked whenever the wizard ends (finish or cancel) — the host page can
    // use it to restore UI it hid while the wizard ran (e.g. the settings
    // dialog, which must be closed so the Google Picker isn't trapped beneath
    // its modal top layer).
    onClosed = null
  } = deps;

  const PENDING_STORAGE_KEY = "scriptoria-sync-wizard-pending";

  const PROVIDER_ORDER = ["google-drive", "onedrive", "onenote", "local-drive", "none"];

  const PROVIDER_DESCRIPTIONS = {
    "google-drive": "Sync your library through your Google account.",
    "onedrive": "Sync your library through your Microsoft account.",
    "onenote": "Store entries as readable pages in a OneNote notebook.",
    "local-drive": "Store your library in a folder on this computer.",
    "none": "Keep data in this browser only — no sync or backup."
  };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  let dialog = null;
  let bodyEl = null;
  let titleEl = null;
  let progressEl = null;
  let backButton = null;
  let nextButton = null;
  let cancelButton = null;

  let state = null;

  const hasLocalNoteData = () =>
    workspace.notes.some((note) => note.content || Object.values(note.metadata ?? {}).some(Boolean));

  // Redirect-based auth flows (OneDrive on mobile) navigate away mid-wizard.
  // A breadcrumb in sessionStorage lets the page resume the wizard on return.
  const setPendingFlag = () => {
    try {
      win.sessionStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify({ providerId: state.providerId }));
    } catch {
      // Session storage unavailable — resume simply won't happen.
    }
  };

  const clearPendingFlag = () => {
    try {
      win.sessionStorage.removeItem(PENDING_STORAGE_KEY);
    } catch {
      // Ignore.
    }
  };

  const ensureLocationAccess = async (provider) => {
    setPendingFlag();

    try {
      await provider.ensureLocationAccess?.(state.locationMode);
    } finally {
      clearPendingFlag();
    }
  };

  const getProvider = () => providerRegistry[state.providerId] ?? noOpProvider;

  const getMergedProviderSettings = () => ({
    ...(getProvider().getSettingsValues?.() ?? {}),
    ...(cloudSyncSettings.providerSettings[state.providerId] ?? {}),
    ...(state.locationPatch ?? {})
  });

  const providerUsesLocationStep = () => {
    const provider = getProvider();
    return typeof provider.getLocationOptions === "function" ||
      (provider.getSettingsFields?.() ?? []).length > 0;
  };

  // ── Step list ───────────────────────────────────────────────────────────────
  const getSteps = () => {
    const steps = [];

    if (!state.skipProviderStep) {
      steps.push("provider");
    }

    if (state.providerId && state.providerId !== "none") {
      steps.push("connect");

      if (providerUsesLocationStep()) {
        steps.push("location");
      }

      steps.push("data");
    }

    steps.push("confirm");
    return steps;
  };

  const STEP_LABELS = {
    provider: "Choose Provider",
    connect: "Sign In",
    location: "Storage Location",
    data: "Existing Data",
    confirm: "Confirm"
  };

  // ── Dialog shell ────────────────────────────────────────────────────────────
  const ensureDialog = () => {
    if (dialog) {
      return;
    }

    dialog = doc.createElement("dialog");
    dialog.className = "management-dialog compact-dialog sync-wizard-dialog";
    dialog.id = "sync-setup-wizard";
    dialog.innerHTML = `
      <div class="dialog-shell sync-wizard-shell">
        <header class="sync-wizard-header">
          <p class="panel-kicker">Sync &amp; Backup</p>
          <h2 class="sync-wizard-title">Set Up Synchronization</h2>
          <p class="sync-wizard-progress" aria-live="polite"></p>
        </header>
        <div class="sync-wizard-body"></div>
        <footer class="sync-wizard-actions">
          <button type="button" class="ghost-button sync-wizard-back">Back</button>
          <button type="button" class="ghost-button sync-wizard-cancel">Cancel</button>
          <span class="sync-wizard-actions-spacer"></span>
          <button type="button" class="sync-wizard-next">Next</button>
        </footer>
      </div>
    `;
    doc.body.append(dialog);

    bodyEl = dialog.querySelector(".sync-wizard-body");
    titleEl = dialog.querySelector(".sync-wizard-title");
    progressEl = dialog.querySelector(".sync-wizard-progress");
    backButton = dialog.querySelector(".sync-wizard-back");
    nextButton = dialog.querySelector(".sync-wizard-next");
    cancelButton = dialog.querySelector(".sync-wizard-cancel");

    backButton.addEventListener("click", () => {
      goBack();
    });

    nextButton.addEventListener("click", () => {
      void goNext();
    });

    cancelButton.addEventListener("click", () => {
      cancelWizard();
    });

    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      cancelWizard();
    });
  };

  // ── State helpers ───────────────────────────────────────────────────────────
  const createState = ({ initialProviderId = null, resumeConnected = false } = {}) => ({
    stepIndex: 0,
    skipProviderStep: Boolean(initialProviderId),
    providerId: initialProviderId ?? (cloudSyncSettings.provider !== "none" ? cloudSyncSettings.provider : null),
    connected: resumeConnected,
    connectedDuringWizard: resumeConnected,
    email: resumeConnected ? cloudSyncSettings.connectedEmail : "",
    // location step
    locationMode: null,
    locationPatch: null,
    locationLabel: "",
    oneNoteParentId: "",
    oneNoteValues: null,
    folderBrowser: null,
    // data step
    probe: null,
    probeError: "",
    probeLoading: false,
    resolution: null,
    // misc
    busy: false,
    error: "",
    snapshot: {
      providerId: cloudSyncSettings.provider,
      hadSession: getActiveProvider().hasActiveSession()
    }
  });

  const setBusy = (busy, label) => {
    state.busy = busy;
    nextButton.disabled = busy || !isStepValid();
    backButton.disabled = busy;

    if (label) {
      nextButton.textContent = label;
    }
  };

  const setError = (message) => {
    state.error = message ?? "";

    if (state.error) {
      console.warn("[Wizard] Error:", state.error);
    }

    const errorEl = bodyEl.querySelector(".sync-wizard-error");

    if (errorEl) {
      errorEl.textContent = state.error;
      errorEl.hidden = !state.error;
    }
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const isStepValid = () => {
    const step = getSteps()[state.stepIndex];

    switch (step) {
      case "provider":
        return Boolean(state.providerId);
      case "connect":
        return state.connected || getProvider().hasActiveSession();
      case "location": {
        const provider = getProvider();

        if (typeof provider.getLocationOptions === "function") {
          if (!state.locationMode) {
            return false;
          }

          const option = provider.getLocationOptions().find((entry) => entry.id === state.locationMode);
          return !option?.requiresFolder || Boolean(state.locationPatch);
        }

        // OneNote-style settings-fields fallback
        const values = state.oneNoteValues ?? {};

        if (!values.notebookId) {
          return false;
        }

        if (values.notebookId === "__create__" && !String(values.createNotebookName ?? "").trim()) {
          return false;
        }

        return true;
      }
      case "data":
        if (state.probeLoading) {
          return false;
        }

        return Boolean(state.resolution);
      case "confirm":
        return true;
      default:
        return false;
    }
  };

  // ── Rendering ───────────────────────────────────────────────────────────────
  const render = () => {
    const steps = getSteps();
    const step = steps[state.stepIndex];

    titleEl.textContent = state.providerId === "none" || !state.providerId
      ? "Set Up Synchronization"
      : `Set Up ${getProvider().displayName ?? "Synchronization"}`;
    progressEl.textContent = `Step ${state.stepIndex + 1} of ${steps.length} — ${STEP_LABELS[step]}`;

    backButton.hidden = state.stepIndex === 0;
    nextButton.textContent = step === "confirm"
      ? (state.providerId === "none" ? "Disable Sync" : "Finish Setup")
      : "Next";

    switch (step) {
      case "provider":
        renderProviderStep();
        break;
      case "connect":
        renderConnectStep();
        break;
      case "location":
        renderLocationStep();
        break;
      case "data":
        renderDataStep();
        break;
      case "confirm":
        renderConfirmStep();
        break;
    }

    const errorEl = doc.createElement("p");
    errorEl.className = "sync-wizard-error";
    errorEl.hidden = !state.error;
    errorEl.textContent = state.error;
    bodyEl.append(errorEl);

    nextButton.disabled = state.busy || !isStepValid();
    backButton.disabled = state.busy;
  };

  const renderProviderStep = () => {
    const available = PROVIDER_ORDER.filter((id) => id === "none" || providerRegistry[id]);

    bodyEl.innerHTML = `
      <p class="settings-copy">Choose where Scriptoria should keep a synced copy of your library.</p>
      <div class="sync-wizard-options" role="radiogroup" aria-label="Storage provider">
        ${available.map((id) => {
          const provider = providerRegistry[id];
          const name = id === "none" ? "None" : provider.displayName;
          const unavailable = id !== "none" && provider.isAvailable && !provider.isAvailable();
          return `
            <label class="sync-wizard-option${unavailable ? " is-disabled" : ""}">
              <input type="radio" name="wizard-provider" value="${escapeHtml(id)}"
                ${state.providerId === id ? "checked" : ""} ${unavailable ? "disabled" : ""}>
              <span class="sync-wizard-option-body">
                <strong>${escapeHtml(name)}</strong>
                <span>${escapeHtml(unavailable
                  ? "Not supported in this browser."
                  : PROVIDER_DESCRIPTIONS[id] ?? "")}</span>
              </span>
            </label>
          `;
        }).join("")}
      </div>
    `;

    bodyEl.querySelectorAll("input[name='wizard-provider']").forEach((input) => {
      input.addEventListener("change", () => {
        if (state.providerId !== input.value) {
          state.providerId = input.value;
          // Reset downstream choices — they're provider-specific.
          state.connected = getProvider().hasActiveSession();
          state.connectedDuringWizard = false;
          state.email = state.connected ? cloudSyncSettings.connectedEmail : "";
          state.locationMode = null;
          state.locationPatch = null;
          state.locationLabel = "";
          state.oneNoteParentId = "";
          state.oneNoteValues = null;
          state.probe = null;
          state.resolution = null;
          setError("");
        }

        nextButton.disabled = state.busy || !isStepValid();
      });
    });
  };

  const renderConnectStep = () => {
    const provider = getProvider();
    const isLocalDrive = provider.id === "local-drive";
    const connected = state.connected || provider.hasActiveSession();
    const locationName = isLocalDrive ? provider.getLocationLabel?.() ?? "" : "";

    bodyEl.innerHTML = `
      <p class="settings-copy">${escapeHtml(isLocalDrive
        ? "Choose the folder on this computer where your library will be stored."
        : `Sign in so Scriptoria can store your library in ${provider.displayName}.`)}</p>
      <div class="sync-wizard-connect">
        ${connected ? `
          <p class="sync-wizard-connected">
            ${escapeHtml(isLocalDrive
              ? `Folder selected: ${locationName || "(unnamed folder)"}`
              : state.email
                ? `Connected as ${state.email}`
                : `Connected to ${provider.displayName}`)}
          </p>
          <button type="button" class="ghost-button" data-wizard-action="connect">
            ${escapeHtml(isLocalDrive ? "Choose a Different Folder…" : "Use a Different Account…")}
          </button>
        ` : `
          <button type="button" class="ghost-button sync-wizard-connect-button" data-wizard-action="connect">
            ${escapeHtml(isLocalDrive ? "Choose Folder…" : `Sign in to ${provider.displayName}…`)}
          </button>
        `}
      </div>
    `;

    bodyEl.querySelector("[data-wizard-action='connect']")?.addEventListener("click", () => {
      void runConnect();
    });
  };

  const runConnect = async () => {
    const provider = getProvider();
    setError("");
    setBusy(true);

    try {
      // Redirect-based auth (OneDrive on mobile) navigates away; leave a
      // breadcrumb so the wizard can resume after the round-trip.
      setPendingFlag();

      if (provider.hasActiveSession() && provider.id !== "local-drive") {
        provider.disconnect();
      }

      provider.ensureTokenClient?.();
      const { email } = await provider.connect(getMergedProviderSettings());
      state.connected = true;
      state.connectedDuringWizard = true;
      state.email = email ?? "";
      // Connecting invalidates any earlier probe.
      state.probe = null;
      state.resolution = null;
      clearPendingFlag();
    } catch (error) {
      state.connected = provider.hasActiveSession();
      setError(error?.message ?? "Sign-in failed.");
      clearPendingFlag();
    } finally {
      setBusy(false);
      render();
    }
  };

  const renderLocationStep = () => {
    const provider = getProvider();

    if (typeof provider.getLocationOptions === "function") {
      renderLocationOptions(provider);
    } else {
      renderProviderFieldsLocation(provider);
    }
  };

  const renderLocationOptions = (provider) => {
    const options = provider.getLocationOptions();

    if (!state.locationMode) {
      state.locationMode = options[0]?.id ?? null;
      state.locationPatch = options[0]?.requiresFolder
        ? null
        : provider.buildLocationPatch?.(state.locationMode) ?? { locationMode: state.locationMode };
      state.locationLabel = options[0]?.requiresFolder ? "" : options[0]?.label ?? "";
    }

    const selected = options.find((option) => option.id === state.locationMode);

    bodyEl.innerHTML = `
      <p class="settings-copy">Where in ${escapeHtml(provider.displayName)} should your library live?</p>
      <div class="sync-wizard-options" role="radiogroup" aria-label="Storage location">
        ${options.map((option) => `
          <label class="sync-wizard-option">
            <input type="radio" name="wizard-location" value="${escapeHtml(option.id)}"
              ${state.locationMode === option.id ? "checked" : ""}>
            <span class="sync-wizard-option-body">
              <strong>${escapeHtml(option.label)}</strong>
              <span>${escapeHtml(option.description)}</span>
            </span>
          </label>
        `).join("")}
      </div>
      <div class="sync-wizard-folder-area" ${selected?.requiresFolder ? "" : "hidden"}></div>
    `;

    bodyEl.querySelectorAll("input[name='wizard-location']").forEach((input) => {
      input.addEventListener("change", () => {
        // A hung sign-in/picker operation must not wedge the wizard: switching
        // location abandons it so validation reflects the new choice.
        if (state.busy) {
          console.warn("[Wizard] Abandoning in-flight operation after location change.");
          state.busy = false;
        }

        console.log("[Wizard] Location option selected:", input.value);
        state.locationMode = input.value;
        const option = options.find((entry) => entry.id === state.locationMode);
        state.locationPatch = option?.requiresFolder
          ? null
          : provider.buildLocationPatch?.(state.locationMode) ?? { locationMode: state.locationMode };
        state.locationLabel = option?.requiresFolder ? "" : option?.label ?? "";
        state.folderBrowser = null;
        state.probe = null;
        state.resolution = null;
        setError("");
        render();
      });
    });

    if (selected?.requiresFolder === "picker") {
      renderPickerFolderArea(provider);
    } else if (selected?.requiresFolder === "browser") {
      renderBrowserFolderArea(provider);
    }
  };

  const renderPickerFolderArea = (provider) => {
    const area = bodyEl.querySelector(".sync-wizard-folder-area");

    area.innerHTML = `
      <p class="sync-wizard-folder-current">
        ${state.locationPatch
          ? `Folder: <strong>${escapeHtml(state.locationLabel)}</strong>`
          : "No folder chosen yet."}
      </p>
      <button type="button" class="ghost-button" data-wizard-action="pick-folder">
        ${state.locationPatch ? "Choose a Different Folder…" : "Choose Folder…"}
      </button>
    `;

    area.querySelector("[data-wizard-action='pick-folder']").addEventListener("click", async () => {
      setError("");
      setBusy(true);
      console.log("[Wizard] Choose-folder clicked", { provider: provider.id, locationMode: state.locationMode });

      try {
        await ensureLocationAccess(provider);
        console.log("[Wizard] Location access ensured; opening folder picker…");

        // The Google Picker injects its UI into document.body.  While the
        // wizard is open as a *modal* dialog, everything outside it sits in
        // the inert layer beneath the top-layer backdrop — the picker would
        // render invisible and unclickable.  Hide the wizard for the duration
        // of the pick, then bring it back.
        let result;
        dialog.close();

        try {
          result = await provider.pickLocationFolder();
        } finally {
          if (!dialog.open) {
            dialog.showModal();
          }
        }

        console.log("[Wizard] Folder picker resolved:", result);

        if (result) {
          state.locationPatch = provider.buildLocationPatch(state.locationMode, null);
          state.locationPatch = { ...state.locationPatch, ...result.providerSettingsPatch };
          state.locationLabel = result.label;
          state.probe = null;
          state.resolution = null;
        }
      } catch (error) {
        setError(error?.message ?? "Folder selection failed.");
      } finally {
        setBusy(false);
        render();
      }
    });
  };

  const renderBrowserFolderArea = (provider) => {
    const area = bodyEl.querySelector(".sync-wizard-folder-area");

    if (!state.folderBrowser) {
      state.folderBrowser = {
        // Breadcrumb trail; first entry is the drive root.
        path: [{ id: "", name: "OneDrive" }],
        folders: null,
        loading: false,
        loadError: ""
      };
    }

    const browser = state.folderBrowser;
    const currentFolder = browser.path[browser.path.length - 1];

    const loadFolders = async () => {
      browser.loading = true;
      browser.loadError = "";
      renderArea();

      try {
        await ensureLocationAccess(provider);
        browser.folders = await provider.listLocationFolders(currentFolder.id);
      } catch (error) {
        browser.loadError = error?.message ?? "Couldn't list folders.";
        browser.folders = [];
      } finally {
        browser.loading = false;
        renderArea();
      }
    };

    const selectCurrentFolder = () => {
      if (!currentFolder.id) {
        setError("Choose or create a folder — the OneDrive root itself can't be used.");
        return;
      }

      const pathLabel = browser.path.slice(1).map((entry) => entry.name).join(" / ");
      state.locationPatch = provider.buildLocationPatch(state.locationMode, {
        id: currentFolder.id,
        name: currentFolder.name,
        path: pathLabel
      });
      state.locationLabel = pathLabel;
      state.probe = null;
      state.resolution = null;
      setError("");
      renderArea();
      nextButton.disabled = state.busy || !isStepValid();
    };

    const renderArea = () => {
      const breadcrumb = browser.path
        .map((entry, index) =>
          `<button type="button" class="sync-wizard-crumb" data-crumb-index="${index}">${escapeHtml(entry.name)}</button>`)
        .join("<span class='sync-wizard-crumb-sep'>/</span>");

      area.innerHTML = `
        <div class="sync-wizard-folder-browser">
          <div class="sync-wizard-crumbs">${breadcrumb}</div>
          <div class="sync-wizard-folder-list">
            ${browser.loading
              ? "<p class='sync-wizard-folder-note'>Loading folders…</p>"
              : browser.loadError
                ? `<p class='sync-wizard-folder-note'>${escapeHtml(browser.loadError)}</p>`
                : (browser.folders ?? []).length
                  ? browser.folders.map((folder) => `
                      <button type="button" class="sync-wizard-folder-entry" data-folder-id="${escapeHtml(folder.id)}" data-folder-name="${escapeHtml(folder.name)}">
                        📁 ${escapeHtml(folder.name)}
                      </button>
                    `).join("")
                  : "<p class='sync-wizard-folder-note'>No subfolders here.</p>"}
          </div>
          <div class="sync-wizard-folder-new">
            <input type="text" class="sync-wizard-new-folder-name" placeholder="New folder name">
            <button type="button" class="ghost-button" data-wizard-action="create-folder">Create Folder</button>
          </div>
          <p class="sync-wizard-folder-current">
            ${state.locationPatch
              ? `Selected: <strong>${escapeHtml(state.locationLabel)}</strong>`
              : "No folder selected yet."}
          </p>
          <button type="button" class="ghost-button" data-wizard-action="use-folder" ${currentFolder.id ? "" : "disabled"}>
            Use “${escapeHtml(currentFolder.name)}”
          </button>
        </div>
      `;

      area.querySelectorAll("[data-crumb-index]").forEach((button) => {
        button.addEventListener("click", () => {
          browser.path = browser.path.slice(0, Number(button.dataset.crumbIndex) + 1);
          browser.folders = null;
          renderBrowserFolderArea(provider);
        });
      });

      area.querySelectorAll("[data-folder-id]").forEach((button) => {
        button.addEventListener("click", () => {
          browser.path = [...browser.path, { id: button.dataset.folderId, name: button.dataset.folderName }];
          browser.folders = null;
          renderBrowserFolderArea(provider);
        });
      });

      area.querySelector("[data-wizard-action='use-folder']")?.addEventListener("click", selectCurrentFolder);

      area.querySelector("[data-wizard-action='create-folder']")?.addEventListener("click", async () => {
        const nameInput = area.querySelector(".sync-wizard-new-folder-name");
        const name = nameInput?.value.trim();

        if (!name) {
          setError("Enter a name for the new folder.");
          return;
        }

        setError("");
        setBusy(true);

        try {
          await ensureLocationAccess(provider);
          const created = await provider.createLocationFolder(currentFolder.id, name);
          browser.path = [...browser.path, { id: created.id, name: created.name }];
          browser.folders = null;
          renderBrowserFolderArea(provider);
        } catch (error) {
          setError(error?.message ?? "Couldn't create the folder.");
        } finally {
          setBusy(false);
        }
      });
    };

    if (browser.folders === null && !browser.loading) {
      void loadFolders();
    } else {
      renderArea();
    }
  };

  // OneNote-style fallback: render the provider's own settings fields
  // (notebook select + new-notebook name).
  const renderProviderFieldsLocation = (provider) => {
    const fields = provider.getSettingsFields();

    if (!state.oneNoteValues) {
      state.oneNoteValues = {
        ...(provider.getSettingsValues?.() ?? {}),
        ...(cloudSyncSettings.providerSettings[provider.id] ?? {})
      };
    }

    bodyEl.innerHTML = `
      <p class="settings-copy">Choose where in ${escapeHtml(provider.displayName)} your library should live.</p>
      <div class="sync-wizard-fields display-field-grid"></div>
    `;

    const grid = bodyEl.querySelector(".sync-wizard-fields");

    fields.forEach((field) => {
      const label = doc.createElement("label");
      label.className = "field";

      const span = doc.createElement("span");
      span.textContent = field.label;
      label.append(span);

      let input;

      if (field.type === "select") {
        input = doc.createElement("select");
        (field.options ?? []).forEach((option) => {
          const opt = doc.createElement("option");
          opt.value = option.value;
          opt.textContent = option.label;
          input.append(opt);
        });
        input.value = String(state.oneNoteValues[field.key] ?? "");
      } else if (field.type === "checkbox") {
        input = doc.createElement("input");
        input.type = "checkbox";
        input.checked = Boolean(state.oneNoteValues[field.key]);
      } else {
        input = doc.createElement("input");
        input.type = "text";
        input.value = String(state.oneNoteValues[field.key] ?? "");

        if (field.placeholder) {
          input.placeholder = field.placeholder;
        }
      }

      input.dataset.wizardFieldKey = field.key;
      input.addEventListener("input", () => {
        state.oneNoteValues[field.key] = input.type === "checkbox" ? input.checked : input.value;
        state.probe = null;
        state.resolution = null;
        nextButton.disabled = state.busy || !isStepValid();
      });
      input.addEventListener("change", () => {
        state.oneNoteValues[field.key] = input.type === "checkbox" ? input.checked : input.value;
        state.probe = null;
        state.resolution = null;
        nextButton.disabled = state.busy || !isStepValid();
      });
      label.append(input);

      if (field.helpText) {
        const help = doc.createElement("p");
        help.className = "settings-copy";
        help.textContent = field.helpText;
        label.append(help);
      }

      grid.append(label);
    });
  };

  // Called when leaving the location step for providers using the
  // settings-fields fallback (OneNote): resolves "create new notebook" into a
  // real notebook and produces the provider-settings patch.
  const commitProviderFieldsLocation = async () => {
    const provider = getProvider();
    const values = state.oneNoteValues ?? {};

    if (values.notebookId === "__create__" && typeof provider.createConfiguredNotebook === "function") {
      const result = await provider.createConfiguredNotebook({
        ...(provider.getSettingsValues?.() ?? {}),
        ...values
      });
      state.locationPatch = result.providerSettingsPatch ?? { notebookId: result.notebookId };
      state.oneNoteParentId = result.remoteWorkspaceParentId ?? result.notebookId ?? "";
      state.locationLabel = result.displayName ?? "";
      state.oneNoteValues = { ...values, ...state.locationPatch };
    } else {
      state.locationPatch = {
        notebookId: values.notebookId,
        createNotebookName: values.createNotebookName ?? "",
        sectionIdsByTypeId: {},
        notePageState: {},
        noteSnapshotsById: {},
        settingsPageLastModifiedAt: "",
        settingsSignature: ""
      };
      state.oneNoteParentId = values.notebookId;
      state.locationLabel = provider.getLocationLabel?.({ notebookId: values.notebookId }) || "";
    }
  };

  const renderDataStep = () => {
    if (state.probeLoading) {
      bodyEl.innerHTML = "<p class='settings-copy'>Checking the selected location for an existing workspace…</p>";
      return;
    }

    if (state.probeError) {
      bodyEl.innerHTML = `
        <p class="settings-copy">Couldn't check the selected location: ${escapeHtml(state.probeError)}</p>
        <button type="button" class="ghost-button" data-wizard-action="retry-probe">Try Again</button>
      `;
      bodyEl.querySelector("[data-wizard-action='retry-probe']").addEventListener("click", () => {
        void runProbe();
      });
      return;
    }

    const cloudData = state.probe?.data ?? null;
    const cloudHasData = Boolean(cloudData);
    const cloudNoteCount = Array.isArray(cloudData?.notes) ? cloudData.notes.length : 0;
    const cloudUpdatedAt = cloudData?.updatedAt ? new Date(cloudData.updatedAt).toLocaleString() : "unknown";
    const localHasData = hasLocalNoteData();
    const localNoteCount = workspace.notes.length;

    if (readOnly) {
      if (cloudHasData) {
        state.resolution = "downloadCloud";
        bodyEl.innerHTML = `
          <p class="settings-copy">A workspace was found in this location
            (${cloudNoteCount} ${cloudNoteCount === 1 ? "entry" : "entries"}, last updated ${escapeHtml(cloudUpdatedAt)}).</p>
          <p class="settings-copy">It will be downloaded to this device.</p>
        `;
      } else {
        state.resolution = "none";
        bodyEl.innerHTML = `
          <p class="settings-copy">No Scriptoria workspace was found in this location.</p>
          <p class="settings-copy">You can go back and choose a different location, or connect anyway and pull entries once they exist.</p>
        `;
      }

      return;
    }

    if (cloudHasData && localHasData) {
      bodyEl.innerHTML = `
        <p class="settings-copy">This location already contains a Scriptoria workspace. Both it and this device have data — choose which library to keep.</p>
        <div class="sync-wizard-options" role="radiogroup" aria-label="Existing data resolution">
          <label class="sync-wizard-option">
            <input type="radio" name="wizard-resolution" value="uploadLocal" ${state.resolution === "uploadLocal" ? "checked" : ""}>
            <span class="sync-wizard-option-body">
              <strong>Upload my library</strong>
              <span>Keep the ${localNoteCount} ${localNoteCount === 1 ? "entry" : "entries"} on this device and overwrite the cloud workspace. The existing cloud data will be permanently replaced.</span>
            </span>
          </label>
          <label class="sync-wizard-option">
            <input type="radio" name="wizard-resolution" value="downloadCloud" ${state.resolution === "downloadCloud" ? "checked" : ""}>
            <span class="sync-wizard-option-body">
              <strong>Download the cloud library</strong>
              <span>Use the ${cloudNoteCount} ${cloudNoteCount === 1 ? "entry" : "entries"} from the cloud (last updated ${escapeHtml(cloudUpdatedAt)}) and overwrite this device's library.</span>
            </span>
          </label>
        </div>
      `;

      bodyEl.querySelectorAll("input[name='wizard-resolution']").forEach((input) => {
        input.addEventListener("change", () => {
          state.resolution = input.value;
          nextButton.disabled = state.busy || !isStepValid();
        });
      });
    } else if (cloudHasData) {
      state.resolution = "downloadCloud";
      bodyEl.innerHTML = `
        <p class="settings-copy">A workspace was found in this location
          (${cloudNoteCount} ${cloudNoteCount === 1 ? "entry" : "entries"}, last updated ${escapeHtml(cloudUpdatedAt)}).</p>
        <p class="settings-copy">Since this device has no entries yet, the cloud library will be downloaded here.</p>
      `;
    } else if (localHasData) {
      state.resolution = "uploadLocal";
      bodyEl.innerHTML = `
        <p class="settings-copy">No existing workspace was found in this location.</p>
        <p class="settings-copy">Your library (${localNoteCount} ${localNoteCount === 1 ? "entry" : "entries"}) will be uploaded there after setup.</p>
      `;
    } else {
      state.resolution = "uploadLocal";
      bodyEl.innerHTML = `
        <p class="settings-copy">No existing workspace was found in this location, and this device has no entries yet.</p>
        <p class="settings-copy">A fresh workspace will be created and kept in sync from now on.</p>
      `;
    }
  };

  const runProbe = async () => {
    const provider = getProvider();
    state.probeLoading = true;
    state.probeError = "";
    render();

    try {
      const probeSettings = {
        ...getMergedProviderSettings(),
        activeNoteId: null,
        syncReason: "",
        remoteSettingsFileId: "",
        remoteNoteFileIds: {},
        remoteWorkspaceFileId: "",
        remoteWorkspaceParentId: state.oneNoteParentId ?? ""
      };
      state.probe = await provider.download(probeSettings);
    } catch (error) {
      state.probe = null;
      state.probeError = error?.message ?? "Unknown error.";
    } finally {
      state.probeLoading = false;
      render();
    }
  };

  const describeDataPlan = () => {
    switch (state.resolution) {
      case "downloadCloud":
        return "Download the cloud library to this device";
      case "uploadLocal":
        return hasLocalNoteData()
          ? "Upload this device's library to the cloud"
          : "Create a fresh workspace";
      default:
        return "Connect without transferring data";
    }
  };

  const renderConfirmStep = () => {
    if (!state.providerId || state.providerId === "none") {
      bodyEl.innerHTML = `
        <p class="settings-copy">Synchronization will be turned off. Your library stays in this browser only.</p>
        <p class="settings-copy">Nothing is deleted — data already stored with a provider remains there.</p>
      `;
      return;
    }

    const provider = getProvider();
    const locationLabel = state.locationLabel
      || provider.getLocationLabel?.(getMergedProviderSettings())
      || (provider.id === "local-drive" ? provider.getLocationLabel?.() : "")
      || "App folder";

    const rows = [
      ["Provider", provider.displayName],
      ...(state.email ? [["Account", state.email]] : []),
      ["Location", locationLabel],
      ["Data", describeDataPlan()]
    ];

    bodyEl.innerHTML = `
      <p class="settings-copy">Review your synchronization setup, then finish to apply it.</p>
      <dl class="sync-wizard-summary">
        ${rows.map(([label, value]) => `
          <div class="sync-wizard-summary-row">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value)}</dd>
          </div>
        `).join("")}
      </dl>
    `;
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goBack = () => {
    if (state.stepIndex === 0 || state.busy) {
      return;
    }

    setError("");
    state.stepIndex -= 1;
    render();
  };

  const goNext = async () => {
    if (state.busy || !isStepValid()) {
      return;
    }

    const steps = getSteps();
    const step = steps[state.stepIndex];
    setError("");

    if (step === "location") {
      const provider = getProvider();

      // Resolve OneNote's create-notebook option before moving on.
      if (typeof provider.getLocationOptions !== "function") {
        setBusy(true, "Working…");

        try {
          await commitProviderFieldsLocation();
        } catch (error) {
          setError(error?.message ?? "Couldn't prepare the storage location.");
          setBusy(false, "Next");
          render();
          return;
        }

        setBusy(false, "Next");
      }
    }

    if (step === "confirm") {
      await finishWizard();
      return;
    }

    state.stepIndex += 1;
    const nextStep = getSteps()[state.stepIndex];

    if (nextStep === "connect" && (state.connected || getProvider().hasActiveSession())) {
      state.connected = true;

      if (!state.email && cloudSyncSettings.provider === state.providerId) {
        state.email = cloudSyncSettings.connectedEmail;
      }
    }

    render();

    if (nextStep === "data" && !state.probe && !state.probeLoading) {
      void runProbe();
    }
  };

  // ── Finish / cancel ─────────────────────────────────────────────────────────
  const finishWizard = async () => {
    setBusy(true, "Finishing…");

    try {
      const snapshotProvider = providerRegistry[state.snapshot.providerId] ?? noOpProvider;

      if (!state.providerId || state.providerId === "none") {
        if (snapshotProvider.hasActiveSession()) {
          snapshotProvider.disconnect();
        }

        stopCloudPolling();
        clearPendingAutoSync();
        cloudSyncSettings.provider = "none";
        setActiveProvider(noOpProvider);
        cloudSyncSettings.remoteSettingsFileId = "";
        cloudSyncSettings.remoteNoteFileIds = {};
        cloudSyncSettings.remoteWorkspaceFileId = "";
        cloudSyncSettings.remoteWorkspaceParentId = "";
        cloudSyncSettings.lastSyncAt = null;
        cloudSyncSettings.connectedEmail = "";
        cloudSyncSettings.lastError = "";
        cloudSyncSettings.status = "Not connected";
        persistCloudSyncSettings();
        renderSettings();
        refreshSaveStatus();
        closeDialog();
        onFinished?.({ providerId: "none" });
        onClosed?.();
        return;
      }

      const provider = getProvider();

      // Leaving a different provider behind: end its session.
      if (state.snapshot.providerId !== state.providerId && snapshotProvider.hasActiveSession()) {
        snapshotProvider.disconnect();
      }

      stopCloudPolling();
      clearPendingAutoSync();

      cloudSyncSettings.provider = state.providerId;
      setActiveProvider(provider);
      cloudSyncSettings.providerSettings[state.providerId] = getMergedProviderSettings();
      cloudSyncSettings.remoteSettingsFileId = "";
      cloudSyncSettings.remoteNoteFileIds = {};
      cloudSyncSettings.remoteWorkspaceFileId = "";
      cloudSyncSettings.remoteWorkspaceParentId = state.oneNoteParentId || "";
      cloudSyncSettings.lastSyncAt = null;
      cloudSyncSettings.connectedEmail = state.email ?? "";
      cloudSyncSettings.lastError = "";

      const locationLabel = provider.getLocationLabel?.(cloudSyncSettings.providerSettings[state.providerId]) ?? "";
      cloudSyncSettings.status = `Connected to ${provider.displayName}${locationLabel ? ` (${locationLabel})` : ""}`;
      persistCloudSyncSettings();

      if (state.resolution === "downloadCloud" && state.probe?.data) {
        cloudSyncSettings.remoteSettingsFileId = state.probe.remoteSettingsFileId ?? "";
        cloudSyncSettings.remoteNoteFileIds = state.probe.remoteNoteFileIds ?? {};
        cloudSyncSettings.remoteWorkspaceFileId = state.probe.remoteWorkspaceFileId ?? "";

        if (state.probe.remoteWorkspaceParentId) {
          cloudSyncSettings.remoteWorkspaceParentId = state.probe.remoteWorkspaceParentId;
        }

        if (state.probe.providerSettingsPatch && typeof state.probe.providerSettingsPatch === "object") {
          cloudSyncSettings.providerSettings[state.providerId] = {
            ...cloudSyncSettings.providerSettings[state.providerId],
            ...state.probe.providerSettingsPatch
          };
        }

        await applyCloudPayload(state.probe.data);
        const syncedAt = state.probe.data.updatedAt ?? new Date().toISOString();
        cloudSyncSettings.lastSyncAt = syncedAt;
        cloudSyncSettings.localSettingsUpdatedAt = syncedAt;
        persistCloudSyncSettings();
      } else if (state.resolution === "uploadLocal" && !readOnly) {
        await syncWorkspaceToCloud({ reason: "initial" });
      }

      startCloudPolling();
      renderSettings();
      refreshSaveStatus();
      closeDialog();
      onFinished?.({ providerId: state.providerId });
      onClosed?.();
    } catch (error) {
      setError(error?.message ?? "Setup failed.");
      render();
    } finally {
      setBusy(false, "Finish Setup");
    }
  };

  const cancelWizard = () => {
    if (state?.busy) {
      return;
    }

    // If the wizard opened a session that wasn't there before (or on a
    // different provider than the active configuration), close it again.
    const provider = getProvider();

    if (
      state?.connectedDuringWizard &&
      provider.id !== "none" &&
      (state.providerId !== state.snapshot.providerId || !state.snapshot.hadSession)
    ) {
      try {
        provider.disconnect();
      } catch {
        // Best effort.
      }
    }

    clearPendingFlag();

    // Wizard never mutated cloudSyncSettings — just resume polling if the
    // previously configured provider still has a session.
    if (getActiveProvider().hasActiveSession()) {
      startCloudPolling();
    }

    closeDialog();
    onClosed?.();
  };

  const closeDialog = () => {
    if (dialog?.open) {
      dialog.close();
    }
  };

  const openWizard = (options = {}) => {
    ensureDialog();
    state = createState(options);
    stopCloudPolling();
    setError("");

    // When resuming after a redirect-based sign-in, jump straight past the
    // provider/connect steps.
    if (options.resumeConnected && options.initialProviderId) {
      state.providerId = options.initialProviderId;
      state.stepIndex = getSteps().indexOf(providerUsesLocationStep() ? "location" : "data");

      if (state.stepIndex < 0) {
        state.stepIndex = 0;
      }
    }

    render();

    if (!dialog.open) {
      dialog.showModal();
    }

    const currentStep = getSteps()[state.stepIndex];

    if (currentStep === "data" && !state.probe && !state.probeLoading) {
      void runProbe();
    }
  };

  const consumePendingResume = () => {
    try {
      const raw = win.sessionStorage.getItem(PENDING_STORAGE_KEY);

      if (!raw) {
        return null;
      }

      win.sessionStorage.removeItem(PENDING_STORAGE_KEY);
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  return {
    openWizard,
    consumePendingResume
  };
};
