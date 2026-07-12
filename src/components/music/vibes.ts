// Vibe registry. Each vibe is a recipe the ambience engine (useAmbience)
// renders live with the Web Audio API — no audio files, no licensing,
// nothing downloaded. Adding a vibe means one entry here; the engine
// handles the rest. Mirrors the themes.ts registry pattern so a future
// "user picks their own vibes" phase follows the same shape.

export type VibeId = "midnight" | "haunting" | "storm";

export type DroneRecipe = {
  /** oscillator frequencies in Hz — close pairs beat against each other */
  freqs: number[];
  type: OscillatorType;
  level: number;
  /** slow amplitude wobble, in Hz (well below 1) */
  lfoHz: number;
  /** how much of the level the wobble moves, 0–1 */
  lfoDepth: number;
};

export type WindRecipe = {
  level: number;
  /** filter centre the wind breathes around, in Hz */
  filterBase: number;
  /** how far a gust pushes the filter, in Hz */
  filterSweep: number;
  /** gust cycle speed, in Hz */
  gustHz: number;
};

export type ChimeRecipe = {
  level: number;
  /** pitches a chime may ring at, in Hz */
  notes: number[];
  minGapS: number;
  maxGapS: number;
  decayS: number;
};

export type RumbleRecipe = {
  level: number;
  /** thunder swell cycle speed, in Hz */
  swellHz: number;
};

export type VibeDefinition = {
  id: VibeId;
  label: string;
  description: string;
  drone: DroneRecipe;
  wind: WindRecipe;
  chime: ChimeRecipe | null;
  rumble: RumbleRecipe | null;
};

export const VIBES: Record<VibeId, VibeDefinition> = {
  midnight: {
    id: "midnight",
    label: "Midnight",
    description: "Calm as the grave — deep drone, soft wind, distant bells",
    // A1 / A2 / E3: a warm, settled open fifth
    drone: { freqs: [55, 110, 165], type: "triangle", level: 0.14, lfoHz: 0.05, lfoDepth: 0.35 },
    wind: { level: 0.09, filterBase: 400, filterSweep: 250, gustHz: 0.06 },
    // A4 / C5 / D5 / E5 — gentle minor colours, rung rarely
    chime: { level: 0.05, notes: [440, 523.25, 587.33, 659.25], minGapS: 9, maxGapS: 22, decayS: 6 },
    rumble: null,
  },
  haunting: {
    id: "haunting",
    label: "Haunting",
    description: "Something walks here — beating drones, breathy air",
    // E2 against E2 + ~2Hz: the beat is the whole point
    drone: { freqs: [82.4, 84.5, 123.5], type: "sine", level: 0.15, lfoHz: 0.03, lfoDepth: 0.5 },
    wind: { level: 0.11, filterBase: 700, filterSweep: 500, gustHz: 0.045 },
    // A#4 / B4 / D#5 — uneasy intervals, very rare
    chime: { level: 0.04, notes: [466.16, 493.88, 622.25], minGapS: 14, maxGapS: 30, decayS: 8 },
    rumble: null,
  },
  storm: {
    id: "storm",
    label: "Storm",
    description: "The night turns — gusting wind, thunder far off",
    drone: { freqs: [49, 98], type: "triangle", level: 0.09, lfoHz: 0.08, lfoDepth: 0.3 },
    wind: { level: 0.2, filterBase: 300, filterSweep: 550, gustHz: 0.11 },
    chime: null,
    rumble: { level: 0.16, swellHz: 0.05 },
  },
};

export const VIBE_ORDER: VibeId[] = ["midnight", "haunting", "storm"];

export const DEFAULT_VIBE: VibeId = "midnight";

export function isVibeId(value: string): value is VibeId {
  return value in VIBES;
}
