import { cn } from "@/lib/cn";

type PlayIconProps = {
  className?: string;
};

export function PlayIcon({ className }: PlayIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4", className)}
    >
      <path d="M7 4.5 19.5 12 7 19.5Z" />
    </svg>
  );
}
