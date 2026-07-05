# Journey reference — every structure, every animation

A complete technical map of the graveyard experience as it stands after this
session: the landing walk through the gate, and the three-stop journey
behind it (About the Keeper → Trials & Experience → Lessons Unearthed). This
is the detailed companion to [ARCHITECTURE.md](./ARCHITECTURE.md) (folder
conventions) and [SESSION-LOG.md](./SESSION-LOG.md) (chronological narrative
of how it got here) — this doc instead answers "what exactly is on screen,
and what exactly is animating, at any given point in the scroll."

Not committed yet — everything described below is uncommitted working-tree
state on top of `996ac50`, per standing instruction.

---

## 1. The whole page, top to bottom

```
src/app/page.tsx
  <Hero />                  ── outside the gate (landing)
  <AboutKeeper />           ── stop 1, id="about"
  <TrialsExperience />      ── stop 2, id="experience"
  <LessonsUnearthed />      ── stop 3, id="lessons"
  <footer>
    <GraveyardFloor />      ── closing ground strip
    "You walked the whole path…"
  </footer>
```

One continuous night: every section shares the same theme tokens, the same
scene vocabulary (moon, fog, silhouettes), and — from `AboutKeeper` onward —
the exact same walking mechanism (`JourneyWalk`). The visitor never leaves
the graveyard; they walk into it once at the top and keep walking until the
footer.

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

## 3. The journey system — `JourneyWalk`

**File:** `src/components/journey/JourneyWalk.tsx`

This is the one component every stop behind the gate (`AboutKeeper`,
`TrialsExperience`, `LessonsUnearthed`) renders through. It reproduces the
landing's exact walking feel — pinned viewport, scroll-driven parallax,
first-person composition — and adds a **station** system for arranging
discrete pieces of content along the walk.

### Track sizing

```ts
const TRACK_HEIGHTS: Record<number, string> = {
  3: "h-[300vh]",
  4: "h-[400vh]",
  5: "h-[500vh]",
};
```
Track length scales with how many stations a stop has (100vh of scroll per
station), applied via `cn("relative", TRACK_HEIGHTS[stations.length] ??
"h-[400vh]")`.

### Layers inside the sticky viewport (same 4-layer recipe as landing, journey-specific art)

| Layer | Transform | Range |
|---|---|---|
| SkyLayer | `y` | `0 → -50` |
| AboutBackdrop | `y` / `scale` (origin-bottom) | `0→36` / `1→1.4` |
| AboutForeground | `y` / `scale` (origin-bottom) | `0→60` / `1→2.2` |
| FogLayer | `y` | `0 → -30` |
| WatchingEyes | static, absolutely positioned, not scroll-linked |
| `.fog-fade` strip | static top overlay, thins downward | continues the landing's fog handoff so the top of each section doesn't start on a hard edge |

Same `useScroll` + `useSpring(90, 26)` pattern as the landing. Reduced-motion
fallback: layers rendered statically absolute-positioned, and stations
rendered in normal document flow (`flex flex-col gap-24 py-24`) instead of
pinned/animated.

### The station mechanism

```ts
type WalkStationConfig = {
  key: string;
  align?: "center" | "ground";   // "center" floats mid-screen, "ground" sits just above the grass
  node: ReactNode;
};
```

Each station gets an equal slice of the scroll progress: `start = index /
count`, `end = (index+1) / count`, with a fade window `fade = (end-start) *
0.3` at each edge.

- **First station**: visible at progress 0, fades out over `[end-fade, end]`.
- **Last station**: hidden at 0, fades in over `[start, start+fade]`, then holds to 1.
- **Middle stations**: 4-point envelope `[start, start+fade, end-fade, end] → [0,1,1,0]` — rises in, holds, falls away.

`y` moves in lockstep with opacity: `60 → 0 → 0 → -60` (rises up out of the
fog from below, holds level, sinks back down as you leave it) — this is
what makes each station feel like a physical thing you walk up to and then
past, not a slide that just cross-fades.

