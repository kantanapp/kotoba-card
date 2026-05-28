import { useState } from 'react'

const KEY = 'kotoba-card-title'
const DEFAULT = 'ことばカード'

export function useAppTitle() {
  const [title, setTitleState] = useState(() => localStorage.getItem(KEY) ?? DEFAULT)

  const setTitle = (newTitle: string) => {
    const value = newTitle.trim() || DEFAULT
    localStorage.setItem(KEY, value)
    setTitleState(value)
  }

  return { title, setTitle }
}
