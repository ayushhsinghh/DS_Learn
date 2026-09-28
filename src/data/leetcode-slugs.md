# LeetCode link registry

`leetcode-slugs.json` maps the problem numbers referenced by the lessons to canonical
slugs from LeetCode's public catalog, https://leetcode.com/api/problems/all/.
Retrieved on 2026-09-29. Lesson titles are display copy, never URL identifiers.

When adding a problem, verify its number and slug against LeetCode and add the
mapping. Unknown numbers render as plain text rather than guessed links; the
prebuild tests reject missing mappings before deployment. No live catalog request
is needed to read, develop, or build the website.
