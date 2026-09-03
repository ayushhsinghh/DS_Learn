---
name: DSA Revision
description: A calm editorial field guide for deliberate DSA interview revision.
colors:
  signal-vermilion: "#e9623b"
  deep-pine-ink: "#182c29"
  body-ink: "#263633"
  softened-ink: "#51605c"
  warm-study-paper: "#f3efe5"
  deep-study-paper: "#e9e2d3"
  reading-cream: "#fffdf7"
  rule-line: "#c9c2b3"
  code-surface: "#142825"
  code-text: "#e9f0ed"
  inline-code-accent: "#b43d20"
  inline-code-paper: "#f0e9dc"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(3.3rem, 7vw, 7rem)"
    fontWeight: 500
    lineHeight: 0.91
    letterSpacing: "-0.055em"
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
    backgroundColor: "{colors.warm-study-paper}"
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
    textColor: "{colors.deep-pine-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "10px 14px"
  search-field:
    backgroundColor: "transparent"
    textColor: "{colors.deep-pine-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "14px 0"
  callout:
    backgroundColor: "{colors.warm-study-paper}"
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
---

# Design System: DSA Revision

## Overview

**Creative North Star: "The Interviewer’s Desk"**

The system should feel like carefully arranged working material on an experienced interviewer’s desk: calm enough for sustained concentration, rigorous enough to signal trusted preparation, and editorial enough to make dense technical material inviting. It balances a warm paper field with dark ink, measured rules, oversized serif headings, and small mono labels that behave like annotations.

The experience is precise, editorial, and lightly tactile. Expressiveness comes from scale, typography, paper texture, asymmetrical composition, and restrained use of the signal color—not from product-dashboard chrome. Avoid gamified, glossy, or dashboard-like visual language.

**Key Characteristics:**

- Warm paper and reading surfaces rather than bright application white.
- Large, tightly set serif headlines paired with highly readable sans-serif body copy.
- Mono labels, indices, and progress markers that feel annotated rather than decorative.
- Sharp geometry, fine rules, and one strong signal color.
- Quiet long-form reading framed by persistent orientation and navigation.

## Colors

The palette resembles ink, paper, editing marks, and dark code panels; Signal Vermilion is rare and directional, while Deep Pine Ink carries structure and authority.

### Primary

- **Signal Vermilion:** Used for editorial emphasis, active rules, progress, section labels, and the hard offset behind the index card.

### Neutral

- **Deep Pine Ink:** Primary headings, navigation emphasis, dark panels, and major interactive reversals.
- **Body Ink:** Long-form article text on the light reading surface.
- **Softened Ink:** Secondary descriptions, metadata, and inactive navigation.
- **Warm Study Paper:** The global page field and supporting callout surface.
- **Deep Study Paper:** A reserved darker paper tone available for layered neutral surfaces.
- **Reading Cream:** The article column and high-clarity content surface.
- **Rule Line:** Dividers, grid boundaries, and table strokes.
- **Code Surface / Code Text:** High-contrast fenced-code treatment.
- **Inline Code Accent / Inline Code Paper:** Compact code notation embedded within prose.

**The Red Pencil Rule.** Signal Vermilion marks hierarchy, progress, or a meaningful interaction; it must not become a general-purpose fill across the interface.

**The Paper Before White Rule.** Reading and navigation surfaces use the established paper neutrals before introducing plain white.

## Typography

**Display Font:** Newsreader (with Georgia and serif fallbacks)  
**Body Font:** Manrope (with system UI and sans-serif fallbacks)  
**Label/Mono Font:** DM Mono (with ui-monospace and monospace fallbacks)

**Character:** Newsreader supplies an assured editorial voice for pattern names and section hierarchy. Manrope keeps technical explanations neutral and legible, while DM Mono turns navigation numbers, labels, and progress into precise desk annotations.

### Hierarchy

- **Display:** Medium-weight, fluid oversized serif with compact leading and tight tracking. Used for the home hero and primary pattern titles.
- **Headline:** Semibold fluid serif with tight tracking. Used for major article sections.
- **Title:** Medium fluid serif. Used for pattern cards and pager destinations.
- **Body:** Regular sans-serif with generous leading. Used for explanations, lists, tables, and controls.
- **Label:** Medium 11px mono with wide tracking and uppercase treatment. Used for eyebrows, navigation headings, indices, and source links.

**The Three-Voice Rule.** Serif explains hierarchy, sans-serif carries reading, and mono supplies metadata; do not swap their jobs casually.

**The Tight Display Rule.** Large serif headings use compact leading and negative tracking, while body copy retains generous line spacing.

## Layout

The home surface uses a generous asymmetric hero: an expansive text field beside a compact dark index card, followed by a ruled three-column pattern library. Horizontal padding is viewport-relative on large screens, and the composition collapses to two cards per row below 900px and one card per row below 620px.

The reader uses a centered three-column desk layout: a 245px pattern rail, a content column capped at 830px, and a 220px on-page rail beneath a 76px sticky header. Below 1120px the on-page rail disappears; below 900px both side rails yield to a full-width reader and an explicit mobile contents drawer. Mobile page padding is 22px, and fenced code deliberately bleeds to the viewport edges for usable line length.

