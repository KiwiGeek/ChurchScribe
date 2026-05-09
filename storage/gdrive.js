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
  const clientId = "711830335817-2enpiqrmso0sqgq2fnh8o4ef4r60ede0.apps.googleusercontent.com";
  const settingsFileName = "churchscribe-settings.json";
  const noteFilePrefix = "churchscribe-note-";
  const noteFileSuffix = ".json";
  const scopes = "https://www.googleapis.com/auth/drive.appdata";

  let tokenClient = null;
  let accessToken = null;
  let silentReconnectAttempted = false;

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

  const resolveLocation = () => ({
    spaces: "appDataFolder",
    parents: ["appDataFolder"],
    remoteWorkspaceParentId: ""
  });

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
      `name contains '${noteFilePrefix}' and 'appDataFolder' in parents and trashed=false`
    );

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
      scope: scopes,
      callback: () => {}
    });
  };

  const waitForReady = (onReady) => {
    if (isAvailable()) {
      ensureTokenClient();
      onReady();
      return;
    }

    window.setTimeout(() => waitForReady(onReady), 500);
  };

  const connect = () => new Promise((resolve, reject) => {
    ensureTokenClient();

    tokenClient.callback = async (tokenResponse) => {
      if (tokenResponse.error) {
        reject(new Error(tokenResponse.error));
        return;
      }

      try {
        accessToken = tokenResponse.access_token;
        const email = await fetchUserEmail().catch(() => "");
        resolve({ email });
      } catch (error) {
        accessToken = null;
        reject(error);
      }
    };

    tokenClient.requestAccessToken({ prompt: "consent" });
  });

  const disconnect = () => {
    if (accessToken && window.google?.accounts?.oauth2?.revoke) {
      window.google.accounts.oauth2.revoke(accessToken, () => {});
    }

    accessToken = null;
    silentReconnectAttempted = false;
  };

  const attemptSilentReconnect = () => {
    if (silentReconnectAttempted) {
      return Promise.reject(new Error("Silent reconnect already attempted this session."));
    }

    silentReconnectAttempted = true;

    return new Promise((resolve, reject) => {
      ensureTokenClient();

      tokenClient.callback = async (tokenResponse) => {
        if (tokenResponse.error) {
          reject(new Error(tokenResponse.error));
          return;
        }

        try {
          accessToken = tokenResponse.access_token;
          const email = await fetchUserEmail().catch(() => "");
          resolve({ email });
        } catch (error) {
          accessToken = null;
          reject(error);
        }
      };

      tokenClient.requestAccessToken({ prompt: "none" });
    });
  };

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

  const upload = async (payload, { remoteSettingsFileId, remoteNoteFileIds = {} }) => {
    try {
      const location = resolveLocation();
      const updatedParentId = location.remoteWorkspaceParentId;
      const settingsQuery = `name='${settingsFileName}' and 'appDataFolder' in parents and trashed=false`;
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

  const download = async ({ remoteSettingsFileId }) => {
    try {
      const location = resolveLocation();
      const updatedParentId = location.remoteWorkspaceParentId;
      const settingsQuery = `name='${settingsFileName}' and 'appDataFolder' in parents and trashed=false`;
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

  const getSettingsValues = () => ({});

  const applySettingChange = () => ({});

  const getLocationLabel = () => "";

  const clearRemote = async () => {
    if (!accessToken) {
      throw new Error("Not connected to Google Drive.");
    }

    try {
      const location = resolveLocation();
      const settingsQuery = `name='${settingsFileName}' and 'appDataFolder' in parents and trashed=false`;
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
    upload,
    download,
    clearRemote
  };
})();
