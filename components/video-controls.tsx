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
    <div className="flex flex-wrap gap-2 items-center">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onSkip(-5)}
        title="Back 5 seconds"
      >
        <SkipBack className="h-4 w-4" />
      </Button>

      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onSkip(-1)}
        title="Back 1 second"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onFrame('prev')}
        title="Previous frame"
      >
        <StepBack className="h-4 w-4" />
      </Button>

      <Button onClick={onPlayPause} className="w-24">
        {isPlaying ? (
          <>
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Play
          </>
        )}
      </Button>

      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onFrame('next')}
        title="Next frame"
      >
        <StepForward className="h-4 w-4" />
      </Button>

      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onSkip(1)}
        title="Forward 1 second"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onSkip(5)}
        title="Forward 5 seconds"
      >
        <SkipForward className="h-4 w-4" />
      </Button>

      <Select
        value={playbackSpeed.toString()}
        onValueChange={(value) => onSpeedChange(parseFloat(value))}
      >
        <SelectTrigger className="w-[120px]">
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