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
import { SCENE_ASPECT, SCENE_VIEW_BOX } from "@/components/landing/scene/geometry";
import { cn } from "@/lib/cn";
import { AboutBackdrop } from "./AboutBackdrop";
import { AboutForeground } from "./AboutForeground";
import { WatchingEyes } from "./WatchingEyes";

/** how a grave arrives as you reach it */
export type WalkEnter = "road" | "left" | "right" | "above" | "sky";

export type WalkStationConfig = {
  key: string;
  /** "ground" plants the content just above the grass; "center" floats it */
  align?: "center" | "ground";
  /**
   * How the content enters as you reach it:
   * - "road"  — rises up the path from the horizon, small → full
   * - "left"/"right" — swings in from that side of the path
   * - "above" — drops a short way in from just above the graveyard
   * - "sky"   — falls from high in the night sky
   */
  enter?: WalkEnter;
  node: ReactNode;
};

type WalkStageProps = {
  stations: WalkStationConfig[];
};

// how many times the ground cobbles recycle toward you across one stage — the
// steady cadence that reads as walking
const GROUND_CYCLES = 7;

// One stage of the walk: a pinned first-person scene the graves stream past.
// The ground flows toward you as you scroll (see GroundFlow); each grave rises
// small out of the fog down the path, grows as you reach it, drifts while you
// read, and sweeps below you as you move on. MotionValues can only be applied
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
            <div key={station.key} className="mx-auto w-full max-w-4xl px-6">
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
          >
            {station.node}
          </Station>
        ))}
      </div>

      {/* Drives the scroll length — one viewport of walking per grave. Pulled
          up a viewport so it overlaps the pinned scene's flow slot; the track
          ends up exactly stations.length × 100dvh tall (no inline style, robust
          to how many graves there are). */}
      <div aria-hidden="true" className="pointer-events-none -mt-[100dvh]">
        {stations.map((station) => (
          <div key={station.key} className="h-dvh" />
        ))}
      </div>
    </div>
  );
}

