"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOGO_IMAGE } from "@/lib/hero-assets";
import {
  MenuToggleButton,
  MobileNavDrawer,
  type MobileNavLink,
} from "@/components/layout/MobileNavDrawer";

const mobileNavLinks: MobileNavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Coaching Packages" },
  { href: "/coaching-method", label: "Coaching Method" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Client Stories" },
  { href: "/faqs", label: "FAQs" },
  { href: "/booking", label: "Book a Consultation" },
  { href: "/contact", label: "Contact" },
];

const heroNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Coaching" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

const coachingLinks = [
  { href: "/services", label: "Packages" },
  { href: "/coaching-method", label: "Method" },
  { href: "/booking", label: "Book a Consultation" },
  { href: "/apply", label: "Apply" },
];

const innerNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

function BrandLockup() {
  return (
    <Link
      href="/"
      className="relative z-[110] block shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hot-fuchsia"
    >
      <Image
        src={LOGO_IMAGE}
        alt="STRONG LOOKS GOOD ON YOU"
        width={192}
        height={192}
        className="h-12 w-12 object-contain sm:h-14 sm:w-14 md:h-[4.5rem] md:w-[4.5rem]"
        priority
      />
    </Link>
  );
}

function ApplyCta({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/apply"
      className={`font-body inline-flex w-full max-w-full items-center justify-center bg-hot-fuchsia px-4 py-3 text-center font-bold uppercase tracking-[0.12em] text-power-black transition-transform duration-200 btn-press hover:bg-[#ff3da8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto ${
        compact
          ? "text-[0.65rem] sm:px-4 sm:py-2.5"
          : "text-[0.68rem] md:px-6 md:py-3.5 md:text-[0.72rem]"
      }`}
    >
      Apply for coaching
    </Link>
  );
}

function SiteHeaderBody({ solidDefault = false }: { solidDefault?: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrollPast, setScrollPast] = useState(false);
  const solid = solidDefault || !isHome || scrollPast;
  const [open, setOpen] = useState(false);
  const [coachingOpen, setCoachingOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrollPast(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenus = () => {
    setOpen(false);
    setCoachingOpen(false);
  };

  const drawer = (
    <MobileNavDrawer
      open={open}
      onClose={closeMenus}
      links={mobileNavLinks}
      footer={<ApplyCta />}
    />
  );

  const heroStyle = isHome && !solid;

  if (heroStyle) {
    return (
      <>
        <header className="fixed inset-x-0 top-0 z-[80] max-w-[100vw] bg-transparent">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-10 md:py-6 lg:px-14">
            <BrandLockup />
            <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
              {heroNav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-body relative pb-1 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:text-hot-fuchsia ${
                      active ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span
                        className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-hot-fuchsia"
                        aria-hidden
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="hidden lg:block">
              <ApplyCta />
            </div>
            <MenuToggleButton
              open={open}
              onClick={() => setOpen((v) => !v)}
              className="text-white"
            />
          </div>
        </header>
        {drawer}
      </>
    );
  }

  const headerCls = solid
    ? "bg-power-black/95 text-clean-white border-b border-white/10"
    : "bg-transparent text-clean-white";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] max-w-[100vw] transition-colors duration-300 ${headerCls}`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-10">
          <BrandLockup />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            <div className="relative">
              <button
                type="button"
                className="font-body text-[0.72rem] font-medium uppercase tracking-[0.18em] hover:text-hot-fuchsia"
                aria-expanded={coachingOpen}
                onClick={() => setCoachingOpen((v) => !v)}
              >
                Coaching
              </button>
              {coachingOpen && (
                <div className="absolute left-0 top-full mt-2 min-w-[220px] border border-white/10 bg-power-black py-2 shadow-xl">
                  {coachingLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={closeMenus}
                      className="block px-4 py-2 text-sm hover:text-hot-fuchsia"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {innerNav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`font-body text-[0.72rem] font-medium uppercase tracking-[0.18em] hover:text-hot-fuchsia ${
                  pathname === l.href || pathname.startsWith(l.href + "/")
                    ? "text-hot-fuchsia"
                    : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
            <ApplyCta compact />
          </nav>
          <MenuToggleButton
            open={open}
            onClick={() => setOpen((v) => !v)}
            className="text-clean-white"
          />
        </div>
      </header>
      {drawer}
    </>
  );
}

export function SiteHeader({ solid: solidDefault = false }: { solid?: boolean }) {
  const pathname = usePathname();
  return <SiteHeaderBody key={pathname} solidDefault={solidDefault} />;
}
