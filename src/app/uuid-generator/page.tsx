'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  GenerateButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

export default function UuidGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('uuid-generator')!, []);

  const [count, setCount] = useState<number>(1);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [includeHyphens, setIncludeHyphens] = useState<boolean>(true);
  const [wrapBraces, setWrapBraces] = useState<boolean>(false);

  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate single RFC 4122 v4 UUID using crypto.randomUUID or byte buffer fallback
  const generateSingleUuid = (): string => {
    if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    // RFC4122 version 4 fallback
    const buffer = new Uint8Array(16);
    window.crypto.getRandomValues(buffer);
    buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant 10xx
    const hex = Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  };

  const formatUuid = useCallback((raw: string): string => {
    let formatted = raw;
    if (!includeHyphens) {
      formatted = formatted.replace(/-/g, '');
    }
    if (uppercase) {
      formatted = formatted.toUpperCase();
    } else {
      formatted = formatted.toLowerCase();
    }
    if (wrapBraces) {
      formatted = `{${formatted}}`;
    }
    return formatted;
  }, [includeHyphens, uppercase, wrapBraces]);

  const generate = useCallback(() => {
    const qty = Math.min(Math.max(1, count), 500);
    const list: string[] = [];
    for (let i = 0; i < qty; i++) {
      list.push(formatUuid(generateSingleUuid()));
    }
    setUuids(list);
  }, [count, formatUuid]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleReset = () => {
    setCount(1);
    setUppercase(false);
    setIncludeHyphens(true);
    setWrapBraces(false);
  };

  const handleDownload = (format: 'txt' | 'csv') => {
    const content = format === 'csv' ? `UUID\n${uuids.join('\n')}` : uuids.join('\n');
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veylo-uuids-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allUuidsText = uuids.join('\n');

  const faqs: FAQItem[] = [
    {
      question: 'What is a UUID version 4?',
      answer:
        'A UUID (Universally Unique Identifier) version 4 is a 128-bit identifier generated using random or pseudo-random numbers. Out of 128 bits, 122 bits provide pure randomness, resulting in over 5.3 × 10^36 possible unique values.',
    },
    {
      question: 'Can two generated UUIDs ever collide?',
      answer:
        'The probability of a collision in UUID v4 is negligible. You would have to generate over 1 billion UUIDs per second for 85 years before having even a 50% chance of generating a single collision.',
    },
    {
      question: 'Why doesn’t VEYLO implement UUID v1 in the browser?',
      answer:
        'UUID v1 requires accessing the host computer’s real-world IEEE 802 MAC address and strict clock counters. Because modern web browsers do not and should not expose your hardware MAC address for privacy and security reasons, client-side UUID v1 generators must fake the node ID. We prioritize authentic, cryptographically strong UUID v4.',
    },
    {
      question: 'Is a UUID the same as a GUID?',
      answer:
        'Yes. GUID (Globally Unique Identifier) is Microsoft’s standard implementation and terminology for the universal RFC 4122 UUID specification.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            RFC 4122 Compliant Client-Side UUID / GUID Generator
          </h2>
          <p>
            Generate universally unique identifiers for database primary keys, distributed tracking tokens, API transaction IDs, and test suites. Every UUID is generated locally using hardware entropy via the Web Crypto API.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎲 122 Bits of Entropy</h3>
              <p className="text-[11px]">RFC 4122 v4 specification standard with negligible collision odds.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📦 Bulk Batch Export</h3>
              <p className="text-[11px]">Generate up to 500 identifiers in a single click and export to TXT or CSV.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚙️ Custom Formatting</h3>
              <p className="text-[11px]">Toggle uppercase, stripped hyphens, and Microsoft GUID braces.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Output Display Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-5 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              {uuids.length > 1 ? `Generated UUIDs (${uuids.length})` : 'Generated UUID v4'}
            </span>
            <div className="flex items-center gap-2">
              {uuids.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => handleDownload('csv')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:border-[var(--accent)]"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                  >
                    CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('txt')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:border-[var(--accent)]"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                  >
                    TXT
                  </button>
                  <CopyButton textToCopy={allUuidsText} label="Copy All" size="sm" />
                </>
              )}
              {uuids.length === 1 && (
                <CopyButton textToCopy={uuids[0] || ''} label="Copy UUID" />
              )}
            </div>
          </div>

          {uuids.length === 1 ? (
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className="w-full max-w-2xl text-lg sm:text-2xl font-black font-mono tracking-wider select-all p-5 rounded-2xl break-all transition-all shadow-xs"
                style={{
                  color: 'var(--accent)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-c)',
                }}
              >
                {uuids[0] || 'Generating...'}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto p-3 rounded-xl text-left" style={{ background: 'var(--surface-2)' }}>
              {uuids.map((id, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
                >
                  <span className="font-mono text-xs sm:text-sm font-semibold select-all truncate" style={{ color: 'var(--text)' }}>
                    {id}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(id);
                      setCopiedIndex(i);
                      setTimeout(() => setCopiedIndex(null), 1500);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex-shrink-0"
                    style={{
                      background: copiedIndex === i ? 'var(--green, #10b981)' : 'var(--surface-2)',
                      color: copiedIndex === i ? '#fff' : 'var(--text)',
                      border: '1px solid var(--border-c)',
                    }}
                  >
                    {copiedIndex === i ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configuration Controls Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="uuid-qty" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Quantity (1 to 500)
              </label>
              <input
                id="uuid-qty"
                type="number"
                min="1"
                max="500"
                value={count}
                onChange={(e) => setCount(Math.min(500, Math.max(1, Number(e.target.value) || 1)))}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            {/* Uppercase Toggle */}
            <label
              className="p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer select-none self-end"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>UPPERCASE</span>
                <span className="text-[10px]" style={{ color: 'var(--muted)' }}>A-F hex characters</span>
              </div>
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent)] cursor-pointer"
              />
            </label>

            {/* Hyphens Toggle */}
            <label
              className="p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer select-none self-end"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Include Hyphens</span>
                <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Standard 8-4-4-4-12 format</span>
              </div>
              <input
                type="checkbox"
                checked={includeHyphens}
                onChange={(e) => setIncludeHyphens(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent)] cursor-pointer"
              />
            </label>

            {/* Braces Toggle */}
            <label
              className="p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer select-none self-end"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Braces Wrapping</span>
                <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Wrap in &#123;...&#125;</span>
              </div>
              <input
                type="checkbox"
                checked={wrapBraces}
                onChange={(e) => setWrapBraces(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent)] cursor-pointer"
              />
            </label>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-2 pt-4" style={{ borderTop: '1px solid var(--border-c)' }}>
            <ResetButton onClick={handleReset} />
            <GenerateButton onClick={generate} label="Regenerate UUIDs" />
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
