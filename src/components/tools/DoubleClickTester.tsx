'use client';

import { useState, useRef, useCallback } from 'react';

interface ClickEventRecord {
  id: number;
  timestamp: number;
  delta: number;
  isAccidental: boolean;
}

export default function DoubleClickTester() {
  const [threshold, setThreshold] = useState<number>(80); // milliseconds threshold for chatter
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [doubleClicks, setDoubleClicks] = useState<number>(0);
  const [chatterCount, setChatterCount] = useState<number>(0);
  const [records, setRecords] = useState<ClickEventRecord[]>([]);

  const lastClickTimeRef = useRef<number | null>(null);
  const recordIdRef = useRef<number>(0);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const now = performance.now();
    setTotalClicks(prev => prev + 1);

    if (lastClickTimeRef.current !== null) {
      const delta = Math.round(now - lastClickTimeRef.current);
      const isAccidental = delta < threshold;

      if (delta < 500) {
        setDoubleClicks(prev => prev + 1);
      }

      if (isAccidental) {
        setChatterCount(prev => prev + 1);
      }

      recordIdRef.current += 1;
      const newRecord: ClickEventRecord = {
        id: recordIdRef.current,
        timestamp: now,
        delta,
        isAccidental,
      };

      setRecords(prev => [newRecord, ...prev].slice(0, 20));
    }

    lastClickTimeRef.current = now;
  }, [threshold]);

  const reset = () => {
    setTotalClicks(0);
    setDoubleClicks(0);
    setChatterCount(0);
    setRecords([]);
    lastClickTimeRef.current = null;
    recordIdRef.current = 0;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Threshold Selector & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            Switch Chatter Threshold:
          </label>
          <select
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
          >
            <option value={50}>50 ms (Strict)</option>
            <option value={80}>80 ms (Recommended)</option>
            <option value={100}>100 ms (Standard)</option>
            <option value={150}>150 ms (Relaxed)</option>
          </select>
        </div>

        <button
          onClick={reset}
          className="px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}
        >
          Reset Stats
        </button>
      </div>

      {/* Interactive Testing Box */}
      <div
        onClick={handleClick}
        onContextMenu={e => e.preventDefault()}
        className="group relative flex flex-col items-center justify-center p-12 rounded-3xl text-center cursor-pointer select-none transition-all duration-200 active:scale-[0.99]"
        style={{
          background: 'color-mix(in srgb, var(--accent) 5%, var(--surface))',
          border: '2px dashed var(--accent)',
          minHeight: '220px',
        }}
        role="button"
        tabIndex={0}
        aria-label="Click here repeatedly to test double click chatter"
      >
        <span className="text-4xl mb-3 transition-transform group-hover:scale-110">⚡</span>
        <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>
          Click Here Repeatedly To Test
        </h2>
        <p className="text-xs mt-1 max-w-md" style={{ color: 'var(--muted)' }}>
          Click rapidly or normally. If your mouse microswitch registers a double-click faster than <strong style={{ color: 'var(--accent)' }}>{threshold}ms</strong>, it indicates switch chatter.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Total Clicks</span>
          <span className="text-2xl font-black" style={{ color: 'var(--text)' }}>{totalClicks}</span>
        </div>

        <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Double Clicks (&lt;500ms)</span>
          <span className="text-2xl font-black" style={{ color: 'var(--accent)' }}>{doubleClicks}</span>
        </div>

        <div className="p-4 rounded-xl flex flex-col gap-1 col-span-2 sm:col-span-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Accidental Double Clicks (&lt;{threshold}ms)</span>
          <span className="text-2xl font-black" style={{ color: chatterCount > 0 ? 'var(--red)' : 'var(--green)' }}>
            {chatterCount}
          </span>
        </div>
      </div>

      {/* Interval History */}
      <div className="p-5 rounded-2xl flex flex-col gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Recent Click Time Intervals</h3>
        {records.length === 0 ? (
          <p className="text-xs py-4 text-center" style={{ color: 'var(--muted)' }}>
            No clicks recorded yet. Click inside the testing box above to begin.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {records.map(rec => (
              <div
                key={rec.id}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs"
                style={{
                  background: rec.isAccidental
                    ? 'color-mix(in srgb, var(--red) 12%, var(--surface-2))'
                    : 'var(--surface-2)',
                  border: rec.isAccidental ? '1px solid var(--red)' : '1px solid transparent',
                }}
              >
                <span className="font-semibold" style={{ color: rec.isAccidental ? 'var(--red)' : 'var(--text)' }}>
                  Interval: {rec.delta} ms
                </span>

                <span
                  className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md"
                  style={{
                    background: rec.isAccidental ? 'var(--red)' : 'var(--green)',
                    color: '#fff',
                  }}
                >
                  {rec.isAccidental ? 'CHATTER DETECTED' : 'NORMAL'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
