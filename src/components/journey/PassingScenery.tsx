"use client";

import { motion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";

// how many times the roadside scenery cycles past across one stage — much
// sparser than the cobbles underfoot; footsteps are constant, stones are
// occasional
const SCENERY_CYCLES = 3;

type SceneryKind = "stone" | "cross" | "tree" | "post";

type SceneryItem = {
  kind: SceneryKind;
  /** which side of the road it passes on */
  side: -1 | 1;
  /** cycle offset so items pass one at a time, not in a wave */
  phase: number;
};

const SCENERY: SceneryItem[] = [
  { kind: "stone", side: -1, phase: 0 / 6 },
  { kind: "tree", side: 1, phase: 1 / 6 },
  { kind: "cross", side: -1, phase: 2 / 6 },
  { kind: "post", side: 1, phase: 3 / 6 },
  { kind: "stone", side: 1, phase: 4 / 6 },
  { kind: "tree", side: -1, phase: 5 / 6 },
];

type PassingSceneryProps = {
  progress: MotionValue<number>;
};

// Roadside silhouettes that stream past as you walk: each spawns tiny near
// the road's vanishing point, then grows and sweeps out past the frame edge
// the way a stone you pass on foot does. Transform-only on HTML elements so
// the whole layer stays on the compositor — same recipe as the cobbles.
export function PassingScenery({ progress }: PassingSceneryProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {SCENERY.map((item, i) => (
        <PassingItem key={i} progress={progress} item={item} />
      ))}
    </div>
  );
}

function PassingItem({
  progress,
  item,
}: {
  progress: MotionValue<number>;
  item: SceneryItem;
}) {
  const t = useTransform(
    progress,
    (v) => (v * SCENERY_CYCLES + item.phase) % 1,
  );
  // quadratic ease: distant things crawl, near things sweep past — that
  // acceleration is what sells the perspective of walking by
  const x = useTransform(t, (v) => `${item.side * (1.5 + v * v * 54)}vw`);
  const y = useTransform(t, (v) => `${v * v * 26}dvh`);
  const scale = useTransform(t, (v) => 0.15 + v * v * 2.1);
  const opacity = useTransform(t, [0, 0.2, 0.85, 1], [0, 0.75, 0.75, 0]);

  return (
    <motion.div
      style={{ x, y, scale, opacity }}
      className="absolute bottom-[24%] left-1/2 -ml-8 w-16 origin-bottom will-change-transform"
    >
      <Silhouette kind={item.kind} />
    </motion.div>
  );
}

// Simple dark-scene shapes in the same palette as the planted grave rows.
function Silhouette({ kind }: { kind: SceneryKind }) {
  switch (kind) {
    case "stone":
      return (
        <svg aria-hidden="true" viewBox="0 0 64 64" className="h-auto w-full">
          <path
            d="M14 64 V28 a18 18 0 0 1 36 0 V64 Z"
            className="fill-foreground/10"
          />
          <rect
            x={24}
            y={34}
            width={16}
            height={4}
            rx={2}
            className="fill-background/40"
          />
        </svg>
      );
    case "cross":
      return (
        <svg aria-hidden="true" viewBox="0 0 64 64" className="h-auto w-full">
          <g className="fill-foreground/10">
            <rect x={28} y={8} width={8} height={56} />
            <rect x={12} y={22} width={40} height={8} />
          </g>
        </svg>
      );
    case "tree":
      return (
        <svg aria-hidden="true" viewBox="0 0 64 80" className="h-auto w-full">
          <g className="fill-foreground/12">
            <path d="M30 80 L28 34 L22 18 L26 17 L32 32 L38 12 L42 14 L35 34 L34 80 Z" />
            <rect
              x={20}
              y={30}
              width={4}
              height={16}
              rx={2}
              transform="rotate(38 22 32)"
            />
            <rect
              x={40}
              y={22}
              width={4}
              height={14}
              rx={2}
              transform="rotate(-34 42 24)"
            />
          </g>
        </svg>
      );
    case "post":
      return (
        <svg aria-hidden="true" viewBox="0 0 64 64" className="h-auto w-full">
          <g className="fill-foreground/8">
            <rect x={28} y={14} width={8} height={50} />
            <polygon points="24,14 40,14 32,2" />
            <rect x={16} y={28} width={32} height={6} />
          </g>
        </svg>
      );
  }
}
