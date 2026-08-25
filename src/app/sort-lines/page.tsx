'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

type SortMode = 'alphaAsc' | 'alphaDesc' | 'numAsc' | 'numDesc' | 'lengthAsc' | 'lengthDesc' | 'shuffle';

const SAMPLE_DATA = `Zebra\n100 items\nApple\n2 items\nBanana\n20 items\nOrange\n1 item\nMango`;

export default function SortLinesPage() {
  const tool = useMemo(() => getToolBySlug('sort-lines')!, []);

  const [text, setText] = useState<string>(SAMPLE_DATA);
  const [sortMode, setSortMode] = useState<SortMode>('alphaAsc');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimLines, setTrimLines] = useState<boolean>(true);
  const [removeEmpty, setRemoveEmpty] = useState<boolean>(true);
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  const sortedOutput = useMemo(() => {
    if (!text) return '';

    let lines = text.split(/\r\n|\r|\n/);
    if (trimLines) lines = lines.map(l => l.trim());
    if (removeEmpty) lines = lines.filter(l => l.length > 0);

    const copy = [...lines];

    switch (sortMode) {
      case 'alphaAsc':
        copy.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: caseSensitive ? 'variant' : 'base', numeric: true }));
        break;

      case 'alphaDesc':
        copy.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: caseSensitive ? 'variant' : 'base', numeric: true }));
        break;

      case 'numAsc':
        copy.sort((a, b) => {
          const numA = parseFloat(a.replace(/[^0-9.-]/g, '')) || 0;
          const numB = parseFloat(b.replace(/[^0-9.-]/g, '')) || 0;
          return numA - numB;
        });
        break;

      case 'numDesc':
        copy.sort((a, b) => {
          const numA = parseFloat(a.replace(/[^0-9.-]/g, '')) || 0;
          const numB = parseFloat(b.replace(/[^0-9.-]/g, '')) || 0;
          return numB - numA;
        });
        break;

      case 'lengthAsc':
        copy.sort((a, b) => a.length - b.length);
        break;

      case 'lengthDesc':
        copy.sort((a, b) => b.length - a.length);
        break;

      case 'shuffle':
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        break;
    }

    return copy.join('\n');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, sortMode, caseSensitive, trimLines, removeEmpty, shuffleSeed]);

  const lineCount = (sortedOutput ? sortedOutput.split('\n').length : 0);

  const faqs: FAQItem[] = [
    {
      question: 'Does this tool support natural alphanumeric sorting?',
      answer:
        'Yes! With natural sorting enabled in A-Z mode, "Item 2" is correctly sorted before "Item 10" instead of standard alphabetical sorting where "10" precedes "2".',
    },
    {
      question: 'Can I randomly shuffle lines?',
      answer:
        'Yes! Select "Random Shuffle" to run a Fisher-Yates randomization algorithm across your list.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Sort Lines Utility
          </h2>
          <p>
            Alphabetize glossaries, sort numerical spreadsheets, order lines by character length, or shuffle items randomly. The VEYLO Sort Lines utility provides natural language sorting with instant browser-based execution.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔤 Natural Alphabetical</h3>
              <p className="text-[11px]">Intelligently sorts numeric suffixes (e.g. Chapter 2 before Chapter 10).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔢 Numeric Ordering</h3>
              <p className="text-[11px]">Sort raw numbers and currency amounts in ascending or descending order.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎲 Random Shuffle</h3>
              <p className="text-[11px]">Cryptographically randomize list sequences for giveaways and randomizers.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Sort Controls Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Choose Sorting Order
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setText(SAMPLE_DATA)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Sample Data
              </button>
              <ResetButton onClick={() => setText('')} label="Clear" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { id: 'alphaAsc', label: '🔤 A → Z' },
              { id: 'alphaDesc', label: '🔠 Z → A' },
              { id: 'numAsc', label: '🔢 1 → 9' },
              { id: 'numDesc', label: '🔢 9 → 1' },
              { id: 'lengthAsc', label: '📏 Short → Long' },
              { id: 'lengthDesc', label: '📏 Long → Short' },
              { id: 'shuffle', label: '🎲 Shuffle' },
            ].map(btn => (
              <button
                key={btn.id}
                type="button"
                onClick={() => {
                  setSortMode(btn.id as SortMode);
                  if (btn.id === 'shuffle') setShuffleSeed(prev => prev + 1);
                }}
                className={`p-3 rounded-xl font-bold text-xs transition-all shadow-2xs ${
                  sortMode === btn.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: sortMode === btn.id ? 'var(--accent)' : 'var(--surface-2)',
                  color: sortMode === btn.id ? '#ffffff' : 'var(--text)',
                  border: '1px solid var(--border-c)',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Options Row */}
          <div className="flex items-center gap-4 flex-wrap text-xs font-semibold pt-2" style={{ borderTop: '1px solid var(--border-c)' }}>
            <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Case Sensitive</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={trimLines}
                onChange={(e) => setTrimLines(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Trim Whitespace</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={removeEmpty}
                onChange={(e) => setRemoveEmpty(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Remove Empty Lines</span>
            </label>
          </div>
        </div>

        {/* Input & Output Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <label htmlFor="sort-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Unsorted Input Lines
            </label>
            <textarea
              id="sort-input"
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste lines to sort here..."
              className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                border: '1px solid var(--border-c)',
              }}
            />
          </div>

          <div
            className="p-6 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="sort-output" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Sorted Output ({lineCount} lines)
              </label>
              <CopyButton textToCopy={sortedOutput} size="sm" label="Copy Sorted" />
            </div>

            <textarea
              id="sort-output"
              rows={10}
              readOnly
              value={sortedOutput}
              placeholder="Sorted lines will appear here..."
              className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none resize-y"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                border: '1px solid var(--border-c)',
              }}
            />
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
