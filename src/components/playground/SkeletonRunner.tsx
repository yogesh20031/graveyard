"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tombstonePath } from "@/components/landing/scene/geometry";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type GameStatus = "ready" | "running" | "dead";

const BEST_STORAGE_KEY = "graveyard-runner-best";

// Physics in px and seconds. Jump apex ≈ 140px with ~0.68s of air time; at
// START_SPEED that clears ~205px of ground per jump against stones ≤48px wide.
const GRAVITY = 2400;
const JUMP_VELOCITY = 820;
const START_SPEED = 300;
const SPEED_RAMP = 9; // px/s gained per second of survival
const MAX_SPEED = 620;
const SCORE_DIVISOR = 12; // distance px per score point

// sprite boxes the hitbox math works against
const SKELETON_X = 64; // matches the left-16 class on the sprite
const SKELETON_W = 30;
const SKELETON_H = 64;
const STONE_W = 38;
const STONE_H = 58;
// four pooled stones recycle from left edge back past the right — no React
// churn per obstacle, just a transform write
const OBSTACLE_COUNT = 4;
const HITBOX_FORGIVENESS = 6; // px shaved off every collision edge

type Obstacle = {
  /** distance travelled left from the area's right edge (negative = not yet on screen) */
  x: number;
  scale: number;
};

type World = {
  y: number; // skeleton height above the ground
  vy: number;
  speed: number;
  distance: number;
  areaWidth: number;
  obstacles: Obstacle[];
};

const restingWorld = (): World => ({
  y: 0,
  vy: 0,
  speed: START_SPEED,
  distance: 0,
  areaWidth: 0,
  obstacles: [],
});

