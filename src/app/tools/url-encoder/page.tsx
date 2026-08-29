'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_RAW = 'https://example.com/search?q=hello world & special=🚀+test/100%';

export default function UrlEncoderPage() {
  const tool = useMemo(() => getToolBySlug('tools/url-encoder')!, []);

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [componentMode, setComponentMode] = useState<boolean>(true); // true = encodeURIComponent / false = encodeURI
  const [inputVal, setInputVal] = useState<string>(SAMPLE_RAW);

  const result = useMemo(() => {
    if (!inputVal) return { output: '', error: null };

    try {
      if (mode === 'encode') {
        const output = componentMode ? encodeURIComponent(inputVal) : encodeURI(inputVal);
        return { output, error: null };
      } else {
        const output = componentMode ? decodeURIComponent(inputVal) : decodeURI(inputVal);
        return { output, error: null };
      }
    } catch (err) {
      return { output: '', error: `URI Malformed Error: ${(err as Error).message}` };
    }
  }, [inputVal, mode, componentMode]);

  const handleSwap = () => {
    if (result.output && !result.error) {
      setInputVal(result.output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    } else {
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  const handleReset = () => {
    setInputVal('');
  };

  const faqs: FAQItem[] = [
    {
      question: 'What is the difference between encodeURI and encodeURIComponent?',
      answer:
        '• encodeURIComponent: Encodes all special characters including `:`, `/`, `?`, `&`, and `#`. This is necessary when passing values inside query string parameters (e.g. `?redirect=...`).\n• encodeURI: Preserves reserved protocol/structure characters (`http://`, `/path?q=1`) and only encodes invalid URL characters like spaces or emojis.',
    },
    {
      question: 'What is percent-encoding?',
      answer:
        'Percent-encoding is a mechanism for encoding characters in a Uniform Resource Identifier (URI) by replacing unallowed or reserved characters with a `%` followed by their hexadecimal ASCII/UTF-8 byte value (e.g. Space becomes `%20`).',
    },
    {
      question: 'Are spaces encoded as + or %20?',
      answer:
        'Standard RFC 3986 percent-encoding uses `%20` for spaces in URLs. The `+` symbol is historically used in `application/x-www-form-urlencoded` query strings.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Real-Time URL Percent Encoding &amp; Decoding Utility
          </h2>
          <p>
            Safely format web URLs, encode query parameters, and decode percent-encoded strings with complete Unicode and emoji support.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔗 Component vs Full URL</h3>
              <p className="text-[11px]">Toggle between encodeURIComponent (query strings) and encodeURI (full addresses).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🌍 UTF-8 Unicode Support</h3>
              <p className="text-[11px]">Seamlessly encodes international characters, accents, and emojis into valid URI bytes.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ 1-Click Swap &amp; Copy</h3>
              <p className="text-[11px]">Instantly reverse operation flow or copy encoded outputs to clipboard.</p>
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
          {/* Mode Selector */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('encode')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'encode' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: mode === 'encode' ? 'var(--accent)' : 'var(--surface-2)',
                color: mode === 'encode' ? '#fff' : 'var(--text)',
                border: mode === 'encode' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              🔒 Encode Mode
            </button>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'decode' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: mode === 'decode' ? 'var(--accent)' : 'var(--surface-2)',
                color: mode === 'decode' ? '#fff' : 'var(--text)',
                border: mode === 'decode' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              🔓 Decode Mode
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

          {/* Component Toggle */}
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
            <input
              type="checkbox"
              checked={componentMode}
              onChange={(e) => setComponentMode(e.target.checked)}
              className="rounded text-[var(--accent)] cursor-pointer"
            />
            <span>Strict Component Mode ({componentMode ? 'encodeURIComponent' : 'encodeURI'})</span>
          </label>
        </div>

        {/* Input & Output Workspace */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="url-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                {mode === 'encode' ? 'Input Text / URL to Encode' : 'Input Percent-Encoded String to Decode'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInputVal(SAMPLE_RAW)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  Sample
                </button>
                <ResetButton onClick={handleReset} label="Clear" />
              </div>
            </div>

            <textarea
              id="url-input"
              rows={8}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={mode === 'encode' ? 'Type or paste plain text or URL to encode...' : 'Paste %20 encoded string to decode...'}
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />

            <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
              Length: {inputVal.length} characters
            </span>
          </div>

          {/* Output Box */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                {mode === 'encode' ? 'Percent-Encoded Output' : 'Decoded Plain Output'}
              </span>
              <CopyButton textToCopy={result.output} size="sm" />
            </div>

            {result.error ? (
              <div className="w-full h-48 p-4 rounded-xl text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20">
                {result.error}
              </div>
            ) : (
              <textarea
                readOnly
                rows={8}
                value={result.output}
                placeholder="Encoded or decoded output will appear here in real time..."
                className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none resize-y select-all"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            )}

            <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
              Length: {result.output.length} characters
            </span>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
