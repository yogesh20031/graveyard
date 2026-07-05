import { AboutKeeper } from "@/components/journey/AboutKeeper";
import { GraveyardFloor } from "@/components/journey/GraveyardFloor";
import { LessonsUnearthed } from "@/components/journey/LessonsUnearthed";
import { TrialsExperience } from "@/components/journey/TrialsExperience";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <AboutKeeper />
        <TrialsExperience />
        <LessonsUnearthed />
      </main>
      <footer className="night-sky">
        <GraveyardFloor />
        <div className="px-6 py-10 bg-surface text-center text-sm text-foreground/40">
          You walked the whole path. © 2026 Yogesh Khanal — the music haunts a
          later phase.
        </div>
      </footer>
    </>
  );
}
