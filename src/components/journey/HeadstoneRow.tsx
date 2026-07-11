import { SkullIcon } from "@/components/icons/SkullIcon";
import { cn } from "@/lib/cn";
import { StoneBase } from "./StoneBase";

// old graves never stand straight
const STONE_TILTS = ["rotate-2", "-rotate-1", "rotate-1", "-rotate-2"];

type HeadstoneRowProps = {
  title: string;
  items: string[];
};

// A row of small crooked headstones, one word carved into each, growing
// out of their own strip of ground.
export function HeadstoneRow({ title, items }: HeadstoneRowProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      <h3 className="font-display text-xs tracking-etched uppercase text-foreground/50">
        {title}
      </h3>
      <div className="w-full">
        <ul className="flex flex-wrap items-end justify-center gap-2.5">
          {items.map((label, index) => (
            <li
              key={label}
              className={cn(
                "px-3 pt-3 pb-2.5 rounded-t-full border border-foreground/20 bg-surface/80 text-center font-display text-xs tracking-etched uppercase text-foreground/70",
                STONE_TILTS[index % STONE_TILTS.length],
              )}
            >
              <SkullIcon className="mx-auto mb-1.5 h-3 w-3 text-foreground/30" />
              {label}
            </li>
          ))}
        </ul>
        <StoneBase />
      </div>
    </div>
  );
}
