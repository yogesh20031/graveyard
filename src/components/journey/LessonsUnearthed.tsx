import { Button } from "@/components/ui/Button";
import { BoulderSlab } from "./BoulderSlab";
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

const FIELD_NOTES = [
  {
    title: "On debugging",
    note: "Read the error twice before touching the code — every bug gets a burial, but only after the autopsy.",
  },
  {
    title: "On shipping",
    note: "A finished grave beats a perfect blueprint. Ship it, then keep carving.",
  },
  {
    title: "On learning",
    note: "The lessons that stay are the ones exhumed from things that broke in front of people.",
  },
];

// The right road from the crossroads: the knowledge. Skills as headstone
// rows, then the keeper's field notes; the road-not-taken station follows.
// The keeper's farewell (Epilogue) waits at the true end of the walk.
export const lessonsStations: WalkStationConfig[] = [
  { key: "arrival", align: "center", enter: "road", node: <Arrival /> },
  { key: "skills", align: "ground", enter: "above", node: <SkillsStation /> },
  { key: "notes", align: "ground", enter: "left", node: <FieldNotesStation /> },
];

function Arrival() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
        The right road · the knowledge
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

// What the digging actually taught — short lessons weathered into a boulder.
function FieldNotesStation() {
  return (
    <BoulderSlab overline="Field notes, carved in passing">
      <dl className="flex flex-col gap-4">
        {FIELD_NOTES.map((entry) => (
          <div key={entry.title}>
            <dt className="mb-1 text-center font-display text-xs tracking-etched uppercase text-accent-bright/80">
              {entry.title}
            </dt>
            <dd className="text-center italic text-foreground/60">
              {entry.note}
            </dd>
          </div>
        ))}
      </dl>
    </BoulderSlab>
  );
}

// The gate out — or the door to the keeper. Rendered at the true end of the
// walk, after whichever roads the visitor chose to take.
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
        <Button href="/playground" variant="outline" size="lg">
          Enter the playground
        </Button>
      </div>
      <p className="font-display text-xs tracking-etched uppercase text-foreground/35">
        Light the lantern, bottom right — this place has a sound
      </p>
    </div>
  );
}
