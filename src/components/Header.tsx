import { Menu } from 'lucide-react'

interface Props {
  onMenuOpen: () => void
}

// Small floating trigger button — top-right, minimal footprint
export function MenuButton({ onMenuOpen }: Props) {
  return (
    <button
      onClick={onMenuOpen}
      className="fixed top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur shadow-md active:scale-95 transition-transform"
      aria-label="メニューを開く"
    >
      <Menu size={22} className="text-gray-500" />
    </button>
  )
}
