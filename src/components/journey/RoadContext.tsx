"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type BranchKey = "trials" | "lessons";

type RoadState = {
  /** the road already taken */
  chosen: BranchKey | null;
  /** the road the walker is pointing at right now */
  hovered: BranchKey | null;
  setHovered: (branch: BranchKey | null) => void;
};

const RoadContext = createContext<RoadState | null>(null);

// The fork is drawn in the scene (AboutForeground) but chosen from the station
// on top of it (Crossroads) — two components three levels apart in the tree.
// This carries the lighting between them rather than drilling it through
// GraveyardJourney → WalkStage → AboutForeground.
export function RoadProvider({
  chosen,
  children,
}: {
  chosen: BranchKey | null;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState<BranchKey | null>(null);
  const value = useMemo(
    () => ({ chosen, hovered, setHovered }),
    [chosen, hovered],
  );

  return <RoadContext.Provider value={value}>{children}</RoadContext.Provider>;
}

export function useRoad() {
  const road = useContext(RoadContext);
  if (!road) throw new Error("useRoad must be used inside <RoadProvider>");
  return road;
}

/** which arm of the fork is lit — pointing at a road wins over the one taken */
export function useLitBranch(): BranchKey | null {
  const { chosen, hovered } = useRoad();
  return hovered ?? chosen;
}
