"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export type BranchKey = "trials" | "lessons";

type CrossroadsProps = {
  chosen: BranchKey | null;
  onChoose: (branch: BranchKey) => void;
};

// The fork, met inline as you walk: the dirt road you have been on visibly
// splits around a grass wedge into two roads — left to the Trials, right to
// the Lessons — with a signpost standing in the crook. Hover (or focus) a road
// and it lights while the other fogs over; click to take it. Only the chosen
// road is walked next; the other waits, offered again at this road's end.
export function Crossroads({ chosen, onChoose }: CrossroadsProps) {
  const [hovered, setHovered] = useState<BranchKey | null>(null);
  const litLeft = hovered === "trials" || (!hovered && chosen === "trials");
  const litRight = hovered === "lessons" || (!hovered && chosen === "lessons");

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
        A fork in the path
      </p>
      <h2 className="font-display text-4xl text-foreground sm:text-5xl">
        The Crossroads
      </h2>
      <p className="max-w-md font-display italic text-foreground/50">
        {chosen
          ? "This road it is — the other will wait where it ends."
          : "Which way, wanderer? The road you leave will wait."}
      </p>

      <div className="relative w-full">
        <ForkScene litLeft={litLeft} litRight={litRight} />

        {/* the two choices, as real buttons over each road */}
        <div className="absolute inset-0 flex">
          <RoadButton
            side="left"
            label="The Trials"
            hint="the works, shipped and survived"
            active={chosen === "trials"}
            onActivate={() => onChoose("trials")}
            onHover={(on) => setHovered(on ? "trials" : null)}
          />
          <RoadButton
            side="right"
            label="The Lessons"
            hint="the knowledge, dug up"
            active={chosen === "lessons"}
            onActivate={() => onChoose("lessons")}
            onHover={(on) => setHovered(on ? "lessons" : null)}
          />
        </div>
      </div>
    </div>
  );
}

