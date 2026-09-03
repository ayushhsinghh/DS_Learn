export type PatternSummary = {
  title: string
  slug: string
  sectionCount: number
  collection?: 'Dynamic Programming'
}

export type Pattern = PatternSummary & {
  content: string
  sections: { title: string; id: string; line: number }[]
  sourceUrl: string
}

type PatternDefinition = PatternSummary & {
  load: () => Promise<{ default: string }>
  sourceUrl?: string
}

const dsaSourceUrl = 'https://app.notion.com/p/3c9890465d8480e5abb0e76e8d7df3a8'
const dynamicProgrammingSourceUrl = 'https://app.notion.com/p/3cf890465d8480a38040fc3f991b7594'

const definitions: PatternDefinition[] = [
  { title: '2 Pointers', slug: '2-pointers', sectionCount: 7, load: () => import('./content/2-pointers.md?raw') },
  { title: 'Sliding Window', slug: 'sliding-window', sectionCount: 10, load: () => import('./content/sliding-window.md?raw') },
  { title: 'Prefix Sum', slug: 'prefix-sum', sectionCount: 12, load: () => import('./content/prefix-sum.md?raw') },
  { title: 'Overlapping Intervals', slug: 'overlapping-intervals', sectionCount: 12, load: () => import('./content/overlapping-intervals.md?raw') },
  { title: 'Linked List', slug: 'linked-list', sectionCount: 14, load: () => import('./content/linked-list.md?raw') },
  { title: 'Matrix Manipulation', slug: 'matrix-manipulation', sectionCount: 8, load: () => import('./content/matrix-manipulation.md?raw') },
  { title: 'Binary Search', slug: 'binary-search', sectionCount: 16, load: () => import('./content/binary-search.md?raw') },
  { title: 'Top K Elements', slug: 'top-k-elements', sectionCount: 16, load: () => import('./content/top-k-elements.md?raw') },
  { title: 'Stack', slug: 'stack', sectionCount: 20, load: () => import('./content/stack.md?raw') },
  { title: 'Queue', slug: 'queue', sectionCount: 18, load: () => import('./content/queue.md?raw') },
  { title: 'Greedy Algorithm', slug: 'greedy-algorithm', sectionCount: 19, load: () => import('./content/greedy-algorithm.md?raw') },
  { title: 'Recursion', slug: 'recursion', sectionCount: 26, load: () => import('./content/recursion.md?raw') },
  { title: 'Binary Tree Fundamentals and Traversals', slug: 'binary-tree-fundamentals-and-traversals', sectionCount: 53, load: () => import('./content/binary-tree-fundamentals-and-traversals.md?raw') },
  { title: 'Binary Tree Problem Patterns', slug: 'binary-tree-problem-patterns', sectionCount: 18, load: () => import('./content/binary-tree-problem-patterns.md?raw') },
  { title: 'Binary Search Trees', slug: 'binary-search-trees', sectionCount: 28, load: () => import('./content/binary-search-trees.md?raw') },
  { title: 'Backtracking', slug: 'backtracking', sectionCount: 40, load: () => import('./content/backtracking.md?raw') },
  { title: 'Graph Traversal Problems', slug: 'graph-traversal-problems', sectionCount: 56, load: () => import('./content/graph-traversal-problems.md?raw') },
  { title: 'Union-Find / Disjoint Set Union', slug: 'union-find-disjoint-set-union', sectionCount: 40, load: () => import('./content/union-find-disjoint-set-union.md?raw') },
  { title: 'Topological Sorting', slug: 'topological-sorting', sectionCount: 49, load: () => import('./content/topological-sorting.md?raw') },
  { title: 'Shortest Path Algorithms', slug: 'shortest-path-algorithms', sectionCount: 61, load: () => import('./content/shortest-path-algorithms.md?raw') },
  { title: 'Minimum Spanning Trees', slug: 'minimum-spanning-trees', sectionCount: 57, load: () => import('./content/minimum-spanning-trees.md?raw') },
  { title: 'Linear 1D Dynamic Programming', slug: 'linear-1d-dynamic-programming', sectionCount: 17, collection: 'Dynamic Programming', sourceUrl: dynamicProgrammingSourceUrl, load: () => import('./content/linear-1d-dynamic-programming.md?raw') },
  { title: '0/1 Knapsack Dynamic Programming', slug: '0-1-knapsack-dynamic-programming', sectionCount: 17, collection: 'Dynamic Programming', sourceUrl: dynamicProgrammingSourceUrl, load: () => import('./content/0-1-knapsack-dynamic-programming.md?raw') },
  { title: 'Unbounded Knapsack Dynamic Programming', slug: 'unbounded-knapsack-dynamic-programming', sectionCount: 17, collection: 'Dynamic Programming', sourceUrl: dynamicProgrammingSourceUrl, load: () => import('./content/unbounded-knapsack-dynamic-programming.md?raw') },
  { title: 'Sequence, Subsequence and Palindrome Dynamic Programming', slug: 'sequence-subsequence-and-palindrome-dynamic-programming', sectionCount: 18, collection: 'Dynamic Programming', sourceUrl: dynamicProgrammingSourceUrl, load: () => import('./content/sequence-subsequence-and-palindrome-dynamic-programming.md?raw') },
]

export const patterns: PatternSummary[] = definitions.map(({ load: _load, sourceUrl: _sourceUrl, ...summary }) => summary)

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractSections(content: string) {
  const sectionCounts = new Map<string, number>()
  const sections: Pattern['sections'] = []
  let fence: string | null = null

  for (const [lineIndex, line] of content.split('\n').entries()) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/)
    if (fenceMatch) {
      const marker = fenceMatch[1][0]
      fence = fence === marker ? null : fence ?? marker
      continue
    }
    if (fence) continue

    const headingMatch = line.match(/^## (.+)$/)
    if (!headingMatch) continue
    const title = headingMatch[1].replace(/[`*_]/g, '')
    const baseId = slugify(title) || 'section'
    const count = (sectionCounts.get(baseId) ?? 0) + 1
    sectionCounts.set(baseId, count)
    sections.push({ title, id: count === 1 ? baseId : `${baseId}-${count}`, line: lineIndex + 1 })
  }

  return sections
}

const patternCache = new Map<string, Promise<Pattern>>()

export function loadPattern(slug: string): Promise<Pattern> {
  const definition = definitions.find((pattern) => pattern.slug === slug)
  if (!definition) return Promise.reject(new Error('That DSA pattern does not exist.'))

  const cached = patternCache.get(slug)
  if (cached) return cached

  const pending = definition.load()
    .then(({ default: content }) => {
      if (!content.trim()) throw new Error(`The “${definition.title}” pattern has no content.`)
      return {
        title: definition.title,
        slug: definition.slug,
        sectionCount: definition.sectionCount,
        content: content.trim(),
        sections: extractSections(content),
        sourceUrl: definition.sourceUrl ?? dsaSourceUrl,
      }
    })
    .catch((error) => {
      patternCache.delete(slug)
      throw error
    })
  patternCache.set(slug, pending)
  return pending
}

export function prefetchPattern(slug: string) {
  return loadPattern(slug).then(() => undefined, () => undefined)
}
