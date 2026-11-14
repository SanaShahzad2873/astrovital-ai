import { MOCK_STATE } from './mockData'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export async function getAstronautState() {
  if (USE_MOCK) {
    await delay(400)
    return MOCK_STATE
  }
  return request('/api/astronaut/state')
}