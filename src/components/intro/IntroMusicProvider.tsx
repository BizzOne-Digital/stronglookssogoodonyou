"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { INTRO_SOUNDTRACK } from "@/lib/intro-audio";

type SpotifyEmbedController = {
  play: () => void;
  pause: () => void;
  seek: (ms: number) => void;
  addListener: (
    event: string,
    cb: (payload: { data?: { position?: number } }) => void
  ) => void;
};

type SpotifyIFrameApi = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width: string; height: string },
    cb: (controller: SpotifyEmbedController) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameApi) => void;
  }
}

let spotifyApiPromise: Promise<SpotifyIFrameApi> | null = null;

function loadSpotifyIframeApi(): Promise<SpotifyIFrameApi> {
  if (spotifyApiPromise) return spotifyApiPromise;

  spotifyApiPromise = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (api) => resolve(api);

    if (!document.querySelector('script[data-spotify-iframe-api]')) {
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      script.dataset.spotifyIframeApi = "true";
      document.body.appendChild(script);
    }
  });

  return spotifyApiPromise;
}

type IntroMusicContextValue = {
  startIntroMusic: () => Promise<boolean>;
  stopIntroMusic: () => void;
  isPlaying: boolean;
};

const IntroMusicContext = createContext<IntroMusicContextValue | null>(null);

export function useIntroMusic() {
  const ctx = useContext(IntroMusicContext);
  if (!ctx) {
    throw new Error("useIntroMusic must be used within IntroMusicProvider");
  }
  return ctx;
}

export function IntroMusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [localClipReady, setLocalClipReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spotifyRef = useRef<SpotifyEmbedController | null>(null);
  const spotifyReadyRef = useRef(false);
  const embedHostRef = useRef<HTMLDivElement>(null);

  const stopIntroMusic = useCallback(() => {
    audioRef.current?.pause();
    spotifyRef.current?.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const audio = new Audio(INTRO_SOUNDTRACK.localClipPath);
    audio.preload = "auto";
    audioRef.current = audio;

    const onLoaded = () => setLocalClipReady(true);
    const onTimeUpdate = () => {
      if (audio.currentTime >= INTRO_SOUNDTRACK.endSeconds) {
        audio.pause();
        setIsPlaying(false);
      }
    };
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      audioRef.current = null;
      setLocalClipReady(false);
    };

    audio.addEventListener("loadeddata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadeddata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const host = embedHostRef.current;
    if (!host) return;

    let cancelled = false;

    loadSpotifyIframeApi().then((api) => {
      if (cancelled) return;
      api.createController(
        host,
        {
          uri: INTRO_SOUNDTRACK.spotifyUri,
          width: "100%",
          height: "80",
        },
        (controller) => {
          spotifyRef.current = controller;
          controller.addListener("ready", () => {
            spotifyReadyRef.current = true;
          });
          controller.addListener("playback_update", (e) => {
            const position = e.data?.position ?? 0;
            if (position >= INTRO_SOUNDTRACK.endSeconds * 1000) {
              controller.pause();
              setIsPlaying(false);
            } else if (position >= INTRO_SOUNDTRACK.startSeconds * 1000) {
              setIsPlaying(true);
            }
          });
        }
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const startIntroMusic = useCallback(async (): Promise<boolean> => {
    const start = INTRO_SOUNDTRACK.startSeconds;

    const audio = audioRef.current;
    if (localClipReady && audio) {
      try {
        audio.currentTime = start;
        await audio.play();
        setIsPlaying(true);
        return true;
      } catch {
        /* try Spotify */
      }
    }

    const controller = spotifyRef.current;
    if (!controller) return false;

    if (!spotifyReadyRef.current) {
      await new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, 1500);
        controller.addListener("ready", () => {
          window.clearTimeout(t);
          spotifyReadyRef.current = true;
          resolve();
        });
      });
    }

    try {
      controller.seek(start * 1000);
      controller.play();
      setIsPlaying(true);
      return true;
    } catch {
      return false;
    }
  }, [localClipReady]);

  return (
    <IntroMusicContext.Provider value={{ startIntroMusic, stopIntroMusic, isPlaying }}>
      {children}
      <div
        ref={embedHostRef}
        id="spotify-site-embed"
        className="pointer-events-none fixed bottom-0 left-0 h-[80px] w-[320px] opacity-[0.02]"
        aria-hidden
      />
      {isPlaying && (
        <p
          className="pointer-events-none fixed bottom-4 right-4 z-[100] rounded border border-hot-fuchsia/40 bg-power-black/90 px-3 py-2 font-display text-[0.6rem] uppercase tracking-[0.25em] text-hot-fuchsia"
          role="status"
        >
          Intro playing
        </p>
      )}
    </IntroMusicContext.Provider>
  );
}
