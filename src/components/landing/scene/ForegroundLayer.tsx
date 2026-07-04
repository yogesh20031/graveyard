import {
  GATE_LEFT,
  GATE_RIGHT,
  GROUND_Y,
  PICKET_XS,
  SCENE_ASPECT,
  SCENE_VIEW_BOX,
  TOMBSTONES,
  tombstonePath,
} from "./geometry";

// Nearest layer: ground, tombstones, fence, gate — plus the scary residents.
// Moves fastest and scales up as you scroll, like stepping toward the gate.
export function ForegroundLayer() {
  return (
    <svg
      aria-hidden="true"
      viewBox={SCENE_VIEW_BOX}
      preserveAspectRatio={SCENE_ASPECT}
      className="h-full w-full"
    >
      <defs>
        <filter id="fg-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* ground */}
      <path
        d="M0 648 Q 360 636 720 650 T 1440 644 V810 H0 Z"
        className="fill-surface"
      />

      {/* winding path leading through the open gate */}
      <path
        d="M640 810 C 690 750 704 700 712 662 L 728 662 C 738 700 752 750 802 810 Z"
        className="fill-foreground/8"
      />

      <Tombstones />
      <SkeletalHand />
      <Mummy />
      <Fence />
    </svg>
  );
}

function Tombstones() {
  return (
    <g>
      {TOMBSTONES.map((stone) => (
        <path key={stone.x} d={tombstonePath(stone)} className={stone.fillClass} />
      ))}
      {/* a lone cross among the stones */}
      <g className="fill-foreground/10">
        <rect x={1176} y={584} width={8} height={76} />
        <rect x={1158} y={602} width={44} height={8} />
      </g>
    </g>
  );
}

// Bony hand clawing out of the dirt beside the first tombstone.
function SkeletalHand() {
  return (
    <g className="fill-foreground/25">
      <rect x={224} y={634} width={4} height={26} rx={2} />
      <rect x={231} y={626} width={4} height={34} rx={2} />
      <rect x={238} y={630} width={4} height={30} rx={2} />
      <rect x={245} y={640} width={4} height={20} rx={2} />
      <rect
        x={214}
        y={646}
        width={4}
        height={16}
        rx={2}
        transform="rotate(-35 216 654)"
      />
      <rect x={220} y={652} width={31} height={10} rx={4} />
    </g>
  );
}

// Wrapped figure peeking out from behind the tall tombstone,
// eyes glowing on the same slow pulse as the gate lanterns.
function Mummy() {
  return (
    <g>
      <rect
        x={1112}
        y={586}
        width={34}
        height={GROUND_Y - 586}
        rx={17}
        className="fill-foreground/15"
      />
      {/* bandage gaps */}
      <g className="fill-surface">
        <rect x={1113} y={612} width={32} height={3} />
        <rect x={1113} y={624} width={32} height={3} />
        <rect x={1113} y={638} width={32} height={3} />
      </g>
      {/* glowing eyes */}
      <g className="lantern-glow">
        <circle cx={1122} cy={600} r={2.5} className="fill-accent-bright" />
        <circle cx={1135} cy={600} r={2.5} className="fill-accent-bright" />
      </g>
    </g>
  );
}

function Fence() {
  return (
    <g className="fill-surface">
      {/* pickets with spearhead tips */}
      {PICKET_XS.map((x) => (
        <g key={x}>
          <rect x={x - 2.5} y={560} width={5} height={95} />
          <polygon points={`${x - 5},560 ${x + 5},560 ${x},542`} />
        </g>
      ))}

      {/* rails, broken at the gate opening */}
      <rect x={0} y={594} width={GATE_LEFT - 18} height={5} />
      <rect x={GATE_RIGHT + 18} y={594} width={1440 - GATE_RIGHT - 18} height={5} />
      <rect x={0} y={636} width={GATE_LEFT - 18} height={5} />
      <rect x={GATE_RIGHT + 18} y={636} width={1440 - GATE_RIGHT - 18} height={5} />

      {/* different flicker timings so the bulbs fail independently */}
      <GatePillar x={GATE_LEFT - 18} flickerClass="lantern-flicker" />
      <GatePillar x={GATE_RIGHT + 18} flickerClass="lantern-flicker-offset" />
    </g>
  );
}

function GatePillar({ x, flickerClass }: { x: number; flickerClass: string }) {
  return (
    <g>
      <rect x={x - 18} y={530} width={36} height={130} className="fill-surface" />
      <rect x={x - 24} y={522} width={48} height={12} className="fill-surface" />
      {/* dying lantern — burnt amber, never full brightness; the flicker's
          brief peaks are its only "bright" moments */}
      <g className={flickerClass}>
        <circle
          cx={x}
          cy={504}
          r={20}
          filter="url(#fg-blur)"
          className="fill-accent/50"
        />
        <circle cx={x} cy={504} r={8} className="fill-accent" />
      </g>
    </g>
  );
}
