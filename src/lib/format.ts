export function formatCadFromCents(
  cents: number,
  options?: { showCurrency?: boolean }
): string {
  const amount = cents / 100;
  const formatted = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  if (options?.showCurrency === false) {
    return formatted.replace(/\s*CAD\s*/i, "").trim();
  }
  return formatted;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
