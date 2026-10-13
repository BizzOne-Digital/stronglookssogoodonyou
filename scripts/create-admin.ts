import { loadEnvLocal } from "./load-env-local";

loadEnvLocal();

import readline from "readline";
import bcrypt from "bcryptjs";
import { connectMongo } from "../src/lib/mongodb";
import { AdminUser } from "../src/models/AdminUser";

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  await connectMongo();

  const email = (
    process.env.ADMIN_EMAIL ||
    (await prompt("Admin email: "))
  ).trim().toLowerCase();
  const password = (
    process.env.ADMIN_PASSWORD ||
    (await prompt("Admin password (min 12 chars): "))
  ).trim();
  const name =
    process.env.ADMIN_NAME || (await prompt("Admin display name: "));

  if (!email || !password || password.length < 12) {
    console.error("Valid email and password (12+ chars) required.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await AdminUser.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: { name, passwordHash: hash, failedLoginAttempts: 0, lockUntil: null },
    },
    { upsert: true, new: true }
  );

  console.log(`Admin ready: ${user.email}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
