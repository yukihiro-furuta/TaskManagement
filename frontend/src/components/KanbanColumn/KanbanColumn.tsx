import { Fragment, useState } from 'react'
import type { Card, CardStatus } from '../../types/card'
import { KanbanCard } from '../KanbanCard/KanbanCard'
import styles from './KanbanColumn.module.css'

const PRIORITY_ORDER: Record<string, number> = { high: 0, mid: 1, low: 2 }

interface Props {
  label:       string
  status:      CardStatus
  cards:       Card[]
  onDragStart: (cardId: string) => void
  onDrop:      (toStatus: CardStatus, toIndex: number) => void
  onSort:      (sorted: Card[]) => void
  onEdit:      (card: Card) => void
  onDelete:    (cardId: string) => void
}

export function KanbanColumn({ label, status, cards, onDragStart, onDrop, onSort, onEdit, onDelete }: Props) {
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

  function handleSortByPriority() {
    const sorted = [...cards].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    onSort(sorted)
  }

  function handleSortByDueDate() {
    const sorted = [...cards].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    })
    onSort(sorted)
  }

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span className={styles.columnName}>{label}</span>
        <span className={styles.columnCount}>{cards.length}</span>
        <div className={styles.sortBtns}>
          <button className={styles.sortBtn} onClick={handleSortByPriority} title="優先度の高い順に並び替え">
            優先度↓
          </button>
          <button className={styles.sortBtn} onClick={handleSortByDueDate} title="期限の近い順に並び替え">
            期限↓
          </button>
        </div>
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
              <KanbanCard card={card} onDragStart={onDragStart} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </Fragment>
        ))}
        {dropIndex === cards.length && <div className={styles.dropIndicator} />}
      </div>
    </div>
  )
}
