"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ScaryLoader } from "./ScaryLoader";
import { SkeletonRunner } from "./SkeletonRunner";

// The dead don't open the door right away. Three seconds of darkness before
// the playground appears — deliberate theatre, not real loading, which is why
// it plays on every visit instead of being remembered.
const GATE_DELAY_MS = 3000;

export function PlaygroundGate() {
  const [phase, setPhase] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase("ready"), GATE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (phase === "loading") {
    return <ScaryLoader />;
  }

  return (
    <Reveal className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
          The playground
        </p>
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">
          Outrun the Stones
        </h1>
        <p className="font-display italic text-foreground/50">
          The keeper&apos;s skeleton is late for his own funeral.
        </p>
      </div>
      <SkeletonRunner />
    </Reveal>
  );
}
