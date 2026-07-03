import { SkullIcon } from "@/components/icons/SkullIcon";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

type JourneyStop = {
  title: string;
  epitaph: string;
  body: string;
};

const JOURNEY_STOPS: JourneyStop[] = [
  {
    title: "About the Keeper",
    epitaph: "Here lies the story",
    body: "Who I am — a frontend developer and BCA student who loves music, travel, gaming, and photographing nature.",
  },
  {
    title: "Trials & Experience",
    epitaph: "Here lie the works",
    body: "The projects I have shipped and the experience gathered along the way as a frontend developer.",
  },
  {
    title: "Lessons Unearthed",
    epitaph: "Here lies the knowledge",
    body: "The skills and lessons I have dug up — from React and TypeScript to everything still being excavated.",
  },
];

const CARD_STAGGER_SECONDS = 0.15;

export function JourneyPreview() {
  return (
    <section
      id="journey"
      className="mx-auto flex max-w-5xl scroll-mt-12 flex-col gap-12 px-6 py-24"
    >
      <Reveal className="flex flex-col gap-3 text-center">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          What lies beyond the gate
        </h2>
        <p className="text-foreground/60">
          Three stops on the journey. The gates open in the next phase.
        </p>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {JOURNEY_STOPS.map((stop, index) => (
          <Reveal key={stop.title} delay={index * CARD_STAGGER_SECONDS}>
            <JourneyStopCard stop={stop} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function JourneyStopCard({ stop }: { stop: JourneyStop }) {
  return (
    // tombstone-shaped top; one-off radius on purpose
    <Card className="flex h-full flex-col gap-3 rounded-t-[2.5rem] pt-10 text-center">
      <SkullIcon className="mx-auto h-5 w-5 text-accent-bright/70" />
      <p className="font-display text-xs tracking-etched uppercase text-accent-bright">
        {stop.epitaph}
      </p>
      <h3 className="font-display text-xl text-foreground">{stop.title}</h3>
      <p className="text-sm leading-6 text-foreground/60">{stop.body}</p>
      <p className="mt-auto pt-4 text-xs tracking-etched uppercase text-foreground/35">
        Opens in phase 2
      </p>
    </Card>
  );
}
