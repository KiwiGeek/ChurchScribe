/**
 * Google Drive cloud storage provider for Scriptoria.
 *
 * Exposes window.GoogleDriveProvider, which implements the StorageProvider interface.
 * To add a new provider, create a new script that assigns an object with the same
 * shape to a window global and wire it up in app.js.
 *
 * StorageProvider interface:
 *
 *   id: string
 *     A unique identifier for this provider (e.g. "google-drive").
 *
 *   displayName: string
 *     A human-readable name for the provider shown in status messages (e.g. "Google Drive").
 *
 *   isAvailable(): boolean
 *     Returns true when the provider SDK has finished loading and is ready to use.
 *
 *   hasActiveSession(): boolean
 *     Returns true when the user is currently authenticated.
 *
 *   ensureTokenClient(): void
 *     Initialises any internal auth client (idempotent; safe to call multiple times).
 *
 *   waitForReady(onReady: () => void): void
 *     Polls until isAvailable() is true, then calls onReady().
 *
 *   connect(): Promise<{ email: string }>
 *     Runs the full authentication/consent flow and resolves with the signed-in
 *     user's email address, retrieved via the Drive About API (no extra scopes
 *     needed beyond drive.appdata). Throws on failure.
 *
 *   disconnect(): void
 *     Signs out and clears all in-memory session state.
 *
 *   attemptSilentReconnect(): Promise<{ email: string }>
 *     Tries to re-authenticate without showing a consent prompt (e.g. on page load).
 *     Resolves with { email } on success. Throws if the user is not already signed in
 *     or if a silent reconnect has already been attempted this session.
 *
 *   getSettingsFields(): SettingsField[]
 *     Returns the list of user-configurable settings fields for this provider.
 *     The settings window uses these descriptors to build its UI dynamically.
 *     SettingsField: {
 *       key: string          — unique identifier scoped to this provider
 *       label: string        — human-readable label shown in the UI
 *       type: "checkbox" | "text" | "select"
 *       options?: Array<{ value: string, label: string }>   — for type "select" only
 *       helpText?: string    — optional description rendered below the field
 *     }
 *
 *   getSettingsValues(): Record<string, unknown>
 *     Returns the default (or current) values for every field returned by
 *     getSettingsFields(). app.js calls this to seed the providerSettings store
 *     on first run and to fill in any missing keys after an upgrade.
 *
 *   applySettingChange(key: string, value: unknown): ProviderSettingChangeResult
 *     Called by app.js whenever the user changes a provider-specific setting.
 *     The provider may update internal state here. The return value tells app.js
 *     what side effects to apply.
 *     ProviderSettingChangeResult: {
 *       clearRemoteState?: boolean  — if true, app.js clears the cached remote
 *                                     file/folder IDs and the lastError string
 *     }
 *
 *   getLocationLabel(settings: Record<string, unknown>): string
 *     Returns a short human-readable description of where the workspace file is
 *     stored for the given provider settings (e.g. "visible Drive folder").
 *     Returns an empty string when no extra label is needed.
 *
 *   upload(payload: object, settings: ProviderSettings): Promise<ProviderResult>
 *     Saves payload to one remote settings file plus one remote file per note.
 *     Returns the (possibly updated) file/folder identifiers.
 *
 *   download(settings: ProviderSettings): Promise<{ data: object | null } & ProviderResult>
 *     Fetches the remote settings file and all remote note files.
 *     Returns the parsed data (null if no file exists yet) and the identifiers.
 *
 *   clearRemote(): Promise<void>
 *     Deletes all Scriptoria files from the remote storage location.
 *     Throws if no active session exists or if the deletion fails.
 *
 * ProviderSettings:
 *   [providerKey: string]: unknown  — provider-specific settings (from getSettingsValues)
 *   remoteSettingsFileId: string    — cached settings file ID (empty string if unknown)
 *   remoteNoteFileIds: Record<string, string> — cached note file IDs by note ID
 *   remoteWorkspaceFileId: string   — unused legacy field
 *   remoteWorkspaceParentId: string — cached parent folder ID (empty string if unknown)
 *
 * ProviderResult:
 *   remoteSettingsFileId: string
 *   remoteNoteFileIds: Record<string, string>
 *   remoteWorkspaceFileId: string
 *   remoteWorkspaceParentId: string
 */
