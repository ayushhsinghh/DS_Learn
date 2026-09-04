---
name: DSA Revision
description: A calm, rigorous editorial field guide for deliberate DSA interview revision.
colors:
  signal-vermilion: "#e9623b"
  editorial-vermilion: "#b43d20"
  structural-teal: "#275f5a"
  softened-structural-teal: "#2f6b64"
  note-ochre: "#835f1d"
  error-clay-red: "#9f3a24"
  deep-pine-ink: "#182c29"
  body-ink: "#263633"
  softened-ink: "#51605c"
  warm-study-paper: "#f3efe5"
  deep-study-paper: "#e9e2d3"
  sage-study-paper: "#e5ece6"
  clay-study-paper: "#f2e6d9"
  gold-study-paper: "#f2ead2"
  reading-cream: "#fffdf7"
  rule-line: "#c9c2b3"
  code-surface: "#142825"
  code-caption-surface: "#1b3430"
  code-text: "#e9f0ed"
  code-keyword: "#ff9b7d"
  code-type: "#8ed8c4"
  code-string: "#f3d27e"
  code-number: "#b8c8ff"
  code-comment: "#93aaa4"
  inline-code-paper: "#f0e9dc"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(3.3rem, 7vw, 7rem)"
    fontWeight: 500
    lineHeight: 0.91
    letterSpacing: "-0.055em"
  pattern-display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(3.4rem, 6vw, 5.6rem)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.9rem, 3vw, 2.7rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.5rem, 2.1vw, 2.1rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.78
  label:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.12em"
rounded:
  square: "0"
  inline-code: "3px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "34px"
  xl: "64px"
components:
  pattern-card:
    backgroundColor: "rgba(255,253,247,.28)"
    textColor: "{colors.deep-pine-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.square}"
    padding: "25px"
  pattern-card-hover:
    backgroundColor: "{colors.deep-pine-ink}"
    textColor: "{colors.warm-study-paper}"
    typography: "{typography.title}"
    rounded: "{rounded.square}"
    padding: "25px"
  menu-button:
    backgroundColor: "transparent"
    textColor: "{colors.structural-teal}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "10px 14px"
  menu-button-active:
    backgroundColor: "{colors.structural-teal}"
    textColor: "{colors.reading-cream}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "10px 14px"
  search-field:
    backgroundColor: "transparent"
    textColor: "{colors.deep-pine-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "14px 0"
  reading-callout:
    backgroundColor: "{colors.gold-study-paper}"
    textColor: "{colors.deep-pine-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "22px 24px"
  code-block:
    backgroundColor: "{colors.code-surface}"
    textColor: "{colors.code-text}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "24px"
  table-header:
    backgroundColor: "{colors.structural-teal}"
    textColor: "{colors.reading-cream}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px"
  loading-state:
    backgroundColor: "{colors.sage-study-paper}"
    textColor: "{colors.structural-teal}"
    typography: "{typography.title}"
    rounded: "{rounded.square}"
    padding: "64px 7vw"
  error-state:
    backgroundColor: "{colors.clay-study-paper}"
    textColor: "{colors.error-clay-red}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "30px"
---

# Design System: DSA Revision

## Overview

**Creative North Star: "The Interviewer’s Desk"**

The system should feel like carefully arranged working material on an experienced interviewer’s desk: calm enough for sustained concentration, rigorous enough to signal trusted preparation, and editorial enough to make dense technical material inviting. Warm paper fields, dark ink, measured rules, oversized serif headings, and small mono annotations give every pattern the same dependable study rhythm.

The experience is precise, editorial, and lightly tactile. Color behaves like real material on the desk: vermilion editing marks direct attention, teal organizes structure and navigation, ochre identifies conceptual notes, and related paper tints separate layers. The result must never drift toward gamified, glossy, or dashboard-like UI.

**Key Characteristics:**

- Warm, chromatically related paper surfaces rather than application white.
- Large editorial serif hierarchy paired with readable sans-serif explanations.
- Mono indices and labels that behave like precise desk annotations.
- Sharp geometry, fine rules, restrained signals, and softly separated layers.
- Quiet long-form reading framed by persistent global and local navigation.
- Color that explains role and state while remaining understandable without color.

## Colors

