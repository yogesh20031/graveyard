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
import { WatchingEyes } from "./WatchingEyes";

export type WalkStationConfig = {
  key: string;
  /** "ground" plants the content just above the grass; "center" floats it */
  align?: "center" | "ground";
  node: ReactNode;
};

type JourneyWalkProps = {
  stations: WalkStationConfig[];
};

// track length follows the number of stops — complete class literals so
// Tailwind sees them
const TRACK_HEIGHTS: Record<number, string> = {
  3: "h-[300vh]",
  4: "h-[400vh]",
  5: "h-[500vh]",
};

// Every stop of the journey walks the same way, with the same mechanics
// as the entry: the section pins to the viewport and scroll progress
// carries you down the path. The graveyard scales past you while each
// station — a grave with something written on it — rises out of the fog
// as you reach it and falls behind as you walk on. MotionValues can only
// be applied through the style prop; that's the motion API, not static
// styling.
export function JourneyWalk({ stations }: JourneyWalkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  const skyY = useTransform(progress, [0, 1], [0, -50]);
  // depth: the far rows creep closer, the graves beside you sweep past
  const backdropScale = useTransform(progress, [0, 1], [1, 1.4]);
  const backdropY = useTransform(progress, [0, 1], [0, 36]);
  const foregroundScale = useTransform(progress, [0, 1], [1, 2.2]);
  const foregroundY = useTransform(progress, [0, 1], [0, 60]);
  const fogY = useTransform(progress, [0, 1], [0, -30]);

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
    // one viewport of walking per station
    <div
      ref={containerRef}
      className={cn("relative", TRACK_HEIGHTS[stations.length] ?? "h-[400vh]")}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.div style={{ y: skyY }} className="absolute inset-0">
          <SkyLayer />
        </motion.div>
        <motion.div
          style={{ y: backdropY, scale: backdropScale }}
          className="absolute inset-0 origin-bottom"
        >
          <AboutBackdrop />
        </motion.div>
        <motion.div
          style={{ y: foregroundY, scale: foregroundScale }}
          className="absolute inset-0 origin-bottom"
        >
          <AboutForeground />
        </motion.div>
        <motion.div style={{ y: fogY }} className="absolute inset-0">
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
          >
            {station.node}
          </Station>
        ))}
      </div>
    </div>
  );
}

type StationProps = {
  progress: MotionValue<number>;
  index: number;
  count: number;
  align?: "center" | "ground";
  children: ReactNode;
};

// One stop on the walk, moving with the same depth as the scene layers:
// it appears tiny and dim near the horizon while you're still reading the
// previous grave, grows and descends as you walk up to it, drifts slowly
// while you stand reading (the walk slows, never stops), then sweeps down
// past your feet and off the bottom as you move on. The first station is
// already in front of you when you arrive; the last one stops there.
function Station({
  progress,
  index,
  count,
  align = "center",
  children,
}: StationProps) {
  const slice = 1 / count;
  const start = index / count;
  const end = (index + 1) / count;

  // the four phases of approaching a monument on foot; `appear` leads the
  // slice by almost half so the next grave is already visible down the path
  const appear = start - slice * 0.45;
  const arrive = start + slice * 0.15;
  const depart = end - slice * 0.15;
  const gone = end + slice * 0.2;

  const first = index === 0;
  const last = index === count - 1;

  const input = first
    ? [0, depart, gone]
    : last
      ? [appear, arrive, 1]
      : [appear, arrive, depart, gone];
  const opacity = useTransform(
    progress,
    input,
    // the linear ramp doubles as fog: distant monuments read half-faded
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0],
  );
  // grows the whole time — slow through the reading zone, past 1× as it
  // passes you, mirroring the foreground layer's own depth scaling
  const scale = useTransform(
    progress,
    input,
    first ? [0.97, 1.03, 1.45] : last ? [0.6, 0.97, 1.03] : [0.6, 0.97, 1.03, 1.45],
  );
  // descends from up near the horizon to below the frame's bottom edge
  const y = useTransform(
    progress,
    input,
    first ? [-8, 8, 240] : last ? [-150, -8, 8] : [-150, -8, 8, 240],
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
        style={{ scale, y }}
        className={cn(
          "w-full max-w-4xl",
          // planted monuments grow up from their base in the grass
          align === "ground" && "origin-bottom",
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
