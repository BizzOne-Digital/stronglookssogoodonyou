import { FaqAdmin } from "@/components/admin/FaqAdmin";
import { prepareDb } from "@/lib/prepare-db";
import { FAQ } from "@/models/FAQ";

export const instant = false;

export default async function FaqsAdminPage() {
  await prepareDb();
  const faqs = await FAQ.find().sort({ order: 1 }).lean();
  return (
    <div>
      <h1 className="font-display text-3xl uppercase">FAQs</h1>
      <p className="mt-4 max-w-2xl text-sm text-black/70">
        The public <strong>/faqs</strong> page always shows the fixed{" "}
        <strong>16 client-approved questions</strong> from{" "}
        <code className="text-xs">src/lib/faq-static.ts</code>. Changes here do not
        appear on the live FAQ page. Contact your developer to update that file.
      </p>
      <FaqAdmin
        items={faqs.map((f) => ({
          id: f._id.toString(),
          question: f.question,
          answer: f.answer,
          group: f.group,
          published: f.published,
          isDraft: f.isDraft,
          order: f.order,
        }))}
      />
    </div>
  );
}
