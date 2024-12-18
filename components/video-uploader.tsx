"use client";

import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Upload } from "lucide-react";

interface VideoUploaderProps {
  onUpload: (url: string, fileName: string) => void;
}

export function VideoUploader({ onUpload }: VideoUploaderProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(url, file.name);
    }
  };

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Upload your video file
          </p>
        </div>
        <Input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="max-w-sm"
        />
      </CardContent>
    </Card>
  );
}
