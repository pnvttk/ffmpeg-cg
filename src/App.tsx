import { useState } from 'react';
import type { TimestampClip, ClipOptions } from './shared/types';
import { FileInput } from './features/file-input/FileInput';
import { TimestampParser } from './features/timestamp-parser/TimestampParser';
import { ClipOptionsPanel } from './features/clip-options/ClipOptions';
import { CommandOutput } from './features/command-output/CommandOutput';

const DEFAULT_OPTIONS: ClipOptions = {
  prefix: 'raw',
  includeStart: true,
  includeEnd: true,
  useIndex: false,
  timeFormat: 'HHMMSS',
  copyMode: 'copy',
  mapAll: true,
};

function App() {
  const [inputFile, setInputFile] = useState(() => {
    return localStorage.getItem('yt-dlp-cg:output-name') || '';
  });
  const [timestampText, setTimestampText] = useState('');
  const [clips, setClips] = useState<TimestampClip[]>([]);
  const [options, setOptions] = useState<ClipOptions>(DEFAULT_OPTIONS);

  const config = { inputFile, clips, options };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background grid */}
      <div
        className="bg-grid"
        style={{
          position: 'fixed',
          inset: 0,
          opacity: 0.25,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Radial glow top-center */}
      <div
        style={{
          position: 'fixed',
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(ellipse, #00e5ff18 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px' }}>
        {/* Header */}
        <header style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #00e5ff22, #00e5ff44)',
              border: '1px solid #00e5ff55',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </span>
            <h1 style={{
              fontSize: 'clamp(22px, 4vw, 32px)',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #e2e8f0 0%, #00e5ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}>
              FFmpeg Cut Generator
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
            Paste your timestamps, set options, and get a ready-to-run&nbsp;
            <code style={{ color: 'var(--accent)', fontSize: 13 }}>ffmpeg</code> command instantly.
          </p>
        </header>

        {/* Main grid: left inputs / right output */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: 20,
            alignItems: 'start',
          }}
          className="main-grid"
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FileInput value={inputFile} onChange={setInputFile} />
            <TimestampParser
              value={timestampText}
              onChange={setTimestampText}
              onClipsParsed={setClips}
            />
            <ClipOptionsPanel options={options} onChange={setOptions} />
          </div>

          {/* Right column — sticky */}
          <div style={{ position: 'sticky', top: 20 }}>
            <CommandOutput config={config} />
          </div>
        </div>

        {/* Footer */}
        <footer style={{ marginTop: 60, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
          <p>
            Built for quick video cutting workflows ·{' '}
            <a
              href="https://ffmpeg.org/ffmpeg.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              FFmpeg docs ↗
            </a>
          </p>
        </footer>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 700px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
