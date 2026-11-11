import Image from "next/image";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/challenge/Disclaimer";
import { ChallengeSignupForm } from "@/components/challenge/ChallengeSignupForm";
import { TrackView } from "@/components/challenge/Track";
import { UnsubscribeNotice } from "@/components/challenge/UnsubscribeNotice";
import { BrandMessage, CoachingSection, Program28Section } from "@/components/challenge/UpsellSections";
import { FREE_INCLUDES, SCHEDULE } from "@/lib/challenge";

export const metadata: Metadata = {
  title: "Free 7-Day Body Sculpting Experience",
  description:
    "Seven days of full-body workouts, at home or in the gym. A free, self-guided challenge from Joanna Michel Fitness. Strong looks good on you.",
};

export default function FreeChallengePage() {
  return (
    <>
      <TrackView name="challenge_view" />
      <Suspense fallback={null}>
        <UnsubscribeNotice />
      </Suspense>

      {/* 1. Disclosure comes first, before the offer, the form and any workout content. */}
      <Disclaimer />

      {/* 2. Free offer */}
      <section className="relative overflow-hidden bg-power-black text-clean-white">
        <Image
          src="/images/gallery/09-training-studio.jpg"
          alt=""
          fill
          className="object-cover opacity-35"
          sizes="100vw"
          priority
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-28">
          <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">FREE 7-DAY BODY SCULPTING EXPERIENCE</p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] md:text-8xl">
            Sculpt. Strengthen.
            <br />
            Sweat. <span className="text-hot-fuchsia">Transform.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-soft-silver md:text-xl">
            Seven days. Full-body workouts. Your choice of home or gym.
          </p>
          <p className="mt-4 max-w-2xl text-soft-silver">
            This self-guided challenge is designed to help you build strength, improve muscular endurance, increase
            activity and establish consistent fitness habits.
          </p>
          <a
            href="#signup"
            className="mt-8 inline-flex w-full items-center justify-center bg-hot-fuchsia px-8 py-4 font-display text-sm uppercase tracking-[0.2em] text-clean-white hover:bg-clean-white hover:text-power-black md:w-auto"
          >
            Get it free
          </a>
        </div>
      </section>

      <section className="bg-clean-white py-16 text-power-black md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-display text-3xl uppercase md:text-4xl">What is included</h2>
            <ul className="mt-6 space-y-3">
              {FREE_INCLUDES.map((i) => (
                <li key={i} className="flex gap-3 border-b border-power-black/10 pb-3">
                  <span className="text-hot-fuchsia" aria-hidden>+</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl uppercase md:text-4xl">Program schedule</h2>
            <table className="mt-6 w-full border-collapse text-left">
              <caption className="sr-only">7-day program schedule</caption>
              <thead>
                <tr className="border-b-2 border-power-black text-xs uppercase tracking-widest">
                  <th scope="col" className="py-2 pr-4">Day</th>
                  <th scope="col" className="py-2">Workout</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((s) => (
                  <tr key={s.day} className="border-b border-power-black/10">
                    <td className="py-3 pr-4 font-display text-2xl text-hot-fuchsia">{s.day}</td>
                    <td className="py-3">{s.workout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-power-black/70">
              Workout duration: approximately 30 to 45 minutes, with recovery and modifications as appropriate.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Signup */}
      <section id="signup" className="scroll-mt-24 bg-soft-silver/40 py-16 md:py-24">
        <div className="mx-auto max-w-xl px-4 md:px-8">
          <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">FREE</p>
          <h2 className="mt-3 mb-6 font-display text-4xl uppercase text-power-black">Start your 7 days</h2>
          <ChallengeSignupForm />
        </div>
      </section>

      {/* 4. Paid upsell, then 5. coaching */}
      <Program28Section />
      <CoachingSection />
      <BrandMessage />
    </>
  );
}
