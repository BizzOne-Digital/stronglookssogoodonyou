"use client";

import { useActionState } from "react";
import {
  adminLogin,
  type LoginState,
} from "@/app/admin/login/actions";

const initialState: LoginState = { error: null };

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <form
      action={formAction}
      className="w-full max-w-md space-y-6 border border-white/10 bg-clean-white p-8"
    >
      <h1 className="font-display text-2xl uppercase">Admin</h1>
      <p className="text-xs text-power-black/60">
        Use <strong>ADMIN_EMAIL</strong> and <strong>ADMIN_PASSWORD</strong> from{" "}
        <code className="text-[0.65rem]">.env.local</code> (copy the password—do not retype a
        shorter one).
      </p>
      {state.error && (
        <p className="border border-hot-fuchsia/40 bg-hot-fuchsia/10 px-3 py-2 text-sm text-power-black">
          {state.error}
        </p>
      )}
      <div>
        <label className="text-xs uppercase tracking-widest" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={pending}
          className="input-field"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={pending}
          className="input-field"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-hot-fuchsia py-3 font-display text-xs tracking-widest text-white uppercase disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
