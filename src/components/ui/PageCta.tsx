import { Button } from "@/components/ui/Button";

export function PageCta({
  title = "Ready for your next chapter?",
  body = "Apply for coaching or book a consultation to talk through fit, timing, and the package that matches your goals.",
  primaryHref = "/apply",
  primaryLabel = "Apply for Coaching",
  secondaryHref = "/booking",
  secondaryLabel = "Book a Consultation",
}: {
  title?: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-hot-fuchsia py-20 text-power-black md:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
        <h2 className="font-display text-3xl uppercase md:text-5xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg">{body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={primaryHref} variant="secondary" className="border-power-black bg-power-black text-clean-white hover:bg-clean-white hover:text-power-black">
            {primaryLabel}
          </Button>
          <Button href={secondaryHref} variant="secondary" className="border-power-black text-power-black hover:bg-power-black hover:text-clean-white">
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
