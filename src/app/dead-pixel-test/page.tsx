'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  FAQItem,
} from '@/components/tool-ui';

interface ColorDef {
  name: string;
  hex: string;
  category: 'primary' | 'monochrome' | 'secondary';
  description: string;
}

const TEST_COLORS: ColorDef[] = [
  { name: 'Pure Red', hex: '#FF0000', category: 'primary', description: 'Red Subpixels & Stuck Pixels' },
  { name: 'Pure Green', hex: '#00FF00', category: 'primary', description: 'Green Subpixels & Stuck Pixels' },
  { name: 'Pure Blue', hex: '#0000FF', category: 'primary', description: 'Blue Subpixels & Stuck Pixels' },
  { name: 'Pure White', hex: '#FFFFFF', category: 'monochrome', description: 'Dead Pixels (Black Specks)' },
  { name: 'Pure Black', hex: '#000000', category: 'monochrome', description: 'Stuck/Hot Pixels & Backlight Bleed' },
  { name: '50% Neutral Gray', hex: '#808080', category: 'monochrome', description: 'Subpixel Uniformity & Gamma' },
  { name: '25% Dark Gray', hex: '#404040', category: 'monochrome', description: 'Near-Black OLED & VA Uniformity' },
  { name: '75% Light Gray', hex: '#C0C0C0', category: 'monochrome', description: 'Near-White Tint & Dirty Screen Effect' },
  { name: 'Cyan', hex: '#00FFFF', category: 'secondary', description: 'Red Subpixel Failure Check' },
  { name: 'Magenta', hex: '#FF00FF', category: 'secondary', description: 'Green Subpixel Failure Check' },
  { name: 'Yellow', hex: '#FFFF00', category: 'secondary', description: 'Blue Subpixel Failure Check' },
];

