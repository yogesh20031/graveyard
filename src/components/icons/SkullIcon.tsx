import { cn } from "@/lib/cn";

type SkullIconProps = {
  className?: string;
};

// Eye sockets and nose are punched out of the cranium via evenodd,
// so the icon inherits any text color it sits next to.
export function SkullIcon({ className }: SkullIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      className={cn("h-4 w-4", className)}
    >
      <path d="M12 1.5c-4.97 0-8.75 3.62-8.75 8.45 0 2.62 1.17 4.86 3 6.4v3.15c0 .83.67 1.5 1.5 1.5h1v-2a.75.75 0 0 1 1.5 0v2h3.5v-2a.75.75 0 0 1 1.5 0v2h1c.83 0 1.5-.67 1.5-1.5v-3.15c1.83-1.54 3-3.78 3-6.4 0-4.83-3.78-8.45-8.75-8.45Zm-3.25 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm6.5 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM12 13.4l1.3 2.25a.5.5 0 0 1-.43.75h-1.74a.5.5 0 0 1-.43-.75L12 13.4Z" />
    </svg>
  );
}
