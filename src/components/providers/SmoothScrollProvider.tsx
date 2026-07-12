"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

// Lenis gives the wheel its gliding, walking-pace feel and makes the
// #journey anchor links scroll smoothly (anchors: true). Users who ask for
// reduced motion keep native scrolling.
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const prefersReducedMotion = useHydratedReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ anchors: true }}>
      {children}
    </ReactLenis>
  );
}
