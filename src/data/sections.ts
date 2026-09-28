export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const topicNavigationTitles: Record<string, { titles: Set<string>; commonFormCount?: number }> = {
  'binary-tree-fundamentals-and-traversals': {
    titles: new Set([
      'TreeNode Structure', 'Core Mental Model', 'Important Tree Terminology', 'Common Binary Tree Types',
      'What Is Tree Traversal?', 'Preorder', 'Inorder', 'Postorder', 'The Three Processing Positions',
      'How to Choose a Traversal', 'How to Identify Tree-Traversal Problems',
      'Traversal Decision Guide', 'Recursive Return Types', 'Null Base Cases and Neutral Values',
      'Quick Interview Checklist', 'Common Mistakes', 'Complexity Analysis', 'Final Reusable Model',
    ]),
    commonFormCount: 8,
  },
  'binary-tree-problem-patterns': {
    titles: new Set([
      'Core Mental Model', 'How to Identify the Pattern', 'Direction-of-Information Guide',
      'Choosing Between Return Value and Global Answer', 'Quick Interview Checklist', 'Common Mistakes',
      'Complexity Analysis', 'Final Reusable Model',
    ]),
    commonFormCount: 9,
  },
  'binary-search-trees': {
    titles: new Set([
      'Core BST Invariant', 'BST versus Binary Tree', 'Important BST Property: Inorder Is Sorted',
      'Balanced and Skewed BSTs', 'How to Identify BST Problems', 'BST Decision Guide',
      'BST Search versus Full Traversal', 'Duplicate Values', 'Quick Interview Checklist', 'Common Mistakes',
      'Complexity Analysis', 'Final Reusable Model',
    ]),
    commonFormCount: 10,
  },
  backtracking: {
    titles: new Set([
      'Core Mental Model', 'Recursion versus Backtracking', 'Decision Tree Mental Model', 'Anatomy of Backtracking',
      'How to Identify Backtracking Problems', 'The Backtracking State', 'Choosing the Correct Form',
      'Understanding the Start Index', 'When to Save an Answer', 'Mutable State versus Value State',
      'Returning Boolean versus Collecting All Answers', 'Backtracking versus Dynamic Programming',
      'Quick Interview Checklist', 'Common Mistakes', 'Complexity Analysis', 'Final Reusable Model',
    ]),
    commonFormCount: 9,
  },
  'graph-traversal-problems': {
    titles: new Set([
      'Core Mental Model', 'DFS versus BFS', 'Decision guide', 'Graph Terminology', 'Graph Representations',
      'Building the Graph Correctly', 'Why We Need visited', 'When to Mark a Node Visited',
      'DFS with Returning Information', 'BFS Without a Separate visited Array', 'Traversing Disconnected Graphs',
      'Marking Visited: Global versus Current Path', 'BFS Level versus Distance Array', 'Quick Interview Checklist',
      'Common Mistakes', 'Complexity Analysis', 'Final Reusable Model',
    ]),
    commonFormCount: 11,
  },
  'union-find-disjoint-set-union': {
    titles: new Set([
      'Core Mental Model', 'When to Use Union-Find', 'Union-Find State', 'Initial State',
      'Basic Union-Find Implementation', 'The find Operation', 'Path Compression', 'Union by Size', 'Union by Rank',
      'Understanding union Return Value', 'Union-Find versus DFS/BFS',
      'Union-Find versus Directed Graph Algorithms', 'Counting Successful and Failed Unions',
      'Indexing Considerations', 'Quick Interview Checklist', 'Common Mistakes', 'Complexity Analysis',
      'Final Reusable Model',
    ]),
    commonFormCount: 12,
  },
  'topological-sorting': {
    titles: new Set([
      'When Is Topological Sorting Possible?', 'Core Mental Model', 'How to Identify Topological-Sort Problems',
      'Constructing the Graph', 'Understanding Indegree', 'Kahn’s Algorithm',
      'Detecting a Cycle with Kahn’s Algorithm', 'DFS Topological Sorting', 'Three-State DFS',
      'Why DFS Adds the Node After Its Neighbors', 'Kahn’s Algorithm versus DFS',
      'Multiple Valid Topological Orders', 'Detecting Whether the Order Is Unique', 'Common Edge-Direction Examples',
      'Common Mistakes', 'Quick Interview Checklist', 'Complexity Analysis', 'Final Reusable Model',
    ]),
    commonFormCount: 10,
  },
  'shortest-path-algorithms': {
    titles: new Set([
      'Core Mental Model', 'Shortest-Path Decision Guide', 'Quick Comparison', 'What Is a Distance Array?',
      'Why a Node May Be Discovered More Than Once', 'BFS Shortest Path',
      'Dijkstra’s Algorithm', 'Bellman–Ford', 'Floyd–Warshall Algorithm',
      'Choosing Single-Source versus All-Pairs', 'Shortest Path versus Minimum Spanning Tree',
      'Integer Overflow and Infinity', 'Common Mistakes', 'Quick Interview Checklist', 'Complexity Analysis',
      'Final Algorithm Selection Model',
    ]),
    commonFormCount: 13,
  },
  'minimum-spanning-trees': {
    titles: new Set([
      'Important Terminology', 'Core Mental Model', 'When to Use an MST', 'MST versus Shortest Path',
      'Fundamental MST Properties', 'Kruskal’s Algorithm', 'Kruskal Template', 'Prim’s Algorithm', 'Prim Template',
      'Prim versus Dijkstra', 'Prim with a Best-Connection Array', 'Kruskal versus Prim',
      'Recovering the Selected MST Edges', 'Detecting a Disconnected Graph', 'Handling Duplicate Edge Weights',
      'Quick Interview Checklist', 'Common Mistakes', 'Complexity Analysis', 'Final Algorithm Selection Model',
    ]),
    commonFormCount: 10,
  },
  'bit-manipulation-fundamentals': {
    titles: new Set([
      'Binary Representation', 'The Mask Mental Model', 'Essential Operators', 'Check, Set, Clear, and Toggle',
      'Shift Operators', 'Two Essential Expressions', 'Power-of-Two Intuition', 'Java-Specific Details',
      'How to Recognize Bit-Manipulation Questions', 'Interview Problem-Solving Checklist', 'Foundation to Memorize',
    ]),
    commonFormCount: 8,
  },
  'bitmasking-and-state-compression': {
    titles: new Set([
      'Why It Is Called State Compression', 'When Bitmasking Is Useful', 'Representing a Set',
      'Number of Possible States', 'State Compression in Dynamic Programming', 'State Compression in BFS',
      'Common Operations', 'Java Limits', 'Core Mental Model',
    ]),
    commonFormCount: 7,
  },
}

