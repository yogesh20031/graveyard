import { Button } from "@/components/ui/Button";
import { HeadstoneRow } from "./HeadstoneRow";
import { JourneyWalk } from "./JourneyWalk";
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

// Third stop: the knowledge — and the end of the path, where the visitor
// can finally speak to the keeper.
export function LessonsUnearthed() {
  return (
    <section
      id="lessons"
      className="relative scroll-mt-12 overflow-hidden night-sky"
    >
      <JourneyWalk stations={STATIONS} />
    </section>
  );
}

const STATIONS: WalkStationConfig[] = [
  { key: "arrival", align: "center", node: <Arrival /> },
  { key: "skills", align: "ground", node: <SkillsStation /> },
  { key: "epilogue", align: "center", node: <Epilogue /> },
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

// The gate out — or the door to the keeper.
function Epilogue() {
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
