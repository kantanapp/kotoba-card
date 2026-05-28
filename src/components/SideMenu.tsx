import { useRef, useState } from 'react'
import { X, Plus, FolderOpen, Globe, Pencil, Trash2, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { Card } from '../hooks/useCards'
import type { Category } from '../hooks/useCategories'
import type { Lang } from '../hooks/useTTS'

interface Props {
  isOpen: boolean
  title: string
  cards: Card[]
  categories: Category[]
  lang: Lang
  onClose: () => void
  onTitleChange: (t: string) => void
  onAddCard: () => void
  onEditCard: (card: Card) => void
  onDeleteCard: (id: string) => void
  onManageCategories: () => void
  onToggleLang: () => void
}

export function SideMenu({
  isOpen,
  title,
  cards,
  categories,
  lang,
  onClose,
  onTitleChange,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onManageCategories,
  onToggleLang,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const startEdit = () => {
    setDraft(title)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const commitEdit = () => {
    onTitleChange(draft)
    setEditing(false)
  }

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? '—'

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with editable title */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex-1 min-w-0 mr-2">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEdit()
                    if (e.key === 'Escape') setEditing(false)
                  }}
                  className="flex-1 text-xl font-bold text-sky-600 bg-sky-50 border border-sky-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-sky-400 w-full"
                />
                <button
                  onClick={commitEdit}
                  className="p-1.5 rounded-lg bg-sky-500 text-white flex-shrink-0"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={startEdit}
                className="group flex items-center gap-1.5 text-left w-full"
              >
                <h1 className="text-xl font-bold text-sky-600 tracking-wide truncate">{title}</h1>
                <Pencil size={14} className="text-gray-300 group-hover:text-sky-400 flex-shrink-0 transition-colors" />
              </button>
            )}
            <p className="text-xs text-gray-400 mt-0.5">言語: {lang === 'ja' ? '日本語' : 'English'}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <QRCodeSVG value="https://kotoba-card.vercel.app" size={52} />
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X size={22} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-b space-y-2">
          <button
            onClick={() => { onAddCard(); onClose() }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-500 text-white font-bold active:bg-sky-600 transition-colors"
          >
            <Plus size={20} /> カードを追加
          </button>
          <button
            onClick={() => { onManageCategories(); onClose() }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold"
          >
            <FolderOpen size={20} /> カテゴリを管理
          </button>
          <button
            onClick={onToggleLang}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold"
          >
            <Globe size={20} />
            言語: {lang === 'ja' ? '日本語' : 'English'} → 切替
          </button>
        </div>

        {/* Card list */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">カード一覧</p>
          {cards.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">カードがありません</p>
          )}
          <div className="space-y-2">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100"
              >
                {card.imageData && (
                  <img
                    src={card.imageData}
                    alt={card.textJa}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-700 truncate">{card.textJa}</p>
                  <p className="text-xs text-gray-400">{getCategoryName(card.categoryId)}</p>
                </div>
                <button
                  onClick={() => onEditCard(card)}
                  className="p-1.5 rounded-lg hover:bg-white text-gray-400"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDeleteCard(card.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
