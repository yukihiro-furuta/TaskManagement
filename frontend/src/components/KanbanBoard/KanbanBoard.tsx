import { useRef } from 'react'
import type { Card, CardStatus } from '../../types/card'
import { moveCard, reorderCards } from '../../api/cardApi'
import { KanbanColumn } from '../KanbanColumn/KanbanColumn'
import styles from './KanbanBoard.module.css'

const COLUMNS: { status: CardStatus; label: string }[] = [
  { status: 'todo',  label: '未着手' },
  { status: 'doing', label: '作業中' },
  { status: 'done',  label: '完了'   },
]

interface Props {
  cards:            Card[]
  onCardMoved:      (updated: Card) => void
  onCardsReordered: (updated: Card[]) => void
  onEdit:           (card: Card) => void
}

export function KanbanBoard({ cards, onCardMoved, onCardsReordered, onEdit }: Props) {
  const draggingId = useRef<string | null>(null)

  function handleDragStart(cardId: string) {
    draggingId.current = cardId
  }

  async function handleDrop(toStatus: CardStatus, toIndex: number) {
    const id = draggingId.current
    draggingId.current = null
    if (!id) return

    const card = cards.find(c => c.id === id)
    if (!card) return

    if (card.status === toStatus) {
      // 同カラム内並び替え
      const colCards = cards
        .filter(c => c.status === toStatus)
        .sort((a, b) => a.position - b.position)
      const fromIndex = colCards.findIndex(c => c.id === id)
      if (fromIndex === toIndex || fromIndex + 1 === toIndex) return

      const reordered = [...colCards]
      reordered.splice(fromIndex, 1)
      const insertAt = toIndex > fromIndex ? toIndex - 1 : toIndex
      reordered.splice(insertAt, 0, card)

      const items = reordered.map((c, i) => ({ id: c.id, position: i }))
      const updatedCards = cards.map(c => {
        const item = items.find(r => r.id === c.id)
        return item ? { ...c, position: item.position } : c
      })
      onCardsReordered(updatedCards)

      try {
        await reorderCards(items)
      } catch {
        // 失敗時はリロードで元に戻す（楽観的更新を簡易に戻さない）
      }
    } else {
      // カラム間移動（末尾に追加）
      const position = cards.filter(c => c.status === toStatus).length
      try {
        const updated = await moveCard(id, toStatus, position)
        onCardMoved(updated)
      } catch {
        // 失敗時は何もしない
      }
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
            onEdit={onEdit}
          />
        )
      })}
    </div>
  )
}
