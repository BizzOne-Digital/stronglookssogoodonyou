import { PageHero } from "@/components/ui/PageHero";
import { ContentSection, ProseList } from "@/components/ui/ContentSection";
import { PageCta } from "@/components/ui/PageCta";
import { Button } from "@/components/ui/Button";
import { SectionImageSplit } from "@/components/ui/SectionImage";
import { SITE_IMAGES } from "@/lib/site-images";

const steps = [
  {
    n: "01",
    title: "Apply & share your goals",
    body:
      "Complete the coaching application with your experience, schedule, equipment access, and what you want from training. Choose a package or select Help me choose if you are still deciding.",
  },
  {
    n: "02",
    title: "Review needs & fit",
    body:
      "Your application is reviewed to confirm coaching fit, package alignment, and communication expectations. This is a conversation about support—not a judgment of where you are starting.",
  },
  {
    n: "03",
    title: "Follow your personalized plan",
    body:
      "Receive a tailored strength program with clear training structure. Adjustments are made as you progress, travel, or navigate life events—consistency matters more than perfection.",
  },
  {
    n: "04",
    title: "Check in, adjust, build consistency",
    body:
      "Scheduled check-ins (frequency depends on your package) keep you accountable. Progress photos, measurements, and feedback inform next steps—so you are always training with intention.",
  },
];

export const metadata = { title: "Coaching Method" };

export default function CoachingMethodPage() {
  return (
    <>
      <PageHero
        label="METHOD"
        title="How coaching works"
        description="A clear path from application to sustainable training: personalized programming, progress monitoring, accountability, and habits that support your physique and performance goals—without promising outcomes that depend on factors outside your control."
        imageSrc={SITE_IMAGES.journalFlatlay}
        imageAlt="Training journal and workout essentials"
      />
      <section className="bg-clean-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            {steps.map((s) => (
              <div key={s.n} className="border-l-4 border-hot-fuchsia pl-8">
                <p className="font-display text-4xl text-power-black/20">{s.n}</p>
                <h2 className="mt-2 font-display text-2xl uppercase">{s.title}</h2>
                <p className="mt-4 leading-relaxed text-power-black/75">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionImageSplit
        src={SITE_IMAGES.gymPowerRack}
        alt="Power rack and barbell in a strength gym"
        imagePosition="left"
        dark
      >
        <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">TRAINING</p>
        <h2 className="mt-4 font-display text-3xl uppercase md:text-4xl">Purposeful strength work</h2>
        <p className="mt-6 text-lg text-soft-silver">
          Programs emphasize progressive strength training with structure you can follow in commercial gyms, home setups, or hybrid environments—based on what you report on your application.
        </p>
        <p className="mt-4 text-soft-silver">
          You will not receive random workouts. Sessions are organized to support your goals—physique development, consistency, lifestyle balance, or competition prep—within the scope of your package and Joanna&apos;s qualifications.
        </p>
      </SectionImageSplit>

      <ContentSection
        label="ACCOUNTABILITY"
        title="Check-ins that keep you honest—with kindness"
        lead="Package terms define check-in frequency. Some plans include video consultations; others focus on messaging and structured reviews. All are designed to help you stay engaged long enough to see real habit change."
      >
        <ProseList
          items={[
            "Progress photos, scale weight, and measurements when appropriate to your goals",
            "Feedback on training execution and adherence",
            "Adjustments when life happens—travel, work spikes, or schedule shifts",
            "Celebration of consistency, not punishment for imperfection",
          ]}
        />
      </ContentSection>

      <ContentSection
        dark
        bordered
        label="NUTRITION & LIFESTYLE"
        title="Guidance within scope"
        lead="Nutrition support is educational and practical—aligned with Joanna's professional qualifications. This is not medical nutrition therapy. Competition prep includes additional planning where appropriate to the package."
      >
        <p>
          Lifestyle packages include strategies for navigating events, holidays, and busy seasons while protecting long-term progress. The goal is a routine you can maintain—not a short sprint you cannot wait to end.
        </p>
        <Button href="/services" className="mt-8">Compare Packages</Button>
      </ContentSection>

      <PageCta />
    </>
  );
}
