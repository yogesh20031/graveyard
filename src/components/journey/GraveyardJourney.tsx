"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { aboutStations } from "./AboutKeeper";
import { Crossroads } from "./Crossroads";
import type { BranchKey } from "./Crossroads";
import { GraveyardFloor } from "./GraveyardFloor";
import { WalkStage } from "./JourneyWalk";
import type { WalkStationConfig } from "./JourneyWalk";
import { Epilogue, lessonsStations } from "./LessonsUnearthed";
import { OtherRoad } from "./OtherRoad";
import { trialsStations } from "./TrialsExperience";

// namespace each group's keys — several stations share keys ("arrival",
// "closing") across sections, and the flat walk needs them unique
const prefixed = (prefix: string, stations: WalkStationConfig[]) =>
  stations.map((station) => ({ ...station, key: `${prefix}-${station.key}` }));

type PendingScroll =
  | { kind: "hold"; containerTop: number; fraction: number }
  | { kind: "goto"; key: string };

// The whole thing is one continuous walk. About's graves stream past, then the
// road forks: only the chosen road is walked — the other's content isn't
// rendered — and at the chosen road's end the walker is offered the road not
// taken, which swaps the branch and carries them back to its start. The gate
// (epilogue) closes the walk either way.
export function GraveyardJourney() {
  const [chosen, setChosen] = useState<BranchKey | null>(null);
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();
  const pendingScroll = useRef<PendingScroll | null>(null);

  // the road being walked below the fork — Trials until the walker says otherwise
  const walked: BranchKey = chosen ?? "trials";

  const handleChoose = useCallback(
    (next: BranchKey) => {
      // swapping the road changes the track length below the fork; hold the
      // walker exactly where they stand in the fork's slice
      if (next !== walked) {
        pendingScroll.current = grabForkAnchor() ?? null;
      }
      setChosen(next);
    },
    [walked],
  );

  const handleWalkOther = useCallback(() => {
    const next: BranchKey = walked === "trials" ? "lessons" : "trials";
    pendingScroll.current = { kind: "goto", key: `${next}-arrival` };
    setChosen(next);
  }, [walked]);

  // apply the scroll once the swapped stations are in the DOM
  useLayoutEffect(() => {
    const pending = pendingScroll.current;
    if (!pending) return;
    pendingScroll.current = null;

    const key = pending.kind === "goto" ? pending.key : "journey-junction";
    const target = document.querySelector<HTMLElement>(
      `[data-station-key="${key}"]`,
    );
    if (!target?.parentElement) return;

    // reduced motion lays stations out in normal flow — native anchoring works
    if (prefersReducedMotion) {
      if (pending.kind === "goto") {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    const siblings = Array.from(target.parentElement.children);
    const index = siblings.indexOf(target);
    const count = siblings.length;
    const rect = target.getBoundingClientRect();
    // the scroll distance progress runs over: the track minus one pinned viewport
    const range = count * rect.height - window.innerHeight;

    if (pending.kind === "hold") {
      const top = pending.containerTop + ((index + pending.fraction) / count) * range;
      // instant — the walker hasn't moved, only the road ahead changed
      if (lenis) lenis.scrollTo(top, { immediate: true });
      else window.scrollTo({ top });
    } else {
      const containerTop = rect.top + window.scrollY - index * rect.height;
      // 0.45 into the slice ≈ the station's reading zone
      const top = containerTop + ((index + 0.45) / count) * range;
      if (lenis) lenis.scrollTo(top);
      else window.scrollTo({ top, behavior: "smooth" });
    }
  }, [chosen, lenis, prefersReducedMotion]);

  const stations = useMemo<WalkStationConfig[]>(() => {
    const branchStations =
      walked === "trials" ? trialsStations : lessonsStations;

    return [
      ...prefixed("about", aboutStations),
      {
        key: "journey-junction",
        align: "center",
        wide: true,
        enter: "road",
        node: <Crossroads chosen={chosen} onChoose={handleChoose} />,
      },
      ...prefixed(walked, branchStations),
      {
        key: "journey-other-road",
        align: "center",
        enter: "road",
        node: <OtherRoad walked={walked} onWalkOther={handleWalkOther} />,
      },
      {
        key: "journey-epilogue",
        align: "center",
        enter: "road",
        node: <Epilogue />,
      },
    ];
  }, [chosen, walked, handleChoose, handleWalkOther]);

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

// Where does the walker stand inside the fork's scroll slice right now?
// Captured before a branch swap so the same spot can be restored against the
// new track length. Track geometry: stations.length equal track divs, with
// progress running over the track minus one pinned viewport.
function grabForkAnchor(): PendingScroll | undefined {
  const el = document.querySelector<HTMLElement>(
    '[data-station-key="journey-junction"]',
  );
  if (!el?.parentElement) return undefined;

  const siblings = Array.from(el.parentElement.children);
  const index = siblings.indexOf(el);
  const count = siblings.length;
  const rect = el.getBoundingClientRect();
  const containerTop = rect.top + window.scrollY - index * rect.height;
  const range = count * rect.height - window.innerHeight;
  const progress = (window.scrollY - containerTop) / range;

  return {
    kind: "hold",
    containerTop,
    fraction: progress * count - index,
  };
}
