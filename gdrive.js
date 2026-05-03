/**
 * Google Drive cloud storage provider for ChurchScribe.
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
 *     user's email address. Throws on failure.
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
 *     Saves payload to the remote workspace file.
 *     Returns the (possibly updated) file/folder identifiers.
 *
 *   download(settings: ProviderSettings): Promise<{ data: object | null } & ProviderResult>
 *     Fetches the remote workspace file.
 *     Returns the parsed data (null if no file exists yet) and the identifiers.
 *
 * ProviderSettings:
 *   [providerKey: string]: unknown  — provider-specific settings (from getSettingsValues)
 *   remoteWorkspaceFileId: string   — cached file ID (empty string if unknown)
 *   remoteWorkspaceParentId: string — cached parent folder ID (empty string if unknown)
 *
 * ProviderResult:
 *   remoteWorkspaceFileId: string
 *   remoteWorkspaceParentId: string
 */
(() => {
  const clientId = "711830335817-2enpiqrmso0sqgq2fnh8o4ef4r60ede0.apps.googleusercontent.com";
  const workspaceFileName = "churchscribe-workspace.json";
  const scopes = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/drive.file"
  ].join(" ");

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
      throw new Error(errorText || `Google Drive request failed with ${response.status}.`);
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

  const ensureVisibleDriveFolderId = async (cachedParentId) => {
    if (cachedParentId) {
      return cachedParentId;
    }

    const query = encodeURIComponent(
      "name='ChurchScribe' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    );
    const listResponse = await apiFetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name)`
    );
    const listPayload = await listResponse.json();
    const existingFolderId = listPayload.files?.[0]?.id ?? "";

    if (existingFolderId) {
      return existingFolderId;
    }

    const createResponse = await apiFetch(
      "https://www.googleapis.com/drive/v3/files?fields=id",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "ChurchScribe",
          mimeType: "application/vnd.google-apps.folder"
        })
      }
    );
    const createdFolder = await createResponse.json();
    return createdFolder.id ?? "";
  };

  const resolveLocation = async (useVisibleDriveFolder, cachedParentId) => {
    if (useVisibleDriveFolder) {
      const folderId = await ensureVisibleDriveFolderId(cachedParentId);
      return {
        spaces: "drive",
        parents: [folderId],
        query: `name='${workspaceFileName}' and '${folderId}' in parents and trashed=false`,
        remoteWorkspaceParentId: folderId
      };
    }

    return {
      spaces: "appDataFolder",
      parents: ["appDataFolder"],
      query: `name='${workspaceFileName}' and 'appDataFolder' in parents and trashed=false`,
      remoteWorkspaceParentId: ""
    };
  };

  const findWorkspaceFileId = async (cachedFileId, location) => {
    if (cachedFileId) {
      return cachedFileId;
    }

    const query = encodeURIComponent(location.query);
    const response = await apiFetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=${location.spaces}&fields=files(id,name)`
    );
    const payload = await response.json();
    return payload.files?.[0]?.id ?? "";
  };

  const fetchUserEmail = async () => {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error("Unable to load Google account information.");
    }

    const data = await response.json();
    return data.email ?? "";
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

  const upload = async (payload, { useVisibleDriveFolder, remoteWorkspaceFileId, remoteWorkspaceParentId }) => {
    try {
      const location = await resolveLocation(useVisibleDriveFolder, remoteWorkspaceParentId);
      const updatedParentId = location.remoteWorkspaceParentId;
      let fileId = await findWorkspaceFileId(remoteWorkspaceFileId, location);

      if (fileId) {
        const multipart = buildMultipartJsonBody({ mimeType: "application/json" }, payload);
        await apiFetch(
          `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart&fields=id`,
          {
            method: "PATCH",
            headers: { "Content-Type": multipart.contentType },
            body: multipart.body
          }
        );

        return { remoteWorkspaceFileId: fileId, remoteWorkspaceParentId: updatedParentId };
      }

      const multipart = buildMultipartJsonBody(
        {
          name: workspaceFileName,
          parents: location.parents,
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
      fileId = responsePayload.id ?? "";

      return { remoteWorkspaceFileId: fileId, remoteWorkspaceParentId: updatedParentId };
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  const download = async ({ useVisibleDriveFolder, remoteWorkspaceFileId, remoteWorkspaceParentId }) => {
    try {
      const location = await resolveLocation(useVisibleDriveFolder, remoteWorkspaceParentId);
      const updatedParentId = location.remoteWorkspaceParentId;
      const fileId = await findWorkspaceFileId(remoteWorkspaceFileId, location);

      if (!fileId) {
        return { data: null, remoteWorkspaceFileId: "", remoteWorkspaceParentId: updatedParentId };
      }

      const response = await apiFetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`
      );
      const data = await response.json();

      return { data, remoteWorkspaceFileId: fileId, remoteWorkspaceParentId: updatedParentId };
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  const getSettingsFields = () => [
    {
      key: "useVisibleDriveFolder",
      label: "Visible Drive Folder",
      type: "checkbox",
      helpText: "Store files in a user-visible \"ChurchScribe\" folder in Google Drive instead of hidden app storage. Useful for testing and manual inspection of synced files."
    }
  ];

  const getSettingsValues = () => ({
    useVisibleDriveFolder: false
  });

  const applySettingChange = (key, _value) => {
    if (key === "useVisibleDriveFolder") {
      return { clearRemoteState: true };
    }

    return {};
  };

  const getLocationLabel = (settings) =>
    settings.useVisibleDriveFolder ? "visible Drive folder" : "hidden app storage";

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
    download
  };
})();
