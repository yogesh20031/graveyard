import {
  CANDLES,
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
        {/* soft-glow falloff for every flame — a gradient fill costs nothing
            per frame, unlike a blur filter under an opacity animation */}
        <radialGradient id="glow-warm">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.55} />
          <stop offset="55%" stopColor="var(--accent)" stopOpacity={0.18} />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
        </radialGradient>
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
      <CelticCross />
      <WeepingAngel />
      <SkeletalHand />
      <Mummy />
      <GroundClutter />
      <Candles />
      <Fence />
      <LampPost />
      <GnarledTree />
      <GnarledTree mirrored />
      <Crow />
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

// Ringed headstone standing in the open ground before the gate.
function CelticCross() {
  return (
    <g className="fill-foreground/12">
      <rect x={528} y={646} width={34} height={14} />
      <rect x={541} y={568} width={8} height={80} />
      <rect x={523} y={588} width={44} height={8} />
      <path
        fillRule="evenodd"
        d="M545 574 a18 18 0 1 0 0 36 a18 18 0 1 0 0 -36 Zm0 6 a12 12 0 1 1 0 24 a12 12 0 1 1 0 -24 Z"
      />
    </g>
  );
}

// Hunched statue weeping over a grave, one wing folded across its back —
// slightly paler than the stones so it reads as marble, not rock.
function WeepingAngel() {
  return (
    <g className="fill-foreground/12">
      <rect x={348} y={648} width={52} height={12} />
      {/* body bowed forward, head sunk into hands */}
      <path d="M360 648 C 357 620 363 600 377 590 C 383 585 387 578 389 570 C 391 562 397 558 402 560 C 406 562 407 568 405 574 C 403 580 399 586 397 592 C 403 602 407 622 405 648 Z" />
      {/* folded wing arcing over the back */}
      <path d="M364 648 C 350 612 354 578 376 556 C 365 586 367 616 375 648 Z" />
    </g>
  );
}

// Broken slabs and dry grass roughing up the ground line.
function GroundClutter() {
  return (
    <g>
      <g className="fill-foreground/8">
        <polygon points="255,660 262,646 274,650 280,660" />
        <polygon points="610,658 618,644 626,658" />
        <polygon points="884,660 890,650 902,653 906,660" />
        <polygon points="1240,659 1247,647 1257,651 1262,659" />
      </g>
      <g className="fill-foreground/10">
        <path d="M330 660 l3 -12 2 12 3 -9 2 9 Z" />
        <path d="M586 660 l3 -10 2 10 3 -8 2 8 Z" />
        <path d="M822 660 l3 -11 2 11 3 -8 2 8 Z" />
        <path d="M1010 659 l3 -12 2 12 3 -9 2 9 Z" />
        <path d="M1198 660 l3 -10 2 10 3 -8 2 8 Z" />
      </g>
    </g>
  );
}

// Candles guttering at the grave bases, like the reference image —
// each flame on its own flicker timing.
function Candles() {
  return (
    <g>
      {CANDLES.map((candle) => (
        <g key={candle.x}>
          <rect
            x={candle.x - 2.5}
            y={GROUND_Y - candle.h}
            width={5}
            height={candle.h}
            className="fill-foreground/30"
          />
          <g className={candle.flickerClass}>
            <circle
              cx={candle.x}
              cy={GROUND_Y - candle.h - 4}
              r={12}
              fill="url(#glow-warm)"
            />
            <ellipse
              cx={candle.x}
              cy={GROUND_Y - candle.h - 4}
              rx={1.6}
              ry={3.2}
              className="fill-accent-bright"
            />
          </g>
        </g>
      ))}
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
      <GateArch />
    </g>
  );
}

// Wrought-iron arch spanning the opening, one lantern hanging dead center —
// the unmissable "this is the way in" marker.
function GateArch() {
  return (
    <g>
      <path
        d="M604 522 A 116 116 0 0 1 836 522 L 824 522 A 104 104 0 0 0 616 522 Z"
        className="fill-foreground/12"
      />
      {/* hanging lantern at the apex */}
      <rect x={718.5} y={416} width={3} height={12} className="fill-foreground/12" />
      <g className="lantern-glow">
        <circle cx={720} cy={436} r={18} fill="url(#glow-warm)" />
        <circle cx={720} cy={436} r={6} className="fill-accent" />
      </g>
    </g>
  );
}

