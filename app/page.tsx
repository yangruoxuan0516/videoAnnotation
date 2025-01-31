"use client";

import { VideoUploader } from "../components/video-uploader";
import { VideoPlayer } from "../components/video-player";
import { VideoControls } from "../components/video-controls";
import { SegmentTable } from "../components/segment-table";
import { DraftSegments } from "../components/draft-segments";
import { JsonEditor } from "../components/json-editor";
import { useState, useRef } from "react";
import { Segment, DraftSegment } from "../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string>("");
  const [segments, setSegments] = useState<Segment[]>([]);
  const [drafts, setDrafts] = useState<DraftSegment[]>([]);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = (url: string, fileName: string) => {
    setVideoUrl(url);
    setVideoFileName(fileName);
    setSegments([]);
    setDrafts([]);
  };

  const handleDurationChange = (duration: number) => {
    setVideoDuration(duration);
    setSegments([{ after: "", start: 0, end: parseFloat(duration.toFixed(2)) }]);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(
          videoRef.current.currentTime + seconds,
          videoRef.current.duration
        )
      );
    }
  };

  const handleFrame = (direction: 'prev' | 'next') => {
    if (videoRef.current) {
      const frameTime = 1/30; // Assuming 30fps
      handleSkip(direction === 'next' ? frameTime : -frameTime);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const addDraft = () => {
    if (videoRef.current) {
      const timestamp = parseFloat(videoRef.current.currentTime.toFixed(2));
      setDrafts([...drafts, { timestamp }]);
    }
  };



  const useDraft = (timestamp: number, note: string | undefined) => {
    const currentTime = timestamp;
    if (currentTime <= 0 || currentTime >= videoDuration) return;

    // Find the segment that contains the timestamp
    const segmentIndex = segments.findIndex(
      seg => currentTime >= seg.start && currentTime < seg.end
    );
    if (segmentIndex === -1) return;

    const segment = segments[segmentIndex];
    if (currentTime === segment.start && segment.after === note) return;
    else if (currentTime === segment.start && segment.after !== note) { 
      const newSegments = [
        ...segments.slice(0, segmentIndex),
        { start: segment.start, end: segment.end, after: note },
        ...segments.slice(segmentIndex + 1),
      ];
      setSegments(newSegments);
      return;
    }
    
    const newSegments = [
      ...segments.slice(0, segmentIndex),
      { start: segment.start, end: currentTime, after: segment.after },  // First half remains unchanged
      { start: currentTime, end: segment.end, after: note }, // Assign the note as 'after'
      ...segments.slice(segmentIndex + 1),
    ];

    setSegments(newSegments);
};

  

  const predefinedNotes = ["START","END",
                           "[Découvrir]",
                           "choose location", "choose location - use the current location", "choose location - search", "choose location - show the results", "choose location - close",
                           "select store", "select store - check the location", "select store - check ingredients", "select store - reserve", "select store - back",
                           "[Parcourir]", 
                           "[Livraison]",
                           "[Favoris]",
                           "[Profil]",
                           "others"];

  // New function to handle note changes
  const handleNoteChange = (index: number, note: string) => {
    const updatedDrafts = [...drafts];
    updatedDrafts[index].note = note;
    setDrafts(updatedDrafts);
  };

  return (
    <main className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Video Annotation Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <VideoUploader onUpload={handleVideoUpload} />
        </CardContent>
      </Card>

      {videoUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <VideoPlayer 
                  ref={videoRef}
                  url={videoUrl}
                  onDurationChange={handleDurationChange}
                  onPlayingChange={setIsPlaying}
                />
                <div className="mt-4">
                  <VideoControls 
                    isPlaying={isPlaying}
                    playbackSpeed={playbackSpeed}
                    onPlayPause={handlePlayPause}
                    onSkip={handleSkip}
                    onFrame={handleFrame}
                    onSpeedChange={handleSpeedChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Timestamps</CardTitle>
                <Button onClick={addDraft}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                <DraftSegments
                  drafts={drafts}
                  predefinedNotes={predefinedNotes} // Pass the predefined notes
                  onDelete={(index) => {
                    const newDrafts = [...drafts];
                    newDrafts.splice(index, 1);
                    setDrafts(newDrafts);
                  }}
                  onUse={useDraft}
                  onDraftClick={(timestamp) => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = timestamp;
                    }
                  }}
                  onNoteChange={handleNoteChange}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <SegmentTable 
                  segments={segments}
                  onDelete={(index) => {
                    if (segments.length <= 1) {
                      setSegments([{ after: "", start: 0, end: parseFloat(videoDuration.toFixed(2)) }]);
                      return;
                    };
                    const newSegments = [...segments];
                    newSegments.splice(index, 1);
                    if (index > 0 && index < segments.length) {
                      newSegments[index - 1].end = segments[index].end;
                    }
                    setSegments(newSegments);
                  }}
                  onSegmentClick={(startTime) => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = startTime;
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>JSON Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <JsonEditor 
                  segments={segments}
                  setSegments={setSegments}
                  videoName={videoFileName}
                  videoDuration={videoDuration}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}



// "use client";

// import { VideoUploader } from "../components/video-uploader";
// import { VideoPlayer } from "../components/video-player";
// import { VideoControls } from "../components/video-controls";
// import { SegmentTable } from "../components/segment-table";
// import { DraftSegments } from "../components/draft-segments";
// import { JsonEditor } from "../components/json-editor";
// import { useState, useRef } from "react";
// import { Segment, DraftSegment } from "../lib/types";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Plus } from "lucide-react";

// export default function Home() {
//   const [videoUrl, setVideoUrl] = useState<string | null>(null);
//   const [videoFileName, setVideoFileName] = useState<string>("");
//   const [segments, setSegments] = useState<Segment[]>([]);
//   const [drafts, setDrafts] = useState<DraftSegment[]>([]);
//   const [videoDuration, setVideoDuration] = useState<number>(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const handleVideoUpload = (url: string, fileName: string) => {
//     setVideoUrl(url);
//     setVideoFileName(fileName);
//     setSegments([]);
//     setDrafts([]);
//   };

//   const handleDurationChange = (duration: number) => {
//     setVideoDuration(duration);
//     setSegments([{ start: 0, end: parseFloat(duration.toFixed(2)) }]);
//   };

//   const handlePlayPause = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const handleSkip = (seconds: number) => {
//     if (videoRef.current) {
//       videoRef.current.currentTime = Math.max(
//         0,
//         Math.min(
//           videoRef.current.currentTime + seconds,
//           videoRef.current.duration
//         )
//       );
//     }
//   };

//   const handleFrame = (direction: 'prev' | 'next') => {
//     if (videoRef.current) {
//       const frameTime = 1/30; // Assuming 30fps
//       handleSkip(direction === 'next' ? frameTime : -frameTime);
//     }
//   };

//   const handleSpeedChange = (speed: number) => {
//     if (videoRef.current) {
//       videoRef.current.playbackRate = speed;
//       setPlaybackSpeed(speed);
//     }
//   };

//   const addDraft = () => {
//     if (videoRef.current) {
//       const timestamp = parseFloat(videoRef.current.currentTime.toFixed(2));
//       setDrafts([...drafts, { timestamp }]);
//     }
//   };

//   const useDraft = (timestamp: number) => {
//     const currentTime = timestamp;
//     if (currentTime <= 0 || currentTime >= videoDuration) return;

//     const segmentIndex = segments.findIndex(
//       seg => currentTime > seg.start && currentTime < seg.end
//     );
//     if (segmentIndex === -1) return;

//     const segment = segments[segmentIndex];
//     const newSegments = [
//       ...segments.slice(0, segmentIndex),
//       { start: segment.start, end: currentTime },
//       { start: currentTime, end: segment.end },
//       ...segments.slice(segmentIndex + 1),
//     ];

//     setSegments(newSegments);
//   };

//   return (
//     <main className="container mx-auto p-4">
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle className="text-3xl font-bold">Video Annotation Tool</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <VideoUploader onUpload={handleVideoUpload} />
//         </CardContent>
//       </Card>

//       {videoUrl && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-6">
//             <Card>
//               <CardContent className="p-6">
//                 <VideoPlayer 
//                   ref={videoRef}
//                   url={videoUrl}
//                   onDurationChange={handleDurationChange}
//                   onPlayingChange={setIsPlaying}
//                 />
//                 <div className="mt-4">
//                   <VideoControls 
//                     isPlaying={isPlaying}
//                     playbackSpeed={playbackSpeed}
//                     onPlayPause={handlePlayPause}
//                     onSkip={handleSkip}
//                     onFrame={handleFrame}
//                     onSpeedChange={handleSpeedChange}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle>Draft Timestamps</CardTitle>
//                 <Button onClick={addDraft}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Draft
//                 </Button>
//               </CardHeader>
              // <CardContent>
              //   <DraftSegments 
              //     drafts={drafts}
              //     onDelete={(index) => {
              //       const newDrafts = [...drafts];
              //       newDrafts.splice(index, 1);
              //       setDrafts(newDrafts);
              //     }}
              //     onUse={useDraft}
              //     onDraftClick={(timestamp) => {
              //       if (videoRef.current) {
              //         videoRef.current.currentTime = timestamp;
              //       }
              //     }}
              //   />
              // </CardContent>
//             </Card>
//           </div>

//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Segments</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <SegmentTable 
//                   segments={segments}
//                   onDelete={(index) => {
//                     if (segments.length <= 1) return;
//                     const newSegments = [...segments];
//                     newSegments.splice(index, 1);
//                     if (index > 0 && index < segments.length) {
//                       newSegments[index - 1].end = segments[index].end;
//                     }
//                     setSegments(newSegments);
//                   }}
//                   onSegmentClick={(startTime) => {
//                     if (videoRef.current) {
//                       videoRef.current.currentTime = startTime;
//                     }
//                   }}
//                 />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>JSON Editor</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <JsonEditor 
//                   segments={segments}
//                   setSegments={setSegments}
//                   videoName={videoFileName}
//                   videoDuration={videoDuration}
//                 />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }
