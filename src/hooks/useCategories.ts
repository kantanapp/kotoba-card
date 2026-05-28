import { useLiveQuery } from 'dexie-react-hooks'
import { ulid } from 'ulid'
import { db, type Category } from '../db/database'

export function useCategories() {
  const categories = useLiveQuery(() => db.categories.orderBy('order').toArray(), []) ?? []

  const addCategory = async (name: string) => {
    const maxOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.order)) : -1
    await db.categories.add({ id: ulid(), name, order: maxOrder + 1 })
  }

  const updateCategory = async (id: string, name: string) => {
    await db.categories.update(id, { name })
  }

  const deleteCategory = async (id: string) => {
    await db.transaction('rw', db.categories, db.cards, async () => {
      await db.cards.where('categoryId').equals(id).delete()
      await db.categories.delete(id)
    })
  }

  return { categories, addCategory, updateCategory, deleteCategory }
}

export type { Category }