(() => {
  // Bumped whenever picker/auth diagnostics change — check this in the console
  // to confirm the service worker isn't serving a stale copy of this file.
  console.log("[GDrive] Provider loaded (diagnostics build 3).");
  const clientId = "711830335817-2enpiqrmso0sqgq2fnh8o4ef4r60ede0.apps.googleusercontent.com";
  // The numeric Google Cloud project number — used by the Picker so files/folders
  // the user selects are shared with this app under the drive.file scope.
  const appProjectNumber = clientId.split("-")[0];
  // API key for the Google Picker API.  Create one in Google Cloud Console →
  // APIs & Services → Credentials → "Create credentials" → "API key", restrict
  // it to the Picker API + your site's HTTP referrers, then paste it here.
  // Folder selection in "main storage" mode is unavailable until this is set.
  const pickerApiKey = "AIzaSyAZVJjMU_cgKXhWDkDQXx8df2n9dtj6omM";
  const settingsFileName = "churchscribe-settings.json";
  const noteFilePrefix = "churchscribe-note-";
  const noteFileSuffix = ".json";
  const appDataScope = "https://www.googleapis.com/auth/drive.appdata";
  // drive.file only grants access to files/folders the user explicitly opened
  // via the Picker or that the app created — no full-Drive access, so no
  // restricted-scope verification is required in Google Cloud Console.
  const driveFileScope = "https://www.googleapis.com/auth/drive.file";

  let tokenClient = null;
  let accessToken = null;
  let silentReconnectAttempted = false;
  let pickerLoadPromise = null;
  // Reject handler for the in-flight requestToken() promise.  GIS reports
  // popup failures (blocked, or closed before completion) through the token
  // client's error_callback rather than the token callback, so without this
  // the promise would hang forever and leave callers stuck in a busy state.
  let pendingTokenReject = null;

  const isMainStorage = (settings) => settings?.locationMode === "drive";

  const buildScopeString = (settings) =>
    isMainStorage(settings) ? `${appDataScope} ${driveFileScope}` : appDataScope;

  const isAvailable = () =>
    Boolean(window.google?.accounts?.oauth2?.initTokenClient);

  const hasActiveSession = () => Boolean(accessToken);

  const apiFetch = async (url, options = {}) => {
    if (!accessToken) {
      throw new Error("Google Drive is not connected in this browser session.");
    }

    const headers = new Headers(options.headers ?? {});
    headers.set("Authorization", `Bearer ${accessToken}`);

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      const err = new Error(errorText || `Google Drive request failed with ${response.status}.`);
      err.status = response.status;
      throw err;
    }

    return response;
  };

  const parseErrorMessage = (error) => {
    const fallback = "Unknown Google Drive error.";

    if (!(error instanceof Error)) {
      return fallback;
    }

    const message = error.message?.trim() || fallback;

    try {
      const parsed = JSON.parse(message);
      return parsed.error?.message || parsed.error_description || message;
    } catch {
      return message;
    }
  };

  const buildMultipartJsonBody = (metadata, payload) => {
    const boundary = `churchscribe-${crypto.randomUUID()}`;
    const body = [
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(metadata),
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(payload),
      `--${boundary}--`
    ].join("\r\n");

    return {
      body,
      contentType: `multipart/related; boundary=${boundary}`
    };
  };

  const resolveLocation = (settings = {}) =>
    isMainStorage(settings) && settings.driveFolderId
      ? {
          spaces: "drive",
          parents: [settings.driveFolderId],
          parentQuery: `'${settings.driveFolderId}' in parents`,
          remoteWorkspaceParentId: settings.driveFolderId
        }
      : {
          spaces: "appDataFolder",
          parents: ["appDataFolder"],
          parentQuery: "'appDataFolder' in parents",
          remoteWorkspaceParentId: ""
        };

  const getNoteFileName = (noteId) => `${noteFilePrefix}${noteId}${noteFileSuffix}`;

  const getNoteIdFromFileName = (fileName) =>
    fileName.startsWith(noteFilePrefix) && fileName.endsWith(noteFileSuffix)
      ? fileName.slice(noteFilePrefix.length, -noteFileSuffix.length)
      : "";

  const findFileId = async (cachedFileId, location, query) => {
    if (cachedFileId) {
      return cachedFileId;
    }

    const encodedQuery = encodeURIComponent(query);
    const response = await apiFetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&spaces=${location.spaces}&fields=files(id,name)`
    );
    const payload = await response.json();
    return payload.files?.[0]?.id ?? "";
  };

  const listFiles = async (location, query) => {
    const encodedQuery = encodeURIComponent(query);
    const response = await apiFetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&spaces=${location.spaces}&fields=files(id,name)`
    );
    const payload = await response.json();
    return payload.files ?? [];
  };

  const listNoteFiles = async (location) =>
    listFiles(
      location,
      `name contains '${noteFilePrefix}' and ${location.parentQuery} and trashed=false`
    );

  const buildSettingsQuery = (location) =>
    `name='${settingsFileName}' and ${location.parentQuery} and trashed=false`;

  const fetchUserEmail = async () => {
    const response = await apiFetch(
      "https://www.googleapis.com/drive/v3/about?fields=user"
    );
    const data = await response.json();
    return data.user?.emailAddress ?? "";
  };

  const ensureTokenClient = () => {
    if (!isAvailable() || tokenClient) {
      return;
    }

    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: appDataScope,
      callback: () => {},
      error_callback: (error) => {
        console.warn("[GDrive] Token client error_callback fired:", error?.type, error);
        const reject = pendingTokenReject;
        pendingTokenReject = null;

        if (!reject) {
          return;
        }

        const message = error?.type === "popup_closed"
          ? "The Google sign-in window was closed before finishing."
          : error?.type === "popup_failed_to_open"
            ? "The Google sign-in popup was blocked. Allow popups for this site and try again."
            : "Google sign-in failed.";
        reject(new Error(message));
      }
    });
  };

  // Requests an access token, resolving with the raw token response.  The
  // scope is computed per-call so a workspace configured for "main storage"
  // (drive.file) picks up the extra scope on connect/reconnect.
  const requestToken = ({ prompt, scope }) => new Promise((resolve, reject) => {
    ensureTokenClient();
    pendingTokenReject = reject;
    console.log("[GDrive] Requesting access token", { prompt, scope });

    tokenClient.callback = (tokenResponse) => {
      pendingTokenReject = null;

      if (tokenResponse.error) {
        console.warn("[GDrive] Token request failed:", tokenResponse.error, tokenResponse.error_description ?? "");
        reject(new Error(tokenResponse.error_description || tokenResponse.error));
        return;
      }

      console.log("[GDrive] Token granted with scopes:", tokenResponse.scope);
      resolve(tokenResponse);
    };

    tokenClient.requestAccessToken({
      prompt,
      scope,
      include_granted_scopes: true
    });
  });

  const waitForReady = (onReady) => {
    if (isAvailable()) {
      ensureTokenClient();
      onReady();
      return;
    }

    window.setTimeout(() => waitForReady(onReady), 500);
  };

  const connect = async (settings = {}) => {
    try {
      const tokenResponse = await requestToken({
        prompt: "consent",
        scope: buildScopeString(settings)
      });
      accessToken = tokenResponse.access_token;
      const email = await fetchUserEmail().catch(() => "");
      return { email };
    } catch (error) {
      accessToken = null;
      throw error;
    }
  };

  const disconnect = () => {
    if (accessToken && window.google?.accounts?.oauth2?.revoke) {
      window.google.accounts.oauth2.revoke(accessToken, () => {});
    }

    accessToken = null;
    silentReconnectAttempted = false;
  };

  const attemptSilentReconnect = async (settings = {}) => {
    if (silentReconnectAttempted) {
      throw new Error("Silent reconnect already attempted this session.");
    }

    silentReconnectAttempted = true;

    try {
      const tokenResponse = await requestToken({
        prompt: "none",
        scope: buildScopeString(settings)
      });
      accessToken = tokenResponse.access_token;
      const email = await fetchUserEmail().catch(() => "");
      return { email };
    } catch (error) {
      accessToken = null;
      throw error;
    }
  };

  // ── Setup-wizard hooks ──────────────────────────────────────────────────────
  // Where the workspace can be stored.  "picker" tells the wizard to offer a
  // "Choose folder…" button backed by pickLocationFolder() below.
  const getLocationOptions = () => [
    {
      id: "appdata",
      label: "App folder (recommended)",
      description: "A hidden application-data area inside your Google Drive. Invisible in Drive, cleaned up automatically if you remove the app.",
      requiresFolder: null
    },
    {
      id: "drive",
      label: "A folder in My Drive",
      description: "A regular folder you choose in your Google Drive. Files are visible and can be shared or backed up like any other Drive content.",
      requiresFolder: "picker"
    }
  ];

  // Re-requests the token with the drive.file scope added when the user picks
  // "main storage".  Google shows an incremental-consent prompt only if the
  // scope hasn't been granted yet.
  const ensureLocationAccess = async (locationMode) => {
    if (locationMode !== "drive") {
      return;
    }

    console.log("[GDrive] Ensuring drive.file scope for main-storage mode…");
    const tokenResponse = await requestToken({
      prompt: "",
      scope: `${appDataScope} ${driveFileScope}`
    });
    accessToken = tokenResponse.access_token;
    console.log("[GDrive] Main-storage access ensured.");
  };

  const loadPickerApi = () => {
    if (!pickerLoadPromise) {
      pickerLoadPromise = new Promise((resolve, reject) => {
        let elapsed = 0;
        console.log("[GDrive] Loading Picker module (window.gapi present:", Boolean(window.gapi), ")");

        const tryLoad = () => {
          if (window.gapi?.load) {
            window.gapi.load("picker", {
              callback: () => {
                console.log("[GDrive] Picker module loaded. google.picker present:", Boolean(window.google?.picker));
                resolve();
              },
              onerror: (err) => {
                console.error("[GDrive] Picker module failed to load:", err);
                reject(new Error("Failed to load the Google Picker API (it may be blocked by an extension)."));
              },
              timeout: 8000,
              ontimeout: () => {
                console.error("[GDrive] Picker module load timed out after 8s.");
                reject(new Error("Loading the Google Picker timed out — check for content blockers."));
              }
            });
            return;
          }

          elapsed += 200;

          if (elapsed >= 10000) {
            console.error("[GDrive] window.gapi never appeared — apis.google.com/js/api.js did not load.");
            reject(new Error("Google API script (apis.google.com/js/api.js) did not load — check for content blockers."));
            return;
          }

          window.setTimeout(tryLoad, 200);
        };

        tryLoad();
      });

      pickerLoadPromise.catch(() => {
        pickerLoadPromise = null;
      });
    }

    return pickerLoadPromise;
  };

  // Opens the Google Picker so the user can select (or create, via the
  // picker's own UI) a folder in My Drive.  Resolves with a provider-settings
  // patch; resolves null when the user cancels.
  const pickLocationFolder = async () => {
    if (!accessToken) {
      throw new Error("Connect to Google Drive first.");
    }

    if (!pickerApiKey) {
      throw new Error(
        "Google Picker is not configured: set pickerApiKey in storage/gdrive.js " +
        "(Google Cloud Console → APIs & Services → Credentials → API key)."
      );
    }

    await loadPickerApi();

    return new Promise((resolve, reject) => {
      try {
        console.log("[GDrive] Building Picker", {
          hasToken: Boolean(accessToken),
          hasApiKey: Boolean(pickerApiKey),
          appId: appProjectNumber
        });

        const view = new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS)
          .setIncludeFolders(true)
          .setSelectFolderEnabled(true)
          .setMimeTypes("application/vnd.google-apps.folder");

        const picker = new window.google.picker.PickerBuilder()
          .setOAuthToken(accessToken)
          .setDeveloperKey(pickerApiKey)
          .setAppId(appProjectNumber)
          .setTitle("Choose a folder for Scriptoria")
          .addView(view)
          .setCallback((data) => {
            console.log("[GDrive] Picker callback:", data?.action, data);

            if (data.action === window.google.picker.Action.PICKED) {
              const doc = data.docs?.[0];

              if (!doc) {
                resolve(null);
                return;
              }

              resolve({
                providerSettingsPatch: {
                  driveFolderId: doc.id,
                  driveFolderName: doc.name ?? "Drive folder"
                },
                label: doc.name ?? "Drive folder"
              });
            } else if (data.action === window.google.picker.Action.CANCEL) {
              resolve(null);
            }
          })
          .build();

        picker.setVisible(true);
        console.log("[GDrive] Picker setVisible(true) called.");
      } catch (error) {
        console.error("[GDrive] Failed to open the Picker:", error);
        reject(error instanceof Error ? error : new Error("Failed to open the Google Picker."));
      }
    });
  };

  const buildLocationPatch = (locationMode, folderPatch = null) => ({
    locationMode,
    ...(locationMode === "drive"
      ? folderPatch ?? {}
      : { driveFolderId: "", driveFolderName: "" })
  });

  const upsertJsonFile = async ({ fileId, name, parents }, payload) => {
    if (fileId) {
      try {
        const multipart = buildMultipartJsonBody({ mimeType: "application/json" }, payload);
        await apiFetch(
          `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart&fields=id`,
          {
            method: "PATCH",
            headers: { "Content-Type": multipart.contentType },
            body: multipart.body
          }
        );
        return fileId;
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
      }
    }

    const multipart = buildMultipartJsonBody(
      {
        name,
        parents,
        mimeType: "application/json"
      },
      payload
    );
    const createResponse = await apiFetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
      {
        method: "POST",
        headers: { "Content-Type": multipart.contentType },
        body: multipart.body
      }
    );
    const responsePayload = await createResponse.json();
    return responsePayload.id ?? "";
  };

  const readJsonFile = async (fileId) => {
    const response = await apiFetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`);
    return response.json();
  };

  const upload = async (payload, settings = {}) => {
    const { remoteSettingsFileId, remoteNoteFileIds = {} } = settings;

    try {
      const location = resolveLocation(settings);
      const updatedParentId = location.remoteWorkspaceParentId;
      const settingsQuery = buildSettingsQuery(location);
      const existingSettingsFileId = await findFileId(remoteSettingsFileId, location, settingsQuery);
      const nextSettingsFileId = await upsertJsonFile(
        {
          fileId: existingSettingsFileId,
          name: settingsFileName,
          parents: location.parents
        },
        payload.settings
      );

      const existingNoteFiles = await listNoteFiles(location);
      const existingNoteFileByName = new Map(existingNoteFiles.map((file) => [file.name, file.id]));
      const desiredNoteFileNames = new Set();
      const nextNoteFileIds = {};

      for (const note of payload.notes.notes) {
        const fileName = getNoteFileName(note.id);
        desiredNoteFileNames.add(fileName);
        const fileId = await upsertJsonFile(
          {
            fileId: remoteNoteFileIds[note.id] || existingNoteFileByName.get(fileName) || "",
            name: fileName,
            parents: location.parents
          },
          {
            version: 2,
            updatedAt: payload.updatedAt,
            note
          }
        );
        nextNoteFileIds[note.id] = fileId;
      }

      await Promise.all(
        existingNoteFiles
          .filter((file) => !desiredNoteFileNames.has(file.name))
          .map((file) => apiFetch(`https://www.googleapis.com/drive/v3/files/${file.id}`, { method: "DELETE" }))
      );

      return {
        remoteSettingsFileId: nextSettingsFileId,
        remoteNoteFileIds: nextNoteFileIds,
        remoteWorkspaceFileId: "",
        remoteWorkspaceParentId: updatedParentId
      };
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  const download = async (settings = {}) => {
    const { remoteSettingsFileId } = settings;

    try {
      const location = resolveLocation(settings);
      const updatedParentId = location.remoteWorkspaceParentId;
      const settingsQuery = buildSettingsQuery(location);
      let settingsFileId = await findFileId(remoteSettingsFileId, location, settingsQuery);
      const noteFiles = await listNoteFiles(location);

      if (!settingsFileId && !noteFiles.length) {
        return {
          data: null,
          remoteSettingsFileId: "",
          remoteNoteFileIds: {},
          remoteWorkspaceFileId: "",
          remoteWorkspaceParentId: updatedParentId
        };
      }

      let settingsPayload = {};

      if (settingsFileId) {
        try {
          settingsPayload = await readJsonFile(settingsFileId);
        } catch (error) {
          if (error.status !== 404) {
            throw error;
          }

          settingsFileId = "";
        }
      }

      const notePayloads = await Promise.all(
        noteFiles.map(async (file) => {
          const payload = await readJsonFile(file.id);
          return { file, payload };
        })
      );

      const notes = [];
      const nextNoteFileIds = {};
      const timestamps = [];

      if (settingsPayload.updatedAt) {
        timestamps.push(settingsPayload.updatedAt);
      }

      for (const { file, payload } of notePayloads) {
        const noteId = getNoteIdFromFileName(file.name) || payload.note?.id || payload.id;
        const note = payload.note ?? payload;

        if (!noteId || !note) {
          continue;
        }

        nextNoteFileIds[noteId] = file.id;
        notes.push(note);
        timestamps.push(payload.updatedAt ?? note.updatedAt);
      }

      const latestUpdatedAt = timestamps
        .filter(Boolean)
        .sort((left, right) => new Date(right) - new Date(left))[0] ?? null;

      return {
        data: {
          ...settingsPayload,
          updatedAt: latestUpdatedAt,
          notes
        },
        remoteSettingsFileId: settingsFileId,
        remoteNoteFileIds: nextNoteFileIds,
        remoteWorkspaceFileId: "",
        remoteWorkspaceParentId: updatedParentId
      };
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  const getSettingsFields = () => [];

  const getSettingsValues = () => ({
    locationMode: "appdata",
    driveFolderId: "",
    driveFolderName: ""
  });

  const applySettingChange = (key) => {
    if (key === "locationMode" || key === "driveFolderId") {
      return { clearRemoteState: true };
    }

    return {};
  };

  const getLocationLabel = (settings = {}) =>
    isMainStorage(settings) ? (settings.driveFolderName || "Drive folder") : "";

  const clearRemote = async (settings = {}) => {
    if (!accessToken) {
      throw new Error("Not connected to Google Drive.");
    }

    try {
      const location = resolveLocation(settings);
      const settingsQuery = buildSettingsQuery(location);
      const [settingsFileId, noteFiles] = await Promise.all([
        findFileId("", location, settingsQuery),
        listNoteFiles(location)
      ]);
      const allFileIds = [
        ...(settingsFileId ? [settingsFileId] : []),
        ...noteFiles.map((f) => f.id)
      ];

      await Promise.all(
        allFileIds.map((id) =>
          apiFetch(`https://www.googleapis.com/drive/v3/files/${id}`, { method: "DELETE" })
        )
      );
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  window.GoogleDriveProvider = {
    id: "google-drive",
    displayName: "Google Drive",
    isAvailable,
    hasActiveSession,
    ensureTokenClient,
    waitForReady,
    connect,
    disconnect,
    attemptSilentReconnect,
    getSettingsFields,
    getSettingsValues,
    applySettingChange,
    getLocationLabel,
    getLocationOptions,
    ensureLocationAccess,
    pickLocationFolder,
    buildLocationPatch,
    upload,
    download,
    clearRemote
  };
})();

