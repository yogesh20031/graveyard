import {
  SCENE_ASPECT,
  SCENE_VIEW_BOX,
  tombstonePath,
} from "@/components/landing/scene/geometry";
import type { DistantStone } from "@/components/landing/scene/geometry";

// Mid-distance layer: the graveyard on the horizon — dark silhouettes
// standing against the sky above the foreground's ground line. Everything
// below the horizon belongs to AboutForeground.

const HORIZON_ROW: DistantStone[] = [
  { x: 150, width: 30, height: 42, baseY: 590, fillClass: "fill-surface/90" },
  { x: 268, width: 22, height: 34, baseY: 586, fillClass: "fill-surface/80", cross: true },
  { x: 420, width: 34, height: 46, baseY: 592, fillClass: "fill-surface/90" },
  { x: 566, width: 24, height: 32, baseY: 588, fillClass: "fill-surface/80" },
  { x: 880, width: 30, height: 44, baseY: 590, fillClass: "fill-surface/90", cross: true },
  { x: 1010, width: 36, height: 48, baseY: 592, fillClass: "fill-surface/90" },
  { x: 1240, width: 26, height: 36, baseY: 588, fillClass: "fill-surface/80" },
];

const FAR_ROW: DistantStone[] = [
  { x: 340, width: 18, height: 24, baseY: 574, fillClass: "fill-surface/70" },
  { x: 640, width: 20, height: 26, baseY: 572, fillClass: "fill-surface/70", cross: true },
  { x: 770, width: 16, height: 22, baseY: 574, fillClass: "fill-surface/70" },
  { x: 1120, width: 18, height: 24, baseY: 572, fillClass: "fill-surface/70" },
];

export function AboutBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox={SCENE_VIEW_BOX}
      preserveAspectRatio={SCENE_ASPECT}
      className="h-full w-full"
    >
      <StoneRow stones={FAR_ROW} />
      <StoneRow stones={HORIZON_ROW} />
      <EdgeTree />
      <EdgeTree mirrored />
      <Mummy />
    </svg>
  );
}

function StoneRow({ stones }: { stones: DistantStone[] }) {
  return (
    <g>
      {stones.map((stone) =>
        stone.cross ? (
          <g key={stone.x} className={stone.fillClass}>
            <rect
              x={stone.x + stone.width / 2 - 3}
              y={stone.baseY - stone.height}
              width={6}
              height={stone.height}
            />
            <rect
              x={stone.x}
              y={stone.baseY - stone.height * 0.68}
              width={stone.width}
              height={6}
            />
          </g>
        ) : (
          <path
            key={stone.x}
            d={tombstonePath(stone, stone.baseY)}
            className={stone.fillClass}
          />
        ),
      )}
    </g>
  );
}

// Bare tree leaning in from the section edge; mirrored copy on the right.
function EdgeTree({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <g
      className="fill-surface/90"
      transform={mirrored ? "translate(1440 0) scale(-1 1)" : undefined}
    >
      <path d="M20 810 C 32 720 22 660 42 570 L 56 572 C 40 662 52 722 48 810 Z" />
      <path d="M40 620 C 74 596 108 588 146 572 L 142 564 C 104 580 68 590 34 606 Z" />
      <path d="M46 560 C 66 542 88 536 106 522 L 101 516 C 84 530 62 536 40 550 Z" />
      <path d="M146 572 C 160 566 168 554 182 548 L 179 542 C 166 548 156 560 142 564 Z" />
    </g>
  );
}

// Standing among the horizon stones, watching you walk.
function Mummy() {
  return (
    <g>
      <rect
        x={1150}
        y={532}
        width={28}
        height={58}
        rx={14}
        className="fill-surface/90"
      />
      <g className="fill-background/60">
        <rect x={1151} y={550} width={26} height={3} />
        <rect x={1151} y={562} width={26} height={3} />
        <rect x={1151} y={574} width={26} height={3} />
      </g>
      <g className="lantern-glow">
        <circle cx={1158} cy={543} r={2.2} className="fill-accent-bright" />
        <circle cx={1169} cy={543} r={2.2} className="fill-accent-bright" />
      </g>
    </g>
  );
}
