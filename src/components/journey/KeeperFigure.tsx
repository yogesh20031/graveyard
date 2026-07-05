// The keeper at rest: a skeleton settled against his own headstone, the
// mummy watching from behind a smaller stone. Same silhouette style and
// tokens as the landing scene.
export function KeeperFigure() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 420 340"
      className="h-auto w-full"
    >
      <defs>
        <radialGradient id="keeper-glow">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.55} />
          <stop offset="55%" stopColor="var(--accent)" stopOpacity={0.18} />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* ground */}
      <path
        d="M0 308 Q 105 300 210 306 T 420 304 V340 H0 Z"
        className="fill-surface"
      />

      <Headstone />
      <Skeleton />
      <SmallStoneAndMummy />
      <Candle />
      <Grass />
    </svg>
  );
}

function Headstone() {
  return (
    <g>
      <path
        d="M70 310 v-110 a70 70 0 0 1 140 0 v110 z"
        className="fill-foreground/12"
      />
      {/* carved epitaph lines */}
      <g className="fill-background/40">
        <rect x={100} y={172} width={80} height={5} rx={2} />
        <rect x={110} y={188} width={60} height={5} rx={2} />
        <rect x={118} y={204} width={44} height={5} rx={2} />
      </g>
      {/* crack running down from the shoulder */}
      <path
        d="M190 152 l-8 18 6 14 -10 20 4 3 11 -21 -6 -14 8 -17 Z"
        className="fill-background/30"
      />
    </g>
  );
}

// Sitting with his back to the headstone, one arm draped over a knee —
// the keeper has been here a while.
function Skeleton() {
  return (
    <g>
      {/* skull, tilted slightly toward the visitor */}
      <g transform="rotate(8 238 200)">
        <circle cx={238} cy={200} r={15} className="fill-foreground/70" />
        <rect
          x={230}
          y={210}
          width={16}
          height={8}
          rx={3}
          className="fill-foreground/70"
        />
        <circle cx={232} cy={197} r={3.5} className="fill-surface" />
        <circle cx={244} cy={197} r={3.5} className="fill-surface" />
        <path d="M238 202 l3 6 h-6 Z" className="fill-surface" />
      </g>

      {/* spine */}
      <rect
        x={234}
        y={216}
        width={6}
        height={36}
        rx={3}
        className="fill-foreground/60"
      />
      {/* ribs, narrowing downward */}
      <g className="fill-foreground/55">
        <rect x={220} y={224} width={34} height={4} rx={2} />
        <rect x={222} y={233} width={30} height={4} rx={2} />
        <rect x={225} y={242} width={24} height={4} rx={2} />
      </g>

      {/* left arm draped over the bent knee */}
      <rect
        x={222}
        y={224}
        width={5}
        height={28}
        rx={2.5}
        transform="rotate(38 224 226)"
        className="fill-foreground/55"
      />
      <rect
        x={206}
        y={246}
        width={5}
        height={26}
        rx={2.5}
        transform="rotate(72 208 248)"
        className="fill-foreground/55"
      />
      {/* right arm hanging loose */}
      <rect
        x={250}
        y={224}
        width={5}
        height={32}
        rx={2.5}
        transform="rotate(-14 252 226)"
        className="fill-foreground/55"
      />

      {/* pelvis */}
      <rect
        x={226}
        y={252}
        width={22}
        height={10}
        rx={5}
        className="fill-foreground/60"
      />

      {/* legs folded up: thighs rise to the knees, shins drop to the ground */}
      <g className="fill-foreground/55">
        <rect
          x={240}
          y={256}
          width={34}
          height={6}
          rx={3}
          transform="rotate(-20 240 259)"
        />
        <rect
          x={268}
          y={248}
          width={6}
          height={54}
          rx={3}
          transform="rotate(12 271 250)"
        />
        <rect
          x={238}
          y={260}
          width={30}
          height={6}
          rx={3}
          transform="rotate(-32 238 263)"
        />
        <rect
          x={260}
          y={244}
          width={6}
          height={58}
          rx={3}
          transform="rotate(-6 263 246)"
        />
        {/* feet */}
        <rect x={266} y={300} width={18} height={5} rx={2.5} />
        <rect x={252} y={302} width={16} height={5} rx={2.5} />
      </g>

      {/* a spare bone in the grass beside him */}
      <g className="fill-foreground/35" transform="rotate(-18 300 306)">
        <rect x={288} y={303} width={26} height={4} rx={2} />
        <circle cx={288} cy={305} r={3.5} />
        <circle cx={314} cy={305} r={3.5} />
      </g>
    </g>
  );
}

function SmallStoneAndMummy() {
  return (
    <g>
      {/* mummy first, so the stone hides half of it */}
      <rect
        x={356}
        y={244}
        width={28}
        height={64}
        rx={14}
        className="fill-foreground/15"
      />
      <g className="fill-surface">
        <rect x={357} y={264} width={26} height={3} />
        <rect x={357} y={276} width={26} height={3} />
        <rect x={357} y={290} width={26} height={3} />
      </g>
      <g className="lantern-glow">
        <circle cx={364} cy={256} r={2.2} className="fill-accent-bright" />
        <circle cx={374} cy={256} r={2.2} className="fill-accent-bright" />
      </g>

      <path
        d="M310 308 v-44 a27 27 0 0 1 54 0 v44 z"
        className="fill-foreground/8"
      />
    </g>
  );
}

function Candle() {
  return (
    <g>
      <rect
        x={86}
        y={296}
        width={6}
        height={14}
        className="fill-foreground/30"
      />
      <g className="candle-flicker-offset">
        <circle cx={89} cy={290} r={15} fill="url(#keeper-glow)" />
        <ellipse cx={89} cy={290} rx={2} ry={4} className="fill-accent-bright" />
      </g>
    </g>
  );
}

function Grass() {
  return (
    <g className="fill-foreground/10">
      <path d="M46 310 l4 -16 3 16 4 -12 3 12 Z" />
      <path d="M222 308 l3 -12 3 12 3 -9 3 9 Z" />
      <path d="M296 309 l4 -14 3 14 3 -10 3 10 Z" />
      <path d="M390 306 l3 -12 3 12 3 -8 3 8 Z" />
      <path d="M148 312 l3 -10 3 10 3 -8 2 8 Z" />
    </g>
  );
}
