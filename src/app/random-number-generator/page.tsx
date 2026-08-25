'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  GenerateButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

export default function RandomNumberGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('random-number-generator')!, []);

  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const [results, setResults] = useState<number[]>([42]);
  const [history, setHistory] = useState<{ numbers: number[]; timestamp: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRandom = useCallback(() => {
    setError(null);

    const minNum = Math.floor(min);
    const maxNum = Math.floor(max);

    if (isNaN(minNum) || isNaN(maxNum)) {
      setError('Please enter valid numeric minimum and maximum values.');
      return;
    }
    if (minNum > maxNum) {
      setError('Minimum value cannot be greater than Maximum value.');
      return;
    }

    const rangeSize = maxNum - minNum + 1;
    const qty = Math.min(Math.max(1, Math.floor(count)), 1000);

    if (!allowDuplicates && qty > rangeSize) {
      setError(`Cannot generate ${qty} unique numbers from a range of ${rangeSize}. Either increase range or allow duplicates.`);
      return;
    }

    setIsGenerating(true);

    // Cryptographically strong random generator using window.crypto
    setTimeout(() => {
      let generated: number[] = [];

      if (!allowDuplicates) {
        // Sample without replacement
        const pool = new Set<number>();
        while (pool.size < qty) {
          const randBuffer = new Uint32Array(1);
          window.crypto.getRandomValues(randBuffer);
          const randFloat = randBuffer[0] / (0xffffffff + 1);
          const val = Math.floor(randFloat * rangeSize) + minNum;
          pool.add(val);
        }
        generated = Array.from(pool);
      } else {
        const randBuffer = new Uint32Array(qty);
        window.crypto.getRandomValues(randBuffer);
        for (let i = 0; i < qty; i++) {
          const randFloat = randBuffer[i] / (0xffffffff + 1);
          generated.push(Math.floor(randFloat * rangeSize) + minNum);
        }
      }

      if (sortOrder === 'asc') {
        generated.sort((a, b) => a - b);
      } else if (sortOrder === 'desc') {
        generated.sort((a, b) => b - a);
      }

      setResults(generated);
      setHistory(prev => [
        { numbers: generated, timestamp: new Date().toLocaleTimeString() },
        ...prev.slice(0, 9),
      ]);
      setIsGenerating(false);
    }, 80);
  }, [min, max, count, allowDuplicates, sortOrder]);

  const handleReset = () => {
    setMin(1);
    setMax(100);
    setCount(1);
    setAllowDuplicates(true);
    setSortOrder('none');
    setResults([42]);
    setError(null);
  };

  const resultsString = results.join(', ');

  const faqs: FAQItem[] = [
    {
      question: 'How are these random numbers generated?',
      answer:
        'VEYLO uses the browser standard Web Crypto API (crypto.getRandomValues) to generate cryptographically strong, non-deterministic pseudorandom numbers directly in your browser memory.',
    },
    {
      question: 'Can I generate unique numbers with no duplicates?',
      answer:
        'Yes. Toggle off the "Allow Duplicates" option. As long as your quantity does not exceed the total available range (Max - Min + 1), every generated number will be completely unique.',
    },
    {
      question: 'Is my data sent to any server?',
      answer:
        'No. Like all VEYLO tools, the calculation is executed 100% client-side inside your browser. No data or numbers are ever logged or uploaded.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Random Number Generator
          </h2>
          <p>
            Whether you need a quick decision maker, dice substitute, raffle lottery winner selector, or statistical sample, the VEYLO Random Number Generator provides instant, unbiased numbers with customizable ranges.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎲 Gaming &amp; Tabletop</h3>
              <p className="text-[11px]">Generate random values for RPG rolls, board game turns, and tie-breakers.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎟️ Giveaways &amp; Raffles</h3>
              <p className="text-[11px]">Select unique winning ticket numbers without duplicate entries.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔒 Cryptographic RNG</h3>
              <p className="text-[11px]">Backed by hardware entropy via Web Crypto API for true randomness.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Controls Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Minimum */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="min-num" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Minimum (Min)
              </label>
              <input
                id="min-num"
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            {/* Maximum */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="max-num" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Maximum (Max)
              </label>
              <input
                id="max-num"
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="qty-num" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Quantity of Numbers
              </label>
              <input
                id="qty-num"
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          </div>

          {/* Secondary Options */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs" style={{ borderTop: '1px solid var(--border-c)' }}>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>Allow Duplicates</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ color: 'var(--muted)' }}>Sort:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'none' | 'asc' | 'desc')}
                  className="p-1.5 rounded-lg text-xs font-semibold focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                >
                  <option value="none">Original Roll</option>
                  <option value="asc">Ascending (1 → 9)</option>
                  <option value="desc">Descending (9 → 1)</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <GenerateButton onClick={generateRandom} loading={isGenerating} label="Generate Numbers" />
            </div>
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-shake"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.25)' }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Output Presentation Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-5 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Generated Result ({results.length} {results.length === 1 ? 'number' : 'numbers'})
            </span>
            <CopyButton textToCopy={resultsString} label="Copy Results" />
          </div>

          {/* Hero display for single roll, responsive chip grid for multiple */}
          {results.length === 1 ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div
                className="text-6xl sm:text-8xl font-black font-mono tracking-tight select-all px-8 py-4 rounded-3xl transition-transform active:scale-95"
                style={{
                  color: 'var(--accent)',
                  background: 'color-mix(in srgb, var(--accent) 8%, var(--surface))',
                  border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                }}
              >
                {results[0]}
              </div>
              <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
                Range: [{min} to {max}]
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-h-72 overflow-y-auto p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
              {results.map((n, i) => (
                <span
                  key={`${n}-${i}`}
                  className="px-3 py-1.5 rounded-lg text-sm sm:text-base font-bold font-mono shadow-xs select-all"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-c)',
                    color: 'var(--text)',
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* History Log */}
        {history.length > 1 && (
          <div
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Recent Roll History
              </h3>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-[11px] font-semibold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Clear History
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto text-xs">
              {history.map((h, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl flex items-center justify-between gap-3"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <span className="font-mono font-medium truncate max-w-md" style={{ color: 'var(--text)' }}>
                    {h.numbers.join(', ')}
                  </span>
                  <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--muted)' }}>
                    {h.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
