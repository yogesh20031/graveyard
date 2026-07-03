import { SkullIcon } from "@/components/icons/SkullIcon";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxScene } from "./ParallaxScene";

export function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden night-sky">
      <ParallaxScene />

      <Reveal className="relative z-10 flex flex-col items-center gap-6 px-6 pb-40 text-center">
        <p className="font-display text-sm tracking-etched uppercase text-accent-bright">
          Welcome, wanderer
        </p>
        <h1 className="font-display text-5xl tracking-wide text-foreground sm:text-6xl md:text-7xl">
          Yogesh Khanal
        </h1>
        <p className="text-lg text-foreground/70">
          Frontend developer · BCA student · keeper of this graveyard
        </p>
        <p className="max-w-xl text-base leading-7 text-foreground/60">
          Beyond these gates lie the things I have built, the lessons I have
          unearthed, and the passions I refuse to bury. Step inside — the
          journey is better with company.
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Button href="#journey" size="lg">
            <SkullIcon />
            Enter the graveyard
          </Button>
          <Button href="#journey" variant="outline" size="lg">
            About the keeper
          </Button>
        </div>
      </Reveal>

      <a
        href="#journey"
        aria-label="Scroll down to the journey preview"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-2xl text-foreground/50 transition-colors hover:text-accent-bright"
      >
        <span className="scroll-cue block">↓</span>
      </a>
    </section>
  );
}
