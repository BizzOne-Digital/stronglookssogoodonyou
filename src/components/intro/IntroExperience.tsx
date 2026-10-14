"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LOGO_IMAGE } from "@/lib/hero-assets";
import { BRAND } from "@/lib/constants";
import { INTRO_SESSION_KEY, INTRO_SOUNDTRACK } from "@/lib/intro-audio";

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

    if (document.querySelector('script[data-spotify-iframe-api]')) return;

    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.dataset.spotifyIframeApi = "true";
    document.body.appendChild(script);
  });

  return spotifyApiPromise;
}

export function IntroExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [localClipReady, setLocalClipReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spotifyRef = useRef<SpotifyEmbedController | null>(null);
  const spotifyReadyRef = useRef(false);
  const embedHostRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    spotifyRef.current?.pause();
    audioRef.current?.pause();
    router.replace(nextPath.startsWith("/") ? nextPath : "/");
  }, [nextPath, router]);

  const onSegmentComplete = useCallback(() => {
    setPhase("done");
    window.setTimeout(finishIntro, 350);
  }, [finishIntro]);

  useEffect(() => {
    const audio = new Audio(INTRO_SOUNDTRACK.localClipPath);
    audio.preload = "auto";
    audioRef.current = audio;

    const onLoaded = () => setLocalClipReady(true);
    const onTimeUpdate = () => {
      if (audio.currentTime >= INTRO_SOUNDTRACK.endSeconds) {
        audio.pause();
        onSegmentComplete();
      }
    };
    const onError = () => {
      audioRef.current = null;
      setLocalClipReady(false);
    };

    audio.addEventListener("loadeddata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadeddata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, [onSegmentComplete]);

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
              onSegmentComplete();
            }
          });
        }
      );
    });

    return () => {
      cancelled = true;
    };
  }, [onSegmentComplete]);

  const startPlayback = async () => {
    setError(null);
    setPhase("playing");

    const start = INTRO_SOUNDTRACK.startSeconds;

    const audio = audioRef.current;
    if (localClipReady && audio) {
      try {
        audio.currentTime = start;
        await audio.play();
        return;
      } catch {
        /* fall through to Spotify */
      }
    }

    const controller = spotifyRef.current;
    if (!controller) {
      setError("Music player is still loading. Wait a second and tap Enter again.");
      setPhase("idle");
      return;
    }

    if (!spotifyReadyRef.current) {
      await new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, 1200);
        controller.addListener("ready", () => {
          window.clearTimeout(t);
          resolve();
        });
      });
    }

    try {
      controller.seek(start * 1000);
      controller.play();
    } catch {
      setError(
        "Playback could not start here. Use Open track on Spotify, or add intro-segment.mp3 under public/audio."
      );
      setPhase("idle");
    }
  };

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center bg-power-black px-6 text-center text-clean-white">
      <div
        className="absolute inset-0 bg-gradient-to-b from-hot-fuchsia/10 via-transparent to-power-black"
        aria-hidden
      />

      <div className="relative z-10 flex max-w-md flex-col items-center">
        <Image
          src={LOGO_IMAGE}
          alt=""
          width={96}
          height={96}
          className="h-24 w-24 object-contain"
          priority
        />
        <p className="mt-8 font-display text-xs tracking-[0.45em] text-hot-fuchsia">WELCOME</p>
        <h1 className="mt-4 font-display text-2xl uppercase leading-tight tracking-tight md:text-3xl">
          {BRAND.shortName}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-soft-silver">
          Tap Enter to play a short intro from{" "}
          <span className="text-clean-white">You&apos;ve Got The Love</span> (0:34–1:16), then
          continue to the site.
        </p>

        {phase === "idle" && (
          <button
            type="button"
            onClick={startPlayback}
            className="mt-10 w-full max-w-xs bg-hot-fuchsia px-8 py-4 font-body text-[0.7rem] font-bold uppercase tracking-[0.2em] text-power-black transition-colors hover:bg-[#ff3da8] btn-press"
          >
            Enter
          </button>
        )}

        {phase === "playing" && (
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-hot-fuchsia" role="status">
            Playing intro…
          </p>
        )}

        {error && <p className="mt-6 text-sm text-soft-silver">{error}</p>}

        <div className="mt-8 flex flex-col gap-3 text-xs text-soft-silver">
          <button
            type="button"
            onClick={finishIntro}
            className="uppercase tracking-[0.2em] text-clean-white/80 underline-offset-4 hover:text-hot-fuchsia hover:underline"
          >
            Skip intro
          </button>
          <Link
            href={INTRO_SOUNDTRACK.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-soft-silver/90 hover:text-hot-fuchsia"
          >
            Open track on Spotify
          </Link>
        </div>
      </div>

      <div
        ref={embedHostRef}
        id="spotify-intro-embed"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[80px] w-full max-w-md -translate-x-1/2 opacity-[0.02]"
        aria-hidden
      />
    </div>
  );
}
