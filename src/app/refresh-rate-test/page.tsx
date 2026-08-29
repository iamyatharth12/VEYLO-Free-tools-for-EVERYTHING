'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const KNOWN_REFRESH_RATES = [60, 75, 90, 100, 120, 144, 165, 240, 280, 360, 480, 500];

export default function RefreshRateTestPage() {
  const tool = useMemo(() => getToolBySlug('refresh-rate-test')!, []);

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [currentFps, setCurrentFps] = useState<number>(60);
  const [averageFps, setAverageFps] = useState<number>(60);
  const [minFps, setMinFps] = useState<number>(60);
  const [maxFps, setMaxFps] = useState<number>(60);
  const [frameTimeMs, setFrameTimeMs] = useState<number>(16.67);
  const [frameStability, setFrameStability] = useState<number>(99);
  const [totalFrames, setTotalFrames] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rAfRef = useRef<number | null>(null);

  const framesHistoryRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const startTimeRef = useRef<number>(performance.now());

  // Main Benchmarking Animation Loop
  const tick = useCallback((now: number) => {
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    if (delta > 0 && delta < 200) {
      const instantFps = 1000 / delta;
      framesHistoryRef.current.push(instantFps);
      if (framesHistoryRef.current.length > 120) {
        framesHistoryRef.current.shift();
      }

      // Compute statistics over recent history
      const history = framesHistoryRef.current;
      const sum = history.reduce((a, b) => a + b, 0);
      const avg = sum / history.length;
      const min = Math.min(...history);
      const max = Math.max(...history);
      const meanFrameTime = +(1000 / avg).toFixed(2);

      // Stability (% of frames within ±5% of average)
      const stableCount = history.filter(f => Math.abs(f - avg) < avg * 0.08).length;
      const stability = Math.round((stableCount / history.length) * 100);

      setCurrentFps(Math.round(instantFps));
      setAverageFps(Math.round(avg));
      setMinFps(Math.round(min));
      setMaxFps(Math.round(max));
      setFrameTimeMs(meanFrameTime);
      setFrameStability(stability);
      setTotalFrames(prev => prev + 1);

      // Render Oscilloscope Graph on Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          ctx.clearRect(0, 0, width, height);

          // Grid Lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, height / 2);
          ctx.lineTo(width, height / 2);
          ctx.moveTo(0, height / 4);
          ctx.lineTo(width, height / 4);
          ctx.moveTo(0, (height * 3) / 4);
          ctx.lineTo(width, (height * 3) / 4);
          ctx.stroke();

          // Graph Path
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 2;
          ctx.beginPath();

          const step = width / (history.length - 1 || 1);
          const maxScale = Math.max(160, Math.ceil(max * 1.15));

          history.forEach((fpsVal, idx) => {
            const x = idx * step;
            const y = height - (fpsVal / maxScale) * height;
            if (idx === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.stroke();
        }
      }
    }

    if (isRunning) {
      rAfRef.current = requestAnimationFrame(tick);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      rAfRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rAfRef.current) cancelAnimationFrame(rAfRef.current);
    };
  }, [isRunning, tick]);

  // Detected Display Rating
  const detectedStandardHz = useMemo(() => {
    // Find closest known refresh rate
    let closest = 60;
    let minDiff = Infinity;
    for (const rate of KNOWN_REFRESH_RATES) {
      const diff = Math.abs(rate - averageFps);
      if (diff < minDiff) {
        minDiff = diff;
        closest = rate;
      }
    }
    return closest;
  }, [averageFps]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    framesHistoryRef.current = [];
    startTimeRef.current = performance.now();
    lastTimeRef.current = performance.now();
    setCurrentFps(60);
    setAverageFps(60);
    setMinFps(60);
    setMaxFps(60);
    setFrameTimeMs(16.67);
    setFrameStability(100);
    setTotalFrames(0);
  };

  const faqs: FAQItem[] = [
    {
      question: 'How does this test calculate screen refresh rate?',
      answer:
        'The test uses the browser’s requestAnimationFrame (rAF) pipeline combined with monotonic high-resolution performance.now() timestamps. In modern browsers, rAF callbacks are synchronized to your monitor’s vertical sync (V-Sync) refresh frequency.',
    },
    {
      question: 'Why does my 144Hz monitor show 60 FPS in the browser?',
      answer:
        'If a high-refresh monitor shows 60 FPS, check your OS Display Settings (Windows: Settings ➔ System ➔ Display ➔ Advanced Display ➔ Choose a refresh rate) and ensure Hardware Acceleration is enabled in your browser settings.',
    },
    {
      question: 'What is Frame Time and Frame Stability?',
      answer:
        'Frame Time is the time elapsed between rendered frames (e.g. 16.67ms for 60Hz, 6.94ms for 144Hz). Frame Stability indicates how consistently frames are delivered without micro-stutter or dropped frame spikes.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            High-Precision Display Refresh Rate (Hz) &amp; Frame Time Benchmark
          </h2>
          <p>
            Measure display refresh rate frequency (60Hz, 120Hz, 144Hz, 240Hz, 360Hz) and detect micro-stutter anomalies in browser frame rendering pipelines.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ High-Resolution rAF Clock</h3>
              <p className="text-[11px]">Monotonic performance.now() benchmarking synchronized to display V-Sync.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📊 Oscilloscope Graph</h3>
              <p className="text-[11px]">Real-time visual waveform tracking frame variance and render spikes.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎯 Frame Time Stability</h3>
              <p className="text-[11px]">Detect micro-stutter and frame drop jitter percentages.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Main Measured Hz Hero Card */}
        <div
          className="p-8 sm:p-12 rounded-2xl flex flex-col items-center justify-center gap-5 text-center shadow-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ background: isRunning ? 'var(--green, #10b981)' : '#ef4444' }}
            />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              {isRunning ? 'Live Display Benchmark' : 'Benchmark Paused'}
            </span>
          </div>

          {/* Huge Hz Number */}
          <div className="flex flex-col items-center">
            <div className="text-6xl sm:text-8xl font-black font-mono tracking-tight" style={{ color: 'var(--accent)' }}>
              {currentFps}
              <span className="text-3xl sm:text-5xl font-bold ml-2" style={{ color: 'var(--muted)' }}>FPS</span>
            </div>
            <div
              className="mt-3 px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide"
              style={{ background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))', color: 'var(--accent)' }}
            >
              Estimated Hardware Match: ~{detectedStandardHz} Hz Monitor
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleToggle}
              className="px-6 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow"
              style={{
                background: isRunning ? 'var(--surface-2)' : 'var(--accent)',
                color: isRunning ? 'var(--text)' : '#fff',
                border: '1px solid var(--border-c)',
              }}
            >
              {isRunning ? '⏸ Pause Test' : '▶ Resume Test'}
            </button>
            <ResetButton onClick={handleReset} />
          </div>
        </div>

        {/* Real-time Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Average FPS</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>{averageFps}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Frame Time</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--accent)' }}>{frameTimeMs} ms</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Min FPS</span>
            <span className="text-2xl font-black font-mono" style={{ color: '#ef4444' }}>{minFps}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Max FPS</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--green, #10b981)' }}>{maxFps}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Stability</span>
            <span className="text-2xl font-black font-mono" style={{ color: frameStability > 90 ? 'var(--green, #10b981)' : '#f59e0b' }}>
              {frameStability}%
            </span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Total Samples</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>{totalFrames.toLocaleString()}</span>
          </div>
        </div>

        {/* Real-time Oscilloscope Canvas Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Real-Time Frame Timing Waveform
            </h3>
            <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
              120 Frame Rolling Buffer
            </span>
          </div>

          <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner p-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <canvas
              ref={canvasRef}
              width={700}
              height={150}
              className="w-full h-full block rounded-lg"
            />
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
