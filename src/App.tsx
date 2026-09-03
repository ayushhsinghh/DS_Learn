import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { patterns, slugify } from './data/patterns'

const sourceUrl = 'https://app.notion.com/p/3c9890465d8480e5abb0e76e8d7df3a8'

function currentSlug() {
  const match = window.location.pathname.match(/^\/patterns\/([^/]+)\/?$/)
  return match?.[1] ?? null
}

function navigate(event: MouseEvent<HTMLAnchorElement>, path: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function Mark() {
  return (
    <a className="brand" href="/" onClick={(event) => navigate(event, '/')} aria-label="DSA Revision home">
      <span className="brand-mark" aria-hidden="true">D/</span>
      <span>DSA Revision</span>
    </a>
  )
}

function Arrow({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return <span aria-hidden="true">{direction === 'left' ? '←' : '→'}</span>
}

function Home() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(
    () => patterns.filter((pattern) => pattern.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <>
      <header className="site-header">
        <Mark />
        <a className="source-link" href={sourceUrl} target="_blank" rel="noreferrer">Notion source ↗</a>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">DSA REVISION · {patterns.length} PATTERNS</p>
            <h1>DSA Revision.<br /><em>One pattern</em><br />per page.</h1>
            <p className="hero-summary">Choose a pattern from the library below. Every topic, explanation, example, and practice question comes from the linked Notion source.</p>
          </div>
          <div className="hero-card" aria-label="First patterns in the library">
            <span className="card-index">01</span>
            <p className="card-label">PATTERN INDEX</p>
            <ol>
              {patterns.slice(0, 4).map((pattern) => <li key={pattern.slug}>{pattern.title}</li>)}
            </ol>
            <a href={`/patterns/${patterns[0].slug}`} onClick={(event) => navigate(event, `/patterns/${patterns[0].slug}`)}>
              Open {patterns[0].title} <Arrow />
            </a>
          </div>
        </section>

        <section className="library" aria-labelledby="library-title">
          <div className="library-heading">
            <div>
              <p className="eyebrow">THE PATTERN LIBRARY</p>
              <h2 id="library-title">Choose what to revise</h2>
            </div>
            <label className="search">
              <span className="sr-only">Search patterns</span>
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a pattern…" />
            </label>
          </div>

          <div className="pattern-grid">
            {filtered.map((pattern) => {
              const number = String(patterns.indexOf(pattern) + 1).padStart(2, '0')
              return (
                <a className="pattern-card" href={`/patterns/${pattern.slug}`} onClick={(event) => navigate(event, `/patterns/${pattern.slug}`)} key={pattern.slug}>
                  <span className="pattern-number">{number}</span>
                  <h3>{pattern.title}</h3>
                  <span className="pattern-meta">{pattern.sections.length} sections</span>
                  <span className="pattern-arrow"><Arrow /></span>
                </a>
              )
            })}
          </div>
          {filtered.length === 0 && <p className="empty-state">No pattern matches “{query}”.</p>}
        </section>
      </main>
      <footer><span>{patterns.length} DSA patterns</span><span>Content sourced only from DSA Revision in Notion.</span></footer>
    </>
  )
}

function PatternPage({ slug }: { slug: string }) {
  const patternIndex = patterns.findIndex((item) => item.slug === slug)
  const pattern = patterns[patternIndex]
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [slug])

  useEffect(() => {
    document.title = pattern ? `${pattern.title} — DSA Revision` : 'Pattern not found — DSA Revision'
    return () => { document.title = 'DSA Revision — Interview Patterns' }
  }, [pattern])

  if (!pattern) return <NotFound />

  const previous = patterns[patternIndex - 1]
  const next = patterns[patternIndex + 1]

  return (
    <div className="reader-shell">
      <header className="reader-header">
        <Mark />
        <div className="reader-progress" aria-label={`Pattern ${patternIndex + 1} of ${patterns.length}`}>
          <span>{String(patternIndex + 1).padStart(2, '0')} / {patterns.length}</span>
          <span className="progress-track"><span style={{ width: `${((patternIndex + 1) / patterns.length) * 100}%` }} /></span>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="pattern-navigation">{menuOpen ? 'Close' : 'Contents'}</button>
      </header>

      <aside id="pattern-navigation" className={`pattern-nav ${menuOpen ? 'is-open' : ''}`}>
        <p className="nav-label">PATTERN LIBRARY</p>
        <nav aria-label="DSA patterns">
          {patterns.map((item, index) => (
            <a className={item.slug === slug ? 'active' : ''} href={`/patterns/${item.slug}`} onClick={(event) => navigate(event, `/patterns/${item.slug}`)} key={item.slug}>
              <span>{String(index + 1).padStart(2, '0')}</span>{item.title}
            </a>
          ))}
        </nav>
      </aside>

      <main className="reader-main" id="main">
        <article>
          <div className="article-kicker"><span>DSA PATTERN</span><span>{String(patternIndex + 1).padStart(2, '0')}</span></div>
          <h1>{pattern.title}</h1>
          <div className="article-rule" />
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2({ children }) {
                const text = String(children)
                return <h2 id={slugify(text)}>{children}</h2>
              },
              h3({ children }) {
                const text = String(children)
                return <h3 id={slugify(text)}>{children}</h3>
              },
              a({ href, children }) {
                return <a href={href} target="_blank" rel="noreferrer">{children}</a>
              },
            }}
          >{pattern.content}</Markdown>
        </article>

        <nav className="article-pager" aria-label="Pattern pagination">
          {previous ? (
            <a href={`/patterns/${previous.slug}`} onClick={(event) => navigate(event, `/patterns/${previous.slug}`)}>
              <span><Arrow direction="left" /> Previous</span><strong>{previous.title}</strong>
            </a>
          ) : <span />}
          {next ? (
            <a className="next" href={`/patterns/${next.slug}`} onClick={(event) => navigate(event, `/patterns/${next.slug}`)}>
              <span>Next <Arrow /></span><strong>{next.title}</strong>
            </a>
          ) : (
            <a className="next" href="/" onClick={(event) => navigate(event, '/')}>Back to all patterns <Arrow /></a>
          )}
        </nav>
      </main>

      <aside className="on-this-page">
        <p className="nav-label">ON THIS PAGE</p>
        <nav aria-label="On this page">
          {pattern.sections.slice(0, 12).map((section, index) => (
            <a href={`#${section.id}`} key={`${section.id}-${index}`}>{section.title}</a>
          ))}
        </nav>
        <a className="source-note" href={sourceUrl} target="_blank" rel="noreferrer">View original in Notion ↗</a>
      </aside>
    </div>
  )
}

function NotFound() {
  return (
    <main className="not-found" id="main">
      <p className="eyebrow">404 · PATTERN NOT FOUND</p>
      <h1>This route slipped the invariant.</h1>
      <a href="/" onClick={(event) => navigate(event, '/')}>Return to the pattern library <Arrow /></a>
    </main>
  )
}

export default function App() {
  const [slug, setSlug] = useState(currentSlug())

  useEffect(() => {
    const sync = () => setSlug(currentSlug())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  return slug ? <PatternPage slug={slug} /> : <Home />
}
