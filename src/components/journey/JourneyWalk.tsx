"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { FogLayer } from "@/components/landing/scene/FogLayer";
import { SkyLayer } from "@/components/landing/scene/SkyLayer";
import { cn } from "@/lib/cn";
import { AboutBackdrop } from "./AboutBackdrop";
import { AboutForeground } from "./AboutForeground";
import { PassingScenery } from "./PassingScenery";
import { WatchingEyes } from "./WatchingEyes";

/** how a grave arrives as you reach it */
export type WalkEnter = "road" | "left" | "right" | "above";

export type WalkStationConfig = {
  key: string;
  /** "ground" plants the content just above the grass; "center" floats it */
  align?: "center" | "ground";
  /**
   * How the content enters as you reach it:
   * - "road"  — rises up the path from the horizon to centre, small → full
   * - "left"/"right" — stands planted at that side of the road, fading in and
   *   out in place as you walk past
   * - "above" — materialises with a short hover-down onto its spot, centred
   */
  enter?: WalkEnter;
  /** span the whole road — for full-scene stations like the crossroads */
  wide?: boolean;
  node: ReactNode;
};

type WalkStageProps = {
  stations: WalkStationConfig[];
};

// how many times the ground cobbles recycle toward you across one stage — the
// steady cadence that reads as walking
const GROUND_CYCLES = 7;

