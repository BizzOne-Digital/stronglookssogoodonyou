import { randomBytes } from "node:crypto";

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function newToken(): string {
  return randomBytes(32).toString("hex");
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

const TOKEN_RE = /^[a-f0-9]{64}$/;
export function isToken(value: unknown): value is string {
  return typeof value === "string" && TOKEN_RE.test(value);
}
