'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_TEXT = 'free tools for everything with veylo developer platform';

export default function TextCaseConverterPage() {
  const tool = useMemo(() => getToolBySlug('text-case-converter')!, []);

  const [text, setText] = useState<string>(SAMPLE_TEXT);

  // Conversion calculations
  const conversions = useMemo(() => {
    if (!text.trim()) {
      return {
        uppercase: '',
        lowercase: '',
        titleCase: '',
        sentenceCase: '',
        camelCase: '',
        pascalCase: '',
        snakeCase: '',
        kebabCase: '',
        constantCase: '',
        dotCase: '',
        alternatingCase: '',
      };
    }

    const uppercase = text.toUpperCase();
    const lowercase = text.toLowerCase();

    // Title Case (smart conjunction and preposition handling)
    const minorWords = new Set(['and', 'as', 'but', 'for', 'if', 'nor', 'or', 'so', 'yet', 'a', 'an', 'the', 'at', 'by', 'for', 'in', 'of', 'off', 'on', 'per', 'to', 'up', 'via']);
    const titleCase = text.toLowerCase().split(/(\s+)/).map((word, idx) => {
      if (idx === 0 || !minorWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    }).join('');

    // Sentence case
    const sentenceCase = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());

    // Programming cases
    const wordsClean = text.trim().split(/[^a-zA-Z0-9]+/);

    const camelCase = wordsClean.map((w, i) => {
      const lower = w.toLowerCase();
      return i === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join('');

    const pascalCase = wordsClean.map(w => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join('');

    const snakeCase = wordsClean.map(w => w.toLowerCase()).join('_');
    const kebabCase = wordsClean.map(w => w.toLowerCase()).join('-');
    const constantCase = wordsClean.map(w => w.toUpperCase()).join('_');
    const dotCase = wordsClean.map(w => w.toLowerCase()).join('.');

    // Alternating
    let upperToggle = false;
    const alternatingCase = text.split('').map(char => {
      if (/[a-zA-Z]/.test(char)) {
        upperToggle = !upperToggle;
        return upperToggle ? char.toUpperCase() : char.toLowerCase();
      }
      return char;
    }).join('');

    return {
      uppercase,
      lowercase,
      titleCase,
      sentenceCase,
      camelCase,
      pascalCase,
      snakeCase,
      kebabCase,
      constantCase,
      dotCase,
      alternatingCase,
    };
  }, [text]);

  const wordCount = (text.trim().match(/\b\w+\b/g) || []).length;
  const charCount = text.length;

  const faqs: FAQItem[] = [
    {
      question: 'When should I use camelCase vs PascalCase?',
      answer:
        'camelCase (e.g. `myVariableName`) starts with a lowercase letter and is the standard for JavaScript/TypeScript variables and methods. PascalCase (e.g. `MyComponentClass`) capitalizes every word initial and is standard for React components, TypeScript types, and C# classes.',
    },
    {
      question: 'How does kebab-case differ from snake_case?',
      answer:
        'kebab-case uses hyphens (`user-profile-id`) and is standard for URLs, CSS class names, and npm package slugs. snake_case uses underscores (`user_profile_id`) and is standard in Python, SQL column definitions, and database schemas.',
    },
    {
      question: 'Is my text processed locally?',
      answer:
        'Yes. All string operations execute client-side in your browser JavaScript thread. No text is ever uploaded or logged.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Instant Multi-Case String Transformation Engine
          </h2>
          <p>
            Standardize copy and transform developer identifiers across camelCase, PascalCase, snake_case, CONSTANT_CASE, and editorial title capitalization.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>💻 Programming Identifiers</h3>
              <p className="text-[11px]">Convert variables into camelCase, PascalCase, snake_case, and kebab-case.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📰 Editorial Formatting</h3>
              <p className="text-[11px]">Smart Title Case and Sentence case formatting with conjunction rules.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ Live Multi-Card Previews</h3>
              <p className="text-[11px]">See all 11 format conversions simultaneously with 1-click copy.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Editor Area Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="text-case-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Type or Paste Text Below
            </label>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                {wordCount} words · {charCount} chars
              </span>
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXT)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Sample
              </button>
              <ResetButton onClick={() => setText('')} label="Clear" />
            </div>
          </div>

          <textarea
            id="text-case-input"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to transform into all case formats simultaneously..."
            className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
            style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
          />
        </div>

        {/* Live Multi-Case Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Title Case */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Title Case
              </span>
              <CopyButton textToCopy={conversions.titleCase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-semibold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.titleCase || 'Title Case Output'}
            </div>
          </div>

          {/* Sentence case */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Sentence case
              </span>
              <CopyButton textToCopy={conversions.sentenceCase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-semibold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.sentenceCase || 'Sentence case output'}
            </div>
          </div>

          {/* camelCase */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                camelCase
              </span>
              <CopyButton textToCopy={conversions.camelCase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-mono font-semibold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.camelCase || 'camelCaseOutput'}
            </div>
          </div>

          {/* PascalCase */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                PascalCase
              </span>
              <CopyButton textToCopy={conversions.pascalCase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-mono font-semibold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.pascalCase || 'PascalCaseOutput'}
            </div>
          </div>

          {/* snake_case */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                snake_case
              </span>
              <CopyButton textToCopy={conversions.snakeCase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-mono font-semibold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.snakeCase || 'snake_case_output'}
            </div>
          </div>

          {/* kebab-case */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                kebab-case
              </span>
              <CopyButton textToCopy={conversions.kebabCase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-mono font-semibold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.kebabCase || 'kebab-case-output'}
            </div>
          </div>

          {/* UPPERCASE */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                UPPERCASE
              </span>
              <CopyButton textToCopy={conversions.uppercase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-bold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.uppercase || 'UPPERCASE OUTPUT'}
            </div>
          </div>

          {/* lowercase */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                lowercase
              </span>
              <CopyButton textToCopy={conversions.lowercase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-medium select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.lowercase || 'lowercase output'}
            </div>
          </div>

          {/* CONSTANT_CASE */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>
                CONSTANT_CASE
              </span>
              <CopyButton textToCopy={conversions.constantCase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-mono font-bold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.constantCase || 'CONSTANT_CASE_OUTPUT'}
            </div>
          </div>

          {/* dot.case */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>
                dot.case
              </span>
              <CopyButton textToCopy={conversions.dotCase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-mono font-semibold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.dotCase || 'dot.case.output'}
            </div>
          </div>

          {/* aLtErNaTiNg cAsE */}
          <div
            className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs sm:col-span-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ec4899' }}>
                aLtErNaTiNg cAsE (Meme / Sarcasm)
              </span>
              <CopyButton textToCopy={conversions.alternatingCase} size="sm" />
            </div>
            <div className="p-3 rounded-xl text-xs sm:text-sm font-bold select-all truncate" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {conversions.alternatingCase || 'aLtErNaTiNg cAsE oUtPuT'}
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
