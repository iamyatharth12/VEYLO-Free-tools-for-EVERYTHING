'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { MovementState } from '@/hooks/useMouseTester';

interface MovementTestProps {
  movement: MovementState;
  resetSignal: number; // increment to trigger canvas clear
}

const TRAIL_ALPHA   = 0.015; // how fast the trail fades
const DOT_RADIUS    = 3;
const LINE_WIDTH    = 2;

export default function MovementTest({ movement, resetSignal }: MovementTestProps) {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const prevPosRef     = useRef<{ x: number; y: number } | null>(null);
  const rafRef         = useRef<number | null>(null);

  // Clear canvas when resetSignal changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    prevPosRef.current = null;
  }, [resetSignal]);

  // Resize canvas with DPR support
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr    = window.devicePixelRatio || 1;
    const rect   = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    initCanvas();
    const ro = new ResizeObserver(initCanvas);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [initCanvas]);

  // Paint trail on movement
  useEffect(() => {
    if (movement.eventCount === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect   = canvas.getBoundingClientRect();
    const logW   = rect.width;
    const logH   = rect.height;

    // Clamp position to canvas logical bounds
    const cx = Math.max(0, Math.min(movement.x, logW));
    const cy = Math.max(0, Math.min(movement.y - rect.top, logH));

    // Fade existing trail
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(12, 12, 15, ${TRAIL_ALPHA * 30})`;
    ctx.fillRect(0, 0, logW, logH);

    // Draw line from previous point
    if (prevPosRef.current) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99,102,241,0.6)';
      ctx.lineWidth   = LINE_WIDTH;
      ctx.lineCap     = 'round';
      ctx.moveTo(prevPosRef.current.x, prevPosRef.current.y);
      ctx.lineTo(cx, cy);
      ctx.stroke();
    }

    // Draw dot at current position
    ctx.beginPath();
    ctx.fillStyle = '#6366f1';
    ctx.arc(cx, cy, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    prevPosRef.current = { x: cx, y: cy };
    void rafRef;
  }, [movement.x, movement.y, movement.eventCount]);

  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border-c)', background: 'var(--surface)' }}
      aria-label="Movement test"
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-c)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Movement Test
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { label: 'X',        value: `${movement.x}px` },
            { label: 'Y',        value: `${movement.y}px` },
            { label: 'Total',    value: `${Math.round(movement.totalPx).toLocaleString()}px` },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-lg p-2 text-center"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
            >
              <p style={{ color: 'var(--muted)' }}>{s.label}</p>
              <p className="font-mono font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Canvas trail */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            height:     '160px',
            background: 'var(--bg)',
            border:     '1px solid var(--border-c)',
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-label="Mouse movement trail visualisation"
          />
          {movement.eventCount === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Move your mouse over this area
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
