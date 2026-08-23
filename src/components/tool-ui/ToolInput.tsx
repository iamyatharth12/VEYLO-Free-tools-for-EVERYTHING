'use client';

import React from 'react';

interface ToolInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'number';
  rows?: number;
  helpText?: string;
  errorText?: string;
  charCount?: boolean;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
}

export function ToolInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'textarea',
  rows = 6,
  helpText,
  errorText,
  charCount = true,
  onClear,
  className = '',
  disabled = false,
}: ToolInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
          {label}
        </label>

        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
          {charCount && (
            <span>{value.length.toLocaleString()} chars</span>
          )}
          {onClear && value.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs hover:underline cursor-pointer"
              style={{ color: 'var(--accent)' }}
              aria-label={`Clear ${label}`}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className="w-full p-3.5 rounded-xl text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text)',
            border: errorText ? '1px solid var(--red, #ef4444)' : '1px solid var(--border-c)',
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-3 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text)',
            border: errorText ? '1px solid var(--red, #ef4444)' : '1px solid var(--border-c)',
          }}
        />
      )}

      {errorText ? (
        <p className="text-xs font-medium" style={{ color: 'var(--red, #ef4444)' }} role="alert">
          {errorText}
        </p>
      ) : helpText ? (
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
