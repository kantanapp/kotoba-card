import { Menu } from 'lucide-react'
import type { Lang } from '../hooks/useTTS'

interface Props {
  lang: Lang
  onMenuOpen: () => void
}

export function Header({ lang, onMenuOpen }: Props) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 backdrop-blur px-4 py-3 shadow-sm">
      <h1 className="text-xl font-bold text-sky-600 tracking-wide">ことばカード</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-400 uppercase">{lang}</span>
        <button
          onClick={onMenuOpen}
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="メニューを開く"
        >
          <Menu size={26} className="text-gray-600" />
        </button>
      </div>
    </header>
  )
}
