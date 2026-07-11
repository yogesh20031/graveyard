# Journey reference — every structure, every animation

A complete technical map of the graveyard experience: the landing walk
through the gate, and the single continuous journey behind it — About the
Keeper, then a real fork in the road where the visitor chooses between
Trials & Experience and Lessons Unearthed. This is the detailed companion to
[ARCHITECTURE.md](./ARCHITECTURE.md) (folder conventions) and
[SESSION-LOG.md](./SESSION-LOG.md) (chronological narrative of how it got
here) — this doc instead answers "what exactly is on screen, and what
exactly is animating, at any given point in the scroll."

---

## 1. The whole page, top to bottom

```
src/app/page.tsx
  <Hero />                    ── outside the gate (landing)
  <GraveyardJourney />        ── everything inside, id="about":
    <WalkStage stations=[
      about: arrival → monument → studies → tools → passions
      journey-junction         ── the Crossroads fork (choose a road)
      <chosen road only>       ── trials OR lessons stations
      journey-other-road       ── offer the road not taken
      journey-epilogue         ── mailto + GitHub
    ]>
    <GraveyardFloor />        ── closing ground strip
    "You walked the whole path…"
```

One continuous night and **one continuous walk**: a single pinned
`WalkStage` carries every station past the same scene. At the crossroads
only the chosen road's content renders — picking the other road later (at
`journey-other-road`) swaps the branch and walks the visitor back to its
start.

---

## 2. The landing walk — "outside the gate"

**Files:** `Hero.tsx` → `ParallaxScene.tsx` → `scene/{SkyLayer,HillsLayer,
ForegroundLayer,FogLayer,geometry}.tsx`

### Structure

`ParallaxScene` is a `250vh` tall track. Inside it, a `sticky top-0 h-dvh
overflow-hidden` viewport holds four stacked SVG/div layers, back to front:

1. **SkyLayer** — moon + stars, `viewBox 0 0 1440 810`, farthest, moves least.
2. **HillsLayer** — the far hill silhouette, a mausoleum, a dead tree, a
   scattering of distant tombstones.
3. **ForegroundLayer** — the near ground, the winding path, the fence, the
   gate (pillars + arch + apex lantern), tombstones, and every "scary
   resident": weeping angel, Celtic cross, skeletal hand, mummy, lamp post,
   two mirrored gnarled trees, a crow, guttering candles, ground clutter.
4. **FogLayer** — three blurred HTML divs drifting over everything.

Layered on top: the hero copy (name, tagline, two CTAs) and a bouncing
`↓` scroll cue anchored to `#about`.

All four layers render from one shared `geometry.ts` — same `viewBox="0 0
1440 810"` and `preserveAspectRatio="xMidYMax slice"` — so they stay
registered with each other while parallax moves them at different rates.

### The scroll mechanism

```
useScroll({ target: containerRef, offset: ["start start", "end end"] })
  → scrollYProgress (0 → 1 across the 250vh track)
  → useSpring(stiffness: 90, damping: 26)   — smooths it into `progress`
```

Every animated layer is a `useTransform(progress, [0,1], [from, to])` fed
into `motion.div style={{ ... }}` (MotionValues can only be applied via the
`style` prop — that's the documented motion API, not a hand-rolled inline
style).

| Layer | Transform | Range | Effect |
|---|---|---|---|
| Sky | `y` | `0 → 80` | drifts down slowly (farthest = slowest) |
| Hills | `y` | `0 → -140` | rises |
| Hills | `scale` (origin-bottom) | `1 → 1.35` | grows |
| Foreground | `y` | `0 → 90` | rises faster than hills |
| Foreground | `scale` (origin-bottom) | `1 → 2.6` | grows past 2× — the gate opening becomes wider than the viewport, i.e. you've walked through it |
| Fog | `opacity` | `[0,0.5,1] → [1,0.4,0.4]` | thins after the first half |
| Fog | `scaleX` | `1 → 1.3` | stretches |
| Hero copy | `opacity` | `[0,0.18,0.38] → [1,1,0]` | holds, then falls away early — you stop reading before you're through the gate |
| Hero copy | `y` | `[0,0.38] → [0,-60]` | falls upward as it fades |
| Fog-wall overlay | `opacity` | `[0.6,0.92] → [0,0.97]` | closes over the view late — **capped at 0.97**, never fully opaque, so gate silhouettes ghost through into the handoff instead of a blank white/dark frame |

