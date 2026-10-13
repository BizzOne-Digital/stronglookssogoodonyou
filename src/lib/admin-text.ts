/** Normalize admin/CMS copy to plain text (no HTML tags on the public site). */

const ENTITY_MAP: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

function decodeEntities(text: string): string {
  return text.replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, (m) => ENTITY_MAP[m] ?? m);
}

/** Strip HTML and block tags to newlines for editing or display. */
export function adminTextToPlain(input: string): string {
  if (!input?.trim()) return "";

  let s = input.replace(/\r\n/g, "\n");

  s = s.replace(/<\s*br\s*\/?>/gi, "\n");
  s = s.replace(/<\s*li[^>]*>/gi, "• ");
  s = s.replace(/<\s*\/\s*(p|div|h[1-6]|li|ul|ol)\s*>/gi, "\n");
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s);
  s = s.replace(/[ \t]+\n/g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");

  return s.trim();
}

export function splitAdminParagraphs(text: string): string[] {
  const plain = adminTextToPlain(text);
  if (!plain) return [];
  return plain
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
