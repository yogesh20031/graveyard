"use client";

import { motion } from "motion/react";
import type { MotionValue } from "motion/react";
import {
  SCENE_ASPECT,
  SCENE_VIEW_BOX,
  tombstonePath,
} from "@/components/landing/scene/geometry";
import type { Tombstone } from "@/components/landing/scene/geometry";
import { cn } from "@/lib/cn";
import { useLitBranch } from "./RoadContext";

// The feet-level, first-person layer: a dark ground mass with the dirt
// road running out from under you, grave rows flanking it, and the stones
// right beside you cropped by the frame. Same recipe as the landing —
// light path and pale stones only read as such when cut into dark ground.

const HORIZON = 596;

// Where the road splits, in this SVG's own coordinates.
//
// The mouth opens at (532, 716) — solved off Road()'s left cubic — so the fork
// grows out of the road already being walked. The crotch sits well down the
// road toward the viewer, and the arms vanish only modestly either side of the
// road's own vanishing point: the ground plane here is barely a quarter of the
// frame tall, so an arm reaching for the far corners would have almost no
// vertical rise left and would read as a beam of light lying on the horizon
// rather than a road going away from you. Short and steep is what looks deep.
const CROTCH_X = 720;
const CROTCH_Y = 706;
const ARM_LEFT_TIP_X = 478;
const ARM_RIGHT_TIP_X = 962;

// Each arm: out along its near edge to the tip on the horizon, then back down
// its far edge to the crotch, and closed across the mouth it shares with the
// road's stem. Drawn twice — once as trodden earth, once as the amber wash that
// lights the road being pointed at.
const ARM_LEFT =
  "M532 716 C 514 678 494 636 482 600 L 478 596 L 490 601 C 552 636 644 675 720 706 Z";
const ARM_RIGHT =
  "M908 716 C 926 678 946 636 958 600 L 962 596 L 950 601 C 888 636 796 675 720 706 Z";

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

type AboutForegroundProps = {
  /** 0 = the road runs straight on; 1 = it has split in two ahead of you */
  fork?: MotionValue<number>;
};

export function AboutForeground({ fork }: AboutForegroundProps) {
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
      {/* the split, painted over the road's far half — under the graves, so the
          stones still stand in front of it */}
      <ForkArms fork={fork} />
      <GraveRows />
      <FlankingGraves />
      <FenceFragment />
      <DeadShrub />
      {/* the signpost stands in the crook, in front of the grave rows */}
      <Signpost fork={fork} />
      <SkeletalHand />
      <BonesAndGrass />
    </svg>
  );
}

