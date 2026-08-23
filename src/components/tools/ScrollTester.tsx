'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollMetrics {
  upNotches: number;
  downNotches: number;
  leftNotches: number;
  rightNotches: number;
  totalPixelDelta: number;
  middleClickCount: number;
  lastDirection: 'Up' | 'Down' | 'Left' | 'Right' | null;
  lastDeltaY: number;
}

export default function ScrollTester() {
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    upNotches: 0,
    downNotches: 0,
    leftNotches: 0,
    rightNotches: 0,
    totalPixelDelta: 0,
    middleClickCount: 0,
    lastDirection: null,
    lastDeltaY: 0,
  });

  const [isActive, setIsActive] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isActive) return;
    e.preventDefault();

    const { deltaX, deltaY } = e;
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

    setMetrics(prev => {
      let dir: 'Up' | 'Down' | 'Left' | 'Right' | null = null;
      let up = prev.upNotches;
      let down = prev.downNotches;
      let left = prev.leftNotches;
      let right = prev.rightNotches;

      if (isHorizontal) {
        if (deltaX > 0) { right += 1; dir = 'Right'; }
        else if (deltaX < 0) { left += 1; dir = 'Left'; }
      } else {
        if (deltaY > 0) { down += 1; dir = 'Down'; }
        else if (deltaY < 0) { up += 1; dir = 'Up'; }
      }

      return {
        upNotches: up,
        downNotches: down,
        leftNotches: left,
        rightNotches: right,
        totalPixelDelta: prev.totalPixelDelta + Math.round(Math.abs(deltaY || deltaX)),
        middleClickCount: prev.middleClickCount,
        lastDirection: dir,
        lastDeltaY: Math.round(deltaY),
      };
    });
  }, [isActive]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    if (e.button === 1) { // Middle click
      e.preventDefault();
      setMetrics(prev => ({ ...prev, middleClickCount: prev.middleClickCount + 1 }));
    }
  }, [isActive]);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el || !isActive) return;

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('mousedown', handleMouseDown);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isActive, handleWheel, handleMouseDown]);

  const reset = () => {
    setMetrics({
      upNotches: 0,
      downNotches: 0,
      leftNotches: 0,
      rightNotches: 0,
      totalPixelDelta: 0,
      middleClickCount: 0,
      lastDirection: null,
      lastDeltaY: 0,
    });
  };

  const totalNotches = metrics.upNotches + metrics.downNotches + metrics.leftNotches + metrics.rightNotches;

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsActive(a => !a)}
            className="px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all active:scale-95 flex items-center gap-2"
            style={{
              background: isActive ? 'var(--accent)' : 'var(--surface-2)',
              color: isActive ? '#fff' : 'var(--text)',
              border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-2)'}`,
            }}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'animate-ping' : ''}`} style={{ background: isActive ? '#4ade80' : 'var(--muted)' }} />
            {isActive ? 'Scroll Capture Active' : 'Start Scroll Testing'}
          </button>

          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}
          >
            Reset
          </button>
        </div>

        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          Total Wheel Events: <strong style={{ color: 'var(--text)' }}>{totalNotches}</strong>
        </span>
      </div>

      {/* Interactive Canvas Area */}
      <div
        ref={scrollAreaRef}
        tabIndex={0}
        role="region"
        aria-label="Scroll capture zone"
        className="group relative flex flex-col items-center justify-center p-12 rounded-3xl text-center select-none transition-all duration-200 outline-none"
        style={{
          background: isActive
            ? 'color-mix(in srgb, var(--accent) 8%, var(--surface))'
            : 'var(--surface)',
          border: `2px solid ${isActive ? 'var(--accent)' : 'var(--border-c)'}`,
          minHeight: '240px',
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 transition-transform"
          style={{
            background: 'var(--surface-2)',
            border: '2px solid var(--border-c)',
            transform: metrics.lastDirection === 'Up' ? 'translateY(-8px)' : metrics.lastDirection === 'Down' ? 'translateY(8px)' : 'none',
          }}
        >
          {metrics.lastDirection === 'Up' ? '⬆️' : metrics.lastDirection === 'Down' ? '⬇️' : metrics.lastDirection === 'Left' ? '⬅️' : metrics.lastDirection === 'Right' ? '➡️' : '📜'}
        </div>

        <h2 className="text-lg font-extrabold" style={{ color: 'var(--text)' }}>
          {isActive ? 'Scroll Up, Down, or Tilt Wheel Here' : 'Click "Start Scroll Testing" Above to Capture Wheel Input'}
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Also click the wheel (Middle Button) inside this zone to test the scroll wheel click switch.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Scroll Up Notches</span>
          <span className="text-2xl font-black" style={{ color: 'var(--accent)' }}>{metrics.upNotches}</span>
        </div>

        <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Scroll Down Notches</span>
          <span className="text-2xl font-black" style={{ color: 'var(--accent)' }}>{metrics.downNotches}</span>
        </div>

        <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Middle Button Clicks</span>
          <span className="text-2xl font-black" style={{ color: 'var(--green)' }}>{metrics.middleClickCount}</span>
        </div>

        <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Horizontal / Tilt Notches</span>
          <span className="text-2xl font-black" style={{ color: 'var(--text)' }}>{metrics.leftNotches + metrics.rightNotches}</span>
        </div>
      </div>
    </div>
  );
}
