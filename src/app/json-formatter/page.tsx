'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_JSON = `{
  "platform": "VEYLO",
  "version": 2.0,
  "description": "Free tools for EVERYTHING",
  "isClientSide": true,
  "features": [
    "Hardware diagnostics",
    "Developer utilities",
    "Converters",
    "Generators"
  ],
  "stats": {
    "totalTools": 27,
    "activeUsers": 125000,
    "latencyMs": 0.4
  },
  "privacy": {
    "zeroLogs": true,
    "tracking": null
  }
}`;

// Recursive JSON Tree Node Component
function JsonTreeNode({ keyName, value, depth = 0 }: { keyName?: string; value: unknown; depth?: number }): React.ReactElement | null {
  const [collapsed, setCollapsed] = useState<boolean>(depth > 2);

  if (value === null) {
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        {keyName && <span className="font-bold" style={{ color: 'var(--accent)' }}>&quot;{keyName}&quot;: </span>}
        <span className="italic" style={{ color: 'var(--muted)' }}>null</span>
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        {keyName && <span className="font-bold" style={{ color: 'var(--accent)' }}>&quot;{keyName}&quot;: </span>}
        <span className="font-bold" style={{ color: '#f59e0b' }}>{String(value)}</span>
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        {keyName && <span className="font-bold" style={{ color: 'var(--accent)' }}>&quot;{keyName}&quot;: </span>}
        <span className="font-bold" style={{ color: 'var(--green, #10b981)' }}>{value}</span>
      </div>
    );
  }

  if (typeof value === 'string') {
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        {keyName && <span className="font-bold" style={{ color: 'var(--accent)' }}>&quot;{keyName}&quot;: </span>}
        <span style={{ color: '#ec4899' }}>&quot;{value}&quot;</span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer inline-flex items-center gap-1 font-bold hover:underline"
        >
          <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{collapsed ? '▶' : '▼'}</span>
          {keyName && <span style={{ color: 'var(--accent)' }}>&quot;{keyName}&quot;: </span>}
          <span style={{ color: 'var(--text)' }}>Array({value.length})</span>
        </div>

        {!collapsed && (
          <div>
            {value.map((item, idx) => (
              <JsonTreeNode key={idx} keyName={String(idx)} value={item} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>);
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer inline-flex items-center gap-1 font-bold hover:underline"
        >
          <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{collapsed ? '▶' : '▼'}</span>
          {keyName && <span style={{ color: 'var(--accent)' }}>&quot;{keyName}&quot;: </span>}
          <span style={{ color: 'var(--text)' }}>Object &#123;{keys.length}&#125;</span>
        </div>

        {!collapsed && (
          <div>
            {keys.map((k) => (
              <JsonTreeNode key={k} keyName={k} value={(value as Record<string, unknown>)[k]} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
      {keyName && <span className="font-bold" style={{ color: 'var(--accent)' }}>&quot;{keyName}&quot;: </span>}
      <span style={{ color: 'var(--text)' }}>{String(value)}</span>
    </div>
  );
}

export default function JsonFormatterPage() {
  const tool = useMemo(() => getToolBySlug('json-formatter')!, []);

  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON);
  const [indentSize, setIndentSize] = useState<number | 'tab'>(2);
  const [viewMode, setViewMode] = useState<'formatted' | 'tree' | 'minified'>('formatted');

  const [parsedData, setParsedData] = useState<Record<string, unknown> | unknown[] | string | number | boolean | null>(null);
  const [formattedOutput, setFormattedOutput] = useState<string>('');
  const [minifiedOutput, setMinifiedOutput] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<{ message: string; line?: number; column?: number } | null>(null);

  // Validate & process JSON
  const processJson = useCallback(() => {
    const raw = inputJson.trim();
    if (!raw) {
      setParsedData(null);
      setFormattedOutput('');
      setMinifiedOutput('');
      setErrorDetails(null);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setParsedData(parsed);
      setErrorDetails(null);

      const indent = indentSize === 'tab' ? '\t' : indentSize;
      const formatted = JSON.stringify(parsed, null, indent);
      const minified = JSON.stringify(parsed);

      setFormattedOutput(formatted);
      setMinifiedOutput(minified);
    } catch (err: unknown) {
      setParsedData(null);
      setFormattedOutput('');
      setMinifiedOutput('');

      let message = 'Invalid JSON syntax.';
      let line: number | undefined;
      let column: number | undefined;

      if (err instanceof Error) {
        message = err.message;
        // Parse V8 error position format "at position 123" or "line 2 column 5"
        const posMatch = message.match(/position\s+(\d+)/i);
        if (posMatch && posMatch[1]) {
          const charPos = parseInt(posMatch[1], 10);
          const lines = inputJson.slice(0, charPos).split('\n');
          line = lines.length;
          column = lines[lines.length - 1].length + 1;
        }
      }

      setErrorDetails({ message, line, column });
    }
  }, [inputJson, indentSize]);

  useEffect(() => {
    processJson();
  }, [processJson]);

  const handleDownload = () => {
    const textToDownload = viewMode === 'minified' ? minifiedOutput : formattedOutput;
    if (!textToDownload) return;

    const blob = new Blob([textToDownload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veylo-formatted-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInputJson('');
    setParsedData(null);
    setFormattedOutput('');
    setMinifiedOutput('');
    setErrorDetails(null);
  };

  const stats = useMemo(() => {
    const rawLength = inputJson.length;
    const minLength = minifiedOutput.length;
    const savedBytes = rawLength > minLength ? rawLength - minLength : 0;
    const compressionPct = rawLength > 0 ? Math.round((savedBytes / rawLength) * 100) : 0;

    return { rawLength, minLength, savedBytes, compressionPct };
  }, [inputJson, minifiedOutput]);

  const faqs: FAQItem[] = [
    {
      question: 'How does the JSON Validator pinpoint syntax errors?',
      answer:
        'The parser calculates character offsets against line breaks to extract exact line and column coordinates where syntax rules (such as missing quotes, trailing commas, or unescaped characters) were violated.',
    },
    {
      question: 'Does this tool support large JSON files?',
      answer:
        'Yes. All parsing executes natively in your browser runtime. The tree view uses lazy state toggling to prevent DOM rendering overhead on deeply nested arrays or objects.',
    },
    {
      question: 'Is my data transmitted or stored anywhere?',
      answer:
        'No. VEYLO works 100% client-side inside your browser tab. Your API payloads, secrets, and database dumps remain completely local.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Client-Side JSON Formatter, Minifier &amp; Tree Inspector
          </h2>
          <p>
            Parse, validate, beautify, and inspect complex JSON payloads with instant error diagnostics and zero network requests.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>✨ Beautify &amp; Minify</h3>
              <p className="text-[11px]">Toggle between 2-space, 4-space, tab indentation, and production minification.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🌲 Interactive Tree View</h3>
              <p className="text-[11px]">Navigate and collapse nested objects and arrays in a structured visual explorer.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🚨 Syntax Error Pointers</h3>
              <p className="text-[11px]">Detect exact line and column numbers for missing commas and syntax typos.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="json-input-area" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Input JSON
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInputJson(SAMPLE_JSON)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Sample JSON
              </button>
              <ResetButton onClick={handleReset} label="Clear" />
            </div>
          </div>

          <textarea
            id="json-input-area"
            rows={16}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste raw or messy JSON data here..."
            className="w-full p-4 rounded-xl text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: errorDetails ? '1px solid #ef4444' : '1px solid var(--border-c)',
            }}
          />

          {errorDetails && (
            <div
              className="p-3.5 rounded-xl text-xs font-semibold flex flex-col gap-1"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)' }}
            >
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span className="font-bold">Invalid JSON:</span>
                {errorDetails.line && (
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px]" style={{ background: '#ef4444', color: '#fff' }}>
                    Line {errorDetails.line}, Col {errorDetails.column}
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-90">{errorDetails.message}</p>
            </div>
          )}
        </div>

        {/* Output Presentation Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <button
                type="button"
                onClick={() => setViewMode('formatted')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'formatted' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: viewMode === 'formatted' ? 'var(--surface)' : 'transparent',
                  color: viewMode === 'formatted' ? 'var(--accent)' : 'var(--text)',
                }}
              >
                Formatted
              </button>

              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'tree' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: viewMode === 'tree' ? 'var(--surface)' : 'transparent',
                  color: viewMode === 'tree' ? 'var(--accent)' : 'var(--text)',
                }}
              >
                🌲 Tree View
              </button>

              <button
                type="button"
                onClick={() => setViewMode('minified')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'minified' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: viewMode === 'minified' ? 'var(--surface)' : 'transparent',
                  color: viewMode === 'minified' ? 'var(--accent)' : 'var(--text)',
                }}
              >
                Minified
              </button>
            </div>

            {/* Indent Selector (for formatted view) */}
            {viewMode === 'formatted' && (
              <div className="flex items-center gap-2">
                <label htmlFor="indent-select" className="text-[11px] font-semibold" style={{ color: 'var(--muted)' }}>
                  Indent:
                </label>
                <select
                  id="indent-select"
                  value={indentSize}
                  onChange={(e) => setIndentSize(e.target.value === 'tab' ? 'tab' : Number(e.target.value))}
                  className="p-1 rounded-lg text-xs font-semibold focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                >
                  <option value={2}>2 Spaces</option>
                  <option value={4}>4 Spaces</option>
                  <option value="tab">Tab</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!parsedData}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] disabled:opacity-40"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Download .json
              </button>
              <CopyButton
                textToCopy={viewMode === 'minified' ? minifiedOutput : formattedOutput}
                size="sm"
                label="Copy"
              />
            </div>
          </div>

          {/* View Container */}
          <div
            className="w-full h-80 lg:h-[400px] overflow-auto p-4 rounded-xl font-mono text-xs leading-relaxed"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
          >
            {parsedData !== null ? (
              <>
                {viewMode === 'formatted' && (
                  <pre className="text-xs font-mono select-all whitespace-pre" style={{ color: 'var(--text)' }}>
                    {formattedOutput}
                  </pre>
                )}

                {viewMode === 'minified' && (
                  <div className="text-xs font-mono select-all break-all" style={{ color: 'var(--text)' }}>
                    {minifiedOutput}
                  </div>
                )}

                {viewMode === 'tree' && (
                  <div className="select-text">
                    <JsonTreeNode value={parsedData} />
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-semibold" style={{ color: 'var(--muted)' }}>
                {errorDetails ? 'Fix JSON syntax errors to view output.' : 'Enter JSON on the left to format.'}
              </div>
            )}
          </div>

          {/* Stats Bar */}
          {parsedData && (
            <div className="flex items-center justify-between text-xs pt-1 font-semibold" style={{ color: 'var(--muted)' }}>
              <span>Formatted Size: <strong style={{ color: 'var(--text)' }}>{formattedOutput.length} bytes</strong></span>
              <span>Minified Size: <strong style={{ color: 'var(--text)' }}>{stats.minLength} bytes</strong></span>
              {stats.compressionPct > 0 && (
                <span style={{ color: 'var(--green, #10b981)' }}>Saved {stats.compressionPct}%</span>
              )}
            </div>
          )}
        </div>
      </div>
    </ToolPageShell>
  );
}
