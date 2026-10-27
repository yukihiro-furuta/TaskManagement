import type { Card } from '../../types/card'
import { KanbanCard } from '../KanbanCard/KanbanCard'
import styles from './KanbanColumn.module.css'

interface Props {
  label: string
  cards: Card[]
}

export function KanbanColumn({ label, cards }: Props) {
  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span className={styles.columnName}>{label}</span>
        <span className={styles.columnCount}>{cards.length}</span>
      </div>
      <div className={styles.cardsArea}>
        {cards.map(card => (
          <KanbanCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
