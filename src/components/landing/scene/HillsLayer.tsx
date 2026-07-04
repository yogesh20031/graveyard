import {
  DISTANT_STONES,
  SCENE_ASPECT,
  SCENE_VIEW_BOX,
  tombstonePath,
} from "./geometry";

// Mid-distance layer: the far hill and the graveyard stretching over it —
// mausoleum, scattered stones, a dead tree. Everything here is smaller and
// darker than the foreground so it reads as depth through the fog.
export function HillsLayer() {
  return (
    <svg
      aria-hidden="true"
      viewBox={SCENE_VIEW_BOX}
      preserveAspectRatio={SCENE_ASPECT}
      className="h-full w-full"
    >
      <path
        d="M0 560 Q 240 520 480 548 T 960 540 T 1440 556 V810 H0 Z"
        className="fill-surface/70"
      />
      <Mausoleum />
      <DeadTree />
      <DistantStones />
    </svg>
  );
}

// Crypt on the left hill, doorway faintly lit from inside — someone,
// or something, keeps a light on.
function Mausoleum() {
  return (
    <g>
      <g className="fill-surface/90">
        <rect x={140} y={462} width={130} height={86} />
        <polygon points="130,462 280,462 205,428" />
        {/* cross finial */}
        <rect x={202} y={398} width={6} height={32} />
        <rect x={193} y={406} width={24} height={6} />
        {/* small side spire */}
        <polygon points="140,462 158,462 149,440" />
        <rect x={146} y={430} width={6} height={14} />
      </g>
      {/* arched doorway, lit from within */}
      <path
        d="M191 548 v-38 a14 14 0 0 1 28 0 v38 Z"
        className="lantern-glow fill-accent/25"
      />
    </g>
  );
}

// Bare crooked tree on the far hill, reaching toward the moon.
function DeadTree() {
  return (
    <g className="fill-surface/90">
      <path d="M1000 552 C 1004 520 998 498 1006 474 L 1013 475 C 1006 500 1012 522 1011 552 Z" />
      <path d="M1005 490 C 1018 480 1030 470 1044 466 L 1042 460 C 1028 466 1013 476 1000 484 Z" />
      <path d="M1004 512 C 992 504 982 504 971 496 L 968 501 C 978 509 990 508 1001 518 Z" />
      <path d="M1042 466 C 1051 459 1055 451 1064 446 L 1061 442 C 1053 447 1047 456 1039 461 Z" />
    </g>
  );
}

function DistantStones() {
  return (
    <g>
      {DISTANT_STONES.map((stone) =>
        stone.cross ? (
          <g key={stone.x} className={stone.fillClass}>
            <rect
              x={stone.x + stone.width / 2 - 2}
              y={stone.baseY - stone.height}
              width={4}
              height={stone.height}
            />
            <rect
              x={stone.x}
              y={stone.baseY - stone.height * 0.68}
              width={stone.width}
              height={4}
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
