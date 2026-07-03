# Roadmap

The portfolio is built in five phases. Each phase ends with a working,
deployable site and a dated entry in [CHANGELOG.md](./CHANGELOG.md).

## Phase 1 — Foundation & landing page ✅ (2026-07-04)

- Next.js 16 + pnpm + TypeScript + Tailwind v4 scaffold
- Base theme system: semantic CSS tokens under `[data-theme="graveyard"]`
  (see [THEMING.md](./THEMING.md))
- Reusable UI primitives: `Button` (solid/outline/ghost variants), `Card`
- Landing page: the visitor stands *outside* the graveyard — moonlit SVG
  scene, open gate with lanterns, drifting fog, journey teaser cards
- Documentation structure (this `docs/` folder)
- **Scroll journey groundwork (pulled forward from Phase 2):** `motion` +
  `lenis` approved and added; parallax scene layers, smooth scrolling,
  staggered reveals
- Scary details: skull icon in CTAs/cards, skeletal hand, mummy with
  glowing eyes

## Phase 2 — The journey

- Real sections behind the gate: **About the Keeper**, **Trials &
  Experience**, **Lessons Unearthed**
- Scroll-driven storytelling so moving down the page feels like walking
  deeper into the graveyard — the motion stack (`motion` + `lenis`) is
  already in place from Phase 1

## Phase 3 — The music

- Persistent music player pinned bottom-right, playable across the whole
  journey
- Vibe/mood categories the visitor can pick from
- Audio sourcing + licensing to be decided

## Phase 4 — Polish

- Motion & transition pass (entrance animations, parallax depth)
- Accessibility audit (focus order, reduced motion, contrast, screen-reader
  labels)
- Performance & SEO (Lighthouse pass, Open Graph images, metadata)

## Phase 5 — Make it yours

- User-facing **theme picker** (the token architecture from Phase 1 already
  supports this — new themes are one CSS block + one registry entry)
- User-chosen journey: let visitors decide the order/route through the
  sections (component structure keeps sections self-contained for this)
