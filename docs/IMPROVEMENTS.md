# Improvements — the journey, judged hard

A working audit of the graveyard portfolio, written against the original brief in
`PROMPTS.md`. That brief asks for one thing above all:

> *"we need to attract the user to sit in the journey"*

Everything below is ranked by how much it serves that sentence. Where the reasoning
matters, it is kept in — this is a document to argue with, not a checklist to tick.

Companion docs: [`JOURNEY-REFERENCE.md`](./JOURNEY-REFERENCE.md) (how the walk is
built), [`ROADMAP.md`](./ROADMAP.md) (phases), [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## 1. Problems

### P0 — broken or visibly wrong

| # | Problem | Where | Status |
|---|---|---|---|
| 1 | Titles fell from the sky, not up from the road | `JourneyWalk.tsx` `ENTER_ENVELOPES` | **fixed** |
| 2 | Two stations legible at once — text collided | `JourneyWalk.tsx` `Station` | **fixed** |
| 3 | The fork was a floating diagram; the road never split | `Crossroads.tsx` → `AboutForeground.tsx` | **fixed** |
| 4 | Hydration failed for reduced-motion users | `useHydratedReducedMotion.ts` | **fixed** |
| 5 | "The music haunts a later phase" — it ships | `GraveyardJourney`, `LessonsUnearthed` | **fixed** |
| 6 | **Placeholder content** — `TRIALS` is 2 TODO entries; `STUDY_SCHOOL = "Your college name · edit me"` | `TrialsExperience.tsx`, `AboutKeeper.tsx` | **open** |

**Items 1–5 are done.** What follows is why, because the reasoning generalises.

**1 — the road's horizon is *below* the middle of the screen.** The `road` envelope
started every traveller at `y: -150` (150px *above* the viewport centre) and dropped
it downward. But the road converges at scene-y 598 of an 810-tall viewBox — about 72%
down the frame, roughly **+21dvh below centre**. So each title spawned in the sky and
fell *through* the horizon. The comment directly above the code already described the
correct behaviour ("tiny at the horizon, grows up the path"); only the numbers
disagreed. Envelopes are now authored in `dvh` against `ROAD_HORIZON_DVH` in
`geometry.ts`, and road stations scale from `origin-bottom` so they grow *up out of*
the road instead of ballooning around their own centre.

**2 — the crossfade was arithmetically impossible.** Station N held `opacity: 1.0`
until `end − 0.10·slice`, while station N+1 reached `0.9` at `end(N) − 0.20·slice` —
*before* N had begun to fade. With 11 stations both were fully lit at progress ≈
0.436. The comment asserting *"the envelopes guarantee no two stations exceed 0.9 at
once"* was false, and the `pointerEvents` click-guard was built on it. Retimed so the
outgoing station is **gone before the incoming one becomes legible** (0.65 at `mid`,
not 0.9 — visible in flight, not competing to be read). The invariant is now true.

**3 — four coordinate spaces cannot be reconciled by tuning.** The fork lived in
`viewBox="0 0 1440 560"` with `meet` fit, inside a `max-w-6xl` flex box, scaled
0.35→1.35 by the station — while the scene behind it was `1440×810`, `slice`,
full-bleed, under its own parallax transform. It could never register. The Y is now
drawn in `AboutForeground`'s **own** coordinate space, sharing the stem with `Road()`,
and a grass wedge grows over the old road's far half to turn one road into two. It
registers by construction. A scroll-driven `forkOpen` MotionValue opens it on approach
and closes it once the walker is past.

> **The lesson worth keeping:** the arms were first drawn reaching for the far corners
> (x=330, x=1110) and read as *searchlight beams*, not roads. The ground plane here is
> only ~26% of the frame tall, so an arm that far out has almost no vertical rise left.
> **Short and steep looks deep; long and shallow looks flat.**

**4 — reduced-motion users got a hydration failure.** `useReducedMotion()` reads the
media query during render: `false` on the server, `true` on the client's first render.
Four components branch their whole tree on it, so React received a different tree than
it was sent, threw away the server HTML, and rebuilt the entire journey — plus an
uncaught error in the console. `useHydratedReducedMotion` (a `useSyncExternalStore`
wrapper) makes the server render and the first client render agree. **Both modes now
log zero console errors.**

**6 — the content is still `edit me`.** This is the one that matters most and is still
open. It is a **portfolio**: the content *is* the product. Right now a great deal of
scene craft is wrapped around two placeholder trials and a college called
`"Your college name · edit me"`. Everything else on this page is worth less than
fixing this.

### P1 — the experience

- **The journey is 20 viewports long with no way to know that.** 250vh of hero +
  11 × 160dvh of walk = **~2010dvh**. There is no progress indicator, no station map,
  no way to jump, and no sense of how much remains. The brief's goal is to make people
  *sit in the journey* — right now nothing tells them the journey has an end. **This is
  the highest-leverage retention fix available.**
- **No way to skip the walk.** Hurts screen-reader users and impatient recruiters
  alike. There is no non-scroll route to the content.
- **Mobile is a two-state design** — 28 `sm:`, 2 `md:`, 1 `lg:` across the codebase.
  Below `sm` the side-planted stations collapse to centre and the roadside concept
  disappears entirely; `slice` crops the 1440-wide scene hard; `max-h-[86dvh]` on the
  station wrapper has no overflow handling, so tall content can clip on short screens.
- **`public/` is completely empty.** No favicon, no OG image, no `metadataBase`. Every
  link you share previews blank.
- **`README.md` is still create-next-app boilerplate.** Recruiters read the README
  before they read the site.

### P2 — craft

- `src/components/ui/Card.tsx` is **dead code**, imported nowhere — though the brief
  explicitly asked for reusable cards. Use it or delete it.
- Heading order is loose (`Epilogue` uses `h3` with no `h2` in its station).
- Focus is never moved after a branch swap — `GraveyardJourney` scrolls but does not
  focus, so keyboard users lose their place.
- All 11 stations are always mounted, including two 150–240-line figure SVGs.
- No tests, no Prettier, no CI.
- Docs drift: `CHANGELOG`/`SESSION-LOG` have no entry for the music session;
  `ARCHITECTURE.md` does not list `music/`, `hooks/`, or the new icons; `ROADMAP.md`
  Phase 3 is unchecked though the player ships.

---

## 2. Animations worth adding

Ranked by felt impact per line of code. The scene already has a strong motion
vocabulary (scroll-linked transforms only, no layout thrash) — these extend it rather
than fight it.

| Animation | Why it earns its place | Where |
|---|---|---|
| **Footstep dust puffs** | The view bobs to a stride rhythm but nothing touches the ground. A small puff at each stride, keyed off the existing `bobY`, is what makes a walk feel *weighted*. | `JourneyWalk` — reuse the `bobY` MotionValue |
| **Letter-by-letter carve-in** | Titles currently only fade. Staggering them reads as *being carved* — on-theme, and it rewards the approach up the road. | a `<Carved>` wrapper beside `Reveal.tsx` |
| **Scroll-velocity coupling** | Walk faster → deeper bob, streakier ground. Lenis already exposes velocity; this makes the walk feel like *yours*. | `useLenis()` velocity → feed `bobY` amplitude |
| **Will-o'-wisps / fireflies** | Slow drifting amber motes near the road. Cheap, atmospheric, and reinforces the two-colour palette. | new layer beside `WatchingEyes` |
| **The skeleton reacts** | `SkeletonPresenter` and `KeeperFigure` are static SVGs standing in a scene that moves. Have them turn toward you as you arrive. | `SkeletonPresenter.tsx` |
| **Cloud drift across the moon** | The sky is the only layer that never changes. One slow cloud crossing the moon adds life for ~20 lines. | `SkyLayer.tsx` |
| **Grass sway at the road edges** | Ties the ground plane together; a slow CSS keyframe, no JS. | `globals.css` + `AboutForeground` |
| **The gate closes behind you** | The walk currently just *stops*. Closing the gate at the Epilogue gives it an ending. | `Epilogue` + `GraveyardFloor` |
| **A lantern-bearer walking ahead** | A figure receding down the chosen road. Sells the branch choice as consequential. | new, inside `ForkArms`' coordinate space |

**Rules to keep** (already true, easy to break): animate **transform and opacity only**
— SVG-attribute animation and `feGaussianBlur` were both removed once already for
repaint cost. Keep `will-change` scoped to the four scene layers. Every new keyframe
needs a matching entry in the `prefers-reduced-motion` block in `globals.css`.

---

## 3. Music — coupled to the journey

The player is a **live Web Audio synthesiser** (`useAmbience.ts`, 345 lines) — there
are **no audio files at all**. Wind is filtered noise under two out-of-sync LFOs,
drones are detuned oscillators, chimes are scheduled one-shot decays. Three vibes:
`midnight`, `haunting`, `storm`. That is worth keeping: zero bundle cost, zero
licensing, infinitely tweakable. What it lacks is any *connection to the walk*.

1. **Footsteps on the head-bob.** The single highest-impact addition on this page. The
   bob is already a MotionValue; schedule a short filtered-noise crunch per stride.
   A walk you can *hear* is a walk you believe.
2. **A bell tolls at the Crossroads.** One low strike as the junction becomes readable.
   Marks the decision as a decision.
3. **The branch changes the key.** Trials darker/minor; Lessons a lifted open fifth.
   `DroneRecipe` in `vibes.ts` already supports this — it just needs wiring to
   `RoadContext`.
4. **Scroll velocity → wind gust intensity.** `buildWind`'s LFOs are already there.
5. **The `storm` vibe drives the sky.** Moon dims, fog thickens, a lightning flash on
   each thunder rumble. This is the scene-coupling that makes the vibe picker feel like
   it changes the *world*, not just the volume.
6. **Duck the drone at the Epilogue.** Silence gives the ending weight.
7. **Pulse the lantern once** so people know the site has sound. **Never autoplay** —
   browsers block it, and `useAmbience` correctly waits for a user gesture.

---

## 4. What to do next, in order

1. **Real content.** Replace the `TRIALS` placeholders and `STUDY_SCHOOL` /
   `STUDY_YEARS`. Nothing else on this list matters as much. *(half a day)*
2. **A journey progress indicator.** A carved milestone marker showing depth into the
   walk. Directly serves the brief's one stated goal, and 20 viewports without one is
   the biggest reason someone leaves. *(half a day)*
3. **Footsteps + the Crossroads bell.** The largest felt gain per line of code on the
   whole list. *(a few hours)*
4. **README, favicon, OG image, metadata.** Cheap, and the first thing a recruiter
   actually sees. *(an hour)*
5. **Mobile pass**, then the **skip-the-walk route** for a11y.
6. Then the animation catalogue in §2, in the order listed.

Items 1 and 4 are the ones a visiting recruiter notices, they are cheap, and they are
both currently unaddressed. Do them before adding another animation.
