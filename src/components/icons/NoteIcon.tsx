import { cn } from "@/lib/cn";

type NoteIconProps = {
  className?: string;
};

// A beamed pair of eighth notes — the music lantern's glyph.
export function NoteIcon({ className }: NoteIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4", className)}
    >
      <path d="M9 3.5 21 2v3.2l-9.4 1.2v10.35a3.35 3.35 0 1 1-2.6-3.27V3.5Zm12 3.9v8.35a3.35 3.35 0 1 1-2.6-3.27V7.72L21 7.4Z" />
    </svg>
  );
}
