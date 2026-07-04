import { SCENE_ASPECT, SCENE_VIEW_BOX, STARS } from "./geometry";

const MOON_X = 1100;
const MOON_Y = 150;
const MOON_R = 52;

// Dark maria patches, roughly matching the big shaded regions of a real
// full moon (heavier toward the upper half, like the reference photo).
const MARIA = [
  { cx: 1082, cy: 128, rx: 22, ry: 14 },
  { cx: 1112, cy: 118, rx: 14, ry: 9 },
  { cx: 1126, cy: 146, rx: 12, ry: 16 },
  { cx: 1090, cy: 158, rx: 16, ry: 10 },
] as const;

// Craters scattered unevenly — clusters and gaps read more natural than a grid.
const CRATERS = [
  { x: 1076, y: 136, r: 8 },
  { x: 1116, y: 166, r: 6 },
  { x: 1090, y: 176, r: 5 },
  { x: 1064, y: 156, r: 4 },
  { x: 1122, y: 130, r: 4 },
  { x: 1070, y: 118, r: 4 },
  { x: 1130, y: 176, r: 3.5 },
  { x: 1136, y: 152, r: 3 },
  { x: 1098, y: 118, r: 3 },
  { x: 1108, y: 108, r: 2.5 },
  { x: 1058, y: 172, r: 2.5 },
] as const;

// Farthest layer: moon + stars. Moves slowest in the parallax.
export function SkyLayer() {
  return (
    <svg
      aria-hidden="true"
      viewBox={SCENE_VIEW_BOX}
      preserveAspectRatio={SCENE_ASPECT}
      className="h-full w-full"
    >
      <defs>
        <filter id="sky-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
        {/* soft blur for the maria so they read as shading, not stickers */}
        <filter id="moon-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <clipPath id="moon-clip">
          <circle cx={MOON_X} cy={MOON_Y} r={MOON_R} />
        </clipPath>
      </defs>

      <Stars />
      <Moon />
    </svg>
  );
}

function Stars() {
  return (
    <g>
      {STARS.map((star) => (
        <circle
          key={`${star.x}-${star.y}`}
          cx={star.x}
          cy={star.y}
          r={star.r}
          className={
            star.slow ? "star-slow fill-foreground/70" : "star fill-foreground/70"
          }
        />
      ))}
    </g>
  );
}

function Moon() {
  return (
    <g>
      {/* halo */}
      <circle
        cx={MOON_X}
        cy={MOON_Y}
        r={120}
        filter="url(#sky-blur)"
        className="fill-foreground/10"
      />
      <circle cx={MOON_X} cy={MOON_Y} r={MOON_R} className="fill-foreground/90" />

      {/* surface detail, clipped to the disc */}
      <g clipPath="url(#moon-clip)">
        <g filter="url(#moon-soft)">
          {MARIA.map((m) => (
            <ellipse
              key={`${m.cx}-${m.cy}`}
              cx={m.cx}
              cy={m.cy}
              rx={m.rx}
              ry={m.ry}
              className="fill-background/20"
            />
          ))}
        </g>

        {CRATERS.map((c) => (
          <Crater key={`${c.x}-${c.y}`} {...c} />
        ))}

        <RayedCrater />

        {/* rim shading — half the stroke is clipped off, darkening just the
            edge so the disc reads as a sphere */}
        <circle
          cx={MOON_X}
          cy={MOON_Y}
          r={MOON_R}
          strokeWidth={7}
          className="fill-none stroke-background/25"
        />
      </g>
    </g>
  );
}

// Sunlit rim on the upper-left, shadowed bowl offset to the lower-right.
function Crater({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="fill-foreground/40" />
      <circle
        cx={x + r * 0.15}
        cy={y + r * 0.15}
        r={r * 0.85}
        className="fill-background/25"
      />
    </g>
  );
}

// The bright Tycho-like crater near the bottom, with its ray system fanning up.
function RayedCrater() {
  return (
    <g>
      <g className="stroke-foreground/30" strokeWidth={1}>
        <line x1={1102} y1={184} x2={1078} y2={162} />
        <line x1={1102} y1={184} x2={1092} y2={156} />
        <line x1={1102} y1={184} x2={1110} y2={158} />
        <line x1={1102} y1={184} x2={1124} y2={166} />
        <line x1={1102} y1={184} x2={1132} y2={182} />
        <line x1={1102} y1={184} x2={1074} y2={184} />
      </g>
      <circle cx={1102} cy={184} r={3.5} className="fill-foreground" />
    </g>
  );
}
