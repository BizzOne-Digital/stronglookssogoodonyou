export type YouTubePlayerInstance = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
  getCurrentTime: () => number;
  loadVideoById: (config: { videoId: string; startSeconds?: number }) => void;
  destroy: () => void;
};

type YouTubePlayerCtor = new (
  element: HTMLElement,
  options: {
    width?: number | string;
    height?: number | string;
    videoId?: string;
    playerVars?: Record<string, number | string>;
    events?: {
      onReady?: (event: { target: YouTubePlayerInstance }) => void;
      onStateChange?: (event: { data: number; target: YouTubePlayerInstance }) => void;
    };
  }
) => YouTubePlayerInstance;

type YouTubeIframeApi = {
  Player: YouTubePlayerCtor;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeIframeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export async function loadYouTubeIframeApi(): Promise<YouTubeIframeApi> {
  if (window.YT?.Player) {
    return window.YT;
  }

  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };

    if (!document.querySelector("script[data-yt-iframe-api]")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.dataset.ytIframeApi = "true";
      document.body.appendChild(script);
    }
  });
}
