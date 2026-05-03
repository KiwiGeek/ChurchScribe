/**
 * Local Drive storage provider for ChurchScribe.
 *
 * Exposes window.LocalDriveProvider, which implements the StorageProvider interface.
 * Uses the File System Access API to read/write a workspace file in a user-chosen
 * local folder. The chosen directory handle is persisted to IndexedDB so the app
 * can restore access across page loads (subject to browser permission state).
 *
 * See gdrive.js for the full StorageProvider interface documentation.
 */
(() => {
  const WORKSPACE_FILENAME = "churchscribe-workspace.json";
  const HANDLE_DB_NAME = "churchscribe-local-drive-db";
  const HANDLE_DB_VERSION = 1;
  const HANDLE_STORE_NAME = "handles";
  const HANDLE_KEY = "directory";

  let directoryHandle = null;
  let handleDbPromise = null;

  const openHandleDb = () => {
    if (!handleDbPromise) {
      handleDbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(HANDLE_DB_NAME, HANDLE_DB_VERSION);

        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains(HANDLE_STORE_NAME)) {
            request.result.createObjectStore(HANDLE_STORE_NAME, { keyPath: "key" });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    return handleDbPromise;
  };

  const loadStoredHandle = async () => {
    try {
      const db = await openHandleDb();

      return await new Promise((resolve, reject) => {
        const tx = db.transaction(HANDLE_STORE_NAME, "readonly");
        const store = tx.objectStore(HANDLE_STORE_NAME);
        const req = store.get(HANDLE_KEY);

        req.onsuccess = () => resolve(req.result?.handle ?? null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  };

  const saveHandle = async (handle) => {
    const db = await openHandleDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(HANDLE_STORE_NAME, "readwrite");
      const store = tx.objectStore(HANDLE_STORE_NAME);
      const req = store.put({ key: HANDLE_KEY, handle });

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  };

  const clearStoredHandle = async () => {
    try {
      const db = await openHandleDb();

      await new Promise((resolve, reject) => {
        const tx = db.transaction(HANDLE_STORE_NAME, "readwrite");
        const store = tx.objectStore(HANDLE_STORE_NAME);
        const req = store.delete(HANDLE_KEY);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Ignore errors when clearing
    }
  };

  const isAvailable = () => "showDirectoryPicker" in window;

  const hasActiveSession = () => directoryHandle !== null;

  const ensureTokenClient = () => {};

  const waitForReady = (onReady) => {
    onReady();
  };

  const connect = async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      directoryHandle = handle;
      await saveHandle(handle);
      return { email: "" };
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Folder selection was cancelled.");
      }

      throw error;
    }
  };

  const disconnect = () => {
    directoryHandle = null;
    void clearStoredHandle();
  };

  const attemptSilentReconnect = async () => {
    const storedHandle = await loadStoredHandle();

    if (!storedHandle) {
      throw new Error("No local folder configured.");
    }

    const permission = await storedHandle.queryPermission({ mode: "readwrite" });

    if (permission === "granted") {
      directoryHandle = storedHandle;
      return { email: "" };
    }

    throw new Error("Permission to local folder not available. Click 'Choose Folder' to grant access.");
  };

  const upload = async (payload) => {
    if (!directoryHandle) {
      throw new Error("No local folder selected. Choose a folder first.");
    }

    const fileHandle = await directoryHandle.getFileHandle(WORKSPACE_FILENAME, { create: true });
    const writable = await fileHandle.createWritable();

    try {
      await writable.write(JSON.stringify(payload, null, 2));
      await writable.close();
    } catch (error) {
      await writable.abort();
      throw error;
    }

    return {
      remoteWorkspaceFileId: WORKSPACE_FILENAME,
      remoteWorkspaceParentId: directoryHandle.name
    };
  };

  const download = async () => {
    if (!directoryHandle) {
      return { data: null, remoteWorkspaceFileId: "", remoteWorkspaceParentId: "" };
    }

    try {
      const fileHandle = await directoryHandle.getFileHandle(WORKSPACE_FILENAME);
      const file = await fileHandle.getFile();
      const text = await file.text();
      const data = JSON.parse(text);

      return {
        data,
        remoteWorkspaceFileId: WORKSPACE_FILENAME,
        remoteWorkspaceParentId: directoryHandle.name
      };
    } catch (error) {
      if (error.name === "NotFoundError") {
        return {
          data: null,
          remoteWorkspaceFileId: "",
          remoteWorkspaceParentId: directoryHandle.name
        };
      }

      throw error;
    }
  };

  const getSettingsFields = () => [];

  const getSettingsValues = () => ({});

  const applySettingChange = () => ({});

  const getLocationLabel = () => directoryHandle ? directoryHandle.name : "";

  window.LocalDriveProvider = {
    id: "local-drive",
    displayName: "Local Drive",
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
