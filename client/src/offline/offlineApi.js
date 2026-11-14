import { saveRecord, getById } from './db.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Returns { data, live, fetchedAt }
// live: true  = abhi server se aaya hua data
// live: false = purana saved data (isse "live" bilkul nahi dikhana)
export async function getWithCache(path) {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error('Bad response');

    const data = await res.json();
    const fetchedAt = new Date().toISOString();
    await saveRecord('cache', { id: path, data, fetchedAt, source: 'CACHED_API' });
    return { data, live: true, fetchedAt };
  } catch {
    const cached = await getById('cache', path);
    if (cached) return { data: cached.data, live: false, fetchedAt: cached.fetchedAt };
    return { data: null, live: false, fetchedAt: null };
  }
}