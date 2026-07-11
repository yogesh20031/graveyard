# Session log

Working notes per session — what happened, what's open, and what the next
session must know before touching code. Newest session on top.

---

## Session 2026-07-04 — Phase 1: landing page, scroll journey, scary touches

### Goal

Build **Phase 1** from the brief in [`PROMPTS.md`](../PROMPTS.md): the
landing page where the visitor feels like they're standing *outside* the
graveyard, the base theme system, and categorized docs. Mid-session the
scope grew on Yogesh's feedback:

- scrolling should feel like **walking into the graveyard** (smooth,
  parallax)
- the site should be **scary**, not cute — skeletons, mummy
- primary CTA was too light → **darker amber**; button hover should be
  smooth; skull touch on the primary button

### Completed

- Theme system: semantic tokens under `[data-theme="graveyard"]`,
  registry in `src/themes/themes.ts`, future user-theme-picker ready
- Reusable primitives: `Button` (3 variants × 2 sizes), `Card`, `Reveal`,
  `SkullIcon`, `cn()` helper
- Landing page: four-layer SVG night scene (sky / hills / foreground /
  fog) with moon, stars, fence, open gate + pulsing lanterns, tombstones,
  winding path, skeletal hand, mummy with glowing eyes
- Scroll journey: `motion` parallax (`ParallaxScene`) + `lenis` smooth
  scrolling (`SmoothScrollProvider`) + staggered `Reveal`s — all with
  reduced-motion fallbacks. **Both libraries confirmed with Yogesh.**
