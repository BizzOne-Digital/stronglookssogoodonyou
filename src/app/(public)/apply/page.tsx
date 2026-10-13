import { PageHero } from "@/components/ui/PageHero";
import { ContentSection, ProseList } from "@/components/ui/ContentSection";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { getPublicServices } from "@/lib/data/public";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata = { title: "Apply for Coaching" };

type Props = { searchParams: Promise<{ package?: string }> };

export default async function ApplyPage({ searchParams }: Props) {
  const sp = await searchParams;
  let packages: { slug: string; name: string }[] = [];
  try {
    const svc = await getPublicServices();
    packages = svc.map((s) => ({ slug: s.slug, name: s.name }));
  } catch {
    packages = [
      { slug: "physique-reset", name: "PHYSIQUE RESET" },
      { slug: "physique-transformation", name: "PHYSIQUE TRANSFORMATION" },
      { slug: "lifestyle-transformation", name: "LIFESTYLE TRANSFORMATION" },
      { slug: "bodybuilding-competition-prep", name: "BODYBUILDING COMPETITION PREP" },
    ];
  }

  return (
    <>
      <PageHero
        label="APPLY"
        title="Apply for coaching"
        description="This application helps Joanna understand your goals, experience, schedule, and equipment so she can recommend the right level of support. It takes a few minutes. You must be 18 or older to apply."
        imageSrc={SITE_IMAGES.gymPowerRack}
        imageAlt="Strength training in a modern gym"
      />
      <section className="border-b border-white/10 bg-power-black py-12 text-clean-white">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <ProseList
            dark
            items={[
              "We do not request progress photos, medical records, or unnecessary sensitive information on this form",
              "Your submission is stored securely and reviewed for coaching fit",
              "You will see a confirmation screen when your application is received",
              "Preferred contact method can be email or Instagram",
            ]}
          />
        </div>
      </section>
      <ContentSection
        dark
        label="WHAT HAPPENS NEXT"
        title="After you submit"
        lead="Applications are reviewed thoughtfully. Follow-up happens via your preferred contact method. Package enrollment and payment details are discussed after fit is confirmed—not through this form alone."
      />
      <section className="bg-power-black pb-24 pt-8 text-clean-white">
        <div className="mx-auto max-w-2xl px-4 md:px-8">
          <ApplyForm packages={packages} defaultPackage={sp.package} />
        </div>
      </section>
    </>
  );
}
