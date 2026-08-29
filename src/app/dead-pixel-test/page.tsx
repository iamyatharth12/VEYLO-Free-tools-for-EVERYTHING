'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  FAQItem,
} from '@/components/tool-ui';

const TEST_COLORS = [
  { name: 'Pure Black', hex: '#000000', label: 'Black (Stuck Pixels)' },
  { name: 'Pure White', hex: '#ffffff', label: 'White (Dead Pixels)' },
  { name: 'Pure Red', hex: '#ff0000', label: 'Red Subpixels' },
  { name: 'Pure Green', hex: '#00ff00', label: 'Green Subpixels' },
  { name: 'Pure Blue', hex: '#0000ff', label: 'Blue Subpixels' },
  { name: 'Cyan', hex: '#00ffff', label: 'Cyan' },
  { name: 'Magenta', hex: '#ff00ff', label: 'Magenta' },
  { name: 'Yellow', hex: '#ffff00', label: 'Yellow' },
];

export default function DeadPixelTestPage() {
  const tool = useMemo(() => getToolBySlug('dead-pixel-test')!, []);

  const [colorIndex, setColorIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHud, setShowHud] = useState<boolean>(true);
  const hudTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentColor = TEST_COLORS[colorIndex] || TEST_COLORS[0];

  const nextColor = useCallback(() => {
    setColorIndex((prev) => (prev + 1) % TEST_COLORS.length);
  }, []);

  const prevColor = useCallback(() => {
    setColorIndex((prev) => (prev - 1 + TEST_COLORS.length) % TEST_COLORS.length);
  }, []);

  // Enter Fullscreen
  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen permission denied or restricted
    }
  };

  // Exit Fullscreen
  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Exit fullscreen fallback
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextColor();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevColor();
      } else if (e.key === 'Escape' || e.key === 'f' || e.key === 'F') {
        exitFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, nextColor, prevColor]);

  // Auto-hide HUD on mouse idle
  const handleMouseMove = () => {
    setShowHud(true);
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = setTimeout(() => {
      setShowHud(false);
    }, 3000);
  };

  const faqs: FAQItem[] = [
    {
      question: 'What is the difference between a dead pixel and a stuck pixel?',
      answer:
        '• Dead Pixel: A pixel where all three RGB subpixels remain permanently turned off, appearing as a dark black dot against pure white or bright backgrounds.\n• Stuck Pixel: A subpixel (Red, Green, or Blue) whose transistor is frozen in the "on" state, showing as a bright colored pinprick against pure black.',
    },
    {
      question: 'Can stuck pixels be repaired without replacing the panel?',
      answer:
        'Stuck pixels can sometimes be unstuck by rapidly cycling RGB colors or gently massaging the surrounding panel with a soft microfiber cloth. Dead pixels (burned transistors), however, generally require physical screen replacement.',
    },
    {
      question: 'How should I clean my monitor before testing?',
      answer:
        'Wipe your display gently with a dry, clean microfiber cloth before running the test to ensure that dust specks or surface smudges are not mistaken for defective screen pixels.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Full-Screen Display &amp; Defective Subpixel Diagnostic
          </h2>
          <p>
            Inspect IPS, VA, TN, OLED, and Mini-LED monitors, laptops, and mobile screens for manufacturing defects, backlight bleed, and dead subpixels.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🖥️ True Fullscreen Canvas</h3>
              <p className="text-[11px]">Hides all browser toolbars, tabs, and OS taskbars for complete screen coverage.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔴 Solid RGB Spectrum</h3>
              <p className="text-[11px]">Cycle through Black, White, Red, Green, Blue, Cyan, Magenta, and Yellow.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⌨️ Keyboard &amp; Touch Controls</h3>
              <p className="text-[11px]">Use Arrow Keys, Spacebar, or taps to navigate seamlessly.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Fullscreen Trigger Hero Card */}
        <div
          className="p-8 sm:p-12 rounded-2xl flex flex-col items-center justify-center gap-6 text-center shadow-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <span className="text-5xl" aria-hidden="true">🖥️</span>
          <div className="flex flex-col gap-2 max-w-lg">
            <h2 className="text-2xl font-black" style={{ color: 'var(--text)' }}>
              Launch Full-Screen Dead Pixel Test
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>
              Click the button below to expand the solid color canvas to your full monitor resolution. Use <strong>Left/Right Arrows</strong> or <strong>Spacebar</strong> to cycle colors, and <strong>ESC</strong> to exit.
            </p>
          </div>

          <button
            type="button"
            onClick={enterFullscreen}
            className="px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-lg flex items-center gap-3"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            <span>⛶</span>
            <span>Start Fullscreen Test</span>
          </button>
        </div>

        {/* In-Page Color Selector Preview */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Quick Color Palette Selector ({colorIndex + 1} of {TEST_COLORS.length}: {currentColor.name})
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevColor}
                className="px-3 py-1 rounded-lg text-xs font-bold"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={nextColor}
                className="px-3 py-1 rounded-lg text-xs font-bold"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Color preview swatch in page */}
          <div
            className="w-full h-48 sm:h-64 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner transition-colors duration-200 cursor-pointer"
            style={{
              backgroundColor: currentColor.hex,
              color: currentColor.hex === '#000000' ? '#ffffff' : '#000000',
              border: '1px solid var(--border-c)',
            }}
            onClick={enterFullscreen}
            title="Click to enter fullscreen"
          >
            <span className="p-3 rounded-xl backdrop-blur-md font-mono text-sm bg-black/20 text-white">
              {currentColor.name} ({currentColor.hex}) — Click to Fullscreen
            </span>
          </div>

          {/* Color Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {TEST_COLORS.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColorIndex(idx)}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  colorIndex === idx ? 'ring-2 ring-[var(--accent)] scale-102' : 'hover:scale-102'
                }`}
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-xs"
                  style={{ backgroundColor: c.hex, border: '1px solid rgba(0,0,0,0.2)' }}
                />
                <span className="text-[11px] font-bold truncate max-w-full" style={{ color: 'var(--text)' }}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Fullscreen Overlay Component */}
        {isFullscreen && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 select-none cursor-pointer"
            style={{ backgroundColor: currentColor.hex }}
            onMouseMove={handleMouseMove}
            onClick={nextColor}
          >
            {/* Auto-Hiding Top HUD */}
            <div
              className={`w-full max-w-lg p-4 rounded-2xl backdrop-blur-md flex items-center justify-between shadow-2xl transition-opacity duration-300 ${
                showHud ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                  Dead Pixel Screen Diagnostic
                </span>
                <span className="text-sm font-black">
                  {currentColor.name} ({colorIndex + 1} / {TEST_COLORS.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevColor}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition-colors"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={nextColor}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition-colors"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={exitFullscreen}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Exit Test (ESC)
                </button>
              </div>
            </div>

            {/* Bottom Tip Hint */}
            <div
              className={`text-[11px] font-semibold px-4 py-2 rounded-full backdrop-blur-md shadow-lg transition-opacity duration-300 ${
                showHud ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{ background: 'rgba(15, 23, 42, 0.75)', color: '#ffffff' }}
            >
              Click screen or press Spacebar to advance · Move mouse to show controls
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