// Cobbles streaming out from under your feet toward the horizon in reverse —
// i.e. rising at you from the dark and passing below the frame — on a loop, so
// the ground reads as continuously walked-over rather than one slow zoom.
function GroundFlow({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={SCENE_VIEW_BOX}
      preserveAspectRatio={SCENE_ASPECT}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {GROUND_COBBLES.map((cobble, i) => (
        <Cobble key={i} progress={progress} lane={cobble.lane} phase={cobble.phase} />
      ))}
    </svg>
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
  const t = useTransform(progress, (v) => ((v * GROUND_CYCLES + phase) % 1));
  // the road converges near x=720,y=600 and opens toward the bottom, so lane
  // spread widens as the cobble nears
  const cx = useTransform(t, (v) => 720 + lane * (0.3 + v * 4));
  const cy = useTransform(t, [0, 1], [600, 818]);
  const rx = useTransform(t, [0, 1], [3, 22]);
  const ry = useTransform(t, [0, 1], [1.4, 9]);
  const opacity = useTransform(t, [0, 0.12, 0.82, 1], [0, 0.5, 0.42, 0]);

  return (
    <motion.ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      style={{ opacity }}
      className="fill-surface/70"
    />
  );
}

// Per-direction motion for a mid-walk grave, on the shared 5-point
// [appear, mid, arrive, depart, gone] track. Two families:
//
// Travelers (narrative content on the path — titles, the fork, the epilogue)
// move to centre and pass:
//   road — tiny at the horizon, visibly grows up the path (scale is the star)
//   sky  — falls from fully off-screen above at full size, a slight tilt
//          righting itself as it lands (y-travel is the star)
//
// Planted (the graveyard stones) appear IN PLACE, stay, and slowly fade there —
// real headstones don't move, the walker does:
//   above — a short hover-down onto its spot, then fades where it stands
//   left/right — stands beside the path on that side (constant x offset),
//          only gentle walk-past parallax, fading in and out standing there
//
// first/last graves don't use this — they have their own already-in-front /
// stops-in-front envelopes.
const ENTER_ENVELOPES: Record<
  WalkEnter,
  { x: number[]; y: number[]; scale: number[]; rotate: number[] }
> = {
  road: {
    x: [0, 0, 0, 0, 0],
    y: [-150, -70, -8, 8, 240],
    scale: [0.35, 0.7, 1, 1, 1.35],
    rotate: [0, 0, 0, 0, 0],
  },
  sky: {
    x: [0, 0, 0, 0, 0],
    y: [-720, -330, -12, 10, 60],
    scale: [1, 1, 1, 1, 1.04],
    rotate: [-5, -2, 0, 0, 3],
  },
  above: {
    x: [0, 0, 0, 0, 0],
    y: [-130, -60, -4, 4, 26],
    scale: [0.95, 0.98, 1, 1, 1.02],
    rotate: [0, 0, 0, 0, 0],
  },
  left: {
    x: [-64, -64, -64, -64, -64],
    y: [26, 10, -2, 4, 18],
    scale: [0.86, 0.95, 1, 1.02, 1.05],
    rotate: [0, 0, 0, 0, 0],
  },
  right: {
    x: [64, 64, 64, 64, 64],
    y: [26, 10, -2, 4, 18],
    scale: [0.86, 0.95, 1, 1.02, 1.05],
    rotate: [0, 0, 0, 0, 0],
  },
};

type StationProps = {
  progress: MotionValue<number>;
  index: number;
  count: number;
  align?: "center" | "ground";
  enter?: WalkEnter;
  children: ReactNode;
};

// One grave on the walk (see ENTER_ENVELOPES for the two motion families):
// travelers ("road"/"sky") move to centre and pass; planted stones
// ("left"/"right"/"above") appear in their place in the graveyard, hold with
// only walk-past parallax, and slowly fade out where they stand. Never enlarges
// past ~1× in the reading zone (bigger would clip inside the pinned viewport).
// The first grave is already in front of you; the last one stops there.
function Station({
  progress,
  index,
  count,
  align = "center",
  enter = "road",
  children,
}: StationProps) {
  const slice = 1 / count;
  const start = index / count;
  const end = (index + 1) / count;

  // the phases of approaching a monument on foot; `appear` leads the slice by
  // more than half so the grave emerges well before it's readable, `mid` is the
  // halfway point of the approach — near-fully visible there, so the travel
  // itself is actually seen — and `gone` lingers so stones slowly fade out
  const appear = start - slice * 0.55;
  const arrive = start + slice * 0.22;
  const mid = appear + (arrive - appear) * 0.5;
  const depart = end - slice * 0.15;
  const gone = end + slice * 0.3;

  const first = index === 0;
  const last = index === count - 1;
  // the direction only applies to mid-walk graves; the first is already in
  // front at scroll 0 and the last stops in front, so both get their own path
  const env = ENTER_ENVELOPES[enter];

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
  const rotate = useTransform(
    progress,
    input,
    first ? [0, 0, 0] : last ? [0, 0, 0, 0] : env.rotate,
  );
  // only the station in its reading zone takes clicks — invisible stations
  // overlap it and must not swallow links/buttons. The envelopes guarantee
  // no two stations exceed 0.9 at once.
  const pointerEvents = useTransform(opacity, (v) =>
    v > 0.9 ? "auto" : "none",
  );

  return (
    <motion.div
      style={{ opacity, pointerEvents }}
      className={cn(
        "absolute inset-0 z-10 flex justify-center px-6",
        align === "ground" ? "items-end pb-6" : "items-center",
      )}
    >
      <motion.div
        style={{ x, scale, y, rotate }}
        className={cn(
          "max-h-[86dvh] w-full max-w-4xl transform-gpu will-change-transform",
          // planted monuments grow up from their base in the grass
          align === "ground" && "origin-bottom",
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
