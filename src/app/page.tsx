import { Hero } from "@/components/landing/Hero";
import { JourneyPreview } from "@/components/landing/JourneyPreview";
import { Reveal } from "@/components/ui/Reveal";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <JourneyPreview />
      </main>
      <Reveal y={12}>
        <footer className="px-6 py-10 text-center text-sm text-foreground/40">
          © 2026 Yogesh Khanal — rest here a while. The music player haunts a
          later phase.
        </footer>
      </Reveal>
    </>
  );
}
