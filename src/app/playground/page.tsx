import type { Metadata } from "next";
import Link from "next/link";
import { PlaygroundGate } from "@/components/playground/PlaygroundGate";

export const metadata: Metadata = {
  title: "The Playground — Yogesh Khanal",
  description:
    "A game buried behind the graveyard: help the keeper's skeleton outrun the stones.",
};

export default function PlaygroundPage() {
  return (
    <main className="night-sky relative flex min-h-dvh flex-col px-6 py-8">
      <Link
        href="/"
        className="self-start font-display text-xs tracking-etched uppercase text-foreground/50 transition-colors hover:text-accent"
      >
        ← Back to the graveyard
      </Link>
      <PlaygroundGate />
    </main>
  );
}
