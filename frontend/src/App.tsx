import { useEffect, useState } from 'react'
import { fetchCards, createCard, deleteCard } from './api/cardApi'
import type { CardCreateInput } from './api/cardApi'
import { SearchBar } from './components/SearchBar/SearchBar'
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard'
import { CreateCardModal } from './components/CreateCardModal/CreateCardModal'
import { EditCardModal } from './components/EditCardModal/EditCardModal'
import type { Card, FilterValue } from './types/card'
import styles from './App.module.css'

export default function App() {
  const [cards,        setCards]        = useState<Card[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')
  const [showModal,    setShowModal]    = useState(false)
  const [editingCard,  setEditingCard]  = useState<Card | null>(null)

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

  function handleCardsReordered(updated: Card[]) {
    setCards(updated)
  }

  function handleCardSaved(updated: Card) {
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
  }

  async function handleDelete(cardId: string) {
    try {
      await deleteCard(cardId)
      setCards(prev => prev.filter(c => c.id !== cardId))
    } catch (e) {
      setError(e instanceof Error ? e.message : '削除に失敗しました')
    }
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
      {!loading && !error && (
        <KanbanBoard
          cards={cards}
          onCardMoved={handleCardMoved}
          onCardsReordered={handleCardsReordered}
          onEdit={setEditingCard}
          onDelete={handleDelete}
          onError={setError}
        />
      )}
      {showModal && (
        <CreateCardModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
      {editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSave={handleCardSaved}
        />
      )}
    </>
  )
}
