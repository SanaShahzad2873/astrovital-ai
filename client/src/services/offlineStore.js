import { openDB } from 'idb'

let dbPromise

function db() {
  if (!dbPromise) {
    dbPromise = openDB('astrovital-offline', 1, {
      upgrade(d) {
        d.createObjectStore('snapshots')
        d.createObjectStore('checkins', { keyPath: 'id', autoIncrement: true })
        d.createObjectStore('events', { keyPath: 'id', autoIncrement: true })
        d.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true })
      },
    })
  }
  return dbPromise
}

const newestFirst = (rows) => rows.slice().reverse()

export async function saveSnapshot(data, source) {
  const d = await db()
  await d.put('snapshots', { data, source, savedAt: new Date().toISOString() }, 'latest')
}
export async function getSnapshot() {
  return (await db()).get('snapshots', 'latest')
}

export async function addCheckin(entry) {
  const d = await db()
  await d.add('checkins', { ...entry, source: 'SELF_REPORTED', createdAt: new Date().toISOString() })
}
export async function listCheckins() {
  return newestFirst(await (await db()).getAll('checkins'))
}

export async function addEvent(entry) {
  const d = await db()
  await d.add('events', { ...entry, createdAt: new Date().toISOString() })
}
export async function listEvents() {
  return newestFirst(await (await db()).getAll('events'))
}

export async function queueReport(report) {
  const d = await db()
  await d.add('outbox', { ...report, status: 'queued', createdAt: new Date().toISOString() })
}
export async function listOutbox() {
  return newestFirst(await (await db()).getAll('outbox'))
}
export async function markOutboxSynced() {
  const d = await db()
  const rows = await d.getAll('outbox')
  const tx = d.transaction('outbox', 'readwrite')
  for (const r of rows) {
    if (r.status === 'queued') {
      await tx.store.put({ ...r, status: 'synced', syncedAt: new Date().toISOString() })
    }
  }
  await tx.done
}