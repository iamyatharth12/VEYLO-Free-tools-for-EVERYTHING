'use client';

import { useState, useMemo } from 'react';
import { dump, load } from 'js-yaml';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_JSON = `{
  "server": {
    "host": "127.0.0.1",
    "port": 8080,
    "ssl": true
  },
  "database": {
    "driver": "postgres",
    "poolSize": 20
  },
  "features": [
    "rateLimiting",
    "gzipCompression",
    "cors"
  ]
}`;

const SAMPLE_YAML = `server:
  host: 127.0.0.1
  port: 8080
  ssl: true
database:
  driver: postgres
  poolSize: 20
features:
  - rateLimiting
  - gzipCompression
  - cors`;

export default function JsonYamlPage() {
  const tool = useMemo(() => getToolBySlug('tools/json-yaml')!, []);

  const [direction, setDirection] = useState<'json2yaml' | 'yaml2json'>('json2yaml');
  const [inputText, setInputText] = useState<string>(SAMPLE_JSON);
  const [indentSize, setIndentSize] = useState<number>(2);

  const { outputText, error } = useMemo(() => {
    const raw = inputText.trim();
    if (!raw) return { outputText: '', error: null };

    try {
      if (direction === 'json2yaml') {
        const parsed = JSON.parse(raw);
        const yml = dump(parsed, { indent: indentSize, noRefs: true });
        return { outputText: yml, error: null };
      } else {
        const parsed = load(raw);
        const json = JSON.stringify(parsed, null, indentSize);
        return { outputText: json, error: null };
      }
    } catch (err) {
      return { outputText: '', error: `Syntax Error: ${(err as Error).message}` };
    }
  }, [inputText, direction, indentSize]);

  const handleSwap = () => {
    if (outputText && !error) {
      setInputText(outputText);
      setDirection(direction === 'json2yaml' ? 'yaml2json' : 'json2yaml');
    } else {
      setDirection(direction === 'json2yaml' ? 'yaml2json' : 'json2yaml');
      setInputText(direction === 'json2yaml' ? SAMPLE_YAML : SAMPLE_JSON);
    }
  };

  const handleDownload = () => {
    if (!outputText || error) return;
    const isYaml = direction === 'json2yaml';
    const ext = isYaml ? 'yaml' : 'json';
    const mime = isYaml ? 'text/yaml' : 'application/json';

    const blob = new Blob([outputText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInputText('');
  };

  const faqs: FAQItem[] = [
    {
      question: 'What are the main differences between JSON and YAML?',
      answer:
        '• JSON (JavaScript Object Notation): Strict syntax requiring curly braces `{}`, brackets `[]`, and double-quoted keys. Optimized for fast machine parsing.\n• YAML (YAML Ain\'t Markup Language): Human-friendly superset using indentation-based hierarchy without mandatory quotes, commonly used for Docker, Kubernetes, and CI/CD pipelines.',
    },
    {
      question: 'Is YAML parsing safe from arbitrary code execution?',
      answer:
        'Yes. We use standard safe schema evaluation (`DEFAULT_SCHEMA`) which does not parse arbitrary function tags or custom executable objects.',
    },
    {
      question: 'Can comments in YAML be converted to JSON?',
      answer:
        'JSON specifications (RFC 8259) do not support comments. When converting YAML to JSON, comments are automatically omitted.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Bidirectional JSON to YAML &amp; YAML to JSON Converter
          </h2>
          <p>
            Convert Kubernetes manifests, Docker Compose files, OpenAPI specifications, and application configurations between JSON and YAML syntax with real-time error detection.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔄 1-Click Bidirectional Swap</h3>
              <p className="text-[11px]">Seamlessly switch between JSON ➔ YAML and YAML ➔ JSON workflows.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🛡️ Safe Schema Parsing</h3>
              <p className="text-[11px]">Strict schema loading protects against arbitrary YAML code vulnerabilities.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>💾 Download &amp; Copy</h3>
              <p className="text-[11px]">Export formatted results directly as .yaml or .json files instantly.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Controls Bar */}
        <div
          className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Direction Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setDirection('json2yaml'); setInputText(SAMPLE_JSON); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                direction === 'json2yaml' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: direction === 'json2yaml' ? 'var(--accent)' : 'var(--surface-2)',
                color: direction === 'json2yaml' ? '#fff' : 'var(--text)',
                border: direction === 'json2yaml' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              JSON ➔ YAML
            </button>
            <button
              type="button"
              onClick={() => { setDirection('yaml2json'); setInputText(SAMPLE_YAML); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                direction === 'yaml2json' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: direction === 'yaml2json' ? 'var(--accent)' : 'var(--surface-2)',
                color: direction === 'yaml2json' ? '#fff' : 'var(--text)',
                border: direction === 'yaml2json' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              YAML ➔ JSON
            </button>
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-xl text-xs font-bold transition-all hover:border-[var(--accent)] cursor-pointer"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              title="Swap Input and Output"
            >
              ⇄ Swap
            </button>
          </div>

          {/* Indent Selector */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span style={{ color: 'var(--muted)' }}>Indent:</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="p-2 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>
        </div>

        {/* Input & Output Workspace */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label htmlFor="json-yaml-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                {direction === 'json2yaml' ? 'Input JSON' : 'Input YAML'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInputText(direction === 'json2yaml' ? SAMPLE_JSON : SAMPLE_YAML)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  Sample Data
                </button>
                <ResetButton onClick={handleReset} label="Clear" />
              </div>
            </div>

            <textarea
              id="json-yaml-input"
              rows={14}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={direction === 'json2yaml' ? 'Paste valid JSON here...' : 'Paste valid YAML here...'}
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />

            <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
              Size: {inputText.length} bytes · {inputText ? inputText.split('\n').length : 0} lines
            </span>
          </div>

          {/* Output Box */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                {direction === 'json2yaml' ? 'Converted YAML Output' : 'Converted JSON Output'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!outputText || !!error}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] disabled:opacity-40 cursor-pointer"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  Download .{direction === 'json2yaml' ? 'yaml' : 'json'}
                </button>
                <CopyButton textToCopy={outputText} size="sm" />
              </div>
            </div>

            {error ? (
              <div className="w-full h-80 p-4 rounded-xl text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 overflow-auto">
                <strong className="block mb-2">❌ Conversion Error:</strong>
                <pre className="whitespace-pre-wrap font-mono">{error}</pre>
              </div>
            ) : (
              <textarea
                readOnly
                rows={14}
                value={outputText}
                placeholder="Converted output will appear here in real time..."
                className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none resize-y select-all whitespace-pre"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            )}

            <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
              Size: {outputText.length} bytes · {outputText ? outputText.split('\n').length : 0} lines
            </span>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
