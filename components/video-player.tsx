"use client";

import { forwardRef } from "react";

interface VideoPlayerProps {
  url: string;
  onDurationChange: (duration: number) => void;
  onPlayingChange: (isPlaying: boolean) => void;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ url, onDurationChange, onPlayingChange }, ref) => {
    return (
      <video
        ref={ref}
        src={url}
        className="w-full rounded-lg"
        controls // Add native controls for progress bar
        controlsList="nodownload nofullscreen" // Disable download and fullscreen buttons
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          onDurationChange(video.duration);
        }}
        onPlay={() => onPlayingChange(true)}
        onPause={() => onPlayingChange(false)}
      />
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";