Spacing is generous around conceptual transitions: major article sections separate vertically, while labels and navigation use a compact 8–12px rhythm. The central reading column stays visually dominant even when peripheral navigation is present.

**The Reading Column Rule.** Navigation may frame the article but must never compete with its width, contrast, or hierarchy.

**The Collapse with Intent Rule.** Peripheral navigation disappears or becomes a drawer before the reading column is compressed below a comfortable measure.

## Elevation & Depth

The chosen philosophy is softly lifted: depth should feel ambient and paper-like rather than glossy. The current implementation is mostly flat and conveys separation through tonal surfaces, fine rules, and sticky layers; its only pronounced depth gesture is the index card’s hard vermilion offset shadow. An ambient shadow token has not yet been implemented and should be resolved before adding new lifted surfaces.

### Shadow Vocabulary

- **Index Card Offset:** A 14px by 14px zero-blur Signal Vermilion shadow on larger screens, reduced to 9px by 9px on small screens. It is a signature editorial gesture, not the default surface elevation.

**The Desk, Not Glass Rule.** Elevation should resemble stacked paper and soft room light; avoid glassmorphism, reflective gradients, and luminous dashboard panels.

## Shapes

The form language is predominantly square and ruled. Cards, controls, panels, tables, and code blocks use sharp corners; hierarchy comes from borders, background changes, and offsets instead of rounded containers. Inline code alone uses a subtle 3px radius so notation remains distinct inside prose. The rotated square brand mark is the recurring geometric signature.

**The Sharp Surface Rule.** Major containers stay square. Rounded pills and soft dashboard cards are outside the established system.

## Components

Components are precise, editorial, and lightly tactile: their state changes should feel like ink reversing on paper or a physical index moving under the hand.

### Buttons

- **Shape:** Sharp rectangular outline with no corner radius.
- **Primary:** The implemented mobile contents control uses transparent paper, Deep Pine Ink text, a 1px ink border, and compact 10px by 14px padding.
- **Hover / Focus:** Current buttons rely on the browser’s interactive feedback; no custom focus token is implemented yet.

### Cards / Containers

- **Corner Style:** Square.
- **Background:** Pattern cards inherit Warm Study Paper; the hero index uses Deep Pine Ink.
- **Shadow Strategy:** Pattern cards remain flat; the hero index alone uses the signature offset shadow.
- **Border:** Fine Rule Line strokes create a continuous editorial grid.
- **Internal Padding:** Pattern cards use 25px; the hero index uses 34px, reduced to 27px on mobile.
- **State:** Pattern cards reverse from paper and ink to Deep Pine Ink and paper; their arrow shifts horizontally as a restrained tactile cue.

### Inputs / Fields

- **Style:** Search is a borderless transparent field resting on a single ink underline, with no surrounding box or radius.
- **Focus:** No custom focus treatment is currently implemented.
- **Error / Disabled:** No error or disabled state is currently implemented.

### Navigation

- **Style:** Navigation uses compact sans-serif labels paired with mono indices. Desktop rails are sticky and separated from the article by fine rules.
- **Default / Hover / Active:** Inactive items use Softened Ink. Hover and active items gain Deep Pine Ink, a faint ink wash, and a Signal Vermilion left rule.
- **Mobile:** The pattern rail becomes a full-width drawer beneath the sticky 66px header and is controlled by a bordered Contents/Close button.

### Reading Callout

Callouts use Warm Study Paper inside the Reading Cream article, with a 5px Signal Vermilion left rule and a slightly larger Newsreader voice. They surface invariants and core mental models without adopting alert-box styling.

### Code

Inline code uses the compact rounded paper treatment. Fenced code uses a square Deep Pine code panel, pale code text, mono typography, generous 24px padding, and a 5px vermilion rule. On small screens the panel bleeds to both viewport edges and reduces the rule to 3px.

## Do's and Don'ts

### Do:

- **Do** use Newsreader for conceptual hierarchy, Manrope for sustained reading, and DM Mono for annotation-level information.
- **Do** preserve the warm paper field, high-clarity reading cream, deep ink structure, and restrained Signal Vermilion accents.
- **Do** build hierarchy through scale, spacing, fine rules, tonal layering, and sharp geometry.
- **Do** keep the article column dominant and allow navigation to collapse before reading comfort suffers.
- **Do** use subtle movement only to communicate navigation, progress, or state, and preserve reduced-motion behavior.

### Don't:

- **Don't** introduce gamified progress rewards, glossy surfaces, dashboard widgets, or ornamental metrics.
- **Don't** turn Signal Vermilion into a broad background color or decorative gradient field.
- **Don't** add rounded pill controls or generic soft cards to primary surfaces.
- **Don't** use ambient shadow as decoration; when implemented, it should clarify the layering of paper-like surfaces.
- **Don't** collapse the three-font role system into one undifferentiated typographic voice.
