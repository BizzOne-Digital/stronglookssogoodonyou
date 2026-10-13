import Link from "next/link";
import { prepareDb } from "@/lib/prepare-db";
import { CoachingApplication } from "@/models/CoachingApplication";

export default async function ApplicationsPage() {
  await prepareDb();
  const items = await CoachingApplication.find().sort({ createdAt: -1 }).limit(100).lean();

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Applications</h1>
      <p className="mt-2 text-sm text-black/60">
        Coaching applications submitted from the public site.
      </p>
      <ul className="mt-8 space-y-2 text-sm">
        {items.map((a) => (
          <li key={a._id.toString()} className="rounded border bg-white px-4 py-3">
            <Link href={`/admin/applications/${a._id}`} className="text-hot-fuchsia">
              {a.fullName}
            </Link>
            {" — "}
            {a.status} · {a.preferredPackage}
          </li>
        ))}
        {items.length === 0 && <li className="text-black/50">No applications yet.</li>}
      </ul>
    </div>
  );
}
