import { Pause, Play, SkipBack, SkipForward, Volume2, Youtube } from "lucide-react";

import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { playlists, usePlayer } from "@/components/player-context";
import { cn } from "@/lib/utils";

export function VibePlayer({ compact = false }: { compact?: boolean }) {
  const {
    playlist,
    track,
    trackIndex,
    playing,
    toggle,
    next,
    prev,
    volume,
    setVolume,
    currentTime,
    duration,
    seekTo,
  } = usePlayer();
  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  return (
    <section
      className={cn(
        "glass-strong rounded-3xl p-4",
        compact && "flex flex-wrap items-center gap-4",
      )}
      aria-label="Vibe Check music player"
    >
      <div className={cn("flex items-center gap-3", compact && "min-w-56 flex-1")}>
        <div className="relative shrink-0">
          <img
            src={playlist.cover}
            alt={`${playlist.name} playlist cover`}
            loading="lazy"
            width={512}
            height={512}
            className={cn("rounded-2xl object-cover", compact ? "size-14" : "size-16")}
          />
          <span className="absolute -right-1.5 -bottom-1.5 grid size-6 place-items-center rounded-full bg-background/80">
            <Youtube className="size-3.5 text-blush" />
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
            Vibe Check
          </p>
          <p className="truncate font-display text-base font-semibold">{track.title}</p>
          <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
        </div>
      </div>

      {!compact && (
        <div className="mt-4">
          <Slider
            value={[currentTime]}
            onValueChange={(value) => {
              seekTo(value[0] ?? 0);
            }}
            min={0}
            max={Math.max(duration, 1)}
            step={1}
            aria-label="Song progress"
            className="cursor-pointer"
          />

          <div className="mt-1.5 flex justify-between text-[0.7rem] text-muted-foreground">
            <span>
              {formatTime(currentTime)}
            </span>

            <span>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      )}

      <div className={cn("flex items-center gap-2", compact ? "" : "mt-3 justify-center gap-3")}>
        <button
          onClick={prev}
          aria-label="Previous track"
          className="grid size-9 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/12"
        >
          <SkipBack className="size-4" />
        </button>
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="glow-ring grid size-11 place-items-center rounded-full bg-gradient-warm text-navy transition-transform hover:scale-105"
        >
          {playing ? (
            <Pause className="size-5 fill-navy" />
          ) : (
            <Play className="size-5 fill-navy" />
          )}
        </button>
        <button
          onClick={next}
          aria-label="Next track"
          className="grid size-9 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/12"
        >
          <SkipForward className="size-4" />
        </button>
      </div>

      <div className={cn("flex items-center gap-2", compact ? "w-40" : "mt-4")}>
        <Volume2 className="size-4 shrink-0 text-muted-foreground" />
        <Slider
          value={[volume]}
          onValueChange={(v) => setVolume(v[0] ?? 0)}
          max={100}
          step={1}
          aria-label="Volume"
        />
      </div>

      <div className={cn(compact ? "w-44" : "mt-4")}>
        <PlaylistSelect />
      </div>

      {!compact && (
        <ol className="mt-4 space-y-1">
          {playlist.tracks.map((t, i) => (
            <li
              key={t.title}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-xs",
                i === trackIndex ? "bg-white/8 text-foreground" : "text-muted-foreground",
              )}
            >
              <span className="truncate">{t.title}</span>
              <span>{t.duration}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function PlaylistSelect() {
  const { playlist, setPlaylistId } = usePlayer();
  return (
    <Select value={playlist.id} onValueChange={setPlaylistId}>
      <SelectTrigger className="w-full rounded-2xl border-white/15 bg-white/5">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-2xl">
        {playlists.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}