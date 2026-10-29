import { Fragment, useState } from 'react'
import type { Card, CardStatus } from '../../types/card'
import { KanbanCard } from '../KanbanCard/KanbanCard'
import styles from './KanbanColumn.module.css'

interface Props {
  label:       string
  status:      CardStatus
  cards:       Card[]
  onDragStart: (cardId: string) => void
  onDrop:      (toStatus: CardStatus, toIndex: number) => void
  onEdit:      (card: Card) => void
}

export function KanbanColumn({ label, status, cards, onDragStart, onDrop, onEdit }: Props) {
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  function handleAreaDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDropIndex(cards.length)
  }

  function handleCardDragOver(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault()
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setDropIndex(e.clientY < rect.top + rect.height / 2 ? index : index + 1)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropIndex(null)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const idx = dropIndex ?? cards.length
    setDropIndex(null)
    onDrop(status, idx)
  }

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span className={styles.columnName}>{label}</span>
        <span className={styles.columnCount}>{cards.length}</span>
      </div>
      <div
        className={`${styles.cardsArea} ${dropIndex !== null ? styles.dragOver : ''}`}
        onDragOver={handleAreaDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {cards.map((card, index) => (
          <Fragment key={card.id}>
            {dropIndex === index && <div className={styles.dropIndicator} />}
            <div
              className={styles.cardWrapper}
              onDragOver={e => handleCardDragOver(e, index)}
            >
              <KanbanCard card={card} onDragStart={onDragStart} onEdit={onEdit} />
            </div>
          </Fragment>
        ))}
        {dropIndex === cards.length && <div className={styles.dropIndicator} />}
      </div>
    </div>
  )
}
