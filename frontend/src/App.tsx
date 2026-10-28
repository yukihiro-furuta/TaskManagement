import { useEffect, useState } from 'react'
import { fetchCards, createCard } from './api/cardApi'
import type { CardCreateInput } from './api/cardApi'
import { SearchBar } from './components/SearchBar/SearchBar'
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard'
import { CreateCardModal } from './components/CreateCardModal/CreateCardModal'
import type { Card, CardStatus } from './types/card'
import styles from './App.module.css'

type FilterValue = CardStatus | 'all'

export default function App() {
  const [cards,        setCards]        = useState<Card[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')
  const [showModal,    setShowModal]    = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const status = activeFilter === 'all' ? undefined : activeFilter
    fetchCards(status)
      .then(setCards)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [activeFilter])

  async function handleCreate(input: CardCreateInput) {
    const newCard = await createCard(input)
    setCards(prev => [...prev, newCard])
  }

  function handleCardMoved(updated: Card) {
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
  }

  return (
    <>
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>タスク管理アプリ</h1>
        <div className={styles.headerRight}>
          <span className={styles.totalCount}>
            総タスク数: <strong>{cards.length}</strong>
          </span>
          <button className={styles.createBtn} onClick={() => setShowModal(true)}>
            + 新規作成
          </button>
        </div>
      </header>
      <SearchBar active={activeFilter} onChange={setActiveFilter} />
      {loading && <div className={styles.status}>読み込み中…</div>}
      {error   && <div className={styles.statusError}>エラー: {error}</div>}
      {!loading && !error && <KanbanBoard cards={cards} onCardMoved={handleCardMoved} />}
      {showModal && (
        <CreateCardModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </>
  )
}
