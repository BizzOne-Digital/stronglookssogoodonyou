"use client";

import { useRouter } from "next/navigation";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { hasPassedIntroClient, markIntroComplete } from "@/lib/intro-complete";
import { useIntroMusic } from "@/components/intro/IntroMusicProvider";
import { BrandWordmark } from "@/components/brand/BrandWordmark";

export function IntroExperience({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const { startIntroMusic, isMusicReady, hasAudioSource } = useIntroMusic();
  const leavingRef = useRef(false);
  const [leaving, setLeaving] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasPassedIntroClient()) return;
    const path = nextPath.startsWith("/") ? nextPath : "/";
    router.replace(path);
  }, [nextPath, router]);

  const enterSite = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    markIntroComplete();
    const path = nextPath.startsWith("/") ? nextPath : "/";
    startTransition(() => {
      router.replace(path);
    });
  }, [nextPath, router]);

  const handleEnterToSite = async () => {
    if (leavingRef.current) return;
    setError(null);
    setBusy(true);
    if (hasAudioSource) {
      const started = await startIntroMusic();
      if (!started) {
        setError("Could not start the intro track. Tap Enter to site again.");
        setBusy(false);
        leavingRef.current = false;
        setLeaving(false);
        return;
      }
    }
    enterSite();
  };

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center bg-power-black px-6 text-center text-clean-white">
      <div
        className="absolute inset-0 bg-gradient-to-b from-hot-fuchsia/10 via-transparent to-power-black"
        aria-hidden
      />

      <div className="relative z-10 flex max-w-lg flex-col items-center">
        <BrandWordmark priority className="max-w-[min(100%,20rem)] md:max-w-sm" />
        <p className="mt-10 font-display text-xs tracking-[0.45em] text-hot-fuchsia">WELCOME</p>

        {!isMusicReady && (
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-soft-silver">
            Preparing music…
          </p>
        )}

        <button
          type="button"
          disabled={busy || leaving || !isMusicReady}
          onClick={handleEnterToSite}
          className="mt-10 w-full max-w-xs bg-hot-fuchsia px-8 py-4 font-body text-[0.7rem] font-bold uppercase tracking-[0.2em] text-power-black transition-colors hover:bg-[#ff3da8] btn-press disabled:opacity-60"
        >
          {busy ? "Starting…" : "Enter to site"}
        </button>

        {error && <p className="mt-6 text-sm text-soft-silver">{error}</p>}
      </div>
    </div>
  );
}
