'use client';

import React from 'react';

interface GenerateButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function GenerateButton({
  onClick,
  loading = false,
  disabled = false,
  label = 'Generate',
  className = '',
  icon,
}: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${className}`}
      style={{
        background: 'var(--accent)',
        color: '#ffffff',
      }}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        icon
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )}
      <span>{loading ? 'Processing...' : label}</span>
    </button>
  );
}

interface ResetButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function ResetButton({
  onClick,
  disabled = false,
  label = 'Reset',
  className = '',
}: ResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        background: 'var(--surface-2)',
        color: 'var(--muted)',
        border: '1px solid var(--border-c)',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
