'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_LIST = `apple\nbanana\norange\napple\nbanana\npear\ngrape\nOrange\npear\nwatermelon\napple`;

export default function RemoveDuplicateLinesPage() {
  const tool = useMemo(() => getToolBySlug('remove-duplicate-lines')!, []);

  const [text, setText] = useState<string>(SAMPLE_LIST);
  const [caseInsensitive, setCaseInsensitive] = useState<boolean>(true);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);
  const [sortAlphabetical, setSortAlphabetical] = useState<boolean>(false);

  const { output, totalLines, uniqueLines, removedCount } = useMemo(() => {
    if (!text) return { output: '', totalLines: 0, uniqueLines: 0, removedCount: 0 };

    const rawLines = text.split(/\r\n|\r|\n/);
    const totalLines = rawLines.length;

    const seen = new Set<string>();
    const result: string[] = [];

    rawLines.forEach(line => {
      let key = line;
      if (trimWhitespace) key = key.trim();
      if (removeEmptyLines && key.length === 0) return;
      if (caseInsensitive) key = key.toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);
        result.push(trimWhitespace ? line.trim() : line);
      }
    });

    if (sortAlphabetical) {
      result.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: caseInsensitive ? 'base' : 'variant' }));
    }

    const uniqueLines = result.length;
    const removedCount = totalLines - uniqueLines;

    return {
      output: result.join('\n'),
      totalLines,
      uniqueLines,
      removedCount,
    };
  }, [text, caseInsensitive, trimWhitespace, removeEmptyLines, sortAlphabetical]);

  const faqs: FAQItem[] = [
    {
      question: 'Will line order be preserved?',
      answer:
        'Yes! By default, the first occurrence of each unique item is kept in its exact original sequence unless you enable the "Sort Alphabetically" option.',
    },
    {
      question: 'How does Case-Insensitive deduplication work?',
      answer:
        'When enabled, "Apple" and "apple" are treated as the exact same line, preventing capitalization variances from creating duplicate list entries.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Duplicate Line Remover
          </h2>
          <p>
            Clean messy email databases, CSV lists, code arrays, and keywords. The VEYLO Duplicate Line Remover strips redundant rows, removes empty lines, and normalizes spacing entirely client-side.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🧹 Instant Deduplication</h3>
              <p className="text-[11px]">Remove repeated entries while preserving the original list sequence.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔤 Case-Insensitive Matching</h3>
              <p className="text-[11px]">Match &lsquo;Banana&rsquo; and &lsquo;banana&rsquo; to eliminate capitalization duplicates.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>✂️ Whitespace Trimming</h3>
              <p className="text-[11px]">Strip leading and trailing spaces before comparing line contents.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Total Lines</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--text)' }}>{totalLines}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Unique Lines</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--green, #10b981)' }}>{uniqueLines}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Duplicates Removed</span>
            <span className="text-3xl font-black font-mono" style={{ color: removedCount > 0 ? 'var(--red, #ef4444)' : 'var(--muted)' }}>
              {removedCount}
            </span>
          </div>
        </div>

        {/* Options Toggles */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-4 flex-wrap text-xs font-semibold">
            <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={caseInsensitive}
                onChange={(e) => setCaseInsensitive(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Case Insensitive</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={trimWhitespace}
                onChange={(e) => setTrimWhitespace(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Trim Whitespace</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={removeEmptyLines}
                onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Remove Empty Lines</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={sortAlphabetical}
                onChange={(e) => setSortAlphabetical(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Sort Alphabetically</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setText(SAMPLE_LIST)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              Sample
            </button>
            <ResetButton onClick={() => setText('')} label="Clear" />
          </div>
        </div>

        {/* Input & Deduplicated Output Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <label htmlFor="dup-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Original Input List
            </label>
            <textarea
              id="dup-input"
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw list with duplicate lines here..."
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
              <label htmlFor="dup-output" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                Clean Deduplicated List ({uniqueLines})
              </label>
              <CopyButton textToCopy={output} size="sm" label="Copy Unique Lines" />
            </div>

            <textarea
              id="dup-output"
              rows={10}
              readOnly
              value={output}
              placeholder="Unique lines will appear here..."
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
