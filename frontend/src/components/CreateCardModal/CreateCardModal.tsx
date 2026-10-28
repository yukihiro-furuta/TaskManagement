import { useState } from 'react'
import type { CardCreateInput } from '../../api/cardApi'
import type { CardPriority, CardStatus } from '../../types/card'
import styles from './CreateCardModal.module.css'

interface Props {
  onClose:  () => void
  onSubmit: (input: CardCreateInput) => Promise<void>
}

const INITIAL: CardCreateInput = {
  title:       '',
  description: '',
  priority:    'mid',
  dueDate:     null,
  status:      'todo',
}

export function CreateCardModal({ onClose, onSubmit }: Props) {
  const [form,    setForm]    = useState<CardCreateInput>(INITIAL)
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
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>新規カード登録</h2>
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
              {loading ? '登録中…' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
