import { GameData } from '../data/GameData.ts'

const API_TOKEN = GameData.apiToken;
const API_BASE_URL = GameData.apiBaseUrl

export async function read_ad() {
  const res = await fetch(`${API_BASE_URL}/coffee`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      },
    }
  )

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()
  return data
}


export async function get_lottery() {
  const res = await fetch(`${API_BASE_URL}/coffee`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      },
    }
  )

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()
  return data
}


