'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

type ReverseMode = 'entire' | 'words' | 'eachWord' | 'upsideDown' | 'lines';

const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ',
  k: 'ʞ', l: 'ꞁ', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ',
  u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: 'ᗺ', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I', J: 'ſ',
  K: 'ʞ', L: 'Ꞁ', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ᴚ', S: 'S', T: '⊥',
  U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
  '.': '˙', ',': "'", "'": ',', '"': '„', '?': '¿', '!': '¡', '(': ')', ')': '(',
  '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾',
};

export default function TextReverserPage() {
  const tool = useMemo(() => getToolBySlug('text-reverser')!, []);

  const [text, setText] = useState<string>('The quick brown fox jumps over the lazy dog.');
  const [mode, setMode] = useState<ReverseMode>('entire');

  const transformedText = useMemo(() => {
    if (!text) return '';

    switch (mode) {
      case 'entire':
        return text.split('').reverse().join('');

      case 'words':
        return text.split(/(\s+)/).filter(Boolean).reverse().join('');

      case 'eachWord':
        return text
          .split(/(\s+)/)
          .map(part => (/\s+/.test(part) ? part : part.split('').reverse().join('')))
          .join('');

      case 'upsideDown': {
        const flipped = text
          .split('')
          .map(char => UPSIDE_DOWN_MAP[char] || char)
          .reverse()
          .join('');
        return flipped;
      }

      case 'lines':
        return text.split(/\r\n|\r|\n/).reverse().join('\n');

      default:
        return text;
    }
  }, [text, mode]);

  const faqs: FAQItem[] = [
    {
      question: 'How does Upside Down text work?',
      answer:
        'It translates standard alphanumeric characters into corresponding upside-down Unicode glyphs (e.g. `¿ɐɯoɹɟ ǝlqɐʇᴉɟoɹd`) that can be pasted directly into Discord, Twitter/X, and social bios.',
    },
    {
      question: 'What is the difference between Reverse Text and Reverse Words?',
      answer:
        'Reverse Text mirrors every single character backward (`hello` -> `olleh`), whereas Reverse Words keeps individual word spelling intact while flipping the sentence sequence (`hello world` -> `world hello`).',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Text Reverser &amp; Upside Down Flipper
          </h2>
          <p>
            Whether creating upside-down social media bio text, reversing string datasets for coding tests, or checking palindrome symmetry, the VEYLO Text Reverser offers 5 instant reversal modes processed completely in your browser.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔄 Full String Reversal</h3>
              <p className="text-[11px]">Mirrors every character and symbol backward for cipher or palindrome checks.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🙃 Upside Down Unicode</h3>
              <p className="text-[11px]">Generates upside-down flip text compatible with Instagram, Discord, and TikTok.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📜 Reverse Line Order</h3>
              <p className="text-[11px]">Invert chronologies and CSV data rows from bottom to top.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Mode Selector Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Reversal Mode:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'entire', label: '🔄 Reverse Text' },
                { id: 'words', label: '🔀 Reverse Words' },
                { id: 'eachWord', label: '🔤 Reverse Each Word' },
                { id: 'upsideDown', label: '🙃 Upside Down' },
                { id: 'lines', label: '📜 Reverse Lines' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setMode(cat.id as ReverseMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    mode === cat.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: mode === cat.id ? 'var(--accent)' : 'var(--surface-2)',
                    color: mode === cat.id ? '#ffffff' : 'var(--text)',
                    border: '1px solid var(--border-c)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <ResetButton onClick={() => setText('')} label="Clear" />
        </div>

        {/* Side by Side Input & Output Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div
            className="p-6 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <label htmlFor="input-reverser" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Original Input Text
            </label>
            <textarea
              id="input-reverser"
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text to reverse..."
              className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                border: '1px solid var(--border-c)',
              }}
            />
          </div>

          {/* Output Box */}
          <div
            className="p-6 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="output-reverser" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Reversed Output
              </label>
              <CopyButton textToCopy={transformedText} size="sm" label="Copy Result" />
            </div>

            <textarea
              id="output-reverser"
              rows={8}
              readOnly
              value={transformedText}
              placeholder="Transformed text will appear here..."
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