The palette resembles ink, study paper, editing marks, reference tabs, and dark code panels. Its temperature is warm and restrained; chroma is concentrated in meaningful interactions and learning structures.

### Primary

- **Signal Vermilion** (`#e9623b`): Decorative progress, active rules, code-panel edges, and the signature offset behind the home index card.
- **Editorial Vermilion** (`#b43d20`): Accessible small text, pattern indices, hero emphasis, links on hover, and focused search treatment.

### Secondary

- **Structural Teal** (`#275f5a`): Navigation actions, table headers, article links, tertiary headings, and loading states.
- **Softened Structural Teal** (`#2f6b64`): Section counts, pager labels, and supporting structural text.

### Tertiary

- **Note Ochre** (`#835f1d`): Interviewer notes, invariants, and core mental-model callouts.
- **Error Clay Red** (`#9f3a24`): Recoverable content-loading errors on Clay Study Paper.

### Neutral

- **Deep Pine Ink** (`#182c29`): Primary headings, dark panels, footer, brand mark, and major interactive reversals.
- **Body Ink** (`#263633`): Long-form article text.
- **Softened Ink** (`#51605c`): Secondary descriptions and inactive navigation.
- **Warm Study Paper** (`#f3efe5`): Global canvas.
- **Deep Study Paper** (`#e9e2d3`): Global pattern rail and layered neutral surfaces.
- **Sage Study Paper** (`#e5ece6`): Local-navigation rail, reader header, loading surface, and the hero’s secondary field.
- **Clay Study Paper** (`#f2e6d9`): Active global navigation and error surface.
- **Gold Study Paper** (`#f2ead2`): Conceptual callouts.
- **Reading Cream** (`#fffdf7`): High-clarity article surface.
- **Rule Line** (`#c9c2b3`): Dividers, card boundaries, table cells, and progress tracks.
- **Code Surface / Code Caption Surface** (`#142825` / `#1b3430`): Dark fenced-code hierarchy.
- **Code Text** (`#e9f0ed`): Default code foreground.
- **Code Keyword / Type / String / Number / Comment**: A warm coral, mint, gold, periwinkle, and muted sage syntax system that remains legible on Code Surface.
- **Inline Code Paper** (`#f0e9dc`): Compact notation embedded in prose.

**The Red Pencil Rule.** Vermilion marks action, progress, selection, or editorial emphasis; it is not a general-purpose surface fill.

**The Structural Teal Rule.** Teal belongs to wayfinding, reference structures, and links. It should not compete with vermilion for primary emphasis.

**The Paper Family Rule.** Use Warm, Deep, Sage, Clay, Gold, and Reading Cream as related physical layers; introduce plain white only when the reading contrast specifically requires it.

**The Color-Plus Rule.** Active, error, and navigation meaning must also appear through text, position, borders, underlines, or surface changes.

## Typography

**Display Font:** Newsreader (with Georgia and serif fallbacks)  
**Body Font:** Manrope (with system UI and sans-serif fallbacks)  
**Label/Mono Font:** DM Mono (with ui-monospace and monospace fallbacks)

**Character:** Newsreader supplies an assured editorial voice for pattern names and section hierarchy. Manrope keeps technical explanations neutral and legible, while DM Mono turns navigation numbers, code metadata, progress, and labels into precise annotations.

### Hierarchy

- **Display:** Medium Newsreader, `clamp(3.3rem, 7vw, 7rem)`, `0.91` line-height. Home hero only.
- **Pattern Display:** Medium Newsreader, `clamp(3.4rem, 6vw, 5.6rem)`, `0.94` line-height. Pattern-page title.
- **Headline:** Semibold Newsreader, `clamp(1.9rem, 3vw, 2.7rem)`, `1.08` line-height. Major article sections.
- **Title:** Medium Newsreader, `clamp(1.5rem, 2.1vw, 2.1rem)`, `1.05` line-height. Pattern cards and pager destinations.
- **Body:** Regular Manrope at `1rem` with `1.78` line-height. Explanations, lists, tables, and controls.
- **Label:** Medium DM Mono at `11px` with `0.12em` tracking. Indices, progress, code captions, source links, and navigation headings.

**The Three-Voice Rule.** Serif explains hierarchy, sans-serif carries reading, and mono supplies code or compact metadata; do not swap their jobs casually.

