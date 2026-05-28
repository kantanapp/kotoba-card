import Dexie, { type Table, type Transaction } from 'dexie'
import { ulid } from 'ulid'

export interface Category {
  id: string
  name: string
  order: number
}

export interface Card {
  id: string
  categoryId: string
  imageData: string // base64 or URL path
  textJa: string
  textEn: string
  order: number
}

const SAMPLE_CARDS = [
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

async function seedSampleCards(
  categoriesTable: Pick<Table<Category>, 'add'>,
  cardsTable: Pick<Table<Card>, 'bulkAdd'>
) {
  const sampleCatId = ulid()
  await categoriesTable.add({ id: sampleCatId, name: 'さんぷる', order: 0 })
  await cardsTable.bulkAdd(
    SAMPLE_CARDS.map((s, i) => ({
      id: ulid(),
      categoryId: sampleCatId,
      imageData: `/sample-cards/${s.name}.png`,
      textJa: s.textJa,
      textEn: '',
      order: i,
    }))
  )
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
    // v2: migrate existing users — seed sample cards if no cards exist
    this.version(2).stores({
      categories: 'id, order',
      cards: 'id, categoryId, order',
    }).upgrade(async (tx: Transaction) => {
      const count = await tx.table('cards').count()
      if (count === 0) {
        await seedSampleCards(tx.table('categories'), tx.table('cards'))
      }
    })
    // v3: fix category order — さんぷる(0) たべもの(1) きもち(2) こうどう(3)
    this.version(3).stores({
      categories: 'id, order',
      cards: 'id, categoryId, order',
    }).upgrade(async (tx: Transaction) => {
      const orderMap: Record<string, number> = {
        'さんぷる': 0,
        'たべもの': 1,
        'きもち': 2,
        'こうどう': 3,
      }
      const cats = await tx.table('categories').toArray()
      for (const cat of cats) {
        if (cat.name in orderMap) {
          await tx.table('categories').update(cat.id, { order: orderMap[cat.name] })
        }
      }
    })
  }
}

export const db = new KotobaCardDB()

// Seed default categories and sample cards on first launch (new users)
db.on('populate', async () => {
  const categories: Category[] = [
    { id: ulid(), name: 'たべもの', order: 1 },
    { id: ulid(), name: 'きもち', order: 2 },
    { id: ulid(), name: 'こうどう', order: 3 },
  ]
  await db.categories.bulkAdd(categories)
  await seedSampleCards(db.categories, db.cards)
})
