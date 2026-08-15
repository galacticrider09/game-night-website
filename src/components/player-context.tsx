import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import lofi from "@/assets/pl-lofi.jpg";
import acoustic from "@/assets/pl-acoustic.jpg";
import pop from "@/assets/pl-pop.jpg";

export type Track = { title: string; artist: string; duration: string };

export type Playlist = {
  id: string;
  name: string;
  cover: string;
  tracks: Track[];
};

export const playlists: Playlist[] = [
  {
    id: "lofi",
    name: "Chill Lofi",
    cover: lofi,
    tracks: [
      { title: "Midnight Window", artist: "kupla ~ tape", duration: "3:12" },
      { title: "Slow Sunday", artist: "Blue Room", duration: "2:48" },
      { title: "Static Rain", artist: "nocturne", duration: "4:05" },
    ],
  },
  {
    id: "acoustic",
    name: "Romantic Acoustic",
    cover: acoustic,
    tracks: [
      { title: "Porch Light", artist: "June & Ivy", duration: "3:41" },
      { title: "Only Yours", artist: "Wildwood", duration: "3:05" },
      { title: "Paper Hearts", artist: "Sam Oaks", duration: "4:22" },
    ],
  },
  {
    id: "pop",
    name: "Upbeat Pop",
    cover: pop,
    tracks: [
      { title: "Sugar Static", artist: "NEON CLUB", duration: "2:56" },
      { title: "Dance Floor Us", artist: "Polaroid", duration: "3:18" },
      { title: "Glitterbomb", artist: "Mia Vance", duration: "3:33" },
    ],
  },
];

type PlayerState = {
  playlist: Playlist;
  setPlaylistId: (id: string) => void;
  trackIndex: number;
  track: Track;
  playing: boolean;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  volume: number;
  setVolume: (v: number) => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playlistId, setPlaylistId] = useState("lofi");
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(62);

  const playlist: Playlist = playlists.find((p) => p.id === playlistId) ?? playlists[0]!;

  const value = useMemo<PlayerState>(
    () => ({
      playlist,
      setPlaylistId: (id: string) => {
        setPlaylistId(id);
        setTrackIndex(0);
        setPlaying(true);
      },
      trackIndex,
      track: (playlist.tracks[trackIndex] ?? playlist.tracks[0])!,
      playing,
      toggle: () => setPlaying((p) => !p),
      next: () => setTrackIndex((i) => (i + 1) % playlist.tracks.length),
      prev: () =>
        setTrackIndex((i) => (i - 1 + playlist.tracks.length) % playlist.tracks.length),
      volume,
      setVolume,
    }),
    [playlist, trackIndex, playing, volume],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
