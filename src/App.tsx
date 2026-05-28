import { useState } from 'react'
import { MenuButton } from './components/Header'
import { CategoryTabs } from './components/CategoryTabs'
import { CardGrid } from './components/CardGrid'
import { SideMenu } from './components/SideMenu'
import { CardEditor } from './components/CardEditor'
import { CategoryEditor } from './components/CategoryEditor'
import { useCards, type Card } from './hooks/useCards'
import { useCategories } from './hooks/useCategories'
import { useTTS, type Lang } from './hooks/useTTS'

export default function App() {
  const [lang, setLang] = useState<Lang>('ja')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cardEditorOpen, setCardEditorOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | undefined>(undefined)
  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false)

  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const { cards: allCards, addCard, updateCard, deleteCard } = useCards()
  const { speak } = useTTS(lang)

  const visibleCards = selectedCategory
    ? allCards.filter((c) => c.categoryId === selectedCategory)
    : allCards

  const handleCardTap = (card: Card) => {
    const text = lang === 'ja' ? card.textJa : (card.textEn || card.textJa)
    if (activeCardId === card.id) {
      setActiveCardId(null)
      window.speechSynthesis?.cancel()
    } else {
      setActiveCardId(card.id)
      speak(text)
    }
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
    }
  }

  // Footer height: category tabs (~52px) + safe area
  return (
    <div className="flex flex-col min-h-svh bg-sky-50">

      {/* Cards fill the viewport — footer padding prevents overlap */}
      <main className="flex-1 pb-[60px]">
        <CardGrid
          cards={visibleCards}
          lang={lang}
          activeCardId={activeCardId}
          onCardTap={handleCardTap}
        />
      </main>

      {/* Small floating menu trigger — top-right, barely noticeable */}
      <MenuButton onMenuOpen={() => setMenuOpen(true)} />

      {/* Fixed footer: category tabs only */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] safe-bottom">
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </footer>

      <SideMenu
        isOpen={menuOpen}
        cards={allCards}
        categories={categories}
        lang={lang}
        onClose={() => setMenuOpen(false)}
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