export default function DeadPixelTestPage() {
  const tool = useMemo(() => getToolBySlug('dead-pixel-test')!, []);

  const [colorIndex, setColorIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHud, setShowHud] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  const hudTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement | null>(null);

  const currentColor = TEST_COLORS[colorIndex] || TEST_COLORS[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextColor = useCallback(() => {
    setColorIndex((prev) => (prev + 1) % TEST_COLORS.length);
  }, []);

  const prevColor = useCallback(() => {
    setColorIndex((prev) => (prev - 1 + TEST_COLORS.length) % TEST_COLORS.length);
  }, []);

  // Enter Fullscreen on the dedicated fullscreen container
  const enterFullscreen = useCallback(async () => {
    const el = fullscreenContainerRef.current || document.documentElement;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if ((el as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (el as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ((el as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
        await (el as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch {
      // Fallback: If browser restricts Fullscreen API, enable fixed viewport overlay
      setIsFullscreen(true);
    }
  }, []);

  // Exit Fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement || (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        }
      }
    } catch {
      // Ignore exit errors
    } finally {
      setIsFullscreen(false);
    }
  }, []);

  // Sync state with native browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
        (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Prevent underlying scroll and handle keyboard shortcuts during fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
        e.preventDefault();
        nextColor();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        prevColor();
      } else if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        exitFullscreen();
      } else if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < TEST_COLORS.length) {
          setColorIndex(idx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, nextColor, prevColor, exitFullscreen]);

  // Auto-hide HUD on mouse idle
  const handleMouseMove = useCallback(() => {
    setShowHud(true);
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = setTimeout(() => {
      setShowHud(false);
    }, 2500);
  }, []);

  const faqs: FAQItem[] = [
    {
      question: 'How do I identify dead vs stuck pixels in fullscreen?',
      answer:
        '• Dead Pixel: Appears as a completely dark, unlit spot against pure white (#FFFFFF) and light gray backgrounds.\n• Stuck Pixel: Appears as a constant glowing red, green, or blue subpixel dot against pure black (#000000).\n• Hot Pixel: An all-white pixel that remains permanently turned on across all colors.',
    },
    {
      question: 'How do I cycle colors and exit fullscreen mode?',
      answer:
        '• Next Color: Click anywhere on the screen, or press Spacebar / Right Arrow (→).\n• Previous Color: Press Left Arrow (←).\n• Exit Fullscreen: Press Escape (ESC) or click the red "Exit Test" button in the control overlay.',
    },
    {
      question: 'Why is a 100% full-screen canvas necessary for dead pixel inspection?',
      answer:
        'Browser URL bars, window frames, and operating system taskbars can obscure edge and corner pixels where panel manufacturing defects and backlight bleeding are most common.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            True Fullscreen Monitor &amp; Display Defective Subpixel Diagnostic
          </h2>
          <p>
            Inspect IPS, VA, TN, OLED, and Mini-LED monitors, laptops, and mobile screens for manufacturing defects, backlight bleed, and dead subpixels.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🖥️ Edge-to-Edge 100vw × 100vh</h3>
              <p className="text-[11px]">Hides all browser toolbars, tabs, and OS taskbars for complete screen coverage.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔴 Complete 11-Color Matrix</h3>
              <p className="text-[11px]">Primary RGB, solid black/white, 3-tier gray uniformity, and secondary CMY.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⌨️ Smart Auto-Hiding HUD</h3>
              <p className="text-[11px]">Control HUD disappears after 2.5s of inactivity so no controls obscure pixels.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Fullscreen Launch Hero Card */}
        <div
          className="p-8 sm:p-12 rounded-2xl flex flex-col items-center justify-center gap-6 text-center shadow-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <span className="text-5xl" aria-hidden="true">🖥️</span>
          <div className="flex flex-col gap-2 max-w-lg">
            <h2 className="text-2xl font-black" style={{ color: 'var(--text)' }}>
              Launch Fullscreen Dead Pixel Test
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>
              Expands a solid color canvas to your exact display resolution, hiding all browser headers, taskbars, and UI. Use <strong>Spacebar</strong> or <strong>Arrows</strong> to cycle colors, and <strong>ESC</strong> to exit.
            </p>
          </div>

          <button
            type="button"
            onClick={enterFullscreen}
            className="px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-lg flex items-center gap-3 cursor-pointer"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            <span className="text-lg">⛶</span>
            <span>Start Fullscreen Test (100% Viewport)</span>
          </button>
        </div>

        {/* In-Page Color Palette Selector */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Color Palette Matrix ({colorIndex + 1} of {TEST_COLORS.length})
              </h3>
              <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                {currentColor.name} — <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>{currentColor.hex}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevColor}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                ← Prev (←)
              </button>
              <button
                type="button"
                onClick={nextColor}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Next (→)
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div
            className="w-full h-52 sm:h-64 rounded-2xl flex items-center justify-center font-black shadow-inner transition-colors duration-200 cursor-pointer relative overflow-hidden group"
            style={{
              backgroundColor: currentColor.hex,
              border: '1px solid var(--border-c)',
            }}
            onClick={enterFullscreen}
            title="Click to launch fullscreen test"
          >
            <div
              className="px-5 py-3 rounded-xl backdrop-blur-md font-mono text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-transform group-hover:scale-105"
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span>⛶</span>
              <span>{currentColor.name} — Click to Enter True Fullscreen</span>
            </div>
          </div>

          {/* Color Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {TEST_COLORS.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColorIndex(idx)}
                className={`p-3 rounded-xl flex items-center gap-3 transition-all text-left ${
                  colorIndex === idx ? 'ring-2 ring-[var(--accent)] scale-102' : 'hover:scale-102'
                }`}
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
              >
                <div
                  className="w-7 h-7 rounded-lg shrink-0 shadow-xs"
                  style={{ backgroundColor: c.hex, border: '1px solid rgba(0,0,0,0.2)' }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate" style={{ color: 'var(--text)' }}>
                    {c.name}
                  </span>
                  <span className="text-[10px] font-mono truncate" style={{ color: 'var(--muted)' }}>
                    {c.hex}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dedicated True Fullscreen Portal (Mounted at Document Body to Escape All Page Constraints) */}
      {mounted && isFullscreen && createPortal(
        <div
          ref={fullscreenContainerRef}
          className="select-none cursor-pointer"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            margin: 0,
            padding: 0,
            border: 'none',
            borderRadius: 0,
            backgroundColor: currentColor.hex,
            zIndex: 9999999,
            overflow: 'hidden',
          }}
          onMouseMove={handleMouseMove}
          onClick={nextColor}
        >
          {/* Unobtrusive Floating Control Overlay (Auto-Hides on Inactivity) */}
          <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 transition-all duration-300 ${
              showHud ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: 'rgba(15, 23, 42, 0.90)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-md shadow-xs border border-white/20"
                  style={{ backgroundColor: currentColor.hex }}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--accent)]">
                      Dead Pixel Diagnostic
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({colorIndex + 1}/{TEST_COLORS.length})
                    </span>
                  </div>
                  <span className="text-sm font-bold leading-tight">
                    {currentColor.name} <span className="text-xs text-slate-300 font-normal">({currentColor.description})</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevColor}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Previous Color (Left Arrow)"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={nextColor}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Next Color (Right Arrow / Space)"
                >
                  Next →
                </button>
                <button
                  type="button"
                  onClick={exitFullscreen}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow"
                >
                  Exit Test (ESC)
                </button>
              </div>
            </div>

            {/* Micro Helper Tip */}
            <div className="text-center mt-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-300 font-medium shadow-sm">
                Click canvas or press <strong>Space / Arrows</strong> to cycle · <strong>ESC</strong> to exit · Move mouse for controls
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </ToolPageShell>
  );
}
