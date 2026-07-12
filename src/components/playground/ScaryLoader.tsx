"use client";

import { useEffect, useState } from "react";
import { FogLayer } from "@/components/landing/scene/FogLayer";
import { WatchingEyes } from "@/components/journey/WatchingEyes";

const OMENS = [
  "Disturbing the dead…",
  "Unearthing the bones…",
  "The dead want to play.",
];

// The 3-second dark before the playground: a dying lantern, fog, eyes in the
// corners, and one omen per second. All the moving parts reuse the scene's
// existing flicker/fog/eye classes, so reduced motion automatically stills
// them into a calm static frame.
export function ScaryLoader() {
  const [omen, setOmen] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(
      () => setOmen((current) => Math.min(current + 1, OMENS.length - 1)),
      1000,
    );
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-label="Entering the playground"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-background"
    >
      <FogLayer />
      <WatchingEyes />

      {/* the only light: a lantern about to give out */}
      <span
        aria-hidden="true"
        className="h-3 w-3 rounded-full bg-accent shadow-glow lantern-flicker"
      />

      <p
        key={omen}
        className="font-display text-sm tracking-etched uppercase text-foreground/60"
      >
        {OMENS[omen]}
      </p>
    </div>
  );
}