`prefers-reduced-motion` renders all four layers as plain absolutely-stacked
static `div`s with no track/sticky/motion at all, copy shown at full opacity.

### Notable structural details

- **Gate is dead center** (`GATE_LEFT=640` / `GATE_RIGHT=800` of a 1440-wide
  viewBox → the opening is symmetric around x=720). It was reported as
  "shifted left" mid-session; the real cause was that the mausoleum's bright
  pulsing doorway on the left drew the eye more than the dim, unlit gate.
  Fixed by making the gate the brightest thing in frame (arch + apex lantern,
  moonlit pillar faces) and dimming the mausoleum ember to a static `/12`
  opacity.
- **Moon detail** (`SkyLayer.tsx`): a 52px-radius disc with a maria layer
  (4 blurred dark ellipses via `filter="url(#moon-soft)"`), 11 individually
  placed craters each with a sunlit rim + shadowed bowl, one "Tycho-style"
  rayed crater with 6 fanning lines, and a rim-shading ring clipped to the
  disc so it reads as a sphere, not a flat circle.
- **Button hash-link fix** (`Button.tsx`): any `href` starting with `#`
  renders a plain `<a>` instead of Next `Link` — `Link`'s router re-appends
  the hash when one is already present in the URL, which is what caused
  `/#about#about`. Lenis (`anchors: true`) already owns the smooth-scroll
  behavior for these, so the router doesn't need to touch them at all.

---

## 3. The journey system — `WalkStage`

**File:** `src/components/journey/JourneyWalk.tsx`

One pinned first-person scene that the entire journey walks through.
`GraveyardJourney` hands it a flat list of stations; the component pins the
scene for `stations.length` viewports of scroll and streams every station
past.

### Track sizing

No height map: the scroll track is a flow block of one `h-[160dvh]` div per
station, pulled up under the pinned scene with `-mt-[100dvh]`. The track is
therefore always exactly `count × 160dvh` tall, for any station count —
**1.6 viewports of walking per station** sets the pace (one viewport read
as a sprint; "train running" was the feedback). Each track div carries
`data-station-key={key}` — this is the DOM anchor `GraveyardJourney` uses
to keep the scroll position stable when the branch below the fork swaps
(see §6); all the anchor math measures the track-div height rather than
assuming a viewport, so the pace can be retuned by changing one class.

### Layers inside the sticky viewport

Everything sits inside a **bob wrapper** (`absolute inset-x-0 -inset-y-2`)
whose `y` oscillates `sin(progress × GROUND_CYCLES × 2 × 2π) × 5px` — the
footstep rhythm. The 8px vertical overscan means the bob never exposes a
frame edge. Inside it, back to front:

| Layer | Transform | Range |
|---|---|---|
| SkyLayer | `y` | `0 → -70` |
| AboutBackdrop | `y` / `scale` (origin-bottom) | `0→80` / `1→1.25` |
| AboutForeground | `y` / `scale` (origin-bottom) | `0→170` / `1→1.5` |
| PassingScenery | per-item transforms (see below) | inside the foreground layer |
| GroundFlow (cobbles) | per-item transforms (see below) | inside the foreground layer |
| FogLayer | `y` | `0 → -50` |
| WatchingEyes | static, absolutely positioned, not scroll-linked |
| `.fog-fade` strip | static top overlay | continues the landing's fog handoff |

Spring: `useSpring(scrollYProgress, { stiffness: 150, damping: 38, mass:
0.35 })` — near-critically damped so the scene tracks Lenis tightly.

### The walking illusion (three scroll-linked systems)

- **GroundFlow** — 8 cobbles cycling `GROUND_CYCLES = 7` times per stage:
  each rises small at the road's vanishing point and sweeps down past your
  feet, lane spread widening as it nears. They are **HTML divs animated only
  by `x`/`y`/`scale` transforms** (compositor-only); the previous version
  animated SVG `cx/cy/rx/ry` attributes, which forced a full-scene repaint
  every frame.
- **PassingScenery** (`PassingScenery.tsx`) — 6 roadside silhouettes
  (headstones, dead trees, a cross, a fence post) cycling
  `SCENERY_CYCLES = 3` times per stage. Each spawns tiny near the vanishing
  point and sweeps out past the left/right frame edge with a **quadratic
  ease** (`v²`) so distant things crawl and near things rush — the
  perspective of walking past. Same transform-only HTML recipe as the
  cobbles.
- **Head-bob** — the ±5px sine on the bob wrapper, frequency locked to the
  cobble cadence (two bobs per cycle ≈ one per stride).

