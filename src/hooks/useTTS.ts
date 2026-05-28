import { useCallback, useRef } from 'react'

export type Lang = 'ja' | 'en'

export function useTTS(lang: Lang) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis) return

      window.speechSynthesis.cancel()

      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang === 'ja' ? 'ja-JP' : 'en-US'
      u.rate = 0.9
      u.pitch = 1.1
      utteranceRef.current = u
      window.speechSynthesis.speak(u)
    },
    [lang],
  )

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, stop }
}
