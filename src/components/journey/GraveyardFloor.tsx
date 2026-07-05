// Full-width ground strip closing the section: grass, and things
// half-buried in it. Skull and bones are drawn before the ground so the
// soil swallows their lower halves.
const GRASS_XS = Array.from({ length: 30 }, (_, i) => 20 + i * 48);

type GraveyardFloorProps = {
  /** hide the half-buried skull/femur set when the strip repeats in a section */
  bones?: boolean;
};

export function GraveyardFloor({ bones = true }: GraveyardFloorProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 100"
      preserveAspectRatio="xMidYMax slice"
      className="h-24 w-full"
    >
      {bones && <HalfBuried />}
      <path
        d="M0 74 Q 180 66 360 72 T 720 70 T 1080 74 T 1440 70 V100 H0 Z"
        className="fill-surface"
      />
      <Grass />
    </svg>
  );
}

function HalfBuried() {
  return (
    <g>
      {/* a skull surfacing */}
      <g>
        <circle cx={400} cy={74} r={14} className="fill-foreground/25" />
        <circle cx={395} cy={71} r={3} className="fill-surface" />
        <circle cx={406} cy={71} r={3} className="fill-surface" />
      </g>
      {/* a femur breaking the surface */}
      <g className="fill-foreground/20" transform="rotate(-24 900 74)">
        <rect x={878} y={71} width={44} height={5} rx={2.5} />
        <circle cx={878} cy={73} r={4.5} />
        <circle cx={922} cy={73} r={4.5} />
      </g>
      {/* rib cage arcs poking out */}
      <g className="stroke-foreground/20 fill-none" strokeWidth={3}>
        <path d="M1180 76 a16 16 0 0 1 32 0" />
        <path d="M1188 76 a10 10 0 0 1 20 0" />
      </g>
    </g>
  );
}

function Grass() {
  return (
    <g className="fill-foreground/10">
      {GRASS_XS.map((x, i) => {
        // vary tuft height on a fixed cycle so the row doesn't look stamped
        const h = 10 + ((i * 7) % 3) * 4;
        return (
          <path
            key={x}
            d={`M${x} 78 l3 ${-h} 2 ${h} 3 ${-(h - 4)} 2 ${h - 4} 4 ${-(h + 3)} 2 ${h + 3} Z`}
          />
        );
      })}
    </g>
  );
}
