/** Intro soundtrack: [You've Got The Love on Spotify](https://open.spotify.com/track/4Mhivjnm1UNw5nhHCioZOZ) */
export const INTRO_SOUNDTRACK = {
  spotifyTrackId: "4Mhivjnm1UNw5nhHCioZOZ",
  spotifyUri: "spotify:track:4Mhivjnm1UNw5nhHCioZOZ",
  spotifyUrl:
    "https://open.spotify.com/track/4Mhivjnm1UNw5nhHCioZOZ",
  startSeconds: 34,
  endSeconds: 76,
  /** Optional licensed clip in /public/audio for exact timing without Spotify login */
  localClipPath: "/audio/intro-segment.mp3",
} as const;

export const INTRO_SESSION_KEY = "slgoy_intro_complete";