### The station mechanism

```ts
type WalkStationConfig = {
  key: string;
  align?: "center" | "ground"; // "ground" plants it just above the grass
  enter?: "road" | "left" | "right" | "above";
  wide?: boolean;              // span the road (used by the Crossroads)
  node: ReactNode;
};
```

Each station gets an equal slice of progress and a 5-point envelope
`[appear, mid, arrive, depart, gone]`:

- `appear = start − slice×0.55` — emerges well before it's readable
- `arrive = start + slice×0.15` — fully in place early…
- `depart = end − slice×0.10` — …and holds late: each station is fully
  readable for ~75% of its slice (this was the "content isn't shown well"
  fix — previously `0.22/0.15`)
- opacity hits 0.9 by `mid` so the entrance travel is actually seen

Two motion families (`ENTER_ENVELOPES`): **travelers** (`road` — titles,
the fork, the epilogue) grow up the path to centre and pass below;
**planted stones** (`left`/`right`/`above`) appear in place at the roadside
(position from flex layout, not transforms), hold with only a small
walk-past drift, and fade where they stand. First station is already in
front at progress 0; the last stops in front.

**Click-through fix:** stations are absolutely stacked, so two derived
MotionValues keep the stack honest:
```ts
const pointerEvents = useTransform(opacity, (v) => (v > 0.9 ? "auto" : "none"));
const visibility   = useTransform(opacity, (v) => (v < 0.001 ? "hidden" : "visible"));
```
Only the station in its reading zone takes clicks, and fully-faded stations
stop being painted/composited entirely (typically 9–10 of 11 hidden at any
scroll position).

Reduced-motion fallback: static scene layers, stations in normal document
flow — the flow wrappers also carry `data-station-key` so branch-swap
anchoring still works there.

---

## 4. Journey scene art

### `AboutBackdrop.tsx` — horizon layer

Everything *above* the ground line for all three stops: two rows of distant
tombstone silhouettes (`FAR_ROW` at `fill-surface/70`, `HORIZON_ROW` at
`fill-surface/80-90`, some rendered as crosses instead of tombstone shapes),
two mirrored `EdgeTree`s framing the left/right edges, and a `Mummy` standing
among the horizon stones with amber `lantern-glow` eyes. No path, no near
objects — that's deliberately left to `AboutForeground` so this layer reads
purely as "the rest of the graveyard receding into the dark," not a
duplicate of the foreground.

### `AboutForeground.tsx` — the ground you're walking on

The layer that had to be rebuilt mid-session after the road "looked like a
ray of light" — the fix was giving it a dark ground mass to be cut into,
matching the landing's recipe:

- **Ground plane**: one `fill-surface` path from `y=596` down to the bottom
  of the frame — this is what makes the pale road/stones read as *carved
  into dirt* rather than floating on the night-sky gradient behind them.
- **Road** (`Road()`): a wedge narrowing toward the horizon (`fill-foreground/8`),
  two darker wheel-rut paths inside it, and 7 cobble ellipses that shrink
  with simulated distance (14×6 down to 4×2).
- **Grave rows** (`GraveRows()`): a `MID_ROW` and `NEAR_ROW` of `PlantedStone`
  objects (tombstone geometry + a `baseY` + optional `tilt` for a crooked
  lean), plus a standalone cross and a slab that fell face-down long ago.
- **FlankingGraves()**: the huge stones right at your shoulders, cropped by
  the frame edges (one is 240×310 units, deliberately oversized) — epitaph
  lines and a crack rendered onto the left one, a tall cross + companion
  stone on the right.
- **FenceFragment, DeadShrub, SkeletalHand, BonesAndGrass**: smaller detail
  props — a broken 3-picket fence stretch with one picket fallen in the
  grass, a dead shrub, a hand clawing up at the road's edge (`x≈598-632`,
  close enough to nearly step on), a femur, and a dozen small grass-tuft
  paths including a fringe along the very bottom edge of the frame.

### `WatchingEyes.tsx`

Four pairs of small amber dots (`bg-accent-bright/60`) at fixed positions
(`top-40 left-10`, `top-72 right-12`, `bottom-32 left-1/4`, `bottom-52
right-1/5`), each blinking on its own multi-second cycle — see §6 for the
keyframes. Present, unexplained, never addressed by any copy — that's
intentional.

---

## 5. Shared stone components (the "information as graveyard" vocabulary)

