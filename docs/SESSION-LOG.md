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
