const DB_NAME = 'astrovital';
const DB_VERSION = 1;

export const STORES = [
  'profiles',
  'checkins',
  'telemetry',
  'nasaDatasets',
  'alerts',
  'exerciseLogs',
  'sleepRecords',
  'reactionTests',
  'blackoutEvents',
  'cache',
  'syncQueue',
];

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id' });
        }
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run(store, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const request = fn(tx.objectStore(store));
    tx.oncomplete = () => resolve(request ? request.result : undefined);
    tx.onerror = () => reject(tx.error);
  });
}

// Har record ke paas id, source label aur timestamp hona zaroori hai
export async function saveRecord(store, record) {
  if (!record.source) throw new Error('Record needs a source label');

  const full = {
    ...record,
    id: record.id || `${store}-${Date.now()}`,
    timestamp: record.timestamp || new Date().toISOString(),
    savedAt: new Date().toISOString(),
  };

  await run(store, 'readwrite', (s) => s.put(full));
  return full;
}

export const getAll = (store) => run(store, 'readonly', (s) => s.getAll());
export const getById = (store, id) => run(store, 'readonly', (s) => s.get(id));
export const deleteById = (store, id) => run(store, 'readwrite', (s) => s.delete(id));