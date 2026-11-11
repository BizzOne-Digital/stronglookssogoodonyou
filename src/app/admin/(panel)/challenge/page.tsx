import { Suspense } from "react";
import { connectMongo } from "@/lib/mongodb";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { ChallengeSubscriber } from "@/models/ChallengeSubscriber";
import { ProgramPurchase } from "@/models/ProgramPurchase";

export default function ChallengeAdminPage() {
  return (
    <Suspense fallback={<p className="text-sm text-black/60">Loading...</p>}>
      <Stats />
    </Suspense>
  );
}

function pct(n: number, d: number) {
  return d > 0 ? `${((n / d) * 100).toFixed(1)}%` : "n/a";
}

async function Stats() {
  await connectMongo();
  const [events, subscribers, marketing, unsubscribed, purchases, welcomeFailed, recent] = await Promise.all([
    AnalyticsEvent.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$name", count: { $sum: 1 } } }]),
    ChallengeSubscriber.countDocuments({}),
    ChallengeSubscriber.countDocuments({ marketingConsent: true }),
    ChallengeSubscriber.countDocuments({ unsubscribedAt: { $exists: true } }),
    ProgramPurchase.countDocuments({}),
    ChallengeSubscriber.countDocuments({ welcomeEmailStatus: "failed" }),
    ChallengeSubscriber.find({}).sort({ createdAt: -1 }).limit(50).lean(),
  ]);
  const count = (name: string) => events.find((e) => e._id === name)?.count ?? 0;
  const views = count("challenge_view");
  const checkoutClicks = count("checkout_click");

  const cards: [string, string | number, string?][] = [
    ["Page views", views],
    ["Registrations", subscribers, `${pct(subscribers, views)} of views`],
    ["Marketing opt-ins", marketing, `${pct(marketing, subscribers)} of registrations`],
    ["Unsubscribed", unsubscribed],
    ["28-Day checkout clicks", checkoutClicks],
    ["28-Day purchases", purchases, `${pct(purchases, subscribers)} of registrations`],
    ["Coaching clicks", count("coaching_click")],
    ["PDF downloads", count("pdf_download")],
    ["Welcome emails failed", welcomeFailed],
  ];

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Free Challenge</h1>
      <p className="mt-2 text-sm text-black/65">Funnel counts since launch. Anonymous page counters; registrations and purchases are exact.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value, note]) => (
          <li key={label} className="rounded border border-black/10 bg-white p-4">
            <p className="text-xs uppercase tracking-widest text-black/55">{label}</p>
            <p className="mt-1 font-display text-3xl">{value}</p>
            {note && <p className="text-xs text-black/50">{note}</p>}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-xl uppercase">Latest registrations</h2>
      <div className="mt-3 overflow-x-auto rounded border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase tracking-widest text-black/55">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Marketing</th>
              <th className="p-3">Welcome email</th>
              <th className="p-3">Registered</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((s) => (
              <tr key={String(s._id)} className="border-b border-black/5">
                <td className="p-3">{s.firstName}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.unsubscribedAt ? "Unsubscribed" : s.marketingConsent ? "Yes" : "No"}</td>
                <td className="p-3">{s.welcomeEmailStatus}</td>
                <td className="p-3">{s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
