import { getExtension } from '../../shared/utils/ffmpegBuilder';

interface FileInputProps {
  value: string;
  onChange: (v: string) => void;
}

export const FileInput = ({ value, onChange }: FileInputProps) => {
  const ext = getExtension(value);

  return (
    <div className="glass-card" style={{ padding: '20px 24px' }}>
      <div className="section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        Source File
      </div>

      <label className="field-label" htmlFor="source-file-input">
        Input filename
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id="source-file-input"
          className="field-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="raw_part1-footage.mkv"
          spellCheck={false}
          style={{ paddingRight: ext ? '80px' : '14px' }}
        />
        {ext && (
          <span
            className="badge badge-accent"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            .{ext}
          </span>
        )}
      </div>
      {value && !ext && (
        <p style={{ fontSize: '11px', color: 'var(--warning)', marginTop: 6 }}>
          ⚠ No file extension detected — please include it (e.g. .mkv, .mp4)
        </p>
      )}
    </div>
  );
};
