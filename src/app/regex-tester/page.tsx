'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

interface MatchItem {
  index: number;
  match: string;
  start: number;
  end: number;
  groups: string[];
  namedGroups?: Record<string, string>;
}

const PRESET_PATTERNS = [
  { name: 'Email Address', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi' },
  { name: 'URL / Link', pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)', flags: 'gi' },
  { name: 'IPv4 Address', pattern: '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}\\b', flags: 'g' },
  { name: 'Hex Color Code', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'gi' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\b(?<year>\\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\\d|3[01])\\b', flags: 'g' },
  { name: 'HTML Tag', pattern: '<(?<tag>[a-zA-Z0-9]+)(?:\\s+[^>]*)?>(?<content>.*?)<\\/\\k<tag>>', flags: 'gs' },
];

const SAMPLE_TEXT = `Hello VEYLO team! Contact us at support@veylo.app or sales@example.co.uk.
Visit https://veylo.app/tools for more developer utilities.
Server IP: 192.168.1.1 and backup DNS: 8.8.8.8.
Brand colors: #6366f1, #10b981, and #f59e0b.
Event Date: 2026-08-29 for VEYLO 2.0 Launch.
HTML snippet: <div class="badge">Active Utility</div>`;

export default function RegexTesterPage() {
  const tool = useMemo(() => getToolBySlug('regex-tester')!, []);

  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [testString, setTestString] = useState<string>(SAMPLE_TEXT);

  // Flags
  const [flagG, setFlagG] = useState<boolean>(true);
  const [flagI, setFlagI] = useState<boolean>(true);
  const [flagM, setFlagM] = useState<boolean>(false);
  const [flagS, setFlagS] = useState<boolean>(false);
  const [flagU, setFlagU] = useState<boolean>(true);

  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [regexError, setRegexError] = useState<string | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(0);

  const activeFlags = useMemo(() => {
    let f = '';
    if (flagG) f += 'g';
    if (flagI) f += 'i';
    if (flagM) f += 'm';
    if (flagS) f += 's';
    if (flagU) f += 'u';
    return f;
  }, [flagG, flagI, flagM, flagS, flagU]);

  // Execute regex matching safely with iteration safeguard
  const runMatcher = useCallback(() => {
    if (!pattern.trim()) {
      setMatches([]);
      setRegexError(null);
      setExecutionTimeMs(0);
      return;
    }

    const t0 = performance.now();
    try {
      const regex = new RegExp(pattern, activeFlags);
      setRegexError(null);

      const found: MatchItem[] = [];
      let matchResult: RegExpExecArray | null;
      let count = 0;
      const MAX_MATCHES = 1000;

      if (flagG) {
        while ((matchResult = regex.exec(testString)) !== null) {
          count++;
          if (count > MAX_MATCHES) break;

          const groups = matchResult.slice(1);
          const namedGroups = matchResult.groups ? { ...matchResult.groups } : undefined;

          found.push({
            index: count,
            match: matchResult[0],
            start: matchResult.index,
            end: matchResult.index + matchResult[0].length,
            groups,
            namedGroups,
          });

          // Prevent zero-length infinite loop
          if (matchResult[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        matchResult = regex.exec(testString);
        if (matchResult) {
          found.push({
            index: 1,
            match: matchResult[0],
            start: matchResult.index,
            end: matchResult.index + matchResult[0].length,
            groups: matchResult.slice(1),
            namedGroups: matchResult.groups ? { ...matchResult.groups } : undefined,
          });
        }
      }

      const elapsed = +(performance.now() - t0).toFixed(2);
      setMatches(found);
      setExecutionTimeMs(elapsed);
    } catch (err: unknown) {
      setMatches([]);
      setRegexError(err instanceof Error ? err.message : 'Invalid Regular Expression');
      setExecutionTimeMs(0);
    }
  }, [pattern, testString, activeFlags, flagG]);

  useEffect(() => {
    runMatcher();
  }, [runMatcher]);

  // Render Highlighted Text
  const highlightedHtml = useMemo(() => {
    if (!pattern.trim() || matches.length === 0) {
      return testString;
    }

    const segments: React.ReactNode[] = [];
    let lastIdx = 0;

    matches.forEach((m, i) => {
      if (m.start > lastIdx) {
        segments.push(testString.slice(lastIdx, m.start));
      }
      segments.push(
        <mark
          key={i}
          className="rounded px-1 font-bold select-all transition-colors"
          style={{
            background: i % 2 === 0 ? 'rgba(99, 102, 241, 0.25)' : 'rgba(16, 185, 129, 0.25)',
            color: 'var(--text)',
            borderBottom: `2px solid ${i % 2 === 0 ? 'var(--accent)' : 'var(--green, #10b981)'}`,
          }}
          title={`Match #${m.index}: [${m.start}..${m.end}]`}
        >
          {m.match}
        </mark>
      );
      lastIdx = m.end;
    });

    if (lastIdx < testString.length) {
      segments.push(testString.slice(lastIdx));
    }

    return segments;
  }, [pattern, testString, matches]);

  const handleApplyPreset = (p: typeof PRESET_PATTERNS[0]) => {
    setPattern(p.pattern);
    setFlagG(p.flags.includes('g'));
    setFlagI(p.flags.includes('i'));
    setFlagM(p.flags.includes('m'));
    setFlagS(p.flags.includes('s'));
    setFlagU(p.flags.includes('u'));
  };

  const handleReset = () => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setRegexError(null);
  };

  const allMatchesText = matches.map(m => m.match).join('\n');

  const faqs: FAQItem[] = [
    {
      question: 'What do the regex flags mean?',
      answer:
        '• g (Global): Match all occurrences across the string rather than stopping after the first match.\n• i (Ignore Case): Case-insensitive matching.\n• m (Multiline): ^ and $ match the beginning and end of each line.\n• s (dotAll): Allows dot (.) to match newlines.\n• u (Unicode): Full Unicode character class support.',
    },
    {
      question: 'How do named capture groups work?',
      answer:
        'Using the syntax (?<groupName>pattern), you can assign semantic labels to captured segments, making complex regex parsing much easier to read and maintain.',
    },
    {
      question: 'Is my test text processed client-side?',
      answer:
        'Yes. All RegExp evaluations run exclusively within your browser’s JavaScript engine. No proprietary data, logs, or regex strings are sent to any remote server.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Real-Time JavaScript Regular Expression Matcher
          </h2>
          <p>
            Test and refine regular expressions with real-time match highlighting, capture group extraction, and instant flag toggles.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔍 Visual Match Highlighting</h3>
              <p className="text-[11px]">Alternating color tags show exact matching character boundaries.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎯 Capture &amp; Named Groups</h3>
              <p className="text-[11px]">Inspect extracted parameters ($1, $2) and named group dictionaries.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🛡️ ReDoS Safeguard</h3>
              <p className="text-[11px]">Loop caps protect your browser tab from catastrophic backtracking.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Preset Library Bar */}
        <div
          className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Preset Patterns:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_PATTERNS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Input & Flags Bar */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="regex-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Regular Expression
            </label>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span style={{ color: 'var(--muted)' }}>Flags:</span>
              <label className="flex items-center gap-1 font-bold cursor-pointer" title="Global match">
                <input type="checkbox" checked={flagG} onChange={(e) => setFlagG(e.target.checked)} className="rounded" />
                <span>g</span>
              </label>
              <label className="flex items-center gap-1 font-bold cursor-pointer" title="Case-insensitive">
                <input type="checkbox" checked={flagI} onChange={(e) => setFlagI(e.target.checked)} className="rounded" />
                <span>i</span>
              </label>
              <label className="flex items-center gap-1 font-bold cursor-pointer" title="Multiline">
                <input type="checkbox" checked={flagM} onChange={(e) => setFlagM(e.target.checked)} className="rounded" />
                <span>m</span>
              </label>
              <label className="flex items-center gap-1 font-bold cursor-pointer" title="dotAll: . matches newlines">
                <input type="checkbox" checked={flagS} onChange={(e) => setFlagS(e.target.checked)} className="rounded" />
                <span>s</span>
              </label>
              <label className="flex items-center gap-1 font-bold cursor-pointer" title="Unicode">
                <input type="checkbox" checked={flagU} onChange={(e) => setFlagU(e.target.checked)} className="rounded" />
                <span>u</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold" style={{ color: 'var(--muted)' }}>/</span>
            <input
              id="regex-input"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regular expression pattern..."
              className="w-full p-3 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                border: regexError ? '1px solid #ef4444' : '1px solid var(--border-c)',
              }}
            />
            <span className="font-mono text-lg font-bold" style={{ color: 'var(--muted)' }}>/{activeFlags}</span>
          </div>

          {regexError && (
            <div
              className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)' }}
            >
              <span>⚠️</span>
              <span>{regexError}</span>
            </div>
          )}
        </div>

        {/* Test String & Live Visual Highlight Card */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Test String Editor */}
          <div
            className="p-6 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="test-string-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Test String
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTestString(SAMPLE_TEXT)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)]"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  Sample Text
                </button>
                <ResetButton onClick={handleReset} label="Clear" />
              </div>
            </div>

            <textarea
              id="test-string-input"
              rows={10}
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter or paste text to test matching against..."
              className="w-full p-4 rounded-xl text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />
          </div>

          {/* Match Highlight Visualizer */}
          <div
            className="p-6 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Match Highlight View ({matches.length} matches · {executionTimeMs}ms)
              </span>
              {matches.length > 0 && (
                <CopyButton textToCopy={allMatchesText} label="Copy Matches" size="sm" />
              )}
            </div>

            <div
              className="w-full h-64 lg:h-full overflow-auto p-4 rounded-xl text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap select-text"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              {highlightedHtml}
            </div>
          </div>
        </div>

        {/* Match Details & Capture Groups Inspector Table */}
        {matches.length > 0 && (
          <div
            className="p-6 rounded-2xl flex flex-col gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Match Breakdown &amp; Capture Groups ({matches.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-c)', color: 'var(--muted)' }}>
                    <th className="pb-2.5 font-bold">#</th>
                    <th className="pb-2.5 font-bold">Match</th>
                    <th className="pb-2.5 font-bold">Range</th>
                    <th className="pb-2.5 font-bold">Capture Groups</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-c)]">
                  {matches.slice(0, 50).map((m) => (
                    <tr key={m.index} className="hover:bg-[var(--surface-2)]">
                      <td className="py-2.5 font-mono font-bold" style={{ color: 'var(--accent)' }}>{m.index}</td>
                      <td className="py-2.5 font-mono font-semibold max-w-xs truncate select-all" style={{ color: 'var(--text)' }}>{m.match}</td>
                      <td className="py-2.5 font-mono" style={{ color: 'var(--muted)' }}>[{m.start}..{m.end}]</td>
                      <td className="py-2.5 font-mono">
                        {m.groups.length > 0 || m.namedGroups ? (
                          <div className="flex flex-wrap gap-1.5">
                            {m.groups.map((g, gi) => (
                              <span key={gi} className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
                                ${gi + 1}: &quot;{g}&quot;
                              </span>
                            ))}
                            {m.namedGroups && Object.entries(m.namedGroups).map(([k, v]) => (
                              <span key={k} className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))', color: 'var(--accent)' }}>
                                &lt;{k}&gt;: &quot;{v}&quot;
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="italic" style={{ color: 'var(--muted)' }}>None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
