'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function CpsChallenge() {
  const [duration, setDuration] = useState<number>(5); // 5 seconds default
  const [clickCount, setClickCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [cps, setCps] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`mt-cps-highscore-${duration}`);
    if (saved) {
      setHighScore(Number(saved));
    } else {
      setHighScore(0);
    }
  }, [duration]);

  const startTest = useCallback(() => {
    setStatus('running');
    setClickCount(1);
    setTimeLeft(duration);
    setCps(0);

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      const elapsedSec = (now - startTime) / 1000;

      setTimeLeft(remaining);

      if (now >= endTime) {
        clearInterval(timerRef.current!);
        setStatus('finished');
        setClickCount(prev => {
          const finalCps = Number((prev / duration).toFixed(2));
          setCps(finalCps);

          const curHigh = Number(localStorage.getItem(`mt-cps-highscore-${duration}`) || 0);
          if (finalCps > curHigh) {
            localStorage.setItem(`mt-cps-highscore-${duration}`, String(finalCps));
            setHighScore(finalCps);
          }
          return prev;
        });
      } else {
        setClickCount(prev => {
          if (elapsedSec > 0) {
            setCps(Number((prev / elapsedSec).toFixed(1)));
          }
          return prev;
        });
      }
    }, 100);
  }, [duration]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (status === 'idle') {
      startTest();
    } else if (status === 'running') {
      setClickCount(prev => prev + 1);
    }
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('idle');
    setClickCount(0);
    setTimeLeft(duration);
    setCps(0);
  };

  const getRank = (score: number) => {
    if (score >= 12) return '🚀 Cyber Clicker (God Tier)';
    if (score >= 9) return '⚡ Butterfly Master';
    if (score >= 7) return '🎯 Pro Gamer';
    if (score >= 5) return '👍 Average Clicker';
    return '🐢 Slow & Steady';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Control Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <div className="flex items-center gap-3 text-xs">
          <label className="font-semibold" style={{ color: 'var(--text)' }}>Test Duration:</label>
          <div className="flex gap-1">
            {[1, 5, 10, 30, 60].map(d => (
              <button
                key={d}
                onClick={() => {
                  setDuration(d);
                  reset();
                }}
                disabled={status === 'running'}
                className="px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all"
                style={{
                  background: duration === d ? 'var(--accent)' : 'var(--surface-2)',
                  color: duration === d ? '#fff' : 'var(--text)',
                  border: '1px solid var(--border-c)',
                }}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={reset}
          className="px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}
        >
          Reset
        </button>
      </div>

      {/* Main Click Target */}
      <div
        onClick={handleClick}
        onContextMenu={e => e.preventDefault()}
        className="group relative flex flex-col items-center justify-center p-12 rounded-3xl text-center select-none cursor-pointer transition-all duration-150 active:scale-[0.98]"
        style={{
          background: status === 'running'
            ? 'color-mix(in srgb, var(--accent) 15%, var(--surface))'
            : 'var(--surface)',
          border: `2px solid ${status === 'running' ? 'var(--accent)' : 'var(--border-c)'}`,
          minHeight: '220px',
        }}
        role="button"
        tabIndex={0}
        aria-label="Click speed target zone"
      >
        <span className="text-4xl mb-3">⏱️</span>
        <h2 className="text-2xl font-black" style={{ color: 'var(--text)' }}>
          {status === 'idle' && 'Click Here to Start CPS Test'}
          {status === 'running' && 'CLICK AS FAST AS YOU CAN!'}
          {status === 'finished' && 'Time is Up!'}
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          {status === 'idle' && `Click as fast as possible for ${duration} seconds.`}
          {status === 'running' && `Time Remaining: ${timeLeft}s`}
          {status === 'finished' && 'Click Reset to try again.'}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Total Clicks</span>
          <span className="text-2xl font-black" style={{ color: 'var(--text)' }}>{clickCount}</span>
        </div>

        <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Clicks Per Second (CPS)</span>
          <span className="text-2xl font-black" style={{ color: 'var(--accent)' }}>{cps}</span>
        </div>

        <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Personal Best ({duration}s)</span>
          <span className="text-2xl font-black" style={{ color: 'var(--green)' }}>{highScore}</span>
        </div>

        <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Click Rank</span>
          <span className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>
            {status === 'finished' ? getRank(cps) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
