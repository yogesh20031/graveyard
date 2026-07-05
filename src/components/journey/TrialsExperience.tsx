import { JourneyWalk } from "./JourneyWalk";
import type { WalkStationConfig } from "./JourneyWalk";
import { StoneBase } from "./StoneBase";
import { StoneSlab } from "./StoneSlab";

type Trial = {
  title: string;
  period: string;
  story: string;
  tools: string[];
};

// TODO: replace these placeholder trials with real projects/work — edit
// this array only, the scene handles the rest. Keep stories to 2–3
// sentences; the stones are small.
const TRIALS: Trial[] = [
  {
    title: "The First Build",
    period: "A placeholder · edit me",
    story:
      "Here rests the first real project. Describe what you built, what broke along the way, and what finally shipped — two or three sentences is plenty.",
    tools: ["React", "Tailwind CSS"],
  },
  {
    title: "Client Trials",
    period: "A placeholder · edit me",
    story:
      "And here a second — an internship, freelance work, or the build you are proudest of. Say what you did and what it survived.",
    tools: ["Next.js", "TypeScript"],
  },
];

// Second stop: the works. One grave per project/job, each risen from the
// TRIALS array above.
export function TrialsExperience() {
  return (
    <section
      id="experience"
      className="relative scroll-mt-12 overflow-hidden night-sky"
    >
      <JourneyWalk stations={STATIONS} />
    </section>
  );
}

const STATIONS: WalkStationConfig[] = [
  { key: "arrival", align: "center", node: <Arrival /> },
  ...TRIALS.map((trial) => ({
    key: trial.title,
    align: "ground" as const,
    node: <TrialGrave trial={trial} />,
  })),
  { key: "closing", align: "center", node: <Closing /> },
];

function Arrival() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
        Deeper in · second stop
      </p>
      <h2 className="font-display text-4xl text-foreground sm:text-5xl">
        Trials &amp; Experience
      </h2>
      <p className="font-display italic text-foreground/50">
        Here lie the works — shipped, survived, and still remembered.
      </p>
      <p className="pt-6 font-display text-xs tracking-etched uppercase text-foreground/40">
        Keep walking
      </p>
    </div>
  );
}

function TrialGrave({ trial }: { trial: Trial }) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <StoneSlab overline={trial.period}>
        <h3 className="text-center font-display text-2xl text-foreground">
          {trial.title}
        </h3>
        <p>{trial.story}</p>
        <p className="text-center font-display text-xs tracking-etched uppercase text-foreground/40">
          {trial.tools.join(" · ")}
        </p>
      </StoneSlab>
      <StoneBase />
    </div>
  );
}

function Closing() {
  return (
    <p className="text-center font-display text-xs tracking-etched uppercase text-foreground/40">
      The lessons lie further in — almost there
    </p>
  );
}
