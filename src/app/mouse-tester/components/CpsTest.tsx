'use client';

import { useCpsTest, type CpsDuration } from '@/hooks/useCpsTest';

const DURATIONS: CpsDuration[] = [1, 5, 10];

export default function CpsTest() {
  const { phase, duration, timeLeft, clicks, cps, start, registerClick, reset } = useCpsTest();

  const isIdle      = phase === 'idle';
  const isCountdown = phase === 'countdown';
  const isActive    = phase === 'active';
  const isDone      = phase === 'done';

  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border-c)', background: 'var(--surface)' }}
      aria-label="CPS Test"
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-c)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          CPS Test
        </h2>
        {!isIdle && (
          <button
            onClick={reset}
            className="text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            style={{ color: 'var(--muted)', background: 'var(--surface-2)' }}
            aria-label="Reset CPS test"
          >
            Reset
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Duration selector */}
        {isIdle && (
          <>
            <div>
              <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Choose duration</p>
              <div className="flex gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => start(d)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer"
                    style={{
                      background: 'var(--surface-2)',
                      border:     '1px solid var(--border-c)',
                      color:      'var(--text)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent-fg)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-c)';
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    aria-label={`Start ${d}-second CPS test`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Countdown */}
        {isCountdown && (
          <div className="text-center py-4">
            <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Get ready…</p>
            <span
              className="text-5xl font-black tabular-nums"
              style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}
              aria-live="polite"
            >
              {timeLeft}
            </span>
          </div>
        )}

        {/* Active */}
        {isActive && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>Time left</span>
              <span
                className="text-2xl font-black tabular-nums"
                style={{ color: timeLeft <= 2 ? 'var(--red)' : 'var(--text)' }}
                aria-live="polite"
              >
                {timeLeft}s
              </span>
            </div>

            <button
              onClick={registerClick}
              className="w-full py-8 rounded-xl text-base font-bold transition-all duration-75 cursor-pointer active:scale-95"
              style={{
                background: 'color-mix(in srgb, var(--accent) 12%, var(--surface-2))',
                border:     '2px solid var(--accent)',
                color:      'var(--accent-fg)',
              }}
              aria-label={`Click area — ${clicks} clicks so far`}
            >
              <div className="text-3xl font-black tabular-nums" style={{ color: 'var(--accent)' }}>
                {clicks}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                clicks — {cps} CPS
              </div>
            </button>
          </div>
        )}

        {/* Result */}
        {isDone && (
          <div className="text-center py-4 flex flex-col gap-4">
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Your CPS</p>
              <span
                className="text-5xl font-black tabular-nums"
                style={{ color: 'var(--accent)' }}
                aria-label={`Your CPS is ${cps}`}
              >
                {cps}
              </span>
              <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
                {clicks} clicks in {duration}s
              </p>
            </div>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => start(d)}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer"
                  style={{
                    background:  d === duration ? 'color-mix(in srgb, var(--accent) 15%, var(--surface-2))' : 'var(--surface-2)',
                    border:      `1px solid ${d === duration ? 'var(--accent)' : 'var(--border-c)'}`,
                    color:       d === duration ? 'var(--accent-fg)' : 'var(--text)',
                  }}
                  aria-label={`Retry with ${d}-second duration`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