// Chrome-dino in the graveyard: the skeleton runs in place while pooled
// gravestones stream at him; Space / ArrowUp / tap to jump. Per-frame values
// live in refs and are written straight to the DOM inside one rAF loop — the
// imperative style writes are the game loop's API, not static styling; React
// state only changes on ready/running/dead transitions.
export function SkeletonRunner() {
  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const areaRef = useRef<HTMLDivElement>(null);
  const skeletonRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const obstacleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const world = useRef<World>(restingWorld());

  // hydrate the persisted best after mount — SSR renders 0 (same deferred
  // pattern as useAmbience's preference hydration)
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = Number(window.localStorage.getItem(BEST_STORAGE_KEY));
      if (Number.isFinite(stored) && stored > 0) setBest(Math.floor(stored));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const start = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;

    const areaWidth = area.clientWidth;
    const fresh = restingWorld();
    fresh.areaWidth = areaWidth;
    // stagger the pool beyond the right edge, with runway before the first
    let ahead = -(areaWidth * 0.65);
    fresh.obstacles = Array.from({ length: OBSTACLE_COUNT }, () => {
      const obstacle = { x: ahead, scale: 0.8 + Math.random() * 0.45 };
      ahead -= START_SPEED * (1 + Math.random() * 0.7);
      return obstacle;
    });
    world.current = fresh;

    // park every sprite before the first frame paints
    fresh.obstacles.forEach((obstacle, i) => {
      const el = obstacleRefs.current[i];
      if (el)
        el.style.transform = `translateX(${-obstacle.x}px) scale(${obstacle.scale})`;
    });
    if (skeletonRef.current) skeletonRef.current.style.transform = "";
    if (scoreRef.current) scoreRef.current.textContent = "0000";

    setScore(0);
    setStatus("running");
  }, []);

  const act = useCallback(() => {
    if (status === "running") {
      const w = world.current;
      if (w.y <= 0) w.vy = JUMP_VELOCITY; // no double jump — feet on the ground only
    } else {
      start();
    }
  }, [status, start]);

  // jump / start / restart from the keyboard; preventDefault keeps Space from
  // scrolling the page mid-game
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.code !== "ArrowUp") return;
      if (event.repeat) return;
      event.preventDefault();
      act();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [act]);

  // the loop — alive only while running
  useEffect(() => {
    if (status !== "running") return;

    const onResize = () => {
      if (areaRef.current)
        world.current.areaWidth = areaRef.current.clientWidth;
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let last = performance.now();

    const die = () => {
      const finalScore = Math.floor(world.current.distance / SCORE_DIVISOR);
      setScore(finalScore);
      setBest((current) => {
        if (finalScore <= current) return current;
        window.localStorage.setItem(BEST_STORAGE_KEY, String(finalScore));
        return finalScore;
      });
      setStatus("dead");
    };

    const step = (now: number) => {
      const w = world.current;
      // clamp dt so a background tab doesn't teleport stones through the runner
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      w.speed = Math.min(w.speed + SPEED_RAMP * dt, MAX_SPEED);
      w.distance += w.speed * dt;

      // skeleton: ballistic while airborne, planted otherwise
      if (w.y > 0 || w.vy > 0) {
        w.vy -= GRAVITY * dt;
        w.y = Math.max(w.y + w.vy * dt, 0);
        if (w.y === 0) w.vy = 0;
      }
      if (skeletonRef.current)
        skeletonRef.current.style.transform = `translateY(${-w.y}px)`;

      // stones march left; past the left edge they recycle beyond the rightmost
      let rightmost = Math.min(...w.obstacles.map((o) => o.x));
      for (let i = 0; i < w.obstacles.length; i++) {
        const obstacle = w.obstacles[i];
        obstacle.x += w.speed * dt;

        if (obstacle.x > w.areaWidth + STONE_W * obstacle.scale) {
          // gap scales with speed so the run stays jumpable as it ramps
          const gap = Math.max(w.speed * (0.85 + Math.random() * 0.75), 260);
          obstacle.x = rightmost - gap;
          obstacle.scale = 0.8 + Math.random() * 0.45;
          rightmost = obstacle.x;
        }

        const el = obstacleRefs.current[i];
        if (el)
          el.style.transform = `translateX(${-obstacle.x}px) scale(${obstacle.scale})`;

        // forgiving AABB — the sprites' ragged edges shouldn't kill on a graze
        const stoneLeft = w.areaWidth - obstacle.x + HITBOX_FORGIVENESS;
        const stoneRight =
          w.areaWidth - obstacle.x + STONE_W * obstacle.scale - HITBOX_FORGIVENESS;
        const stoneTop = STONE_H * obstacle.scale - HITBOX_FORGIVENESS;
        const overlapsX =
          SKELETON_X + HITBOX_FORGIVENESS < stoneRight &&
          SKELETON_X + SKELETON_W - HITBOX_FORGIVENESS > stoneLeft;
        if (overlapsX && w.y < stoneTop) {
          die();
          return; // no next frame — the run is over
        }
      }

      if (scoreRef.current)
        scoreRef.current.textContent = String(
          Math.floor(w.distance / SCORE_DIVISOR),
        ).padStart(4, "0");

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [status]);

  return (
    <div
      ref={areaRef}
      onPointerDown={act}
      className="night-sky relative h-96 w-full max-w-4xl touch-none overflow-hidden rounded-xs border border-foreground/15 select-none sm:h-112"
    >
      {/* scoreboard */}
      <div className="absolute top-4 right-5 z-10 flex gap-6 font-display text-sm tracking-etched text-foreground/70">
        {best > 0 && <span className="text-foreground/40">best {String(best).padStart(4, "0")}</span>}
        <span ref={scoreRef}>0000</span>
      </div>

      {/* the ground everything stands on */}
      <div className="absolute inset-x-0 bottom-0 h-12 border-t border-foreground/20 bg-surface" />

      {/* pooled gravestones, recycled by transform alone */}
      {Array.from({ length: OBSTACLE_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            obstacleRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="absolute bottom-12 left-full origin-bottom-left will-change-transform"
        >
          <ObstacleStone />
        </div>
      ))}

      {/* the runner */}
      <div
        ref={skeletonRef}
        aria-hidden="true"
        className="absolute bottom-12 left-16 will-change-transform"
      >
        <RunnerSkeleton running={status === "running"} />
      </div>

      {status !== "running" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/70 text-center">
          {status === "dead" ? (
            <>
              <p className="font-display text-2xl text-foreground sm:text-3xl">
                The graveyard claims another
              </p>
              <p className="font-display text-sm tracking-etched uppercase text-foreground/60">
                score {String(score).padStart(4, "0")} · best{" "}
                {String(best).padStart(4, "0")}
              </p>
              <Button onClick={start} skull>
                Rise again
              </Button>
            </>
          ) : (
            <>
              <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
                Press Space or tap to rise
              </p>
              <p className="max-w-xs font-display text-xs italic text-foreground/50">
                Jump the stones. The night only gets faster.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// The keeper's skeleton, mid-sprint. Legs scissor via the runner-stride
// keyframes only while the game runs.
function RunnerSkeleton({ running }: { running: boolean }) {
  return (
    <svg
      viewBox="0 0 30 64"
      width={SKELETON_W}
      height={SKELETON_H}
      className="overflow-visible"
    >
      {/* skull */}
      <circle cx={15} cy={9} r={8} className="fill-foreground/80" />
      <circle cx={12} cy={8} r={1.6} className="fill-background" />
      <circle cx={18} cy={8} r={1.6} className="fill-background" />
      <rect x={13} y={13} width={4} height={3} className="fill-background/60" />
      {/* spine and ribs */}
      <rect x={13.5} y={17} width={3} height={18} rx={1.5} className="fill-foreground/70" />
      <rect x={9} y={21} width={12} height={2.4} rx={1.2} className="fill-foreground/60" />
      <rect x={10} y={26} width={10} height={2.4} rx={1.2} className="fill-foreground/60" />
      <rect x={11} y={31} width={8} height={2.4} rx={1.2} className="fill-foreground/60" />
      {/* arms pumping */}
      <rect
        x={7}
        y={19}
        width={2.6}
        height={13}
        rx={1.3}
        transform="rotate(28 8.3 19)"
        className="fill-foreground/60"
      />
      <rect
        x={21}
        y={19}
        width={2.6}
        height={13}
        rx={1.3}
        transform="rotate(-24 22.3 19)"
        className="fill-foreground/60"
      />
      {/* pelvis */}
      <rect x={11} y={36} width={8} height={4} rx={2} className="fill-foreground/70" />
      {/* legs */}
      <rect
        x={12}
        y={40}
        width={3}
        height={22}
        rx={1.5}
        className={cn("fill-foreground/70", running && "runner-leg-a")}
      />
      <rect
        x={16}
        y={40}
        width={3}
        height={22}
        rx={1.5}
        className={cn("fill-foreground/70", running && "runner-leg-b")}
      />
    </svg>
  );
}

// One gravestone in the runner's way — the same arched silhouette the
// graveyard plants everywhere, via the shared tombstonePath.
function ObstacleStone() {
  return (
    <svg viewBox="0 0 38 58" width={STONE_W} height={STONE_H}>
      <path
        d={tombstonePath({ x: 1, width: 36, height: 54, fillClass: "" }, 57)}
        className="fill-foreground/30"
      />
      <rect x={8} y={30} width={22} height={3} rx={1.5} className="fill-background/40" />
      <rect x={11} y={37} width={16} height={3} rx={1.5} className="fill-background/40" />
      {/* grass at the base */}
      <path d="M2 58 l3 -8 2 8 3 -6 2 6 Z" className="fill-foreground/20" />
      <path d="M27 58 l3 -7 2 7 3 -5 2 5 Z" className="fill-foreground/20" />
    </svg>
  );
}
