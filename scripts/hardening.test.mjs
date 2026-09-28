import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { extractSections } from '../src/data/sections.ts'
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
