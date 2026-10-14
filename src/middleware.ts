import { auth } from "@/auth";
import { INTRO_COOKIE_NAME } from "@/lib/intro-audio";
import { NextResponse } from "next/server";

function skipIntroRedirect(pathname: string): boolean {
  if (pathname === "/intro") return true;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml" || pathname === "/favicon.ico") {
    return true;
  }
  return /\.[a-z0-9]+$/i.test(pathname);
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!skipIntroRedirect(pathname) && !req.cookies.get(INTRO_COOKIE_NAME)?.value) {
    const url = new URL("/intro", req.nextUrl.origin);
    if (pathname !== "/") {
      url.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(url);
  }

  const isAdminRoute =
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/auth");

  if (isAdminRoute && !req.auth) {
    const url = new URL("/admin/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/admin/login" && req.auth) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mp3|ico|txt)$).*)",
  ],
};
