'use client';

import type { ScrollState } from '@/hooks/useMouseTester';

interface ScrollTestProps {
  scroll: ScrollState;
}

function ScrollIndicator({ label, count, active }: { label: string; count: number; active: boolean }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all duration-150"
      style={{
        background: active
          ? 'color-mix(in srgb, var(--green) 12%, var(--surface-2))'
          : 'var(--surface-2)',
        border:     `1px solid ${active ? 'var(--green)' : 'var(--border-c)'}`,
        flex:       1,
      }}
      aria-label={`${label}: ${count} events`}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: active ? 'var(--green)' : 'var(--muted)' }}
      >
        {label}
      </span>
      <span
        className="text-xl font-black tabular-nums"
        style={{ color: active ? 'var(--green)' : 'var(--text)' }}
      >
        {count}
      </span>
    </div>
  );
}

export default function ScrollTest({ scroll }: ScrollTestProps) {
  const lastDir = scroll.lastDirection;

  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border-c)', background: 'var(--surface)' }}
      aria-label="Scroll test"
    >
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-c)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Scroll Test
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <ScrollIndicator label="Scroll Up"         count={scroll.up}         active={lastDir === 'up'} />
          <ScrollIndicator label="Scroll Down"       count={scroll.down}       active={lastDir === 'down'} />
          <ScrollIndicator label="Horizontal"        count={scroll.horizontal} active={lastDir === 'left' || lastDir === 'right'} />
        </div>

        {/* Visual scroll bar */}
        <div
          className="relative h-8 rounded-lg overflow-hidden flex items-center justify-center text-xs"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
          aria-hidden="true"
        >
          <span style={{ color: 'var(--muted)' }}>
            {lastDir
              ? `↕ Last scroll: ${lastDir}`
              : 'Use your scroll wheel to test'}
          </span>
        </div>

        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          To test your scroll wheel: place your mouse anywhere on this page and rotate the wheel. 
          Horizontal scrolling can be tested using a tilt-wheel, trackpad, or Shift + scroll on some devices.
        </p>
      </div>
    </section>
  );
}
