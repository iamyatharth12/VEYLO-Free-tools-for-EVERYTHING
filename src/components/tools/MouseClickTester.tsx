'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ButtonStatus {
  id: string;
  name: string;
  code: number;
  count: number;
  isPressed: boolean;
  detected: boolean;
  lastPressTime: number | null;
}

const INITIAL_BUTTONS: ButtonStatus[] = [
  { id: 'left', name: 'Left Button', code: 0, count: 0, isPressed: false, detected: false, lastPressTime: null },
  { id: 'middle', name: 'Middle Wheel Button', code: 1, count: 0, isPressed: false, detected: false, lastPressTime: null },
  { id: 'right', name: 'Right Button', code: 2, count: 0, isPressed: false, detected: false, lastPressTime: null },
  { id: 'back', name: 'Side Button (Back)', code: 3, count: 0, isPressed: false, detected: false, lastPressTime: null },
  { id: 'forward', name: 'Side Button (Forward)', code: 4, count: 0, isPressed: false, detected: false, lastPressTime: null },
];

export default function MouseClickTester() {
  const [isActive, setIsActive] = useState(false);
  const [buttons, setButtons] = useState<ButtonStatus[]>(INITIAL_BUTTONS);
  const [clickLog, setClickLog] = useState<{ id: number; text: string; time: string }[]>([]);
  const logIdRef = useRef(0);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    const buttonIndex = e.button;

    setButtons(prev =>
      prev.map(b => {
        if (b.code === buttonIndex) {
          return {
            ...b,
            count: b.count + 1,
            isPressed: true,
            detected: true,
            lastPressTime: Date.now(),
          };
        }
        return b;
      })
    );

    const btnName = INITIAL_BUTTONS.find(b => b.code === buttonIndex)?.name || `Button ${buttonIndex}`;
    const timeStr = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });

    logIdRef.current += 1;
    const newLog = {
      id: logIdRef.current,
      text: `${btnName} DOWN`,
      time: timeStr,
    };

    setClickLog(prev => [newLog, ...prev].slice(0, 30));
  }, [isActive]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    const buttonIndex = e.button;

    setButtons(prev =>
      prev.map(b => (b.code === buttonIndex ? { ...b, isPressed: false } : b))
    );
  }, [isActive]);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (isActive) {
      e.preventDefault();
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isActive, handleMouseDown, handleMouseUp, handleContextMenu]);

  const reset = () => {
    setButtons(INITIAL_BUTTONS);
    setClickLog([]);
    logIdRef.current = 0;
  };

  const totalClicks = buttons.reduce((acc, b) => acc + b.count, 0);

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
            aria-label={isActive ? 'Stop button testing' : 'Start button testing'}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'animate-ping' : ''}`} style={{ background: isActive ? '#4ade80' : 'var(--muted)' }} />
            {isActive ? 'Testing Active (Click to Pause)' : 'Start Click Testing'}
          </button>

          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}
          >
            Reset
          </button>
        </div>

        <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
          Total Registered Clicks: <span className="text-sm font-bold ml-1" style={{ color: 'var(--text)' }}>{totalClicks}</span>
        </div>
      </div>

      {/* Button Diagnostic Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buttons.map(btn => (
          <div
            key={btn.id}
            className="p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-150"
            style={{
              background: btn.isPressed
                ? 'color-mix(in srgb, var(--accent) 15%, var(--surface))'
                : 'var(--surface)',
              border: `2px solid ${btn.isPressed ? 'var(--accent)' : btn.detected ? 'var(--green)' : 'var(--border-c)'}`,
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{btn.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Code {btn.code}</p>
              </div>

              <span
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: btn.detected ? 'color-mix(in srgb, var(--green) 15%, transparent)' : 'var(--surface-2)',
                  color: btn.detected ? 'var(--green)' : 'var(--muted)',
                }}
              >
                {btn.detected ? 'Detected' : 'Not Tested'}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-2" style={{ borderTop: '1px dashed var(--border-c)' }}>
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Click Count:</span>
              <span className="text-xl font-black" style={{ color: btn.count > 0 ? 'var(--accent)' : 'var(--muted)' }}>
                {btn.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Event Stream */}
      <div className="p-5 rounded-2xl flex flex-col gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Live Button Input Monitor</h3>
        {clickLog.length === 0 ? (
          <p className="text-xs py-4 text-center" style={{ color: 'var(--muted)' }}>
            {isActive ? 'Click any mouse button inside the browser window to see input signals' : 'Click "Start Click Testing" to enable input listener'}
          </p>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto font-mono text-xs pr-1">
            {clickLog.map(log => (
              <div key={log.id} className="flex justify-between py-1 px-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                <span style={{ color: 'var(--accent)' }}>{log.text}</span>
                <span style={{ color: 'var(--muted)' }}>{log.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
