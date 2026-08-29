'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

// Math Conversions
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function rgbToCmyk(r: number, g: number, b: number) {
  if (r === 0 && g === 0 && b === 0) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

// Relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export default function ColorConverterPage() {
  const tool = useMemo(() => getToolBySlug('color-converter')!, []);

  const [hexInput, setHexInput] = useState<string>('#6366f1');
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number }>({ r: 99, g: 102, b: 241 });
  const [alpha, setAlpha] = useState<number>(1);

  // Sync from HEX string
  const updateFromHex = useCallback((hex: string) => {
    let clean = hex.trim().replace(/^#/, '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    if (/^[0-9a-fA-F]{6}$/.test(clean)) {
      const r = parseInt(clean.slice(0, 2), 16);
      const g = parseInt(clean.slice(2, 4), 16);
      const b = parseInt(clean.slice(4, 6), 16);
      setRgb({ r, g, b });
      setHexInput(`#${clean}`);
    }
  }, []);

  // Update when RGB changes
  const updateFromRgb = (r: number, g: number, b: number) => {
    const clampedR = Math.min(255, Math.max(0, r));
    const clampedG = Math.min(255, Math.max(0, g));
    const clampedB = Math.min(255, Math.max(0, b));
    setRgb({ r: clampedR, g: clampedG, b: clampedB });
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    setHexInput(`#${toHex(clampedR)}${toHex(clampedG)}${toHex(clampedB)}`);
  };

  useEffect(() => {
    updateFromHex('#6366f1');
  }, [updateFromHex]);

  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const hsv = useMemo(() => rgbToHsv(rgb.r, rgb.g, rgb.b), [rgb]);
  const cmyk = useMemo(() => rgbToCmyk(rgb.r, rgb.g, rgb.b), [rgb]);

  // Formatted Strings
  const rgbString = alpha < 1 ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = alpha < 1 ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})` : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const hsvString = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  const cmykString = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

  // WCAG Contrast Ratios
  const contrastInfo = useMemo(() => {
    const lum = getLuminance(rgb.r, rgb.g, rgb.b);
    const lumWhite = getLuminance(255, 255, 255);
    const lumBlack = getLuminance(0, 0, 0);

    const ratioWhite = +( (lumWhite + 0.05) / (lum + 0.05) ).toFixed(2);
    const ratioBlack = +( (lum + 0.05) / (lumBlack + 0.05) ).toFixed(2);

    return { ratioWhite, ratioBlack };
  }, [rgb]);

  // Shades and Tints
  const shadesAndTints = useMemo(() => {
    const steps = [-40, -20, -10, 0, 10, 20, 40];
    return steps.map((step) => {
      const factor = step / 100;
      let r = rgb.r;
      let g = rgb.g;
      let b = rgb.b;
      if (factor > 0) {
        // Tint (lighter)
        r = Math.round(r + (255 - r) * factor);
        g = Math.round(g + (255 - g) * factor);
        b = Math.round(b + (255 - b) * factor);
      } else if (factor < 0) {
        // Shade (darker)
        r = Math.round(r * (1 + factor));
        g = Math.round(g * (1 + factor));
        b = Math.round(b * (1 + factor));
      }
      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      return {
        label: step === 0 ? 'Base' : step > 0 ? `+${step}% Tint` : `${step}% Shade`,
        hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
        r, g, b,
      };
    });
  }, [rgb]);

  const handleReset = () => {
    updateFromHex('#6366f1');
    setAlpha(1);
  };

  const faqs: FAQItem[] = [
    {
      question: 'Why does CMYK look slightly different in print vs monitors?',
      answer:
        'Monitors emit light using additive RGB (Red, Green, Blue) color space, whereas printers mix physical ink pigments using subtractive CMYK (Cyan, Magenta, Yellow, Key/Black). Because RGB monitors have a wider gamut, the mathematical conversion is an accurate theoretical preview, but physical print ink requires color-profile calibration (e.g. SWOP/FOGRA).',
    },
    {
      question: 'What are WCAG Contrast Ratios?',
      answer:
        'The Web Content Accessibility Guidelines (WCAG) recommend a minimum contrast ratio of 4.5:1 for standard text (Level AA) and 7:1 for enhanced accessibility (Level AAA) against background colors.',
    },
    {
      question: 'How does HSL differ from HSV?',
      answer:
        'HSL (Hue, Saturation, Lightness) defines lightness from black (0%) to white (100%), with pure colors at 50% lightness. HSV (Hue, Saturation, Value/Brightness) defines brightness from black (0%) to full color intensity (100%).',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Bidirectional HEX, RGB, HSL, HSV &amp; CMYK Color Space Converter
          </h2>
          <p>
            Convert design tokens and color codes across digital web and print standards with live preview swatches, accessibility contrast testing, and automated shade palettes.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎨 5 Color Spaces</h3>
              <p className="text-[11px]">Instant translation across HEX, RGB/A, HSL/A, HSV, and CMYK formats.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>👁️ WCAG Contrast Checker</h3>
              <p className="text-[11px]">Check accessibility contrast against pure black and white backgrounds.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🌈 Tints &amp; Shades Matrix</h3>
              <p className="text-[11px]">Auto-generate harmonious lighter and darker color variations.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Top Interactive Banner & Swatch */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Color Swatch */}
          <div
            className="lg:col-span-5 p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-between gap-4 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Active Color Swatch
            </span>

            <div
              className="w-full h-44 rounded-2xl shadow-inner flex flex-col items-center justify-center gap-2 p-4 transition-colors duration-200"
              style={{
                backgroundColor: hexInput,
                opacity: alpha,
                border: '1px solid rgba(0,0,0,0.15)',
              }}
            >
              <span className="text-xl sm:text-2xl font-black font-mono px-3 py-1 rounded-lg backdrop-blur-md" style={{ color: contrastInfo.ratioWhite >= 4.5 ? '#ffffff' : '#000000' }}>
                {hexInput.toUpperCase()}
              </span>
            </div>

            {/* Native Color Picker Trigger */}
            <div className="flex items-center gap-3 w-full justify-center">
              <label htmlFor="color-picker" className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                Pick from Canvas:
              </label>
              <input
                id="color-picker"
                type="color"
                value={hexInput}
                onChange={(e) => updateFromHex(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
              />
            </div>
          </div>

          {/* Accessibility & Quick Metrics */}
          <div
            className="lg:col-span-7 p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              WCAG Accessibility Contrast Ratios
            </span>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* White text contrast */}
              <div
                className="p-4 rounded-xl flex items-center justify-between shadow-2xs"
                style={{ background: '#ffffff', color: '#000000', border: '1px solid var(--border-c)' }}
              >
                <div>
                  <p className="text-xs font-bold">White Text (#FFF)</p>
                  <p className="text-xl font-black font-mono">{contrastInfo.ratioWhite}:1</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: contrastInfo.ratioWhite >= 4.5 ? '#10b981' : '#ef4444',
                    color: '#ffffff',
                  }}
                >
                  {contrastInfo.ratioWhite >= 7 ? 'AAA Pass' : contrastInfo.ratioWhite >= 4.5 ? 'AA Pass' : 'Fail'}
                </span>
              </div>

              {/* Black text contrast */}
              <div
                className="p-4 rounded-xl flex items-center justify-between shadow-2xs"
                style={{ background: '#0f172a', color: '#ffffff', border: '1px solid var(--border-c)' }}
              >
                <div>
                  <p className="text-xs font-bold">Black Text (#000)</p>
                  <p className="text-xl font-black font-mono">{contrastInfo.ratioBlack}:1</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: contrastInfo.ratioBlack >= 4.5 ? '#10b981' : '#ef4444',
                    color: '#ffffff',
                  }}
                >
                  {contrastInfo.ratioBlack >= 7 ? 'AAA Pass' : contrastInfo.ratioBlack >= 4.5 ? 'AA Pass' : 'Fail'}
                </span>
              </div>
            </div>

            {/* Alpha Transparency Slider */}
            <div className="flex flex-col gap-1.5 pt-2" style={{ borderTop: '1px solid var(--border-c)' }}>
              <div className="flex items-center justify-between text-xs font-bold">
                <label htmlFor="alpha-range" style={{ color: 'var(--text)' }}>
                  Alpha Opacity: {Math.round(alpha * 100)}%
                </label>
                <span className="font-mono" style={{ color: 'var(--muted)' }}>{alpha}</span>
              </div>
              <input
                id="alpha-range"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer accent-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* Color Formats Value Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* HEX */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="hex-code" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                HEX Color
              </label>
              <CopyButton textToCopy={hexInput} size="sm" />
            </div>
            <input
              id="hex-code"
              type="text"
              value={hexInput}
              onChange={(e) => updateFromHex(e.target.value)}
              className="w-full p-2.5 rounded-xl font-mono text-sm font-bold uppercase focus:outline-none"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />
          </div>

          {/* RGB */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                RGB / RGBA
              </span>
              <CopyButton textToCopy={rgbString} size="sm" />
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono">
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) => updateFromRgb(Number(e.target.value), rgb.g, rgb.b)}
                aria-label="Red channel"
                className="p-2 text-center rounded-xl text-xs font-bold focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) => updateFromRgb(rgb.r, Number(e.target.value), rgb.b)}
                aria-label="Green channel"
                className="p-2 text-center rounded-xl text-xs font-bold focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) => updateFromRgb(rgb.r, rgb.g, Number(e.target.value))}
                aria-label="Blue channel"
                className="p-2 text-center rounded-xl text-xs font-bold focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          </div>

          {/* HSL */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                HSL / HSLA
              </span>
              <CopyButton textToCopy={hslString} size="sm" />
            </div>
            <div className="p-2.5 rounded-xl font-mono text-sm font-semibold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {hslString}
            </div>
          </div>

          {/* HSV */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                HSV / HSB
              </span>
              <CopyButton textToCopy={hsvString} size="sm" />
            </div>
            <div className="p-2.5 rounded-xl font-mono text-sm font-semibold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {hsvString}
            </div>
          </div>

          {/* CMYK */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs sm:col-span-2 lg:col-span-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                  CMYK (Print Pigment Approximation)
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                  C:{cmyk.c}% M:{cmyk.m}% Y:{cmyk.y}% K:{cmyk.k}%
                </span>
              </div>
              <CopyButton textToCopy={cmykString} size="sm" />
            </div>
            <div className="p-2.5 rounded-xl font-mono text-sm font-semibold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {cmykString}
            </div>
          </div>
        </div>

        {/* Tints & Shades Palette */}
        <div
          className="p-6 rounded-2xl flex flex-col gap-4 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Tints &amp; Shades Palette Variations
            </h3>
            <ResetButton onClick={handleReset} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {shadesAndTints.map((st) => (
              <div
                key={st.label}
                onClick={() => updateFromHex(st.hex)}
                className="group p-3 rounded-xl flex flex-col gap-2 cursor-pointer transition-all hover:scale-102"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
              >
                <div
                  className="w-full h-12 rounded-lg shadow-inner"
                  style={{ backgroundColor: st.hex }}
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold truncate" style={{ color: 'var(--muted)' }}>{st.label}</span>
                  <span className="text-xs font-bold font-mono group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>{st.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
