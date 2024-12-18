"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Segment } from "@/lib/types";

interface SegmentListProps {
  segments: Segment[];
  setSegments: (segments: Segment[]) => void;
  videoDuration: number;
}

export function SegmentList({ segments, setSegments, videoDuration }: SegmentListProps) {
  const deleteSegment = (index: number) => {
    if (segments.length <= 1) return;

    const newSegments = [...segments];
    newSegments.splice(index, 1);

    if (index > 0 && index < segments.length) {
      newSegments[index - 1].end = segments[index].end;
    }

    setSegments(newSegments);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Segment</TableHead>
              <TableHead>Start Time (s)</TableHead>
              <TableHead>End Time (s)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segments.map((segment, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{segment.start.toFixed(2)}</TableCell>
                <TableCell>{segment.end.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSegment(index)}
                    disabled={segments.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}