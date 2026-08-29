'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  FAQItem,
} from '@/components/tool-ui';

interface GamepadState {
  id: string;
  index: number;
  mapping: string;
  buttons: { pressed: boolean; touched: boolean; value: number }[];
  axes: number[];
  timestamp: number;
}

const BUTTON_LABELS = [
  'A / Cross (B0)',
  'B / Circle (B1)',
  'X / Square (B2)',
  'Y / Triangle (B3)',
  'Left Bumper (LB/L1)',
  'Right Bumper (RB/R1)',
  'Left Trigger (LT/L2)',
  'Right Trigger (RT/R2)',
  'Back / View / Share (B8)',
  'Start / Options (B9)',
  'Left Stick Click (L3)',
  'Right Stick Click (R3)',
  'D-Pad Up (B12)',
  'D-Pad Down (B13)',
  'D-Pad Left (B14)',
  'D-Pad Right (B15)',
  'Xbox / PS / Home (B16)',
];

export default function GamepadTesterPage() {
  const tool = useMemo(() => getToolBySlug('gamepad-tester')!, []);

  const [connectedControllers, setConnectedControllers] = useState<GamepadState[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [vibrationSupported, setVibrationSupported] = useState<boolean>(false);
  const [vibrating, setVibrating] = useState<boolean>(false);

  const animationFrameRef = useRef<number | null>(null);

  // Poll Gamepad states
  const pollGamepads = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      const rawPads = navigator.getGamepads();
      const list: GamepadState[] = [];

      for (let i = 0; i < rawPads.length; i++) {
        const pad = rawPads[i];
        if (pad && pad.connected) {
          list.push({
            id: pad.id,
            index: pad.index,
            mapping: pad.mapping,
            buttons: pad.buttons.map(b => ({ pressed: b.pressed, touched: b.touched, value: b.value })),
            axes: Array.from(pad.axes),
            timestamp: pad.timestamp,
          });
        }
      }

      setConnectedControllers(list);
    }

    animationFrameRef.current = requestAnimationFrame(pollGamepads);
  }, []);

  useEffect(() => {
    const handleConnected = () => {
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(pollGamepads);
      }
    };

    window.addEventListener('gamepadconnected', handleConnected);
    window.addEventListener('gamepaddisconnected', handleConnected);

    // Initial poll trigger
    animationFrameRef.current = requestAnimationFrame(pollGamepads);

    return () => {
      window.removeEventListener('gamepadconnected', handleConnected);
      window.removeEventListener('gamepaddisconnected', handleConnected);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pollGamepads]);

  const activePad = connectedControllers[selectedIndex] || connectedControllers[0] || null;

  // Check vibration support
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      const pads = navigator.getGamepads();
      const pad = pads[activePad?.index ?? 0] as (Gamepad & { vibrationActuator?: unknown; hapticActuators?: unknown }) | null;
      if (pad && (pad.vibrationActuator || pad.hapticActuators)) {
        setVibrationSupported(true);
      } else {
        setVibrationSupported(false);
      }
    }
  }, [activePad]);

  const testVibration = async () => {
    if (typeof navigator !== 'undefined' && navigator.getGamepads && activePad) {
      const pads = navigator.getGamepads();
      const pad = pads[activePad.index] as (Gamepad & { vibrationActuator?: { playEffect: (type: string, options: unknown) => Promise<unknown> } }) | null;
      if (pad && pad.vibrationActuator && typeof pad.vibrationActuator.playEffect === 'function') {
        try {
          setVibrating(true);
          await pad.vibrationActuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: 600,
            weakMagnitude: 0.8,
            strongMagnitude: 0.8,
          });
        } catch {
          // Vibration not permitted or active
        } finally {
          setVibrating(false);
        }
      }
    }
  };

  // Left stick (Axes 0, 1) & Right stick (Axes 2, 3)
  const leftStick = useMemo(() => {
    if (!activePad || activePad.axes.length < 2) return { x: 0, y: 0 };
    return { x: +activePad.axes[0].toFixed(3), y: +activePad.axes[1].toFixed(3) };
  }, [activePad]);

  const rightStick = useMemo(() => {
    if (!activePad || activePad.axes.length < 4) return { x: 0, y: 0 };
    return { x: +activePad.axes[2].toFixed(3), y: +activePad.axes[3].toFixed(3) };
  }, [activePad]);

  const faqs: FAQItem[] = [
    {
      question: 'Why does my controller not appear immediately?',
      answer:
        'For security reasons, web browsers will only expose connected Gamepads to a webpage once the user presses any button on the controller while the browser window is active.',
    },
    {
      question: 'How do I test for analog stick drift?',
      answer:
        'Release both analog thumbsticks completely without touching them. The X and Y coordinates should ideally return to approximately (0.00, 0.00). If the dot consistently stays outside the central dead-zone circle (e.g. > ±0.10) without user contact, your controller has joystick potentiometer drift.',
    },
    {
      question: 'Which controllers are supported?',
      answer:
        'Any standard HID game controller compatible with your operating system: Xbox Wireless / Elite controllers, PlayStation DualSense (PS5) / DualShock 4, Nintendo Switch Pro Controller, Logitech, 8BitDo, and generic USB fight sticks.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            HTML5 Gamepad API Controller Diagnostic Suite
          </h2>
          <p>
            Test physical button switch signal responsiveness, analog trigger pressure sensors, potentiometer stick drift, and dual-rumble haptic vibration motors directly in your browser.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🕹️ Joystick Drift Diagnostics</h3>
              <p className="text-[11px]">Real-time 2D coordinate position tracking with circular dead-zone indicators.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎮 Analog Trigger Pressure</h3>
              <p className="text-[11px]">Measure Hall-effect and analog potentiometer trigger pull ratios (0% to 100%).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📳 Dual-Rumble Haptic Test</h3>
              <p className="text-[11px]">Trigger controller force feedback vibration motors across supported hardware.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Connection Status Banner */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              {connectedControllers.length > 0 ? '🎮' : '🔌'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: connectedControllers.length > 0 ? 'var(--green, #10b981)' : '#f59e0b' }}
                />
                <h2 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text)' }}>
                  {connectedControllers.length > 0
                    ? `${connectedControllers.length} Controller(s) Connected`
                    : 'No Gamepad Detected (Press any button on controller)'}
                </h2>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {activePad ? activePad.id : 'Connect via USB or Bluetooth and press any face button to activate browser detection.'}
              </p>
            </div>
          </div>

          {connectedControllers.length > 1 && (
            <div className="flex items-center gap-2">
              <label htmlFor="pad-select" className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
                Select Pad:
              </label>
              <select
                id="pad-select"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="p-2 rounded-xl text-xs font-semibold focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                {connectedControllers.map((c, i) => (
                  <option key={i} value={i}>
                    Pad {i}: {c.id.slice(0, 24)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {activePad && vibrationSupported && (
            <button
              type="button"
              onClick={testVibration}
              disabled={vibrating}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              <span>📳</span>
              <span>{vibrating ? 'Vibrating...' : 'Test Rumble / Vibration'}</span>
            </button>
          )}
        </div>

        {/* Analog Sticks & Triggers Display Card */}
        {activePad && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Stick & Left Trigger */}
            <div
              className="p-6 rounded-2xl flex flex-col gap-4 shadow-xs"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Left Analog Stick &amp; Trigger (LT)
              </span>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                {/* 2D Stick Visualizer */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="relative w-36 h-36 rounded-full border-2 flex items-center justify-center shadow-inner"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--border-c)' }}
                  >
                    {/* Center Crosshairs & Deadzone Circle */}
                    <div className="absolute w-full h-[1px] bg-[var(--border-c)]" />
                    <div className="absolute h-full w-[1px] bg-[var(--border-c)]" />
                    <div className="absolute w-12 h-12 rounded-full border border-dashed opacity-40" style={{ borderColor: 'var(--muted)' }} />

                    {/* Stick Position Dot */}
                    <div
                      className="absolute w-7 h-7 rounded-full shadow transition-transform duration-75 flex items-center justify-center text-[9px] font-bold"
                      style={{
                        background: activePad.buttons[10]?.pressed ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 70%, white)',
                        color: '#fff',
                        transform: `translate(${leftStick.x * 45}px, ${leftStick.y * 45}px)`,
                      }}
                    >
                      L3
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--text)' }}>
                    X: {leftStick.x} | Y: {leftStick.y}
                  </span>
                </div>

                {/* Left Trigger (LT) Pressure Bar */}
                <div className="flex flex-col items-center gap-2 w-28">
                  <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Left Trigger (LT)</span>
                  <div className="w-8 h-32 rounded-xl overflow-hidden flex flex-col justify-end p-1 shadow-inner" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                    <div
                      className="w-full rounded-lg transition-all"
                      style={{
                        height: `${Math.round((activePad.buttons[6]?.value ?? 0) * 100)}%`,
                        background: 'var(--accent)',
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--text)' }}>
                    {Math.round((activePad.buttons[6]?.value ?? 0) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Right Stick & Right Trigger */}
            <div
              className="p-6 rounded-2xl flex flex-col gap-4 shadow-xs"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                Right Analog Stick &amp; Trigger (RT)
              </span>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                {/* 2D Stick Visualizer */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="relative w-36 h-36 rounded-full border-2 flex items-center justify-center shadow-inner"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--border-c)' }}
                  >
                    {/* Center Crosshairs & Deadzone Circle */}
                    <div className="absolute w-full h-[1px] bg-[var(--border-c)]" />
                    <div className="absolute h-full w-[1px] bg-[var(--border-c)]" />
                    <div className="absolute w-12 h-12 rounded-full border border-dashed opacity-40" style={{ borderColor: 'var(--muted)' }} />

                    {/* Stick Position Dot */}
                    <div
                      className="absolute w-7 h-7 rounded-full shadow transition-transform duration-75 flex items-center justify-center text-[9px] font-bold"
                      style={{
                        background: activePad.buttons[11]?.pressed ? 'var(--green, #10b981)' : 'color-mix(in srgb, var(--green, #10b981) 70%, white)',
                        color: '#fff',
                        transform: `translate(${rightStick.x * 45}px, ${rightStick.y * 45}px)`,
                      }}
                    >
                      R3
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--text)' }}>
                    X: {rightStick.x} | Y: {rightStick.y}
                  </span>
                </div>

                {/* Right Trigger (RT) Pressure Bar */}
                <div className="flex flex-col items-center gap-2 w-28">
                  <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Right Trigger (RT)</span>
                  <div className="w-8 h-32 rounded-xl overflow-hidden flex flex-col justify-end p-1 shadow-inner" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                    <div
                      className="w-full rounded-lg transition-all"
                      style={{
                        height: `${Math.round((activePad.buttons[7]?.value ?? 0) * 100)}%`,
                        background: 'var(--green, #10b981)',
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--text)' }}>
                    {Math.round((activePad.buttons[7]?.value ?? 0) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons State Matrix */}
        {activePad && (
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Controller Button Signals &amp; Pressure Values ({activePad.buttons.length} Buttons)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {activePad.buttons.map((btn, idx) => {
                const label = BUTTON_LABELS[idx] || `Button ${idx}`;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl flex flex-col justify-between gap-2 shadow-2xs transition-all"
                    style={{
                      background: btn.pressed ? 'color-mix(in srgb, var(--accent) 20%, var(--surface))' : 'var(--surface-2)',
                      border: btn.pressed ? '2px solid var(--accent)' : '1px solid var(--border-c)',
                    }}
                  >
                    <span className="text-[11px] font-bold truncate" style={{ color: 'var(--text)' }}>
                      {label}
                    </span>
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{
                          background: btn.pressed ? 'var(--accent)' : 'var(--surface)',
                          color: btn.pressed ? '#fff' : 'var(--muted)',
                        }}
                      >
                        {btn.pressed ? 'PRESSED' : 'RELEASED'}
                      </span>
                      <span className="text-[11px] font-mono font-semibold" style={{ color: 'var(--muted)' }}>
                        {btn.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Gamepad Empty State Card */}
        {!activePad && (
          <div
            className="p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <span className="text-5xl" aria-hidden="true">🎮</span>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              Waiting for Controller Input...
            </h3>
            <p className="text-xs max-w-md" style={{ color: 'var(--muted)' }}>
              Plug in your Xbox, PlayStation, Switch Pro, or USB gamepad, then <strong>press any button</strong> on the controller to initiate communication.
            </p>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
