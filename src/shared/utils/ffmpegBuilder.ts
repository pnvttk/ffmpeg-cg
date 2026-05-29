import type { TimestampClip, ClipOptions, FFmpegConfig } from '../types';

/** Convert HH:MM:SS → requested format (for filenames) */
export function timeToFilename(time: string, format: 'HHMMSS' | 'HH-MM-SS' | 'HH_MM_SS'): string {
  if (format === 'HHMMSS') return time.replace(/:/g, '');
  if (format === 'HH_MM_SS') return time.replace(/:/g, '_');
  return time.replace(/:/g, '-');
}

/** Compute HH:MM:SS duration between start and end */
export function computeDuration(start: string, end: string): string {
  const toSeconds = (t: string) => {
    const [h, m, s] = t.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  };
  const diff = toSeconds(end) - toSeconds(start);
  if (diff <= 0) return '??:??:??';
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

/** Build an output filename for a single clip */
function buildOutputName(
  prefix: string,
  start: string,
  end: string,
  ext: string,
  index: number,
  options: ClipOptions
): string {
  const parts: string[] = [];
  if (prefix) parts.push(prefix);

  if (options.useIndex) {
    parts.push(String(index + 1).padStart(2, '0'));
  } else {
    const segments: string[] = [];
    if (options.includeStart) segments.push(timeToFilename(start, options.timeFormat));
    if (options.includeEnd) segments.push(timeToFilename(end, options.timeFormat));
    if (segments.length > 0) parts.push(segments.join('-'));
  }

  return parts.join('_') + '.' + (ext || 'mkv');
}

/** Build the full ffmpeg command string */
export function buildFFmpegCommand(config: FFmpegConfig): string {
  const { inputFile, clips, options } = config;
  if (!inputFile || clips.length === 0) return '';

  const ext = inputFile.split('.').pop() ?? 'mkv';
  const codecArgs =
    options.copyMode === 'copy'
      ? '-c copy'
      : '-c:v libx264 -c:a aac';
  const mapFlag = options.mapAll ? '-map 0 ' : '';

  const parts: string[] = [`ffmpeg -i ${inputFile}`];

  clips.forEach((clip, i) => {
    const outName = buildOutputName(
      options.prefix,
      clip.start,
      clip.end,
      ext,
      i,
      options
    );
    parts.push(`${mapFlag}-ss ${clip.start} -to ${clip.end} ${codecArgs} ${outName}`);
  });

  return parts.join(' \\\n  ');
}

/** Parse raw textarea text → array of TimestampClip */
export function parseTimestamps(raw: string): TimestampClip[] {
  const clips: TimestampClip[] = [];
  const lines = raw.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    // Match HH:MM:SS-HH:MM:SS (with optional space around dash)
    const match = /(\d{2}:\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2}:\d{2})(.*)/.exec(trimmed);
    if (match) {
      const label = match[3]?.replace(/^\s*[\t]+\s*/, '').trim() || undefined;
      clips.push({ start: match[1], end: match[2], label });
    }
  }

  return clips;
}

/** Detect file extension */
export function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}
