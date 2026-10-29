import type { Card, CardPriority, CardStatus } from '../types/card'

export async function fetchCards(status?: CardStatus): Promise<Card[]> {
  const url = status ? `/api/cards?status=${status}` : '/api/cards'
  const res  = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<Card[]>
}

export interface CardCreateInput {
  title:       string
  description: string
  priority:    CardPriority
  dueDate:     string | null
  status:      CardStatus
}

export async function createCard(input: CardCreateInput): Promise<Card> {
  const res = await fetch('/api/cards', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<Card>
}

export async function moveCard(id: string, status: CardStatus, position: number): Promise<Card> {
  const res = await fetch(`/api/cards/${id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ status, position }),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<Card>
}

export interface CardUpdateInput {
  title:       string
  description: string | null
  priority:    CardPriority
  dueDate:     string | null
  status:      CardStatus
}

export async function updateCard(id: string, input: CardUpdateInput): Promise<Card> {
  const res = await fetch(`/api/cards/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<Card>
}

export async function reorderCards(items: { id: string; position: number }[]): Promise<void> {
  const res = await fetch('/api/cards/reorder', {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(items),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
}
