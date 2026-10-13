"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type LoginState = { error: string | null };

export async function adminLogin(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof AuthError) {
      return {
        error:
          "Invalid email or password. Use the exact ADMIN_PASSWORD from .env.local (copy/paste), then run npm run create-admin if you changed it.",
      };
    }
    console.error("[adminLogin]", error);
    return {
      error:
        "Could not sign in. Check that MongoDB is connected and the dev server was restarted after .env changes.",
    };
  }

  return { error: null };
}
