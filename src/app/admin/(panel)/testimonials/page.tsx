import { TestimonialsAdmin } from "@/components/admin/TestimonialsAdmin";
import { prepareDb } from "@/lib/prepare-db";
import { Testimonial } from "@/models/Testimonial";

export default async function TestimonialsAdminPage() {
  await prepareDb();
  const items = await Testimonial.find().sort({ order: 1 }).lean();

  const rows = items.map((t) => ({
    id: t._id.toString(),
    displayName: t.displayName,
    quote: t.quote,
    packageName: t.packageName,
    consent: t.consent,
    featured: t.featured,
    published: t.published,
    order: t.order,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Testimonials</h1>
      <p className="mt-2 text-sm text-black/60">Only publish with client consent.</p>
      <TestimonialsAdmin items={rows} />
    </div>
  );
}
