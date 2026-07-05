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

## Phase 2 — The journey ✅ (2026-07-04)

- ✅ **Walking through the gate**: the hero is a pinned scroll track — the
  foreground zooms past the viewport edges, fog closes over, and you
  emerge inside the graveyard (entering, not scrolling)
- ✅ **About the Keeper** (`#about`): first-person walk — keeper monument
  + skeleton, tools and passions as planted headstones
- ✅ **Trials & Experience** (`#experience`): one grave per project/job
  (content is placeholder — edit `TRIALS` in `TrialsExperience.tsx`)
- ✅ **Lessons Unearthed** (`#lessons`): skills as headstone rows +
  epilogue with contact (email / GitHub)
- All three stops share `JourneyWalk` (same scene layers, same walking
  mechanics) for a consistent journey; the footer stands on the
  graveyard floor

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
