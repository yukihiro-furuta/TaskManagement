import { useState } from 'react'
import { updateCard } from '../../api/cardApi'
import type { CardUpdateInput } from '../../api/cardApi'
import type { Card, CardPriority, CardStatus } from '../../types/card'
import styles from './EditCardModal.module.css'

interface Props {
  card:    Card
  onClose: () => void
  onSave:  (updated: Card) => void
}

export function EditCardModal({ card, onClose, onSave }: Props) {
  const [form, setForm] = useState<CardUpdateInput>({
    title:       card.title,
    description: card.description,
    priority:    card.priority as CardPriority,
    dueDate:     card.dueDate,
    status:      card.status as CardStatus,
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value === '' ? null : value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const updated = await updateCard(card.id, form)
      onSave(updated)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>カード編集</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="閉じる">✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            タイトル <span className={styles.required}>*</span>
            <input
              className={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              required
              autoFocus
            />
          </label>

          <label className={styles.label}>
            説明
            <textarea
              className={styles.textarea}
              name="description"
              value={form.description ?? ''}
              onChange={handleChange}
              maxLength={500}
              rows={3}
            />
          </label>

          <div className={styles.row}>
            <label className={styles.label}>
              優先度 <span className={styles.required}>*</span>
              <select
                className={styles.select}
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="high">高 (high)</option>
                <option value="mid">中 (mid)</option>
                <option value="low">低 (low)</option>
              </select>
            </label>

            <label className={styles.label}>
              ステータス <span className={styles.required}>*</span>
              <select
                className={styles.select}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="todo">未着手</option>
                <option value="doing">作業中</option>
                <option value="done">完了</option>
              </select>
            </label>
          </div>

          <label className={styles.label}>
            期限日
            <input
              className={styles.input}
              type="date"
              name="dueDate"
              value={form.dueDate ?? ''}
              onChange={handleChange}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
              キャンセル
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading || !form.title.trim()}>
              {loading ? '更新中…' : '更新する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
