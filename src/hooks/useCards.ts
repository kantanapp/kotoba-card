import { useLiveQuery } from 'dexie-react-hooks'
import { ulid } from 'ulid'
import { db, type Card } from '../db/database'

export function useCards(categoryId?: string) {
  const cards = useLiveQuery(
    () => {
      const query = categoryId
        ? db.cards.where('categoryId').equals(categoryId)
        : db.cards.orderBy('order')
      return query.sortBy('order')
    },
    [categoryId],
  ) ?? []

  const addCard = async (data: Omit<Card, 'id' | 'order'>) => {
    const all = await db.cards.toArray()
    const maxOrder = all.length > 0 ? Math.max(...all.map((c) => c.order)) : -1
    await db.cards.add({ id: ulid(), ...data, order: maxOrder + 1 })
  }

  const updateCard = async (id: string, data: Partial<Omit<Card, 'id'>>) => {
    await db.cards.update(id, data)
  }

  const deleteCard = async (id: string) => {
    await db.cards.delete(id)
  }

  return { cards, addCard, updateCard, deleteCard }
}

export type { Card }
