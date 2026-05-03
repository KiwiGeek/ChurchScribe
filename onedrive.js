/**
 * OneDrive cloud storage provider for ChurchScribe.
 *
 * Exposes window.OneDriveProvider, which implements the StorageProvider interface.
 * Uses MSAL.js (loaded from CDN) for OAuth 2.0 authentication with Microsoft
 * identity platform, and the Microsoft Graph API for all file operations.
 *
 * See gdrive.js for the full StorageProvider interface documentation.
 *
 * ── Azure App Registration Setup ──────────────────────────────────────────────
 * You must create an app registration in Azure before this provider will work.
 *
 *  1. Visit https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade
 *  2. Click "New registration".
 *  3. Name: ChurchScribe (or any name you prefer).
 *  4. Supported account types: choose
 *       "Accounts in any organizational directory (Any Azure AD directory –
 *        Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)"
 *     so that personal OneDrive accounts (Outlook.com / Hotmail / Live) work too.
 *  5. Redirect URI platform: "Single-page application (SPA)".
 *     Redirect URI value: the exact origin + path where ChurchScribe is hosted,
 *     e.g. https://yoursite.example.com/index.html  or  http://localhost/index.html
 *     (Add every URL you deploy to; you can add more later under
 *      Authentication → "Single-page application" → "Add URI".)
 *  6. Click "Register".
 *  7. On the Overview page, copy the value labelled "Application (client) ID".
 *  8. Replace the placeholder below with that ID:
 *
 *       const clientId = "YOUR_AZURE_APP_CLIENT_ID";
 *
 *  9. Under "API permissions" → "Add a permission" → "Microsoft Graph"
 *     → "Delegated permissions", add:
 *       • Files.ReadWrite
 *       • User.Read
 *     (Both are low-privilege delegated scopes — no admin consent required for
 *      personal Microsoft accounts.)
 * 10. Save. Users will be prompted to consent on their first sign-in.
 * ──────────────────────────────────────────────────────────────────────────────
 */
