'use client';

import type { DoubleClickState } from '@/hooks/useMouseTester';

interface DoubleClickSectionProps {
  dc: DoubleClickState;
}

export default function DoubleClickSection({ dc }: DoubleClickSectionProps) {
  const { count, lastInterval } = dc;

  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border-c)', background: 'var(--surface)' }}
      aria-label="Double-click detection"
    >
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-c)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Double-Click Detection
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
          >
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
              Double Clicks
            </p>
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: count > 0 ? 'var(--accent-fg)' : 'var(--text)' }}
            >
              {count}
            </span>
          </div>

          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
          >
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
              Last Interval
            </p>
            <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text)' }}>
              {lastInterval !== null ? `${lastInterval}ms` : '—'}
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: count > 0 ? 'var(--green)' : 'var(--muted)' }}
            aria-hidden="true"
          />
          <span style={{ color: 'var(--muted)' }}>
            {count > 0
              ? `${count} double-click${count !== 1 ? 's' : ''} detected this session`
              : 'Double-click your left mouse button to test'}
          </span>
        </div>

        {/* Disclaimer */}
        <p
          className="text-xs leading-relaxed"
          style={{
            color:       'var(--muted)',
            borderTop:   '1px solid var(--border-c)',
            paddingTop:  '12px',
          }}
        >
          <strong style={{ color: 'var(--text)' }}>Note:</strong> Rapid repeated clicks can suggest a worn mouse switch, 
          but a browser test cannot definitively diagnose hardware failure. If you&apos;re seeing unexpected double-clicks 
          during normal use, consider cleaning the switch contacts or testing in another application.
        </p>
      </div>
    </section>
  );
}
