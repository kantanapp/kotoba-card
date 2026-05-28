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

// Seed default categories and sample cards on first launch
db.on('populate', async () => {
  const sampleCatId = ulid()
  const categories: Category[] = [
    { id: sampleCatId, name: 'さんぷる', order: 0 },
    { id: ulid(), name: 'たべもの', order: 1 },
    { id: ulid(), name: 'きもち', order: 2 },
    { id: ulid(), name: 'こうどう', order: 3 },
  ]
  await db.categories.bulkAdd(categories)

  const sampleCards = [
    { name: 'suimin_man', textJa: 'ねむる' },
    { name: 'ha_hamigaki_boy', textJa: 'はみがき' },
    { name: 'byebye_boy', textJa: 'いってきます' },
    { name: 'driving_blue', textJa: 'どらいぶ' },
    { name: 'oishii2_man', textJa: 'おいしい' },
    { name: 'syokuji_steak_man', textJa: 'たべたい' },
    { name: 'slump_bad_man_study', textJa: 'わからない' },
    { name: 'study_wakaru_boy', textJa: 'べんきょう' },
    { name: 'kids_hakusen', textJa: 'いってきます' },
    { name: 'shower_man', textJa: 'おふろ' },
    { name: 'hanko_taihenyokudekimashita', textJa: 'がんばった' },
    { name: 'tamashii_nukeru_man', textJa: 'つかれた' },
  ]
  await db.cards.bulkAdd(
    sampleCards.map((s, i) => ({
      id: ulid(),
      categoryId: sampleCatId,
      imageData: `/sample-cards/${s.name}.png`,
      textJa: s.textJa,
      textEn: '',
      order: i,
    }))
  )
})
