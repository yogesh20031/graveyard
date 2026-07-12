import { cn } from "@/lib/cn";

type PauseIconProps = {
  className?: string;
};

export function PauseIcon({ className }: PauseIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4", className)}
    >
      <path d="M6.5 4.5h4v15h-4Zm7 0h4v15h-4Z" />
    </svg>
  );
}
