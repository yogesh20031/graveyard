import {
  SCENE_ASPECT,
  SCENE_VIEW_BOX,
  tombstonePath,
} from "@/components/landing/scene/geometry";
import type { Tombstone } from "@/components/landing/scene/geometry";

// The feet-level, first-person layer: a dark ground mass with the dirt
// road running out from under you, grave rows flanking it, and the stones
// right beside you cropped by the frame. Same recipe as the landing —
// light path and pale stones only read as such when cut into dark ground.

const HORIZON = 596;

type PlantedStone = Tombstone & { baseY: number; tilt?: number };

// mid row, smaller with distance
const MID_ROW: PlantedStone[] = [
  { x: 180, width: 30, height: 40, baseY: 642, fillClass: "fill-foreground/8" },
  { x: 320, width: 26, height: 34, baseY: 638, fillClass: "fill-foreground/8", tilt: -7 },
  { x: 520, width: 34, height: 46, baseY: 644, fillClass: "fill-foreground/8" },
  { x: 900, width: 28, height: 38, baseY: 640, fillClass: "fill-foreground/8", tilt: 6 },
  { x: 1030, width: 34, height: 44, baseY: 644, fillClass: "fill-foreground/8" },
  { x: 1190, width: 26, height: 34, baseY: 640, fillClass: "fill-foreground/8" },
];

// near row, tall enough to feel a few steps away
const NEAR_ROW: PlantedStone[] = [
  { x: 90, width: 56, height: 82, baseY: 724, fillClass: "fill-foreground/12" },
  { x: 480, width: 52, height: 72, baseY: 722, fillClass: "fill-foreground/10", tilt: -5 },
  { x: 950, width: 58, height: 84, baseY: 724, fillClass: "fill-foreground/12" },
  { x: 1150, width: 48, height: 66, baseY: 720, fillClass: "fill-foreground/10", tilt: 4 },
];

export function AboutForeground() {
  return (
    <svg
      aria-hidden="true"
      viewBox={SCENE_VIEW_BOX}
      preserveAspectRatio={SCENE_ASPECT}
      className="h-full w-full"
    >
      {/* the ground you stand on — the darkness everything else sits in */}
      <path
        d={`M0 ${HORIZON} Q 240 586 480 594 T 960 590 T 1440 596 V810 H0 Z`}
        className="fill-surface"
      />

      <Road />
      <GraveRows />
      <FlankingGraves />
      <FenceFragment />
      <DeadShrub />
      <SkeletalHand />
      <BonesAndGrass />
    </svg>
  );
}

// Worn dirt road: pale trodden earth with wheel ruts and half-sunk
// cobbles, converging into the dark.
function Road() {
  return (
    <g>
      <path
        d="M400 810 C 500 740 610 660 702 598 L 740 598 C 830 660 940 740 1040 810 Z"
        className="fill-foreground/8"
      />
      {/* wheel ruts */}
      <path
        d="M520 810 C 590 730 650 660 706 604 L 713 604 C 660 664 606 734 546 810 Z"
        className="fill-surface/70"
      />
      <path
        d="M894 810 C 834 734 780 664 728 604 L 735 604 C 790 662 848 730 922 810 Z"
        className="fill-surface/70"
      />
      {/* cobbles, shrinking with distance */}
      <g className="fill-surface/50">
        <ellipse cx={660} cy={782} rx={14} ry={6} />
        <ellipse cx={780} cy={766} rx={12} ry={5} />
        <ellipse cx={706} cy={722} rx={10} ry={4.5} />
        <ellipse cx={764} cy={690} rx={8} ry={3.5} />
        <ellipse cx={700} cy={664} rx={7} ry={3} />
        <ellipse cx={734} cy={636} rx={5} ry={2.5} />
        <ellipse cx={716} cy={614} rx={4} ry={2} />
      </g>
    </g>
  );
}

function GraveRows() {
  return (
    <g>
      {[...MID_ROW, ...NEAR_ROW].map((stone) => (
        <path
          key={`${stone.x}-${stone.baseY}`}
          d={tombstonePath(stone, stone.baseY)}
          transform={
            stone.tilt
              ? `rotate(${stone.tilt} ${stone.x + stone.width / 2} ${stone.baseY})`
              : undefined
          }
          className={stone.fillClass}
        />
      ))}

      {/* a cross among them */}
      <g className="fill-foreground/10">
        <rect x={296} y={656} width={8} height={66} />
        <rect x={278} y={672} width={44} height={8} />
      </g>

      {/* a slab that fell face-down long ago */}
      <g transform="rotate(-9 610 716)">
        <rect x={572} y={708} width={76} height={12} rx={4} className="fill-foreground/10" />
      </g>
      <rect x={636} y={690} width={14} height={30} className="fill-foreground/8" />
    </g>
  );
}

