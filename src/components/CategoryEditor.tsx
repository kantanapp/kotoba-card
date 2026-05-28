import { useState } from 'react'
import { X, Plus, Pencil, Trash2, Check } from 'lucide-react'
import type { Category } from '../hooks/useCategories'

interface Props {
  categories: Category[]
  onAdd: (name: string) => void
  onUpdate: (id: string, name: string) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function CategoryEditor({ categories, onAdd, onUpdate, onDelete, onClose }: Props) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    onAdd(newName.trim())
    setNewName('')
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditingName(cat.name)
  }

  const commitEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdate(editingId, editingName.trim())
    }
    setEditingId(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">カテゴリを管理</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-3 overflow-y-auto max-h-[60vh]">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              {editingId === cat.id ? (
                <>
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
                    className="flex-1 border border-sky-400 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <button
                    onClick={commitEdit}
                    className="p-2 rounded-lg bg-sky-500 text-white"
                  >
                    <Check size={18} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-base font-medium text-gray-700 px-3 py-2 bg-gray-50 rounded-lg">
                    {cat.name}
                  </span>
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          ))}

          {/* Add new category */}
          <div className="flex gap-2 pt-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="新しいカテゴリ名"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="p-2 rounded-lg bg-sky-500 text-white disabled:opacity-40"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 border-t safe-bottom">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
