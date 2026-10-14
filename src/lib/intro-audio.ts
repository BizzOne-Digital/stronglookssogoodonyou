/** Intro soundtrack: [You've Got The Love on Spotify](https://open.spotify.com/track/4Mhivjnm1UNw5nhHCioZOZ) */
export const INTRO_SOUNDTRACK = {
  spotifyTrackId: "4Mhivjnm1UNw5nhHCioZOZ",
  spotifyUrl:
    "https://open.spotify.com/track/4Mhivjnm1UNw5nhHCioZOZ",
  /** JOHN ELLE — Official Audio (hidden YouTube fallback, same pattern as elite-henna.vercel.app) */
  youtubeVideoId: "r8Ni4O1whrM",
  startSeconds: 34,
  endSeconds: 76,
  /** Length of the excerpt when `intro-segment.mp3` is trimmed to 0:34–1:16 */
  segmentDurationSeconds: 76 - 34,
  /** Licensed excerpt in /public/audio (trimmed segment; playback starts at 0) */
  localClipPath: "/audio/intro-segment.mp3",
} as const;

export function getIntroAudioSrc(): string {
  return process.env.NEXT_PUBLIC_INTRO_AUDIO_URL ?? INTRO_SOUNDTRACK.localClipPath;
}

export function getIntroYoutubeVideoId(): string {
  return (
    process.env.NEXT_PUBLIC_INTRO_YOUTUBE_ID ?? INTRO_SOUNDTRACK.youtubeVideoId
  );
}

export type IntroPlaybackBounds = { start: number; end: number };

/** 0:34–1:16 for full tracks; 0–segment length for trimmed `intro-segment.mp3`. */
export function getIntroPlaybackBounds(mediaDuration?: number): IntroPlaybackBounds {
  const { startSeconds, endSeconds, segmentDurationSeconds } = INTRO_SOUNDTRACK;
  const fullTrack =
    mediaDuration !== undefined &&
    Number.isFinite(mediaDuration) &&
    mediaDuration > endSeconds + 5;

  return {
    start: fullTrack ? startSeconds : 0,
    end: fullTrack ? endSeconds : segmentDurationSeconds,
  };
}

export function introSegmentShouldRestart(
  currentTime: number,
  bounds: IntroPlaybackBounds
): boolean {
  return currentTime >= bounds.end - 0.12;
}

export async function introLocalAudioAvailable(src: string): Promise<boolean> {
  try {
    const res = await fetch(src, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export const INTRO_SESSION_KEY = "slgoy_intro_complete";
/** Set by middleware + client when the guest has entered the site from /intro */
/** Session cookie — intro shows again when the browser is closed and reopened */
export const INTRO_COOKIE_NAME = "slgoy_intro_session";