- Button polish: darker `--accent` (#b8823a), hover brightens to
  `--accent-bright` with lift + `shadow-glow`
- Docs: ROADMAP, ARCHITECTURE, THEMING, CHANGELOG (+ this file)
- Verified: `pnpm build` and `pnpm lint` pass; rendered HTML checked
  against the running dev server
- All work committed in four logical commits (`005008a`…`98bc129`)
- **Fine-tune (later same day, Yogesh feedback):** moon rebuilt with real
  detail (maria, cratered surface, rayed Tycho crater, rim shading — per
  his reference photo) and gate lanterns turned into horror-movie dying
  bulbs: dim burnt amber, abrupt out-of-sync flicker with a near-death
  dip, static dim fallback under reduced motion
- **Fine-tune 2 (Yogesh feedback + reference image):** skull on `Button`
  is now a `skull` prop (conditional, not a hardcoded child) and the icon
  was redrawn menacing; `--accent-bright` darkened to `#c99044`; scene
  filled out like his reference — mausoleum, distant stones, dead tree
  (hills), gnarled framing trees, celtic cross, weeping angel, guttering
  grave candles, lamp post, crow, ground clutter (foreground).
  **Left uncommitted on request — Yogesh reviews and commits himself.**
- **Phase 2 started:** hero rebuilt as a pinned 250vh walk-through-the-gate
  (foreground zooms past the viewport, copy falls away, fog wall closes
  over, you emerge inside); new `components/journey/` folder with the
  **About the Keeper** section — skeleton keeper against his headstone,
  mummy, blinking watching eyes, grass/half-buried-bones floor strip, bio
  copy drawn from `PROMPTS.md` (tools + buried passions as stone chips).
  Journey preview trimmed to the two remaining stops.
  **Also uncommitted — Yogesh reviews the gate walk first.**
- **Phase 2 fixes (Yogesh feedback):** `#about#about` URL bug fixed (hash
  hrefs bypass Next Link); About rebuilt to live *inside* the graveyard —
  same sky/moon overhead, fog at the ground, bio carved on a monument
  slab, tools/passions as mini headstones planted in the floor strip;
  animation perf pass (fog → GPU-composited divs, all flame glows →
  gradient fills instead of blur filters). Still uncommitted.
- **About rework 2 (Yogesh: "same animation as landing / UI still feels
  like a site"):** interim `AboutScene` drift parallax + `AboutBackdrop`
  (grave rows, edge trees, continuing path, mummy, hand) + stone-styled
  monument and crooked headstone chips.
- **About rework 3 (Yogesh: "should feel like walking, first-person like
  human eyes"):** replaced the drift with `AboutWalk` — the section pins
  for a 400vh walk exactly like the hero: `AboutForeground` puts the path
  under your feet and huge half-cropped graves beside you (scaling 2.2×
  past), and the info arrives as four **stations** that rise out of the
  fog when you reach them (arrival → monument + keeper → tools stones →
  passions stones), each planted in the ground via the new `StoneBase`
  strip. `AboutScene` deleted. Still uncommitted — key lesson: sections
  must be composed first-person (path underfoot, near things cropped by
  the frame) or they read as "website", no matter how themed the widgets
  are.
- **About detail pass (Yogesh: "road looks like a light ray / white
  screen between sections"):** root cause of the light-ray road — the
  scene had no dark ground mass; pale shapes only read as dirt/stone when
  cut into `fill-surface` ground (that's why the landing works). Added
  the ground plane + textured road (ruts, cobbles), grave rows, fallen
  slab, fence fragment, shrub; backdrop reduced to horizon silhouettes.
  White-screen fix: fog wall darkened (10% bone mix, was 24%) and capped
  at 0.97 so silhouettes ghost through the section hand-off.

### Left to do (see [ROADMAP.md](./ROADMAP.md))

- **Phase 2:** real About / Experience / Lessons sections behind the gate
  with scroll storytelling. The "About the keeper" outline button and the
  journey cards currently point at the `#journey` teaser as placeholders.
- **Phase 3:** bottom-right music player with vibe categories (audio
  sourcing/licensing undecided)
- **Phase 4:** motion/a11y/perf/SEO polish pass (incl. Open Graph image)
- **Phase 5:** user-facing theme picker + choose-your-own-journey
- Visual QA in a real browser was **not** done this session (see below) —
  eyeball the parallax speeds, mummy, and mobile overflow before Phase 2.

### Problems faced & how they were solved

| Problem | Status | Resolution |
| --- | --- | --- |
| `pnpm add` timed out endlessly (ETIMEDOUT on registry.npmjs.org) | **Solved** | Root cause: `~/.npmrc` references `${GITHUB_TOKEN}`; when unset, pnpm discards the whole config file and loses the `registry.npmmirror.com` setting — the only registry reachable from this network. Workaround: prefix commands with `GITHUB_TOKEN=""`. |
| Sandboxed shell blocks all network | **Solved** (workaround) | Network commands (installs) must run un-sandboxed. |
| Hydration mismatch warning in dev console | **Solved** (explained) | Caused by the locator-js Chrome extension injecting `data-locator-target` — not site code. Ignore it. |
| Claude-in-Chrome extension not connected | **Worked around** | Verified via production build + fetching rendered HTML from the dev server instead of visual browser checks. Visual QA still owed. |
| Original vibe reference image no longer in cache | **Worked around** | Palette chosen without it; lantern-amber direction approved by Yogesh via question. |
| Port 3000 already taken | **Non-issue** | It's Yogesh's own dev server for this repo; it hot-reloads the changes. |
| URL became `/#about#about` after clicking CTAs | **Solved** | Hash-only hrefs went through Next `Link`, whose router re-appends the hash when one is already present (Lenis `anchors: true` handles the scroll separately). `Button` now renders plain `<a>` for same-page anchors — the router should never see hash-only links. |
| Scene animations getting heavy | **Solved** | CSS loops were animating over SVG `feGaussianBlur` (fog ellipses, every flame glow), re-rasterizing filters per frame. Fog is now blurred HTML divs (compositor-only transforms); glows are `radialGradient` fills (no filter at all). |
| "Gate shifted left" report | **Solved** (perception, not geometry) | Headless-Chrome screenshots (`chrome --headless --screenshot`, works without the extension) proved the gate was still dead center — but invisible (dark pillars, dimmed lanterns, buttons on top) while the mausoleum's bright doorway on the left read as "the gate". Added an iron arch + apex lantern over the real gate, moonlit pillar faces, dimmed the mausoleum ember. Lesson: check what the eye latches onto, not just coordinates — and headless Chrome is the fallback for visual QA. |

### Phase 2 completed (same day)

- Journey finished end-to-end with one shared `JourneyWalk` (consistent
  scene + mechanics across About / Trials & Experience / Lessons
  Unearthed), shared `StoneSlab`/`HeadstoneRow` stone pieces, epilogue
  with mailto + GitHub, footer on the graveyard floor, `JourneyPreview`
  removed. **Yogesh must edit the placeholder `TRIALS` array in
  `TrialsExperience.tsx` with real projects/work.**
- Verification gotcha: headless-Chrome screenshots of fragment-scrolled
  positions (`/#about` etc.) rasterize as blank even though `--dump-dom`
  proves the DOM/styles are correct — pinned-sticky content at scrolled
  offsets doesn't paint in headless captures. Verify deep sections via
  DOM dumps or live browser, not headless pixels.

## Session 2026-07-10 — real fork, real branch, real walk

### Goal

Yogesh's feedback on the finished journey: the crossroads was "not only two
line, it should [be] like actual road partition"; choosing should "show
different content"; and the About walk was "not getting actual walking in
graveyard feel, not optimize showing of the content and the content is less
in the site."

### Completed

- **Crossroads rebuilt as an actual road partition** — full-scene Y-fork
  SVG in the walked road's language (trodden earth, ruts, cobbles), drawn
  with no ground of its own so it's cut into the scene; signpost with two
  arrow boards + dying lantern; hover/choice washes the road amber and fogs
  the other. First version had a `fill-surface` ground box that read as a
  floating dark panel — removing it was the fix.
- **True branching** — only the chosen road renders below the fork
  (`GraveyardJourney`); new `OtherRoad` station at each road's end offers
  the road not taken. Scroll stability across the swap comes from
  `data-station-key` track divs + a captured fork-slice fraction restored
  with `lenis.scrollTo(..., { immediate: true })`; "walk the other road"
  smooth-scrolls back to the swapped branch's arrival. Verified over CDP:
  keys swap `trials-* ↔ lessons-*`, scroll lands exactly on target,
  no console errors.
- **Walking feel** — head-bob (±5px sine locked to the cobble cadence, on
  an overscanned wrapper), `PassingScenery` (6 roadside silhouettes
  sweeping past the frame edges with quadratic perspective easing), and the
  flowing cobbles rebuilt from per-frame SVG attribute animation into
  transform-only HTML divs (compositor-friendly). Invisible stations now
  get `visibility: hidden` (9–10 of 11 culled at any scroll position).
- **Content** — new Studies station in About (BCA — school/years are `TODO`
  placeholders), `link?` field on trials ("Visit the ruin ↗"), Field-notes
  boulder in Lessons (3 carved lessons), expanded monument copy, wider
  reading windows in the station envelope (`arrive 0.15` / `depart 0.10`).

### Problems faced & how they were solved

| Problem | Status | Notes |
|---|---|---|
| Fork looked like a floating panel | **Solved** | The fork SVG drew its own `fill-surface` ground rect — hard rectangle edges against the scene. Removed it; the roads are now cut straight into the scene's ground. |
| Branch swap changes track length mid-scroll | **Solved** | Track divs carry `data-station-key`; capture `(index, fraction)` in the fork's slice before the swap, restore `(index + fraction) × ((count−1)/count) × vh` after — instant via Lenis. |
| Headless screenshots of scrolled pinned states | **Solved (new method)** | Raw `--screenshot` of fragment URLs still rasterizes blank, but driving headless Chrome over CDP (scroll → settle → `Page.captureScreenshot`) paints fine. Script pattern in scratchpad `walkshot.mjs`; needs no new dependencies (Node ≥22 WebSocket). |

### Unsolved / action needed

- **Security:** the project `.npmrc` contains a hardcoded GitHub PAT in
  plain text. It is gitignored now, but the token should be **revoked**
  and replaced with the `${GITHUB_TOKEN}` env-var pattern.
- **Permanent npm fix:** either `export GITHUB_TOKEN=…` in `~/.zshrc` or
  remove the `${GITHUB_TOKEN}` line from `~/.npmrc`, so installs stop
  needing the `GITHUB_TOKEN=""` prefix.
- Browser-based visual QA (desktop + mobile widths, reduced-motion
  emulation) still pending.

### Know before starting the next session

1. Read [`PROMPTS.md`](../PROMPTS.md) (the brief),
   [ROADMAP.md](./ROADMAP.md) (phase plan),
   [ARCHITECTURE.md](./ARCHITECTURE.md) (conventions),
   [THEMING.md](./THEMING.md) (token rules).
2. **Confirm any new library with Yogesh before installing** — standing
   rule from the brief. `motion` and `lenis` are already approved.
3. Installs: `GITHUB_TOKEN="" pnpm add <pkg>` and run un-sandboxed, or
   they hang on a dead registry.
4. Styling only through theme tokens (never raw hexes in components);
   palette stays at 2–3 colors via opacity shades.
5. Motion rules: `motion` code lives in client leaf components only;
   every animated thing needs a `prefers-reduced-motion` fallback.
6. Yogesh usually has `pnpm dev` running on port 3000 — don't start a
   second server, just reload his.
7. Everything ships with a `docs/CHANGELOG.md` entry and updates to this
   file — "document everything" is part of the brief.
