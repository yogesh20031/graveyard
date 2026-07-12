"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { FogLayer } from "./scene/FogLayer";
import { ForegroundLayer } from "./scene/ForegroundLayer";
import { HillsLayer } from "./scene/HillsLayer";
import { SkyLayer } from "./scene/SkyLayer";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

type ParallaxSceneProps = {
  children: ReactNode;
};

// The walk into the graveyard. The hero pins to the viewport while scroll
// progress carries you forward: the foreground swells until the gate
// pillars sweep past the edges, the copy falls away behind you, and fog
// closes over everything before the page deposits you inside at #about.
// MotionValues can only be applied through the style prop; that's the
// motion API, not static styling.
export function ParallaxScene({ children }: ParallaxSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  const skyY = useTransform(progress, [0, 1], [0, 80]);
  const hillsY = useTransform(progress, [0, 1], [0, -140]);
  const hillsScale = useTransform(progress, [0, 1], [1, 1.35]);
  const foregroundY = useTransform(progress, [0, 1], [0, 90]);
  // past ~2x the gate opening is wider than the viewport — you're through it
  const foregroundScale = useTransform(progress, [0, 1], [1, 2.6]);
  const fogOpacity = useTransform(progress, [0, 0.5, 1], [1, 0.4, 0.4]);
  const fogScaleX = useTransform(progress, [0, 1], [1, 1.3]);
  const contentOpacity = useTransform(progress, [0, 0.18, 0.38], [1, 1, 0]);
  const contentY = useTransform(progress, [0, 0.38], [0, -60]);
  // caps below 1 so the gate silhouettes still ghost through the fog —
  // the hand-off to the next section is never a blank screen
  const fogWallOpacity = useTransform(progress, [0.6, 0.92], [0, 0.97]);

  if (prefersReducedMotion) {
    return (
      // useScroll() above tracks this ref whichever branch renders; leaving it
      // unattached here makes motion warn that the target never hydrated
      <div
        ref={containerRef}
        className="relative min-h-dvh overflow-hidden night-sky"
      >
        <StaticLayer>
          <SkyLayer />
        </StaticLayer>
        <StaticLayer>
          <HillsLayer />
        </StaticLayer>
        <StaticLayer>
          <ForegroundLayer />
        </StaticLayer>
        <StaticLayer>
          <FogLayer />
        </StaticLayer>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  }

  return (
    // one-off arbitrary height: the length of the walk to the gate
    <div ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-dvh overflow-hidden night-sky">
        <motion.div style={{ y: skyY }} className="absolute inset-0">
          <SkyLayer />
        </motion.div>
        <motion.div
          style={{ y: hillsY, scale: hillsScale }}
          className="absolute inset-0 origin-bottom"
        >
          <HillsLayer />
        </motion.div>
        <motion.div
          style={{ y: foregroundY, scale: foregroundScale }}
          className="absolute inset-0 origin-bottom"
        >
          <ForegroundLayer />
        </motion.div>
        <motion.div
          style={{ opacity: fogOpacity, scaleX: fogScaleX }}
          className="absolute inset-0"
        >
          <FogLayer />
        </motion.div>
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          {children}
        </motion.div>
        <motion.div
          style={{ opacity: fogWallOpacity }}
          className="fog-wall pointer-events-none absolute inset-0 z-20"
        />
      </div>
    </div>
  );
}

function StaticLayer({ children }: { children: ReactNode }) {
  return <div className="absolute inset-0">{children}</div>;
}
