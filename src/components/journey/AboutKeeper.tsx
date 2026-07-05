import { HeadstoneRow } from "./HeadstoneRow";
import { JourneyWalk } from "./JourneyWalk";
import type { WalkStationConfig } from "./JourneyWalk";
import { KeeperFigure } from "./KeeperFigure";
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

// First stop inside the gates, walked first-person like the landing: the
// section pins, the path runs out from under your feet, and each piece of
// the story is a grave you walk up to.
export function AboutKeeper() {
  return (
    <section
      id="about"
      className="relative scroll-mt-12 overflow-hidden night-sky"
    >
      <JourneyWalk stations={STATIONS} />
    </section>
  );
}

const STATIONS: WalkStationConfig[] = [
  { key: "arrival", align: "center", node: <Arrival /> },
  { key: "monument", align: "ground", node: <MonumentStation /> },
  {
    key: "tools",
    align: "ground",
    node: <HeadstoneRow title="The keeper's tools" items={KEEPER_TOOLS} />,
  },
  { key: "passions", align: "ground", node: <PassionsStation /> },
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
    <div className="mx-auto w-full max-w-3xl">
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
            to bury. Wander as long as you like — nobody really leaves.
          </p>
        </StoneSlab>
        <div className="hidden sm:block">
          <KeeperFigure />
        </div>
      </div>
      <StoneBase />
    </div>
  );
}

function PassionsStation() {
  return (
    <div className="flex flex-col items-center gap-6">
      <HeadstoneRow title="Buried passions" items={BURIED_PASSIONS} />
      <p className="font-display text-xs tracking-etched uppercase text-foreground/40">
        The trials lie just ahead — keep to the path
      </p>
    </div>
  );
}
