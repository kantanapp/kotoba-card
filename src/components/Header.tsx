import { Menu } from 'lucide-react'

interface Props {
  onMenuOpen: () => void
}

export function MenuButton({ onMenuOpen }: Props) {
  return (
    <button
      onClick={onMenuOpen}
      className="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
      aria-label="メニューを開く"
    >
      <Menu size={24} className="text-gray-500" />
    </button>
  )
}
