type ClassValue = string | false | null | undefined;

/**
 * Joins class names, skipping falsy values so callers can write
 * conditional classes inline: cn("base", isOpen && "open").
 */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
