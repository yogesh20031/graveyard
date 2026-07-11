import type { ReactNode } from "react";

type SkeletonPresenterProps = {
  children: ReactNode;
};

// A skeleton standing at the roadside, one arm raised toward the stones it
// keeps — the graveyard's way of pointing a visitor at some information.
// Hidden on mobile like the keeper's figure; the stones speak for themselves
// there.
export function SkeletonPresenter({ children }: SkeletonPresenterProps) {
  return (
    <div className="grid items-end gap-2 sm:grid-cols-[1fr_3fr]">
      <div className="hidden sm:block">
        <PresentingSkeleton />
      </div>
      <div>{children}</div>
    </div>
  );
}

// Same silhouette language as KeeperFigure's resting skeleton, but upright,
// gesturing at the content beside him.
function PresentingSkeleton() {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 340" className="h-auto w-full">
      {/* ground he stands on */}
      <path
        d="M0 316 Q 60 308 120 314 T 200 312 V340 H0 Z"
        className="fill-surface"
      />

      {/* skull, tilted toward what he's showing */}
      <g transform="rotate(-6 96 96)">
        <circle cx={96} cy={96} r={16} className="fill-foreground/70" />
        <rect
          x={88}
          y={107}
          width={17}
          height={8}
          rx={3}
          className="fill-foreground/70"
        />
        <circle cx={90} cy={93} r={3.5} className="fill-surface" />
        <circle cx={102} cy={93} r={3.5} className="fill-surface" />
        <path d="M96 98 l3 6 h-6 Z" className="fill-surface" />
      </g>

      {/* spine */}
      <rect
        x={92}
        y={116}
        width={6}
        height={56}
        rx={3}
        className="fill-foreground/60"
      />
      {/* ribs, narrowing downward */}
      <g className="fill-foreground/55">
        <rect x={78} y={126} width={34} height={4} rx={2} />
        <rect x={80} y={136} width={30} height={4} rx={2} />
        <rect x={83} y={146} width={24} height={4} rx={2} />
      </g>

      {/* right arm raised toward the stones — upper arm, forearm, hand */}
      <g className="fill-foreground/55">
        <rect
          x={108}
          y={120}
          width={5}
          height={30}
          rx={2.5}
          transform="rotate(-58 110 122)"
        />
        <rect
          x={132}
          y={100}
          width={5}
          height={26}
          rx={2.5}
          transform="rotate(-24 134 102)"
        />
        <circle cx={142} cy={96} r={4} />
      </g>
      {/* left arm hanging loose */}
      <rect
        x={80}
        y={124}
        width={5}
        height={40}
        rx={2.5}
        transform="rotate(10 82 126)"
        className="fill-foreground/55"
      />

      {/* pelvis */}
      <rect
        x={84}
        y={172}
        width={22}
        height={10}
        rx={5}
        className="fill-foreground/60"
      />

      {/* legs standing, slightly crooked — he's been upright a long time */}
      <g className="fill-foreground/55">
        <rect
          x={84}
          y={182}
          width={6}
          height={62}
          rx={3}
          transform="rotate(4 87 184)"
        />
        <rect
          x={100}
          y={182}
          width={6}
          height={62}
          rx={3}
          transform="rotate(-3 103 184)"
        />
        <rect
          x={78}
          y={244}
          width={6}
          height={60}
          rx={3}
          transform="rotate(-2 81 246)"
        />
        <rect
          x={104}
          y={244}
          width={6}
          height={60}
          rx={3}
          transform="rotate(2 107 246)"
        />
        {/* feet */}
        <rect x={70} y={304} width={20} height={5} rx={2.5} />
        <rect x={104} y={304} width={20} height={5} rx={2.5} />
      </g>

      {/* a spare bone in the grass beside him */}
      <g className="fill-foreground/35" transform="rotate(14 40 316)">
        <rect x={28} y={313} width={24} height={4} rx={2} />
        <circle cx={28} cy={315} r={3.2} />
        <circle cx={52} cy={315} r={3.2} />
      </g>
    </svg>
  );
}