// One stage of the walk: a pinned first-person scene the graves stream past.
// The ground flows toward you as you scroll (see GroundFlow); roadside
// silhouettes sweep past the frame edges (PassingScenery); the whole view
// bobs gently to the footstep rhythm. MotionValues can only be applied
// through the style prop; that's the motion API, not static styling.
export function WalkStage({ stations }: WalkStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Lenis already smooths the wheel; keep this spring light and near-critically
  // damped so the mapping tracks the scroll tightly instead of floating behind it
  const progress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 38,
    mass: 0.35,
  });

  // Strong, continuous forward parallax — the ground clearly rushes toward you
  // (a walk, not a slideshow). Sky is slowest, the ground at your feet fastest.
  const skyY = useTransform(progress, [0, 1], [0, -70]);
  const backdropScale = useTransform(progress, [0, 1], [1, 1.25]);
  const backdropY = useTransform(progress, [0, 1], [0, 80]);
  const foregroundScale = useTransform(progress, [0, 1], [1, 1.5]);
  const foregroundY = useTransform(progress, [0, 1], [0, 170]);
  const fogY = useTransform(progress, [0, 1], [0, -50]);
  // footstep rhythm on the whole view — two bobs per cobble cycle, one per
  // stride. The wrapper overscans the frame so the bob never exposes an edge.
  const bobY = useTransform(
    progress,
    (v) => Math.sin(v * GROUND_CYCLES * 2 * Math.PI * 2) * 5,
  );

  if (prefersReducedMotion) {
    return (
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-dvh">
          <SkyLayer />
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-dvh">
          <AboutBackdrop />
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-dvh">
          <AboutForeground />
        </div>
        <FogLayer />
        <WatchingEyes />
        <div className="relative z-10 flex flex-col gap-24 py-24">
          {stations.map((station) => (
            <div
              key={station.key}
              data-station-key={station.key}
              className="mx-auto w-full max-w-4xl px-6"
            >
              {station.node}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.div
          style={{ y: bobY }}
          className="absolute inset-x-0 -inset-y-2 will-change-transform"
        >
          <motion.div
            style={{ y: skyY }}
            className="absolute inset-0 transform-gpu will-change-transform"
          >
            <SkyLayer />
          </motion.div>
          <motion.div
            style={{ y: backdropY, scale: backdropScale }}
            className="absolute inset-0 origin-bottom transform-gpu will-change-transform"
          >
            <AboutBackdrop />
          </motion.div>
          <motion.div
            style={{ y: foregroundY, scale: foregroundScale }}
            className="absolute inset-0 origin-bottom transform-gpu will-change-transform"
          >
            <AboutForeground />
            <PassingScenery progress={progress} />
            <GroundFlow progress={progress} />
          </motion.div>
          <motion.div
            style={{ y: fogY }}
            className="absolute inset-0 transform-gpu will-change-transform"
          >
            <FogLayer />
          </motion.div>
          <WatchingEyes />
          <div
            aria-hidden="true"
            className="fog-fade pointer-events-none absolute inset-x-0 top-0 h-32"
          />

          {stations.map((station, index) => (
            <Station
              key={station.key}
              progress={progress}
              index={index}
              count={stations.length}
              align={station.align}
              enter={station.enter}
              wide={station.wide}
            >
              {station.node}
            </Station>
          ))}
        </motion.div>
      </div>

      {/* Drives the scroll length — 1.6 viewports of walking per grave, an
          unhurried pace (one viewport read as a sprint). Pulled up a viewport
          so it overlaps the pinned scene's flow slot; the track ends up
          exactly stations.length × 160dvh tall (no inline style, robust to
          how many graves there are). Keys let the journey scroll-anchor a
          station when the branch below the fork changes. */}
      <div aria-hidden="true" className="pointer-events-none -mt-[100dvh]">
        {stations.map((station) => (
          <div
            key={station.key}
            data-station-key={station.key}
            className="h-[160dvh]"
          />
        ))}
      </div>
    </div>
  );
}

// Cobbles streaming out from under your feet toward the horizon in reverse —
// i.e. rising at you from the dark and passing below the frame — on a loop, so
// the ground reads as continuously walked-over rather than one slow zoom.
// HTML divs animated by transform only: the old SVG-attribute version forced
// the scene to repaint every frame.
function GroundFlow({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {GROUND_COBBLES.map((cobble, i) => (
        <Cobble
          key={i}
          progress={progress}
          lane={cobble.lane}
          phase={cobble.phase}
        />
      ))}
    </div>
  );
}

// each cobble follows the road from far/small/high to near/big/low, then wraps
const GROUND_COBBLES = [
  { lane: -18, phase: 0 / 8 },
  { lane: 20, phase: 1 / 8 },
  { lane: -10, phase: 2 / 8 },
  { lane: 14, phase: 3 / 8 },
  { lane: -22, phase: 4 / 8 },
  { lane: 8, phase: 5 / 8 },
  { lane: -6, phase: 6 / 8 },
  { lane: 24, phase: 7 / 8 },
] as const;

function Cobble({
  progress,
  lane,
  phase,
}: {
  progress: MotionValue<number>;
  lane: number;
  phase: number;
}) {
  // 0 → 1 marches a cobble from the horizon down past your feet, then wraps
  const t = useTransform(progress, (v) => (v * GROUND_CYCLES + phase) % 1);
  // the road converges at the horizon and opens toward the walker, so the
  // lane spread widens as the cobble nears (lane is in scene px, ≈ vw/14.4)
  const x = useTransform(t, (v) => `${(lane * (0.3 + v * 4)) / 14.4}vw`);
  const y = useTransform(t, (v) => `${v * 30}dvh`);
  const scale = useTransform(t, [0, 1], [0.15, 1]);
  const opacity = useTransform(t, [0, 0.12, 0.82, 1], [0, 0.5, 0.42, 0]);

  return (
    <motion.div
      style={{ x, y, scale, opacity }}
      className="absolute bottom-[26%] left-1/2 -ml-5.5 h-4.5 w-11 rounded-full bg-surface/70 will-change-transform"
    />
  );
}

// Per-direction motion for a mid-walk grave, on the shared 5-point
// [appear, mid, arrive, depart, gone] track. Two families:
//
// Travelers (narrative content on the path — titles, the fork, the epilogue)
// move to centre and pass:
//   road — tiny at the horizon, visibly grows up the path (scale is the star)
//
// Planted (the graveyard stones) appear IN PLACE, stay, and slowly fade there —
// real headstones don't move, the walker does. Their roadside position comes
// from the station's flex layout, not from transforms; x here is only a small
// walk-past drift:
//   above — a short hover-down onto its spot, then fades where it stands
//   left/right — stands at that side of the road, gentle walk-past parallax,
//          fading in and out standing there
//
// first/last graves don't use this — they have their own already-in-front /
// stops-in-front envelopes.
const ENTER_ENVELOPES: Record<
  WalkEnter,
  { x: number[]; y: number[]; scale: number[] }
> = {
  road: {
    x: [0, 0, 0, 0, 0],
    y: [-150, -70, -8, 8, 240],
    scale: [0.35, 0.7, 1, 1, 1.35],
  },
  above: {
    x: [0, 0, 0, 0, 0],
    y: [-130, -60, -4, 4, 26],
    scale: [0.95, 0.98, 1, 1, 1.02],
  },
  left: {
    x: [-22, -8, 0, 0, -14],
    y: [26, 10, -2, 4, 18],
    scale: [0.86, 0.95, 1, 1.02, 1.05],
  },
  right: {
    x: [22, 8, 0, 0, 14],
    y: [26, 10, -2, 4, 18],
    scale: [0.86, 0.95, 1, 1.02, 1.05],
  },
};

type StationProps = {
  progress: MotionValue<number>;
  index: number;
  count: number;
  align?: "center" | "ground";
  enter?: WalkEnter;
  wide?: boolean;
  children: ReactNode;
};

// One grave on the walk (see ENTER_ENVELOPES for the two motion families):
// "road" travelers move to centre and pass; planted stones
// ("left"/"right"/"above") appear in their place in the graveyard — side stones
// stand at the roadside via layout — hold with only walk-past parallax, and
// slowly fade out where they stand. Never enlarges past ~1× in the reading zone
// (bigger would clip inside the pinned viewport). The first grave is already in
// front of you; the last one stops there.
function Station({
  progress,
  index,
  count,
  align = "center",
  enter = "road",
  wide = false,
  children,
}: StationProps) {
  const slice = 1 / count;
  const start = index / count;
  const end = (index + 1) / count;

  // the phases of approaching a monument on foot; `appear` leads the slice by
  // more than half so the grave emerges well before it's readable, `mid` is the
  // halfway point of the approach — near-fully visible there, so the travel
  // itself is actually seen — `arrive` comes early and `depart` late so each
  // stone holds fully readable for most of its slice, and `gone` lingers so
  // stones slowly fade out
  const appear = start - slice * 0.55;
  const arrive = start + slice * 0.15;
  const mid = appear + (arrive - appear) * 0.5;
  const depart = end - slice * 0.1;
  const gone = end + slice * 0.3;

  const first = index === 0;
  const last = index === count - 1;
  // the direction only applies to mid-walk graves; the first is already in
  // front at scroll 0 and the last stops in front, so both stay centred
  const placement = first || last ? "road" : enter;
  const env = ENTER_ENVELOPES[placement];

  const input = first
    ? [0, depart, gone]
    : last
      ? [appear, mid, arrive, 1]
      : [appear, mid, arrive, depart, gone];
  const opacity = useTransform(
    progress,
    input,
    // near-full opacity by mid-approach: the fall/rise/materialise plays out
    // visible, instead of everything fading in only at its final pose
    first ? [1, 1, 0] : last ? [0, 0.9, 1, 1] : [0, 0.9, 1, 1, 0],
  );
  const x = useTransform(
    progress,
    input,
    first ? [0, 0, 0] : last ? [0, 0, 0, 0] : env.x,
  );
  const scale = useTransform(
    progress,
    input,
    first ? [0.95, 1, 1.35] : last ? [0.5, 0.8, 0.95, 1] : env.scale,
  );
  const y = useTransform(
    progress,
    input,
    first ? [-8, 8, 240] : last ? [-150, -60, -8, 8] : env.y,
  );
  // only the station in its reading zone takes clicks — invisible stations
  // overlap it and must not swallow links/buttons. The envelopes guarantee
  // no two stations exceed 0.9 at once.
  const pointerEvents = useTransform(opacity, (v) =>
    v > 0.9 ? "auto" : "none",
  );
  // fully faded-out stations stop being painted and composited entirely
  const visibility = useTransform(opacity, (v) =>
    v < 0.001 ? "hidden" : "visible",
  );

  return (
    <motion.div
      style={{ opacity, pointerEvents, visibility }}
      className={cn(
        "absolute inset-0 z-10 flex px-6",
        // planted stones sit on the grass line, not the screen edge — the
        // scene's ground band starts roughly 14dvh up from the bottom
        align === "ground" ? "items-end pb-[14dvh]" : "items-center",
        // planted side stones stand at the roadside, not across the road;
        // mobile has no roadside, so everything centres below sm
        placement === "left" && "justify-center sm:justify-start sm:pl-[7vw]",
        placement === "right" && "justify-center sm:justify-end sm:pr-[7vw]",
        (placement === "road" || placement === "above") && "justify-center",
      )}
    >
      <motion.div
        style={{ x, scale, y }}
        className={cn(
          "max-h-[86dvh] w-full",
          placement === "left" || placement === "right"
            ? "max-w-md sm:max-w-xl"
            : wide
              ? "max-w-6xl"
              : "max-w-3xl",
          // planted monuments grow up from their base in the grass
          align === "ground" && "origin-bottom",
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
