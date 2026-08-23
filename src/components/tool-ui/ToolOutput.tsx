'use client';

import React from 'react';
import CopyButton from './CopyButton';

interface ToolOutputProps {
  id?: string;
  label: string;
  value: string;
  placeholder?: string;
  monospace?: boolean;
  rows?: number;
  onDownload?: () => void;
  downloadFilename?: string;
  className?: string;
}

export function ToolOutput({
  id = 'tool-output',
  label,
  value,
  placeholder = 'Output will appear here...',
  monospace = true,
  rows = 6,
  onDownload,
  downloadFilename,
  className = '',
}: ToolOutputProps) {
  const handleDownload = () => {
    if (!value) return;
    if (onDownload) {
      onDownload();
      return;
    }

    const filename = downloadFilename || 'veylo-output.txt';
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
          {label}
        </label>

        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              aria-label="Download output as file"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download</span>
            </button>
          )}
          <CopyButton textToCopy={value} size="sm" />
        </div>
      </div>

      <div className="relative">
        <textarea
          id={id}
          readOnly
          value={value}
          placeholder={placeholder}
          rows={rows}
          className={`w-full p-3.5 rounded-xl text-sm transition-colors focus:outline-none resize-y ${
            monospace ? 'font-mono' : ''
          }`}
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text)',
            border: '1px solid var(--border-c)',
          }}
        />
      </div>
    </div>
  );
}
