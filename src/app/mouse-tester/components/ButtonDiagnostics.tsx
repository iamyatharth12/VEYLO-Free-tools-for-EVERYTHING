'use client';

import type { MouseButtonId, ButtonState } from '@/hooks/useMouseTester';

interface ButtonDiagnosticsProps {
  buttons: Record<MouseButtonId, ButtonState>;
}

const BUTTONS: { id: MouseButtonId; label: string }[] = [
  { id: 'left',    label: 'Left Button'    },
  { id: 'middle',  label: 'Middle Button'  },
  { id: 'right',   label: 'Right Button'   },
  { id: 'back',    label: 'Back Button'    },
  { id: 'forward', label: 'Forward Button' },
];

function statusLabel(state: ButtonState) {
  if (state.pressed)  return 'Pressed';
  if (state.detected) return 'Detected';
  return 'Waiting';
}

function statusColor(state: ButtonState) {
  if (state.pressed)  return 'var(--accent)';
  if (state.detected) return 'var(--green)';
  return 'var(--muted)';
}

export default function ButtonDiagnostics({ buttons }: ButtonDiagnosticsProps) {
  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border-c)', background: 'var(--surface)' }}
      aria-label="Mouse button diagnostics"
    >
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-c)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Button Diagnostics
        </h2>
      </div>

      <div className="p-4">
        <ul className="flex flex-col gap-2" role="list">
          {BUTTONS.map(({ id, label }) => {
            const state = buttons[id];
            // Only show extra buttons if they've been detected (or always show the core 3)
            const isCore = id === 'left' || id === 'middle' || id === 'right';
            if (!isCore && !state.detected) return null;

            const color = statusColor(state);
            const text  = statusLabel(state);

            return (
              <li
                key={id}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
                aria-label={`${label}: ${text}`}
              >
                <span className="text-sm" style={{ color: 'var(--text)' }}>
                  {label}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: color, boxShadow: state.pressed || state.detected ? `0 0 8px ${color}` : 'none' }}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold" style={{ color }}>
                    {text}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 text-xs" style={{ color: 'var(--muted)' }}>
          Click each button to register it. Back and Forward buttons appear when detected. 
          Browser support for extra buttons varies by OS and driver.
        </p>
      </div>
    </section>
  );
}
