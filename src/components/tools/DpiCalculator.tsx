'use client';

import { useState, useRef } from 'react';

export default function DpiCalculator() {
  // Physical Measurement State
  const [unit, setUnit] = useState<'inch' | 'cm'>('inch');
  const [targetDistance, setTargetDistance] = useState<number>(1); // 1 inch default
  const [pixelsMoved, setPixelsMoved] = useState<number>(0);
  const [calculatedDpi, setCalculatedDpi] = useState<number | null>(null);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  const startXRef = useRef<number | null>(null);

  // eDPI Calculator State
  const [baseDpi, setBaseDpi] = useState<number>(800);
  const [inGameSens, setInGameSens] = useState<number>(1.5);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsMeasuring(true);
    startXRef.current = e.clientX;
    setPixelsMoved(0);
    setCalculatedDpi(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMeasuring || startXRef.current === null) return;
    const currentX = e.clientX;
    const diff = Math.abs(currentX - startXRef.current);
    setPixelsMoved(diff);

    const distInInches = unit === 'inch' ? targetDistance : targetDistance / 2.54;
    if (distInInches > 0 && diff > 0) {
      setCalculatedDpi(Math.round(diff / distInInches));
    }
  };

  const handlePointerUp = () => {
    setIsMeasuring(false);
    startXRef.current = null;
  };

  const edpi = Math.round(baseDpi * inGameSens * 100) / 100;

  return (
    <div className="flex flex-col gap-8">
      {/* Tool 1: Interactive Screen Drag DPI Estimator */}
      <div className="p-6 rounded-2xl flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              Target Distance DPI Measuring Tool
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Measure physical mouse movement distance against screen pixel displacement.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <label className="font-semibold" style={{ color: 'var(--text)' }}>Target Distance:</label>
            <input
              type="number"
              min="0.1"
              max="20"
              step="0.5"
              value={targetDistance}
              onChange={e => setTargetDistance(Math.max(0.1, Number(e.target.value)))}
              className="w-16 px-2 py-1 rounded-lg border font-bold text-center"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            />
            <select
              value={unit}
              onChange={e => setUnit(e.target.value as 'inch' | 'cm')}
              className="px-2 py-1 rounded-lg border font-medium cursor-pointer"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              <option value="inch">Inches</option>
              <option value="cm">Centimeters</option>
            </select>
          </div>
        </div>

        {/* Drag Strip Canvas */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative flex flex-col items-center justify-center p-10 rounded-2xl select-none cursor-crosshair transition-all"
          style={{
            background: isMeasuring ? 'color-mix(in srgb, var(--accent) 12%, var(--surface-2))' : 'var(--surface-2)',
            border: `2px dashed ${isMeasuring ? 'var(--accent)' : 'var(--border-c)'}`,
            minHeight: '180px',
          }}
        >
          <span className="text-3xl mb-2">📐</span>
          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
            {isMeasuring ? 'Dragging... Move mouse exactly ' + targetDistance + ' ' + unit : 'Click and Drag Horizontally for ' + targetDistance + ' ' + unit}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Move your physical mouse exactly {targetDistance} {unit} on your mousepad while holding left click.
          </p>

          {pixelsMoved > 0 && (
            <div className="mt-3 text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>
              Horizontal Pixels Tracked: {pixelsMoved} px
            </div>
          )}
        </div>

        {/* Calculated Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)' }}>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Pixels Moved</span>
            <span className="text-2xl font-black" style={{ color: 'var(--text)' }}>{pixelsMoved} px</span>
          </div>

          <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)' }}>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Estimated Hardware DPI</span>
            <span className="text-2xl font-black" style={{ color: 'var(--green)' }}>
              {calculatedDpi !== null ? `${calculatedDpi} DPI` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Tool 2: eDPI (Effective DPI) Calculator */}
      <div className="p-6 rounded-2xl flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            eDPI (Effective DPI) Calculator
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Calculate overall sensitivity across games (eDPI = Hardware DPI × In-Game Sensitivity).
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Hardware DPI (e.g. 800)</label>
            <input
              type="number"
              value={baseDpi}
              onChange={e => setBaseDpi(Number(e.target.value))}
              className="p-2.5 rounded-xl border text-sm font-bold"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>In-Game Sensitivity</label>
            <input
              type="number"
              step="0.1"
              value={inGameSens}
              onChange={e => setInGameSens(Number(e.target.value))}
              className="p-2.5 rounded-xl border text-sm font-bold"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            />
          </div>

          <div className="p-4 rounded-xl flex flex-col justify-between" style={{ background: 'color-mix(in srgb, var(--accent) 12%, var(--surface-2))', border: '1px solid var(--accent)' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>Calculated eDPI</span>
            <span className="text-2xl font-black" style={{ color: 'var(--text)' }}>{edpi}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
