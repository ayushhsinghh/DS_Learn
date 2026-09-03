import notionSource from './notion.md?raw'

export type Pattern = {
  title: string
  slug: string
  content: string
  sections: { title: string; id: string }[]
}

const patternTitles = [
  '2 Pointers',
  'Sliding Window',
  'Prefix Sum',
  'Overlapping Intervals',
  'Linked List',
  'Matrix Manipulation',
  'Binary Search',
  'Top K Elements',
  'Stack',
  'Queue',
  'Greedy Algorithm',
  'Recursion',
  'Binary Tree Fundamentals and Traversals',
  'Binary Tree Problem Patterns',
  'Binary Search Trees',
  'Backtracking',
  'Graph Traversal Problems',
  'Union-Find / Disjoint Set Union',
  'Topological Sorting',
  'Shortest Path Algorithms',
  'Minimum Spanning Trees',
] as const

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function presentNotionMarkdown(markdown: string) {
  return markdown
    .replace(/<callout[^>]*>\n([\s\S]*?)\n<\/callout>/g, (_, body: string) =>
      body
        .split('\n')
        .map((line) => `> ${line.replace(/^\t/, '')}`)
        .join('\n'),
    )
    .replace(/<table_of_contents\s*\/>/g, '')
    .replace(/^# /gm, '## ')
}

function splitPatterns(source: string): Pattern[] {
  const starts = patternTitles.map((title) => ({
    title,
    marker: `# ${title}`,
    index: source.indexOf(`\n# ${title}\n`) >= 0 ? source.indexOf(`\n# ${title}\n`) + 1 : source.indexOf(`# ${title}\n`),
  }))

  return starts.map((entry, index) => {
    const next = starts[index + 1]
    const raw = source
      .slice(entry.index + entry.marker.length, next ? next.index : source.length)
      .trim()
    const content = presentNotionMarkdown(raw)
    const sections = Array.from(content.matchAll(/^#{2,3} (.+)$/gm)).map((match) => ({
      title: match[1].replace(/[`*_]/g, ''),
      id: slugify(match[1].replace(/[`*_]/g, '')),
    }))

    return {
      title: entry.title,
      slug: slugify(entry.title),
      content,
      sections,
    }
  })
}

export const patterns = splitPatterns(notionSource)
