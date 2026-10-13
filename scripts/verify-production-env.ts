import { loadEnvLocal } from "./load-env-local";

loadEnvLocal();

const required = ["MONGODB_URI", "AUTH_SECRET"] as const;

const recommended = [
  "NEXT_PUBLIC_SITE_URL",
  "MONGODB_DB",
  "BUSINESS_EMAIL",
] as const;

const optional = [
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

let failed = false;

for (const key of required) {
  if (!process.env[key]?.trim()) {
    console.error(`MISSING (required): ${key}`);
    failed = true;
  } else {
    console.log(`OK ${key}`);
  }
}

for (const key of recommended) {
  if (!process.env[key]?.trim()) {
    console.warn(`WARN (recommended): ${key} is not set`);
  } else {
    console.log(`OK ${key}`);
  }
}

for (const key of optional) {
  console.log(
    process.env[key]?.trim() ? `OK ${key}` : `SKIP (optional) ${key}`
  );
}

if (process.env.NEXT_PUBLIC_SITE_URL?.includes("localhost")) {
  console.warn(
    "WARN: NEXT_PUBLIC_SITE_URL still points at localhost — set production URL on Vercel."
  );
}

if (failed) {
  process.exit(1);
}

console.log("\nProduction env check passed (required vars present).");
