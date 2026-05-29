import type { ClipOptions } from '../../shared/types';
import { Checkbox } from '../../shared/ui/Checkbox';

interface ClipOptionsProps {
  options: ClipOptions;
  onChange: (opts: ClipOptions) => void;
}

export const ClipOptionsPanel = ({ options, onChange }: ClipOptionsProps) => {
  const set = <K extends keyof ClipOptions>(key: K, val: ClipOptions[K]) =>
    onChange({ ...options, [key]: val });

  return (
    <div className="glass-card" style={{ padding: '20px 24px' }}>
      <div className="section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
        Options
      </div>

      {/* Output prefix */}
      <div style={{ marginBottom: 20 }}>
        <label className="field-label" htmlFor="output-prefix">
          Output prefix
        </label>
        <input
          id="output-prefix"
          className="field-input"
          type="text"
          value={options.prefix}
          onChange={(e) => set('prefix', e.target.value)}
          placeholder="raw"
        />
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 6 }}>
          Prepended to every output filename: <code style={{ color: 'var(--accent)' }}>{options.prefix || 'clip'}_00-04-40-00-06-10.mkv</code>
        </p>
      </div>

      <div className="glow-divider" />

      {/* Filename format */}
      <div style={{ marginBottom: 20 }}>
        <p className="field-label" style={{ marginBottom: 12 }}>Output filename format</p>

        <Checkbox
          id="opt-use-index"
          checked={options.useIndex}
          onChange={(v) => set('useIndex', v)}
          label="Use sequential index"
          hint={options.useIndex ? 'e.g. raw_01.mkv' : undefined}
        />

        {!options.useIndex && (
          <>
            <Checkbox
              id="opt-include-start"
              checked={options.includeStart}
              onChange={(v) => set('includeStart', v)}
              label="Include start time"
              hint="HH-MM-SS"
            />
            <Checkbox
              id="opt-include-end"
              checked={options.includeEnd}
              onChange={(v) => set('includeEnd', v)}
              label="Include end time"
              hint="HH-MM-SS"
            />
          </>
        )}
      </div>

      <div className="glow-divider" />

      {/* Codec mode */}
      <div style={{ marginBottom: 20 }}>
        <p className="field-label" style={{ marginBottom: 12 }}>Encoding mode</p>
        <div className="radio-group">
          <button
            id="codec-copy"
            className={`radio-btn ${options.copyMode === 'copy' ? 'active' : ''}`}
            onClick={() => set('copyMode', 'copy')}
            title="Stream copy — fast, lossless, no re-encode"
          >
            ⚡ -c copy
          </button>
          <button
            id="codec-encode"
            className={`radio-btn ${options.copyMode === 'encode' ? 'active' : ''}`}
            onClick={() => set('copyMode', 'encode')}
            title="Re-encode with H.264 + AAC"
          >
            🎬 H.264 + AAC
          </button>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 8 }}>
          {options.copyMode === 'copy'
            ? '⚡ Fast stream copy — no quality loss, instant processing'
            : '🎬 Re-encodes video — slower, but precise cut points'}
        </p>
      </div>

      <div className="glow-divider" />

      {/* Map streams */}
      <div>
        <p className="field-label" style={{ marginBottom: 12 }}>Stream mapping</p>
        <Checkbox
          id="opt-map-all"
          checked={options.mapAll}
          onChange={(v) => set('mapAll', v)}
          label="-map 0 (include all streams)"
          hint="audio, video, subtitles"
        />
      </div>
    </div>
  );
};
