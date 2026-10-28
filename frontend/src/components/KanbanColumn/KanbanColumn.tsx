import { useState } from 'react'
import type { Card, CardStatus } from '../../types/card'
import { KanbanCard } from '../KanbanCard/KanbanCard'
import styles from './KanbanColumn.module.css'

interface Props {
  label:       string
  status:      CardStatus
  cards:       Card[]
  onDragStart: (cardId: string) => void
  onDrop:      (toStatus: CardStatus) => void
}

export function KanbanColumn({ label, status, cards, onDragStart, onDrop }: Props) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span className={styles.columnName}>{label}</span>
        <span className={styles.columnCount}>{cards.length}</span>
      </div>
      <div
        className={`${styles.cardsArea} ${isDragOver ? styles.dragOver : ''}`}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={() => { setIsDragOver(false); onDrop(status) }}
      >
        {cards.map(card => (
          <KanbanCard key={card.id} card={card} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  )
}
