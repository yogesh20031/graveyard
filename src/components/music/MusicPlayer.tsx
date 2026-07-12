"use client";

import { useState } from "react";
import { NoteIcon } from "@/components/icons/NoteIcon";
import { PauseIcon } from "@/components/icons/PauseIcon";
import { PlayIcon } from "@/components/icons/PlayIcon";
import { Button } from "@/components/ui/Button";
import { useAmbience } from "@/hooks/useAmbience";
import { cn } from "@/lib/cn";
import { VIBES, VIBE_ORDER } from "./vibes";
import type { VibeId } from "./vibes";

// The music lantern: pinned bottom-right for the whole journey. Collapsed
// it's a round stone that glows amber while the ambience plays; opened it's
// a small slab with play/rest, the three vibes, and a volume slider. All
// sound is conjured live in the browser (see useAmbience) — nothing plays
// until the visitor asks.
export function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const { playing, toggle, vibe, setVibe, volume, setVolume } = useAmbience();

  return (
    <div
      data-playing={playing}
      className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3"
    >
      <div
        inert={!open}
        className={cn(
          "w-72 p-5 flex flex-col gap-4 rounded-sm border border-foreground/15 bg-surface/90 backdrop-blur-sm origin-bottom-right transition-[opacity,transform] duration-300 motion-reduce:transition-none",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <div>
          <p className="font-display text-xs tracking-etched uppercase text-accent-bright">
            The music
          </p>
          <p className="mt-1 text-xs italic text-foreground/45">
            Conjured live in your browser — nothing plays until you ask.
          </p>
        </div>

        <ul className="flex flex-col gap-1.5" aria-label="Vibes">
          {VIBE_ORDER.map((id) => (
            <VibeOption
              key={id}
              id={id}
              active={vibe === id}
              onPick={() => setVibe(id)}
            />
          ))}
        </ul>

        <label className="flex items-center gap-3 text-xs text-foreground/50">
          <span className="font-display tracking-etched uppercase">Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => setVolume(event.target.valueAsNumber)}
            aria-label="Volume"
            className="h-1 w-full cursor-pointer accent-accent"
          />
        </label>

        <Button onClick={toggle} variant={playing ? "outline" : "solid"}>
          {playing ? <PauseIcon /> : <PlayIcon />}
          {playing ? "Rest" : "Play"}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Close the music lantern" : "Open the music lantern"}
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer",
          playing
            ? "border-accent/60 bg-surface text-accent-bright shadow-glow"
            : "border-foreground/20 bg-surface/90 text-foreground/60 hover:border-accent/50 hover:text-accent",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        )}
      >
        {playing && (
          <span
            aria-hidden="true"
            className="lantern-glow absolute inset-0 rounded-full bg-accent/15"
          />
        )}
        <NoteIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

function VibeOption({
  id,
  active,
  onPick,
}: {
  id: VibeId;
  active: boolean;
  onPick: () => void;
}) {
  const definition = VIBES[id];
  return (
    <li>
      <button
        type="button"
        onClick={onPick}
        aria-pressed={active}
        className={cn(
          "w-full px-3 py-2 flex flex-col gap-0.5 rounded-xs border text-left transition-colors duration-300 cursor-pointer",
          active
            ? "border-accent/50 bg-accent/10 text-accent-bright"
            : "border-foreground/10 text-foreground/60 hover:border-accent/30 hover:text-foreground",
        )}
      >
        <span className="font-display text-sm tracking-etched uppercase">
          {definition.label}
        </span>
        <span className="text-xs text-foreground/40">
          {definition.description}
        </span>
      </button>
    </li>
  );
}
