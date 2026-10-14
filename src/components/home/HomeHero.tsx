import Link from "next/link";
import { HomeHeroImage } from "@/components/home/HomeHeroImage";

function ScrollChevron() {
  return (
    <svg
      width="28"
      height="16"
      viewBox="0 0 28 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
      aria-hidden
    >
      <path
        d="M2 2L14 14L26 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeHero() {
  return (
    <section data-hero className="relative min-h-[100svh] max-w-[100vw] overflow-x-clip bg-power-black text-white">
      <div className="absolute inset-0">
        <div data-hero-image className="relative h-full w-full md:h-[108%] md:w-full">
          <HomeHeroImage />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/50 to-black/10 md:from-black/85 md:via-black/35 md:to-transparent"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-6 pb-10 pt-[7.5rem] md:px-10 md:pb-14 md:pt-[8.5rem] lg:px-14">
        <div className="flex flex-1 flex-col justify-center py-8 md:max-w-[58%] lg:max-w-[52%]">
          <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-hot-fuchsia md:text-[0.7rem]">
            YOUR NEXT CHAPTER STARTS HERE
          </p>

          <h1 className="hero-headline mt-5 text-[clamp(2.4rem,5.8vw,4.75rem)] leading-[0.92] md:mt-6 md:text-[clamp(2.75rem,4.2vw,5.25rem)]">
            <span className="block overflow-hidden">
              <span data-hero-line className="inline-block text-white">BUILD YOUR</span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="inline-block text-hot-fuchsia">STRENGTH.</span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="inline-block text-white">DEFINE YOUR</span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="inline-block text-white">PHYSIQUE.</span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="inline-block text-white">OWN YOUR</span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="inline-block hero-outline">CONFIDENCE.</span>
            </span>
          </h1>

          <p className="font-body mt-7 max-w-md text-[0.9rem] font-normal leading-relaxed text-white/95 md:mt-8 md:text-base">
            Purposeful training. Personal guidance. A stronger you.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center md:mt-10 md:gap-4">
            <Link
              href="/apply"
              className="font-body inline-flex w-full items-center justify-center bg-hot-fuchsia px-6 py-3.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-power-black transition-colors hover:bg-[#ff3da8] btn-press sm:w-auto sm:min-w-[11rem] md:text-[0.72rem]"
            >
              APPLY FOR COACHING
            </Link>
            <Link
              href="/services"
              className="font-body inline-flex w-full items-center justify-center border border-white bg-transparent px-6 py-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10 btn-press sm:w-auto sm:min-w-[11rem] md:text-[0.72rem]"
            >
              EXPLORE COACHING
            </Link>
          </div>
        </div>

        <div className="relative mt-auto flex items-end justify-between pt-8">
          <div className="flex items-center gap-4">
            <span className="hidden h-px w-14 bg-white/90 sm:block" aria-hidden />
            <p className="font-body text-[0.58rem] font-medium uppercase tracking-[0.32em] text-white/90 sm:text-[0.62rem]">
              1 ON 1 STRENGTH &amp; PHYSIQUE COACHING
            </p>
          </div>
          <a
            href="#next-section"
            className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 pb-1 text-white/80 transition-opacity hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hot-fuchsia"
            aria-label="Scroll to next section"
          >
            <ScrollChevron />
          </a>
        </div>
      </div>
    </section>
  );
}
