import { getAll, saveRecord, deleteById } from './db.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Pehle local save, phir server ko bhejne ki koshish.
// Internet na ho to queue mein daal do.
export async function submitOfflineFirst(store, endpoint, data, source) {
  const local = await saveRecord(store, { ...data, source, synced: false });

  try {
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Server rejected the data');

    await saveRecord(store, { ...local, synced: true });
    return { saved: true, synced: true };
  } catch {
    await saveRecord('syncQueue', { id: local.id, store, endpoint, data, source });
    return { saved: true, synced: false };
  }
}

// Internet wapas aane par queue ka saaman server ko bhejo
export async function flushQueue() {
  const queue = await getAll('syncQueue');
  let sent = 0;

  for (const item of queue) {
    try {
      const res = await fetch(`${API}${item.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.data),
      });
      if (!res.ok) continue;

      await deleteById('syncQueue', item.id);
      sent++;
    } catch {
      break; // abhi bhi offline hai
    }
  }
  return sent;
}

export function startAutoSync() {
  window.addEventListener('online', flushQueue);
  if (navigator.onLine) flushQueue();
}