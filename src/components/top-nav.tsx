import { Link } from "@tanstack/react-router";
import { Heart, Link2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

function PlayerChip({ name, initials }: { name: string; initials: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/5 py-1 pr-3 pl-1">
      <span className="relative">
        <span className="grid size-8 place-items-center rounded-full bg-gradient-warm font-display text-sm text-navy">
          {initials}
        </span>
        <span className="border-background absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-online" />
      </span>
      <span className="text-xs font-semibold whitespace-nowrap">{name}</span>
    </div>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4">
      <nav className="glass-strong mx-auto flex max-w-7xl items-center gap-3 rounded-3xl px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="glow-ring grid size-9 place-items-center rounded-2xl bg-gradient-warm">
            <Heart className="size-5 fill-navy text-navy" />
          </span>
          <span className="font-display text-lg leading-none font-semibold">
            two<span className="text-gradient">player</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-1.5 sm:flex">
            <PlayerChip name="Player 1 · Mira" initials="M" />
            <Heart className="size-4 text-blush" />
            <PlayerChip name="Player 2 · Dev" initials="D" />
          </div>
          <Button
            variant="glow"
            size="sm"
            onClick={() => toast("Invite link copied", { description: "twoplayer.gg/join/9f2k" })}
          >
            <Link2 className="size-4" />
            <span className="hidden sm:inline">Invite</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
