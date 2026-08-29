'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const LATIN_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum', 'curabitur', 'pretium', 'tincidunt', 'lacus', 'nulla', 'gravida', 'orci', 'a',
  'odio', 'nullam', 'varius', 'turpis', 'et', 'commodo', 'pharetra', 'est', 'eros', 'bibendum',
  'leo', 'nec', 'luctus', 'magna', 'felis', 'sollicitudin', 'mauris', 'integer', 'in', 'mauris',
  'eu', 'nibh', 'euismod', 'gravida', 'duis', 'ac', 'tellus', 'et', 'risus', 'vulputate'
];

const STANDARD_OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

function generateSentence(startWithLorem = false): string {
  if (startWithLorem) return STANDARD_OPENING;
  const len = Math.floor(Math.random() * 10) + 8; // 8 to 18 words
  const words: string[] = [];
  for (let i = 0; i < len; i++) {
    const w = LATIN_WORDS[Math.floor(Math.random() * LATIN_WORDS.length)];
    words.push(w);
  }
  const sentence = words.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function generateParagraph(isFirst = false, startWithLorem = true): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 4; // 4 to 7 sentences
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    if (isFirst && i === 0 && startWithLorem) {
      sentences.push(STANDARD_OPENING);
    } else {
      sentences.push(generateSentence(false));
    }
  }
  return sentences.join(' ');
}

export default function LoremIpsumPage() {
  const tool = useMemo(() => getToolBySlug('tools/lorem-ipsum')!, []);

  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [asHtml, setAsHtml] = useState<boolean>(false);
  const [generatedText, setGeneratedText] = useState<string>('');

  const generate = useCallback(() => {
    if (type === 'paragraphs') {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        paras.push(generateParagraph(i === 0, startWithLorem));
      }
      if (asHtml) {
        setGeneratedText(paras.map((p) => `<p>${p}</p>`).join('\n\n'));
      } else {
        setGeneratedText(paras.join('\n\n'));
      }
    } else if (type === 'sentences') {
      const sents: string[] = [];
      for (let i = 0; i < count; i++) {
        sents.push(generateSentence(i === 0 && startWithLorem));
      }
      if (asHtml) {
        setGeneratedText(sents.map((s) => `<p>${s}</p>`).join('\n'));
      } else {
        setGeneratedText(sents.join(' '));
      }
    } else {
      // Words
      const words: string[] = [];
      if (startWithLorem && count >= 5) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }
      while (words.length < count) {
        const w = LATIN_WORDS[Math.floor(Math.random() * LATIN_WORDS.length)];
        words.push(w);
      }
      const rawWords = words.slice(0, count).join(' ');
      const capitalized = rawWords.charAt(0).toUpperCase() + rawWords.slice(1) + '.';
      setGeneratedText(asHtml ? `<p>${capitalized}</p>` : capitalized);
    }
  }, [type, count, startWithLorem, asHtml]);

  useEffect(() => {
    generate();
  }, [generate]);

  const wordCount = useMemo(() => {
    return generatedText.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length;
  }, [generatedText]);

  const charCount = useMemo(() => {
    return generatedText.length;
  }, [generatedText]);

  const handleReset = () => {
    setType('paragraphs');
    setCount(3);
    setStartWithLorem(true);
    setAsHtml(false);
  };

  const faqs: FAQItem[] = [
    {
      question: 'What is Lorem Ipsum text?',
      answer:
        'Lorem Ipsum is dummy placeholder text derived from sections 1.10.32 and 1.10.33 of Cicero’s 45 BC philosophical treatise "De Finibus Bonorum et Malorum" (On the Extremes of Good and Evil). It has been used as the standard typesetting placeholder since the 1500s.',
    },
    {
      question: 'Why do designers use dummy text instead of real copy?',
      answer:
        'Using readable English text distracts clients and stakeholders from evaluating visual layout, font hierarchy, and responsive UI components. Latin dummy text creates a natural distribution of letters without readable meaning.',
    },
    {
      question: 'Can I generate HTML paragraph tags directly?',
      answer:
        'Yes. Toggling the "Wrap in <p> tags" option automatically formats each paragraph with HTML paragraph tags for easy pasting into codebases.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Customizable Lorem Ipsum Dummy Placeholder Text Generator
          </h2>
          <p>
            Generate randomized Latin placeholder paragraphs, sentences, and words for website mockups, wireframes, graphic designs, and UI prototypes.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📏 Paragraph, Sentence &amp; Word Modes</h3>
              <p className="text-[11px]">Generate from single keywords to 20 full-length Latin text paragraphs.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🏷️ HTML &lt;p&gt; Tags Option</h3>
              <p className="text-[11px]">Format with HTML markup tags for instant integration into web projects.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ 1-Click Copy &amp; Regenerate</h3>
              <p className="text-[11px]">Quickly re-roll random sentence lengths or copy plain text to clipboard.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Generator Controls */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Configure Text Generation
            </h2>
            <ResetButton onClick={handleReset} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Unit Type */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lipsum-type" className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                Generate By
              </label>
              <select
                id="lipsum-type"
                value={type}
                onChange={(e) => setType(e.target.value as 'paragraphs' | 'sentences' | 'words')}
                className="p-2.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lipsum-count" className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                Quantity ({count})
              </label>
              <input
                id="lipsum-count"
                type="number"
                min="1"
                max={type === 'words' ? 500 : type === 'sentences' ? 50 : 20}
                value={count}
                onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
                className="w-full p-2.5 rounded-xl text-xs font-bold font-mono focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            {/* Start with Lorem Toggle */}
            <div className="flex flex-col gap-1.5 justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none py-2" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded text-[var(--accent)] cursor-pointer"
                />
                <span>Start with &quot;Lorem ipsum...&quot;</span>
              </label>
            </div>

            {/* HTML Markup Toggle */}
            <div className="flex flex-col gap-1.5 justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none py-2" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={asHtml}
                  onChange={(e) => setAsHtml(e.target.checked)}
                  className="rounded text-[var(--accent)] cursor-pointer"
                />
                <span>Wrap in &lt;p&gt; HTML Tags</span>
              </label>
            </div>
          </div>
        </div>

        {/* Output Box */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Generated Placeholder Copy
              </span>
              <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
                {wordCount} words · {charCount} chars
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={generate}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                style={{ background: 'var(--accent)', color: '#ffffff' }}
              >
                <span>🔄</span>
                <span>Regenerate</span>
              </button>
              <CopyButton textToCopy={generatedText} size="sm" label="Copy Text" />
            </div>
          </div>

          <textarea
            readOnly
            rows={12}
            value={generatedText}
            className="w-full p-4 rounded-xl text-xs leading-relaxed focus:outline-none resize-y select-all whitespace-pre-wrap font-sans"
            style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
