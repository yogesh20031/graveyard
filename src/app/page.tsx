import { GraveyardJourney } from "@/components/journey/GraveyardJourney";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <>
      {/* Always-dark graveyard sky behind everything — no stage crossfade or
          scroll-momentum overshoot can ever flash the page white. */}
      <div aria-hidden className="fixed inset-0 -z-10 night-sky" />
      <main className="flex-1">
        <Hero />
        <GraveyardJourney />
      </main>
    </>
  );
}
