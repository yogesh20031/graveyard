"use client";

import { Button } from "@/components/ui/Button";
import type { BranchKey } from "./RoadContext";

const ROAD_NAMES: Record<BranchKey, string> = {
  trials: "The Trials",
  lessons: "The Lessons",
};

type OtherRoadProps = {
  walked: BranchKey;
  onWalkOther: () => void;
};

// The end of a chosen road: offer the road not taken. Walking it swaps the
// branch content and carries the visitor back; otherwise the gate (epilogue)
// is the next station either way.
export function OtherRoad({ walked, onWalkOther }: OtherRoadProps) {
  const other: BranchKey = walked === "trials" ? "lessons" : "trials";

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
        The road not taken
      </p>
      <h2 className="font-display text-3xl text-foreground sm:text-4xl">
        You walked {ROAD_NAMES[walked]}
      </h2>
      <p className="max-w-md font-display italic text-foreground/50">
        {ROAD_NAMES[other]} still waits back at the fork — nobody should leave
        having seen only half of this place.
      </p>
      <Button onClick={onWalkOther} variant="outline" size="lg" skull>
        Walk {ROAD_NAMES[other]}
      </Button>
      <p className="font-display text-xs tracking-etched uppercase text-foreground/40">
        or keep walking — the gate is just ahead
      </p>
    </div>
  );
}
