import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  className?: string;
  children: ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xs border border-foreground/15 bg-surface/60 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
