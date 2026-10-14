import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { ContentSection } from "@/components/ui/ContentSection";
import { PageCta } from "@/components/ui/PageCta";
import { getPublicTeam } from "@/lib/data/public";
import { PLACEHOLDER_IMAGES } from "@/lib/assets";
import { BRAND } from "@/lib/constants";

export const metadata = { title: "Our Team" };

export default async function TeamPage() {
  let members: {
    name: string;
    role: string;
    bio: string;
    photo?: string;
  }[] = [];

  try {
    const team = await getPublicTeam();
    members = team.map((m) => ({
      name: m.name,
      role: m.role,
      bio: m.bio,
      photo: undefined,
    }));
  } catch {
    members = [];
  }

  if (members.length === 0) {
    members = [
      {
        name: "Joanna Michel",
        role: "Founder & Coach",
        bio:
          "Competitive bodybuilding athlete and coach behind STRONG LOOKS GOOD ON YOU™. Joanna leads programming, check ins, and client communication for coaching clients, bringing purposeful strength training, accountability, and sustainable habits to women online worldwide.",
        photo: PLACEHOLDER_IMAGES.aboutPortrait,
      },
    ];
  }

  return (
    <>
      <PageHero
        label="TEAM"
        title="The people behind the brand"
        description={`${BRAND.name} is founder led today, with room to grow. Team profiles are managed in admin so future coaches or collaborators can be added with photos, roles, and bios when the business expands.`}
        dark
      />
      <section className="bg-power-black py-20 text-clean-white md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-20">
            {members.map((m) => (
              <article key={m.name} className="grid items-center gap-10 md:grid-cols-12">
                <div className="relative aspect-square md:col-span-4 overflow-hidden">
                  <Image
                    src={m.photo || PLACEHOLDER_IMAGES.aboutPortrait}
                    alt={m.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <div className="md:col-span-8">
                  <h2 className="font-display text-4xl uppercase">{m.name}</h2>
                  <p className="mt-2 text-lg text-hot-fuchsia">{m.role}</p>
                  <p className="mt-6 text-lg leading-relaxed text-soft-silver">{m.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContentSection
        label="GROWING INTENTIONALLY"
        title="One team, strong foundation"
        lead="Even with a single listed coach, this page is designed to feel complete, not empty. When new team members join, their stories will appear here in the order set in admin."
      >
        <p>
          Interested in coaching with Joanna? Start with the application or book a consultation to discuss goals and package fit.
        </p>
      </ContentSection>
      <PageCta />
    </>
  );
}