// The road partition itself, in the exact language of the walked road
// (AboutForeground.Road): trodden earth cut into dark ground, wheel ruts,
// cobbles shrinking with distance — except here the road splits in two.
function ForkScene({ litLeft, litRight }: { litLeft: boolean; litRight: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 560"
      preserveAspectRatio="xMidYMax meet"
      className="h-auto w-full"
    >
      <defs>
        {/* night fog swallowing the far end of the road not taken */}
        <radialGradient id="fork-fog">
          <stop offset="0%" stopColor="var(--background)" stopOpacity={0.9} />
          <stop offset="100%" stopColor="var(--background)" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* No ground of its own — the roads are cut straight into the scene's
          ground behind the station, so the fork belongs to the graveyard
          instead of floating on a panel. */}

      {/* the Y: one continuous road entering from under your feet and
          splitting around the wedge — outer edges out to each tip, inner
          edges meeting at the crotch */}
      <path
        d="M480 560
           C 560 470 600 430 636 396
           C 520 330 380 250 238 184
           L 226 170
           C 400 220 580 292 706 338
           Q 720 344 734 338
           C 860 292 1040 220 1214 170
           L 1202 184
           C 1060 250 920 330 804 396
           C 840 430 880 470 960 560
           Z"
        className="fill-foreground/8"
      />

      {/* the chosen road lights up — an amber wash over just that branch */}
      <path
        d="M636 396 C 520 330 380 250 238 184 L 226 170 C 400 220 580 292 706 338 Z"
        className={cn(
          "fill-accent/25 transition-opacity duration-500",
          litLeft ? "opacity-100" : "opacity-0",
        )}
      />
      <path
        d="M804 396 C 920 330 1060 250 1202 184 L 1214 170 C 1040 220 860 292 734 338 Z"
        className={cn(
          "fill-accent/25 transition-opacity duration-500",
          litRight ? "opacity-100" : "opacity-0",
        )}
      />

      {/* wheel ruts: the pair from the walked road part ways, one into each
          branch */}
      <g className="fill-surface/70">
        <path d="M596 560 C 648 468 676 416 688 384 L 695 380 C 684 414 656 468 622 560 Z" />
        <path d="M688 384 C 560 308 430 244 310 198 L 314 192 C 434 238 564 302 694 378 Z" />
        <path d="M844 560 C 792 468 764 416 752 384 L 745 380 C 756 414 784 468 818 560 Z" />
        <path d="M752 384 C 880 308 1010 244 1130 198 L 1126 192 C 1006 238 876 302 746 378 Z" />
      </g>

      {/* half-sunk cobbles, shrinking into each distance */}
      <g className="fill-surface/50">
        <ellipse cx={700} cy={520} rx={13} ry={5.5} />
        <ellipse cx={742} cy={472} rx={11} ry={4.5} />
        <ellipse cx={716} cy={424} rx={9} ry={4} />
        <ellipse cx={620} cy={330} rx={8} ry={3.5} />
        <ellipse cx={500} cy={284} rx={6} ry={2.5} />
        <ellipse cx={388} cy={240} rx={5} ry={2} />
        <ellipse cx={300} cy={206} rx={4} ry={1.6} />
        <ellipse cx={820} cy={330} rx={8} ry={3.5} />
        <ellipse cx={940} cy={284} rx={6} ry={2.5} />
        <ellipse cx={1052} cy={240} rx={5} ry={2} />
        <ellipse cx={1140} cy={206} rx={4} ry={1.6} />
      </g>

      {/* the grass wedge between the roads: tufts and a small leaning stone */}
      <g className="fill-foreground/10">
        <path d="M688 302 l5 -18 3 18 5 -13 3 13 Z" />
        <path d="M734 318 l5 -16 3 16 5 -11 3 11 Z" />
        <path d="M706 262 l4 -13 3 13 4 -9 3 9 Z" />
      </g>
      <path
        d="M700 262 v-14 a11 11 0 0 1 22 0 v14 z"
        transform="rotate(-8 711 262)"
        className="fill-foreground/10"
      />

      {/* signpost standing in the crook of the fork */}
      <g transform="rotate(2 720 240)">
        <rect x={715} y={168} width={10} height={150} className="fill-foreground/25" />
        {/* left board — the Trials */}
        <polygon
          points="578,198 600,182 830,182 830,214 600,214"
          className="fill-surface stroke-foreground/25"
          strokeWidth={2}
        />
        <text
          x={712}
          y={204}
          textAnchor="middle"
          fontSize={20}
          className={cn(
            "font-display tracking-etched uppercase transition-colors duration-500",
            litLeft ? "fill-accent-bright" : "fill-foreground/60",
          )}
        >
          The Trials
        </text>
        {/* right board — the Lessons */}
        <polygon
          points="862,240 840,224 610,224 610,256 840,256"
          className="fill-surface stroke-foreground/25"
          strokeWidth={2}
        />
        <text
          x={728}
          y={246}
          textAnchor="middle"
          fontSize={20}
          className={cn(
            "font-display tracking-etched uppercase transition-colors duration-500",
            litRight ? "fill-accent-bright" : "fill-foreground/60",
          )}
        >
          The Lessons
        </text>
        {/* the dying lantern on top */}
        <rect x={716} y={158} width={8} height={10} className="fill-foreground/25" />
        <circle cx={720} cy={150} r={9} className="fill-accent lantern-flicker" />
      </g>

      {/* fog rolls over the road not taken */}
      <ellipse
        cx={310}
        cy={210}
        rx={200}
        ry={85}
        fill="url(#fork-fog)"
        className={cn(
          "transition-opacity duration-700",
          litRight && !litLeft ? "opacity-100" : "opacity-0",
        )}
      />
      <ellipse
        cx={1130}
        cy={210}
        rx={200}
        ry={85}
        fill="url(#fork-fog)"
        className={cn(
          "transition-opacity duration-700",
          litLeft && !litRight ? "opacity-100" : "opacity-0",
        )}
      />
    </svg>
  );
}

function RoadButton({
  side,
  label,
  hint,
  active,
  onActivate,
  onHover,
}: {
  side: "left" | "right";
  label: string;
  hint: string;
  active: boolean;
  onActivate: () => void;
  onHover: (on: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={onActivate}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-label={`Walk ${label} — ${hint}`}
      aria-pressed={active}
      className={cn(
        "group flex h-full w-1/2 cursor-pointer flex-col items-center justify-end gap-1 pb-4 focus:outline-none",
        side === "left" ? "pr-6" : "pl-6",
      )}
    >
      {/* the signpost carries the names on desktop; small screens can't read
          carved boards, so the label steps forward there */}
      <span
        className={cn(
          "font-display text-lg tracking-etched uppercase transition-[color,text-shadow] duration-500 sm:hidden",
          active
            ? "text-accent-bright [text-shadow:var(--shadow-glow)]"
            : "text-foreground/70 group-hover:text-accent-bright group-focus-visible:text-accent-bright",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-display text-[0.7rem] tracking-etched uppercase transition-colors duration-500",
          active
            ? "text-accent-bright/80"
            : "text-foreground/40 group-hover:text-foreground/70 group-focus-visible:text-foreground/70",
        )}
      >
        {active ? "walking this way" : hint}
      </span>
    </button>
  );
}
