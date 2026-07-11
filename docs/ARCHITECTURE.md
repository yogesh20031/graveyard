# Architecture

## Folder structure

```
src/
  app/                  # Next.js App Router — routes, layout, global CSS
    layout.tsx          # fonts, metadata, data-theme, SmoothScrollProvider
    page.tsx            # landing route — composes landing components
    globals.css         # theme tokens + scene animation helpers
  components/
    ui/                 # reusable primitives, no feature knowledge
      Button.tsx        # variants: solid | outline | ghost, sizes: md | lg
      Card.tsx          # translucent bordered panel
      Reveal.tsx        # (client) fade-and-rise whileInView wrapper
    icons/              # small inline-SVG icons, currentColor-based
      SkullIcon.tsx
    providers/          # (client) app-level wrappers
      SmoothScrollProvider.tsx  # Lenis smooth scrolling
    landing/            # components specific to the landing experience
      Hero.tsx
      ParallaxScene.tsx # (client) pinned walk-through-the-gate scroll track
      scene/            # server-rendered SVG depth layers
        geometry.ts     # shared viewBox + coordinates
        SkyLayer.tsx
        HillsLayer.tsx
        ForegroundLayer.tsx
        FogLayer.tsx
    journey/            # everything inside the gates (Phase 2)
      GraveyardJourney.tsx # (client) assembles the walk; owns the branch choice
      JourneyWalk.tsx   # (client) the pinned walk: layers, bob, stations
      PassingScenery.tsx # (client) roadside silhouettes sweeping past
      Crossroads.tsx    # (client) the Y-fork road partition + signpost
      OtherRoad.tsx     # (client) end-of-road offer of the road not taken
      AboutKeeper.tsx   # first stop — the keeper's story (edit STUDY_* consts)
      TrialsExperience.tsx # left road — projects/work (edit TRIALS array)
      LessonsUnearthed.tsx # right road — skills, field notes + epilogue
      AboutBackdrop.tsx # horizon silhouettes behind the whole walk
      AboutForeground.tsx # feet-level ground, road, graves beside you
      StoneSlab.tsx     # leaning monument with an inscription (shared)
      BoulderSlab.tsx   # irregular carved boulder (shared)
      SkeletonPresenter.tsx # upright skeleton gesturing at content
      HeadstoneRow.tsx  # crooked one-word headstone row (shared)
      StoneBase.tsx     # dirt/grass strip that plants stones in the ground
      KeeperFigure.tsx  # skeleton-keeper SVG vignette
      GraveyardFloor.tsx# grass + bones strip (page footer ground)
      WatchingEyes.tsx  # blinking amber eyes in the dark
  lib/
    cn.ts               # class-name join helper
  themes/
    themes.ts           # theme registry (see THEMING.md)
docs/                   # you are here
```

## Conventions

- **Named exports everywhere.** Default exports only where Next.js requires
  them (`page.tsx`, `layout.tsx`).
- **One component per file**, named after the component. Small helpers and
  subcomponents used only by that file live *below* the main export
  (e.g. `Fence`, `Fog` inside `GraveyardScene.tsx`).
- **File order:** imports → local types → module constants → component →
  subcomponents/helpers.
- **`ui/` vs feature folders:** anything in `components/ui/` must be
  reusable and know nothing about the graveyard. Feature-specific pieces go
  in a feature folder (`landing/`, `journey/`, later `music/`). The scene
  layers in `landing/scene/` (sky, fog, geometry) double as the shared
  scenery vocabulary — journey sections import them to stay in the same
  world.
- **Styling:** Tailwind classes only, referencing semantic theme tokens
  (`bg-background`, `text-accent`, `fill-surface`) — never raw hex values in
  components. Conditional classes via the `cn()` helper in `src/lib/cn.ts`.
- **TypeScript:** no `any`, no `as` casts to silence errors; discriminated
  unions for props with distinct shapes (see `Button.tsx` — link vs native
  button).
- **Motion:** two kinds, both reduced-motion safe.
  - Ambient loops (twinkle, fog drift, lantern pulse) are CSS keyframes in
    `globals.css`, disabled by the `prefers-reduced-motion` media query.
  - Scroll-linked/entrance motion uses the `motion` library, kept in
    **client leaf components only** (`ParallaxScene`, `Reveal`,
    `SmoothScrollProvider`) so pages and sections stay server components.
    Every motion component checks `useReducedMotion()` and renders a
    static fallback.
- **Client boundaries:** `"use client"` only where interactivity or
  browser APIs demand it, and as deep in the tree as possible. Server
  content passes through client wrappers as `children`.
- **Future compatibility:** sections are self-contained components so the
  Phase 5 "choose your own journey" feature can reorder them, and all colors
  flow through the theme system so user-selectable themes need no component
  changes.
