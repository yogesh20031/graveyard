import type { ReactNode } from "react";
import { SkullIcon } from "@/components/icons/SkullIcon";

type BoulderSlabProps = {
  /** the etched line under the skull */
  overline: string;
  children: ReactNode;
};

// Info carved into a big roadside boulder — an irregular lump of rock rather
// than a shaped monument. The asymmetric radii are a genuine one-off; they're
// exactly what makes it read as a boulder instead of a card.
export function BoulderSlab({ overline, children }: BoulderSlabProps) {
  return (
    <div className="relative p-6 sm:p-8 rotate-1 rounded-[45%_55%_52%_48%/40%_44%_56%_60%] border-2 border-foreground/15 bg-surface/80">
      <CrackLines />
      <div className="relative">
        <SkullIcon className="mx-auto mb-2.5 h-5 w-5 text-accent-bright/70" />
        <p className="mb-4 text-center font-display text-xs tracking-etched uppercase text-foreground/40">
          {overline}
        </p>
        <div className="flex flex-col gap-3 text-sm leading-6 text-foreground/70 sm:text-base sm:leading-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// weathering across the rock face, in the same carved language as the
// monument's crack
function CrackLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 300"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g className="stroke-foreground/10" fill="none" strokeWidth={2}>
        <path d="M52 12 l12 34 -8 24 14 30" />
        <path d="M356 286 l-12 -42 8 -20 -10 -26" />
        <path d="M330 30 l-14 18 6 16" />
      </g>
    </svg>
  );
}
