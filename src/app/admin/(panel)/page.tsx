import Link from "next/link";

const quickLinks = [
  { href: "/admin/services", label: "Services" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/settings", label: "Site Settings" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Dashboard</h1>
      <p className="mt-4 max-w-xl text-sm text-black/65">
        Manage coaching packages, gallery, testimonials, FAQs, and site settings.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded border border-black/10 bg-white px-4 py-3 text-sm hover:border-hot-fuchsia"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
