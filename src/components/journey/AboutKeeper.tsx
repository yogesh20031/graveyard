import { BoulderSlab } from "./BoulderSlab";
import { HeadstoneRow } from "./HeadstoneRow";
import type { WalkStationConfig } from "./JourneyWalk";
import { KeeperFigure } from "./KeeperFigure";
import { SkeletonPresenter } from "./SkeletonPresenter";
import { StoneBase } from "./StoneBase";
import { StoneSlab } from "./StoneSlab";

const KEEPER_TOOLS = ["React", "Next.js", "TypeScript", "Tailwind CSS"];

const BURIED_PASSIONS = [
  "Music",
  "Travel",
  "Nature photography",
  "Gaming",
  "Sports",
];

// TODO: replace with the real college and years — edit these two lines only
const STUDY_SCHOOL = "Your college name · edit me";
const STUDY_YEARS = "20XX — present";

// First stop inside the gates: the arrival, the keeper's monument, his
// schooling, and the tools and passions he was buried with. Walked as the
// `about` stage; its end leads to the crossroads.
export const aboutStations: WalkStationConfig[] = [
  { key: "arrival", align: "center", enter: "road", node: <Arrival /> },
  { key: "monument", align: "ground", enter: "left", node: <MonumentStation /> },
  { key: "studies", align: "ground", enter: "right", node: <StudiesStation /> },
  { key: "tools", align: "ground", enter: "left", node: <ToolsStation /> },
  { key: "passions", align: "ground", enter: "right", node: <PassionsStation /> },
];

// You've just stepped through the fog. Text floats in the night, exactly
// like the hero copy did outside.
function Arrival() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
        Inside the gates · first stop
      </p>
      <h2 className="font-display text-4xl text-foreground sm:text-5xl">
        About the Keeper
      </h2>
      <p className="font-display italic text-foreground/50">
        Here lies Yogesh Khanal — still very much alive, just fond of the
        quiet.
      </p>
      <p className="pt-6 font-display text-xs tracking-etched uppercase text-foreground/40">
        Keep walking
      </p>
    </div>
  );
}

// The keeper's monument, with the keeper himself resting against the next
// stone over — both planted in the same ground.
function MonumentStation() {
  return (
    <div className="w-full">
      <div className="grid items-end sm:grid-cols-[3fr_2fr]">
        <StoneSlab overline="Est. long ago · still breathing">
          <p>
            I am a frontend developer and a BCA student, and I spend my days
            raising interfaces from the dead — taking cold, lifeless designs
            and giving them a pulse in the browser.
          </p>
          <p>
            This graveyard is where I keep everything: the work I have
            shipped, the lessons I have unearthed, and the passions I refuse
            to bury. Every stone here was cut, carved, and animated by hand —
            no template was harmed.
          </p>
          <p>Wander as long as you like — nobody really leaves.</p>
        </StoneSlab>
        <div className="hidden sm:block">
          <KeeperFigure />
        </div>
      </div>
      <StoneBase />
    </div>
  );
}

// The degree being earned, resting under its own stone.
function StudiesStation() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <StoneSlab overline={`${STUDY_SCHOOL} · ${STUDY_YEARS}`}>
        <h3 className="text-center font-display text-xl text-foreground sm:text-2xl">
          The keeper&apos;s schooling
        </h3>
        <p>
          A Bachelor of Computer Applications, still being earned. The
          coursework taught the fundamentals; this graveyard is where they are
          laid to rest — and raised again, working.
        </p>
      </StoneSlab>
      <StoneBase />
    </div>
  );
}

// The keeper's tools, carved into a boulder standing at the roadside.
function ToolsStation() {
  return (
    <BoulderSlab overline="Carved by the keeper's hand">
      <h3 className="text-center font-display text-xl text-foreground sm:text-2xl">
        The keeper&apos;s tools
      </h3>
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-display text-sm tracking-etched uppercase text-foreground/70">
        {KEEPER_TOOLS.map((tool) => (
          <li key={tool}>{tool}</li>
        ))}
      </ul>
    </BoulderSlab>
  );
}

// A skeleton at the roadside, showing the visitor what the keeper
// refuses to bury.
function PassionsStation() {
  return (
    <SkeletonPresenter>
      <div className="flex flex-col items-center gap-6">
        <HeadstoneRow title="Buried passions" items={BURIED_PASSIONS} />
        <p className="font-display text-xs tracking-etched uppercase text-foreground/40">
          The path forks just ahead — the crossroads await
        </p>
      </div>
    </SkeletonPresenter>
  );
}
