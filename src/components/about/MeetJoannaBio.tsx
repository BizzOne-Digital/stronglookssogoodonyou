import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";

export const JOANNA_PORTRAIT = "/images/joanna-michel.jpg";

export function MeetJoannaBio({
  dark = false,
  showCta = true,
}: {
  dark?: boolean;
  showCta?: boolean;
}) {
  const bg = dark ? "bg-power-black text-clean-white" : "bg-clean-white text-power-black";
  const body = dark ? "text-soft-silver" : "text-power-black/80";
  const headingAccent = "text-hot-fuchsia";

  return (
    <section className={`${bg} py-16 md:py-24`}>
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-6 md:grid-cols-12 md:gap-14 md:px-10 lg:px-14">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden md:col-span-5 md:max-w-none">
          <Image
            src={JOANNA_PORTRAIT}
            alt="Joanna Michel, founder of STRONG LOOKS GOOD ON YOU"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 90vw, 40vw"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
            aria-hidden
          />
        </div>

        <div className="md:col-span-7">
          <p className={`font-display text-xs tracking-[0.4em] ${headingAccent}`}>SMALL BIO</p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-tight md:text-4xl lg:text-5xl">
            Meet Joanna Michel
          </h2>

          <div className={`mt-8 space-y-6 text-base leading-relaxed md:text-lg ${body}`}>
            <p>
              Joanna Michel is a competitive bodybuilding athlete and fitness professional whose fitness journey began in 2015. With experience spanning HIIT, strength training, obstacle racing, and competitive bodybuilding, Joanna brings a disciplined, progress-focused perspective to fitness.
            </p>
            <p>
              Her competitive achievements include an{" "}
              <strong className={dark ? "text-clean-white" : "text-power-black"}>
                Overall Figure title in 2025
              </strong>
              ,{" "}
              <strong className={dark ? "text-clean-white" : "text-power-black"}>
                2nd place in the Top Five at Canada&apos;s Natural Pro Qualifier on August 2, 2026
              </strong>
              , and an{" "}
              <strong className={dark ? "text-clean-white" : "text-power-black"}>
                Overall Masters 35+ title in 2026
              </strong>
              .
            </p>
            <p>
              Through <strong className={dark ? "text-clean-white" : "text-power-black"}>{BRAND.name}</strong>, Joanna is building a fitness brand centered on strength, physique development, consistency, and confidence. Her mission is to help women at different stages of life take ownership of their fitness journeys and work toward stronger, more confident versions of themselves.
            </p>
          </div>

          <p className="mt-10 font-display text-lg uppercase leading-snug tracking-tight text-hot-fuchsia md:text-xl">
            Build Your Strength. Define Your Physique. Own Your Confidence.
          </p>

          {showCta && (
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/about" variant={dark ? "secondary" : "primary"} className={dark ? "border-clean-white text-clean-white hover:bg-clean-white hover:text-power-black" : ""}>
                Read Full Story
              </Button>
              <Link
                href="/apply"
                className={`font-body inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] ${headingAccent} hover:underline`}
              >
                Apply for Coaching
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
