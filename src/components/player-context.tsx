import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import lofi from "@/assets/pl-lofi.jpg";
import acoustic from "@/assets/pl-acoustic.jpg";
import pop from "@/assets/pl-pop.jpg";

import YouTube from "react-youtube";
import type { YouTubePlayer } from "react-youtube";

export type Track = {
  title: string;
  artist: string;
  duration: string;
  youtubeId: string;
};

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
      {
        title: "Midnight Window",
        artist: "kupla ~ tape",
        duration: "3:12",
        youtubeId: "xvT1jH8B9AM",
      },
      {
        title: "Slow Sunday",
        artist: "Blue Room",
        duration: "2:48",
        youtubeId: "a3Ue-LN5B9U",
      },
      {
        title: "Static Rain",
        artist: "nocturne",
        duration: "4:05",
        youtubeId: "phDmHdQAPyo",
      },
    ],
  },

  {
    id: "acoustic",
    name: "Romantic Acoustic",
    cover: acoustic,
    tracks: [
      {
        title: "Porch Light",
        artist: "June & Ivy",
        duration: "3:41",
        youtubeId: "xl-_e_-RXUA",
      },
      {
        title: "Only Yours",
        artist: "Wildwood",
        duration: "3:05",
        youtubeId: "n2dVFdqMYGA",
      },
      {
        title: "Paper Hearts",
        artist: "Sam Oaks",
        duration: "4:22",
        youtubeId: "zaFGQEIcetM",
      },
    ],
  },

  {
    id: "pop",
    name: "Upbeat Pop",
    cover: pop,
    tracks: [
      {
        title: "Sugar Static",
        artist: "NEON CLUB",
        duration: "2:56",
        youtubeId: "8of5w7RgcTc",
      },
      {
        title: "Dance Floor Us",
        artist: "Polaroid",
        duration: "3:18",
        youtubeId: "tOM-nWPcR4U",
      },
      {
        title: "Glitterbomb",
        artist: "Mia Vance",
        duration: "3:33",
        youtubeId: "I8t0VJjEffk",
      },
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

  currentTime: number;
  duration: number;

  seekTo: (seconds: number) => void;
};

const PlayerContext =
  createContext<PlayerState | null>(null);

export function PlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const playerRef =
    useRef<YouTubePlayer | null>(null);

  const shouldBePlayingRef = useRef(false);

  const [playlistId, setPlaylistIdState] =
    useState("lofi");

  const [trackIndex, setTrackIndex] =
    useState(0);

  const [playing, setPlaying] =
    useState(false);

  const seekTo = (seconds: number) => {
    const player = playerRef.current;

    if (!player || !duration) return;

    const time = Math.max(
      0,
      Math.min(seconds, duration),
    );

    player.seekTo(time, true);
    setCurrentTime(time);
  };

  const [volume, setVolumeState] =
    useState(62);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const playlist =
    playlists.find(
      (p) => p.id === playlistId,
    ) ?? playlists[0]!;

  const track =
    playlist.tracks[trackIndex] ??
    playlist.tracks[0]!;

  /*
   * YouTube player configuration.
   */
  const youtubeOptions = useMemo(
    () => ({
      height: "0",
      width: "0",

      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        playsinline: 1,
        rel: 0,
      },
    }),
    [],
  );

  /*
   * YouTube player has loaded.
   */
  const handlePlayerReady = (
    event: {
      target: YouTubePlayer;
    },
  ) => {
    playerRef.current =
      event.target;

    event.target.setVolume(
      volume,
    );

    setDuration(
      event.target.getDuration(),
    );

    if (shouldBePlayingRef.current) {
      event.target.playVideo();
    }
  };

  /*
   * Track actual playback state.
   */
  const handleStateChange = (event: {
    data: number;
    target: YouTubePlayer;
  }) => {
    const YTState = {
      ENDED: 0,
      PLAYING: 1,
      PAUSED: 2,
      BUFFERING: 3,
      CUED: 5,
    };

    if (event.data === YTState.PLAYING) {
      shouldBePlayingRef.current = true;

      setPlaying(true);

      setDuration(
        event.target.getDuration(),
      );

      return;
    }

    if (event.data === YTState.ENDED) {
      shouldBePlayingRef.current = true;

      next();

      return;
    }

    if (event.data === YTState.PAUSED) {
      /*
       * YouTube can briefly emit PAUSED while
       * switching between videos.
       *
       * Don't immediately overwrite our desired
       * playback state in that situation.
       */
      if (!shouldBePlayingRef.current) {
        setPlaying(false);
      }

      return;
    }
  };

  /*
   * Keep progress updated.
   */
  useEffect(() => {
    const player = playerRef.current;

    if (!player) return;

    try {
      if (shouldBePlayingRef.current) {
        player.loadVideoById(track.youtubeId);
      } else {
        player.cueVideoById(track.youtubeId);
      }

      setCurrentTime(0);
    } catch {
      // Player may not be ready yet.
    }
  }, [track.youtubeId]);



  /*
   * Play / pause.
   */
  const toggle = () => {
    const player = playerRef.current;

    if (!player) return;

    const state = player.getPlayerState();

    if (state === 1) {
      shouldBePlayingRef.current = false;
      setPlaying(false);
      player.pauseVideo();
    } else {
      shouldBePlayingRef.current = true;
      setPlaying(true);
      player.playVideo();
    }
  };

  /*
   * Next track.
   */
  const next = () => {
    shouldBePlayingRef.current = true;

    setPlaying(true);

    setTrackIndex((index) => {
      return (index + 1) % playlist.tracks.length;
    });
  };

  const prev = () => {
    shouldBePlayingRef.current = true;

    setPlaying(true);

    setTrackIndex((index) => {
      return (
        (index - 1 + playlist.tracks.length) %
        playlist.tracks.length
      );
    });
  };
  const handlePlayerError = (event: {
    data: number;
  }) => {
    console.error(
      "YouTube player error:",
      event.data,
    );
  };

  /*
   * Change playlist.
   */
  const setPlaylistId = (id: string) => {
    shouldBePlayingRef.current = false;

    setPlaylistIdState(id);
    setTrackIndex(0);
    setPlaying(false);
    setCurrentTime(0);
  };

  /*
   * Change volume.
   */
  const setVolume = (value: number) => {
    const nextVolume = Math.max(
      0,
      Math.min(100, value),
    );

    setVolumeState(nextVolume);

    playerRef.current?.setVolume(
      nextVolume,
    );
  };

  const value =
    useMemo<PlayerState>(
      () => ({
        playlist,

        setPlaylistId,

        trackIndex,

        track,

        playing,

        toggle,

        next,

        prev,

        volume,

        setVolume,

        currentTime,

        duration,

        seekTo,
      }),
      [
        playlist,
        trackIndex,
        track,
        playing,
        volume,
        currentTime,
        duration,
        seekTo,
      ],
    );

  return (
    <PlayerContext.Provider
      value={value}
    >
      {children}

      {/*
       * Hidden YouTube player.
       *
       * It still exists in the DOM,
       * but the actual YouTube UI is hidden.
       */}
      {/*<div
        *className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-px w-px overflow-hidden"
       * aria-hidden="true"
      > */}
      <div className="fixed bottom-4 right-4 z-50">
        <YouTube
          videoId={track.youtubeId}
          opts={youtubeOptions}
          onReady={handlePlayerReady}
          onStateChange={handleStateChange}
          onError={handlePlayerError}
        />
      </div>
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context =
    useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayer must be used inside PlayerProvider",
    );
  }

  return context;
}