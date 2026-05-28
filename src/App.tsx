import { useRef, useState, useMemo } from 'react'
import { Header } from './components/Header'
import { CategoryTabs } from './components/CategoryTabs'
import { CardGrid } from './components/CardGrid'
import { SideMenu } from './components/SideMenu'
import { CardEditor } from './components/CardEditor'
import { CategoryEditor } from './components/CategoryEditor'
import { useCards, type Card } from './hooks/useCards'
import { useCategories } from './hooks/useCategories'
import { useTTS, type Lang } from './hooks/useTTS'
import { useAppTitle } from './hooks/useAppTitle'

export default function App() {
  const [lang, setLang] = useState<Lang>('ja')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cardEditorOpen, setCardEditorOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | undefined>(undefined)
  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false)

  // 1枚モード用
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  // 2枚モード用
  const [twoCardMode, setTwoCardMode] = useState(false)
  const [slot1Id, setSlot1Id] = useState<string | null>(null)
  const [slot2Id, setSlot2Id] = useState<string | null>(null)

  // ページネーション
  const PAGE_SIZE = 8
  const [currentPage, setCurrentPage] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { title, setTitle } = useAppTitle()
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const { cards: allCards, addCard, updateCard, deleteCard } = useCards()
  const { speak } = useTTS(lang)

  const visibleCards = selectedCategory
    ? allCards.filter((c) => c.categoryId === selectedCategory)
    : allCards

  const cardPages = useMemo(() => {
    const pages: typeof visibleCards[] = []
    for (let i = 0; i < visibleCards.length; i += PAGE_SIZE) {
      pages.push(visibleCards.slice(i, i + PAGE_SIZE))
    }
    return pages.length > 0 ? pages : [[]]
  }, [visibleCards])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const page = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth)
    setCurrentPage(page)
  }

  const getText = (card: Card) =>
    lang === 'ja' ? card.textJa : (card.textEn || card.textJa)

  const handleCardTap = (card: Card) => {
    if (!twoCardMode) {
      // --- 既存の1枚モード（変更なし）---
      if (activeCardId === card.id) {
        setActiveCardId(null)
        window.speechSynthesis?.cancel()
      } else {
        setActiveCardId(card.id)
        speak(getText(card))
      }
      return
    }

    // --- 2枚モード ---
    if (slot1Id === null) {
      // まだ何も選んでいない → 1枚目にセット
      setSlot1Id(card.id)
      setSlot2Id(null)
      speak(getText(card))
    } else if (card.id === slot1Id) {
      // 1枚目を再タップ → 選択解除
      setSlot1Id(null)
      setSlot2Id(null)
      window.speechSynthesis?.cancel()
    } else if (slot2Id === null) {
      // 2枚目をセット → 両方読み上げ
      setSlot2Id(card.id)
      const card1 = allCards.find((c) => c.id === slot1Id)
      if (card1) speak(getText(card1) + '　' + getText(card))
    } else {
      // すでに2枚選択済み → 新しい1枚目としてリセット
      setSlot1Id(card.id)
      setSlot2Id(null)
      speak(getText(card))
    }
  }

  const handleToggleTwoCardMode = () => {
    setTwoCardMode((prev) => {
      if (prev) {
        // 2枚モード解除時はスロットをリセット
        setSlot1Id(null)
        setSlot2Id(null)
      } else {
        // 1枚モードのハイライトをリセット
        setActiveCardId(null)
      }
      window.speechSynthesis?.cancel()
      return !prev
    })
  }

  const handleOpenAddCard = () => {
    setEditingCard(undefined)
    setCardEditorOpen(true)
  }

  const handleOpenEditCard = (card: Card) => {
    setEditingCard(card)
    setCardEditorOpen(true)
  }

  const handleSaveCard = async (data: Omit<Card, 'id' | 'order'>) => {
    if (editingCard) {
      await updateCard(editingCard.id, data)
    } else {
      await addCard(data)
    }
  }

  const handleDeleteCard = async (id: string) => {
    if (confirm('このカードを削除しますか？')) {
      await deleteCard(id)
      if (activeCardId === id) setActiveCardId(null)
      if (slot1Id === id) setSlot1Id(null)
      if (slot2Id === id) setSlot2Id(null)
    }
  }

  return (
    <div className="flex flex-col min-h-svh bg-sky-50">

      {/* Pages: horizontal scroll snap */}
      <main className="h-[calc(100svh-60px)] overflow-hidden relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full overflow-x-scroll"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {cardPages.map((pageCards, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-full h-full"
              style={{ scrollSnapAlign: 'start' }}
            >
              <CardGrid
                cards={pageCards}
                lang={lang}
                activeCardId={twoCardMode ? null : activeCardId}
                slot1Id={twoCardMode ? slot1Id : null}
                slot2Id={twoCardMode ? slot2Id : null}
                onCardTap={handleCardTap}
              />
            </div>
          ))}
        </div>

        {/* ページドット */}
        {cardPages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 pointer-events-none">
            {cardPages.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  i === currentPage ? 'bg-sky-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </main>

      {/* Fixed footer: 2枚トグル + カテゴリタブ + ハンバーガー */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] safe-bottom flex items-center">
        {/* 2枚モードトグル */}
        <div className="flex-shrink-0 pl-3">
          <button
            onClick={handleToggleTwoCardMode}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              twoCardMode
                ? 'bg-orange-400 text-white shadow'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {twoCardMode ? '①＋②' : '①'}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <div className="flex-shrink-0 pr-3">
          <Header onMenuOpen={() => setMenuOpen(true)} />
        </div>
      </footer>

      <SideMenu
        isOpen={menuOpen}
        title={title}
        cards={allCards}
        categories={categories}
        lang={lang}
        onClose={() => setMenuOpen(false)}
        onTitleChange={setTitle}
        onAddCard={handleOpenAddCard}
        onEditCard={(card) => { handleOpenEditCard(card); setMenuOpen(false) }}
        onDeleteCard={handleDeleteCard}
        onManageCategories={() => setCategoryEditorOpen(true)}
        onToggleLang={() => setLang((l) => (l === 'ja' ? 'en' : 'ja'))}
      />

      {cardEditorOpen && (
        <CardEditor
          card={editingCard}
          categories={categories}
          onSave={handleSaveCard}
          onClose={() => setCardEditorOpen(false)}
        />
      )}

      {categoryEditorOpen && (
        <CategoryEditor
          categories={categories}
          onAdd={addCategory}
          onUpdate={updateCategory}
          onDelete={deleteCategory}
          onClose={() => setCategoryEditorOpen(false)}
        />
      )}
    </div>
  )
}
