import { useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type { TimestampClip } from '../../shared/types';
import { parseTimestamps, computeDuration } from '../../shared/utils/ffmpegBuilder';

interface TimestampParserProps {
  value: string;
  onChange: (v: string) => void;
  onClipsParsed: (clips: TimestampClip[]) => void;
}

export const TimestampParser = ({
  value,
  onChange,
  onClipsParsed,
}: TimestampParserProps) => {
  const clips = parseTimestamps(value);

  useEffect(() => {
    onClipsParsed(clips);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="glass-card" style={{ padding: '20px 24px' }}>
      <div className="section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        Timestamps
        {clips.length > 0 && (
          <span className="badge badge-accent" style={{ marginLeft: 'auto', textTransform: 'none', letterSpacing: 0 }}>
            {clips.length} clip{clips.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      <label className="field-label" htmlFor="timestamps-textarea">
        Paste your notes — only HH:MM:SS-HH:MM:SS pairs are extracted
      </label>
      <textarea
        id="timestamps-textarea"
        className="field-textarea"
        value={value}
        onChange={handleChange}
        placeholder={`00:04:40-00:06:10\tsome comment here\n\nYou can paste raw notes — extra text is ignored.`}
        rows={8}
        spellCheck={false}
      />

      {/* Parsed clips preview */}
      {clips.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div className="pulse-dot" />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Parsed Clips
            </span>
          </div>

          <div className="clips-scroll">
            <div className="clip-row clip-row-header">
              <span>#</span>
              <span>Start</span>
              <span>End</span>
              <span>Duration</span>
              <span>Label</span>
            </div>
            {clips.map((clip, i) => (
              <div key={i} className="clip-row">
                <span style={{ color: 'var(--text-muted)' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ color: '#fbbf24' }}>{clip.start}</span>
                <span style={{ color: '#fbbf24' }}>{clip.end}</span>
                <span style={{ color: 'var(--success)' }}>{computeDuration(clip.start, clip.end)}</span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {clip.label || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {value && clips.length === 0 && (
        <div className="empty-state" style={{ paddingTop: 16 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>No valid timestamps found.<br/>Expected format: <code style={{ color: 'var(--accent)', fontSize: 12 }}>HH:MM:SS-HH:MM:SS</code></p>
        </div>
      )}
    </div>
  );
};
