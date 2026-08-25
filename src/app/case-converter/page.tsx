'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

export default function CaseConverterPage() {
  const tool = useMemo(() => getToolBySlug('case-converter')!, []);

  const [text, setText] = useState<string>('Transform your text case instantly with VEYLO developer utilities.');

  // Conversion functions
  const toUpper = () => setText(prev => prev.toUpperCase());
  const toLower = () => setText(prev => prev.toLowerCase());

  const toSentence = () => {
    setText(prev => {
      return prev.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    });
  };

  const toTitle = () => {
    const minorWords = new Set(['and', 'as', 'but', 'for', 'if', 'nor', 'or', 'so', 'yet', 'a', 'an', 'the', 'at', 'by', 'for', 'in', 'of', 'off', 'on', 'per', 'to', 'up', 'via']);
    setText(prev => {
      return prev.toLowerCase().split(/\s+/).map((word, idx) => {
        if (idx === 0 || !minorWords.has(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      }).join(' ');
    });
  };

  const toCamel = () => {
    setText(prev => {
      return prev
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, c => c.toLowerCase());
    });
  };

  const toPascal = () => {
    setText(prev => {
      return prev
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[a-z]/, c => c.toUpperCase());
    });
  };

  const toSnake = () => {
    setText(prev => {
      return prev
        .trim()
        .toLowerCase()
        .replace(/[\s\-_]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    });
  };

  const toKebab = () => {
    setText(prev => {
      return prev
        .trim()
        .toLowerCase()
        .replace(/[\s\-_]+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    });
  };

  const toConstant = () => {
    setText(prev => {
      return prev
        .trim()
        .toUpperCase()
        .replace(/[\s\-_]+/g, '_')
        .replace(/[^A-Z0-9_]/g, '');
    });
  };

  const toAlternating = () => {
    setText(prev => {
      let isUpper = false;
      return prev.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
          isUpper = !isUpper;
          return isUpper ? char.toUpperCase() : char.toLowerCase();
        }
        return char;
      }).join('');
    });
  };

  const words = (text.trim().match(/\b\w+\b/g) || []).length;
  const chars = text.length;

  const faqs: FAQItem[] = [
    {
      question: 'What is the difference between camelCase and PascalCase?',
      answer:
        'camelCase starts with a lowercase letter (e.g. `myVariableName`), whereas PascalCase capitalizes the initial letter as well (e.g. `MyClassName`).',
    },
    {
      question: 'How does Title Case capitalization work?',
      answer:
        'VEYLO Title Case capitalizes all primary nouns, verbs, and adjectives while keeping minor conjunctions and prepositions (a, an, the, and, of, to) lowercase according to standard editorial guidelines.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Text Case Converter
          </h2>
          <p>
            Whether coding variable identifiers, formatting headline titles for blog articles, or standardizing spreadsheet data, the VEYLO Case Converter transforms text strings between standard writing formats and programming conventions instantly.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>💻 Developer Formats</h3>
              <p className="text-[11px]">Convert variables into camelCase, PascalCase, snake_case, or CONSTANT_CASE.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📰 Editorial Title Case</h3>
              <p className="text-[11px]">Format headlines with smart conjunction and preposition lowercase rules.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔤 Clean Sentence Case</h3>
              <p className="text-[11px]">Capitalize the first letter of each sentence and normalize accidental all-caps.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Transformation Button Grid */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Select Transformation Style
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
              {words} words · {chars} chars
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <button
              type="button"
              onClick={toUpper}
              className="p-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              UPPERCASE
            </button>

            <button
              type="button"
              onClick={toLower}
              className="p-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              lowercase
            </button>

            <button
              type="button"
              onClick={toTitle}
              className="p-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              Title Case
            </button>

            <button
              type="button"
              onClick={toSentence}
              className="p-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              Sentence case
            </button>

            <button
              type="button"
              onClick={toCamel}
              className="p-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              camelCase
            </button>

            <button
              type="button"
              onClick={toPascal}
              className="p-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              PascalCase
            </button>

            <button
              type="button"
              onClick={toSnake}
              className="p-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              snake_case
            </button>

            <button
              type="button"
              onClick={toKebab}
              className="p-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              kebab-case
            </button>

            <button
              type="button"
              onClick={toConstant}
              className="p-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              CONSTANT_CASE
            </button>

            <button
              type="button"
              onClick={toAlternating}
              className="p-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              aLtErNaTiNg
            </button>
          </div>
        </div>

        {/* Text Area Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <label htmlFor="case-textarea" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Text Editor &amp; Output
            </label>

            <div className="flex items-center gap-2">
              <CopyButton textToCopy={text} size="sm" label="Copy Result" />
              <ResetButton onClick={() => setText('')} label="Clear" />
            </div>
          </div>

          <textarea
            id="case-textarea"
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text and click any case format button above..."
            className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: '1px solid var(--border-c)',
            }}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
