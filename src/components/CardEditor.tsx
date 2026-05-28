import { useRef, useState } from 'react'
import { X, ImagePlus } from 'lucide-react'
import type { Card } from '../hooks/useCards'
import type { Category } from '../hooks/useCategories'

interface Props {
  card?: Card
  categories: Category[]
  onSave: (data: Omit<Card, 'id' | 'order'>) => void
  onClose: () => void
}

export function CardEditor({ card, categories, onSave, onClose }: Props) {
  const [imageData, setImageData] = useState(card?.imageData ?? '')
  const [textJa, setTextJa] = useState(card?.textJa ?? '')
  const [textEn, setTextEn] = useState(card?.textEn ?? '')
  const [categoryId, setCategoryId] = useState(card?.categoryId ?? (categories[0]?.id ?? ''))
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImageData(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!textJa.trim()) return
    onSave({ imageData, textJa: textJa.trim(), textEn: textEn.trim(), categoryId })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{card ? 'カードを編集' : 'カードを追加'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Image picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">画像・イラスト</label>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-sky-400 hover:bg-sky-50 transition-colors overflow-hidden"
            >
              {imageData ? (
                <img src={imageData} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <ImagePlus size={32} className="text-gray-400" />
                  <span className="text-sm text-gray-400">タップして画像を選択</span>
                </>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </div>

          {/* Japanese text */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              日本語テキスト <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={textJa}
              onChange={(e) => setTextJa(e.target.value)}
              placeholder="例：りんご"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* English text */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              英語テキスト（任意）
            </label>
            <input
              type="text"
              value={textEn}
              onChange={(e) => setTextEn(e.target.value)}
              placeholder="例：Apple"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">カテゴリ</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t flex gap-3 safe-bottom">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!textJa.trim()}
            className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed active:bg-sky-600 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
