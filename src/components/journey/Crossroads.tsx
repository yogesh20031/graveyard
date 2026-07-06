"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export type BranchKey = "trials" | "lessons";

type CrossroadsProps = {
  chosen: BranchKey | null;
  onChoose: (branch: BranchKey) => void;
};

// The fork in the path, met inline as you walk. Two dirt roads diverge from
// your feet — left to the Trials, right to the Lessons. Hover (or focus) a road
// and it lights up; click to take it first. Both roads are walked either way;
// the choice just sets which comes next, so the walk never stops or asks twice.
export function Crossroads({ chosen, onChoose }: CrossroadsProps) {
  const [hovered, setHovered] = useState<BranchKey | null>(null);
  const litLeft = hovered === "trials" || (!hovered && chosen === "trials");
  const litRight = hovered === "lessons" || (!hovered && chosen === "lessons");

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
        A fork in the path
      </p>
      <h2 className="font-display text-4xl text-foreground sm:text-5xl">
        The Crossroads
      </h2>
      <p className="max-w-md font-display italic text-foreground/50">
        {chosen
          ? "This way first — the other road still waits beyond."
          : "Which way first, wanderer? Both are yours to walk."}
      </p>

      <div className="relative w-full max-w-2xl">
        <svg
          aria-hidden="true"
          viewBox="0 0 600 320"
          preserveAspectRatio="xMidYMax meet"
          className="h-auto w-full"
        >
          {/* ground the roads are cut into */}
          <path d="M0 150 Q 300 138 600 150 V320 H0 Z" className="fill-surface" />
          <Road d="M250 320 L306 320 L176 128 L138 132 Z" lit={litLeft} />
          <Road d="M294 320 L350 320 L462 132 L424 128 Z" lit={litRight} />
          {/* lantern standing in the crook of the fork */}
          <rect x={296} y={104} width={7} height={70} className="fill-surface/90" />
          <circle cx={299} cy={98} r={9} className="fill-accent lantern-flicker" />
        </svg>

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

function Road({ d, lit }: { d: string; lit: boolean }) {
  return (
    <path
      d={d}
      className={cn(
        "transition-colors duration-500",
        lit ? "fill-accent/30" : "fill-foreground/10",
      )}
    />
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
      aria-label={`Walk ${label} first — ${hint}`}
      aria-pressed={active}
      className={cn(
        "group flex h-full w-1/2 cursor-pointer flex-col items-center justify-end gap-1 pb-4 focus:outline-none",
        side === "left" ? "pr-6" : "pl-6",
      )}
    >
      <span
        className={cn(
          "font-display text-xl tracking-etched uppercase transition-[color,text-shadow] duration-500 sm:text-2xl",
          active
            ? "text-accent-bright [text-shadow:var(--shadow-glow)]"
            : "text-foreground/70 group-hover:text-accent-bright group-focus-visible:text-accent-bright group-hover:[text-shadow:var(--shadow-glow)] group-focus-visible:[text-shadow:var(--shadow-glow)]",
        )}
      >
        {label}
      </span>
      <span className="font-display text-[0.7rem] tracking-etched uppercase text-foreground/40">
        {active ? "walking this way" : hint}
      </span>
    </button>
  );
}
