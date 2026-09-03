import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { patterns, prefetchPattern } from './data/patterns'
import { appHref, appPathname, Arrow, dynamicProgrammingSourceUrl, ExternalIcon, Mark, navigate, PageState, SearchIcon, SkipLink, sourceUrl } from './SiteChrome'

const loadPatternPage = () => import('./PatternPage')
const PatternPage = lazy(loadPatternPage)

function currentSlug(): string | null | undefined {
  const pathname = appPathname()
  if (pathname === '/' || pathname === '') return null
  const match = pathname.match(/^\/patterns\/([^/]+)\/?$/)
  return match?.[1]
}

function preloadLesson(slug: string) {
  void loadPatternPage()
  void prefetchPattern(slug)
}

function Home() {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const filtered = useMemo(
    () => patterns.filter((pattern) => pattern.title.toLocaleLowerCase().includes(normalizedQuery)),
    [normalizedQuery],
  )
  const collections = [
    { title: 'DSA Revision', patterns: filtered.filter((pattern) => !pattern.collection) },
    { title: 'Dynamic Programming', patterns: filtered.filter((pattern) => pattern.collection === 'Dynamic Programming') },
  ].filter((collection) => collection.patterns.length > 0)

  return (
    <>
      <SkipLink />
      <header className="site-header">
        <Mark />
        <div className="source-links" aria-label="Notion seed sources">
          <a className="source-link" href={sourceUrl} target="_blank" rel="noreferrer" aria-label="Open the DSA Revision Notion source in a new tab">
            <span className="source-label">DSA source</span><ExternalIcon />
          </a>
          <a className="source-link" href={dynamicProgrammingSourceUrl} target="_blank" rel="noreferrer" aria-label="Open the Dynamic Programming Notion source in a new tab">
            <span className="source-label">DP source</span><ExternalIcon />
          </a>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">DSA REVISION · {patterns.length} PATTERNS</p>
            <h1>DSA Revision.<br /><em>One pattern</em><br />per page.</h1>
            <p className="hero-summary">Choose a pattern from the library below. The initial learning material was seeded from the linked Notion pages.</p>
          </div>
          <div className="hero-card" aria-label="First patterns in the library">
            <span className="card-index">01</span>
            <p className="card-label">PATTERN INDEX</p>
            <ol>
              {patterns.slice(0, 4).map((pattern) => <li key={pattern.slug}>{pattern.title}</li>)}
            </ol>
            <a
              href={appHref(`/patterns/${patterns[0].slug}`)}
              onClick={(event) => navigate(event, `/patterns/${patterns[0].slug}`)}
              onMouseEnter={() => preloadLesson(patterns[0].slug)}
              onFocus={() => preloadLesson(patterns[0].slug)}
            >
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
              <SearchIcon />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a pattern…" aria-controls="pattern-grid" autoComplete="off" enterKeyHint="search" />
            </label>
          </div>

          {normalizedQuery && <p className="sr-only" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'pattern' : 'patterns'} found.</p>}
          <div className="pattern-collections" id="pattern-grid">
            {collections.map((collection) => (
              <section className="pattern-collection" aria-labelledby={`collection-${collection.title.toLocaleLowerCase().replace(/\s+/g, '-')}`} key={collection.title}>
                <div className="collection-heading">
                  <h3 id={`collection-${collection.title.toLocaleLowerCase().replace(/\s+/g, '-')}`}>{collection.title}</h3>
                  <span>{collection.patterns.length} {collection.patterns.length === 1 ? 'topic' : 'topics'}</span>
                </div>
                <div className="pattern-grid">
                  {collection.patterns.map((pattern) => {
                    const number = String(patterns.indexOf(pattern) + 1).padStart(2, '0')
                    return (
                      <a
                        className="pattern-card"
                        href={appHref(`/patterns/${pattern.slug}`)}
                        onClick={(event) => navigate(event, `/patterns/${pattern.slug}`)}
                        onMouseEnter={() => preloadLesson(pattern.slug)}
                        onFocus={() => preloadLesson(pattern.slug)}
                        key={pattern.slug}
                      >
                        <span className="pattern-number">{number}</span>
                        <h4>{pattern.title}</h4>
                        <span className="pattern-meta">{pattern.sectionCount} sections</span>
                        <span className="pattern-arrow"><Arrow /></span>
                      </a>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
          {filtered.length === 0 && <p className="empty-state" role="status" aria-live="polite">No pattern matches “{query}”.</p>}
        </section>
      </main>
      <footer><span>{patterns.length} DSA patterns</span><span>Initial content seeded from DSA Revision and Dynamic Programming in Notion.</span></footer>
    </>
  )
}

function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — DSA Revision'
    return () => { document.title = 'DSA Revision — Interview Patterns' }
  }, [])

  return (
    <PageState label="404 · PAGE NOT FOUND" title="This route slipped the invariant." description="The page may have moved, or the address may be incomplete.">
      <a className="state-action" href={appHref('/')} onClick={(event) => navigate(event, '/')}>Return to the pattern library <Arrow /></a>
    </PageState>
  )
}

function LoadingPattern() {
  return <PageState label="OPENING PATTERN" title="Preparing the lesson." description="Setting the page in a consistent revision flow." tone="loading" busy />
}

export default function App() {
  const [slug, setSlug] = useState(currentSlug())
  const patternExists = typeof slug === 'string' && patterns.some((pattern) => pattern.slug === slug)

  useEffect(() => {
    const sync = () => setSlug(currentSlug())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  useEffect(() => {
    if (patternExists && slug) preloadLesson(slug)
  }, [patternExists, slug])

  if (slug === null) return <Home />
  if (slug === undefined || !patternExists) return <NotFound />
  return (
    <Suspense fallback={<LoadingPattern />}>
      <PatternPage slug={slug} />
    </Suspense>
  )
}
