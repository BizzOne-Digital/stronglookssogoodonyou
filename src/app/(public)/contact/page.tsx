import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { ContentSection } from "@/components/ui/ContentSection";
import { ContactForm } from "@/components/forms/ContactForm";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="CONTACT"
        title="Let's connect"
        description="Questions before you apply? Wondering which package fits your season of life? Reach out by email, Instagram, or the form below. Coaching is online, there is no public studio address or phone line."
        imageSrc={SITE_IMAGES.gymMatDumbbell}
        imageAlt="Dumbbell and yoga mat in a training space"
      />
      <section className="bg-clean-white py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 md:grid-cols-2 md:px-8">
          <div className="space-y-10">
            <div>
              <p className="font-display text-xs tracking-[0.3em] text-hot-fuchsia">EMAIL</p>
              <a className="mt-2 block text-lg hover:text-hot-fuchsia" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>
              <p className="mt-3 text-sm text-power-black/60">
                Best for detailed questions, application follow ups, and scheduling notes.
              </p>
            </div>
            <div>
              <p className="font-display text-xs tracking-[0.3em] text-hot-fuchsia">INSTAGRAM</p>
              <a
                className="mt-2 block text-lg hover:text-hot-fuchsia"
                href={BRAND.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {BRAND.instagram.handle}
              </a>
              <p className="mt-3 text-sm text-power-black/60">
                Follow along for training energy, brand updates, and community.
              </p>
            </div>
            <div className="border-t border-power-black/10 pt-8">
              <p className="font-display text-xs tracking-[0.3em] text-hot-fuchsia">READY TO START?</p>
              <p className="mt-3 text-power-black/75">
                The coaching application captures everything needed to review fit, goals, schedule, equipment, and package preference.
              </p>
              <Button href="/apply" className="mt-6">Apply for Coaching</Button>
              <p className="mt-6 text-sm text-power-black/60">
                Prefer the full intake?{" "}
                <Link href="/apply" className="text-hot-fuchsia underline">
                  Use the application form
                </Link>
                . Want to talk first?{" "}
                <Link href="/booking" className="text-hot-fuchsia underline">
                  Book a consultation
                </Link>
                .
              </p>
            </div>
          </div>
          <div>
            <p className="mb-6 font-display text-sm uppercase tracking-widest">Send a message</p>
            <ContactForm />
          </div>
        </div>
      </section>
      <ContentSection
        label="RESPONSE"
        title="What to expect"
        lead="Inquiries are saved to our system and notification is sent when email is configured. You will see a confirmation on screen when your message is received. Response timing depends on coaching availability and should be confirmed directly with Joanna."
      />
    </>
  );
}
