"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export type MobileNavLink = { href: string; label: string };

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MobileNavDrawer({
  open,
  onClose,
  links,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  links: MobileNavLink[];
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 z-[90] bg-black/70 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-y-0 right-0 z-[100] flex w-full max-w-[100vw] flex-col bg-power-black text-clean-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="font-display text-sm tracking-[0.35em] text-hot-fuchsia">MENU</span>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-sm text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-hot-fuchsia"
            aria-label="Close menu"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <nav
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-8"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => {
              const active =
                l.href === "/"
                  ? pathname === "/"
                  : pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className={`block py-3 font-display text-2xl uppercase tracking-tight sm:text-3xl ${
                      active ? "text-hot-fuchsia" : "text-white hover:text-hot-fuchsia"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {footer && (
          <div className="shrink-0 border-t border-white/10 px-5 py-6">{footer}</div>
        )}
      </div>
    </>
  );
}

export function MenuToggleButton({
  open,
  onClick,
  className = "",
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`relative z-[110] flex h-11 w-11 items-center justify-center lg:hidden ${className}`}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onClick}
    >
      {open ? (
        <CloseIcon />
      ) : (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
