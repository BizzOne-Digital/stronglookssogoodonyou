import { INTRO_COOKIE_NAME, INTRO_SESSION_KEY } from "@/lib/intro-audio";

const LEGACY_INTRO_COOKIES = ["slgoy_intro_complete", INTRO_COOKIE_NAME] as const;

function clearLegacyIntroCookies() {
  for (const name of LEGACY_INTRO_COOKIES) {
    document.cookie = `${name}=; path=/; Max-Age=0; SameSite=Lax`;
  }
}

/** Mark intro as done in this tab; cookie lets middleware allow deep links on full navigation. */
export function markIntroComplete() {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
  clearLegacyIntroCookies();
  document.cookie = `${INTRO_COOKIE_NAME}=1; path=/; SameSite=Lax`;
}

export function hasIntroCookieClient(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => {
    const [name, value] = part.trim().split("=");
    return name === INTRO_COOKIE_NAME && Boolean(value);
  });
}

/** True after the guest tapped Enter in this browser tab (new tab / new visit → false). */
export function hasIntroSessionClient(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function hasPassedIntroClient(): boolean {
  return hasIntroSessionClient() && hasIntroCookieClient();
}
