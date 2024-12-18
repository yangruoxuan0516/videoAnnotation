"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, Pause, SkipBack, SkipForward, 
  ChevronLeft, ChevronRight,
  StepBack, StepForward,
} from "lucide-react";

interface VideoControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  onPlayPause: () => void;
  onSkip: (seconds: number) => void;
  onFrame: (direction: 'prev' | 'next') => void;
  onSpeedChange: (speed: number) => void;
}

const playbackSpeeds = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0];

export function VideoControls({
  isPlaying,
  playbackSpeed,
  onPlayPause,
  onSkip,
  onFrame,
  onSpeedChange,
}: VideoControlsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 items-center justify-center">
      <Button 
        variant="outline" 
        onClick={() => onSkip(-5)}
        title="Back 5 seconds"
        className="w-28 px-2"
      >
        <SkipBack className="h-4 w-4 mr-1.5" />
        Back 5s
      </Button>

      <Button 
        variant="outline"
        onClick={() => onSkip(-1)}
        title="Back 1 second"
        className="w-28 px-2"
      >
        <ChevronLeft className="h-4 w-4 mr-1.5" />
        Back 1s
      </Button>

      <Button 
        variant="outline"
        onClick={() => onFrame('prev')}
        title="Previous frame"
        className="w-28 px-2"
      >
        <StepBack className="h-4 w-4 mr-1.5" />
        Prev Frame
      </Button>

      <Button onClick={onPlayPause} className="w-24 px-2">
        {isPlaying ? (
          <>
            <Pause className="h-4 w-4 mr-1.5" />
            Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-1.5" />
            Play
          </>
        )}
      </Button>

      <Button 
        variant="outline"
        onClick={() => onFrame('next')}
        title="Next frame"
        className="w-28 px-2"
      >
        <StepForward className="h-4 w-4 mr-1.5" />
        Next Frame
      </Button>

      <Button 
        variant="outline"
        onClick={() => onSkip(1)}
        title="Forward 1 second"
        className="w-28 px-2"
      >
        <ChevronRight className="h-4 w-4 mr-1.5" />
        Fwd 1s
      </Button>

      <Button 
        variant="outline"
        onClick={() => onSkip(5)}
        title="Forward 5 seconds"
        className="w-28 px-2"
      >
        <SkipForward className="h-4 w-4 mr-1.5" />
        Fwd 5s
      </Button>

      <Select
        value={playbackSpeed.toString()}
        onValueChange={(value) => onSpeedChange(parseFloat(value))}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Speed" />
        </SelectTrigger>
        <SelectContent>
          {playbackSpeeds.map((speed) => (
            <SelectItem key={speed} value={speed.toString()}>
              {speed}x Speed
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
