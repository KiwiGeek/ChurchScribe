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
  const SETTINGS_FILENAME = "scriptoria-settings.json";
  const NOTE_FILE_PREFIX = "scriptoria-note-";
  const NOTE_FILE_SUFFIX = ".json";
  const LEGACY_SETTINGS_FILENAME = "churchscribe-settings.json";
  const LEGACY_NOTE_FILE_PREFIX = "churchscribe-note-";
  const HANDLE_DB_NAME = "scriptoria-local-drive-db";
  const LEGACY_HANDLE_DB_NAME = "churchscribe-local-drive-db";
  const HANDLE_DB_VERSION = 1;
  const HANDLE_STORE_NAME = "handles";
  const HANDLE_KEY = "directory";

  let directoryHandle = null;
  let handleDbPromise = null;
  let legacyHandleDbCleanupPromise = null;
  let fileMigrationPromise = null;

  const deleteLegacyHandleDb = () => {
    if (HANDLE_DB_NAME === LEGACY_HANDLE_DB_NAME) {
      return Promise.resolve();
    }

    if (!legacyHandleDbCleanupPromise) {
      legacyHandleDbCleanupPromise = new Promise((resolve) => {
        const request = indexedDB.deleteDatabase(LEGACY_HANDLE_DB_NAME);

        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
        request.onblocked = () => resolve();
      });
    }

    return legacyHandleDbCleanupPromise;
  };

  const openHandleDb = () => {
    if (!handleDbPromise) {
      handleDbPromise = deleteLegacyHandleDb().then(() => new Promise((resolve, reject) => {
        const request = indexedDB.open(HANDLE_DB_NAME, HANDLE_DB_VERSION);

        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains(HANDLE_STORE_NAME)) {
            request.result.createObjectStore(HANDLE_STORE_NAME, { keyPath: "key" });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }));
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
      fileMigrationPromise = null;
      await ensureMigratedFiles();
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
    fileMigrationPromise = null;
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
      fileMigrationPromise = null;
      await ensureMigratedFiles();
      return { email: "" };
    }

    throw new Error("Permission to local folder not available. Click 'Choose Folder' to grant access.");
  };

  const getNoteFileName = (noteId) => `${NOTE_FILE_PREFIX}${noteId}${NOTE_FILE_SUFFIX}`;

  const getNoteIdFromFileName = (fileName) =>
    fileName.startsWith(NOTE_FILE_PREFIX) && fileName.endsWith(NOTE_FILE_SUFFIX)
      ? fileName.slice(NOTE_FILE_PREFIX.length, -NOTE_FILE_SUFFIX.length)
      : "";

  const getLegacyNoteIdFromFileName = (fileName) =>
    fileName.startsWith(LEGACY_NOTE_FILE_PREFIX) && fileName.endsWith(NOTE_FILE_SUFFIX)
      ? fileName.slice(LEGACY_NOTE_FILE_PREFIX.length, -NOTE_FILE_SUFFIX.length)
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

  const copyFile = async (sourceName, targetName) => {
    const sourceHandle = await directoryHandle.getFileHandle(sourceName);
    const sourceFile = await sourceHandle.getFile();
    const targetHandle = await directoryHandle.getFileHandle(targetName, { create: true });
    const writable = await targetHandle.createWritable();

    try {
      await writable.write(await sourceFile.text());
      await writable.close();
    } catch (error) {
      await writable.abort();
      throw error;
    }
  };

  const removeFileIfPresent = async (fileName) => {
    try {
      await directoryHandle.removeEntry(fileName);
    } catch (error) {
      if (error.name !== "NotFoundError") {
        throw error;
      }
    }
  };

  const migrateLegacyFiles = async () => {
    if (!directoryHandle) {
      return;
    }

    // TODO: Remove this legacy churchscribe-* file rename path after a couple of months.
    try {
      await directoryHandle.getFileHandle(LEGACY_SETTINGS_FILENAME);

      try {
        await directoryHandle.getFileHandle(SETTINGS_FILENAME);
        await removeFileIfPresent(LEGACY_SETTINGS_FILENAME);
      } catch (error) {
        if (error.name !== "NotFoundError") {
          throw error;
        }

        await copyFile(LEGACY_SETTINGS_FILENAME, SETTINGS_FILENAME);
        await removeFileIfPresent(LEGACY_SETTINGS_FILENAME);
      }
    } catch (error) {
      if (error.name !== "NotFoundError") {
        throw error;
      }
    }

    for await (const entry of directoryHandle.values()) {
      if (
        entry.kind !== "file" ||
        !entry.name.startsWith(LEGACY_NOTE_FILE_PREFIX) ||
        !entry.name.endsWith(NOTE_FILE_SUFFIX)
      ) {
        continue;
      }

      const noteId = getLegacyNoteIdFromFileName(entry.name);

      if (!noteId) {
        continue;
      }

      const targetName = getNoteFileName(noteId);

      if (targetName === entry.name) {
        continue;
      }

      try {
        await directoryHandle.getFileHandle(targetName);
        await removeFileIfPresent(entry.name);
      } catch (error) {
        if (error.name !== "NotFoundError") {
          throw error;
        }

        await copyFile(entry.name, targetName);
        await removeFileIfPresent(entry.name);
      }
    }
  };

  const ensureMigratedFiles = async () => {
    if (!directoryHandle) {
      return;
    }

    if (!fileMigrationPromise) {
      fileMigrationPromise = migrateLegacyFiles().catch((error) => {
        fileMigrationPromise = null;
        throw error;
      });
    }

    await fileMigrationPromise;
  };

  const listNoteFiles = async () => {
    await ensureMigratedFiles();
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

    await ensureMigratedFiles();
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
      await ensureMigratedFiles();
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

    await ensureMigratedFiles();
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
