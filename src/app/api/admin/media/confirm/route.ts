import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { connectMongo } from "@/lib/mongodb";
import { MediaAsset } from "@/models/MediaAsset";
import { z } from "zod";

const schema = z.object({
  cloudinaryPublicId: z.string().min(1).max(300),
  url: z.string().url(),
  secureUrl: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  alt: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (parsed.data.format === "svg") {
    return NextResponse.json({ error: "SVG not allowed" }, { status: 400 });
  }

  await connectMongo();
  const doc = await MediaAsset.findOneAndUpdate(
    { cloudinaryPublicId: parsed.data.cloudinaryPublicId },
    {
      $set: {
        ...parsed.data,
        folder: "slgoy",
      },
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ id: doc._id.toString() });
}
