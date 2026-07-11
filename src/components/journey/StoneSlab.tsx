import type { ReactNode } from "react";
import { SkullIcon } from "@/components/icons/SkullIcon";

type StoneSlabProps = {
  /** the etched line under the skull — dates, epitaph, "edit me" */
  overline: string;
  children: ReactNode;
};

// A leaning arched monument with an inscription — the journey's way of
// presenting a block of information as part of the graveyard.
export function StoneSlab({ overline, children }: StoneSlabProps) {
  return (
    <div className="p-5 sm:p-6 -rotate-1 rounded-t-[3rem] border-2 border-foreground/15 bg-surface/80">
      <SkullIcon className="mx-auto mb-2.5 h-5 w-5 text-accent-bright/70" />
      <p className="mb-4 text-center font-display text-xs tracking-etched uppercase text-foreground/40">
        {overline}
      </p>
      <div className="flex flex-col gap-3 text-sm leading-6 text-foreground/70 sm:text-base sm:leading-6">
        {children}
      </div>
    </div>
  );
}
