"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import { Segment } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface JsonEditorProps {
  segments: Segment[];
  setSegments: (segments: Segment[]) => void;
  videoName: string;
  videoDuration: number;
}

export function JsonEditor({ segments, setSegments, videoName, videoDuration }: JsonEditorProps) {
  const [jsonContent, setJsonContent] = useState("");
  
  // Get filename without extension
  const baseFileName = videoName.split('.').slice(0, -1).join('.');

  useEffect(() => {
    const jsonData = {
      name: baseFileName,
      time_stamps: segments.map(segment => [segment.start, segment.end])
    };
    setJsonContent(JSON.stringify(jsonData, null, 2));
  }, [segments, baseFileName]);

  const handleJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const newContent = event.target.value;
      setJsonContent(newContent);
      
      const parsed = JSON.parse(newContent);
      if (parsed.name !== baseFileName) {
        throw new Error("Video name mismatch");
      }

      const newSegments = parsed.time_stamps.map((ts: number[]) => ({
        start: parseFloat(ts[0].toFixed(2)),
        end: parseFloat(ts[1].toFixed(2))
      }));

      if (newSegments[0]?.start !== 0 || 
          newSegments[newSegments.length - 1]?.end !== parseFloat(videoDuration.toFixed(2))) {
        throw new Error("Invalid segment range");
      }

      setSegments(newSegments);
    } catch (error) {
      console.error("JSON parse error:", error);
    }
  };

  const exportJson = () => {
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseFileName}.json`;
    a.click();
    // URL.createObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This JSON editor is fully editable. Changes will automatically update the segments when valid JSON is entered.
        </AlertDescription>
      </Alert>
      <div className="flex justify-end">
        <Button onClick={exportJson}>
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
      </div>
      <Textarea
        value={jsonContent}
        onChange={handleJsonChange}
        className="font-mono h-[400px]"
      />
    </div>
  );
}