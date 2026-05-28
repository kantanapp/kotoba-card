const GA_ID = 'G-0NXJTV4BKS'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export function trackPageView(path: string, title: string) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    send_to: GA_ID,
  })
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