**The Tight Display Rule.** Large serif headings use compact leading and negative tracking, while body copy retains generous line spacing.

## Layout

The home surface uses an asymmetric hero: an expansive Warm Study Paper text field beside a Sage Study Paper field holding the dark index card. Below it, source-aligned collection headings separate DSA Revision topics from Dynamic Programming topics without changing the shared card treatment. Each ruled three-column pattern grid collapses to two columns at `900px` and one column at `620px`. Tablet portrait stacks the hero over a vertical paper split, while phone landscape restores a compact two-column composition when horizontal room permits. Large-screen horizontal padding is viewport-relative; mobile page padding is `22px`.

The reader uses a centered three-column desk layout: a `245px` global pattern rail, a content column capped at `830px`, and a `220px` local on-page rail beneath a `76px` sticky header. Below `1120px` the local rail disappears. Below `900px` both rails yield to a full-width reader; the global pattern rail stays hidden and the local page contents become a fixed, full-viewport, independently scrolling drawer with its own sticky toolbar. At `620px`, the header becomes `66px` high and code panels truly bleed to the viewport edges while their text respects device safe areas. Short landscape screens tighten the header and vertical reading rhythm. Below `400px`, the wordmark yields to the compact D/ mark. Headers, drawers, route states, and touch targets account for notches, home indicators, and coarse pointers.

Long code blocks, tables, and lesson content load independently. The reader and the chosen pattern are route-split; the home index stays lightweight, intent preloading prepares a selected lesson, and the next pattern prefetches during browser idle time.

**The Reading Column Rule.** Navigation may frame the article but must never compete with its width, contrast, or hierarchy.

**The Collapse with Intent Rule.** Peripheral navigation disappears or becomes a drawer before the reading column is compressed below a comfortable measure.

## Elevation & Depth

The system is softly lifted but flat by default. Tonal paper layering and fine rules establish most hierarchy. Ambient depth appears only under dark code panels, while the home index card retains one deliberate hard vermilion offset as a signature editorial object.

### Shadow Vocabulary

- **Index Card Offset** (`14px 14px 0 #e9623b`): Singular structural gesture behind the home index card; reduced to `9px 9px 0 #e9623b` below `620px`.
- **Code Ambient** (`0 10px 28px rgba(24,44,41,.13)`): Soft room-light separation for fenced code and code disclosures.

**The Desk, Not Glass Rule.** Elevation should resemble stacked paper and soft room light; avoid glassmorphism, reflective gradients, and luminous dashboard panels.

**The Flat-by-Default Rule.** Do not add shadows to ordinary cards, navigation items, tables, or controls.

## Shapes

The form language is square and ruled. Cards, controls, panels, tables, disclosures, and navigation surfaces use sharp corners; hierarchy comes from paper color, rules, reversals, and offsets instead of rounded containers. Inline code alone uses a `3px` radius so notation remains distinct inside prose. The slightly rotated square brand mark is the recurring geometric signature.

**The Sharp Surface Rule.** Major containers stay square. Rounded pills and generic soft dashboard cards are outside the established system.

## Components

Components feel precise, editorial, and lightly tactile. Interaction should resemble ink reversing on paper or a reference marker moving into place.

Directional, search, and external-link marks use one authored square-ended SVG stroke system. Text glyphs and emoji do not substitute for interface icons.

### Buttons

- **Mobile Contents:** Transparent Sage/Deep Study Paper, Structural Teal text, a `1px` Structural Teal border, square corners, and `10px 14px` padding.
- **Hover / Expanded:** Structural Teal fill with Reading Cream text.
- **Focus:** A visible `2px` Deep Pine Ink outline with `3px` offset; forced-colors mode uses system colors.

### Cards / Containers

- **Pattern Collection:** A serif source title and compact mono topic count precede each ruled group. Collections add orientation without becoming another card layer.
- **Pattern Card:** A faint Reading Cream wash over Warm Study Paper, square corners, `25px` padding, and ruled grid boundaries.
- **Metadata:** Editorial Vermilion index, Softened Structural Teal section count, and a vermilion arrow.
- **Hover / Focus:** Full Deep Pine Ink reversal; metadata shifts to a pale green-tinted foreground and the arrow becomes coral. Focus retains a visible inset outline.
- **Pressed:** The card moves down `2px` for a brief paper-like response.
- **Index Card:** Deep Pine Ink, Reading Cream copy, Signal Vermilion top marker, and the signature offset shadow.

