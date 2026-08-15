import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { GameCard } from "@/components/game-card";
import { VibePlayer } from "@/components/vibe-player";
import { games } from "@/lib/game-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "twoplayer — Couple's Game Night with Music" },
      {
        name: "description",
        content:
          "Play quick real-time games with your partner while a curated YouTube playlist keeps the vibe going.",
      },
      { property: "og:title", content: "twoplayer — Couple's Game Night" },
      {
        property: "og:description",
        content: "Cozy two-player games plus a shared music player. Invite your person and play.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <main>
          <div className="glass rounded-3xl px-6 py-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-xs font-semibold text-blush">
              <Sparkles className="size-3.5" />
              Tonight's session · 2 players online
            </span>
            <h1 className="mt-3 font-display text-4xl leading-tight font-semibold sm:text-5xl">
              Game night, <span className="text-gradient">just the two of you</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Pick something silly, keep the playlist rolling, and see who folds first.
            </p>
          </div>

          <h2 className="mt-8 mb-4 font-display text-xl font-semibold">Game library</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </main>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <VibePlayer />
        </aside>
      </div>
    </div>
  );
}
