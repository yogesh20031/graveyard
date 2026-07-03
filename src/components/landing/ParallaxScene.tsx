"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { FogLayer } from "./scene/FogLayer";
import { ForegroundLayer } from "./scene/ForegroundLayer";
import { HillsLayer } from "./scene/HillsLayer";
import { SkyLayer } from "./scene/SkyLayer";

// Scroll-linked depth: as the hero scrolls away, near layers move faster
// than far ones and the foreground grows — reads as walking toward the gate.
// MotionValues can only be applied through the style prop; that's the motion
// API, not static styling.
export function ParallaxScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  const skyY = useTransform(progress, [0, 1], [0, 60]);
  const hillsY = useTransform(progress, [0, 1], [0, -45]);
  const foregroundY = useTransform(progress, [0, 1], [0, 50]);
  const foregroundScale = useTransform(progress, [0, 1], [1, 1.12]);
  const fogOpacity = useTransform(progress, [0, 1], [1, 0.25]);
  const fogScaleX = useTransform(progress, [0, 1], [1, 1.15]);

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0">
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
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <motion.div style={{ y: skyY }} className="absolute inset-0">
        <SkyLayer />
      </motion.div>
      <motion.div style={{ y: hillsY }} className="absolute inset-0">
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
    </div>
  );
}

function StaticLayer({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-0">{children}</div>;
}
