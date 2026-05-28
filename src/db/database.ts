import Dexie, { type Table } from 'dexie'
import { ulid } from 'ulid'

export interface Category {
  id: string
  name: string
  order: number
}

export interface Card {
  id: string
  categoryId: string
  imageData: string // base64
  textJa: string
  textEn: string
  order: number
}

class KotobaCardDB extends Dexie {
  categories!: Table<Category>
  cards!: Table<Card>

  constructor() {
    super('KotobaCardDB')
    this.version(1).stores({
      categories: 'id, order',
      cards: 'id, categoryId, order',
    })
  }
}

export const db = new KotobaCardDB()

// Seed default categories on first launch
db.on('populate', async () => {
  const defaults: Category[] = [
    { id: ulid(), name: 'たべもの', order: 0 },
    { id: ulid(), name: 'きもち', order: 1 },
    { id: ulid(), name: 'こうどう', order: 2 },
  ]
  await db.categories.bulkAdd(defaults)
})
