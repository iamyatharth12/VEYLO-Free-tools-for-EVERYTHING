'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

// Greatest Common Divisor
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

const PRESET_RATIOS = [
  { name: '16:9 (Widescreen HD/4K)', w: 16, h: 9 },
  { name: '4:3 (Standard TV / iPad)', w: 4, h: 3 },
  { name: '21:9 (Ultrawide Cinema)', w: 21, h: 9 },
  { name: '1:1 (Square / Instagram)', w: 1, h: 1 },
  { name: '9:16 (Vertical Reels / TikTok)', w: 9, h: 16 },
  { name: '3:2 (Photography 35mm)', w: 3, h: 2 },
  { name: '16:10 (MacBook / Monitors)', w: 16, h: 10 },
];

export default function AspectRatioCalculatorPage() {
  const tool = useMemo(() => getToolBySlug('aspect-ratio-calculator')!, []);

  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);

  const [ratioW, setRatioW] = useState<number>(16);
  const [ratioH, setRatioH] = useState<number>(9);

  // Simplified Aspect Ratio from width & height
  const computedRatio = useMemo(() => {
    if (width <= 0 || height <= 0) return { rw: 0, rh: 0, decimal: 0, formatted: '0:0' };
    const divisor = gcd(width, height);
    const rw = width / divisor;
    const rh = height / divisor;
    const decimal = +(width / height).toFixed(3);
    return {
      rw,
      rh,
      decimal,
      formatted: `${rw}:${rh}`,
    };
  }, [width, height]);

  // Scaled Resolutions
  const scaledResolutions = useMemo(() => {
    if (width <= 0 || height <= 0) return [];
    const scales = [
      { label: '0.25x (Preview)', factor: 0.25 },
      { label: '0.5x (Half)', factor: 0.5 },
      { label: '0.75x', factor: 0.75 },
      { label: '1x (Original)', factor: 1 },
      { label: '1.5x', factor: 1.5 },
      { label: '2x (HiDPI / Retina)', factor: 2 },
      { label: '4x (Ultra HD)', factor: 4 },
    ];

    return scales.map((s) => ({
      label: s.label,
      w: Math.round(width * s.factor),
      h: Math.round(height * s.factor),
    }));
  }, [width, height]);

  // Apply a preset
  const handleApplyPreset = (rw: number, rh: number) => {
    setRatioW(rw);
    setRatioH(rh);
    // Keep width fixed, compute new height
    setHeight(Math.round((width * rh) / rw));
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (ratioW > 0 && ratioH > 0) {
      setHeight(Math.round((val * ratioH) / ratioW));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (ratioW > 0 && ratioH > 0) {
      setWidth(Math.round((val * ratioW) / ratioH));
    }
  };

  const handleReset = () => {
    setWidth(1920);
    setHeight(1080);
    setRatioW(16);
    setRatioH(9);
  };

  const faqs: FAQItem[] = [
    {
      question: 'How is aspect ratio simplified?',
      answer:
        'The aspect ratio is simplified by dividing both the pixel width and pixel height by their Greatest Common Divisor (GCD). For example, 1920 and 1080 have a GCD of 120, yielding 16:9.',
    },
    {
      question: 'What is the standard aspect ratio for YouTube and streaming?',
      answer:
        '16:9 (such as 1920×1080 for 1080p, 2560×1440 for 1440p, and 3840×2160 for 4K) is the universal standard for widescreen video displays.',
    },
    {
      question: 'How do vertical videos (9:16) differ from 16:9?',
      answer:
        '9:16 is simply 16:9 rotated 90 degrees vertically, standardized for mobile-first content like Instagram Reels, TikTok, and YouTube Shorts (e.g. 1080×1920).',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Proportional Image &amp; Video Aspect Ratio Calculator
          </h2>
          <p>
            Resize digital photos, video canvas resolutions, and UI containers without distorting proportions or causing unwanted letterboxing.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📐 Exact GCD Reduction</h3>
              <p className="text-[11px]">Instant fraction simplification (e.g. 1920×1080 ➔ 16:9).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚖️ Proportional Scaling</h3>
              <p className="text-[11px]">Scale resolutions up or down without stretching pixels.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📱 Common Aspect Presets</h3>
              <p className="text-[11px]">1-click presets for 16:9, 4:3, 21:9, 9:16 Reels, and 1:1 square.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Preset Ratio Bar */}
        <div
          className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Aspect Ratio Presets:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_RATIOS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p.w, p.h)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  ratioW === p.w && ratioH === p.h ? 'shadow-xs' : 'hover:border-[var(--accent)]'
                }`}
                style={{
                  background: ratioW === p.w && ratioH === p.h ? 'var(--accent)' : 'var(--surface-2)',
                  color: ratioW === p.w && ratioH === p.h ? '#fff' : 'var(--text)',
                  border: ratioW === p.w && ratioH === p.h ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                {p.w}:{p.h}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Dimension Calculator & Live Preview */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div
            className="lg:col-span-7 p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Width Input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="dim-width" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  Width (Pixels)
                </label>
                <input
                  id="dim-width"
                  type="number"
                  min="1"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full p-3 rounded-xl text-base font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              {/* Height Input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="dim-height" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  Height (Pixels)
                </label>
                <input
                  id="dim-height"
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full p-3 rounded-xl text-base font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>
            </div>

            {/* Ratio Output Summary */}
            <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
              <div className="flex flex-col">
                <span className="text-[11px]" style={{ color: 'var(--muted)' }}>Simplified Aspect Ratio</span>
                <span className="text-2xl font-black font-mono" style={{ color: 'var(--accent)' }}>
                  {computedRatio.formatted}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px]" style={{ color: 'var(--muted)' }}>Decimal Ratio</span>
                <p className="text-sm font-bold font-mono" style={{ color: 'var(--text)' }}>
                  {computedRatio.decimal} : 1
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <ResetButton onClick={handleReset} />
            </div>
          </div>

          {/* Visual Ratio Box Preview */}
          <div
            className="lg:col-span-5 p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-between gap-4 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Proportional Aspect Box Preview
            </span>

            <div className="w-full h-48 flex items-center justify-center p-4">
              <div
                className="rounded-xl flex items-center justify-center font-bold font-mono text-xs shadow-md transition-all duration-300"
                style={{
                  aspectRatio: `${width} / ${height}`,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: width >= height ? '100%' : 'auto',
                  height: height > width ? '100%' : 'auto',
                  background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))',
                  border: '2px solid var(--accent)',
                  color: 'var(--accent)',
                }}
              >
                {width} × {height}
              </div>
            </div>

            <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
              Total Area: {(width * height).toLocaleString()} pixels ({( (width * height) / 1000000 ).toFixed(2)} MP)
            </span>
          </div>
        </div>

        {/* Scaled Resolutions Grid */}
        {scaledResolutions.length > 0 && (
          <div
            className="p-6 rounded-2xl flex flex-col gap-4 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Proportionally Scaled Resolutions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {scaledResolutions.map((res) => (
                <div
                  key={res.label}
                  className="p-3 rounded-xl flex flex-col gap-1 text-center shadow-2xs"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
                >
                  <span className="text-[10px] font-semibold" style={{ color: 'var(--muted)' }}>{res.label}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: 'var(--text)' }}>
                    {res.w} × {res.h}
                  </span>
                  <CopyButton textToCopy={`${res.w}x${res.h}`} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
