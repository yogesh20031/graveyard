"use client";

import { useMemo, useState } from "react";
import { aboutStations } from "./AboutKeeper";
import { Crossroads } from "./Crossroads";
import type { BranchKey } from "./Crossroads";
import { GraveyardFloor } from "./GraveyardFloor";
import { WalkStage } from "./JourneyWalk";
import type { WalkStationConfig } from "./JourneyWalk";
import { Epilogue, lessonsStations } from "./LessonsUnearthed";
import { trialsStations } from "./TrialsExperience";

// namespace each group's keys — several stations share keys ("arrival",
// "closing") across sections, and the flat walk needs them unique
const prefixed = (prefix: string, stations: WalkStationConfig[]) =>
  stations.map((station) => ({ ...station, key: `${prefix}-${station.key}` }));

// The whole thing is one continuous walk. About's graves stream past, then the
// fork appears inline; picking a road only decides which section you walk
// first — both are always walked — so the scroll never stops, resets, or asks
// twice. The choice reorders the graves *below* the fork, so nothing on screen
// jumps.
export function GraveyardJourney() {
  const [firstRoad, setFirstRoad] = useState<BranchKey | null>(null);

  const stations = useMemo<WalkStationConfig[]>(() => {
    const branches =
      firstRoad === "lessons"
        ? [
            ...prefixed("lessons", lessonsStations),
            ...prefixed("trials", trialsStations),
          ]
        : [
            ...prefixed("trials", trialsStations),
            ...prefixed("lessons", lessonsStations),
          ];

    return [
      ...prefixed("about", aboutStations),
      {
        key: "journey-junction",
        align: "center",
        enter: "road",
        node: <Crossroads chosen={firstRoad} onChoose={setFirstRoad} />,
      },
      ...branches,
      {
        key: "journey-epilogue",
        align: "center",
        enter: "road",
        node: <Epilogue />,
      },
    ];
  }, [firstRoad]);

  return (
    <div id="about" className="relative scroll-mt-12">
      <WalkStage stations={stations} />
      <GraveyardFloor />
      <div className="bg-surface px-6 py-10 text-center text-sm text-foreground/40">
        You walked the whole path. © 2026 Yogesh Khanal — the music haunts a
        later phase.
      </div>
    </div>
  );
}