function GatePillar({ x, flickerClass }: { x: number; flickerClass: string }) {
  return (
    <g>
      <rect x={x - 18} y={530} width={36} height={130} className="fill-surface" />
      <rect x={x - 24} y={522} width={48} height={12} className="fill-surface" />
      {/* moonlit face so the pillars read against the dark fence line */}
      <rect x={x - 12} y={540} width={24} height={112} className="fill-foreground/8" />
      <rect x={x - 24} y={522} width={48} height={5} className="fill-foreground/10" />
      {/* dying lantern — burnt amber, never full brightness; the flicker's
          brief peaks are its only "bright" moments */}
      <g className={flickerClass}>
        <circle cx={x} cy={504} r={32} fill="url(#glow-warm)" />
        <circle cx={x} cy={504} r={8} className="fill-accent" />
      </g>
    </g>
  );
}

// Iron lamp post just inside the gate, lighting the path — its bulb fails
// on the same rhythm as the gate lanterns.
function LampPost() {
  return (
    <g>
      <rect x={857} y={494} width={6} height={GROUND_Y - 494} className="fill-surface" />
      <rect x={851} y={GROUND_Y - 6} width={18} height={6} className="fill-surface" />
      <rect x={850} y={468} width={20} height={5} className="fill-surface" />
      <g className="lantern-flicker">
        <circle cx={860} cy={484} r={22} fill="url(#glow-warm)" />
        <circle cx={860} cy={484} r={5} className="fill-accent" />
      </g>
      {/* lantern cage over the light */}
      <g className="fill-surface">
        <rect x={851} y={473} width={2.5} height={22} />
        <rect x={866.5} y={473} width={2.5} height={22} />
        <rect x={851} y={493} width={18} height={3} />
      </g>
    </g>
  );
}

// Bare, twisted tree framing the scene edge, branches clawing over the
// fence. Mirrored copy stands at the opposite edge.
function GnarledTree({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <g
      className="fill-surface"
      transform={mirrored ? "translate(1440 0) scale(-1 1)" : undefined}
    >
      {/* trunk */}
      <path d="M42 730 C 56 620 44 560 66 470 C 74 430 68 380 76 330 C 80 300 74 270 80 240 L 96 244 C 90 276 98 304 92 336 C 86 388 94 432 84 474 C 68 562 84 622 74 730 Z" />
      {/* low branch reaching over the fence */}
      <path d="M68 472 C 110 440 160 436 210 420 C 240 410 268 386 286 362 L 280 356 C 258 378 234 398 206 408 C 158 424 108 430 64 458 Z" />
      {/* mid branch */}
      <path d="M78 382 C 112 366 138 344 168 330 L 196 312 L 192 306 L 164 322 C 134 336 108 358 74 370 Z" />
      {/* short branch toward the edge */}
      <path d="M72 422 C 48 406 28 404 8 392 L 0 388 L 0 398 L 6 400 C 24 410 44 414 66 432 Z" />
      {/* twigs */}
      <path d="M208 420 C 224 414 234 400 250 396 L 248 390 C 232 394 220 410 204 414 Z" />
      <path d="M168 330 C 178 318 192 314 200 302 L 195 298 C 186 308 172 316 162 324 Z" />
      <path d="M88 246 C 96 232 110 226 118 214 L 113 210 C 104 222 92 228 82 242 Z" />
    </g>
  );
}

// Something is watching from the low branch of the right-hand tree.
function Crow() {
  return (
    <g transform="translate(1236 400)">
      <path
        d="M0 14 Q 2 4 10 2 Q 14 -6 20 -6 Q 18 -2 19 1 L 26 3 L 19 5 Q 19 11 12 14 L 16 20 L 9 16 L 0 17 Z"
        className="fill-surface"
      />
      {/* a pinprick of amber where an eye should be */}
      <circle cx={16} cy={0} r={1} className="fill-accent-bright" />
    </g>
  );
}