// The road forking, in the scene's own coordinate space — so it registers with
// the road being walked by construction rather than by tuning.
//
// The stem is never redrawn: Road() already runs from your feet to the horizon,
// and the wedge below simply grows grass over its far half, turning the single
// road into a Y. The arms then open out of the crotch toward their own
// vanishing points. `fork` fades the whole thing in as you approach and out
// again once the junction is behind you.
function ForkArms({ fork }: { fork?: MotionValue<number> }) {
  const lit = useLitBranch();

  return (
    <motion.g style={{ opacity: fork }}>
      {/* grass reclaims the road ahead, between the two new ones — this is what
          turns the single road into a Y: it grows over the old road's far half,
          so the stem itself never has to be redrawn */}
      <path
        d={`M${CROTCH_X} ${CROTCH_Y} L ${ARM_LEFT_TIP_X} 596 L ${ARM_RIGHT_TIP_X} 596 Z`}
        className="fill-surface"
      />

      {/* left arm — the Trials */}
      <path
        d={ARM_LEFT}
        className="fill-foreground/8"
      />
      <path
        d={ARM_LEFT}
        className={cn(
          "fill-accent/25 transition-opacity duration-500",
          lit === "trials" ? "opacity-100" : "opacity-0",
        )}
      />

      {/* right arm — the Lessons */}
      <path
        d={ARM_RIGHT}
        className="fill-foreground/8"
      />
      <path
        d={ARM_RIGHT}
        className={cn(
          "fill-accent/25 transition-opacity duration-500",
          lit === "lessons" ? "opacity-100" : "opacity-0",
        )}
      />

      {/* half-sunk cobbles running out along each arm, shrinking into each
          distance — the same cue the straight road uses to read as receding */}
      <g className="fill-surface/50">
        <ellipse cx={600} cy={692} rx={9} ry={4} />
        <ellipse cx={563} cy={661} rx={7} ry={3} />
        <ellipse cx={524} cy={631} rx={5} ry={2.2} />
        <ellipse cx={499} cy={611} rx={3.5} ry={1.6} />
        <ellipse cx={840} cy={692} rx={9} ry={4} />
        <ellipse cx={877} cy={661} rx={7} ry={3} />
        <ellipse cx={916} cy={631} rx={5} ry={2.2} />
        <ellipse cx={941} cy={611} rx={3.5} ry={1.6} />
      </g>

      {/* tufts on the wedge, and a stone leaning in the crook */}
      <g className="fill-foreground/10">
        <path d="M688 678 l4 -14 3 14 4 -10 3 10 Z" />
        <path d="M748 672 l4 -12 3 12 4 -9 3 9 Z" />
        <path d="M700 638 l3 -11 2 11 3 -8 2 8 Z" />
        <path d="M742 630 l3 -10 2 10 3 -7 2 7 Z" />
        <path d="M714 612 l2 -8 2 8 2 -6 2 6 Z" />
      </g>
      <path
        d="M676 694 v-13 a10 10 0 0 1 20 0 v13 z"
        transform="rotate(-8 686 694)"
        className="fill-foreground/10"
      />

      {/* night fog swallowing the far end of the road not taken */}
      <ellipse
        cx={540}
        cy={640}
        rx={130}
        ry={46}
        fill="url(#fork-fog)"
        className={cn(
          "transition-opacity duration-700",
          lit === "lessons" ? "opacity-100" : "opacity-0",
        )}
      />
      <ellipse
        cx={900}
        cy={640}
        rx={130}
        ry={46}
        fill="url(#fork-fog)"
        className={cn(
          "transition-opacity duration-700",
          lit === "trials" ? "opacity-100" : "opacity-0",
        )}
      />
    </motion.g>
  );
}

// Standing in the crook of the fork, naming the two roads. Scenery, not
// controls — the choice is made by the buttons in the Crossroads station over
// this scene, which carry the accessible names.
function Signpost({ fork }: { fork?: MotionValue<number> }) {
  const lit = useLitBranch();

  return (
    <motion.g style={{ opacity: fork }}>
      <defs>
        <radialGradient id="fork-fog">
          <stop offset="0%" stopColor="var(--background)" stopOpacity={0.9} />
          <stop offset="100%" stopColor="var(--background)" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* planted at the crotch, so it stands in the ground the roads part around */}
      <g transform={`rotate(2 ${CROTCH_X} 650)`}>
        <rect x={716} y={598} width={8} height={108} className="fill-foreground/25" />

        {/* left board — the Trials */}
        <polygon
          points="618,622 638,610 818,610 818,634 638,634"
          className="fill-surface stroke-foreground/25"
          strokeWidth={2}
        />
        <text
          x={730}
          y={622}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={15}
          className={cn(
            "font-display tracking-etched uppercase transition-colors duration-500",
            lit === "trials" ? "fill-accent-bright" : "fill-foreground/60",
          )}
        >
          The Trials
        </text>

        {/* right board — the Lessons */}
        <polygon
          points="822,660 802,648 622,648 622,672 802,672"
          className="fill-surface stroke-foreground/25"
          strokeWidth={2}
        />
        <text
          x={712}
          y={660}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={15}
          className={cn(
            "font-display tracking-etched uppercase transition-colors duration-500",
            lit === "lessons" ? "fill-accent-bright" : "fill-foreground/60",
          )}
        >
          The Lessons
        </text>

        {/* the dying lantern on top */}
        <rect x={716} y={588} width={8} height={10} className="fill-foreground/25" />
        <circle cx={720} cy={581} r={8} className="fill-accent lantern-flicker" />
      </g>
    </motion.g>
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
