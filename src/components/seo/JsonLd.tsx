import { BRAND } from "@/lib/constants";

export function JsonLd() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: BRAND.name,
        url: site,
        email: BRAND.email,
        sameAs: [BRAND.instagram.url],
      },
      {
        "@type": "Person",
        name: BRAND.founder,
        jobTitle: "Founder & Coach",
        worksFor: { "@type": "Organization", name: BRAND.name },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
