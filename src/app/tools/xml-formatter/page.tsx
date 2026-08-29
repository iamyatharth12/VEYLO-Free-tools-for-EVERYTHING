'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
    <description>A former architect battles corporate zombies.</description>
  </book>
</catalog>`;

function formatXml(xmlString: string, indentSize: number | 'tab'): { formatted: string; minified: string; error: string | null } {
  if (!xmlString.trim()) {
    return { formatted: '', minified: '', error: null };
  }

  // Use DOMParser to validate well-formedness
  if (typeof window !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return {
        formatted: '',
        minified: '',
        error: parserError.textContent || 'XML syntax error: Document is not well-formed XML.',
      };
    }
  }

  // Format with indentation
  const indentChar = indentSize === 'tab' ? '\t' : ' '.repeat(indentSize);
  let formatted = '';
  let pad = 0;

  // Normalize XML string
  const cleanXml = xmlString
    .replace(/(>)(<)(\/*)/g, '$1\r\n$2$3')
    .replace(/\r\n/g, '\n')
    .replace(/\n\s*\n/g, '\n');

  const lines = cleanXml.split('\n');

  lines.forEach((node) => {
    let indent = 0;
    const trimmed = node.trim();
    if (!trimmed) return;

    if (trimmed.match(/.+<\/\w[^>]*>$/)) {
      // <tag>content</tag> -> same level
      indent = 0;
    } else if (trimmed.match(/^<\/\w/)) {
      // </tag> -> decrease indent
      if (pad !== 0) pad -= 1;
    } else if (trimmed.match(/^<\w[^>]*[^\/]>.*$/)) {
      // <tag> -> increase indent
      indent = 1;
    } else {
      indent = 0;
    }

    formatted += indentChar.repeat(pad) + trimmed + '\n';
    pad += indent;
  });

  // Minify
  const minified = xmlString
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return { formatted: formatted.trim(), minified, error: null };
}

export default function XmlFormatterPage() {
  const tool = useMemo(() => getToolBySlug('tools/xml-formatter')!, []);

  const [inputXml, setInputXml] = useState<string>(SAMPLE_XML);
  const [indentSize, setIndentSize] = useState<number | 'tab'>(2);
  const [viewMode, setViewMode] = useState<'formatted' | 'minified'>('formatted');

  const { formatted, minified, error } = useMemo(() => {
    return formatXml(inputXml, indentSize);
  }, [inputXml, indentSize]);

  const activeOutput = viewMode === 'formatted' ? formatted : minified;

  const handleDownload = () => {
    if (!activeOutput) return;
    const blob = new Blob([activeOutput], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veylo-formatted-${Date.now()}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInputXml('');
  };

  const faqs: FAQItem[] = [
    {
      question: 'How does the XML validator detect syntax errors?',
      answer:
        'The validator uses your browser’s native `DOMParser` (`parseFromString(xml, "text/xml")`). If the document has unclosed tags, unquoted attributes, or mismatched hierarchies, the parser generates a `<parsererror>` node with line details.',
    },
    {
      question: 'What is the difference between well-formed XML and valid XML?',
      answer:
        '• Well-formed XML adheres to fundamental XML syntax rules (closed tags, single root element, case-sensitive tags).\n• Valid XML must also conform strictly to a predefined schema definition (DTD or XSD). This tool checks well-formedness client-side.',
    },
    {
      question: 'Are XML entities like &amp; preserved during formatting?',
      answer:
        'Yes. Standard XML character references (`&amp;`, `&lt;`, `&gt;`, `&apos;`, `&quot;`) and CDATA sections (`<![CDATA[...]]>`) are completely preserved.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Client-Side XML Formatter, Beautifier &amp; Syntax Validator
          </h2>
          <p>
            Format XML documents with custom tag indentation, validate structural well-formedness, minify payloads for API transfer, and download cleaned XML files.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📐 Custom Indentation</h3>
              <p className="text-[11px]">Format with 2 spaces, 4 spaces, or Tab characters.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🛡️ DOMParser Validation</h3>
              <p className="text-[11px]">Real-time detection of unclosed tags and invalid hierarchy.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>💾 Instant File Export</h3>
              <p className="text-[11px]">Download formatted XML directly as a .xml file with zero server uploads.</p>
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
          {/* View Mode Pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('formatted')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'formatted' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: viewMode === 'formatted' ? 'var(--accent)' : 'var(--surface-2)',
                color: viewMode === 'formatted' ? '#fff' : 'var(--text)',
                border: viewMode === 'formatted' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              📄 Beautified XML
            </button>
            <button
              type="button"
              onClick={() => setViewMode('minified')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'minified' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: viewMode === 'minified' ? 'var(--accent)' : 'var(--surface-2)',
                color: viewMode === 'minified' ? '#fff' : 'var(--text)',
                border: viewMode === 'minified' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              ⚡ Minified XML
            </button>
          </div>

          {/* Indent Selector */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span style={{ color: 'var(--muted)' }}>Indent:</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(e.target.value === 'tab' ? 'tab' : Number(e.target.value))}
              className="p-2 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value="tab">Tab</option>
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
              <label htmlFor="xml-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Input XML Document
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInputXml(SAMPLE_XML)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  Sample XML
                </button>
                <ResetButton onClick={handleReset} label="Clear" />
              </div>
            </div>

            <textarea
              id="xml-input"
              rows={12}
              value={inputXml}
              onChange={(e) => setInputXml(e.target.value)}
              placeholder="Paste raw or unformatted XML here..."
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />

            <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
              <span>Size: {inputXml.length} bytes</span>
              <span>Lines: {inputXml ? inputXml.split('\n').length : 0}</span>
            </div>
          </div>

          {/* Output Box */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                  {viewMode === 'formatted' ? 'Formatted XML' : 'Minified XML'}
                </span>
                {!error && activeOutput && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                    Well-Formed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!activeOutput || !!error}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] disabled:opacity-40 cursor-pointer"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  Download .xml
                </button>
                <CopyButton textToCopy={activeOutput} size="sm" />
              </div>
            </div>

            {error ? (
              <div className="w-full h-80 p-4 rounded-xl text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 overflow-auto">
                <strong className="block mb-2">❌ XML Parse Error:</strong>
                <pre className="whitespace-pre-wrap font-mono">{error}</pre>
              </div>
            ) : (
              <textarea
                readOnly
                rows={12}
                value={activeOutput}
                placeholder="Formatted XML will appear here in real time..."
                className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none resize-y select-all whitespace-pre"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            )}

            <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
              <span>Size: {activeOutput.length} bytes</span>
              <span>Lines: {activeOutput ? activeOutput.split('\n').length : 0}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
