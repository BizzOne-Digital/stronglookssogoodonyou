import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { JOANNA_INTRO_PARAGRAPHS, JOANNA_TAGLINE } from "@/lib/joanna-story";

export const JOANNA_PORTRAIT = "/images/joanna-michel.jpg";

export function MeetJoannaBio({
  dark = false,
  showCta = true,
  condensed = false,
}: {
  dark?: boolean;
  showCta?: boolean;
  /** Home: shorter intro; About uses full client paragraphs. */
  condensed?: boolean;
}) {
  const bg = dark ? "bg-power-black text-clean-white" : "bg-clean-white text-power-black";
  const body = dark ? "text-soft-silver" : "text-power-black/80";
  const headingAccent = "text-hot-fuchsia";
  const paragraphs = condensed
    ? JOANNA_INTRO_PARAGRAPHS.slice(0, 1)
    : JOANNA_INTRO_PARAGRAPHS;

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
          <p className={`font-display text-xs tracking-[0.4em] ${headingAccent}`}>ABOUT</p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-tight md:text-4xl lg:text-5xl">
            Meet <strong className={dark ? "text-clean-white" : "text-power-black"}>Joanna Michel</strong>
          </h2>
          <p className={`mt-4 text-sm font-semibold uppercase tracking-[0.15em] ${headingAccent} md:text-base`}>
            {JOANNA_TAGLINE}
          </p>

          <div className={`mt-8 space-y-6 text-base leading-relaxed md:text-lg ${body}`}>
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>

          <p className="mt-10 font-display text-lg uppercase leading-snug tracking-tight text-hot-fuchsia md:text-xl">
            STRONG LOOKS GOOD ON YOU.
          </p>

          {showCta && (
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                href={condensed ? "/about" : "/services"}
                variant={dark ? "secondary" : "primary"}
                className={dark ? "border-clean-white text-clean-white hover:bg-clean-white hover:text-power-black" : ""}
              >
                {condensed ? "Read full story" : "View packages"}
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
