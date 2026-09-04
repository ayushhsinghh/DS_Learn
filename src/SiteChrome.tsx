import type { MouseEvent, ReactNode } from 'react'

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

export function appHref(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${normalizedPath}` || '/'
}

export function appPathname() {
  if (!basePath) return window.location.pathname
  if (window.location.pathname === basePath) return '/'
  if (window.location.pathname.startsWith(`${basePath}/`)) return window.location.pathname.slice(basePath.length)
  return window.location.pathname
}

export function navigate(event: MouseEvent<HTMLAnchorElement>, path: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  window.history.pushState({}, '', appHref(path))
  window.dispatchEvent(new PopStateEvent('popstate'))
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
}

export function SkipLink() {
  return <a className="skip-link" href="#main">Skip to content</a>
}

export function Mark() {
  return (
    <a className="brand" href={appHref('/')} onClick={(event) => navigate(event, '/')} aria-label="DSA Revision home">
      <span className="brand-mark" aria-hidden="true">D/</span>
      <span>DSA Revision</span>
    </a>
  )
}

export function Arrow({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return (
    <svg className="icon icon-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {direction === 'left' ? (
        <path d="M17 10H3m0 0 5-5m-5 5 5 5" />
      ) : (
        <path d="M3 10h14m0 0-5-5m5 5-5 5" />
      )}
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg className="icon icon-search" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.25" />
      <path d="m12.5 12.5 4 4" />
    </svg>
  )
}

export function PageState({
  label,
  title,
  description,
  children,
  tone = 'default',
  busy = false,
}: {
  label: string
  title: string
  description?: string
  children?: ReactNode
  tone?: 'default' | 'loading' | 'error'
  busy?: boolean
}) {
  return (
    <div className={`route-state route-state--${tone}`}>
      <SkipLink />
      <header className="state-header"><Mark /></header>
      <main className="state-main" id="main" aria-busy={busy || undefined} role={tone === 'error' ? 'alert' : undefined}>
        <div className="state-copy">
          <p className="eyebrow">{label}</p>
          <h1>{title}</h1>
          {busy && <span className="loading-rule" aria-hidden="true" />}
          {description && <p className="state-description">{description}</p>}
          {children}
        </div>
      </main>
    </div>
  )
}
