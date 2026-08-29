'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_ORIGINAL = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const SAMPLE_MODIFIED = `function calculateTotal(items, taxRate = 0.08) {
  // Use modern reduce with tax calculation
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * taxRate;
  return subtotal + tax;
}`;

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  originalLineNum?: number;
  modifiedLineNum?: number;
  text: string;
}

// Longest Common Subsequence Diff Engine
function computeLineDiff(original: string, modified: string, ignoreWhitespace: boolean): DiffLine[] {
  const origLines = original.split('\n');
  const modLines = modified.split('\n');

  const normalize = (l: string) => (ignoreWhitespace ? l.trim() : l);

  const n = origLines.length;
  const m = modLines.length;

  // DP table for LCS
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (normalize(origLines[i - 1]) === normalize(modLines[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const result: DiffLine[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normalize(origLines[i - 1]) === normalize(modLines[j - 1])) {
      result.unshift({
        type: 'unchanged',
        originalLineNum: i,
        modifiedLineNum: j,
        text: modLines[j - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: 'added',
        modifiedLineNum: j,
        text: modLines[j - 1],
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({
        type: 'removed',
        originalLineNum: i,
        text: origLines[i - 1],
      });
      i--;
    }
  }

  return result;
}

export default function DiffCheckerPage() {
  const tool = useMemo(() => getToolBySlug('tools/diff-checker')!, []);

  const [originalText, setOriginalText] = useState<string>(SAMPLE_ORIGINAL);
  const [modifiedText, setModifiedText] = useState<string>(SAMPLE_MODIFIED);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [viewFormat, setViewFormat] = useState<'split' | 'unified'>('split');

  const diffResult = useMemo(() => {
    return computeLineDiff(originalText, modifiedText, ignoreWhitespace);
  }, [originalText, modifiedText, ignoreWhitespace]);

  const stats = useMemo(() => {
    const added = diffResult.filter((d) => d.type === 'added').length;
    const removed = diffResult.filter((d) => d.type === 'removed').length;
    const unchanged = diffResult.filter((d) => d.type === 'unchanged').length;
    const total = diffResult.length;
    const similarity = total > 0 ? Math.round((unchanged / total) * 100) : 100;

    return { added, removed, unchanged, similarity };
  }, [diffResult]);

  const unifiedDiffString = useMemo(() => {
    return diffResult
      .map((d) => {
        const prefix = d.type === 'added' ? '+ ' : d.type === 'removed' ? '- ' : '  ';
        return `${prefix}${d.text}`;
      })
      .join('\n');
  }, [diffResult]);

  const handleReset = () => {
    setOriginalText('');
    setModifiedText('');
  };

  const faqs: FAQItem[] = [
    {
      question: 'How is text comparison calculated?',
      answer:
        'Comparison is calculated using the Longest Common Subsequence (LCS) algorithm, identifying identical lines while categorizing insertions (+) and deletions (-) without altering file structure.',
    },
    {
      question: 'What is the difference between Split and Unified diff views?',
      answer:
        '• Split View: Displays original and modified text side-by-side in synchronized columns.\n• Unified View: Combines both versions into a single continuous stream with `+` and `-` line indicators (similar to git diff).',
    },
    {
      question: 'Is my confidential code or text uploaded anywhere?',
      answer:
        'No. Diff computation occurs 100% locally in your browser memory thread. No code snippets or documents are ever uploaded to any server.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Real-Time Text &amp; Code Difference Comparator
          </h2>
          <p>
            Compare two versions of code, configuration files, or documents side-by-side to highlight line additions, removals, and modifications in real time.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚖️ Side-by-Side &amp; Unified</h3>
              <p className="text-[11px]">Toggle between synchronized dual-column and git-style unified diff layouts.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📊 Similarity Analytics</h3>
              <p className="text-[11px]">Live statistics tracking added (+), removed (-), and % document similarity.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔒 Complete Privacy</h3>
              <p className="text-[11px]">Diff algorithm runs entirely in client-side JavaScript memory.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Diff Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>+ Added Lines</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--green, #10b981)' }}>{stats.added}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ef4444' }}>- Removed Lines</span>
            <span className="text-2xl font-black font-mono" style={{ color: '#ef4444' }}>{stats.removed}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Unchanged Lines</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.unchanged}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Similarity</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--accent)' }}>{stats.similarity}%</span>
          </div>
        </div>

        {/* Input Text Boxes */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Original Text A */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="orig-text" className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ef4444' }}>
                Original Text (Version A)
              </label>
              <button
                type="button"
                onClick={() => setOriginalText(SAMPLE_ORIGINAL)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Sample A
              </button>
            </div>

            <textarea
              id="orig-text"
              rows={8}
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste original text or code here..."
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />
          </div>

          {/* Modified Text B */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="mod-text" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                Modified Text (Version B)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModifiedText(SAMPLE_MODIFIED)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  Sample B
                </button>
                <ResetButton onClick={handleReset} label="Clear All" />
              </div>
            </div>

            <textarea
              id="mod-text"
              rows={8}
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              placeholder="Paste updated/modified text or code here..."
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />
          </div>
        </div>

        {/* Diff Result View Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewFormat('split')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewFormat === 'split' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
                }`}
                style={{
                  background: viewFormat === 'split' ? 'var(--accent)' : 'var(--surface-2)',
                  color: viewFormat === 'split' ? '#fff' : 'var(--text)',
                  border: viewFormat === 'split' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                ◫ Side-by-Side View
              </button>
              <button
                type="button"
                onClick={() => setViewFormat('unified')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewFormat === 'unified' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
                }`}
                style={{
                  background: viewFormat === 'unified' ? 'var(--accent)' : 'var(--surface-2)',
                  color: viewFormat === 'unified' ? '#fff' : 'var(--text)',
                  border: viewFormat === 'unified' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                ☰ Unified Diff View
              </button>
            </div>

            {/* Options */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="rounded text-[var(--accent)] cursor-pointer"
                />
                <span>Ignore Whitespace</span>
              </label>

              <CopyButton textToCopy={unifiedDiffString} size="sm" label="Copy Diff" />
            </div>
          </div>

          {/* Diff Renderer */}
          <div
            className="w-full overflow-x-auto rounded-xl font-mono text-xs leading-relaxed border border-[var(--border-c)]"
            style={{ background: 'var(--surface-2)' }}
          >
            {viewFormat === 'unified' ? (
              <div className="divide-y divide-[var(--border-c)]">
                {diffResult.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center px-4 py-1 select-text"
                    style={{
                      backgroundColor:
                        item.type === 'added'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : item.type === 'removed'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'transparent',
                    }}
                  >
                    <span className="w-12 text-[10px] text-[var(--muted)] select-none">
                      {item.type === 'removed' ? item.originalLineNum : item.type === 'added' ? item.modifiedLineNum : item.modifiedLineNum}
                    </span>
                    <span className="w-6 font-bold select-none" style={{ color: item.type === 'added' ? 'var(--green, #10b981)' : item.type === 'removed' ? '#ef4444' : 'var(--muted)' }}>
                      {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
                    </span>
                    <span className="whitespace-pre flex-1" style={{ color: 'var(--text)' }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-c)]">
                {diffResult.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-2 divide-x divide-[var(--border-c)]"
                  >
                    {/* Left (Original) */}
                    <div
                      className="flex items-center px-3 py-1 select-text overflow-hidden"
                      style={{
                        backgroundColor: item.type === 'removed' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                      }}
                    >
                      <span className="w-8 text-[10px] text-[var(--muted)] select-none shrink-0">{item.originalLineNum || ''}</span>
                      <span className="whitespace-pre truncate" style={{ color: item.type === 'removed' ? '#ef4444' : 'var(--text)' }}>
                        {item.type !== 'added' ? item.text : ''}
                      </span>
                    </div>

                    {/* Right (Modified) */}
                    <div
                      className="flex items-center px-3 py-1 select-text overflow-hidden"
                      style={{
                        backgroundColor: item.type === 'added' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      }}
                    >
                      <span className="w-8 text-[10px] text-[var(--muted)] select-none shrink-0">{item.modifiedLineNum || ''}</span>
                      <span className="whitespace-pre truncate" style={{ color: item.type === 'added' ? 'var(--green, #10b981)' : 'var(--text)' }}>
                        {item.type !== 'removed' ? item.text : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