const dynamicProgrammingSlugs = new Set([
  'linear-1d-dynamic-programming',
  '0-1-knapsack-dynamic-programming',
  'unbounded-knapsack-dynamic-programming',
  'sequence-subsequence-and-palindrome-dynamic-programming',
  'grid-dynamic-programming',
  'interval-dynamic-programming',
  'tree-dynamic-programming',
])

const dynamicProgrammingSectionTitles = new Set([
  'Introduction to the Pattern', 'How to Identify It', 'State Definition and Recursive Function Contract',
  'Brute-Force Recursive Decision', 'Base Cases', 'Recurrence Relation', 'Memoization Template',
  'Tabulation Template', 'Correct Iteration Order', 'Correct Traversal Order', 'Space Optimization',
  'Common Problem Forms', 'Answer Reconstruction', 'Quick Interview Checklist', 'Common Mistakes',
  'Complexity Analysis', 'Practice Progression', 'Final Reusable Mental Model', 'Core Differences',
])

export function sentenceCaseHeading(value: string, caseState = { capitalizeNext: true }) {
  const canonicalTerms = new Map([
    ['bfs', 'BFS'], ['dfs', 'DFS'], ['dsu', 'DSU'], ['mst', 'MST'], ['dp', 'DP'], ['lc', 'LC'],
    ['java', 'Java'], ['dijkstra', 'Dijkstra'], ['kahn', 'Kahn'], ['bellman–ford', 'Bellman–Ford'],
    ['bellman-ford', 'Bellman-Ford'], ['floyd–warshall', 'Floyd–Warshall'], ['floyd-warshall', 'Floyd-Warshall'],
    ['kruskal', 'Kruskal'], ['prim', 'Prim'], ['union-find', 'Union-Find'], ['bst', 'BST'], ['lca', 'LCA'],
    ['xor', 'XOR'], ['ascii', 'ASCII'], ['avl', 'AVL'], ['treenode', 'TreeNode'], ['morris', 'Morris'],
    ['leetcode', 'LeetCode'], ['unicode', 'Unicode'], ['v', 'V'], ['e', 'E'], ['o', 'O'],
  ])
  return value.toLowerCase().replace(/[\p{L}\p{N}]+(?:[\p{L}\p{M}–-]*[\p{L}\p{N}]+)*|[.!?]+|[^\p{L}\p{N}.!?]+/gu, (token) => {
    if (/^[.!?]+$/.test(token)) {
      caseState.capitalizeNext = true
      return token
    }
    if (!/[\p{L}\p{N}]/u.test(token)) return token

    const canonical = canonicalTerms.get(token) ?? token
    if (!caseState.capitalizeNext) return canonical
    caseState.capitalizeNext = false
    return canonical.replace(/[\p{L}\p{N}]/u, (first) => first.toLocaleUpperCase())
  })
}

function isTopicNavigationHeading(slug: string, title: string) {
  if (dynamicProgrammingSlugs.has(slug)) {
    const unnumberedTitle = title.replace(/^\d+\.\s*/, '')
    return dynamicProgrammingSectionTitles.has(unnumberedTitle)
      || /^Common Form \d+:\s/.test(unnumberedTitle)
  }
  const navigation = topicNavigationTitles[slug]
  if (!navigation) return true
  if (navigation.titles.has(title)) return true
  const commonForm = /^Common Form (\d+):/.exec(title)
  return Boolean(commonForm && Number(commonForm[1]) <= (navigation.commonFormCount ?? 0))
}

export function extractSections(content: string, slug: string) {
  const sectionCounts = new Map<string, number>()
  const sections: { title: string; id: string; line: number }[] = []
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
    const rawTitle = headingMatch[1].replace(/[`*_]/g, '')
    const navigationTitle = dynamicProgrammingSlugs.has(slug) ? rawTitle.replace(/^\d+\.\s*/, '') : rawTitle
    if (!isTopicNavigationHeading(slug, navigationTitle)) continue
    const title = sentenceCaseHeading(navigationTitle)
    const baseId = slugify(title) || 'section'
    const count = (sectionCounts.get(baseId) ?? 0) + 1
    sectionCounts.set(baseId, count)
    sections.push({ title, id: count === 1 ? baseId : `${baseId}-${count}`, line: lineIndex + 1 })
  }

  return sections
}
