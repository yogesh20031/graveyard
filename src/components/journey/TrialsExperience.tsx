import type { WalkEnter, WalkStationConfig } from "./JourneyWalk";
import { StoneBase } from "./StoneBase";
import { StoneSlab } from "./StoneSlab";

type Trial = {
  title: string;
  period: string;
  story: string;
  tools: string[];
  /** live project or repo — rendered as a small "visit the ruin" link */
  link?: string;
};

// TODO: replace these placeholder trials with real projects/work — edit
// this array only, the scene handles the rest. Keep stories to 2–3
// sentences; the stones are small. Add `link` to point a stone at its live
// site or repository.
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

// The left road from the crossroads: the works. One grave per project/job,
// risen from the TRIALS array above; the road-not-taken station follows.
export const trialsStations: WalkStationConfig[] = [
  { key: "arrival", align: "center", enter: "road", node: <Arrival /> },
  ...TRIALS.map((trial, index) => ({
    key: trial.title,
    align: "ground" as const,
    // graves pass on alternating sides of the path
    enter: (index % 2 === 0 ? "left" : "right") as WalkEnter,
    node: <TrialGrave trial={trial} />,
  })),
];

function Arrival() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
        The left road · the works
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
        <h3 className="text-center font-display text-xl text-foreground sm:text-2xl">
          {trial.title}
        </h3>
        <p>{trial.story}</p>
        <p className="text-center font-display text-xs tracking-etched uppercase text-foreground/40">
          {trial.tools.join(" · ")}
        </p>
        {trial.link && (
          <a
            href={trial.link}
            target="_blank"
            rel="noreferrer"
            className="mx-auto font-display text-xs tracking-etched uppercase text-accent transition-colors hover:text-accent-bright"
          >
            Visit the ruin ↗
          </a>
        )}
      </StoneSlab>
      <StoneBase />
    </div>
  );
}
