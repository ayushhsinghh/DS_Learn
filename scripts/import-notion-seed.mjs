import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = resolve(projectRoot, 'src/data/notion.md')
const outputDirectory = resolve(projectRoot, 'src/data/content')
const force = process.argv.includes('--force')

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
]

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function presentNotionMarkdown(markdown) {
  return markdown
    .replace(/<callout[^>]*>\n([\s\S]*?)\n<\/callout>/g, (_, body) =>
      body.split('\n').map((line) => `> ${line.replace(/^\t/, '')}`).join('\n'),
    )
    .replace(/<table_of_contents\s*\/>/g, '')
    .replace(/^# /gm, '## ')
}

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

const source = await readFile(sourcePath, 'utf8')
const starts = patternTitles.map((title) => {
  const marker = `# ${title}`
  const indexWithLeadingLine = source.indexOf(`\n${marker}\n`)
  return {
    title,
    marker,
    index: indexWithLeadingLine >= 0 ? indexWithLeadingLine + 1 : source.indexOf(`${marker}\n`),
  }
})

const missing = starts.filter((entry) => entry.index < 0)
if (missing.length > 0) throw new Error(`Missing pattern headings: ${missing.map((entry) => entry.title).join(', ')}`)

await mkdir(outputDirectory, { recursive: true })

for (const [index, entry] of starts.entries()) {
  const next = starts[index + 1]
  const content = presentNotionMarkdown(
    source.slice(entry.index + entry.marker.length, next ? next.index : source.length).trim(),
  )
  const outputPath = resolve(outputDirectory, `${slugify(entry.title)}.md`)
  if (!force && await exists(outputPath)) {
    throw new Error(`${outputPath} already exists. Re-run with --force only when intentionally replacing website content from the seed.`)
  }
  await writeFile(outputPath, `${content}\n`, 'utf8')
}

console.log(`Imported ${starts.length} pattern files from the Notion seed.`)