// The stones right at your shoulders, half out of frame.
function FlankingGraves() {
  return (
    <g>
      <path
        d={tombstonePath({ x: -60, width: 240, height: 310, fillClass: "" }, 810)}
        className="fill-foreground/12"
      />
      <g className="fill-background/35">
        <rect x={26} y={578} width={112} height={7} rx={3} />
        <rect x={40} y={602} width={84} height={7} rx={3} />
        <rect x={52} y={626} width={60} height={7} rx={3} />
      </g>
      {/* crack down the big stone */}
      <path
        d="M120 512 l-10 26 8 20 -13 30 5 4 14 -31 -8 -20 10 -25 Z"
        className="fill-background/30"
      />
      <path
        d={tombstonePath({ x: 168, width: 110, height: 170, fillClass: "" }, 810)}
        className="fill-foreground/8"
      />

      {/* right: tall cross and companion stone */}
      <g className="fill-foreground/10">
        <rect x={1330} y={548} width={30} height={262} />
        <rect x={1252} y={610} width={186} height={28} />
      </g>
      <path
        d={tombstonePath({ x: 1170, width: 120, height: 165, fillClass: "" }, 810)}
        className="fill-foreground/8"
      />
      <g className="fill-background/30">
        <rect x={1196} y={700} width={68} height={6} rx={3} />
        <rect x={1206} y={720} width={48} height={6} rx={3} />
      </g>
    </g>
  );
}

// A stretch of the old iron fence, mostly fallen.
function FenceFragment() {
  return (
    <g className="fill-foreground/8">
      {[1240, 1268, 1296].map((x) => (
        <g key={x}>
          <rect x={x - 2} y={664} width={4} height={40} />
          <polygon points={`${x - 4},664 ${x + 4},664 ${x},652`} />
        </g>
      ))}
      <rect x={1230} y={676} width={80} height={4} />
      {/* one picket lies in the grass */}
      <rect
        x={1330}
        y={700}
        width={46}
        height={4}
        transform="rotate(12 1352 702)"
      />
    </g>
  );
}

function DeadShrub() {
  return (
    <g className="fill-foreground/15">
      <rect x={238} y={672} width={4} height={32} rx={2} />
      <rect x={236} y={676} width={4} height={22} rx={2} transform="rotate(24 238 678)" />
      <rect x={242} y={674} width={4} height={24} rx={2} transform="rotate(-28 244 676)" />
      <rect x={240} y={684} width={3} height={14} rx={1.5} transform="rotate(48 241 686)" />
    </g>
  );
}

// Clawing out of the dirt at the road's edge, close enough to step on.
function SkeletalHand() {
  return (
    <g className="fill-foreground/25">
      <rect x={598} y={742} width={5} height={30} rx={2.5} />
      <rect x={607} y={732} width={5} height={40} rx={2.5} />
      <rect x={616} y={737} width={5} height={35} rx={2.5} />
      <rect x={625} y={749} width={5} height={23} rx={2.5} />
      <rect x={593} y={764} width={39} height={11} rx={5} />
    </g>
  );
}

function BonesAndGrass() {
  return (
    <g>
      {/* femur by the road */}
      <g className="fill-foreground/25" transform="rotate(-14 990 788)">
        <rect x={962} y={784} width={52} height={7} rx={3.5} />
        <circle cx={962} cy={787} r={6} />
        <circle cx={1014} cy={787} r={6} />
      </g>

      <g className="fill-foreground/10">
        {/* clumps around the stones */}
        <path d="M300 810 l6 -30 4 30 6 -22 4 22 7 -34 4 34 Z" />
        <path d="M1080 810 l6 -26 4 26 6 -20 4 20 7 -30 4 30 Z" />
        <path d="M180 810 l5 -22 4 22 5 -16 4 16 Z" />
        <path d="M1250 810 l5 -24 4 24 5 -18 4 18 Z" />
        <path d="M86 726 l4 -16 3 16 4 -12 3 12 Z" />
        <path d="M540 724 l4 -14 3 14 4 -10 3 10 Z" />
        <path d="M1010 726 l4 -16 3 16 4 -12 3 12 Z" />
        <path d="M330 640 l3 -10 2 10 3 -7 2 7 Z" />
        <path d="M930 642 l3 -10 2 10 3 -7 2 7 Z" />
        {/* fringe along the very bottom */}
        <path d="M60 810 l5 -18 3 18 5 -13 3 13 Z" />
        <path d="M480 810 l5 -16 3 16 5 -11 3 11 Z" />
        <path d="M760 810 l5 -18 3 18 5 -12 3 12 Z" />
        <path d="M1180 810 l5 -16 3 16 5 -12 3 12 Z" />
        <path d="M1380 810 l5 -20 3 20 5 -14 3 14 Z" />
      </g>
    </g>
  );
}
