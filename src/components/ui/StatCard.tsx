import type { ReactNode } from 'react';

interface StatCardProps {
  label:     string;
  value:     string | number;
  icon?:     ReactNode;
  highlight?: boolean;
  mono?:     boolean;
}

export default function StatCard({ label, value, icon, highlight, mono }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1.5"
      style={{
        background:   'var(--surface)',
        border:       `1px solid ${highlight ? 'var(--accent)' : 'var(--border-c)'}`,
        boxShadow:    highlight ? '0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent)' : undefined,
      }}
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          {label}
        </span>
        {icon && (
          <span style={{ color: highlight ? 'var(--accent)' : 'var(--muted)' }} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <span
        className={`text-xl font-bold leading-none ${mono ? 'font-mono' : ''}`}
        style={{ color: highlight ? 'var(--accent-fg)' : 'var(--text)' }}
      >
        {value}
      </span>
    </div>
  );
}
