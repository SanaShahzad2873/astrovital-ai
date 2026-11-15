import { MOCK_STATE } from './mockData'
import { getEngineState } from './engineAdapter'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
// Engine is on by default. Put VITE_USE_ENGINE=false in client/.env to go back to the old mock.
export const USE_ENGINE = import.meta.env.VITE_USE_ENGINE !== 'false'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

// VITE_USE_SERVER=true -> read from the Express API, and fall back to the in-browser engine if it is down.
export const USE_SERVER = import.meta.env.VITE_USE_SERVER === 'true'

export async function getAstronautState() {
  if (USE_SERVER) {
    try {
      return await request('/api/astronaut/state')
    } catch {
      return getEngineState()
    }
  }
  if (USE_ENGINE) {
    await delay(200)
    return getEngineState()
  }
  if (USE_MOCK) {
    await delay(400)
    return MOCK_STATE
  }
  return request('/api/astronaut/state')
}