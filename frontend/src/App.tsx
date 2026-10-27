import { useEffect, useState } from 'react'
import { fetchCards } from './api/cardApi'
import { SearchBar } from './components/SearchBar/SearchBar'
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard'
import type { Card, CardStatus } from './types/card'
import styles from './App.module.css'

type FilterValue = CardStatus | 'all'

export default function App() {
  const [cards,        setCards]        = useState<Card[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')

  useEffect(() => {
    setLoading(true)
    setError(null)
    const status = activeFilter === 'all' ? undefined : activeFilter
    fetchCards(status)
      .then(setCards)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [activeFilter])

  return (
    <>
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>タスク管理アプリ</h1>
        <span className={styles.totalCount}>
          総タスク数: <strong>{cards.length}</strong>
        </span>
      </header>
      <SearchBar active={activeFilter} onChange={setActiveFilter} />
      {loading && <div className={styles.status}>読み込み中…</div>}
      {error   && <div className={styles.statusError}>エラー: {error}</div>}
      {!loading && !error && <KanbanBoard cards={cards} />}
    </>
  )
}
