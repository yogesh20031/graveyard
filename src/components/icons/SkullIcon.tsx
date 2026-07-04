import { cn } from "@/lib/cn";

type SkullIconProps = {
  className?: string;
};

// Menacing skull: angular cranium, eye sockets slanted inward like a glare,
// jagged nasal cavity, gapped teeth, and a hairline crack down the dome —
// all punched out via evenodd so the icon inherits the text color around it.
export function SkullIcon({ className }: SkullIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      className={cn("h-4 w-4", className)}
    >
      <path d="M12 1.5 6.2 3.6 4.2 9l1.2 4.2 2 2.4.5 5.9h8.2l.5-5.9 2-2.4L19.8 9l-2-5.4Zm-5.1 7.5 3.9 1.2-.7 2.5-2.8-.9Zm10.2 0-3.9 1.2.7 2.5 2.8-.9ZM12 12.8l1.4 3-1.4-.7-1.4.7Zm-.3-10.9.8 1.7-.9 1.4 1 1.8-.8.2-.9-1.9.9-1.4-.9-1.5ZM9.5 17.8h.9v3.7h-.9Zm2.05 0h.9v3.7h-.9Zm2.05 0h.9v3.7h-.9Z" />
    </svg>
  );
}
