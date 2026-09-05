import { isValidElement, memo, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode, type WheelEvent } from 'react'
import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { loadPattern, patterns, prefetchPattern, slugify, type Pattern } from './data/patterns'
import { appHref, Arrow, Mark, navigate, PageState, SkipLink } from './SiteChrome'

const javaKeywords = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
  'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float',
  'for', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new',
  'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super',
  'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while',
])

const javaTypes = new Set([
  'ArrayDeque', 'ArrayList', 'Arrays', 'Boolean', 'Character', 'Collections', 'Comparator', 'Deque',
  'Double', 'HashMap', 'HashSet', 'Integer', 'LinkedList', 'List', 'Long', 'Map', 'Math', 'PriorityQueue',
  'Queue', 'Set', 'Stack', 'String', 'StringBuilder', 'System', 'TreeMap', 'TreeSet',
])

function highlightJava(code: string): ReactNode[] {
  const tokenPattern = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[A-Za-z_$][\w$]*\b|\b\d+(?:\.\d+)?\b)/g
  const parts: ReactNode[] = []
  let cursor = 0

  for (const match of code.matchAll(tokenPattern)) {
    const index = match.index ?? 0
    if (index > cursor) parts.push(code.slice(cursor, index))
    const token = match[0]
    let tokenClass = ''
    if (token.startsWith('//') || token.startsWith('/*')) tokenClass = 'syntax-comment'
    else if (token.startsWith('"') || token.startsWith("'")) tokenClass = 'syntax-string'
    else if (/^\d/.test(token)) tokenClass = 'syntax-number'
    else if (javaKeywords.has(token)) tokenClass = 'syntax-keyword'
    else if (javaTypes.has(token) || /^[A-Z]/.test(token)) tokenClass = 'syntax-type'
    parts.push(tokenClass ? <span className={tokenClass} key={`${index}-${token}`}>{token}</span> : token)
    cursor = index + token.length
  }
  if (cursor < code.length) parts.push(code.slice(cursor))
  return parts
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const normalized = code.replace(/\n$/, '')
  const lineCount = normalized ? normalized.split('\n').length : 0
  const languageLabel = language === 'java' ? 'Java' : language === 'plain' || language === 'text' ? 'Plain text' : language || 'Code'
  const renderedCode = language === 'java' ? highlightJava(normalized) : normalized
  const block = (
    <pre tabIndex={0} aria-label={`${languageLabel} code, ${lineCount} ${lineCount === 1 ? 'line' : 'lines'}`}>
      <code className={language ? `language-${language}` : undefined}>{renderedCode}</code>
    </pre>
  )

  if (lineCount > 12) {
    return (
      <details className="code-disclosure">
        <summary><span>{languageLabel} code</span><span>{lineCount} lines</span></summary>
        {block}
      </details>
    )
  }

  return (
    <div className="code-shell">
      <div className="code-caption"><span>{languageLabel}</span><span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span></div>
      {block}
    </div>
  )
}

function nodeText(value: ReactNode): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(nodeText).join('')
  if (isValidElement<{ children?: ReactNode }>(value)) return nodeText(value.props.children)
  return ''
}

function ContentsIcon() {
  return (
    <svg className="contents-menu-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" />
    </svg>
  )
}

function LoadFailure({ message }: { message: string }) {
  return (
    <PageState label="LESSON COULD NOT LOAD" title="The pattern is temporarily unavailable." description={message} tone="error">
      <a className="state-action" href={appHref('/')} onClick={(event) => navigate(event, '/')}>Return to the pattern library <Arrow /></a>
    </PageState>
  )
}

const PatternArticle = memo(function PatternArticle({ pattern, patternIndex }: { pattern: Pattern; patternIndex: number }) {
  const markdownComponents = useMemo<Components>(() => ({
    h2({ children, node }) {
      const id = pattern.sections.find((section) => section.line === node?.position?.start.line)?.id ?? slugify(nodeText(children))
      return <h2 id={id}>{children}</h2>
    },
    h3({ children }) {
      return <h3>{children}</h3>
    },
    pre({ children }) {
      return <>{children}</>
    },
    code({ children, className, ...props }) {
      const language = /language-([^\s]+)/.exec(className ?? '')?.[1]
      const code = String(children)
      if (language || code.includes('\n')) return <CodeBlock code={code} language={language ?? ''} />
      return <code className={className} {...props}>{children}</code>
    },
    a({ href, children }) {
      return <a href={href} target="_blank" rel="noreferrer">{children}</a>
    },
  }), [pattern.sections])

  return (
    <article>
      <div className="article-kicker"><span>DSA PATTERN</span><span>{String(patternIndex + 1).padStart(2, '0')}</span></div>
      <h1>{pattern.title}</h1>
      <div className="article-rule" />
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{pattern.content}</Markdown>
    </article>
  )
})

