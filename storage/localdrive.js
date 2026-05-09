/**
 * Local Drive storage provider for Scriptoria.
 *
 * Exposes window.LocalDriveProvider, which implements the StorageProvider interface.
 * Uses the File System Access API to read/write a settings file plus one file per
 * note in a user-chosen local folder. The chosen directory handle is persisted to
 * IndexedDB so the app can restore access across page loads (subject to browser
 * permission state).
 *
 * See gdrive.js for the full StorageProvider interface documentation.
 */
(() => {
  const SETTINGS_FILENAME = "churchscribe-settings.json";
  const NOTE_FILE_PREFIX = "churchscribe-note-";
  const NOTE_FILE_SUFFIX = ".json";
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

  const getNoteFileName = (noteId) => `${NOTE_FILE_PREFIX}${noteId}${NOTE_FILE_SUFFIX}`;

  const getNoteIdFromFileName = (fileName) =>
    fileName.startsWith(NOTE_FILE_PREFIX) && fileName.endsWith(NOTE_FILE_SUFFIX)
      ? fileName.slice(NOTE_FILE_PREFIX.length, -NOTE_FILE_SUFFIX.length)
      : "";

  const writeJsonFile = async (fileName, payload) => {
    const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();

    try {
      await writable.write(JSON.stringify(payload, null, 2));
      await writable.close();
    } catch (error) {
      await writable.abort();
      throw error;
    }
  };

  const readJsonFile = async (fileName) => {
    const fileHandle = await directoryHandle.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    const text = await file.text();
    return JSON.parse(text);
  };

  const listNoteFiles = async () => {
    const files = [];

    for await (const entry of directoryHandle.values()) {
      if (entry.kind === "file" && entry.name.startsWith(NOTE_FILE_PREFIX) && entry.name.endsWith(NOTE_FILE_SUFFIX)) {
        files.push(entry.name);
      }
    }

    return files;
  };

  const upload = async (payload) => {
    if (!directoryHandle) {
      throw new Error("No local folder selected. Choose a folder first.");
    }

    await writeJsonFile(SETTINGS_FILENAME, payload.settings);

    const existingNoteFiles = await listNoteFiles();
    const desiredNoteFiles = new Set();
    const remoteNoteFileIds = {};

    for (const note of payload.notes.notes) {
      const fileName = getNoteFileName(note.id);
      desiredNoteFiles.add(fileName);
      remoteNoteFileIds[note.id] = fileName;
      await writeJsonFile(fileName, {
        version: 2,
        updatedAt: payload.updatedAt,
        note
      });
    }

    await Promise.all(
      existingNoteFiles
        .filter((fileName) => !desiredNoteFiles.has(fileName))
        .map((fileName) => directoryHandle.removeEntry(fileName))
    );

    return {
      remoteSettingsFileId: SETTINGS_FILENAME,
      remoteNoteFileIds,
      remoteWorkspaceFileId: "",
      remoteWorkspaceParentId: directoryHandle.name
    };
  };

  const download = async () => {
    if (!directoryHandle) {
      return {
        data: null,
        remoteSettingsFileId: "",
        remoteNoteFileIds: {},
        remoteWorkspaceFileId: "",
        remoteWorkspaceParentId: ""
      };
    }

    try {
      const noteFiles = await listNoteFiles();
      let settingsPayload = {};

      try {
        settingsPayload = await readJsonFile(SETTINGS_FILENAME);
      } catch (error) {
        if (error.name !== "NotFoundError") {
          throw error;
        }
      }

      if (!Object.keys(settingsPayload).length && !noteFiles.length) {
        return {
          data: null,
          remoteSettingsFileId: "",
          remoteNoteFileIds: {},
          remoteWorkspaceFileId: "",
          remoteWorkspaceParentId: directoryHandle.name
        };
      }

      const notes = [];
      const remoteNoteFileIds = {};
      const timestamps = [];

      if (settingsPayload.updatedAt) {
        timestamps.push(settingsPayload.updatedAt);
      }

      for (const fileName of noteFiles) {
        const payload = await readJsonFile(fileName);
        const noteId = getNoteIdFromFileName(fileName) || payload.note?.id || payload.id;
        const note = payload.note ?? payload;

        if (!noteId || !note) {
          continue;
        }

        remoteNoteFileIds[noteId] = fileName;
        notes.push(note);
        timestamps.push(payload.updatedAt ?? note.updatedAt);
      }

      const latestUpdatedAt = timestamps
        .filter(Boolean)
        .sort((left, right) => new Date(right) - new Date(left))[0] ?? null;

      const data = {
        ...settingsPayload,
        updatedAt: latestUpdatedAt,
        notes
      };

      return {
        data,
        remoteSettingsFileId: Object.keys(settingsPayload).length ? SETTINGS_FILENAME : "",
        remoteNoteFileIds,
        remoteWorkspaceFileId: "",
        remoteWorkspaceParentId: directoryHandle.name
      };
    } catch (error) {
      throw error;
    }
  };

  const getSettingsFields = () => [];

  const getSettingsValues = () => ({});

  const applySettingChange = () => ({});

  const getLocationLabel = () => directoryHandle !== null ? directoryHandle.name : "";

  const clearRemote = async () => {
    if (!directoryHandle) {
      throw new Error("No local folder selected.");
    }

    const noteFiles = await listNoteFiles();

    await Promise.all([
      ...noteFiles.map((fileName) => directoryHandle.removeEntry(fileName)),
      directoryHandle.removeEntry(SETTINGS_FILENAME).catch((error) => {
        if (error.name !== "NotFoundError") {
          throw error;
        }
      })
    ]);
  };

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
    download,
    clearRemote
  };
})();
