/**
 * OneDrive cloud storage provider for ChurchScribe.
 *
 * Exposes window.OneDriveProvider, which implements the StorageProvider interface.
 * Uses MSAL.js (loaded from CDN) for OAuth 2.0 authentication with Microsoft
 * identity platform, and the Microsoft Graph API for all file operations.
 * Files are stored in OneDrive's per-app special folder (analogous to Google
 * Drive's appdata folder) using the Files.ReadWrite.AppFolder scope.
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
 *  8. Under "API permissions" → "Add a permission" → "Microsoft Graph"
 *     → "Delegated permissions", add:
 *       • Files.ReadWrite.AppFolder
 *       • User.Read
 *     (Both are low-privilege delegated scopes — no admin consent required for
 *      personal Microsoft accounts.)
 *  9. Save. Users will be prompted to consent on their first sign-in.
 * ──────────────────────────────────────────────────────────────────────────────
 */
(() => {
  const clientId = "60869d80-c4cb-4d64-a753-ddecd3bb2752";
  const authority = "https://login.microsoftonline.com/common";
  const scopes = ["Files.ReadWrite.AppFolder", "User.Read"];

  const GRAPH_BASE = "https://graph.microsoft.com/v1.0";
  const MSAL_POLL_INTERVAL_MS = 100;
  const MSAL_LOAD_TIMEOUT_MS = 10000;

  const settingsFileName = "churchscribe-settings.json";
  const noteFilePrefix = "churchscribe-note-";
  const noteFileSuffix = ".json";

  let msalInstancePromise = null;
  let accessToken = null;
  let silentReconnectAttempted = false;

  // The provider is always "available" — MSAL is a lazy CDN dependency that we
  // wait for inside getMsalInstance().  Returning true here keeps the connect
  // button enabled immediately and avoids a confusing "Storage provider not
  // available" message caused by the async CDN load race.
  const isAvailable = () => true;

  const hasActiveSession = () => Boolean(accessToken);

  // Waits (up to 10 s) for the MSAL CDN script to finish loading, then creates
  // and initialises a single PublicClientApplication instance.
  const getMsalInstance = () => {
    if (!msalInstancePromise) {
      msalInstancePromise = new Promise((resolve, reject) => {
        let elapsed = 0;

        const tryCreate = () => {
          if (window.msal?.PublicClientApplication) {
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

            instance.initialize().then(() => resolve(instance)).catch(reject);
            return;
          }

          elapsed += MSAL_POLL_INTERVAL_MS;

          if (elapsed >= MSAL_LOAD_TIMEOUT_MS) {
            reject(new Error(
              "MSAL library did not load. Check your internet connection and ensure " +
              "the msal-browser CDN script tag is present in index.html."
            ));
            return;
          }

          window.setTimeout(tryCreate, MSAL_POLL_INTERVAL_MS);
        };

        tryCreate();
      });
    }

    return msalInstancePromise;
  };

  const ensureTokenClient = () => {
    void getMsalInstance();
  };

  const waitForReady = (onReady) => {
    onReady();
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
      `${GRAPH_BASE}/me?$select=mail,userPrincipalName`
    );
    const data = await response.json();
    return data.mail || data.userPrincipalName || "";
  };

  const connect = async () => {
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

  const getNoteFileName = (noteId) => `${noteFilePrefix}${noteId}${noteFileSuffix}`;

  const getNoteIdFromFileName = (fileName) =>
    fileName.startsWith(noteFilePrefix) && fileName.endsWith(noteFileSuffix)
      ? fileName.slice(noteFilePrefix.length, -noteFileSuffix.length)
      : "";

  // PUT a JSON file into the app's special OneDrive folder (approot).
  // Graph creates the approot automatically on first access.
  const upsertJsonFile = async (fileName, payload) => {
    const url = `${GRAPH_BASE}/me/drive/special/approot:/${encodeURIComponent(fileName)}:/content`;

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
      `${GRAPH_BASE}/me/drive/items/${fileId}/content`
    );
    return response.json();
  };

  // Lists every item in the app's special OneDrive folder (approot) by
  // following @odata.nextLink pages until all results have been collected.
  const listAppRootItems = async () => {
    const items = [];

    try {
      let url = `${GRAPH_BASE}/me/drive/special/approot/children?$select=id,name&$top=1000`;

      while (url) {
        const response = await apiFetch(url);
        const data = await response.json();
        items.push(...(data.value ?? []));
        url = data["@odata.nextLink"] ?? null;
      }
    } catch (error) {
      if (error.status === 404) {
        return [];
      }

      throw error;
    }

    return items;
  };

  const deleteFile = async (fileId) => {
    await apiFetch(`${GRAPH_BASE}/me/drive/items/${fileId}`, {
      method: "DELETE"
    });
  };

  const upload = async (payload) => {
    try {
      const nextSettingsFileId = await upsertJsonFile(settingsFileName, payload.settings);

      const existingItems = await listAppRootItems();
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
        const fileId = await upsertJsonFile(fileName, {
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
        remoteWorkspaceParentId: ""
      };
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

  const download = async () => {
    try {
      const existingItems = await listAppRootItems();

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
          remoteWorkspaceParentId: ""
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
        // The note ID is extracted from the filename first (current format).
        // Falling back to payload.note?.id or payload.id handles files written
        // by older versions of the provider that may not have used this naming scheme.
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
        remoteWorkspaceParentId: ""
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
      throw new Error("Not connected to OneDrive.");
    }

    try {
      const items = await listAppRootItems();

      await Promise.all(
        items
          .filter((item) =>
            (item.name === settingsFileName ||
            (item.name.startsWith(noteFilePrefix) && item.name.endsWith(noteFileSuffix)))
          )
          .map((item) =>
            deleteFile(item.id).catch((error) => {
              console.warn(`[OneDrive] Failed to delete file "${item.name}" during clearRemote: ${parseErrorMessage(error)}`);
            })
          )
      );
    } catch (error) {
      throw new Error(parseErrorMessage(error));
    }
  };

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
    download,
    clearRemote
  };
})();
