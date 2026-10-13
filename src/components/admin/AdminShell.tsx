import Link from "next/link";
import { signOutAdmin } from "@/lib/actions/auth";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/settings", label: "Site Settings" },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string | null;
}) {
  return (
    <div className="min-h-screen bg-[#f0f0f0] text-power-black">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-black/10 bg-white p-6 lg:block">
          <p className="font-display text-sm tracking-widest">SLGOY ADMIN</p>
          <nav className="mt-8 space-y-1 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded px-2 py-2 hover:bg-black/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={signOutAdmin} className="mt-10">
            <button type="submit" className="text-xs text-hot-fuchsia">
              Sign out
            </button>
          </form>
        </aside>
        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
            <p className="text-sm text-black/60 lg:hidden">Admin</p>
            <p className="text-sm">{email}</p>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
