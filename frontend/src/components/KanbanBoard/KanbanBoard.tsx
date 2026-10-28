import { useRef } from 'react'
import type { Card, CardStatus } from '../../types/card'
import { moveCard } from '../../api/cardApi'
import { KanbanColumn } from '../KanbanColumn/KanbanColumn'
import styles from './KanbanBoard.module.css'

const COLUMNS: { status: CardStatus; label: string }[] = [
  { status: 'todo',  label: '未着手' },
  { status: 'doing', label: '作業中' },
  { status: 'done',  label: '完了'   },
]

interface Props {
  cards:        Card[]
  onCardMoved:  (updated: Card) => void
}

export function KanbanBoard({ cards, onCardMoved }: Props) {
  const draggingId = useRef<string | null>(null)

  function handleDragStart(cardId: string) {
    draggingId.current = cardId
  }

  async function handleDrop(toStatus: CardStatus) {
    const id = draggingId.current
    draggingId.current = null
    if (!id) return

    const card = cards.find(c => c.id === id)
    if (!card || card.status === toStatus) return

    const position = cards.filter(c => c.status === toStatus).length
    try {
      const updated = await moveCard(id, toStatus, position)
      onCardMoved(updated)
    } catch {
      // ドロップ失敗時は何もしない（状態は変わらない）
    }
  }

  return (
    <div className={styles.board}>
      {COLUMNS.map(col => {
        const colCards = cards
          .filter(c => c.status === col.status)
          .sort((a, b) => a.position - b.position)
        return (
          <KanbanColumn
            key={col.status}
            label={col.label}
            status={col.status}
            cards={colCards}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        )
      })}
    </div>
  )
}
