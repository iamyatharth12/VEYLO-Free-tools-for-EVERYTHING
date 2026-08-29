'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  FAQItem,
} from '@/components/tool-ui';

interface LapRecord {
  lapNumber: number;
  lapTimeMs: number;
  splitTimeMs: number;
  lapFormatted: string;
  splitFormatted: string;
}

function formatTime(ms: number): { formatted: string; hours: string; mins: string; secs: string; millis: string } {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const millis = Math.floor(ms % 1000);

  const hStr = hours.toString().padStart(2, '0');
  const mStr = mins.toString().padStart(2, '0');
  const sStr = secs.toString().padStart(2, '0');
  const msStr = millis.toString().padStart(3, '0');

  const formatted = hours > 0 ? `${hStr}:${mStr}:${sStr}.${msStr}` : `${mStr}:${sStr}.${msStr}`;
  return { formatted, hours: hStr, mins: mStr, secs: sStr, millis: msStr };
}

export default function StopwatchPage() {
  const tool = useMemo(() => getToolBySlug('stopwatch')!, []);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);
  const lastLapSplitRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Play short synthesized beep using Web Audio API
  const playBeep = useCallback((freq = 880, duration = 0.08) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context restricted or blocked
    }
  }, [soundEnabled]);

  // Main Monotonic Timer Loop
  const updateTimer = useCallback(() => {
    const now = performance.now();
    const currentElapsed = accumulatedMsRef.current + (now - startTimeRef.current);
    setElapsedMs(currentElapsed);

    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, updateTimer]);

  const handleStart = () => {
    playBeep(880, 0.08);
    startTimeRef.current = performance.now();
    setIsRunning(true);
  };

  const handlePause = () => {
    playBeep(440, 0.08);
    accumulatedMsRef.current += performance.now() - startTimeRef.current;
    setIsRunning(false);
  };

  const handleReset = () => {
    playBeep(330, 0.1);
    setIsRunning(false);
    accumulatedMsRef.current = 0;
    lastLapSplitRef.current = 0;
    setElapsedMs(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning && elapsedMs === 0) return;
    playBeep(1100, 0.06);

    const currentSplit = elapsedMs;
    const lapDuration = currentSplit - lastLapSplitRef.current;
    lastLapSplitRef.current = currentSplit;

    const newRecord: LapRecord = {
      lapNumber: laps.length + 1,
      lapTimeMs: lapDuration,
      splitTimeMs: currentSplit,
      lapFormatted: formatTime(lapDuration).formatted,
      splitFormatted: formatTime(currentSplit).formatted,
    };

    setLaps((prev) => [newRecord, ...prev]);
  };

  // Keyboard Shortcuts (Space: Start/Pause, L: Lap, R: Reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleLap();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const formattedTime = useMemo(() => formatTime(elapsedMs), [elapsedMs]);

  // Identify fastest and slowest laps
  const { fastestLapIdx, slowestLapIdx } = useMemo(() => {
    if (laps.length < 2) return { fastestLapIdx: -1, slowestLapIdx: -1 };
    let minTime = Infinity;
    let maxTime = -Infinity;
    let fIdx = -1;
    let sIdx = -1;

    laps.forEach((l, idx) => {
      if (l.lapTimeMs < minTime) {
        minTime = l.lapTimeMs;
        fIdx = idx;
      }
      if (l.lapTimeMs > maxTime) {
        maxTime = l.lapTimeMs;
        sIdx = idx;
      }
    });

    return { fastestLapIdx: fIdx, slowestLapIdx: sIdx };
  }, [laps]);

  const exportLapsCsv = () => {
    if (laps.length === 0) return;
    const header = 'Lap Number,Lap Time,Split Time,Lap Time (ms),Split Time (ms)\n';
    const rows = laps
      .map((l) => `${l.lapNumber},${l.lapFormatted},${l.splitFormatted},${l.lapTimeMs},${l.splitTimeMs}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veylo-stopwatch-laps-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allLapsText = laps.map(l => `Lap ${l.lapNumber}: ${l.lapFormatted} (Split: ${l.splitFormatted})`).join('\n');

  const faqs: FAQItem[] = [
    {
      question: 'Why doesn’t this stopwatch drift in background tabs?',
      answer:
        'Traditional web stopwatches use setInterval() or setTimeout(), which browsers aggressively throttle down to 1Hz when the tab is inactive. VEYLO uses performance.now() elapsed monotonic delta calculation, guaranteeing exact millisecond precision when you return.',
    },
    {
      question: 'What keyboard shortcuts are available?',
      answer:
        '• Spacebar: Start / Pause\n• L: Record split lap\n• R: Reset stopwatch',
    },
    {
      question: 'What is the difference between Lap Time and Split Time?',
      answer:
        'Lap Time measures the specific duration of the single most recent interval. Split Time represents total continuous elapsed time from the start of the stopwatch.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            High-Precision Monotonic Stopwatch &amp; Split Lap Timer
          </h2>
          <p>
            Time athletic workouts, speedruns, sprint intervals, and research experiments with millisecond precision and zero background throttling drift.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⏱️ Monotonic Monitored Clock</h3>
              <p className="text-[11px]">Powered by performance.now() for millisecond integrity without setInterval drift.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🏃 Split Lap Analytics</h3>
              <p className="text-[11px]">Tracks individual interval deltas with fastest/slowest lap visual tagging.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⌨️ Hotkey Shortcuts &amp; Sound</h3>
              <p className="text-[11px]">Control with Space, L, and R hotkeys with optional Web Audio beeps.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Stopwatch Main Hero Display */}
        <div
          className="p-8 sm:p-12 rounded-2xl flex flex-col items-center justify-center gap-6 text-center shadow-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Top Options Bar */}
          <div className="w-full flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none" style={{ color: 'var(--muted)' }}>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded text-[var(--accent)]"
              />
              <span>Audio Cue Beeps</span>
            </label>
            <span className="text-[11px] hidden sm:inline" style={{ color: 'var(--muted)' }}>
              [Space] Start/Stop · [L] Lap · [R] Reset
            </span>
          </div>

          {/* Time Display */}
          <div className="py-6 flex items-baseline justify-center font-mono font-black tracking-tight select-all">
            <span className="text-5xl sm:text-8xl" style={{ color: 'var(--text)' }}>
              {formattedTime.hours !== '00' && `${formattedTime.hours}:`}
              {formattedTime.mins}:{formattedTime.secs}
            </span>
            <span className="text-2xl sm:text-4xl ml-1 font-bold" style={{ color: 'var(--accent)' }}>
              .{formattedTime.millis}
            </span>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {!isRunning ? (
              <button
                type="button"
                onClick={handleStart}
                className="px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 active:scale-95 shadow-md flex items-center gap-2"
                style={{ background: 'var(--green, #10b981)', color: '#ffffff' }}
              >
                <span>▶</span>
                <span>{elapsedMs > 0 ? 'Resume' : 'Start'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 active:scale-95 shadow-md flex items-center gap-2"
                style={{ background: '#ef4444', color: '#ffffff' }}
              >
                <span>⏸</span>
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLap}
              disabled={!isRunning && elapsedMs === 0}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 active:scale-95 flex items-center gap-2 disabled:opacity-40"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              <span>⏱️</span>
              <span>Lap (L)</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={elapsedMs === 0}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 active:scale-95 flex items-center gap-2 disabled:opacity-40"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}
            >
              <span>↺</span>
              <span>Reset (R)</span>
            </button>
          </div>
        </div>

        {/* Laps History Table */}
        {laps.length > 0 && (
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Recorded Laps ({laps.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportLapsCsv}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:border-[var(--accent)]"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  Export CSV
                </button>
                <CopyButton textToCopy={allLapsText} label="Copy Laps" size="sm" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-c)', color: 'var(--muted)' }}>
                    <th className="pb-2.5 font-bold">Lap #</th>
                    <th className="pb-2.5 font-bold">Lap Time</th>
                    <th className="pb-2.5 font-bold">Overall Split Time</th>
                    <th className="pb-2.5 font-bold text-right">Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-c)]">
                  {laps.map((l, idx) => {
                    const isFastest = idx === fastestLapIdx;
                    const isSlowest = idx === slowestLapIdx;

                    return (
                      <tr key={l.lapNumber} className="hover:bg-[var(--surface-2)]">
                        <td className="py-2.5 font-mono font-bold" style={{ color: 'var(--accent)' }}>
                          Lap {l.lapNumber}
                        </td>
                        <td className="py-2.5 font-mono font-bold" style={{ color: isFastest ? 'var(--green, #10b981)' : isSlowest ? '#ef4444' : 'var(--text)' }}>
                          {l.lapFormatted}
                        </td>
                        <td className="py-2.5 font-mono" style={{ color: 'var(--muted)' }}>
                          {l.splitFormatted}
                        </td>
                        <td className="py-2.5 text-right">
                          {isFastest && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green, #10b981)' }}>
                              ⚡ Fastest
                            </span>
                          )}
                          {isSlowest && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                              🐢 Slowest
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
