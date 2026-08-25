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

const ALPHABETS = {
  english: {
    name: 'English (A-Z)',
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    vowels: ['A', 'E', 'I', 'O', 'U'],
  },
  greek: {
    name: 'Greek (Α-Ω)',
    letters: ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'],
    vowels: ['Α', 'Ε', 'Η', 'Ι', 'Ο', 'Υ', 'Ω'],
  },
  nato: {
    name: 'NATO Phonetic Alphabet',
    letters: [
      'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel',
      'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa',
      'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray',
      'Yankee', 'Zulu'
    ],
    vowels: ['Alpha', 'Echo', 'India', 'Oscar', 'Uniform'],
  },
};

export default function RandomLetterGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('random-letter-generator')!, []);

  const [alphabet, setAlphabet] = useState<'english' | 'greek' | 'nato'>('english');
  const [letterCase, setLetterCase] = useState<'upper' | 'lower' | 'mixed'>('upper');
  const [letterType, setLetterType] = useState<'all' | 'vowels' | 'consonants'>('all');
  const [quantity, setQuantity] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const [results, setResults] = useState<string[]>(['K']);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLetters = useCallback(() => {
    setError(null);
    setIsGenerating(true);

    setTimeout(() => {
      const activeAlphabet = ALPHABETS[alphabet];
      let pool = [...activeAlphabet.letters];

      if (letterType === 'vowels') {
        pool = pool.filter(l => activeAlphabet.vowels.includes(l));
      } else if (letterType === 'consonants') {
        pool = pool.filter(l => !activeAlphabet.vowels.includes(l));
      }

      if (pool.length === 0) {
        setError('No letters available matching your filter criteria.');
        setIsGenerating(false);
        return;
      }

      const qty = Math.min(Math.max(1, quantity), 100);

      if (!allowDuplicates && qty > pool.length) {
        setError(`Cannot generate ${qty} unique letters from a pool of ${pool.length}. Reduce quantity or enable duplicates.`);
        setIsGenerating(false);
        return;
      }

      let chosen: string[] = [];

      if (!allowDuplicates) {
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        chosen = shuffled.slice(0, qty);
      } else {
        for (let i = 0; i < qty; i++) {
          const rand = pool[Math.floor(Math.random() * pool.length)];
          chosen.push(rand);
        }
      }

      // Apply case transformation (for standard alphabets)
      if (alphabet !== 'nato') {
        chosen = chosen.map(item => {
          if (letterCase === 'lower') return item.toLowerCase();
          if (letterCase === 'mixed') return Math.random() > 0.5 ? item.toUpperCase() : item.toLowerCase();
          return item.toUpperCase();
        });
      }

      if (sortOrder === 'asc') {
        chosen.sort((a, b) => a.localeCompare(b));
      } else if (sortOrder === 'desc') {
        chosen.sort((a, b) => b.localeCompare(a));
      }

      setResults(chosen);
      setIsGenerating(false);
    }, 60);
  }, [alphabet, letterCase, letterType, quantity, allowDuplicates, sortOrder]);

  const handleReset = () => {
    setAlphabet('english');
    setLetterCase('upper');
    setLetterType('all');
    setQuantity(1);
    setAllowDuplicates(true);
    setSortOrder('none');
    setResults(['K']);
    setError(null);
  };

  const resultsString = results.join(', ');

  const faqs: FAQItem[] = [
    {
      question: 'What alphabets are supported?',
      answer:
        'The generator supports the English Latin alphabet (A-Z), the Greek alphabet (Α-Ω), and the international NATO Phonetic alphabet (Alpha to Zulu).',
    },
    {
      question: 'Can I pick only vowels or only consonants?',
      answer:
        'Yes. Use the "Letter Type" filter to restrict generation to vowels only or consonants only.',
    },
    {
      question: 'What are common uses for this tool?',
      answer:
        'Popular use cases include word games (like Scattergories or Boggle), classroom spelling drills, acronym creation, and randomized testing.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Random Letter Generator
          </h2>
          <p>
            Whether you&apos;re playing word games, practicing phonetic codes, or creating randomized initial characters, the VEYLO Random Letter Generator gives you complete control over alphabet systems, letter casing, and vowel/consonant filtering.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎯 Board Games</h3>
              <p className="text-[11px]">Pick starting letters for Scattergories, Stop, and vocabulary challenges.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📻 NATO Phonetics</h3>
              <p className="text-[11px]">Generate aviation and radio communication phonetic words (Alpha, Bravo, Charlie).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📚 Classroom Drills</h3>
              <p className="text-[11px]">Help students practice phonics, vowel identification, and handwriting.</p>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Alphabet Set */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="alphabet-select" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Alphabet Set
              </label>
              <select
                id="alphabet-select"
                value={alphabet}
                onChange={(e) => setAlphabet(e.target.value as 'english' | 'greek' | 'nato')}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="english">Standard English (A-Z)</option>
                <option value="greek">Greek Alphabet (Α-Ω)</option>
                <option value="nato">NATO Phonetic (Alpha - Zulu)</option>
              </select>
            </div>

            {/* Letter Case */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="case-select" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Letter Case
              </label>
              <select
                id="case-select"
                value={letterCase}
                onChange={(e) => setLetterCase(e.target.value as 'upper' | 'lower' | 'mixed')}
                disabled={alphabet === 'nato'}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="upper">UPPERCASE (A, B, C)</option>
                <option value="lower">lowercase (a, b, c)</option>
                <option value="mixed">Mixed Case</option>
              </select>
            </div>

            {/* Letter Type */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="type-select" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Letter Type
              </label>
              <select
                id="type-select"
                value={letterType}
                onChange={(e) => setLetterType(e.target.value as 'all' | 'vowels' | 'consonants')}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="all">All Letters</option>
                <option value="vowels">Vowels Only</option>
                <option value="consonants">Consonants Only</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quantity-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Quantity
              </label>
              <input
                id="quantity-input"
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(100, Math.max(1, Number(e.target.value))))}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          </div>

          {/* Options & Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs" style={{ borderTop: '1px solid var(--border-c)' }}>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>Allow Duplicates</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ color: 'var(--muted)' }}>Sort:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'none' | 'asc' | 'desc')}
                  className="p-1.5 rounded-lg text-xs font-semibold focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                >
                  <option value="none">Original Roll</option>
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <GenerateButton onClick={generateLetters} loading={isGenerating} label="Generate Letters" />
            </div>
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-shake"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.25)' }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-5 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Generated Letter{results.length > 1 ? 's' : ''} ({results.length})
            </span>
            <CopyButton textToCopy={resultsString} label="Copy All" />
          </div>

          {results.length === 1 ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div
                className="text-7xl sm:text-9xl font-black tracking-tight select-all px-10 py-6 rounded-3xl transition-transform active:scale-95"
                style={{
                  color: 'var(--accent)',
                  background: 'color-mix(in srgb, var(--accent) 8%, var(--surface))',
                  border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                }}
              >
                {results[0]}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3 p-4 rounded-xl max-h-72 overflow-y-auto" style={{ background: 'var(--surface-2)' }}>
              {results.map((letter, idx) => (
                <span
                  key={`${letter}-${idx}`}
                  className="px-4 py-2 rounded-xl text-base sm:text-xl font-bold shadow-xs select-all"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-c)',
                    color: 'var(--text)',
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolPageShell>
  );
}
