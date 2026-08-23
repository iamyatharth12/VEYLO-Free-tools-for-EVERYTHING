'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function PollingRateTester() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentHz, setCurrentHz] = useState<number>(0);
  const [avgHz, setAvgHz] = useState<number>(0);
  const [peakHz, setPeakHz] = useState<number>(0);
  const [reportIntervalMs, setReportIntervalMs] = useState<number>(0);
  const [samplesCount, setSamplesCount] = useState<number>(0);

  const lastEventTimeRef = useRef<number | null>(null);
  const intervalsRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);

  const handlePointerMove = useCallback(() => {
    if (!isActive) return;
    const now = performance.now();

    if (lastEventTimeRef.current !== null) {
      const dt = now - lastEventTimeRef.current;
      if (dt > 0.1 && dt < 200) { // filter out pauses
        intervalsRef.current.push(dt);
        if (intervalsRef.current.length > 300) {
          intervalsRef.current.shift();
        }
      }
    }
    lastEventTimeRef.current = now;
  }, [isActive]);

  // Update Hz metrics periodically via rAF loop to avoid excessive state updates
  useEffect(() => {
    if (!isActive) return;

    let mounted = true;

    const updateMetrics = () => {
      if (!mounted) return;

      const intervals = intervalsRef.current;
      if (intervals.length > 5) {
        const recent = intervals.slice(-30);
        const avgDt = recent.reduce((a, b) => a + b, 0) / recent.length;
        const totalAvgDt = intervals.reduce((a, b) => a + b, 0) / intervals.length;

        const calculatedHz = Math.round(1000 / avgDt);
        const overallAvgHz = Math.round(1000 / totalAvgDt);

        setCurrentHz(calculatedHz);
        setAvgHz(overallAvgHz);
        setReportIntervalMs(Number(avgDt.toFixed(2)));
        setSamplesCount(intervals.length);

        setPeakHz(prev => Math.max(prev, calculatedHz));
      }

      rafRef.current = requestAnimationFrame(updateMetrics);
    };

    rafRef.current = requestAnimationFrame(updateMetrics);

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isActive, handlePointerMove]);

  const reset = () => {
    setCurrentHz(0);
    setAvgHz(0);
    setPeakHz(0);
    setReportIntervalMs(0);
    setSamplesCount(0);
    intervalsRef.current = [];
    lastEventTimeRef.current = null;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Control Banner */}
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
            {isActive ? 'Measuring Polling Rate (Move Mouse)' : 'Start Polling Rate Test'}
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
          Samples: <strong style={{ color: 'var(--text)' }}>{samplesCount}</strong>
        </span>
      </div>

      {/* Movement Capture Area */}
      <div
        className="group relative flex flex-col items-center justify-center p-12 rounded-3xl text-center select-none transition-all duration-200"
        style={{
          background: isActive
            ? 'color-mix(in srgb, var(--accent) 8%, var(--surface))'
            : 'var(--surface)',
          border: `2px dashed ${isActive ? 'var(--accent)' : 'var(--border-c)'}`,
          minHeight: '240px',
        }}
      >
        <span className="text-4xl mb-3">📡</span>
        <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>
          {isActive ? 'Move Your Mouse Continuously In Circles' : 'Click "Start Polling Rate Test" And Move Mouse'}
        </h2>
        <p className="text-xs mt-1 max-w-md" style={{ color: 'var(--muted)' }}>
          For accurate polling rate (Hz) measurement, move your cursor continuously across this window.
        </p>

        {isActive && (
          <div className="mt-4 px-4 py-2 rounded-full font-mono text-xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--accent)' }}>
            Real-time Sample Interval: ~{reportIntervalMs} ms
          </div>
        )}
      </div>

      {/* Polling Rate Gauge Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Current Polling Rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black" style={{ color: 'var(--accent)' }}>{currentHz}</span>
            <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>Hz</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Average Polling Rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black" style={{ color: 'var(--text)' }}>{avgHz}</span>
            <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>Hz</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl flex flex-col gap-1 col-span-2 sm:col-span-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Peak Rate Recorded</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black" style={{ color: 'var(--green)' }}>{peakHz}</span>
            <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>Hz</span>
          </div>
        </div>
      </div>

      {/* Benchmark Reference Legend */}
      <div className="p-5 rounded-2xl flex flex-col gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Standard Gaming Mouse Hz Tiers</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl flex flex-col" style={{ background: 'var(--surface-2)' }}>
            <strong style={{ color: 'var(--text)' }}>125 Hz</strong>
            <span style={{ color: 'var(--muted)' }}>8 ms interval (Standard office)</span>
          </div>
          <div className="p-3 rounded-xl flex flex-col" style={{ background: 'var(--surface-2)' }}>
            <strong style={{ color: 'var(--text)' }}>500 Hz</strong>
            <span style={{ color: 'var(--muted)' }}>2 ms interval (Casual gaming)</span>
          </div>
          <div className="p-3 rounded-xl flex flex-col" style={{ background: 'var(--surface-2)' }}>
            <strong style={{ color: 'var(--accent)' }}>1000 Hz</strong>
            <span style={{ color: 'var(--muted)' }}>1 ms interval (Standard esports)</span>
          </div>
          <div className="p-3 rounded-xl flex flex-col" style={{ background: 'var(--surface-2)' }}>
            <strong style={{ color: 'var(--green)' }}>4000-8000 Hz</strong>
            <span style={{ color: 'var(--muted)' }}>0.25-0.125 ms (High-end gaming)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
