'use client';

import { useEffect, useRef } from 'react';
import type { MouseButtonId, ButtonState, ScrollState } from '@/hooks/useMouseTester';

interface MouseVisualProps {
  buttons:  Record<MouseButtonId, ButtonState>;
  scroll:   ScrollState;
  isActive: boolean;
}

export default function MouseVisual({ buttons, scroll, isActive }: MouseVisualProps) {
  const wheelRef      = useRef<SVGRectElement>(null);
  const prevScrollDir = useRef<string | null>(null);

  // Animate scroll wheel on direction change
  useEffect(() => {
    const dir = scroll?.lastDirection;
    if (!dir || (dir !== 'up' && dir !== 'down')) return;
    if (dir === prevScrollDir.current) return;
    prevScrollDir.current = dir;
    const el = wheelRef.current;
    if (!el) return;
    el.classList.remove('wheel-scroll-up', 'wheel-scroll-down');
    void el.getBoundingClientRect(); // force reflow
    el.classList.add(dir === 'up' ? 'wheel-scroll-up' : 'wheel-scroll-down');
    const t = setTimeout(() => el.classList.remove('wheel-scroll-up', 'wheel-scroll-down'), 450);
    return () => clearTimeout(t);
  }, [scroll?.lastDirection, scroll?.up, scroll?.down]);

  const L = buttons.left;
  const M = buttons.middle;
  const R = buttons.right;

  // Fill colour for a clickable button zone
  const btnFill = (state: ButtonState) =>
    state.pressed ? 'var(--btn-active-bg)' : 'var(--mouse-btn-resting)';

  // Stroke colour for a clickable button zone
  const btnStroke = (state: ButtonState) =>
    state.pressed
      ? 'var(--btn-active-border)'
      : state.detected
      ? 'color-mix(in srgb, var(--accent) 55%, var(--mouse-divider))'
      : 'transparent';

  return (
    <div
      className="flex flex-col items-center gap-3"
      aria-label="Mouse button visualizer"
      aria-live="polite"
    >
      {/* ── Mouse SVG ───────────────────────────────────────────────────── */}
      <div className="relative select-none" style={{ width: 160, height: 240 }}>
        <svg
          viewBox="0 0 160 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          aria-hidden="true"
        >
          <defs>
            <filter id="mouse-body-shadow" x="-25%" y="-10%" width="150%" height="135%">
              <feDropShadow
                dx="0" dy="5" stdDeviation="9"
                floodColor="var(--mouse-shadow-color)"
                floodOpacity="1"
              />
            </filter>
            <filter id="btn-glow-l" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── Outer body shell ─────────────────────────────────────────── */}
          <path
            d="M80 3 C42 3 15 30 15 70 L15 178 C15 212 44 237 80 237 C116 237 145 212 145 178 L145 70 C145 30 118 3 80 3 Z"
            fill="var(--mouse-body)"
            stroke="var(--mouse-body-stroke)"
            strokeWidth="2"
            filter="url(#mouse-body-shadow)"
          />

          {/* ── Left click button ─────────────────────────────────────────── */}
          <path
            className="mouse-btn"
            d="M79 3 C59 3 34 13 21 33 L15 70 L15 92 C15 92 42 97 79 97 L79 3 Z"
            fill={btnFill(L)}
            stroke={btnStroke(L)}
            strokeWidth="2"
            filter={L.pressed ? 'url(#btn-glow-l)' : undefined}
            aria-label={`Left button — ${L.pressed ? 'pressed' : L.detected ? 'detected' : 'waiting'}`}
          />

          {/* ── Right click button ────────────────────────────────────────── */}
          <path
            className="mouse-btn"
            d="M81 3 C101 3 126 13 139 33 L145 70 L145 92 C145 92 118 97 81 97 L81 3 Z"
            fill={btnFill(R)}
            stroke={btnStroke(R)}
            strokeWidth="2"
            filter={R.pressed ? 'url(#btn-glow-l)' : undefined}
            aria-label={`Right button — ${R.pressed ? 'pressed' : R.detected ? 'detected' : 'waiting'}`}
          />

          {/* ── Vertical centre divider (top half only) ───────────────────── */}
          <line
            x1="80" y1="3" x2="80" y2="92"
            stroke="var(--mouse-divider)"
            strokeWidth="1.5"
          />

          {/* ── Horizontal button / body divider ──────────────────────────── */}
          <path
            d="M15 93 C15 93 42 98 80 98 C118 98 145 93 145 93"
            stroke="var(--mouse-divider)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* ── Middle button highlight when pressed ──────────────────────── */}
          {M.pressed && (
            <rect
              x="69" y="3" width="22" height="90"
              rx="2"
              fill="var(--btn-active-bg)"
              opacity="0.7"
            />
          )}

          {/* ── Scroll wheel ─────────────────────────────────────────────── */}
          <rect
            ref={wheelRef}
            x="71.5" y="14" width="17" height="40"
            rx="8.5"
            fill={
              M.pressed  ? 'var(--btn-active-border)' :
              M.detected ? 'color-mix(in srgb, var(--accent) 70%, var(--mouse-wheel-fill))' :
                           'var(--mouse-wheel-fill)'
            }
            stroke="var(--mouse-wheel-stroke)"
            strokeWidth="1.5"
            style={{
              transition: 'fill 0.12s ease, filter 0.15s ease',
              filter: M.pressed ? 'drop-shadow(0 0 7px var(--btn-active-border))' : 'none',
            }}
          />

          {/* Wheel grip notches */}
          {[22, 27, 32, 37, 42, 47].map((y, i) => (
            <line
              key={i}
              x1="75" y1={y} x2="85" y2={y}
              stroke={M.pressed ? 'rgba(255,255,255,0.5)' : 'color-mix(in srgb, var(--mouse-wheel-stroke) 60%, transparent)'}
              strokeWidth="1.2"
              strokeLinecap="round"
              style={{ transition: 'stroke 0.1s ease' }}
            />
          ))}

          {/* ── Lower body groove / sensor ────────────────────────────────── */}
          <ellipse
            cx="80" cy="176" rx="20" ry="28"
            fill="var(--mouse-groove)"
            stroke="var(--mouse-divider)"
            strokeWidth="1"
            opacity="0.8"
          />
          <ellipse
            cx="80" cy="176" rx="7" ry="12"
            fill="var(--mouse-groove-inner)"
            opacity="0.9"
          />

          {/* ── Pressed glow ring on the whole body ───────────────────────── */}
          {(L.pressed || R.pressed || M.pressed) && (
            <path
              d="M80 3 C42 3 15 30 15 70 L15 178 C15 212 44 237 80 237 C116 237 145 212 145 178 L145 70 C145 30 118 3 80 3 Z"
              fill="none"
              stroke="var(--btn-active-border)"
              strokeWidth="2"
              opacity="0.35"
              style={{ pointerEvents: 'none', transition: 'opacity 0.15s ease' }}
            />
          )}
        </svg>

        {/* ── Inactive overlay ────────────────────────────────────────────── */}
        {!isActive && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:    'color-mix(in srgb, var(--bg) 55%, transparent)',
              backdropFilter: 'blur(3px)',
              borderRadius:  '50% 50% 45% 45% / 40% 40% 50% 50%',
            }}
            aria-hidden="true"
          >
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--surface-2)',
                border:     '1px solid var(--border-c)',
                color:      'var(--muted)',
              }}
            >
              Inactive
            </span>
          </div>
        )}
      </div>

      {/* ── Button labels ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-1.5 w-36" aria-hidden="true">
        <BtnLabel label="L" state={L} />
        <BtnLabel label="M" state={M} />
        <BtnLabel label="R" state={R} />
      </div>

      {/* Extra side buttons */}
      {(buttons.back.detected || buttons.forward.detected) && (
        <div className="flex gap-2" aria-label="Extra mouse buttons">
          {buttons.back.detected && (
            <BtnChip label="← Back"    state={buttons.back}    />
          )}
          {buttons.forward.detected && (
            <BtnChip label="Forward →" state={buttons.forward} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Small reusable sub-components ────────────────────────────────────────────

function BtnLabel({ label, state }: { label: string; state: ButtonState }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-all duration-100"
      style={{
        background:  state.pressed  ? 'var(--btn-active-bg)'   : 'var(--surface-2)',
        border:      `1.5px solid ${
          state.pressed  ? 'var(--btn-active-border)' :
          state.detected ? 'color-mix(in srgb, var(--accent) 50%, var(--border-c))' :
                           'var(--border-c)'
        }`,
        boxShadow:   state.pressed ? '0 0 12px var(--btn-active-glow)' : 'none',
      }}
    >
      <span
        className="text-lg leading-none"
        style={{
          color: state.pressed ? 'var(--btn-active-border)' : state.detected ? 'var(--accent)' : 'var(--border-2)',
        }}
      >
        {state.pressed ? '●' : state.detected ? '◉' : '○'}
      </span>
      <span
        className="text-xs font-bold"
        style={{ color: state.pressed ? 'var(--accent-fg)' : state.detected ? 'var(--accent)' : 'var(--muted)' }}
      >
        {label}
      </span>
    </div>
  );
}

function BtnChip({ label, state }: { label: string; state: ButtonState }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-md transition-all duration-100"
      style={{
        background: state.pressed ? 'var(--btn-active-bg)'     : 'var(--surface-2)',
        border:     `1px solid ${state.pressed ? 'var(--btn-active-border)' : 'var(--border-c)'}`,
        color:      state.pressed ? 'var(--accent-fg)'         : 'var(--muted)',
      }}
    >
      {label}
    </span>
  );
}