These three components are what let every stop show real content (bio,
project history, skills, contact links) without it ever looking like a card
or a website section — they're literally monuments the copy is carved into.

### `StoneSlab.tsx`

The leaning monument used for prose-length content (About's bio, each Trial
entry): `-rotate-1 rounded-t-[3rem]` panel, a small `SkullIcon` above an
etched all-caps `overline` (dates/epitaph line), then freeform children as
the inscription body.

### `HeadstoneRow.tsx` + `StoneBase.tsx`

The crooked mini-headstone row used for list-shaped content (tools,
passions, skills): each item renders as a `rounded-t-full` chip with a tiny
skull, cycling through 4 `STONE_TILTS` (`rotate-2, -rotate-1, rotate-1,
-rotate-2`) so no two stand perfectly straight, sitting on a `StoneBase` —
a small grass/dirt-mound SVG strip (`-mt-4` so it overlaps and "plants" the
row into the ground rather than floating above it).

### `KeeperFigure.tsx`

The one fully-illustrated character vignette: a skeleton sitting against its
own arched headstone (skull with punched eye sockets, spine, tapering ribs,
one arm draped over a bent knee, folded legs, two feet), a smaller stone
half-hiding a mummy with glowing eyes, a guttering candle (flame is now a
`radialGradient` fill, `url(#keeper-glow)`, not a blurred filter — see §7 on
the perf pass), and a few grass tufts. Rendered only at `sm:` and up inside
the About monument station, `grid-cols-[3fr_2fr]` beside the bio slab.

---

## 6. The journey — one walk, a real fork

### Assembly — `GraveyardJourney.tsx` (`id="about"`)

The whole journey is one `WalkStage` with 11 stations:

```
about (5) → journey-junction → chosen road (3) → journey-other-road → journey-epilogue
```

**True branching:** only the chosen road's stations render (`chosen ??
"trials"`). Choosing at the fork, or clicking "Walk the other road" at the
end, calls `setChosen` and then fixes the scroll in a `useLayoutEffect`:

- **From the fork** — `grabForkAnchor()` captures the walker's fraction
  inside the fork's track-div slice *before* the swap; after render the same
  `(index + fraction) × ((count−1)/count) × vh` position is restored
  instantly (`lenis.scrollTo(top, { immediate: true })`). The walker never
  feels the track length change beneath them.
- **From `journey-other-road`** — targets the swapped branch's
  `<branch>-arrival` track div at 0.45 into its slice and scrolls there
  smoothly (Lenis makes it a walk back).
- **Reduced motion** — stations are in normal flow, so a fork swap needs no
  correction at all, and "walk the other road" uses plain `scrollIntoView`.

### First stop — `AboutKeeper.tsx` (5 stations)

1. **Arrival** (center) — "Inside the gates · first stop / About the Keeper".
2. **Monument** (ground, left) — `StoneSlab` (3-paragraph bio) beside
   `KeeperFigure`, on a `StoneBase`.
3. **Studies** (ground, right) — the keeper's schooling: BCA on a
   `StoneSlab`. **⚠️ `STUDY_SCHOOL` / `STUDY_YEARS` are `TODO` placeholders
   — edit the two constants at the top of the file.**
4. **Tools** (ground, left) — `BoulderSlab` — React, Next.js, TypeScript,
   Tailwind CSS.
5. **Passions** (ground, right) — `SkeletonPresenter` + `HeadstoneRow
   title="Buried passions"`, chaining into "the crossroads await".

### The Crossroads — `Crossroads.tsx` (station `journey-junction`, `wide`)

An actual road partition, not a diagram: a full-scene SVG
(`viewBox 0 0 1440 560`, station rendered `max-w-6xl` via the `wide` flag)
drawn in the exact language of the walked road — the trodden-earth Y
(`fill-foreground/8`) splits around a grass wedge, each branch carrying the
walked road's wheel ruts (`fill-surface/70`) and shrinking cobbles. It draws
**no ground of its own**, so the roads are cut straight into the scene
behind and belong to the graveyard. In the crook: a leaning signpost with
two arrow boards ("The Trials" ← / → "The Lessons"), grass tufts, a small
leaning stone, and the flickering lantern on top.

Interaction: two invisible half-width `RoadButton`s (`aria-pressed`,
hover/focus). Hovering or choosing a road washes it amber
(`fill-accent/25` overlay fading in) and lights its signpost board
(`fill-accent-bright`), while a `radialGradient` fog cap rolls over the far
end of the road *not* taken. On mobile (`sm:hidden`) the labels step off the
boards and render as HTML text, since carved boards don't scale down
readably.

### The left road — `TrialsExperience.tsx` (3 stations)

`Arrival + one grave per TRIALS entry` (2 entries today).

```ts
type Trial = { title; period; story; tools: string[]; link?: string };
```

**⚠️ `TRIALS` is a placeholder — both entries ("The First Build", "Client
Trials") are marked `TODO` in the file and need Yogesh's real project/work
history.** Each entry becomes one `TrialGrave` (`StoneSlab` + `StoneBase`);
an optional `link` renders a small "Visit the ruin ↗" anchor on the stone.

### The right road — `LessonsUnearthed.tsx` (3 stations)

1. **Arrival** (center) — "The right road · the knowledge".
2. **Skills** (ground) — two stacked `HeadstoneRow`s: "Dug up" / "Still
   digging".
3. **Field notes** (ground) — a `BoulderSlab` carrying three short carved
   lessons ("On debugging" / "On shipping" / "On learning").

### The road not taken — `OtherRoad.tsx` (station `journey-other-road`)

"You walked The Trials — The Lessons still waits back at the fork." with a
**Walk The Lessons** button (swaps the branch and scrolls back, see
Assembly) and the quiet exit line "or keep walking — the gate is just
ahead".

### Epilogue (station `journey-epilogue`, in `LessonsUnearthed.tsx`)

"The end of the path — for now" + two `Button`s:
`mailto:khanalyogesh0007@gmail.com` (solid, skull) and
`https://github.com/yogesh20031` (outline, new tab) + the music-player
tease.

