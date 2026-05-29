// Timestamp pair parsed from notes
export interface TimestampClip {
  start: string;   // HH:MM:SS
  end: string;     // HH:MM:SS
  label?: string;  // optional comment after the timestamp range
}

export interface ClipOptions {
  prefix: string;
  includeStart: boolean;
  includeEnd: boolean;
  useIndex: boolean;
  timeFormat: 'HHMMSS' | 'HH-MM-SS' | 'HH_MM_SS';
  copyMode: 'copy' | 'encode';
  mapAll: boolean;
  commandStyle: 'single' | 'multi';
}

export interface FFmpegConfig {
  inputFile: string;
  clips: TimestampClip[];
  options: ClipOptions;
}
