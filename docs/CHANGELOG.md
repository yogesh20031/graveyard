# Changelog

All notable changes, grouped by phase. See [ROADMAP.md](./ROADMAP.md) for
what each phase covers.

## The playground + scene truth-telling — 2026-07-12

### Added

- **The Playground** (`/playground`) — a skeleton-runner game (Chrome-dino
  style: jump the gravestones, the night gets faster, best score persists
  to `localStorage`). Pure SVG/DOM in the site's own art language — the
  obstacle stones reuse `tombstonePath`. Entered through a **3-second
  scary gate** (`ScaryLoader`: dying lantern, fog, watching eyes, one omen
  per second — deliberate theatre, plays every visit). Linked from the
  Epilogue ("Enter the playground").
- `RoadContext` — carries fork hover/chosen state from the Crossroads
  station down to the scene without prop drilling.
- `useHydratedReducedMotion` — hydration-safe replacement for motion's
  `useReducedMotion`; see Fixed.
- `docs/IMPROVEMENTS.md` — full prioritized audit: problems, animation
  catalogue, music-to-scene coupling plan, what to do next.

### Fixed

- **Road travelers no longer fall from the sky.** Entrance envelopes are
  authored in `dvh` against the shared `ROAD_HORIZON_DVH` — titles emerge
  tiny at the road's vanishing point (below screen centre), grow up out of
  the road (`origin-bottom`), hold, then sweep past your feet.
- **No two stations legible at once.** The old handoff provably lit
  station N at 1.0 while N+1 hit 0.9 (text collided mid-road, visible at
  the passions → Crossroads seam). Outgoing stations are now gone before
  incoming ones are readable, making the `>0.9` pointer-events invariant
  actually true.
- **The fork registers with the walked road by construction** — the Y is
  drawn in `AboutForeground`'s own viewBox sharing the road's stem, opened
  by a scroll-driven MotionValue on approach. The old floating
  `1440×560`-viewBox ForkScene is gone.
- **Reduced-motion hydration failure** — branching whole trees on
  `useReducedMotion()` (server `false`, first client render `true`) made
  React discard the server HTML and log an uncaught error. Both motion
  modes now log zero console errors.
- Stale "music haunts a later phase" copy (the player ships).

## The fork is real — branching walk + walking feel — 2026-07-10

### Added

- **The Crossroads as an actual road partition** — the walked road now
  visibly splits in a full-scene Y-fork (same trodden-earth/ruts/cobbles
  language as the road itself, cut straight into the scene with no panel of
  its own), with a signpost (two arrow boards + dying lantern) in the
  crook. Hovering/choosing a road washes it amber and lights its board
  while fog rolls over the road not taken.
- **True branching** — only the chosen road's stations render below the
  fork. New `OtherRoad` station at each road's end ("You walked The Trials
  — The Lessons still waits back at the fork") swaps the branch and walks
  you back to its start. Scroll position survives the swap via
  `data-station-key` track anchors + Lenis.
- **Walking feel** — footstep head-bob on the whole view, `PassingScenery`
  (roadside silhouettes sweeping past the frame edges with perspective
  easing), flowing cobbles rebuilt as compositor-only transform divs.
- **More content** — Studies station in About (**BCA school/years are
  `TODO` placeholders**), optional `link` on trials ("Visit the ruin ↗"),
  Field-notes boulder in Lessons (three carved lessons learned).

### Changed

- **Walk pace slowed 1.6×** — each station now spans `160dvh` of scroll
  instead of one viewport ("it feels like a train is running" — the whole
  scene, cobbles, scenery, and bob slow together since everything keys off
  the same progress). Scroll-anchor math measures the track-div height, so
  the pace is retunable via one class.
- Station envelopes hold each monument fully readable for ~75% of its
  slice (`arrive` earlier, `depart` later); fully-faded stations are
  culled with `visibility: hidden` instead of staying painted.
- Branch arrivals renamed to match the fork ("The left road · the works" /
  "The right road · the knowledge"); per-branch `Closing` stations removed
  (the `OtherRoad` station closes every road).

## Phase 2 complete — the whole journey walks — 2026-07-04

### Added

