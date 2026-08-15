import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Heart } from "lucide-react";

import { TicTacToe } from "@/components/tic-tac-toe";
import { VibePlayer } from "@/components/vibe-player";
import { Button } from "@/components/ui/button";
import { getGame } from "@/lib/game-data";

export const Route = createFileRoute("/play/$gameId")({
  loader: ({ params }) => {
    const game = getGame(params.gameId);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.game.title} — twoplayer` : "Play — twoplayer";
    const description = loaderData?.game.description ?? "Play a quick couple's game together.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PlayRoute,
});

function PlayerBadge({
  name,
  initials,
  active,
}: {
  name: string;
  initials: string;
  active: boolean;
}) {
  return (
    <div className={`glass flex items-center gap-3 rounded-3xl p-4 ${active ? "glow-ring" : ""}`}>
      <span className="grid size-11 place-items-center rounded-2xl bg-gradient-warm font-display text-navy">
        {initials}
      </span>
      <div>
        <p className="font-display text-sm font-semibold">{name}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-online" />
          Online
        </p>
      </div>
    </div>
  );
}

function PlayRoute() {
  const { game } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-40">
      <Button asChild variant="soft" size="sm">
        <Link to="/">
          <ArrowLeft className="size-4" />
          Back to library
        </Link>
      </Button>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[220px_1fr_220px]">
        <PlayerBadge name="Mira" initials="M" active />
        <div>
          {game.id === "tic-tac-toe" ? (
            <TicTacToe />
          ) : (
            <div className="glass-strong grid min-h-72 place-items-center rounded-3xl p-8 text-center">
              <div>
                <Heart className="mx-auto size-8 fill-blush text-blush" />
                <h2 className="mt-3 font-display text-2xl font-semibold">{game.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{game.description}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Room is warmed up — waiting for both players to hit ready.
                </p>
              </div>
            </div>
          )}
        </div>
        <PlayerBadge name="Dev" initials="D" active={false} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4">
        <div className="mx-auto max-w-5xl">
          <VibePlayer compact />
        </div>
      </div>
    </div>
  );
}
