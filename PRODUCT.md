# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People preparing for an upcoming software development interview who need to revise data structures and algorithms.

## Product Purpose

DSA Revision helps interview candidates study DSA patterns through an easy-to-navigate, easy-to-read website. Each pattern has its own page and follows a consistent presentation flow. Success means a learner can quickly find a pattern and move through its revision material without relearning the interface.

## Positioning

The product organizes DSA revision around separate pattern pages that share one predictable learning structure, making comparison, recall, and repeated review straightforward.

## Operating Context

Learners browse or search the pattern library, open a dedicated pattern route, move through its sections, and use previous/next navigation to continue revision.

The initial educational material was imported from the Notion pages “DSA Revision” and “Dynamic Programming.” Those imports are seed data only. The website is now an independent content surface and may be edited without synchronizing changes back to Notion.

## Capabilities and Constraints

- Responsive web interface built with React, TypeScript, and Vite.
- Searchable index of DSA patterns.
- One direct route per pattern.
- Shared long-form reader layout with section links, pattern progress, and previous/next navigation.
- The initial content imports must remain faithful to the supplied Notion sources; future website content may evolve independently.
- The current seed contains 25 pattern pages, including four Dynamic Programming topics.

## Brand Commitments

- Product name: DSA Revision.
- Content should be clear, structured, and suitable for focused interview preparation.

## Evidence on Hand

- Seed content: 21 lessons imported from “DSA Revision” and four lessons imported from the supplied “Dynamic Programming” Notion page.
- Content-to-route model: `src/data/patterns.ts`.
- Current application and navigation behavior: `src/App.tsx`.
- Current responsive presentation: `src/styles.css`.
- No testimonials, customer claims, performance claims, or external proof assets have been supplied; future work must not fabricate them.

## Product Principles

1. Keep every pattern easy to find.
2. Give every pattern its own stable page.
3. Preserve a predictable learning flow across topics.
4. Optimize for focused reading and repeated revision.
5. Code should be properly color-coded, and any code sections that don’t need to be shown by default should be collapsed.
6. Treat the website as the content authority after the initial Notion import.
