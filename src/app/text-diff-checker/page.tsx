'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_ORIGINAL = `// VEYLO Utilities Configuration
const brand = "VEYLO";
const tagline = "Free tools for EVERYTHING.";
const version = 1.0;

function getTools() {
  return [
    "Word Counter",
    "Character Counter",
    "Case Converter",
  ];
}`;

const SAMPLE_MODIFIED = `// VEYLO Utilities Configuration
const brand = "VEYLO Platform";
const tagline = "Free tools for EVERYTHING.";
const version = 2.0;

function getTools() {
  return [
    "Word Counter",
    "Character Counter",
    "Case Converter",
    "Text Diff Checker",
  ];
}`;

type DiffType = 'added' | 'removed' | 'unchanged';

interface DiffLine {
  type: DiffType;
  text: string;
  originalLineNum?: number;
  modifiedLineNum?: number;
}

export default function TextDiffCheckerPage() {
  const tool = useMemo(() => getToolBySlug('text-diff-checker')!, []);

  const [originalText, setOriginalText] = useState<string>(SAMPLE_ORIGINAL);
  const [modifiedText, setModifiedText] = useState<string>(SAMPLE_MODIFIED);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);

  // Compute standard LCS diff
  const { diffLines, addedCount, removedCount, unchangedCount } = useMemo(() => {
    let origLines = originalText.split(/\r\n|\r|\n/);
    let modLines = modifiedText.split(/\r\n|\r|\n/);

    if (ignoreWhitespace) {
      origLines = origLines.map(l => l.trim());
      modLines = modLines.map(l => l.trim());
    }

    const n = origLines.length;
    const m = modLines.length;

    // LCS dynamic programming table
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (origLines[i - 1] === modLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to build diff
    let i = n;
    let j = m;
    const diff: DiffLine[] = [];
    let added = 0;
    let removed = 0;
    let unchanged = 0;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
        diff.unshift({
          type: 'unchanged',
          text: origLines[i - 1],
          originalLineNum: i,
          modifiedLineNum: j,
        });
        unchanged++;
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        diff.unshift({
          type: 'added',
          text: modLines[j - 1],
          modifiedLineNum: j,
        });
        added++;
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        diff.unshift({
          type: 'removed',
          text: origLines[i - 1],
          originalLineNum: i,
        });
        removed++;
        i--;
      }
    }

    return {
      diffLines: diff,
      addedCount: added,
      removedCount: removed,
      unchangedCount: unchanged,
    };
  }, [originalText, modifiedText, ignoreWhitespace]);

  const swapTexts = () => {
    setOriginalText(modifiedText);
    setModifiedText(originalText);
  };

  const handleReset = () => {
    setOriginalText('');
    setModifiedText('');
  };

  const diffSummaryString = diffLines
    .map(d => `${d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '} ${d.text}`)
    .join('\n');

  const faqs: FAQItem[] = [
    {
      question: 'How does the visual diff algorithm work?',
      answer:
        'It computes the Longest Common Subsequence (LCS) to track deletions in red (-) and additions in green (+), allowing you to review code refactors and document edits.',
    },
    {
      question: 'Is my confidential code sent to any server?',
      answer:
        'No! The entire comparison algorithm runs locally inside your browser memory. No text or code is ever transmitted.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Text Diff Checker
          </h2>
          <p>
            Review code changes, verify contract revisions, or compare markdown articles. The VEYLO Text Diff Checker offers both side-by-side and unified git-style visual diff views with instant client-side computation.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚖️ Side-by-Side &amp; Unified</h3>
              <p className="text-[11px]">Switch seamlessly between split column comparison and unified git-style patch views.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🟩 Additions &amp; 🟥 Deletions</h3>
              <p className="text-[11px]">Clear color-coded line markers with precise line number alignments.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔒 100% Client-Side Privacy</h3>
              <p className="text-[11px]">Safe for confidential intellectual property, API keys, and sensitive legal text.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Added Lines</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--green, #10b981)' }}>+{addedCount}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Removed Lines</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--red, #ef4444)' }}>-{removedCount}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Unchanged Lines</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--text)' }}>{unchangedCount}</span>
          </div>
        </div>

        {/* Input Text Areas */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Original Text */}
          <div
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="diff-orig" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Original Text (Before)
              </label>
              <button
                type="button"
                onClick={() => setOriginalText(SAMPLE_ORIGINAL)}
                className="text-[11px] font-semibold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Sample
              </button>
            </div>
            <textarea
              id="diff-orig"
              rows={7}
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste original text here..."
              className="w-full p-3 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                border: '1px solid var(--border-c)',
              }}
            />
          </div>

          {/* Modified Text */}
          <div
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="diff-mod" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Modified Text (After)
              </label>
              <button
                type="button"
                onClick={() => setModifiedText(SAMPLE_MODIFIED)}
                className="text-[11px] font-semibold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Sample
              </button>
            </div>
            <textarea
              id="diff-mod"
              rows={7}
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              placeholder="Paste modified text here..."
              className="w-full p-3 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                border: '1px solid var(--border-c)',
              }}
            />
          </div>
        </div>

        {/* View Options & Diff Toolbar */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'split' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: viewMode === 'split' ? 'var(--accent)' : 'var(--surface-2)',
                  color: viewMode === 'split' ? '#ffffff' : 'var(--text)',
                  border: '1px solid var(--border-c)',
                }}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('unified')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'unified' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: viewMode === 'unified' ? 'var(--accent)' : 'var(--surface-2)',
                  color: viewMode === 'unified' ? '#ffffff' : 'var(--text)',
                  border: '1px solid var(--border-c)',
                }}
              >
                Unified View
              </button>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Ignore Whitespace</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={swapTexts}
              className="text-xs font-bold px-3 py-1.5 rounded-xl hover:border-[var(--accent)] transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              🔄 Swap
            </button>
            <CopyButton textToCopy={diffSummaryString} size="sm" label="Copy Diff Patch" />
            <ResetButton onClick={handleReset} label="Clear" />
          </div>
        </div>

        {/* Visual Diff Display Container */}
        <div
          className="p-4 sm:p-6 rounded-2xl flex flex-col gap-2 overflow-x-auto shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-c)]">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Comparison Result ({diffLines.length} lines total)
            </span>
          </div>

          <div className="font-mono text-xs flex flex-col gap-0.5 pt-2">
            {diffLines.map((line, idx) => {
              let bg = 'transparent';
              let color = 'var(--text)';
              let marker = ' ';

              if (line.type === 'added') {
                bg = 'rgba(16, 185, 129, 0.12)';
                color = 'var(--green, #10b981)';
                marker = '+';
              } else if (line.type === 'removed') {
                bg = 'rgba(239, 68, 68, 0.12)';
                color = 'var(--red, #ef4444)';
                marker = '-';
              } else {
                color = 'var(--muted)';
              }

              return (
                <div
                  key={idx}
                  className="px-3 py-1 rounded-md flex items-start gap-3 select-text"
                  style={{ background: bg, color }}
                >
                  <span className="w-4 text-center font-bold flex-shrink-0 select-none opacity-80">
                    {marker}
                  </span>
                  <span className="w-8 text-right font-mono text-[11px] opacity-40 select-none flex-shrink-0">
                    {line.type === 'removed' ? line.originalLineNum : line.modifiedLineNum || ''}
                  </span>
                  <span className="whitespace-pre-wrap break-all leading-relaxed">
                    {line.text || ' '}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
