export interface Segment {
  after?: string;
  start: number;
  end: number;
}

export interface DraftSegment {
  timestamp: number;
  note?: string;
}