import type { Card } from '../hooks/useCards'
import type { Lang } from '../hooks/useTTS'
import { CardItem } from './CardItem'

interface Props {
  cards: Card[]
  lang: Lang
  activeCardId: string | null
  slot1Id?: string | null
  slot2Id?: string | null
  onCardTap: (card: Card) => void
}

export function CardGrid({ cards, lang, activeCardId, slot1Id, slot2Id, onCardTap }: Props) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 text-gray-400 py-20">
        <span className="text-6xl">📋</span>
        <p className="text-lg font-medium">カードがありません</p>
        <p className="text-sm">右上のメニューからカードを追加してください</p>
      </div>
    )
  }

  const getSlot = (id: string): 1 | 2 | undefined => {
    if (id === slot1Id) return 1
    if (id === slot2Id) return 2
    return undefined
  }

  return (
    <div
      className="grid grid-cols-4 gap-3 p-3 h-full"
      style={{ gridTemplateRows: 'repeat(2, 1fr)' }}
    >
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          lang={lang}
          isOpen={activeCardId === card.id}
          slot={getSlot(card.id)}
          onTap={onCardTap}
        />
      ))}
    </div>
  )
}