**⚠️ Epilogue email/GitHub are defaults chosen when a content clarification
question timed out — swap either link if not wanted.**

### Footer — `page.tsx` + `GraveyardFloor.tsx`

The page ends on `<footer className="night-sky">` standing on a
`GraveyardFloor` strip (grass tufts + a half-buried skull, femur, and rib
arcs poking out of the dirt) above the closing copyright line, instead of
ending on bare padding.

---

## 7. Every animation, cataloged

All keyframes live in `src/app/globals.css`. Every one of them has a static
fallback under `prefers-reduced-motion: reduce` (bottom of the file) —
either `animation: none` outright, or (for the flicker/glow families) a
fixed `opacity: 0.4` so the "dying bulb" look survives without the motion.

| Class | Keyframe | Duration | Notes |
|---|---|---|---|
| `.star` / `.star-slow` | `twinkle` (opacity `0.25↔0.9`) | 4s / 7s (+2s delay) | background stars |
| `.lantern-glow` | `lantern-pulse` (opacity `0.55↔1`) | 5s | smooth pulse — used on mummy eyes, keeper candle glow container |
| `.lantern-flicker` / `.lantern-flicker-offset` | `lantern-flicker` (see below) | 7s / 8.5s (offset `-3.2s`) | gate lanterns + lamp post |
| `.candle-flicker` / `-offset` / `-slow` | same `lantern-flicker` keyframe, faster | 3.8s / 4.7s (`-1.9s`) / 5.6s (`-3.4s`) | grave candles + keeper's candle |
| `.watching-eye` / `-delayed` / `-slow` | `eye-blink` (scaleY `1 → 0.08` briefly) | 6s / 7.5s (`-2.8s`) / 9s (`-5.5s`) | the 4 eye pairs |
| `.fog-layer` / `-slow` | `fog-drift` (translateX `∓4%`) | 30s / 45s reverse | the 3 fog puffs |
| `.scroll-cue` | `cue-bounce` (translateY `0↔0.5rem`) | 2.2s | the landing's `↓` |

### The `lantern-flicker` keyframe in detail

