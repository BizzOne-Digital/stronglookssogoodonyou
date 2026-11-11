import { readFile } from "node:fs/promises";
import path from "node:path";

/** Files in /private are never served statically; they are only returned by token-checked routes. */
export async function readPrivatePdf(fileName: string): Promise<Buffer | null> {
  try {
    return await readFile(path.join(process.cwd(), "private", fileName));
  } catch {
    return null;
  }
}

export function pdfResponse(data: Buffer, downloadName: string): Response {
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${downloadName}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
