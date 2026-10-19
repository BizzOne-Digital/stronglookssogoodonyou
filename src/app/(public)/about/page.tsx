import { PageHero } from "@/components/ui/PageHero";
import { InsideFitnessMagazine } from "@/components/about/InsideFitnessMagazine";
import { MeetJoannaBio } from "@/components/about/MeetJoannaBio";
import { ContentSection, ProseList } from "@/components/ui/ContentSection";
import { PageCta } from "@/components/ui/PageCta";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";
import { SectionImageSplit } from "@/components/ui/SectionImage";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata = { title: "About Joanna" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="FOUNDER"
        title="Joanna Michel"
        description="A competitive bodybuilding athlete and fitness professional, and the founder of STRONG LOOKS GOOD ON YOU™. Coaching is online, personal, and built around the woman you are becoming."
        imageSrc={SITE_IMAGES.stageSpotlights}
        imageAlt="Competition stage with spotlight lighting"
      />

      <MeetJoannaBio dark showCta={false} />

      <InsideFitnessMagazine dark />

      <ContentSection
        label="PHILOSOPHY"
        title="Strength with intention"
        lead="This is coaching for women who want to train with purpose, whether you're new to the gym, returning after time away, or preparing for a deeper commitment to physique or performance."
      >
        <p>
          Programs are individualized to your experience, equipment, schedule, and goals. You will not be asked to chase unrealistic timelines or punished for being human. Progress is built through consistency, honest check ins, and adjustments that respect your life outside the gym.
        </p>
        <p>
          {BRAND.name} is rooted in empowerment: you do not need to change your body to have worth, but if strength, definition, and confidence are what you are working toward, you deserve guidance that is clear, respectful, and sustainable.
        </p>
      </ContentSection>

      <ContentSection
        dark
        label="WHAT TO EXPECT"
        title="How Joanna coaches"
        lead="Every package includes personalized training and structured communication. The depth of check ins, consultations, and specialty support depends on the package you choose."
      >
        <ProseList
          dark
          items={[
            "Personalized strength programming aligned with your goals and equipment",
            "Scheduled progress check ins, frequency based on your package",
            "Training adjustments as you adapt, travel, or face schedule changes",
            "Nutrition guidance within professional scope, no medical claims",
            "Accountability that motivates without shame or comparison",
            "Direct, supportive communication during agreed business hours",
          ]}
        />
      </ContentSection>

      <SectionImageSplit
        src={SITE_IMAGES.lifestyleDesk}
        alt="Online coaching lifestyle, workspace and training gear"
        imagePosition="right"
      >
        <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">ONLINE COACHING</p>
        <h2 className="mt-4 font-display text-3xl uppercase md:text-4xl">Wherever you are, we build from there</h2>
        <p className="mt-6 text-lg text-power-black/75">
          Coaching is delivered online with programs, check ins, and messaging structured around your time zone. You train in your gym or home setup; Joanna provides the plan, feedback, and accountability.
        </p>
        <p className="mt-4 text-power-black/75">
          Not sure which package fits? Start with the application and select &ldquo;Help me choose,&rdquo; or book a consultation to discuss timing and fit.
        </p>
        <div className="flex flex-wrap gap-4 pt-6">
          <Button href="/apply">Apply for Coaching</Button>
          <Button href="/services" variant="secondary">View Packages</Button>
        </div>
      </SectionImageSplit>

      <PageCta
        title="Work with Joanna"
        body="Share your story, your schedule, and what you want from coaching. Applications are reviewed with care, no pressure, no hard sell."
      />
    </>
  );
}
