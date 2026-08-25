'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_MESSY_TEXT = `   <p>Here  is   some    very <b>messy</b>  text! ! !   🚀   </p>\n\n\n\t\tThis   line has     awkward   tabs  and spaces.\n\n\n<div>Another    HTML   container  with trailing spaces   </div>   \n\n`;

export default function TextCleanerPage() {
  const tool = useMemo(() => getToolBySlug('text-cleaner')!, []);

  const [text, setText] = useState<string>(SAMPLE_MESSY_TEXT);

  // Cleaning options
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState<boolean>(true);
  const [removeBlankLines, setRemoveBlankLines] = useState<boolean>(true);
  const [normalizeLineBreaks, setNormalizeLineBreaks] = useState<boolean>(true);
  const [stripHtml, setStripHtml] = useState<boolean>(true);
  const [stripEmojis, setStripEmojis] = useState<boolean>(false);
  const [stripNonAscii, setStripNonAscii] = useState<boolean>(false);
  const [removeExtraPunctuation, setRemoveExtraPunctuation] = useState<boolean>(false);

  const cleanedText = useMemo(() => {
    if (!text) return '';

    let res = text;

    // 1. Normalize line breaks
    if (normalizeLineBreaks) {
      res = res.replace(/\r\n|\r/g, '\n');
    }

    // 2. Strip HTML tags
    if (stripHtml) {
      res = res.replace(/<[^>]*>/g, '');
    }

    // 3. Strip Emojis
    if (stripEmojis) {
      res = res.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
    }

    // 4. Strip Non-ASCII
    if (stripNonAscii) {
      res = res.replace(/[^\x00-\x7F]/g, '');
    }

    // 5. Remove extra punctuation
    if (removeExtraPunctuation) {
      res = res.replace(/([!?,.:;])\1+/g, '$1');
    }

    // Process line by line
    let lines = res.split('\n');

    // 6. Collapse multiple horizontal spaces per line
    if (removeExtraSpaces) {
      lines = lines.map(l => l.replace(/[ \t]+/g, ' '));
    }

    // 7. Trim line ends
    if (trimWhitespace) {
      lines = lines.map(l => l.trim());
    }

    // 8. Remove blank lines
    if (removeBlankLines) {
      lines = lines.filter(l => l.length > 0);
    }

    res = lines.join('\n');

    // Final outer trim
    if (trimWhitespace) {
      res = res.trim();
    }

    return res;
  }, [
    text,
    trimWhitespace,
    removeExtraSpaces,
    removeBlankLines,
    normalizeLineBreaks,
    stripHtml,
    stripEmojis,
    stripNonAscii,
    removeExtraPunctuation,
  ]);

  const originalChars = text.length;
  const cleanedChars = cleanedText.length;
  const bytesSaved = Math.max(0, originalChars - cleanedChars);

  const faqs: FAQItem[] = [
    {
      question: 'What is the difference between Trimming and Collapsing spaces?',
      answer:
        'Trimming removes extra whitespace from the extreme start and end of each line, while Collapsing spaces converts multiple consecutive middle spaces ("hello     world") into a single clean space ("hello world").',
    },
    {
      question: 'Does this strip hidden carriage returns (CRLF)?',
      answer:
        'Yes! The "Normalize Line Breaks" option standardizes legacy Windows CRLF (\\r\\n) into clean modern Unix LF (\\n) line breaks.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Text Cleaner &amp; Sanitizer
          </h2>
          <p>
            Scraped web content, copy-pasted PDF documents, and messy spreadsheets often contain erratic spacing, rogue HTML tags, and unwanted line breaks. The VEYLO Text Cleaner strips out formatting noise in one click.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>✂️ Whitespace Sanitation</h3>
              <p className="text-[11px]">Collapse multiple spaces and trim leading/trailing line margins.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🏷️ HTML / Tag Stripper</h3>
              <p className="text-[11px]">Remove rich-text formatting tags (&lt;div&gt;, &lt;p&gt;, &lt;b&gt;) to yield raw plaintext.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🧹 Blank Line Remover</h3>
              <p className="text-[11px]">Eliminate empty gaps to create compact paragraphs ready for publishing.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Cleaning Options Dashboard */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Active Cleaning Filters
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setText(SAMPLE_MESSY_TEXT)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Sample Text
              </button>
              <ResetButton onClick={() => setText('')} label="Clear" />
            </div>
          </div>

          {/* Filter Toggles Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-semibold">
            <label className="p-3 rounded-xl flex items-center gap-2.5 cursor-pointer shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={trimWhitespace}
                onChange={(e) => setTrimWhitespace(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Trim Whitespace</span>
            </label>

            <label className="p-3 rounded-xl flex items-center gap-2.5 cursor-pointer shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={removeExtraSpaces}
                onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Collapse Extra Spaces</span>
            </label>

            <label className="p-3 rounded-xl flex items-center gap-2.5 cursor-pointer shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={removeBlankLines}
                onChange={(e) => setRemoveBlankLines(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Remove Blank Lines</span>
            </label>

            <label className="p-3 rounded-xl flex items-center gap-2.5 cursor-pointer shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={stripHtml}
                onChange={(e) => setStripHtml(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Strip HTML Tags</span>
            </label>

            <label className="p-3 rounded-xl flex items-center gap-2.5 cursor-pointer shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={normalizeLineBreaks}
                onChange={(e) => setNormalizeLineBreaks(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Normalize Line Breaks</span>
            </label>

            <label className="p-3 rounded-xl flex items-center gap-2.5 cursor-pointer shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={stripEmojis}
                onChange={(e) => setStripEmojis(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Strip Emojis</span>
            </label>

            <label className="p-3 rounded-xl flex items-center gap-2.5 cursor-pointer shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={stripNonAscii}
                onChange={(e) => setStripNonAscii(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Strip Non-ASCII Chars</span>
            </label>

            <label className="p-3 rounded-xl flex items-center gap-2.5 cursor-pointer shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={removeExtraPunctuation}
                onChange={(e) => setRemoveExtraPunctuation(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Remove Extra Punctuation</span>
            </label>
          </div>
        </div>

        {/* Side by Side Input & Output Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="raw-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Raw Messy Input
              </label>
              <span className="text-[11px] font-mono opacity-60">{originalChars} chars</span>
            </div>

            <textarea
              id="raw-input"
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste text to clean here..."
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
              <div className="flex items-center gap-2">
                <label htmlFor="cleaned-output" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                  Cleaned Output
                </label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
                  Saved {bytesSaved} chars
                </span>
              </div>
              <CopyButton textToCopy={cleanedText} size="sm" label="Copy Cleaned" />
            </div>

            <textarea
              id="cleaned-output"
              rows={10}
              readOnly
              value={cleanedText}
              placeholder="Cleaned text will appear here..."
              className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none resize-y font-mono"
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
