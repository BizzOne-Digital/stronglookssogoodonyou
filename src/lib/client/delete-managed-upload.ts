/** Client-side helper when replacing images outside AdminImageField. */
export async function deleteManagedUploadUrl(url: string): Promise<void> {
  if (!url.startsWith("/api/uploads/")) return;
  await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}