- **Trials & Experience** (`#experience`) — second stop: one monument
  grave per project/job from the `TRIALS` array (**placeholder content —
  edit the array in `TrialsExperience.tsx`**), each with period, story,
  and tools carved on a `StoneSlab`
- **Lessons Unearthed** (`#lessons`) — third stop: skills as two
  `HeadstoneRow`s ("Dug up" / "Still digging") and an **epilogue**: "The
  end of the path — for now" with Leave a message (mailto) and Visit the
  crypt (GitHub) buttons, plus the music-player tease
- Shared journey pieces: `JourneyWalk` (renamed from `AboutWalk`; track
  height follows station count; only the station you're standing at takes
  pointer events, so the epilogue buttons are clickable), `StoneSlab`,
  `HeadstoneRow`

### Changed

- `page.tsx`: Hero → About → Trials → Lessons → footer; the footer now
  stands on the `GraveyardFloor` strip ("You walked the whole path…")
- About's last station chains forward ("The trials lie just ahead")

### Removed

- `JourneyPreview.tsx` — the plain teaser cards broke the journey's
  illusion and all three stops are real now

## Landing fix — the gate reads centered again — 2026-07-04

### Fixed

- **"The gate shifted left"** — it hadn't (screenshot-verified: pillars
  flank the exact viewport center at every width). It had become
  *invisible*: near-black pillars on a near-black fence, lanterns dimmed
  by the horror flicker, CTA buttons sitting on top — while the
  mausoleum's bright pulsing doorway on the left hill was the only lit,
  entrance-shaped thing on screen, so the eye adopted it as "the gate."
  Fix: a **wrought-iron arch now spans the gate with a lantern hanging at
  its apex** (dead center, gentle pulse), the pillar faces catch faint
  moonlight, and the mausoleum door was dimmed to a static ember.

## Phase 2 detail pass — real ground, dirt road, darker fog — 2026-07-04

### Changed

- **The About scene got its ground.** `AboutForeground` now draws a dark
  `fill-surface` ground mass from a wavy horizon down — the same move that
  makes the landing work. The road is cut *into* it: pale trodden dirt
  with wheel ruts, half-sunk cobbles shrinking toward the horizon. Around
  it: two grave rows flanking the road (tilted stones, a cross, a slab
  fallen face-down), a mostly-collapsed iron fence fragment, a dead
  shrub, the skeletal hand at the road's edge, grass fringing the bottom.
  The huge flanking stones gained epitaph lines and a crack.
- `AboutBackdrop` reduced to horizon silhouettes (dark stone/cross rows
  against the sky, edge trees, the mummy re-based to stand among the
  horizon stones); `GraveyardFloor` dropped from the walk — the ground
  plane replaced it.
- **No more pale blank screen between landing and About** — the fog wall
  is now dark night fog (`--foreground` mix 24% → 10%) and caps at 0.97
  opacity so the gate silhouettes keep ghosting through while the
  sections hand off; `fog-fade` matched.

## Phase 2 rework — About is a first-person walk — 2026-07-04

### Added

- **`AboutWalk`** (client) — the About section now uses the landing's
  mechanics: it pins for a 400vh walk and scroll progress carries you down
  the path. Four **stations** (arrival text → the keeper's monument +
  skeleton → tools headstones → passions headstones) each rise out of the
  fog as you approach and fall behind as you walk on; the last one stays
  until the section releases. Reduced motion gets a simple static flow.
- **`AboutForeground`** — the first-person feet-level layer: the path
  running out from under you and huge flanking graves half-cropped by the
  frame (scales 2.2× past you — same forward-motion cue as the landing
  foreground); **`AboutBackdrop`** (grave rows, edge trees, mummy, hand)
  sits behind it at mid-speed.
- **`StoneBase`** — dirt mound + grass strip drawn over every planted
  stone's bottom edge, so monuments and headstone rows grow out of the
  ground instead of resting on the page.

### Changed

- Info styling stays stone (leaning monument slab, crooked tilted
  headstone chips with tiny skulls), now planted via `StoneBase` and
  bottom-anchored just above the ground strip; `GraveyardFloor` gained a
  `bones` prop. `AboutScene` (the interim drift parallax) was removed —
  superseded by `AboutWalk`.

