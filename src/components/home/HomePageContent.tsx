import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HomeMotion } from "@/components/home/HomeMotion";
import { HomeHero } from "@/components/home/HomeHero";
import { InsideFitnessMagazine } from "@/components/about/InsideFitnessMagazine";
import { MeetJoannaBio } from "@/components/about/MeetJoannaBio";
import { HomeGalleryPreview } from "@/components/home/HomeGalleryPreview";
import { SITE_IMAGES } from "@/lib/site-images";
import type { PublicGalleryImage, PublicService } from "@/lib/data/public";
import { adminTextToPlain } from "@/lib/admin-text";
import { FramedImage } from "@/components/ui/FramedImage";
import { resolvePackageImage } from "@/lib/service-images";
import { WorkoutVideo } from "@/components/media/WorkoutVideo";

type Props = {
  intro?: string;
  nextChapter?: { heading?: string; body?: string };
  services: PublicService[];
  testimonials: { displayName: string; quote: string; packageName?: string }[];
  galleryPreview: PublicGalleryImage[];
  showPrices: boolean;
};

export function HomePageContent({
  intro,
  nextChapter,
  services,
  testimonials,
  galleryPreview,
}: Props) {
  return (
    <HomeMotion>
      <HomeHero />

      <MeetJoannaBio />

      <InsideFitnessMagazine />

      <section
        id="next-section"
        className="relative overflow-x-clip overflow-y-visible bg-clean-white py-24 md:py-32"
      >
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:items-center md:px-8">
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-[4/5]">
            <Image
              src={SITE_IMAGES.gymWide}
              alt="Modern strength training gym with pink accent lighting"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 40vw"
            />
          </div>
          <div className="space-y-6">
            <div>
              <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">YOUR JOURNEY</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-tight md:text-5xl">
                {nextChapter?.heading || "YOUR NEXT CHAPTER STARTS HERE"}
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-power-black/80">
              <p>
                {adminTextToPlain(
                  nextChapter?.body ||
                    "Training that meets you where you are, and moves you toward the physique and confidence you're building on purpose."
                )}
              </p>
              <p>
                {adminTextToPlain(
                  intro ||
                    "Whether you're starting from zero, starting over, or ready to level up, build strength with purposeful training, personalized guidance, and accountability."
                )}
              </p>
              <p>
                Online 1 on 1 coaching for women who want structure without shame, beginners, returners, and athletes preparing for their next season.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        data-horizontal-scroll
        className="relative max-w-[100vw] overflow-x-clip bg-power-black text-clean-white lg:flex lg:min-h-[100svh] lg:flex-col"
      >
        <div
          data-horizontal-intro
          className="shrink-0 px-4 py-16 md:px-8 lg:py-10 lg:pb-6"
        >
          <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">COACHING</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl uppercase md:text-5xl">
            Packages built for real life, and real strength
          </h2>
          <p className="mt-6 max-w-2xl text-soft-silver">
            From a focused reset to lifestyle long accountability and competition prep, each package is tailored to your experience, schedule, and equipment. Explore details on the{" "}
            <Link href="/services" className="text-hot-fuchsia underline">Services</Link> page or apply with &ldquo;Help me choose.&rdquo;
          </p>
          <p
            data-horizontal-hint
            className="mt-6 hidden text-xs uppercase tracking-[0.25em] text-soft-silver/80 lg:block"
          >
            Scroll to explore each package
          </p>
        </div>
        <div
          data-horizontal-viewport
          className="max-w-full overflow-x-auto overscroll-x-contain pb-16 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-1 lg:min-h-0 lg:overflow-hidden lg:pb-10 [&::-webkit-scrollbar]:hidden"
        >
          <div
            data-horizontal-track
            className="flex w-max max-w-none gap-4 px-4 will-change-transform sm:gap-6 md:px-8 lg:gap-8 lg:py-1"
          >
            {services.map((svc) => {
              const pkgImage = resolvePackageImage(svc.slug, svc.imageUrl, svc.name);
              return (
              <article
                key={svc.id}
                data-horizontal-card
                className="flex w-[min(85vw,calc(100vw-2rem))] max-w-md shrink-0 flex-col overflow-hidden border border-white/15 bg-power-black md:w-[min(420px,38vw)]"
              >
                <FramedImage
                  src={pkgImage.src}
                  alt={pkgImage.alt}
                  presentation={pkgImage.presentation}
                  sizes="(max-width:768px) 85vw, 420px"
                  className="w-full shrink-0"
                />
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-display text-2xl uppercase leading-tight">{svc.name}</h3>
                <p className="mt-2 text-sm text-soft-silver">{svc.tagline}</p>
                <p className="mt-4 text-xs tracking-widest text-soft-silver">
                  {svc.durationLabel}
                  {svc.priceDisplay ? ` · ${svc.priceDisplay}` : " · Contact for pricing"}
                </p>
                <Button href={`/apply?package=${svc.slug}`} className="mt-6 w-full justify-center">
                  Apply
                </Button>
                </div>
              </article>
            );
            })}
          </div>
        </div>
      </section>

      <WorkoutVideo />

      <section className="bg-clean-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">WHO IT&apos;S FOR</p>
          <h2 className="mt-4 font-display text-4xl uppercase md:text-5xl">
            Women ready for their next chapter
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-power-black/80">
            Starting out, starting over, or leveling up, after life changes, motherhood, relocation, or simply wanting to train with more intention. Beginners and experienced athletes are welcome.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 text-power-black/75">
            <li className="border-l-2 border-hot-fuchsia pl-4">Purposeful strength training, not random workouts</li>
            <li className="border-l-2 border-hot-fuchsia pl-4">Progress check ins that keep you accountable</li>
            <li className="border-l-2 border-hot-fuchsia pl-4">Guidance that fits real schedules and real life</li>
            <li className="border-l-2 border-hot-fuchsia pl-4">Respectful coaching, no guilt, no unrealistic promises</li>
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/about">About Joanna</Button>
            <Button href="/coaching-method" variant="secondary">How coaching works</Button>
          </div>
        </div>
      </section>

      <HomeGalleryPreview images={galleryPreview} />

      <section className="bg-power-black py-20 text-clean-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-3 md:px-8">
          <div className="relative min-h-[200px] overflow-hidden border border-white/10 p-6">
            <Image
              src={SITE_IMAGES.journalFlatlay}
              alt="Fitness journal and training essentials"
              fill
              className="object-cover opacity-40"
              sizes="33vw"
            />
            <div className="relative">
              <p className="font-display text-xs tracking-[0.35em] text-hot-fuchsia">METHOD</p>
              <h2 className="mt-3 font-display text-2xl uppercase">Apply, Plan, Progress</h2>
              <p className="mt-4 text-sm text-soft-silver">
                Share your goals, receive a personalized program, and build consistency through scheduled check ins and honest feedback.
              </p>
              <Link href="/coaching-method" className="mt-4 inline-block text-xs uppercase tracking-widest text-hot-fuchsia hover:underline">
                See the full method
              </Link>
            </div>
          </div>
          <div className="relative min-h-[200px] overflow-hidden border border-white/10 p-6">
            <Image
              src={SITE_IMAGES.yogaStudio}
              alt="Yoga mat and mobility tools in a studio"
              fill
              className="object-cover opacity-40"
              sizes="33vw"
            />
            <div className="relative">
              <p className="font-display text-xs tracking-[0.35em] text-hot-fuchsia">TRAINING SPACE</p>
              <h2 className="mt-3 font-display text-2xl uppercase">Train where you are</h2>
              <p className="mt-4 text-sm text-soft-silver">
                Commercial gym, home setup, or hybrid, programs are built around the equipment you actually have.
              </p>
              <Link href="/services" className="mt-4 inline-block text-xs uppercase tracking-widest text-hot-fuchsia hover:underline">
                View packages
              </Link>
            </div>
          </div>
          <div className="relative min-h-[200px] overflow-hidden border border-white/10 p-6">
            <Image
              src={SITE_IMAGES.lifestyleDesk}
              alt="Desk workspace with fitness lifestyle accessories"
              fill
              className="object-cover opacity-40"
              sizes="33vw"
            />
            <div className="relative">
              <p className="font-display text-xs tracking-[0.35em] text-hot-fuchsia">QUESTIONS</p>
              <h2 className="mt-3 font-display text-2xl uppercase">FAQs</h2>
              <p className="mt-4 text-sm text-soft-silver">
                Packages, online coaching, equipment, nutrition scope, and how to apply, answered in plain language.
              </p>
              <Link href="/faqs" className="mt-4 inline-block text-xs uppercase tracking-widest text-hot-fuchsia hover:underline">
                Read FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-clean-white py-16">
        <div className="overflow-hidden border-y border-power-black/10 py-6">
          <div className="marquee-track font-display text-4xl uppercase tracking-tight md:text-6xl">
            <span className="px-8">Strength · Discipline · Confidence ·</span>
            <span className="px-8">Strong Looks Good On You ·</span>
            <span className="px-8">Strength · Discipline · Confidence ·</span>
            <span className="px-8">Strong Looks Good On You ·</span>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-power-black py-24 text-clean-white md:py-32">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">STORIES</p>
            <h2 className="mt-4 font-display text-4xl uppercase">Client voices</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {testimonials.slice(0, 2).map((t) => (
                <blockquote key={t.displayName} className="border-l-2 border-hot-fuchsia pl-6">
                  <p className="text-lg">&ldquo;{adminTextToPlain(t.quote)}&rdquo;</p>
                  <footer className="mt-4 text-sm text-soft-silver">{t.displayName}
                    {t.packageName ? ` · ${t.packageName}` : ""}
                  </footer>
                </blockquote>
              ))}
            </div>
            <Link href="/testimonials" className="mt-8 inline-block text-sm uppercase tracking-widest text-hot-fuchsia hover:underline">
              View all stories
            </Link>
          </div>
        </section>
      )}

      <section className="relative bg-hot-fuchsia py-24 text-clean-white md:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <h2 className="font-display text-4xl uppercase md:text-6xl">Ready to apply?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm md:text-base">
            Share your goals and let&apos;s see if coaching is the right fit.
          </p>
          <Button href="/apply" variant="secondary" className="mt-8 border-clean-white bg-clean-white text-power-black hover:bg-power-black hover:text-clean-white">
            Apply for Coaching
          </Button>
        </div>
      </section>
    </HomeMotion>
  );
}
