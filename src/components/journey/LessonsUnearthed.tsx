import { Button } from "@/components/ui/Button";
import { HeadstoneRow } from "./HeadstoneRow";
import type { WalkStationConfig } from "./JourneyWalk";

const DUG_UP = [
  "HTML & CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Git",
];

const STILL_DIGGING = ["Animations & motion", "Accessibility", "Backend basics"];

// Right road from the crossroads: the knowledge. Its end returns you to the
// crossroads; the keeper's farewell (Epilogue) waits at the true end, once
// both roads are walked.
export const lessonsStations: WalkStationConfig[] = [
  { key: "arrival", align: "center", enter: "sky", node: <Arrival /> },
  { key: "skills", align: "ground", enter: "above", node: <SkillsStation /> },
  { key: "closing", align: "center", enter: "road", node: <Closing /> },
];

function Arrival() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
        Further still · third stop
      </p>
      <h2 className="font-display text-4xl text-foreground sm:text-5xl">
        Lessons Unearthed
      </h2>
      <p className="font-display italic text-foreground/50">
        Here lies the knowledge — every stone dug up left a mark.
      </p>
      <p className="pt-6 font-display text-xs tracking-etched uppercase text-foreground/40">
        Keep walking
      </p>
    </div>
  );
}

function SkillsStation() {
  return (
    <div className="flex flex-col gap-10">
      <HeadstoneRow title="Dug up" items={DUG_UP} />
      <HeadstoneRow title="Still digging" items={STILL_DIGGING} />
    </div>
  );
}

function Closing() {
  return (
    <p className="text-center font-display text-xs tracking-etched uppercase text-foreground/40">
      The path winds on — the way out is near
    </p>
  );
}

// The gate out — or the door to the keeper. Rendered at the true end of the
// walk (the `end` stage), once both roads from the crossroads are walked.
export function Epilogue() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h3 className="font-display text-3xl text-foreground sm:text-4xl">
        The end of the path — for now
      </h3>
      <p className="max-w-md leading-7 text-foreground/60">
        The keeper is always near. Leave a message at the gate, or wander the
        crypt where the code is buried.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button href="mailto:khanalyogesh0007@gmail.com" size="lg" skull>
          Leave a message
        </Button>
        <Button
          href="https://github.com/yogesh20031"
          variant="outline"
          size="lg"
          target="_blank"
          rel="noreferrer"
        >
          Visit the crypt
        </Button>
      </div>
      <p className="font-display text-xs tracking-etched uppercase text-foreground/35">
        Music haunts this place in a later phase
      </p>
    </div>
  );
}
