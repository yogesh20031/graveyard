import { cn } from "@/lib/cn";

// Pairs of amber eyes in the dark edges of the section, blinking on long
// staggered cycles — never in unison, never explained.
export function WatchingEyes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <EyePair className="watching-eye top-40 left-10" />
      <EyePair className="watching-eye-delayed top-72 right-12" />
      <EyePair className="watching-eye-slow bottom-32 left-1/4" />
      <EyePair className="watching-eye bottom-52 right-1/5" />
    </div>
  );
}

function EyePair({ className }: { className: string }) {
  return (
    <span className={cn("absolute flex gap-1.5", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-accent-bright/60" />
      <span className="h-1.5 w-1.5 rounded-full bg-accent-bright/60" />
    </span>
  );
}
