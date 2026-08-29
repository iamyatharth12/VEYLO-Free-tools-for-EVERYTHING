'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_TEXT = `<div class="card" id="user_123">
  <h1>"Hello & Welcome!"</h1>
  <p>Price: $10.00 & Discount >= 20%</p>
  <span>Copyright © 2026 VEYLO™ — All Rights Reserved.</span>
</div>`;

const COMMON_ENTITIES = [
  { char: '<', name: '&lt;', dec: '&#60;', desc: 'Less than' },
  { char: '>', name: '&gt;', dec: '&#62;', desc: 'Greater than' },
  { char: '&', name: '&amp;', dec: '&#38;', desc: 'Ampersand' },
  { char: '"', name: '&quot;', dec: '&#34;', desc: 'Double quote' },
  { char: "'", name: '&#39;', dec: '&#39;', desc: 'Single quote' },
  { char: '©', name: '&copy;', dec: '&#169;', desc: 'Copyright symbol' },
  { char: '®', name: '&reg;', dec: '&#174;', desc: 'Registered trademark' },
  { char: '™', name: '&trade;', dec: '&#8482;', desc: 'Trademark' },
  { char: '—', name: '&mdash;', dec: '&#8212;', desc: 'Em dash' },
  { char: '€', name: '&euro;', dec: '&#8364;', desc: 'Euro symbol' },
  { char: '£', name: '&pound;', dec: '&#163;', desc: 'Pound symbol' },
  { char: '¥', name: '&yen;', dec: '&#165;', desc: 'Yen symbol' },
  { char: '•', name: '&bull;', dec: '&#8226;', desc: 'Bullet point' },
  { char: '→', name: '&rarr;', dec: '&#8594;', desc: 'Right arrow' },
];

function encodeHtmlEntities(str: string, type: 'named' | 'decimal' | 'hex', onlyEssential: boolean): string {
  if (onlyEssential) {
    return str.replace(/[&<>"']/g, (c) => {
      if (type === 'decimal') return `&#${c.charCodeAt(0)};`;
      if (type === 'hex') return `&#x${c.charCodeAt(0).toString(16).toUpperCase()};`;
      switch (c) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return c;
      }
    });
  }

  // Full Encode
  return str.split('').map((char) => {
    const code = char.charCodeAt(0);
    if (code >= 32 && code <= 126 && !/[&<>"']/.test(char)) {
      return char;
    }
    if (type === 'decimal') return `&#${code};`;
    if (type === 'hex') return `&#x${code.toString(16).toUpperCase()};`;
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      case '©': return '&copy;';
      case '®': return '&reg;';
      case '™': return '&trade;';
      case '—': return '&mdash;';
      case '€': return '&euro;';
      case '£': return '&pound;';
      case '¥': return '&yen;';
      case '•': return '&bull;';
      case '→': return '&rarr;';
      default: return `&#${code};`;
    }
  }).join('');
}

function decodeHtmlEntities(str: string): string {
  // Safe client-side entity translation using standard DOMParser
  if (typeof window === 'undefined') return str;
  try {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || str;
  } catch {
    return str;
  }
}

