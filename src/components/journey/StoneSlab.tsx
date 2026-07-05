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
    <div className="p-6 sm:p-8 -rotate-1 rounded-t-[3rem] border-2 border-foreground/15 bg-surface/80">
      <SkullIcon className="mx-auto mb-3 h-6 w-6 text-accent-bright/70" />
      <p className="mb-5 text-center font-display text-xs tracking-etched uppercase text-foreground/40">
        {overline}
      </p>
      <div className="flex flex-col gap-4 text-sm leading-6 text-foreground/70 sm:text-base sm:leading-7">
        {children}
      </div>
    </div>
  );
}
