export type CardPriority = 'high' | 'mid' | 'low'
export type CardStatus   = 'todo' | 'doing' | 'done'

export interface Card {
  id:          string
  title:       string
  description: string | null
  priority:    CardPriority
  dueDate:     string | null
  status:      CardStatus
  position:    number
  createdAt:   string
  updatedAt:   string
}
