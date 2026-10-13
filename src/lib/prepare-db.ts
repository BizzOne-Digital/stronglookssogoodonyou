import { connection } from "next/server";
import { connectMongo } from "@/lib/mongodb";
/** Use before Mongoose in App Router routes (Next.js 16 PPR / Instant). */
export async function prepareDb() {
  await connection();
  return connectMongo();
}
