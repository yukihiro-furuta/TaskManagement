import type { Card, CardStatus } from '../types/card'

export async function fetchCards(status?: CardStatus): Promise<Card[]> {
  const url = status ? `/api/cards?status=${status}` : '/api/cards'
  const res  = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<Card[]>
}
