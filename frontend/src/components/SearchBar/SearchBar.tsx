import type { FilterValue } from '../../types/card'
import styles from './SearchBar.module.css'

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all',   label: '全て'  },
  { value: 'todo',  label: '未着手' },
  { value: 'doing', label: '作業中' },
  { value: 'done',  label: '完了'  },
]

interface Props {
  active: FilterValue
  onChange: (value: FilterValue) => void
}

export function SearchBar({ active, onChange }: Props) {
  return (
    <div className={styles.searchBar}>
      {FILTERS.map(f => (
        <button
          key={f.value}
          className={`${styles.filterBtn} ${active === f.value ? styles.active : ''}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
