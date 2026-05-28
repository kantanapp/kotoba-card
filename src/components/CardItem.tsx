import type { Card } from '../hooks/useCards'
import type { Lang } from '../hooks/useTTS'

interface Props {
  card: Card
  lang: Lang
  isOpen: boolean
  slot?: 1 | 2
  onTap: (card: Card) => void
}

const PASTEL_BORDERS = [
  'border-pink-300',
  'border-sky-300',
  'border-green-300',
  'border-yellow-300',
  'border-purple-300',
  'border-orange-300',
]

function borderColor(id: string) {
  const sum = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return PASTEL_BORDERS[sum % PASTEL_BORDERS.length]
}

export function CardItem({ card, lang, isOpen, slot, onTap }: Props) {
  const text = lang === 'ja' ? card.textJa : (card.textEn || card.textJa)
  const border = slot === 1
    ? 'border-sky-400'
    : slot === 2
    ? 'border-orange-400'
    : borderColor(card.id)

  return (
    <button
      onClick={() => onTap(card)}
      className={`relative flex flex-col rounded-2xl bg-white shadow-md border-4 ${border} overflow-hidden active:scale-95 transition-transform duration-100 focus:outline-none`}
      aria-label={text}
    >
      {/* Slot number badge */}
      {slot && (
        <div className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-black shadow ${
          slot === 1 ? 'bg-sky-500' : 'bg-orange-400'
        }`}>
          {slot === 1 ? '①' : '②'}
        </div>
      )}

      {/* Image area — flex-1 so it fills available height */}
      <div className="w-full flex-1 min-h-0 bg-gray-50 flex items-center justify-center overflow-hidden">
        {card.imageData ? (
          <img
            src={card.imageData}
            alt={text}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <span className="text-6xl">🖼️</span>
        )}
      </div>

      {/* Text label - always visible below image */}
      <div className="px-2 py-2 min-h-[3rem] flex items-center justify-center">
        <span className="text-base font-bold text-gray-700 leading-tight text-center break-words">
          {lang === 'ja' ? card.textJa : (card.textEn || card.textJa)}
        </span>
      </div>

      {/* Speaking indicator overlay — pulse instead of bounce */}
      {isOpen && (
        <div className="absolute inset-0 bg-sky-500/10 border-4 border-sky-400 rounded-2xl pointer-events-none animate-pulse" />
      )}
    </button>
  )
}
