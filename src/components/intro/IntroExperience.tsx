"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { LOGO_IMAGE } from "@/lib/hero-assets";
import { BRAND } from "@/lib/constants";
import { INTRO_SESSION_KEY, INTRO_SOUNDTRACK } from "@/lib/intro-audio";
import { useIntroMusic } from "@/components/intro/IntroMusicProvider";

export function IntroExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const { startIntroMusic, stopIntroMusic } = useIntroMusic();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enterSite = useCallback(
    (playMusic: boolean) => {
      try {
        sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      router.replace(nextPath.startsWith("/") ? nextPath : "/");
    },
    [nextPath, router]
  );

  const handleEnterToSite = async () => {
    setError(null);
    setBusy(true);
    const started = await startIntroMusic();
    if (!started) {
      setError(
        "Music could not start yet. Wait a moment and try again, or skip to enter without sound."
      );
      setBusy(false);
      return;
    }
    enterSite(true);
  };

  const handleSkip = () => {
    stopIntroMusic();
    enterSite(false);
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
          Tap <span className="text-clean-white">Enter to site</span> to hear{" "}
          <span className="text-clean-white">You&apos;ve Got The Love</span> (from 0:34) while you
          browse the site.
        </p>

        <button
          type="button"
          disabled={busy}
          onClick={handleEnterToSite}
          className="mt-10 w-full max-w-xs bg-hot-fuchsia px-8 py-4 font-body text-[0.7rem] font-bold uppercase tracking-[0.2em] text-power-black transition-colors hover:bg-[#ff3da8] btn-press disabled:opacity-60"
        >
          {busy ? "Starting…" : "Enter to site"}
        </button>

        {error && <p className="mt-6 text-sm text-soft-silver">{error}</p>}

        <div className="mt-8 flex flex-col gap-3 text-xs text-soft-silver">
          <button
            type="button"
            onClick={handleSkip}
            className="uppercase tracking-[0.2em] text-clean-white/80 underline-offset-4 hover:text-hot-fuchsia hover:underline"
          >
            Enter without music
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
    </div>
  );
}
