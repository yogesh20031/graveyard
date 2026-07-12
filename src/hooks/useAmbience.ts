"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChimeRecipe, VibeDefinition, VibeId } from "@/components/music/vibes";
import { DEFAULT_VIBE, VIBES, isVibeId } from "@/components/music/vibes";

// The ambience engine: renders a vibe recipe (see music/vibes.ts) as a live
// Web Audio graph — wind is filtered noise under slow LFOs, drones are
// detuned low oscillators, chimes are scheduled one-shot decays, thunder is
// swelling lowpassed noise. The AudioContext is only created on the first
// play click: browsers gate audio behind a user gesture, and a context born
// earlier would arrive suspended anyway.

const VIBE_STORAGE_KEY = "graveyard-vibe";
const VOLUME_STORAGE_KEY = "graveyard-volume";

type EngineBranch = {
  gain: GainNode;
  /** stops sources, clears chime timers, disconnects everything */
  stop: () => void;
};

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  branch: EngineBranch | null;
  /** pending pause-suspend, cleared if play resumes first */
  suspendTimer: number | null;
};

export function useAmbience() {
  const [playing, setPlaying] = useState(false);
  const [vibe, setVibeState] = useState<VibeId>(DEFAULT_VIBE);
  const [volume, setVolumeState] = useState(0.7);
  const engineRef = useRef<Engine | null>(null);

  // hydrate persisted preferences after mount — SSR renders the defaults.
  // Deferred a frame so hydration completes first (and to satisfy
  // react-hooks/set-state-in-effect: no synchronous cascading render).
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedVibe = window.localStorage.getItem(VIBE_STORAGE_KEY);
      if (storedVibe && isVibeId(storedVibe)) setVibeState(storedVibe);
      const storedVolume = Number(window.localStorage.getItem(VOLUME_STORAGE_KEY));
      if (Number.isFinite(storedVolume) && storedVolume > 0 && storedVolume <= 1) {
        setVolumeState(storedVolume);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // tear the whole graph down if the player ever unmounts
  useEffect(() => {
    return () => {
      const engine = engineRef.current;
      if (!engine) return;
      if (engine.suspendTimer !== null) window.clearTimeout(engine.suspendTimer);
      engine.branch?.stop();
      void engine.ctx.close();
      engineRef.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    if (!engineRef.current) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      engineRef.current = { ctx, master, branch: null, suspendTimer: null };
    }
    const engine = engineRef.current;
    const now = engine.ctx.currentTime;

    if (playing) {
      // fade to silence, then suspend so the graph costs nothing while resting
      engine.master.gain.cancelScheduledValues(now);
      engine.master.gain.setTargetAtTime(0, now, 0.15);
      engine.suspendTimer = window.setTimeout(() => {
        engine.suspendTimer = null;
        void engine.ctx.suspend();
      }, 600);
      setPlaying(false);
      return;
    }

    if (engine.suspendTimer !== null) {
      window.clearTimeout(engine.suspendTimer);
      engine.suspendTimer = null;
    }
    void engine.ctx.resume();
    if (!engine.branch) {
      engine.branch = buildBranch(engine.ctx, VIBES[vibe], engine.master);
    }
    engine.master.gain.cancelScheduledValues(now);
    engine.master.gain.setTargetAtTime(volume, now, 0.3);
    setPlaying(true);
  }, [playing, vibe, volume]);

  const setVibe = useCallback(
    (next: VibeId) => {
      setVibeState(next);
      window.localStorage.setItem(VIBE_STORAGE_KEY, next);

      const engine = engineRef.current;
      if (!engine?.branch) return;
      const old = engine.branch;
      if (playing) {
        // crossfade: the old soundscape sinks while the new one rises
        old.gain.gain.setTargetAtTime(0, engine.ctx.currentTime, 0.5);
        window.setTimeout(() => old.stop(), 2500);
        engine.branch = buildBranch(engine.ctx, VIBES[next], engine.master);
      } else {
        // paused with a stale branch — rebuild lazily on the next play
        old.stop();
        engine.branch = null;
      }
    },
    [playing],
  );

  const setVolume = useCallback(
    (next: number) => {
      setVolumeState(next);
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(next));
      const engine = engineRef.current;
      if (engine && playing) {
        engine.master.gain.setTargetAtTime(next, engine.ctx.currentTime, 0.1);
      }
    },
    [playing],
  );

  return { playing, toggle, vibe, setVibe, volume, setVolume };
}

// --------------------------------------------------------------------------
// Graph builders — pure Web Audio, used only by the hook above.
// --------------------------------------------------------------------------

