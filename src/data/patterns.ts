import sectionCounts from './section-counts.json'
import { extractSections } from './sections'
export { sentenceCaseHeading } from './sections'

export type PatternSummary = {
  title: string
  slug: string
  sectionCount: number
  collection?: 'Dynamic Programming'
}

export type Pattern = PatternSummary & {
  content: string
  sections: { title: string; id: string; line: number }[]
}

type PatternDefinition = Omit<PatternSummary, 'sectionCount'> & {
  load: () => Promise<{ default: string }>
}

const definitions: PatternDefinition[] = [
  { title: '2 Pointers', slug: '2-pointers', load: () => import('./content/2-pointers.md?raw') },
  { title: 'Sliding Window', slug: 'sliding-window', load: () => import('./content/sliding-window.md?raw') },
  { title: 'Prefix Sum', slug: 'prefix-sum', load: () => import('./content/prefix-sum.md?raw') },
  { title: 'Overlapping Intervals', slug: 'overlapping-intervals', load: () => import('./content/overlapping-intervals.md?raw') },
  { title: 'Linked List', slug: 'linked-list', load: () => import('./content/linked-list.md?raw') },
  { title: 'Matrix Manipulation', slug: 'matrix-manipulation', load: () => import('./content/matrix-manipulation.md?raw') },
  { title: 'Binary Search', slug: 'binary-search', load: () => import('./content/binary-search.md?raw') },
  { title: 'Top K Elements', slug: 'top-k-elements', load: () => import('./content/top-k-elements.md?raw') },
  { title: 'Stack', slug: 'stack', load: () => import('./content/stack.md?raw') },
  { title: 'Queue', slug: 'queue', load: () => import('./content/queue.md?raw') },
  { title: 'Greedy Algorithm', slug: 'greedy-algorithm', load: () => import('./content/greedy-algorithm.md?raw') },
  { title: 'Recursion', slug: 'recursion', load: () => import('./content/recursion.md?raw') },
  { title: 'Binary Tree Fundamentals and Traversals', slug: 'binary-tree-fundamentals-and-traversals', load: () => import('./content/binary-tree-fundamentals-and-traversals.md?raw') },
  { title: 'Binary Tree Problem Patterns', slug: 'binary-tree-problem-patterns', load: () => import('./content/binary-tree-problem-patterns.md?raw') },
  { title: 'Binary Search Trees', slug: 'binary-search-trees', load: () => import('./content/binary-search-trees.md?raw') },
  { title: 'Backtracking', slug: 'backtracking', load: () => import('./content/backtracking.md?raw') },
  { title: 'Graph Traversal Problems', slug: 'graph-traversal-problems', load: () => import('./content/graph-traversal-problems.md?raw') },
  { title: 'Union-Find / Disjoint Set Union', slug: 'union-find-disjoint-set-union', load: () => import('./content/union-find-disjoint-set-union.md?raw') },
  { title: 'Topological Sorting', slug: 'topological-sorting', load: () => import('./content/topological-sorting.md?raw') },
  { title: 'Shortest Path Algorithms', slug: 'shortest-path-algorithms', load: () => import('./content/shortest-path-algorithms.md?raw') },
  { title: 'Minimum Spanning Trees', slug: 'minimum-spanning-trees', load: () => import('./content/minimum-spanning-trees.md?raw') },
  { title: 'Bit Manipulation Fundamentals', slug: 'bit-manipulation-fundamentals', load: () => import('./content/bit-manipulation-fundamentals.md?raw') },
  { title: 'Bitmasking and State Compression', slug: 'bitmasking-and-state-compression', load: () => import('./content/bitmasking-and-state-compression.md?raw') },
  { title: 'Linear 1D Dynamic Programming', slug: 'linear-1d-dynamic-programming', collection: 'Dynamic Programming', load: () => import('./content/linear-1d-dynamic-programming.md?raw') },
  { title: '0/1 Knapsack Dynamic Programming', slug: '0-1-knapsack-dynamic-programming', collection: 'Dynamic Programming', load: () => import('./content/0-1-knapsack-dynamic-programming.md?raw') },
  { title: 'Unbounded Knapsack Dynamic Programming', slug: 'unbounded-knapsack-dynamic-programming', collection: 'Dynamic Programming', load: () => import('./content/unbounded-knapsack-dynamic-programming.md?raw') },
  { title: 'Sequence Dynamic Programming', slug: 'sequence-subsequence-and-palindrome-dynamic-programming', collection: 'Dynamic Programming', load: () => import('./content/sequence-subsequence-and-palindrome-dynamic-programming.md?raw') },
  { title: 'Grid Dynamic Programming', slug: 'grid-dynamic-programming', collection: 'Dynamic Programming', load: () => import('./content/grid-dynamic-programming.md?raw') },
  { title: 'Interval Dynamic Programming', slug: 'interval-dynamic-programming', collection: 'Dynamic Programming', load: () => import('./content/interval-dynamic-programming.md?raw') },
  { title: 'Tree Dynamic Programming', slug: 'tree-dynamic-programming', collection: 'Dynamic Programming', load: () => import('./content/tree-dynamic-programming.md?raw') },
]

export const patterns: PatternSummary[] = definitions.map(({ load: _load, ...summary }) => ({ ...summary, sectionCount: sectionCounts[summary.slug as keyof typeof sectionCounts] }))

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
        sectionCount: extractSections(content.trim(), definition.slug).length,
        content: content.trim(),
        sections: extractSections(content.trim(), definition.slug),
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