(() => {
  const clientId = "YOUR_AZURE_APP_CLIENT_ID";
  const authority = "https://login.microsoftonline.com/common";
  const scopes = ["Files.ReadWrite", "User.Read"];

  const settingsFileName = "churchscribe-settings.json";
  const noteFilePrefix = "churchscribe-note-";
  const noteFileSuffix = ".json";

  let msalInstancePromise = null;
  let accessToken = null;
  let silentReconnectAttempted = false;

  const isAvailable = () => Boolean(window.msal?.PublicClientApplication);

  const hasActiveSession = () => Boolean(accessToken);

  const getMsalInstance = () => {
    if (!msalInstancePromise) {
      const instance = new window.msal.PublicClientApplication({
        auth: {
          clientId,
          authority,
          redirectUri: window.location.origin + window.location.pathname
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: false
        }
      });

      msalInstancePromise = instance.initialize().then(() => instance);
    }

    return msalInstancePromise;
  };

  const ensureTokenClient = () => {
    if (isAvailable()) {
      void getMsalInstance();
    }
  };

  const waitForReady = (onReady) => {
    if (isAvailable()) {
      ensureTokenClient();
      onReady();
      return;
    }

    window.setTimeout(() => waitForReady(onReady), 500);
  };

  const apiFetch = async (url, options = {}) => {
    if (!accessToken) {
      throw new Error("OneDrive is not connected in this browser session.");
    }

    const headers = new Headers(options.headers ?? {});
    headers.set("Authorization", `Bearer ${accessToken}`);

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorText = await response.text();
      const err = new Error(errorText || `OneDrive request failed with status ${response.status}.`);
      err.status = response.status;
      throw err;
    }

    return response;
  };

  const parseErrorMessage = (error) => {
    const fallback = "Unknown OneDrive error.";

    if (!(error instanceof Error)) {
      return fallback;
    }

    const message = error.message?.trim() || fallback;

    try {
      const parsed = JSON.parse(message);
      return parsed.error?.message || parsed.error?.innerError?.message || message;
    } catch {
      return message;
    }
  };

  const fetchUserEmail = async () => {
    const response = await apiFetch(
      "https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName"
    );
    const data = await response.json();
    return data.mail || data.userPrincipalName || "";
  };

  const connect = async () => {
    if (clientId === "YOUR_AZURE_APP_CLIENT_ID") {
      throw new Error(
        "OneDrive is not configured. Replace the clientId placeholder in onedrive.js " +
        "with your Azure App Registration client ID (see the setup instructions at the top of the file)."
      );
    }

    const msalInst = await getMsalInstance();

    try {
      const result = await msalInst.acquireTokenPopup({ scopes, prompt: "select_account" });
      accessToken = result.accessToken;
      const email = await fetchUserEmail().catch(() => "");
      return { email };
    } catch (error) {
      accessToken = null;
      throw new Error(parseErrorMessage(error));
    }
  };

  const disconnect = () => {
    accessToken = null;
    silentReconnectAttempted = false;

    if (msalInstancePromise) {
      const stalePromise = msalInstancePromise;
      msalInstancePromise = null;

      stalePromise.then((msalInst) => {
        const accounts = msalInst.getAllAccounts();

        if (!accounts.length) {
          return;
        }

        // Try silent logout (clears localStorage cache, no popup).
        // logoutSilent is available in MSAL.js 2.28+; fall back to clearCache.
        const logoutFn = typeof msalInst.logoutSilent === "function"
          ? () => msalInst.logoutSilent({ account: accounts[0] })
          : typeof msalInst.clearCache === "function"
            ? () => msalInst.clearCache()
            : () => Promise.resolve();

        void logoutFn().catch(() => {});
      }).catch(() => {});
    }
  };

  const attemptSilentReconnect = async () => {
    if (silentReconnectAttempted) {
      throw new Error("Silent reconnect already attempted this session.");
    }

    silentReconnectAttempted = true;

    const msalInst = await getMsalInstance();
    const accounts = msalInst.getAllAccounts();

    if (!accounts.length) {
      throw new Error("No OneDrive account found. Please connect first.");
    }

    try {
      const result = await msalInst.acquireTokenSilent({ scopes, account: accounts[0] });
      accessToken = result.accessToken;
      const email = await fetchUserEmail().catch(() => "");
      return { email };
    } catch {
      throw new Error("Silent reconnect failed. Please connect manually.");
    }
  };

  const getFolderPath = (settings) => {
    const raw = settings?.folderPath;
    return typeof raw === "string" && raw.trim() ? raw.trim() : "ChurchScribe";
  };

  const encodePath = (folderPath, fileName = "") => {
    const parts = folderPath.split("/").filter(Boolean).map(encodeURIComponent);

    if (fileName) {
      parts.push(encodeURIComponent(fileName));
    }

    return parts.join("/");
  };

  const getNoteFileName = (noteId) => `${noteFilePrefix}${noteId}${noteFileSuffix}`;

  const getNoteIdFromFileName = (fileName) =>
    fileName.startsWith(noteFilePrefix) && fileName.endsWith(noteFileSuffix)
      ? fileName.slice(noteFilePrefix.length, -noteFileSuffix.length)
      : "";

  // PUT file content by path — Graph creates the file (and any missing parent
  // folder segments) automatically when using the root: path-based endpoint.
  const upsertJsonFile = async (folderPath, fileName, payload) => {
    const encoded = encodePath(folderPath, fileName);
    const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${encoded}:/content`;

    const response = await apiFetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data.id ?? "";
  };

  const readJsonFile = async (fileId) => {
    const response = await apiFetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`
    );
    return response.json();
  };

  const listFolderItems = async (folderPath) => {
    // Note: fetches at most 1000 items per request (1 settings file + up to ~999
    // note files). For workspaces approaching that limit, implement Graph API
    // pagination via @odata.nextLink.
    try {
      const encoded = encodePath(folderPath);
      const response = await apiFetch(
        `https://graph.microsoft.com/v1.0/me/drive/root:/${encoded}:/children?$select=id,name&$top=1000`
      );
      const data = await response.json();
      return data.value ?? [];
    } catch (error) {
      if (error.status === 404) {
        return [];
      }

      throw error;
    }
  };

  const deleteFile = async (fileId) => {
    await apiFetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`, {
      method: "DELETE"
    });
  };

  const upload = async (payload, settings) => {
    try {
      const folderPath = getFolderPath(settings);

      const nextSettingsFileId = await upsertJsonFile(
        folderPath,
        settingsFileName,
        payload.settings
      );

      const existingItems = await listFolderItems(folderPath);
      const existingNoteByName = new Map(
        existingItems
          .filter((item) =>
            item.name.startsWith(noteFilePrefix) && item.name.endsWith(noteFileSuffix)
          )
          .map((item) => [item.name, item.id])
      );

      const desiredNoteFileNames = new Set();
      const nextNoteFileIds = {};

      for (const note of payload.notes.notes) {
        const fileName = getNoteFileName(note.id);
        desiredNoteFileNames.add(fileName);
        const fileId = await upsertJsonFile(folderPath, fileName, {
          version: 2,
          updatedAt: payload.updatedAt,
          note
        });
        nextNoteFileIds[note.id] = fileId;
      }

      await Promise.all(
        [...existingNoteByName.entries()]
          .filter(([name]) => !desiredNoteFileNames.has(name))
          .map(([name, id]) =>
            deleteFile(id).catch((error) => {
              console.warn(`[OneDrive] Failed to delete orphaned note file "${name}" (${id}): ${parseErrorMessage(error)}`);
            })
          )
      );

      return {
        remoteSettingsFileId: nextSettingsFileId,
        remoteNoteFileIds: nextNoteFileIds,
        remoteWorkspaceFileId: "",
        remoteWorkspaceParentId: folderPath
      };
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  const download = async (settings) => {
    try {
      const folderPath = getFolderPath(settings);
      const existingItems = await listFolderItems(folderPath);

      const settingsItem = existingItems.find((item) => item.name === settingsFileName);
      const noteItems = existingItems.filter(
        (item) =>
          item.name.startsWith(noteFilePrefix) && item.name.endsWith(noteFileSuffix)
      );

      if (!settingsItem && !noteItems.length) {
        return {
          data: null,
          remoteSettingsFileId: "",
          remoteNoteFileIds: {},
          remoteWorkspaceFileId: "",
          remoteWorkspaceParentId: folderPath
        };
      }

      let settingsPayload = {};
      let settingsFileId = settingsItem?.id ?? "";

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
        noteItems.map(async (item) => {
          const payload = await readJsonFile(item.id);
          return { item, payload };
        })
      );

      const notes = [];
      const nextNoteFileIds = {};
      const timestamps = [];

      if (settingsPayload.updatedAt) {
        timestamps.push(settingsPayload.updatedAt);
      }

      for (const { item, payload } of notePayloads) {
        const noteId = getNoteIdFromFileName(item.name) || payload.note?.id || payload.id;
        const note = payload.note ?? payload;

        if (!noteId || !note) {
          continue;
        }

        nextNoteFileIds[noteId] = item.id;
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
        remoteWorkspaceParentId: folderPath
      };
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  const getSettingsFields = () => [
    {
      key: "folderPath",
      label: "OneDrive Folder",
      type: "text",
      helpText: "Folder path within your OneDrive where ChurchScribe stores its files (e.g., ChurchScribe or Documents/ChurchScribe). The folder will be created automatically on first sync."
    }
  ];

  const getSettingsValues = () => ({
    folderPath: "ChurchScribe"
  });

  const applySettingChange = (key) => {
    if (key === "folderPath") {
      return { clearRemoteState: true };
    }

    return {};
  };

  const getLocationLabel = (settings) => getFolderPath(settings);

  window.OneDriveProvider = {
    id: "onedrive",
    displayName: "OneDrive",
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
