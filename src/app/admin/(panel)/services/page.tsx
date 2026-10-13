import Link from "next/link";
import { prepareDb } from "@/lib/prepare-db";
import { Service } from "@/models/Service";
import { formatCadFromCents } from "@/lib/format";

export default async function AdminServicesPage() {
  await prepareDb();
  const services = await Service.find().sort({ order: 1 }).lean();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl uppercase">Services</h1>
        <Link href="/admin/services/new" className="text-sm text-hot-fuchsia">Add service</Link>
      </div>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th>Price (DB)</th>
            <th>Published</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s._id.toString()} className="border-b">
              <td className="py-3">{s.name}</td>
              <td>{formatCadFromCents(s.priceCents)}</td>
              <td>{s.published ? "Yes" : "No"}</td>
              <td>
                <Link href={`/admin/services/${s._id}`} className="text-hot-fuchsia">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
