import Link from "next/link";
import { notFound } from "next/navigation";
import { prepareDb } from "@/lib/prepare-db";
import { CoachingApplication } from "@/models/CoachingApplication";
import { adminTextToPlain } from "@/lib/admin-text";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await prepareDb();
  const doc = await CoachingApplication.findById(id).lean();
  if (!doc) notFound();

  const fields: { label: string; value: string }[] = [
    { label: "Email", value: doc.email },
    { label: "Package", value: doc.preferredPackage },
    { label: "Experience", value: doc.trainingExperience },
    { label: "Goals", value: doc.mainGoals },
    { label: "Training days", value: doc.trainingDays },
    { label: "Equipment", value: doc.equipmentAccess },
    { label: "Lifestyle", value: doc.lifestyleNotes },
    { label: "Country / TZ", value: `${doc.country} · ${doc.timeZone}` },
    { label: "Contact", value: doc.contactMethod },
  ];
  if (doc.instagramHandle) {
    fields.push({ label: "Instagram", value: doc.instagramHandle });
  }
  if (doc.additionalMessage) {
    fields.push({ label: "Message", value: doc.additionalMessage });
  }

  return (
    <div>
      <Link href="/admin/applications" className="text-sm text-hot-fuchsia">
        ← Applications
      </Link>
      <h1 className="mt-4 font-display text-3xl uppercase">{doc.fullName}</h1>
      <p className="mt-2 text-sm text-black/60">Status: {doc.status}</p>
      <dl className="mt-8 max-w-2xl space-y-4 text-sm">
        {fields.map((f) => (
          <div key={f.label}>
            <dt className="text-xs uppercase text-black/50">{f.label}</dt>
            <dd className="mt-1 whitespace-pre-line">{adminTextToPlain(f.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
