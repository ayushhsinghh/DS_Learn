import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { extractSections } from '../src/data/sections.ts'
import { drawerMotionPolicy, sectionScrollBehavior } from '../src/motion.ts'
import { unified } from 'unified'
import remarkParse from 'remark-parse'

const counts = JSON.parse(readFileSync(new URL('../src/data/section-counts.json', import.meta.url)))
const slugs = JSON.parse(readFileSync(new URL('../src/data/leetcode-slugs.json', import.meta.url)))
const directory = new URL('../src/data/content/', import.meta.url)

test('lesson prose is not parsed as underline headings and heading levels never skip', () => {
  for (const file of readdirSync(directory).filter(file => file.endsWith('.md'))) {
    const content = readFileSync(new URL(file, directory), 'utf8')
    const tree = unified().use(remarkParse).parse(content)
    let previousLevel = 1 // The reader supplies the page title.
    for (const node of tree.children.filter(node => node.type === 'heading')) {
      assert.ok(content.slice(node.position.start.offset).startsWith('#'), `Accidental heading in ${file}:${node.position.start.line}`)
      assert.ok(node.depth <= previousLevel + 1, `Skipped heading level in ${file}:${node.position.start.line}`)
      previousLevel = node.depth
    }
  }
})

test('every lesson count matches its navigable sections and every LC ID has a canonical link', () => {
  for (const file of readdirSync(directory).filter(file => file.endsWith('.md'))) {
    const content = readFileSync(new URL(file, directory), 'utf8').trim()
    const slug = file.slice(0, -3)
    const sections = extractSections(content, slug)
    assert.equal(counts[slug], sections.length, slug)
    assert.equal(new Set(sections.map(section => section.id)).size, sections.length, slug)
    for (const [, id] of content.matchAll(/\bLC\s*(\d+)/g)) {
      assert.match(slugs[id] ?? '', /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Missing canonical LC ${id} in ${file}`)
    }
  }
})

test('regressions: abbreviated LC titles and expanded DP sections', () => {
  assert.equal(slugs['2369'], 'check-if-there-is-a-valid-partition-for-the-array')
  assert.equal(slugs['1438'], 'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit')
  assert.equal(counts['linear-1d-dynamic-programming'], 24)
})

test('section extraction excludes fences and small headings, and disambiguates anchors', () => {
  const content = '## Topic\n### Detail\n```java\n## Not a heading\n```\n## Topic'
  assert.deepEqual(extractSections(content, 'test').map(({ id, line }) => ({ id, line })), [
    { id: 'topic', line: 1 }, { id: 'topic-2', line: 6 },
  ])
})

test('section scrolling animates only pointer activation without reduced motion', () => {
  assert.equal(sectionScrollBehavior(false, false), 'smooth')
  assert.equal(sectionScrollBehavior(true, false), 'instant')
  assert.equal(sectionScrollBehavior(false, true), 'instant')
  assert.equal(sectionScrollBehavior(true, true), 'instant')
})

test('motion regressions: instant navigation, gated hover, static reduced-motion loader', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
  const chrome = readFileSync(new URL('../src/SiteChrome.tsx', import.meta.url), 'utf8')
  const reader = readFileSync(new URL('../src/PatternPage.tsx', import.meta.url), 'utf8')
  assert.match(chrome, /scrollTo\(\{ top: 0, behavior: 'instant' \}\)/)
  assert.match(reader, /keyboardActivated = event.detail === 0/)
  assert.match(reader, /sectionScrollBehavior\(keyboardActivated, reduceMotion\)/)
  assert.match(css, /html \{[^}]*scroll-behavior: auto;/)
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\) \{[\s\S]*?\.pattern-card:hover \.pattern-arrow \{[^}]*transform: translateX\(5px\)/)
  assert.match(css, /\.pattern-card:focus-visible \{[^}]*transition: none;/)
  assert.doesNotMatch(css, /transition: width|animation-duration: \.01ms/)
  assert.match(css, /\.reader-header \{ position: sticky; transition: transform \.28s cubic-bezier\(\.16,1,\.3,1\); \}/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.loading-rule::after \{ animation: none; transform: scaleX\(\.6\); \}/)
  assert.match(css, /\.pattern-card:hover \.pattern-arrow, \.pattern-card:active, \.menu-button:active \{ transform: none; \}/)
})

test('drawer motion is limited to pointer entry and pointer Close', () => {
  // Mouse, touch, and pen click activation share the pointer policy.
  assert.deepEqual(drawerMotionPolicy('pointer', false, true), { mode: 'pointer', duration: 220 })
  assert.deepEqual(drawerMotionPolicy('pointer', false, false), { mode: 'pointer', duration: 160 })
  for (const opening of [true, false]) {
    assert.deepEqual(drawerMotionPolicy('pointer', true, opening), { mode: 'pointer', duration: 120 })
    for (const activation of ['keyboard', 'escape', 'section', 'desktop']) {
      for (const reduced of [true, false]) {
        assert.deepEqual(drawerMotionPolicy(activation, reduced, opening), { mode: 'instant', duration: 0 })
      }
    }
  }
})

test('drawer lifecycle keeps exits mounted and supports instant and reduced-motion paths', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
  const reader = readFileSync(new URL('../src/PatternPage.tsx', import.meta.url), 'utf8')
  assert.match(css, /transition: transform 220ms var\(--ease-drawer\), opacity 220ms var\(--ease-drawer\)/)
  assert.match(css, /transition-duration: 160ms/)
  assert.match(css, /@media \(max-width: 1120px\) and \(prefers-reduced-motion: reduce\) \{[\s\S]*?transform: none;[\s\S]*?transition: opacity 120ms var\(--ease-out\)/)
  assert.match(reader, /event.target !== event.currentTarget \|\| event.propertyName !== 'opacity'/)
  assert.match(reader, /policy.duration \+ 50/)
  assert.match(reader, /requestDrawerClose\('escape'\)/)
  assert.match(reader, /requestDrawerClose\('section'\)/)
  assert.match(reader, /requestDrawerClose\('desktop'\)/)
  assert.match(reader, /event.detail > 0 \? 'pointer' : 'keyboard'/)
})
