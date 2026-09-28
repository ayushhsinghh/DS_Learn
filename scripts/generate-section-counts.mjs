import { readFile, readdir, writeFile } from 'node:fs/promises'
import { extractSections } from '../src/data/sections.ts'

const directory = new URL('../src/data/content/', import.meta.url)
const counts = {}
for (const file of (await readdir(directory)).filter(file => file.endsWith('.md')).sort()) {
  const slug = file.slice(0, -3)
  counts[slug] = extractSections((await readFile(new URL(file, directory), 'utf8')).trim(), slug).length
}
await writeFile(new URL('../src/data/section-counts.json', import.meta.url), JSON.stringify(counts, null, 2) + '\n')