### Inputs / Fields

- **Search:** Transparent, unboxed, and anchored by one Deep Pine Ink rule.
- **Focus:** The rule grows to `3px` and changes to Editorial Vermilion; the caret uses Signal Vermilion.
- **Empty Result:** A serif message announced through a polite live region.

### Navigation

- **Source Presentation:** Imported provenance remains internal documentation; the public interface stays focused on study navigation and does not expose external source links.
- **Global Rail:** Deep Study Paper with compact Manrope labels and DM Mono indices.
- **Active Item:** Clay Study Paper wash, Deep Pine Ink text, a vermilion left rule, stable position, and `aria-current="page"`.
- **Local Rail:** Sage Study Paper. It maps only the article's top-level `##` section headings; `###` subheadings remain in the reading flow. Links underline and shift to Structural Teal on hover.
- **Mobile Reading Header:** The full lesson header appears only at the page top. After a deliberate downward scroll it leaves the viewport; upward scroll within the lesson reveals only a `44px` contents icon at the top-right, never the full header. The icon disappears again on downward scroll. Desktop remains stable.
- **Mobile Contents Drawer:** Lists only the current lesson's top-level sections. It fills the viewport, owns vertical touch scrolling without overscroll chaining, and freezes the lesson at its exact reading position. One compact drawer-owned sticky toolbar keeps Close permanently reachable; the underlying lesson header is hidden from view and assistive technology. Opening moves focus to the first section; choosing a section closes the drawer, while Close or Escape returns focus to the restored header control. Pattern switching remains available through the library and previous/next links.

### Reading Callout

Gold Study Paper, Deep Pine Ink body text, Note Ochre heading treatment, and a `5px` ochre editorial rule. Use for imported invariants, interviewer notes, and core mental models—not generic notifications.

### Code

Inline code uses Editorial Vermilion on Inline Code Paper. Fenced code uses a Code Surface panel, a darker caption strip, a vermilion rule, pale base text, and semantic Java token colors. Blocks longer than twelve lines collapse into native disclosures; captions state language and line count. Code and tables use `content-visibility: auto` below the fold.

### Tables

Structural Teal headers with Reading Cream text, `12px` cells, and Rule Line borders. On mobile, the table becomes its own horizontal scrolling region instead of widening the page.

### Loading, Error, and Empty States

Route states retain the brand header and centered editorial hierarchy, avoiding a visual jump into an unrelated screen. Loading uses Structural Teal on Sage Study Paper, exposes `aria-busy`, and includes one vermilion rule animation; reduced-motion preferences collapse its duration. Content errors use Error Clay Red on Clay Study Paper with a visible recovery link and `role="alert"`. Unknown routes remain neutral, explain the likely problem, and return the learner to the pattern library.

## Do's and Don'ts

### Do:

- **Do** use Newsreader for conceptual hierarchy, Manrope for sustained reading, and DM Mono for code or compact metadata.
- **Do** use vermilion for action and editorial signal, teal for structure, and ochre for conceptual notes.
- **Do** preserve Warm, Deep, Sage, Clay, Gold, and Reading Cream as one coordinated paper family.
- **Do** pair every color-coded state with position, copy, a rule, underline, or surface change.
- **Do** keep the article column dominant and collapse peripheral navigation before reading comfort suffers.
- **Do** preserve visible focus, reduced-motion behavior, forced-color support, and local scrolling for wide code or tables.
- **Do** keep lesson content independently loadable and the home route lightweight.

### Don't:

- **Don't** introduce gamified progress rewards, glossy surfaces, dashboard widgets, or ornamental metrics.
- **Don't** turn Signal Vermilion, Structural Teal, or Note Ochre into broad decorative fills.
- **Don't** add rounded pills or generic soft cards to primary surfaces.
- **Don't** add shadows to ordinary elements; depth is reserved for the index card and code panels.
- **Don't** use color as the only indication of selection, navigation, status, or error.
- **Don't** collapse the three-font role system into one undifferentiated typographic voice.
- **Don't** make a visual change that forces all pattern content back into the initial application bundle.
