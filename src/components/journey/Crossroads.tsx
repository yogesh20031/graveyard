"use client";

import { cn } from "@/lib/cn";
import type { BranchKey } from "./RoadContext";
import { useRoad } from "./RoadContext";

type CrossroadsProps = {
  onChoose: (branch: BranchKey) => void;
};

// The fork, met inline as you walk. The roads themselves are drawn in the scene
// (AboutForeground.ForkArms) — the dirt road you have been on visibly splits
// around a grass wedge, with a signpost standing in the crook. This station is
// what stands over them: the copy, and one button per road. Pointing at a road
// lights it and fogs the other; taking it walks it. The road you leave waits,
// and is offered again where this one ends.
export function Crossroads({ onChoose }: CrossroadsProps) {
  const { chosen } = useRoad();

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

      {/* one button per road, reaching down over the two arms in the scene below
          — the hints land beside the roads they name, not up on the horizon */}
      <div className="mt-[3dvh] flex h-[34dvh] w-full">
        <RoadButton
          branch="trials"
          label="The Trials"
          hint="the works, shipped and survived"
          onActivate={() => onChoose("trials")}
        />
        <RoadButton
          branch="lessons"
          label="The Lessons"
          hint="the knowledge, dug up"
          onActivate={() => onChoose("lessons")}
        />
      </div>
    </div>
  );
}

function RoadButton({
  branch,
  label,
  hint,
  onActivate,
}: {
  branch: BranchKey;
  label: string;
  hint: string;
  onActivate: () => void;
}) {
  const { chosen, setHovered } = useRoad();
  const active = chosen === branch;
  const point = (on: boolean) => setHovered(on ? branch : null);

  return (
    <button
      type="button"
      onClick={onActivate}
      onMouseEnter={() => point(true)}
      onMouseLeave={() => point(false)}
      onFocus={() => point(true)}
      onBlur={() => point(false)}
      aria-label={`Walk ${label} — ${hint}`}
      aria-pressed={active}
      className={cn(
        "group flex h-full w-1/2 cursor-pointer flex-col items-center justify-end gap-1 pb-4 focus:outline-none",
        branch === "trials" ? "pr-6" : "pl-6",
      )}
    >
      {/* the signpost in the scene carries the names on desktop; small screens
          can't read a carved board, so the label steps forward there */}
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
