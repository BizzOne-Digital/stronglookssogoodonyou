import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { LOGO_IMAGE } from "@/lib/hero-assets";

const exploreLinks = [
  { href: "/about", label: "About Joanna" },
  { href: "/services", label: "Coaching Packages" },
  { href: "/coaching-method", label: "Coaching Method" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Client Stories" },
  { href: "/faqs", label: "FAQs" },
];

const actionLinks = [
  { href: "/apply", label: "Apply for Coaching" },
  { href: "/booking", label: "Book a Consultation" },
  { href: "/contact", label: "Contact" },
  { href: "/team", label: "Our Team" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

export function SiteFooter({ tagline }: { tagline?: string }) {
  return (
    <footer className="relative max-w-[100vw] overflow-x-clip bg-power-black text-clean-white">
      <div className="h-1 w-full bg-hot-fuchsia" aria-hidden />

      <div className="mx-auto max-w-[1600px] px-6 py-14 md:px-10 md:py-20 lg:px-14">
        <div className="grid min-w-0 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Link href="/" className="inline-flex w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hot-fuchsia">
              <Image
                src={LOGO_IMAGE}
                alt="STRONG LOOKS GOOD ON YOU"
                width={168}
                height={168}
                className="h-[4.25rem] w-[4.25rem] object-contain md:h-20 md:w-20"
              />
            </Link>
            <p className="font-display text-xl uppercase leading-tight tracking-tight md:text-2xl">
              {BRAND.name}
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-soft-silver">
              {tagline ||
                "Strength, discipline, confidence, and becoming the strongest version of yourself."}
            </p>
            <Link
              href="/apply"
              className="font-body inline-flex w-fit items-center justify-center bg-hot-fuchsia px-6 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-power-black transition-colors hover:bg-[#ff3da8] btn-press"
            >
              Apply for Coaching
            </Link>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2 lg:pt-2">
            <p className="font-display text-[0.65rem] tracking-[0.35em] text-hot-fuchsia">EXPLORE</p>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-clean-white/90 transition-colors hover:text-hot-fuchsia"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Start */}
          <div className="lg:col-span-2 lg:pt-2">
            <p className="font-display text-[0.65rem] tracking-[0.35em] text-hot-fuchsia">GET STARTED</p>
            <ul className="mt-5 space-y-3">
              {actionLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-clean-white/90 transition-colors hover:text-hot-fuchsia"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-4 lg:pt-2">
            <p className="font-display text-[0.65rem] tracking-[0.35em] text-hot-fuchsia">CONNECT</p>
            <p className="mt-5 text-sm leading-relaxed text-soft-silver">
              Online coaching for women worldwide. Questions before you apply? Reach out, we&apos;re here to help you find the right fit.
            </p>
            <div className="mt-6 space-y-4 border border-white/10 bg-white/[0.03] p-5">
              <div>
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-soft-silver">Email</p>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="mt-1 block text-sm break-all text-clean-white transition-colors hover:text-hot-fuchsia"
                >
                  {BRAND.email}
                </a>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-soft-silver">Instagram</p>
                <a
                  href={BRAND.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 text-sm text-clean-white transition-colors hover:text-hot-fuchsia"
                >
                  {BRAND.instagram.handle}
                  <span className="text-hot-fuchsia" aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-6 py-6 text-center text-[0.65rem] uppercase tracking-[0.2em] text-soft-silver md:flex-row md:px-10 lg:px-14">
          <p>© 2026 {BRAND.name}. All rights reserved.</p>
          <p className="normal-case tracking-normal text-soft-silver/80">
            1 on 1 strength &amp; physique coaching · Online
          </p>
        </div>
      </div>
    </footer>
  );
}
