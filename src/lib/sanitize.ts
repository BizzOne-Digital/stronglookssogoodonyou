const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:"];

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizeRichText(html: string): string {
  let out = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");

  out = out.replace(
    /\shref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi,
    (match, _q, dbl, sgl, bare) => {
      const url = (dbl || sgl || bare || "").trim();
      try {
        const parsed = new URL(url, "https://placeholder.local");
        if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
          return ' href="#"';
        }
      } catch {
        if (!url.startsWith("#") && !url.startsWith("/")) {
          return ' href="#"';
        }
      }
      return match;
    }
  );

  return out;
}

export function plainTextFromRich(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
