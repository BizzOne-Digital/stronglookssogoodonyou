"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getIntroAudioSrc,
  getIntroPlaybackBounds,
  getIntroYoutubeVideoId,
  introLocalAudioAvailable,
  introSegmentShouldRestart,
  INTRO_SOUNDTRACK,
} from "@/lib/intro-audio";
import {
  loadYouTubeIframeApi,
  type YouTubePlayerInstance,
} from "@/lib/youtube-iframe-api";

type PlaybackMode = "audio" | "youtube" | "none";

type IntroMusicContextValue = {
  startIntroMusic: () => Promise<boolean>;
  stopIntroMusic: () => void;
  isPlaying: boolean;
  isMusicReady: boolean;
  hasAudioSource: boolean;
};

const IntroMusicContext = createContext<IntroMusicContextValue | null>(null);

export function useIntroMusic() {
  const ctx = useContext(IntroMusicContext);
  if (!ctx) {
    throw new Error("useIntroMusic must be used within IntroMusicProvider");
  }
  return ctx;
}

function seekAudioToIntroStart(audio: HTMLAudioElement) {
  const bounds = getIntroPlaybackBounds(
    Number.isFinite(audio.duration) ? audio.duration : undefined
  );
  audio.currentTime = bounds.start;
}

function startYouTubeIntro(player: YouTubePlayerInstance) {
  const { startSeconds } = INTRO_SOUNDTRACK;
  player.unMute();
  player.setVolume(70);
  player.seekTo(startSeconds, true);
  player.playVideo();
}

export function IntroMusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicReady, setIsMusicReady] = useState(false);
  const [hasAudioSource, setHasAudioSource] = useState(false);
  const [usesYouTube, setUsesYouTube] = useState(false);

  const modeRef = useRef<PlaybackMode>("none");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<YouTubePlayerInstance | null>(null);
  const ytHostRef = useRef<HTMLDivElement>(null);
  const syncStartRef = useRef(true);
  const segmentGuardRef = useRef<number | null>(null);
  const segmentLoopRef = useRef<number | null>(null);

  const stopYouTubeSegmentLoop = useCallback(() => {
    window.clearInterval(segmentLoopRef.current ?? undefined);
    segmentLoopRef.current = null;
  }, []);

  const startYouTubeSegmentLoop = useCallback(() => {
    stopYouTubeSegmentLoop();
    const { startSeconds, endSeconds } = INTRO_SOUNDTRACK;
    const bounds = { start: startSeconds, end: endSeconds };

    segmentLoopRef.current = window.setInterval(() => {
      const player = ytPlayerRef.current;
      if (!player) return;
      try {
        const t = player.getCurrentTime();
        if (introSegmentShouldRestart(t, bounds)) {
          player.seekTo(bounds.start, true);
        }
      } catch {
        /* ignore */
      }
    }, 250);
  }, [stopYouTubeSegmentLoop]);

  const stopIntroMusic = useCallback(() => {
    audioRef.current?.pause();
    ytPlayerRef.current?.pauseVideo();
    stopYouTubeSegmentLoop();
    setIsPlaying(false);
  }, [stopYouTubeSegmentLoop]);

  useEffect(() => {
    let cancelled = false;
    const audioSrc = getIntroAudioSrc();

    const markReady = (hasSource: boolean, mode: PlaybackMode) => {
      modeRef.current = mode;
      setHasAudioSource(hasSource);
      setUsesYouTube(mode === "youtube");
      setIsMusicReady(true);
    };

    async function init() {
      const hasLocal = await introLocalAudioAvailable(audioSrc);
      if (cancelled) return;

      if (hasLocal) {
        modeRef.current = "audio";
        const audio = new Audio(audioSrc);
        audio.preload = "auto";
        audio.loop = false;
        audio.volume = 0.45;
        audioRef.current = audio;

        const onLoaded = () => seekAudioToIntroStart(audio);
        const onTimeUpdate = () => {
          const bounds = getIntroPlaybackBounds(
            Number.isFinite(audio.duration) ? audio.duration : undefined
          );
          if (introSegmentShouldRestart(audio.currentTime, bounds)) {
            audio.currentTime = bounds.start;
          }
        };
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);

        markReady(true, "audio");
        return;
      }

      const videoId = getIntroYoutubeVideoId();
      if (!videoId) {
        markReady(false, "none");
        return;
      }

      modeRef.current = "youtube";
      setUsesYouTube(true);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (cancelled || !ytHostRef.current) return;

      ytHostRef.current.innerHTML = "";
      const mount = document.createElement("div");
      mount.id = "slgoy-yt-intro-player";
      ytHostRef.current.appendChild(mount);

      const YT = await loadYouTubeIframeApi();
      if (cancelled) return;

      const { startSeconds } = INTRO_SOUNDTRACK;

      new YT.Player(mount, {
        width: 320,
        height: 180,
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          start: startSeconds,
          end: INTRO_SOUNDTRACK.endSeconds,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            ytPlayerRef.current = event.target;
            event.target.setVolume(70);
            markReady(true, "youtube");
          },
          onStateChange: (event) => {
            const player = ytPlayerRef.current;
            if (!player || !window.YT) return;

            if (event.data === window.YT.PlayerState.ENDED) {
              syncStartRef.current = true;
              startYouTubeIntro(player);
              startYouTubeSegmentLoop();
              return;
            }

            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startYouTubeSegmentLoop();

              if (syncStartRef.current) {
                window.clearTimeout(segmentGuardRef.current ?? undefined);
                segmentGuardRef.current = window.setTimeout(() => {
                  try {
                    const t = player.getCurrentTime();
                    if (t < startSeconds - 0.5) {
                      player.seekTo(startSeconds, true);
                    } else {
                      syncStartRef.current = false;
                    }
                  } catch {
                    /* ignore */
                  }
                }, 400);
              }
            }

            if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    }

    const readyFallback = window.setTimeout(() => setIsMusicReady(true), 6000);

    init().catch(() => markReady(false, "none"));

    return () => {
      cancelled = true;
      window.clearTimeout(readyFallback);
      window.clearTimeout(segmentGuardRef.current ?? undefined);
      stopYouTubeSegmentLoop();
      try {
        ytPlayerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      ytPlayerRef.current = null;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      modeRef.current = "none";
    };
  }, [startYouTubeSegmentLoop, stopYouTubeSegmentLoop]);

  const startIntroMusic = useCallback(async (): Promise<boolean> => {
    const mode = modeRef.current;

    if (mode === "audio") {
      const audio = audioRef.current;
      if (!audio) return false;
      try {
        seekAudioToIntroStart(audio);
        await audio.play();
        setIsPlaying(true);
        return true;
      } catch {
        return false;
      }
    }

    if (mode === "youtube") {
      const player = ytPlayerRef.current;
      if (!player) return false;
      try {
        syncStartRef.current = true;
        startYouTubeIntro(player);
        startYouTubeSegmentLoop();
        setIsPlaying(true);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  }, [startYouTubeSegmentLoop]);

  return (
    <IntroMusicContext.Provider
      value={{
        startIntroMusic,
        stopIntroMusic,
        isPlaying,
        isMusicReady,
        hasAudioSource,
      }}
    >
      {children}
      {usesYouTube && (
        <div
          ref={ytHostRef}
          aria-hidden
          className="pointer-events-none fixed bottom-4 left-4 z-[-1] overflow-hidden"
          style={{ width: 320, height: 180, opacity: 0.01 }}
        />
      )}
    </IntroMusicContext.Provider>
  );
}
