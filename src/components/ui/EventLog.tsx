'use client';

import type { MouseEvent_ } from '@/hooks/useMouseTester';

interface EventLogProps {
  events:   MouseEvent_[];
  onClear:  () => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
}

function eventColor(type: string): string {
  if (type === 'DOWN')   return '#6366f1';
  if (type === 'UP')     return '#a5b4fc';
  if (type === 'SCROLL') return '#22c55e';
  return '#7c7c8a';
}

export default function EventLog({ events, onClear }: EventLogProps) {
  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border-c)', background: 'var(--surface)' }}
      aria-label="Mouse event log"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-c)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Event Monitor
        </h2>
        <button
          onClick={onClear}
          className="text-xs px-2.5 py-1 rounded-md transition-colors duration-150 cursor-pointer"
          style={{ color: 'var(--muted)', background: 'var(--surface-2)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          aria-label="Clear event log"
        >
          Clear Log
        </button>
      </div>

      {/* Log entries */}
      <div
        className="overflow-y-auto font-mono text-xs"
        style={{ maxHeight: '240px' }}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {events.length === 0 ? (
          <p
            className="px-4 py-6 text-center"
            style={{ color: 'var(--muted)' }}
          >
            Move or click your mouse to see events…
          </p>
        ) : (
          events.map(ev => (
            <div
              key={ev.id}
              className="flex items-center gap-3 px-4 py-1.5 border-b last:border-b-0"
              style={{ borderColor: 'var(--border-c)' }}
            >
              <span style={{ color: 'var(--muted)', flexShrink: 0 }}>
                {formatTime(ev.timestamp)}
              </span>
              <span
                className="font-semibold"
                style={{ color: eventColor(ev.type) }}
              >
                {ev.detail}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
