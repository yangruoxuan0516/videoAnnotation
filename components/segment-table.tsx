"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Segment } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface SegmentTableProps {
  segments: Segment[];
  onDelete: (index: number) => void;
  onSegmentClick: (startTime: number) => void;
}

export function SegmentTable({ segments, onDelete, onSegmentClick }: SegmentTableProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Click on any segment row to jump to that timestamp in the video.
        </AlertDescription>
      </Alert>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Segment</TableHead>
            <TableHead>Start Time (s)</TableHead>
            <TableHead>End Time (s)</TableHead>
            <TableHead>Duration (s)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((segment, index) => (
            <TableRow 
              key={index}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSegmentClick(segment.start)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{segment.start.toFixed(2)}</TableCell>
              <TableCell>{segment.end.toFixed(2)}</TableCell>
              <TableCell>{(segment.end - segment.start).toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}