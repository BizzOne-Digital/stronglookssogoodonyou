import { PageHero } from "@/components/ui/PageHero";
import { ContentSection, ProseList } from "@/components/ui/ContentSection";
import { BookingForm } from "@/components/forms/BookingForm";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata = { title: "Booking" };

export default function BookingPage() {
  return (
    <>
      <PageHero
        label="BOOKING"
        title="Schedule a consultation"
        description="Use this form to request or book a consultation conversation about coaching fit, timing, and packages. Booking a consultation does not purchase or enroll you in a coaching package."
        imageSrc={SITE_IMAGES.lifestyleDesk}
        imageAlt="Plan your coaching journey"
      />
      <ContentSection
        label="BEFORE YOU BOOK"
        title="What this is—and what it isn't"
        lead="A consultation is a chance to ask questions and align expectations. Enrollment happens through the coaching application and agreed package terms—not through this booking form alone."
      >
        <ProseList
          items={[
            "Consultation booking is separate from package payment and enrollment",
            "In request-only mode, your preferred times are reviewed before confirmation",
            "When available-slot mode is enabled, you may select open times in your time zone",
            "You will receive confirmation that your request was received; final times are confirmed by the coach when applicable",
          ]}
        />
      </ContentSection>
      <section className="bg-power-black py-16 text-clean-white md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:px-8">
          <div className="text-soft-silver">
            <p className="font-display text-xs tracking-[0.35em] text-hot-fuchsia">TIP</p>
            <p className="mt-4 leading-relaxed">
              Include your time zone and a few windows that work for you. If you already know which package interests you, mention it in your notes—you can still complete the full application afterward.
            </p>
            <p className="mt-6 leading-relaxed">
              For detailed package inclusions and durations, visit the Services page before your call so you can arrive with informed questions.
            </p>
          </div>
          <div className="bg-clean-white p-6 text-power-black md:p-8">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