## Phase 2 fixes — About lives in the graveyard, smoother animation — 2026-07-04

### Fixed

- **URL turning into `/#about#about`** — hash-only hrefs in `Button` now
  render a plain `<a>` instead of Next `Link`; the router was re-appending
  the hash while Lenis handled the scroll. Same-page anchors never needed
  the router.

### Changed

- **About the Keeper is now *inside* the graveyard, not a page about it**
  — the section keeps the `night-sky` gradient, renders the same
  `SkyLayer` (stars + detailed moon, pinned to the section top), and
  drifting fog at the ground. The information is carved into the scene:
  the bio is the inscription on a monument slab (arched stone panel,
  skull marker), and tools/passions are rows of **mini headstones planted
  in the ground strip**. The keeper skeleton sits on the same ground line.
- **Animation performance pass:**
  - `FogLayer` rebuilt as blurred HTML divs (radial-gradient `fog-puff`s)
    animated with transforms — drift now runs on the GPU compositor
    instead of re-rasterizing SVG `feGaussianBlur` every frame
  - Every flame glow (gate lanterns, lamp post, all candles) swapped from
    `feGaussianBlur` circles to `radialGradient` fills — zero filter cost
    under the flicker animations; `will-change` hints added to the fog and
    flicker classes
- ESLint: `no-unused-vars` now ignores rest siblings (destructure-to-omit
  pattern in `Button`)

## Phase 2 (start) — through the gate & About the Keeper — 2026-07-04

### Added

- **About the Keeper section** (`src/components/journey/`, `#about`) — the
  first stop *inside* the graveyard: `KeeperFigure` (a skeleton settled
  against his headstone, mummy peeking from a second stone, guttering
  candle, grass), `WatchingEyes` (amber pairs blinking on staggered
  cycles in the section's dark edges), `GraveyardFloor` (grass strip with
  a surfacing skull, femur, and rib arcs), and the story itself — epitaph
  intro, bio, "keeper's tools" and "buried passions" carved-stone chips
- CSS: `.fog-wall`, `.fog-fade` (token-derived fog gradients),
  `eye-blink` keyframes + `watching-eye*` classes (reduced-motion safe)

### Changed

- **Scrolling the hero now walks you through the gate** — `ParallaxScene`
  owns a 250vh pinned scroll track: the foreground scales to 2.6× so the
  gate pillars sweep past the viewport edges, the hills approach, the
  hero copy falls away behind you, and a fog wall closes over the screen
  before the page deposits you at `#about`. Reduced motion keeps the old
  single-viewport static hero.
- Hero CTAs point at the real `#about` section; the journey preview now
  shows only the two remaining stops ("The path goes deeper")

## Phase 1 fine-tune — creepier skull, darker hover, fuller scene — 2026-07-04

### Added

- **Scene depth, per Yogesh's reference image** — the graveyard no longer
  stops at the fence:
  - Mid-distance (`HillsLayer`): mausoleum with a cross finial and a
    faintly lit doorway, eight distant stones/crosses along the hill
    crest, a dead tree reaching toward the moon
  - Foreground (`ForegroundLayer`): two gnarled bare trees framing the
    scene, a celtic-cross headstone, a weeping-angel statue, six grave
    candles guttering on staggered flicker timings, an iron lamp post
    lighting the path inside the gate, broken slabs + dry grass along the
    ground, and a crow with one amber eye watching from a branch
  - `candle-flicker` / `-offset` / `-slow` classes reuse the
    `lantern-flicker` keyframes at shorter cycles; static dim under
    `prefers-reduced-motion`
  - Shared geometry (`DISTANT_STONES`, `CANDLES`, `tombstonePath` with a
    `baseY` param) lives in `scene/geometry.ts`

### Changed

- **Button skull is now conditional** — `Button` takes a `skull` prop
  instead of callers passing `<SkullIcon />` as a child; the hero CTA uses
  `<Button skull>`
- **SkullIcon redrawn to be menacing** — angular cracked cranium, eye
  sockets slanted inward like a glare, jagged nasal cavity, gapped teeth,
  hairline crack down the dome (same 24×24 currentColor API)
- `--accent-bright` darkened `#d9a45b` → `#c99044` (button hover read too
  light)

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