function buildBranch(
  ctx: AudioContext,
  recipe: VibeDefinition,
  destination: AudioNode,
): EngineBranch {
  const gain = ctx.createGain();
  // rise from silence so vibe switches never click
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.setTargetAtTime(1, ctx.currentTime, 0.5);
  gain.connect(destination);

  const stops: (() => void)[] = [];
  const noise = makeNoiseBuffer(ctx);

  stops.push(buildWind(ctx, recipe, gain, noise));
  stops.push(buildDrone(ctx, recipe, gain));
  if (recipe.chime) stops.push(buildChimes(ctx, recipe.chime, gain));
  if (recipe.rumble) stops.push(buildRumble(ctx, recipe, gain, noise));

  return {
    gain,
    stop: () => {
      for (const stop of stops) stop();
      gain.disconnect();
    },
  };
}

/** two seconds of looped white noise — the raw material for wind and thunder */
function makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function buildWind(
  ctx: AudioContext,
  recipe: VibeDefinition,
  out: AudioNode,
  noise: AudioBuffer,
): () => void {
  const { level, filterBase, filterSweep, gustHz } = recipe.wind;

  const source = ctx.createBufferSource();
  source.buffer = noise;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = filterBase;
  filter.Q.value = 0.9;

  const windGain = ctx.createGain();
  windGain.gain.value = level;

  // gusts: one slow LFO breathes the filter open, a second (slightly
  // offset rate) swells the loudness — never in sync, never mechanical
  const filterLfo = ctx.createOscillator();
  filterLfo.frequency.value = gustHz;
  const filterLfoGain = ctx.createGain();
  filterLfoGain.gain.value = filterSweep;
  filterLfo.connect(filterLfoGain).connect(filter.frequency);

  const ampLfo = ctx.createOscillator();
  ampLfo.frequency.value = gustHz * 1.37;
  const ampLfoGain = ctx.createGain();
  ampLfoGain.gain.value = level * 0.45;
  ampLfo.connect(ampLfoGain).connect(windGain.gain);

  source.connect(filter).connect(windGain).connect(out);
  source.start();
  filterLfo.start();
  ampLfo.start();

  return () => {
    source.stop();
    filterLfo.stop();
    ampLfo.stop();
    windGain.disconnect();
  };
}

function buildDrone(
  ctx: AudioContext,
  recipe: VibeDefinition,
  out: AudioNode,
): () => void {
  const { freqs, type, level, lfoHz, lfoDepth } = recipe.drone;

  const droneGain = ctx.createGain();
  droneGain.gain.value = level;
  droneGain.connect(out);

  const oscillators = freqs.map((freq) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 1 / freqs.length;
    osc.connect(oscGain).connect(droneGain);
    osc.start();
    return osc;
  });

  const lfo = ctx.createOscillator();
  lfo.frequency.value = lfoHz;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = level * lfoDepth;
  lfo.connect(lfoGain).connect(droneGain.gain);
  lfo.start();

  return () => {
    for (const osc of oscillators) osc.stop();
    lfo.stop();
    droneGain.disconnect();
  };
}

function buildChimes(
  ctx: AudioContext,
  recipe: ChimeRecipe,
  out: AudioNode,
): () => void {
  let timer: number | null = null;
  let stopped = false;

  const ring = () => {
    const freq = recipe.notes[Math.floor(Math.random() * recipe.notes.length)];
    const now = ctx.currentTime;

    // fundamental + a faintly sharp octave partial = a far-off bell
    for (const [mult, share] of [
      [1, 1],
      [2.01, 0.35],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq * mult;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(recipe.level * share, now + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0001, now + recipe.decayS);
      osc.connect(env).connect(out);
      osc.start(now);
      osc.stop(now + recipe.decayS + 0.1);
    }
  };

  const schedule = () => {
    const gap =
      recipe.minGapS + Math.random() * (recipe.maxGapS - recipe.minGapS);
    timer = window.setTimeout(() => {
      if (stopped) return;
      // JS timers keep running while the context is suspended — skip the
      // ring then, or every missed chime would pile up and toll at once
      if (ctx.state === "running") ring();
      schedule();
    }, gap * 1000);
  };
  schedule();

  return () => {
    stopped = true;
    if (timer !== null) window.clearTimeout(timer);
  };
}

function buildRumble(
  ctx: AudioContext,
  recipe: VibeDefinition,
  out: AudioNode,
  noise: AudioBuffer,
): () => void {
  if (!recipe.rumble) return () => {};
  const { level, swellHz } = recipe.rumble;

  const source = ctx.createBufferSource();
  source.buffer = noise;
  source.loop = true;
  // slowed noise reads as a deeper, heavier sky
  source.playbackRate.value = 0.4;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 90;

  const rumbleGain = ctx.createGain();
  rumbleGain.gain.value = level * 0.35;

  const swell = ctx.createOscillator();
  swell.frequency.value = swellHz;
  const swellGain = ctx.createGain();
  swellGain.gain.value = level * 0.65;
  swell.connect(swellGain).connect(rumbleGain.gain);

  source.connect(filter).connect(rumbleGain).connect(out);
  source.start();
  swell.start();

  return () => {
    source.stop();
    swell.stop();
    rumbleGain.disconnect();
  };
}
