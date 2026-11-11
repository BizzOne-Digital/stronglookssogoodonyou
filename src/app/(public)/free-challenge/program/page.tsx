import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connectMongo } from "@/lib/mongodb";
import { ChallengeSubscriber } from "@/models/ChallengeSubscriber";
import { Disclaimer } from "@/components/challenge/Disclaimer";
import { DailyChecklist } from "@/components/challenge/DailyChecklist";
import { TrackView, TrackedLink, CTA_PRIMARY } from "@/components/challenge/Track";
import { CoachingSection, Program28Section } from "@/components/challenge/UpsellSections";
import { SCHEDULE } from "@/lib/challenge";
import { isToken } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Your 7-Day Program",
  robots: { index: false, follow: false },
};

export default function ProgramPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-clean-white" />}>
      <ProgramContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProgramContent({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  let subscriber: { firstName: string } | null = null;
  if (isToken(t)) {
    await connectMongo();
    subscriber = await ChallengeSubscriber.findOne({ accessToken: t }).select("firstName").lean();
  }

  if (!subscriber || !isToken(t)) {
    return (
      <section className="flex min-h-screen items-center bg-clean-white px-4 pt-28 text-power-black">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-display text-4xl uppercase">Access link needed</h1>
          <p className="mt-4 text-power-black/75">
            This program is available to registered participants. Use the link in your welcome email, or register for free below.
          </p>
          <Link href="/free-challenge#signup" className={`${CTA_PRIMARY} mt-8`}>
            Register free
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <TrackView name="program_view" />
      <Disclaimer id="program-disclosure" />
      <section className="bg-clean-white py-14 text-power-black md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">YOUR 7-DAY PROGRAM</p>
          <h1 className="mt-3 font-display text-4xl uppercase md:text-6xl">Welcome, {subscriber.firstName}.</h1>
          <p className="mt-4 text-lg text-power-black/75">
            Seven days of full-body training, about 30 to 45 minutes each, with home and gym options and beginner-friendly
            modifications. Bookmark this page.
          </p>

          <div className="mt-8 border border-hot-fuchsia bg-white p-6">
            <h2 className="font-display text-2xl uppercase">Your workout plans</h2>
            <p className="mt-2 text-power-black/75">
              Download the full PDF for all seven daily workout plans, warm-up and recovery guidance, exercise
              modifications and your completion checklist.
            </p>
            <TrackedLink
              plain
              href={`/api/challenge/pdf?t=${t}`}
              event="pdf_click"
              className={`${CTA_PRIMARY} mt-5 w-full sm:w-auto`}
            >
              Download the 7-day PDF
            </TrackedLink>
          </div>

          <h2 className="mt-12 font-display text-3xl uppercase">Daily completion checklist</h2>
          <div className="mt-4">
            <DailyChecklist />
          </div>

          <h2 className="mt-12 font-display text-3xl uppercase">The week at a glance</h2>
          <ol className="mt-4 divide-y divide-power-black/10 border-y border-power-black/10">
            {SCHEDULE.map((s) => (
              <li key={s.day} className="flex gap-4 py-3">
                <span className="w-16 font-display text-xl text-hot-fuchsia">Day {s.day}</span>
                <span>{s.workout}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <Program28Section token={t} />
      <CoachingSection />
    </>
  );
}