export default function HtmlEntitiesPage() {
  const tool = useMemo(() => getToolBySlug('tools/html-entities')!, []);

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<'named' | 'decimal' | 'hex'>('named');
  const [onlyEssential, setOnlyEssential] = useState<boolean>(true);
  const [inputVal, setInputVal] = useState<string>(SAMPLE_TEXT);

  const outputVal = useMemo(() => {
    if (!inputVal) return '';
    if (mode === 'encode') {
      return encodeHtmlEntities(inputVal, encodeType, onlyEssential);
    } else {
      return decodeHtmlEntities(inputVal);
    }
  }, [inputVal, mode, encodeType, onlyEssential]);

  const handleSwap = () => {
    if (outputVal) {
      setInputVal(outputVal);
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
      question: 'Why do we need to escape HTML entities?',
      answer:
        'Characters like `<` and `>` define HTML tag boundaries, and `&` defines entity beginnings. If untrusted user input contains these characters without escaping, browsers will misinterpret them as executable HTML tags, leading to Cross-Site Scripting (XSS) vulnerabilities.',
    },
    {
      question: 'What is the difference between Named and Decimal entities?',
      answer:
        '• Named entities (e.g. `&copy;`, `&lt;`) are human-readable keywords.\n• Decimal entities (e.g. `&#169;`, `&#60;`) use the base-10 Unicode code point.\n• Hexadecimal entities (e.g. `&#xA9;`, `&#x3C;`) use the base-16 hexadecimal Unicode value.',
    },
    {
      question: 'Are single quotes escaped as &apos; or &#39;?',
      answer:
        'While `&apos;` was standardized in XML and HTML5, older versions of Internet Explorer only supported `&#39;`. For universal legacy compatibility, `&#39;` remains the widely recommended standard.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            HTML Entity Encoder, Decoder &amp; Special Character Escape Tool
          </h2>
          <p>
            Convert reserved HTML characters into safe named, decimal, or hexadecimal HTML entities to prevent rendering glitches and sanitize text for web markup.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🛡️ XSS Prevention</h3>
              <p className="text-[11px]">Escape &lt;, &gt;, &amp;, &quot;, and &#39; so they render as plain text in browsers.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🏷️ Named, Dec &amp; Hex</h3>
              <p className="text-[11px]">Choose between &amp;name;, &amp;#123;, and &amp;#x7B; entity representations.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ Instant Bidirectional Sync</h3>
              <p className="text-[11px]">Encode plain text or decode entity-escaped HTML in real time.</p>
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
          {/* Mode Switch */}
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
              🔒 Encode Entities
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
              🔓 Decode Entities
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

          {/* Options */}
          {mode === 'encode' && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span style={{ color: 'var(--muted)' }}>Format:</span>
                <select
                  value={encodeType}
                  onChange={(e) => setEncodeType(e.target.value as 'named' | 'decimal' | 'hex')}
                  className="p-1.5 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                >
                  <option value="named">Named (&amp;lt;)</option>
                  <option value="decimal">Decimal (&amp;#60;)</option>
                  <option value="hex">Hex (&amp;#x3C;)</option>
                </select>
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={onlyEssential}
                  onChange={(e) => setOnlyEssential(e.target.checked)}
                  className="rounded text-[var(--accent)] cursor-pointer"
                />
                <span>Only Essential (&lt;, &gt;, &amp;, &quot;, &apos;)</span>
              </label>
            </div>
          )}
        </div>

        {/* Input & Output Workspace */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="html-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                {mode === 'encode' ? 'Plain Text to Escape / Encode' : 'HTML with Entities to Decode'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInputVal(SAMPLE_TEXT)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  Sample
                </button>
                <ResetButton onClick={handleReset} label="Clear" />
              </div>
            </div>

            <textarea
              id="html-input"
              rows={8}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Paste HTML or plain text here..."
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
                {mode === 'encode' ? 'Escaped HTML Output' : 'Decoded Plain Text'}
              </span>
              <CopyButton textToCopy={outputVal} size="sm" />
            </div>

            <textarea
              readOnly
              rows={8}
              value={outputVal}
              placeholder="Converted output will appear here in real time..."
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none resize-y select-all"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />

            <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
              Length: {outputVal.length} characters
            </span>
          </div>
        </div>

        {/* Common Entities Quick Reference Table */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
            Common HTML Entity Cheat Sheet
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {COMMON_ENTITIES.map((ent) => (
              <div
                key={ent.char}
                onClick={() => setInputVal((prev) => prev + ent.char)}
                className="p-3 rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-all hover:scale-102 shadow-2xs text-center"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
                title="Click to append character"
              >
                <span className="text-xl font-bold font-mono" style={{ color: 'var(--accent)' }}>{ent.char}</span>
                <span className="text-[11px] font-mono font-bold" style={{ color: 'var(--text)' }}>{ent.name}</span>
                <span className="text-[9px] font-mono text-[var(--muted)]">{ent.dec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