This is the "horror movie dying bulb" effect, specifically engineered (per
Yogesh's brief) to feel unstable rather than a smooth pulse:

```css
@keyframes lantern-flicker {
  0%, 100% { opacity: 0.55; }   /* resting dim burn — never bright */
  3%  { opacity: 0.15; }        /* sudden dip */
  4%  { opacity: 0.5;  }        /* recovers */
  9%  { opacity: 0.2;  }
  10% { opacity: 0.6;  }        /* brief near-peak — 0.6 is the ceiling, always */
  38% { opacity: 0.5;  }
  41% { opacity: 0.08; }        /* the near-death dip — lowest point */
  45% { opacity: 0.12; }
  47% { opacity: 0.55; }        /* recovers */
  72% { opacity: 0.25; }
  73% { opacity: 0.5;  }
}
```

Percent keyframes sit back-to-back (e.g. `3%` → `4%`) so transitions are
near-instant jumps rather than eased ramps, and opacity never exceeds `0.6`
— the light is always dying, never healthy. Two gate lanterns run the same
keyframe at different durations with a negative delay on one
(`-3.2s`) so they're never in sync — two independently failing bulbs. Grave
candles reuse the identical keyframe compressed into ~4-5s cycles for a
faster gutter.

### Scroll-linked walking layers (MotionValues, not keyframes)

These aren't CSS animations — they're driven by the walk's spring-smoothed
scroll progress (see §3), and all of them bypass entirely under reduced
motion because the pinned scene itself does:

| System | Motion | Purpose |
|---|---|---|
| GroundFlow cobbles (8) | `x`/`y`/`scale`/`opacity`, 7 cycles per stage | ground continuously walked over |
| PassingScenery (6) | same, 3 cycles, quadratic ease, sweeps past frame edges | roadside stones/trees passing you |
| Head-bob wrapper | `y = sin(progress × 28π) × 5px` | footstep rhythm on the whole view |
| Station envelopes | 5-point opacity/x/y/scale + derived `pointerEvents`/`visibility` | monuments approached on foot |
| Crossroads road lighting | CSS `transition-opacity/colors` on hover/choice (amber wash, board glow, fog cap) | the fork responds to the walker |

### Performance-motivated rewrites

- **All flame/eye glows**: were SVG `<circle>`s under `feGaussianBlur`
  filters animated by opacity — the filter re-rasterizes every frame under
  animation. Replaced with `radialGradient` fills (`#glow-warm`,
  `#keeper-glow`) that cost nothing extra per frame; the *filter* itself is
  gone, only the gradient remains as a static fill.
- **Fog**: was blurred SVG ellipses; replaced with plain blurred HTML
  `<div>`s (`.fog-puff`, `filter: blur(28px)` in CSS, animated via
  `transform` only) — compositor-only, `will-change: transform` hinted.
- **Flowing cobbles**: were `motion.ellipse`s animating `cx/cy/rx/ry` SVG
  attributes — 32 attribute writes per frame forcing the full-screen scene
  SVG to repaint continuously. Now transform-only HTML divs (see §3).
- **Invisible stations**: every station used to stay painted at opacity 0
  with a blanket `will-change-transform`; now `visibility: hidden` culls
  them (9–10 of 11 at any moment) and the hint lives only on the four scene
  layers.
- All flicker/glow classes carry `will-change: opacity`.

---

## 8. Theme tokens in play

```css
[data-theme="graveyard"] {
  --background: #0d1118;      /* deep night blue-black */
  --surface: #060810;         /* darker — ground, silhouettes, panels */
  --foreground: #e8e2d3;      /* pale bone / moonlight */
  --accent: #b8823a;          /* burnt lantern amber */
  --accent-bright: #c99044;   /* darkened this session from #d9a45b, per feedback that hover was "too light" */
}
```

Two derived helpers used throughout the scene work:
- `--tracking-etched: 0.25em` — the carved-letter-spacing on every overline/epitaph/button label.
- `--shadow-glow` — the button-hover lantern glow, built with `color-mix` so it always tracks `--accent` rather than a hardcoded hex.

`.night-sky` is the shared background gradient (`surface → background → background+7%foreground`) applied to every section wrapper so the whole page reads as one continuous sky, not four separately-colored panels.

---

## 9. Known gaps / next actions

- `TrialsExperience.tsx` → replace the 2 placeholder `TRIALS` entries with
  real project/work history (marked `TODO` in the file); add `link` where a
  project has a live site or repo.
- `AboutKeeper.tsx` → fill in `STUDY_SCHOOL` / `STUDY_YEARS` (marked `TODO`
  at the top of the file).
- `LessonsUnearthed.tsx` epilogue → confirm or change the `mailto:` and
  GitHub links (defaults chosen from the brief when a clarifying question
  timed out).
- Visual QA note: plain `--screenshot` headless captures of fragment URLs
  rasterize blank, but driving headless Chrome over CDP (navigate → 
  `window.scrollTo` → wait → `Page.captureScreenshot`) paints correctly —
  see `walkshot.mjs` pattern from the 2026-07-10 session for scripted
  verification of scrolled/pinned states.
- Uncommitted work in the tree — review and commit when ready.
