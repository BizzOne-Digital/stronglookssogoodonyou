import Link from "next/link";
import { COACHING_OFFERS, PROGRAM_28, PROGRAM_28_INCLUDES } from "@/lib/challenge";
import { CTA_PRIMARY, CTA_SECONDARY, TrackedLink } from "@/components/challenge/Track";

/** `token` lets the checkout pre-fill the participant's email. */
export function Program28Section({ token }: { token?: string }) {
  const href = `/api/checkout/28-day${token ? `?t=${token}` : ""}`;
  return (
    <section className="bg-power-black py-16 text-clean-white md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:px-8">
        <div>
          <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">NEXT LEVEL</p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-tight md:text-5xl">Ready for your next level?</h2>
          <p className="mt-5 text-lg text-soft-silver">
            Four weeks of structured training designed to help you develop strength, consistency and muscular endurance.
          </p>
          <p className="mt-6 font-display text-5xl text-hot-fuchsia">{PROGRAM_28.priceLabel}</p>
          <p className="mt-1 text-sm text-soft-silver">Introductory price. One-time payment, secure checkout.</p>
          <TrackedLink plain href={href} event="checkout_click" className={`${CTA_PRIMARY} mt-8 w-full md:w-auto`}>
            {PROGRAM_28.ctaLabel}
          </TrackedLink>
          <p className="mt-3 text-xs text-soft-silver">
            Digital product. See the <Link href="/terms" className="underline">Digital Product Terms</Link>.
          </p>
        </div>
        <ul className="space-y-3 text-soft-silver">
          {PROGRAM_28_INCLUDES.map((i) => (
            <li key={i} className="flex gap-3 border-b border-white/10 pb-3">
              <span className="text-hot-fuchsia" aria-hidden>+</span>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CoachingSection() {
  return (
    <section className="bg-clean-white py-16 text-power-black md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">COACHING</p>
        <h2 className="mt-4 font-display text-4xl uppercase leading-tight md:text-5xl">Ready for personalized support?</h2>
        <p className="mt-3 font-display text-xl uppercase tracking-wide text-power-black/70">
          Take the next step with Joanna Michel Fitness.
        </p>
        <p className="mt-5 max-w-3xl text-lg text-power-black/75">
          Our coaching services are designed for individuals seeking structured programming, accountability and
          individualized fitness guidance.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {COACHING_OFFERS.map((o) => (
            <li key={o.term} className="border border-power-black/15 bg-white p-6">
              <p className="text-xs uppercase tracking-widest text-power-black/60">{o.term}</p>
              <p className="mt-2 font-display text-4xl text-hot-fuchsia">{o.price}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-power-black/60">
          Starting offers. Final coaching services, inclusions and pricing are confirmed on the coaching page.
        </p>
        <TrackedLink
          href="/services"
          event="coaching_click"
          className={`${CTA_SECONDARY} mt-8 w-full !border-power-black !text-power-black hover:!bg-power-black hover:!text-clean-white md:w-auto`}
        >
          Explore personalized coaching
        </TrackedLink>
      </div>
    </section>
  );
}

export function BrandMessage() {
  return (
    <section className="bg-power-black py-16 text-center text-clean-white md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-display text-4xl uppercase text-hot-fuchsia md:text-6xl">Strong looks good on you.</h2>
        <p className="mt-6 text-lg text-soft-silver">
          We believe fitness should be accessible, empowering and sustainable. Whether you are starting your fitness
          journey or looking to take your training to another level, Joanna Michel Fitness is here to help you build
          strength, confidence and consistency.
        </p>
        <p className="mt-6 font-display text-2xl uppercase tracking-wide">Start with seven days. Build habits that last.</p>
        <Link href="#signup" className={`${CTA_PRIMARY} mt-8`}>
          Start the free challenge
        </Link>
      </div>
    </section>
  );
}
