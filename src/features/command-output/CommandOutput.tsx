import { useState, useMemo, type JSX } from 'react';
import type { FFmpegConfig } from '../../shared/types';
import { buildFFmpegCommand } from '../../shared/utils/ffmpegBuilder';

interface CommandOutputProps {
  config: FFmpegConfig;
}

// Syntax-highlight the command string into JSX spans
function highlightCommand(cmd: string): (JSX.Element | null | string)[] {
  if (!cmd) return [];

  // Tokenise by whitespace/newline while keeping separators
  const tokens = cmd.split(/(\s+|\\)/g);
  let isFirst = true;

  return tokens.map((token, i) => {
    if (!token) return null;
    // Whitespace / line-continuation
    if (/^\s+$/.test(token) || token === '\\') {
      return <span key={i}>{token}</span>;
    }

    // First token = command name
    if (isFirst && /^ffmpeg$/i.test(token)) {
      isFirst = false;
      return <span key={i} className="token-cmd">{token}</span>;
    }
    isFirst = false;

    // Flags starting with -
    if (/^-/.test(token)) {
      // time-related flags
      if (['-ss', '-to', '-t'].includes(token)) {
        return <span key={i} className="token-time">{token}</span>;
      }
      // codec flags
      if (['-c', '-c:v', '-c:a', '-vcodec', '-acodec'].includes(token)) {
        return <span key={i} className="token-codec">{token}</span>;
      }
      return <span key={i} className="token-flag">{token}</span>;
    }

    // Timestamps HH:MM:SS
    if (/^\d{2}:\d{2}:\d{2}$/.test(token)) {
      return <span key={i} className="token-time">{token}</span>;
    }

    // Codec values
    if (['copy', 'libx264', 'aac'].includes(token)) {
      return <span key={i} className="token-codec">{token}</span>;
    }

    // Everything else = file
    return <span key={i} className="token-file">{token}</span>;
  });
}

export const CommandOutput = ({ config }: CommandOutputProps) => {
  const [copied, setCopied] = useState(false);

  const command = useMemo(() => buildFFmpegCommand(config), [config]);

  const handleCopy = async () => {
    if (!command) return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = command;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!command) return;
    const blob = new Blob([`#!/bin/bash\n\n${command}\n`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cut_clips.sh';
    a.click();
    URL.revokeObjectURL(url);
  };

  const isEmpty = !config.inputFile || config.clips.length === 0;
  const clipCount = config.clips.length;

  return (
    <div className="glass-card" style={{ padding: '20px 24px' }}>
      <div className="section-title" style={{ marginBottom: 12 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5"/>
          <line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
        Generated Command
        {clipCount > 0 && (
          <span className="badge badge-accent" style={{ marginLeft: 'auto', textTransform: 'none', letterSpacing: 0 }}>
            {clipCount} clip{clipCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {isEmpty ? (
        <div className="empty-state command-pre" style={{ minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#040810' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <polyline points="4 17 10 11 4 5"/>
            <line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
          <p style={{ marginTop: 12 }}>
            {!config.inputFile
              ? 'Enter a source filename to start'
              : 'Paste timestamps to generate the command'}
          </p>
        </div>
      ) : (
        <>
          <div
            className="command-pre"
            id="command-output-block"
            style={{ minHeight: 120 }}
          >
            {highlightCommand(command)}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button
              id="copy-command-btn"
              className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
              onClick={handleCopy}
              style={{ flex: 1, justifyContent: 'center', minWidth: 140 }}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy Command
                </>
              )}
            </button>

            <button
              id="download-sh-btn"
              className="btn btn-secondary"
              onClick={handleDownload}
              style={{ flex: 1, justifyContent: 'center', minWidth: 140 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download .sh
            </button>
          </div>

          {/* Per-clip output names preview */}
          <div style={{ marginTop: 20 }}>
            <p className="field-label" style={{ marginBottom: 10 }}>Output files ({clipCount})</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {config.clips.map((_, i) => {
                // Re-derive output name by parsing the command
                const lines = command.split('\\\n').slice(1);
                const outFile = lines[i]?.trim().split(' ').pop() ?? '';
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '6px 10px',
                      background: '#070b16',
                      borderRadius: 6,
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', minWidth: 22 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ color: '#34d399' }}>{outFile}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
