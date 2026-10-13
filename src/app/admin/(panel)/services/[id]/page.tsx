import { prepareDb } from "@/lib/prepare-db";
import { Service } from "@/models/Service";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { notFound } from "next/navigation";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await prepareDb();
  const doc = await Service.findById(id).lean();
  if (!doc) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Edit service</h1>
      <div className="mt-8">
        <ServiceEditor
          initial={{
            _id: doc._id.toString(),
            slug: doc.slug,
            name: doc.name,
            durationLabel: doc.durationLabel,
            tagline: doc.tagline,
            description: doc.description,
            inclusions: doc.inclusions.join("\n"),
            idealFor: doc.idealFor,
            exclusions: doc.exclusions,
            priceCents: doc.priceCents,
            showPrice: doc.showPrice,
            published: doc.published,
            order: doc.order,
            imageMediaId: doc.imageMediaId?.toString(),
            imageUrl: doc.imageUrl || "",
          }}
        />
      </div>
    </div>
  );
}
