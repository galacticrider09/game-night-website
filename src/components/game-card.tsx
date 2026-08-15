import { Link } from "@tanstack/react-router";
import { Clock3, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Game } from "@/lib/game-data";

export function GameCard({ game }: { game: Game }) {
  return (
    <article className="glass group relative overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={game.image}
          alt={`${game.title} illustration`}
          loading="lazy"
          width={768}
          height={512}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/70 px-3 py-1 text-[0.7rem] font-bold tracking-wide">
          {game.tag}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold">{game.title}</h3>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock3 className="size-3.5" />
            {game.minutes}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">{game.description}</p>
        <Button asChild variant="glow" className="mt-4 w-full">
          <Link to="/play/$gameId" params={{ gameId: game.id }}>
            <Play className="size-4 fill-navy" />
            Play Now
          </Link>
        </Button>
      </div>
    </article>
  );
}