**Click-through fix:** since all stations are absolutely stacked
(`absolute inset-0`), an invisible station would otherwise sit on top of the
visible one and swallow its clicks. Fixed with a derived MotionValue:
```ts
const pointerEvents = useTransform(opacity, (v) => (v > 0.6 ? "auto" : "none"));
```
Only the station that's actually legible can be interacted with — this is
what makes the epilogue's email/GitHub buttons (three stops later, in
`LessonsUnearthed`) clickable at all.

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

## 6. The three stops

### Stop 1 — `AboutKeeper.tsx` (`id="about"`)

4 stations, `h-[400vh]` track:

1. **Arrival** (center) — "Inside the gates · first stop / About the Keeper"
   + one-line intro + "Keep walking".
2. **Monument** (ground) — `StoneSlab` (2-paragraph bio) beside `KeeperFigure`,
   sitting on a `StoneBase`.
3. **Tools** (ground) — `HeadstoneRow title="The keeper's tools"` — React,
   Next.js, TypeScript, Tailwind CSS.
4. **Passions** (ground) — `HeadstoneRow title="Buried passions"` — Music,
   Travel, Nature photography, Gaming, Sports — plus "The trials lie just
   ahead — keep to the path" chaining into stop 2.

### Stop 2 — `TrialsExperience.tsx` (`id="experience"`)

Station count is dynamic: `Arrival + one grave per TRIALS entry + Closing`.
Currently 2 entries → 4 stations, `h-[400vh]`.

```ts
type Trial = { title: string; period: string; story: string; tools: string[] };
const TRIALS: Trial[] = [ /* 2 placeholder entries, marked TODO */ ];
```

**⚠️ `TRIALS` is a placeholder — both entries ("The First Build", "Client
Trials") are marked `TODO` in the file and need Yogesh's real project/work
history.** Each entry becomes one `TrialGrave`: a `StoneSlab` with the
period as the overline, the title as an `h3`, the story as prose, and the
tools joined `" · "` at the base, sitting on a `StoneBase`.

### Stop 3 — `LessonsUnearthed.tsx` (`id="lessons"`)

3 stations, `h-[300vh]`:

1. **Arrival** (center) — "Further still · third stop / Lessons Unearthed".
2. **Skills** (ground) — two stacked `HeadstoneRow`s: "Dug up" (HTML & CSS,
   JavaScript, TypeScript, React, Next.js, Tailwind CSS, Git) and "Still
   digging" (Animations & motion, Accessibility, Backend basics).
3. **Epilogue** (center) — "The end of the path — for now" + two `Button`s:
   `mailto:khanalyogesh0007@gmail.com` (solid, skull) and
   `https://github.com/yogesh20031` (outline, opens in a new tab) + a line
   teasing the future music player phase.

**⚠️ Epilogue email/GitHub are also defaults chosen when a content
clarification question timed out — swap either link if not wanted.**

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

### Performance-motivated rewrites this session

- **All flame/eye glows**: were SVG `<circle>`s under `feGaussianBlur`
  filters animated by opacity — the filter re-rasterizes every frame under
  animation. Replaced with `radialGradient` fills (`#glow-warm`,
  `#keeper-glow`) that cost nothing extra per frame; the *filter* itself is
  gone, only the gradient remains as a static fill.
- **Fog**: was blurred SVG ellipses; replaced with plain blurred HTML
  `<div>`s (`.fog-puff`, `filter: blur(28px)` in CSS, animated via
  `transform` only) — compositor-only, `will-change: transform` hinted.
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
  real project/work history (marked `TODO` in the file).
- `LessonsUnearthed.tsx` epilogue → confirm or change the `mailto:` and
  GitHub links (defaults chosen from the brief when a clarifying question
  timed out).
- Headless-Chrome screenshot verification of fragment-scrolled sections
  (`/#about`, `/#experience`, `/#lessons`) rasterizes blank — a tool
  limitation, not a bug (confirmed correct via `--dump-dom` and would need a
  live browser or real interaction to screenshot properly).
- Nothing in this session is committed — review the working tree and commit
  when ready.
