import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import { AdminUser } from "@/models/AdminUser";
import { z } from "zod";

const LOCK_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse({
          email: String(credentials?.email ?? "").trim().toLowerCase(),
          password: String(credentials?.password ?? ""),
        });
        if (!parsed.success) {
          if (process.env.NODE_ENV === "development") {
            console.error("[auth] invalid login payload", parsed.error.flatten());
          }
          return null;
        }

        try {
          await connectMongo();
        } catch (err) {
          console.error("[auth] MongoDB connection failed during login", err);
          return null;
        }
        const user = await AdminUser.findOne({
          email: parsed.data.email.toLowerCase(),
        });

        if (!user) return null;

        if (user.lockUntil && user.lockUntil > new Date()) {
          return null;
        }

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );

        if (!valid) {
          user.failedLoginAttempts += 1;
          if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
            user.lockUntil = new Date(Date.now() + LOCK_MS);
            user.failedLoginAttempts = 0;
          }
          await user.save();
          return null;
        }

        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
