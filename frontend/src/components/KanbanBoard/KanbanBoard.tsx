import type { Card, CardStatus } from '../../types/card'
import { KanbanColumn } from '../KanbanColumn/KanbanColumn'
import styles from './KanbanBoard.module.css'

const COLUMNS: { status: CardStatus; label: string }[] = [
  { status: 'todo',  label: '未着手' },
  { status: 'doing', label: '作業中' },
  { status: 'done',  label: '完了'   },
]

interface Props { cards: Card[] }

export function KanbanBoard({ cards }: Props) {
  return (
    <div className={styles.board}>
      {COLUMNS.map(col => {
        const colCards = cards
          .filter(c => c.status === col.status)
          .sort((a, b) => a.position - b.position)
        return (
          <KanbanColumn key={col.status} label={col.label} cards={colCards} />
        )
      })}
    </div>
  )
}
