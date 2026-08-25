'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  GenerateButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

type UnitType = 'paragraphs' | 'sentences' | 'words';

const LATIN_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
  'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit',
  'anim', 'id', 'est', 'laborum', 'faucibus', 'ornare', 'suspendisse', 'gravida',
  'dictum', 'fusce', 'ut', 'placerat', 'orci', 'nulla', 'pellentesque', 'dignissim',
  'curabitur', 'vivamus', 'auctor', 'maecenas', 'lobortis', 'elementum', 'sagittis'
];

const STANDARD_OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export default function LoremIpsumGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('lorem-ipsum-generator')!, []);

  const [unit, setUnit] = useState<UnitType>('paragraphs');
  const [quantity, setQuantity] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [wrapHtml, setWrapHtml] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [generatedText, setGeneratedText] = useState<string>(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed tempus urna et pharetra pharetra massa massa ultricies mi quis hendrerit dolor magna eget est lorem ipsum dolor sit amet.'
  );

  const generateLorem = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      let result = '';

      const makeSentence = (minWords = 8, maxWords = 16) => {
        const len = Math.floor(minWords + Math.random() * (maxWords - minWords + 1));
        const words: string[] = [];
        for (let i = 0; i < len; i++) {
          const w = LATIN_WORDS[Math.floor(Math.random() * LATIN_WORDS.length)];
          words.push(w);
        }
        const sent = words.join(' ');
        return sent.charAt(0).toUpperCase() + sent.slice(1) + '.';
      };

      const makeParagraph = (sentenceCount = 5) => {
        const sentences: string[] = [];
        for (let i = 0; i < sentenceCount; i++) {
          sentences.push(makeSentence());
        }
        return sentences.join(' ');
      };

      if (unit === 'words') {
        const words: string[] = [];
        if (startWithLorem) {
          words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
        }
        while (words.length < quantity) {
          words.push(LATIN_WORDS[Math.floor(Math.random() * LATIN_WORDS.length)]);
        }
        result = words.slice(0, quantity).join(' ') + '.';
      } else if (unit === 'sentences') {
        const sentences: string[] = [];
        if (startWithLorem && quantity > 0) {
          sentences.push(STANDARD_OPENING);
        }
        while (sentences.length < quantity) {
          sentences.push(makeSentence());
        }
        result = sentences.slice(0, quantity).join(' ');
      } else {
        // Paragraphs
        const paras: string[] = [];
        for (let i = 0; i < quantity; i++) {
          if (i === 0 && startWithLorem) {
            paras.push(STANDARD_OPENING + ' ' + makeParagraph(4));
          } else {
            paras.push(makeParagraph(5));
          }
        }

        if (wrapHtml) {
          result = paras.map(p => `<p>${p}</p>`).join('\n\n');
        } else {
          result = paras.join('\n\n');
        }
      }

      setGeneratedText(result);
      setIsGenerating(false);
    }, 120);
  }, [unit, quantity, startWithLorem, wrapHtml]);

  const handleReset = () => {
    setUnit('paragraphs');
    setQuantity(3);
    setStartWithLorem(true);
    setWrapHtml(false);
  };

  const words = (generatedText.trim().match(/\b\w+\b/g) || []).length;
  const chars = generatedText.length;

  const faqs: FAQItem[] = [
    {
      question: 'What is Lorem Ipsum dummy text?',
      answer:
        'Lorem Ipsum has been the industry standard placeholder text since the 1500s. It provides a natural distribution of letters to focus visual attention on graphic layout and typography rather than readable content.',
    },
    {
      question: 'Can I generate HTML <p> tags for web development?',
      answer:
        'Yes! Check the "Wrap with <p> HTML Tags" toggle to generate production-ready HTML code ready to paste into React, Vue, or Webflow.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Lorem Ipsum Dummy Text Generator
          </h2>
          <p>
            Essential for UI/UX designers, front-end developers, and typesetters. The VEYLO Lorem Ipsum Generator crafts clean Latin placeholder text by paragraphs, sentences, or word counts with optional HTML tag wrapping.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📄 Paragraph &amp; Word Limits</h3>
              <p className="text-[11px]">Generate from a single sentence up to 20 full paragraphs of dummy copy.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🌐 HTML &lt;p&gt; Tag Export</h3>
              <p className="text-[11px]">Automatically wrap output paragraphs with HTML tags for web prototypes.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ Zero Lag</h3>
              <p className="text-[11px]">Generated instantly in local browser memory with one-click clipboard copy.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Controls Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Unit Selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lorem-unit" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Generation Unit
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'paragraphs', label: 'Paragraphs' },
                  { id: 'sentences', label: 'Sentences' },
                  { id: 'words', label: 'Words' },
                ].map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setUnit(u.id as UnitType);
                      if (u.id === 'words') setQuantity(50);
                      else if (u.id === 'sentences') setQuantity(5);
                      else setQuantity(3);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                      unit === u.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: unit === u.id ? 'var(--accent)' : 'var(--surface-2)',
                      color: unit === u.id ? '#ffffff' : 'var(--text)',
                      border: '1px solid var(--border-c)',
                    }}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="lorem-qty" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  Quantity ({quantity} {unit})
                </label>
              </div>
              <input
                id="lorem-qty"
                type="range"
                min={1}
                max={unit === 'words' ? 200 : unit === 'sentences' ? 30 : 10}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                style={{ background: 'var(--surface-2)' }}
              />
            </div>
          </div>

          {/* Options & Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-semibold" style={{ borderTop: '1px solid var(--border-c)' }}>
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>Start with &ldquo;Lorem ipsum...&rdquo;</span>
              </label>

              {unit === 'paragraphs' && (
                <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                  <input
                    type="checkbox"
                    checked={wrapHtml}
                    onChange={(e) => setWrapHtml(e.target.checked)}
                    className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  <span>Wrap with &lt;p&gt; HTML Tags</span>
                </label>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <GenerateButton onClick={generateLorem} loading={isGenerating} label="Generate Text" />
            </div>
          </div>
        </div>

        {/* Output Text Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Generated Placeholder Text ({words} words · {chars} chars)
            </span>
            <CopyButton textToCopy={generatedText} size="sm" label="Copy Text" />
          </div>

          <textarea
            rows={10}
            readOnly
            value={generatedText}
            placeholder="Placeholder text will appear here..."
            className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none resize-y"
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
