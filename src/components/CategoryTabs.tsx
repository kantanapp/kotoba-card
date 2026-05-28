import type { Category } from '../hooks/useCategories'

interface Props {
  categories: Category[]
  selected: string | null
  onSelect: (id: string | null) => void
}

export function CategoryTabs({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
      <Tab label="すべて" active={selected === null} onClick={() => onSelect(null)} />
      {categories.map((cat) => (
        <Tab
          key={cat.id}
          label={cat.name}
          active={selected === cat.id}
          onClick={() => onSelect(cat.id)}
        />
      ))}
    </div>
  )
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
        active
          ? 'bg-sky-500 text-white shadow-md'
          : 'bg-white/80 text-gray-600 hover:bg-gray-100 active:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}
