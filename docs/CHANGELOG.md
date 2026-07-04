# Changelog

All notable changes, grouped by phase. See [ROADMAP.md](./ROADMAP.md) for
what each phase covers.

## Phase 1 fine-tune — detailed moon & dying gate lights — 2026-07-04

### Changed

- **Moon** (`SkyLayer.tsx`) — rebuilt from a flat disc into a textured full
  moon matching Yogesh's reference photo: blurred dark maria patches, ~11
  craters with sunlit rims and shadowed bowls, a bright Tycho-style rayed
  crater near the bottom, and clipped rim shading so the disc reads as a
  sphere. Still monochrome bone-on-night, tokens only.
- **Gate lanterns** (`globals.css`, `ForegroundLayer.tsx`) — replaced the
  healthy 5s pulse with a horror-movie `lantern-flicker`: dim base
  (burnt `--accent` instead of `accent-bright`), abrupt stutters, one
  near-death dip per cycle, and a capped ~0.6 ceiling so the light never
  feels safe. The two bulbs run different durations with a negative delay
  so they fail independently. Under `prefers-reduced-motion` they hold a
  static dim glow. The mummy's eyes keep the slow organic pulse.

## Phase 1 update — scroll journey & scary touches — 2026-07-04

### Added

- **Dependencies (confirmed with Yogesh):** `motion` (scroll-linked
  parallax + reveals) and `lenis` (smooth inertia scrolling)
- **Smooth scrolling** — `SmoothScrollProvider` (client) wraps the app in
  `ReactLenis` with `anchors: true`, so wheel scrolling glides and the
  `#journey` anchor links scroll smoothly; skipped entirely under
  `prefers-reduced-motion`
- **Parallax scene** — `GraveyardScene` split into depth layers in
  `src/components/landing/scene/` (`SkyLayer`, `HillsLayer`,
  `ForegroundLayer`, `FogLayer`, shared `geometry.ts`); the client
  `ParallaxScene` moves them at different speeds while the foreground
  scales up — scrolling feels like walking toward the gate while the fog
  parts
- **Reveal** (`components/ui/Reveal.tsx`) — reusable fade-and-rise
  `whileInView` wrapper; used for the hero copy, journey cards
  (staggered), and footer
- **Scary touches** — `SkullIcon` (reusable, in the primary CTA and on the
  journey cards), a skeletal hand clawing out of the dirt, and a mummy
  peeking from behind the tall tombstone with amber eyes pulsing on the
  lantern rhythm
- **Tokens** — `--accent-bright` (hover amber) and `--shadow-glow`
  (lantern-glow box shadow)

### Changed

- `--accent` darkened `#d9a45b` → `#b8823a` (CTA read too light)
- Button hover smoothed: `transition-all duration-300 ease-out`, slight
  lift + amber glow; solid variant now brightens to `accent-bright`
  instead of snapping to bone-white

## Phase 1 — 2026-07-04

### Added

- **Theme system** — semantic CSS tokens under `[data-theme="graveyard"]`
  in `globals.css`, mapped to Tailwind utilities via `@theme inline`; theme
  registry in `src/themes/themes.ts` (`docs/THEMING.md` explains it)
- **Palette** — night `#0d1118` / deep night `#060810`, bone `#e8e2d3`,
  lantern amber `#d9a45b`
- **Fonts** — Cinzel (display, via `next/font`) alongside Geist (body)
- **UI primitives** — `Button` (solid/outline/ghost × md/lg, renders a link
  when given `href`), `Card`
- **Landing page** — hero over a hand-built SVG graveyard scene (moon,
  twinkling stars, tombstones, iron fence, open gate with pulsing amber
  lanterns, drifting fog), journey teaser cards, footer; all animation is
  CSS-only and disabled under `prefers-reduced-motion`
- **Docs** — `docs/` folder with ROADMAP, ARCHITECTURE, THEMING, CHANGELOG

### Changed

- `layout.tsx` — real metadata (title/description), `data-theme` on
  `<html>`, dropped unused Geist Mono
- `.gitignore` — ignore `.npmrc` (it contains an npm auth token and must
  never be committed)

### Removed

- Default `create-next-app` placeholder page and its SVGs in `public/`

### Notes

- No third-party runtime libraries were added in this phase. Possible
  future additions (e.g. a motion library in Phase 2/4) will be confirmed
  before installing.
