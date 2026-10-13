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
