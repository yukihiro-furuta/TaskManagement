import { useState } from 'react'
import type { Card } from '../../types/card'
import styles from './KanbanCard.module.css'

const PRIORITY_ICON: Record<string, string> = { high: '🔴', mid: '🟡', low: '🟢' }

function classifyDue(dueDate: string | null): { text: string; cls: string } | null {
  if (!dueDate) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const [y, m, d] = dueDate.split('-').map(Number)
  const due  = new Date(y, m - 1, d)
  const diff = Math.ceil((due.getTime() - today.getTime()) / 86_400_000)
  const mm = String(m).padStart(2, '0'), dd = String(d).padStart(2, '0')
  if (diff < 0)   return { text: `期限超過 ${mm}/${dd}`, cls: styles.dueOver  }
  if (diff === 0) return { text: '今日',                  cls: styles.dueToday }
  if (diff <= 3)  return { text: `📅 ${mm}/${dd}`,        cls: styles.dueSoon  }
  return          { text: `📅 ${mm}/${dd}`,               cls: styles.dueNormal}
}

interface Props {
  card:        Card
  onDragStart: (cardId: string) => void
  onEdit:      (card: Card) => void
  onDelete:    (cardId: string) => void
}

export function KanbanCard({ card, onDragStart, onEdit, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false)
  const due = classifyDue(card.dueDate)

  return (
    <div
      className={styles.card}
      data-priority={card.priority}
      draggable={!confirming}
      onDragStart={() => onDragStart(card.id)}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <span className={styles.priorityDot}>{PRIORITY_ICON[card.priority]}</span>
          {card.title}
        </div>
        <div className={styles.cardActions}>
          <button
            className={styles.editBtn}
            onClick={e => { e.stopPropagation(); onEdit(card) }}
            onMouseDown={e => e.stopPropagation()}
            aria-label="編集"
          >
            ✏
          </button>
          <button
            className={styles.deleteBtn}
            onClick={e => { e.stopPropagation(); setConfirming(true) }}
            onMouseDown={e => e.stopPropagation()}
            aria-label="削除"
          >
            🗑
          </button>
        </div>
      </div>
      {card.description && (
        <div className={styles.cardDesc}>{card.description}</div>
      )}
      {due && (
        <div className={`${styles.cardDue} ${due.cls}`}>{due.text}</div>
      )}
      {confirming && (
        <div className={styles.confirmRow}>
          <span className={styles.confirmMsg}>削除しますか？</span>
          <button
            className={styles.confirmYes}
            onClick={e => { e.stopPropagation(); onDelete(card.id) }}
          >
            削除
          </button>
          <button
            className={styles.confirmNo}
            onClick={e => { e.stopPropagation(); setConfirming(false) }}
          >
            キャンセル
          </button>
        </div>
      )}
    </div>
  )
}
