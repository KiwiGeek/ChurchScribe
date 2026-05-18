// ── Scriptoria shared storage helpers ────────────────────────────────────────
// This module owns the IndexedDB layer that both index.html (app.js) and
// mobile.html (mobile.js) share.  Exposing it as window.ScriptoriaStorage
// removes the need for either entry point to define these utilities inline.
//
// Exports (all on window.ScriptoriaStorage):
//   legacyDbName, dbName, dbVersion, dbStoreName   — shared constants
//   openDatabase                                   — lazy-opens scriptoria-db
//   readStoredValue / writeStoredValue             — key-value read/write
//   deleteStoredValue                              — key-value delete
//   migrateLegacyPreference                        — localStorage → IDB migration
//   readMirroredPreference / writeMirroredPreference — localStorage mirror helpers
// ─────────────────────────────────────────────────────────────────────────────

window.ScriptoriaStorage = (() => {
  'use strict';

  // TODO: Remove legacyDbName migration after a future release when the old
  //       name can be retired.
  const legacyDbName = "churchscribe-db";
  const dbName       = "scriptoria-db";
  const dbVersion    = 1;
  const dbStoreName  = "kv";

  let dbPromise;

  const openDatabase = () => {
    if (!("indexedDB" in window)) {
      return Promise.reject(new Error("IndexedDB is not available in this browser."));
    }

    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = () => {
          const db = request.result;

          if (!db.objectStoreNames.contains(dbStoreName)) {
            db.createObjectStore(dbStoreName, { keyPath: "key" });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    return dbPromise;
  };

  const readStoredValue = async (key) => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(dbStoreName, "readonly");
      const store = transaction.objectStore(dbStoreName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  };

  const writeStoredValue = async (key, value) => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(dbStoreName, "readwrite");
      const store = transaction.objectStore(dbStoreName);
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const deleteStoredValue = async (key) => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(dbStoreName, "readwrite");
      const store = transaction.objectStore(dbStoreName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const migrateLegacyPreference = async (key, parser = (value) => value) => {
    const existingValue = await readStoredValue(key);

    if (typeof existingValue !== "undefined") {
      return existingValue;
    }

    const legacyValue = window.localStorage.getItem(key);

    if (legacyValue === null) {
      return undefined;
    }

    const parsedValue = parser(legacyValue);
    await writeStoredValue(key, parsedValue);
    window.localStorage.removeItem(key);
    return parsedValue;
  };

  const readMirroredPreference = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const writeMirroredPreference = (key, value) => {
    try {
      if (value == null) {
        window.localStorage.removeItem(key);
        return;
      }

      window.localStorage.setItem(key, String(value));
    } catch {
      // Ignore synchronous storage failures and fall back to IndexedDB-backed preferences.
    }
  };

  return {
    legacyDbName,
    dbName,
    dbVersion,
    dbStoreName,
    openDatabase,
    readStoredValue,
    writeStoredValue,
    deleteStoredValue,
    migrateLegacyPreference,
    readMirroredPreference,
    writeMirroredPreference
  };
})();