function PatternReader({ pattern }: { pattern: Pattern }) {
  const patternIndex = patterns.findIndex((item) => item.slug === pattern.slug)
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerMode, setHeaderMode] = useState<'full' | 'hidden' | 'compact'>('full')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const contentsRef = useRef<HTMLElement>(null)
  const pageScrollRef = useRef({ x: 0, y: 0 })
  const previous = patterns[patternIndex - 1]
  const next = patterns[patternIndex + 1]

  useEffect(() => {
    document.title = `${pattern.title} — DSA Revision`
    return () => { document.title = 'DSA Revision — Interview Patterns' }
  }, [pattern.title])

  useEffect(() => {
    if (!next) return
    const prefetch = () => { void prefetchPattern(next.slug) }
    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(prefetch, { timeout: 2500 })
      return () => idleWindow.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(prefetch, 1200)
    return () => window.clearTimeout(id)
  }, [next])

  useEffect(() => {
    if (!menuOpen) return
    const bodyOverflow = document.body.style.overflow
    const rootStyles = {
      overflow: document.documentElement.style.overflow,
      overscrollBehavior: document.documentElement.style.overscrollBehavior,
    }
    pageScrollRef.current = { x: window.scrollX, y: window.scrollY }
    const holdPagePosition = () => {
      const { x, y } = pageScrollRef.current
      if (window.scrollX !== x || window.scrollY !== y) window.scrollTo(x, y)
    }
    const frame = window.requestAnimationFrame(() => {
      if (contentsRef.current) contentsRef.current.scrollTop = 0
      contentsRef.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true })
    })
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      setHeaderMode('full')
      window.requestAnimationFrame(() => menuButtonRef.current?.focus({ preventScroll: true }))
    }
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    window.addEventListener('keydown', closeMenu)
    window.addEventListener('scroll', holdPagePosition, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', holdPagePosition)
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootStyles.overflow
      document.documentElement.style.overscrollBehavior = rootStyles.overscrollBehavior
      window.removeEventListener('keydown', closeMenu)
      window.scrollTo(pageScrollRef.current.x, pageScrollRef.current.y)
    }
  }, [menuOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)')
    const closeOnDesktop = () => {
      if (!desktop.matches) return
      setMenuOpen(false)
      setHeaderMode('full')
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 900px)')
    let lastScrollY = Math.max(0, window.scrollY)
    let direction = 0
    let distance = 0
    let frame = 0

    const updateHeader = () => {
      frame = 0
      const currentScrollY = Math.max(0, window.scrollY)

      if (!mobile.matches || menuOpen || currentScrollY <= 24) {
        setHeaderMode('full')
        lastScrollY = currentScrollY
        direction = 0
        distance = 0
        return
      }

      const delta = currentScrollY - lastScrollY
      lastScrollY = currentScrollY
      if (Math.abs(delta) < 1) return

      const nextDirection = Math.sign(delta)
      if (nextDirection !== direction) {
        direction = nextDirection
        distance = 0
      }
      distance += Math.abs(delta)
      if (distance < 12) return

      setHeaderMode(nextDirection > 0 ? 'hidden' : 'compact')
      distance = 0
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader)
    }
    const onViewportChange = () => {
      lastScrollY = Math.max(0, window.scrollY)
      direction = 0
      distance = 0
      if (!mobile.matches) {
        setHeaderMode('full')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    mobile.addEventListener('change', onViewportChange)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      mobile.removeEventListener('change', onViewportChange)
    }
  }, [menuOpen])

  function openSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()
    setMenuOpen(false)
    window.requestAnimationFrame(() => {
      if (window.location.hash !== `#${id}`) window.history.pushState({}, '', `#${id}`)
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
    })
  }

  function scrollContents(event: WheelEvent<HTMLElement>) {
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.scrollTop += event.deltaY
  }

  function closeContents() {
    setMenuOpen(false)
    setHeaderMode(window.scrollY > 24 ? 'compact' : 'full')
    window.requestAnimationFrame(() => menuButtonRef.current?.focus({ preventScroll: true }))
  }

  function toggleContents() {
    setHeaderMode('full')
    setMenuOpen((open) => !open)
  }

  return (
    <div className="reader-shell">
      <SkipLink />
      <header className={`reader-header ${headerMode === 'hidden' || menuOpen ? 'is-hidden' : ''} ${headerMode === 'compact' ? 'is-compact' : ''}`} inert={menuOpen ? true : undefined} aria-hidden={menuOpen || undefined}>
        <Mark />
        <div className="reader-progress" aria-label={`Pattern ${patternIndex + 1} of ${patterns.length}`}>
          <span>{String(patternIndex + 1).padStart(2, '0')} / {patterns.length}</span>
          <span className="progress-track"><span style={{ width: `${((patternIndex + 1) / patterns.length) * 100}%` }} /></span>
        </div>
        <button ref={menuButtonRef} className="menu-button" onClick={toggleContents} aria-expanded={menuOpen} aria-controls="page-contents" aria-label="Open page contents">
          <span className="menu-button-label">Contents</span>
          <ContentsIcon />
        </button>
      </header>

      <aside id="pattern-navigation" className="pattern-nav">
        <p className="nav-label">PATTERN LIBRARY</p>
        <nav aria-label="DSA patterns">
          {patterns.map((item, index) => (
            <a className={item.slug === pattern.slug ? 'active' : ''} aria-current={item.slug === pattern.slug ? 'page' : undefined} href={appHref(`/patterns/${item.slug}`)} onClick={(event) => navigate(event, `/patterns/${item.slug}`)} key={item.slug}>
              <span>{String(index + 1).padStart(2, '0')}</span>{item.title}
            </a>
          ))}
        </nav>
      </aside>

      <main className="reader-main" id="main" inert={menuOpen ? true : undefined} aria-hidden={menuOpen || undefined}>
        <PatternArticle pattern={pattern} patternIndex={patternIndex} />

        <nav className="article-pager" aria-label="Pattern pagination">
          {previous ? (
            <a href={appHref(`/patterns/${previous.slug}`)} onClick={(event) => navigate(event, `/patterns/${previous.slug}`)}>
              <span><Arrow direction="left" /> Previous</span><strong>{previous.title}</strong>
            </a>
          ) : <span />}
          {next ? (
            <a className="next" href={appHref(`/patterns/${next.slug}`)} onClick={(event) => navigate(event, `/patterns/${next.slug}`)}>
              <span>Next <Arrow /></span><strong>{next.title}</strong>
            </a>
          ) : (
            <a className="next" href={appHref('/')} onClick={(event) => navigate(event, '/')}>Back to all patterns <Arrow /></a>
          )}
        </nav>
      </main>

      <aside ref={contentsRef} id="page-contents" className={`on-this-page ${menuOpen ? 'is-open' : ''}`} onWheel={scrollContents}>
        <div className="contents-heading">
          <p className="nav-label">ON THIS PAGE</p>
          <button className="menu-button contents-close" onClick={closeContents} aria-label="Close page contents">Close</button>
        </div>
        <nav aria-label="On this page">
          {pattern.sections.map((section, index) => (
            <a href={`#${section.id}`} onClick={(event) => openSection(event, section.id)} key={`${section.id}-${index}`}>{section.title}</a>
          ))}
        </nav>
      </aside>
    </div>
  )
}

export default function PatternPage({ slug }: { slug: string }) {
  const [state, setState] = useState<
    { slug: string; pattern: Pattern | null; error: string | null }
  >({ slug, pattern: null, error: null })

  useEffect(() => {
    let active = true
    loadPattern(slug)
      .then((pattern) => { if (active) setState({ slug, pattern, error: null }) })
      .catch((error) => {
        if (active) setState({ slug, pattern: null, error: error instanceof Error ? error.message : 'The lesson could not be loaded.' })
      })
    return () => { active = false }
  }, [slug])

  if (state.slug !== slug || (!state.pattern && !state.error)) {
    return <PageState label="OPENING PATTERN" title="Preparing the lesson." description="Setting the page in a consistent revision flow." tone="loading" busy />
  }
  if (state.error) return <LoadFailure message={state.error} />
  return <PatternReader pattern={state.pattern!} />
}
