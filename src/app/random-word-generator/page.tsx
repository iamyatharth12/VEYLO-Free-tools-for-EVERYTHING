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

// Curated clean dictionary of diverse English words categorized by part of speech
const DICTIONARY: { word: string; pos: 'noun' | 'verb' | 'adjective' }[] = [
  // Nouns
  { word: 'horizon', pos: 'noun' }, { word: 'catalyst', pos: 'noun' }, { word: 'solitude', pos: 'noun' },
  { word: 'nebula', pos: 'noun' }, { word: 'zenith', pos: 'noun' }, { word: 'velocity', pos: 'noun' },
  { word: 'prism', pos: 'noun' }, { word: 'cascade', pos: 'noun' }, { word: 'beacon', pos: 'noun' },
  { word: 'mirage', pos: 'noun' }, { word: 'summit', pos: 'noun' }, { word: 'harmony', pos: 'noun' },
  { word: 'echo', pos: 'noun' }, { word: 'glacier', pos: 'noun' }, { word: 'sanctuary', pos: 'noun' },
  { word: 'vortex', pos: 'noun' }, { word: 'symphony', pos: 'noun' }, { word: 'haven', pos: 'noun' },
  { word: 'odyssey', pos: 'noun' }, { word: 'monolith', pos: 'noun' }, { word: 'aurora', pos: 'noun' },
  { word: 'pulse', pos: 'noun' }, { word: 'labyrinth', pos: 'noun' }, { word: 'cipher', pos: 'noun' },
  { word: 'nexus', pos: 'noun' }, { word: 'spectrum', pos: 'noun' }, { word: 'tapestry', pos: 'noun' },
  { word: 'radiance', pos: 'noun' }, { word: 'paragon', pos: 'noun' }, { word: 'canyon', pos: 'noun' },
  { word: 'shadow', pos: 'noun' }, { word: 'whistle', pos: 'noun' }, { word: 'riddle', pos: 'noun' },
  { word: 'spark', pos: 'noun' }, { word: 'crystal', pos: 'noun' }, { word: 'timber', pos: 'noun' },
  { word: 'meadow', pos: 'noun' }, { word: 'breeze', pos: 'noun' }, { word: 'lagoon', pos: 'noun' },
  { word: 'ember', pos: 'noun' }, { word: 'fable', pos: 'noun' }, { word: 'galaxy', pos: 'noun' },
  { word: 'harbor', pos: 'noun' }, { word: 'island', pos: 'noun' }, { word: 'jungle', pos: 'noun' },
  { word: 'kingdom', pos: 'noun' }, { word: 'legend', pos: 'noun' }, { word: 'magnet', pos: 'noun' },
  { word: 'oasis', pos: 'noun' }, { word: 'portal', pos: 'noun' }, { word: 'quarry', pos: 'noun' },

  // Verbs
  { word: 'illuminate', pos: 'verb' }, { word: 'navigate', pos: 'verb' }, { word: 'resonate', pos: 'verb' },
  { word: 'transcend', pos: 'verb' }, { word: 'cultivate', pos: 'verb' }, { word: 'flourish', pos: 'verb' },
  { word: 'harmonize', pos: 'verb' }, { word: 'crystallize', pos: 'verb' }, { word: 'ponder', pos: 'verb' },
  { word: 'wander', pos: 'verb' }, { word: 'ignite', pos: 'verb' }, { word: 'soar', pos: 'verb' },
  { word: 'unravel', pos: 'verb' }, { word: 'empower', pos: 'verb' }, { word: 'evolve', pos: 'verb' },
  { word: 'sculpt', pos: 'verb' }, { word: 'glimmer', pos: 'verb' }, { word: 'whisper', pos: 'verb' },
  { word: 'traverse', pos: 'verb' }, { word: 'orchestrate', pos: 'verb' }, { word: 'accelerate', pos: 'verb' },
  { word: 'forge', pos: 'verb' }, { word: 'shimmer', pos: 'verb' }, { word: 'radiate', pos: 'verb' },
  { word: 'breathe', pos: 'verb' }, { word: 'unfold', pos: 'verb' }, { word: 'inspire', pos: 'verb' },
  { word: 'venture', pos: 'verb' }, { word: 'elevate', pos: 'verb' }, { word: 'captivate', pos: 'verb' },

  // Adjectives
  { word: 'luminous', pos: 'adjective' }, { word: 'ethereal', pos: 'adjective' }, { word: 'resilient', pos: 'adjective' },
  { word: 'dynamic', pos: 'adjective' }, { word: 'serene', pos: 'adjective' }, { word: 'vibrant', pos: 'adjective' },
  { word: 'enigmatic', pos: 'adjective' }, { word: 'celestial', pos: 'adjective' }, { word: 'audacious', pos: 'adjective' },
  { word: 'tranquil', pos: 'adjective' }, { word: 'vivid', pos: 'adjective' }, { word: 'infinite', pos: 'adjective' },
  { word: 'radiant', pos: 'adjective' }, { word: 'eloquent', pos: 'adjective' }, { word: 'sublime', pos: 'adjective' },
  { word: 'pristine', pos: 'adjective' }, { word: 'tenacious', pos: 'adjective' }, { word: 'astute', pos: 'adjective' },
  { word: 'majestic', pos: 'adjective' }, { word: 'effervescent', pos: 'adjective' }, { word: 'halcyon', pos: 'adjective' },
  { word: 'lucid', pos: 'adjective' }, { word: 'stellar', pos: 'adjective' }, { word: 'harmonious', pos: 'adjective' },
  { word: 'nimble', pos: 'adjective' }, { word: 'quintessential', pos: 'adjective' }, { word: 'brilliant', pos: 'adjective' },
  { word: 'swift', pos: 'adjective' }, { word: 'bold', pos: 'adjective' }, { word: 'gentle', pos: 'adjective' },
];

export default function RandomWordGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('random-word-generator')!, []);

  const [wordCount, setWordCount] = useState<number>(5);
  const [lengthFilter, setLengthFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [posFilter, setPosFilter] = useState<'all' | 'noun' | 'verb' | 'adjective'>('all');
  const [startsWith, setStartsWith] = useState<string>('');

  const [generatedWords, setGeneratedWords] = useState<typeof DICTIONARY>([
    { word: 'luminous', pos: 'adjective' },
    { word: 'cascade', pos: 'noun' },
    { word: 'transcend', pos: 'verb' },
    { word: 'zenith', pos: 'noun' },
    { word: 'ethereal', pos: 'adjective' },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWords = useCallback(() => {
    setError(null);
    setIsGenerating(true);

    setTimeout(() => {
      const pool = DICTIONARY.filter(item => {
        // POS filter
        if (posFilter !== 'all' && item.pos !== posFilter) return false;

        // Length filter
        const len = item.word.length;
        if (lengthFilter === 'short' && (len < 3 || len > 5)) return false;
        if (lengthFilter === 'medium' && (len < 6 || len > 8)) return false;
        if (lengthFilter === 'long' && len < 9) return false;

        // Starts with filter
        if (startsWith.trim()) {
          if (!item.word.toLowerCase().startsWith(startsWith.trim().toLowerCase())) {
            return false;
          }
        }

        return true;
      });

      if (pool.length === 0) {
        setError('No words matched the specific filter criteria. Try relaxing your filters.');
        setIsGenerating(false);
        return;
      }

      // Shuffle pool with Web Crypto
      const qty = Math.min(Math.max(1, wordCount), pool.length);
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, qty);

      setGeneratedWords(picked);
      setIsGenerating(false);
    }, 80);
  }, [wordCount, lengthFilter, posFilter, startsWith]);

  const handleReset = () => {
    setWordCount(5);
    setLengthFilter('all');
    setPosFilter('all');
    setStartsWith('');
    setError(null);
    setGeneratedWords(DICTIONARY.slice(0, 5));
  };

  const wordsOnlyString = generatedWords.map(w => w.word).join(', ');

  const faqs: FAQItem[] = [
    {
      question: 'What are the main use cases for this word generator?',
      answer:
        'It is popular for creative writing prompts, brainstorming brand names and slogans, Pictionary / Charades game prompts, password passphrases, and vocabulary expansion.',
    },
    {
      question: 'Are the words safe for work and school?',
      answer:
        'Yes. All words in the VEYLO dictionary are carefully curated, clean, and family-safe.',
    },
    {
      question: 'Can I filter by word complexity or length?',
      answer:
        'Yes. Use the length filter (Short: 3-5 chars, Medium: 6-8 chars, Long: 9+ chars) and parts of speech selector (Nouns, Verbs, Adjectives).',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Free Online Random Word Generator
          </h2>
          <p>
            Stuck with writer&apos;s block or planning a party game? The VEYLO Random Word Generator delivers instant English vocabulary with grammatical filters and length controls.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>✍️ Creative Writing</h3>
              <p className="text-[11px]">Overcome writer&apos;s block by weaving unexpected random words into story prompts.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎨 Word Games</h3>
              <p className="text-[11px]">Generate clues for Pictionary, Catchphrase, Charades, and Wordle training.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>💡 Name Ideation</h3>
              <p className="text-[11px]">Combine dynamic nouns and adjectives to brainstorm project titles and slogans.</p>
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
            {/* Word Count */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="word-count" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Word Count
              </label>
              <input
                id="word-count"
                type="number"
                min="1"
                max="50"
                value={wordCount}
                onChange={(e) => setWordCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            {/* Length Filter */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="length-filter" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Word Length
              </label>
              <select
                id="length-filter"
                value={lengthFilter}
                onChange={(e) => setLengthFilter(e.target.value as 'all' | 'short' | 'medium' | 'long')}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="all">Any Length</option>
                <option value="short">Short (3 - 5 letters)</option>
                <option value="medium">Medium (6 - 8 letters)</option>
                <option value="long">Long (9+ letters)</option>
              </select>
            </div>

            {/* Part of Speech */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pos-filter" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Part of Speech
              </label>
              <select
                id="pos-filter"
                value={posFilter}
                onChange={(e) => setPosFilter(e.target.value as 'all' | 'noun' | 'verb' | 'adjective')}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="all">All Parts of Speech</option>
                <option value="noun">Nouns Only</option>
                <option value="verb">Verbs Only</option>
                <option value="adjective">Adjectives Only</option>
              </select>
            </div>

            {/* Starts With (Optional) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="starts-with" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Starts With (Optional)
              </label>
              <input
                id="starts-with"
                type="text"
                maxLength={2}
                value={startsWith}
                onChange={(e) => setStartsWith(e.target.value)}
                placeholder="e.g. s, re"
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4 pt-4 text-xs" style={{ borderTop: '1px solid var(--border-c)' }}>
            <span style={{ color: 'var(--muted)' }}>
              Curated dictionary · 100% client-side
            </span>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <GenerateButton onClick={generateWords} loading={isGenerating} label="Generate Words" />
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

        {/* Results Presentation Grid */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Generated Words ({generatedWords.length})
            </span>
            <CopyButton textToCopy={wordsOnlyString} label="Copy All Words" />
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {generatedWords.map((item, idx) => (
              <div
                key={`${item.word}-${idx}`}
                className="p-4 rounded-xl flex flex-col justify-between gap-2.5 transition-all hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: 'var(--surface)',
                      color: 'var(--accent)',
                      border: '1px solid var(--border-c)',
                    }}
                  >
                    {item.pos}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
                    {item.word.length} chars
                  </span>
                </div>

                <div className="text-base font-bold capitalize select-all" style={{ color: 'var(--text)' }}>
                  {item.word}
                </div>

                <CopyButton textToCopy={item.word} size="sm" label="Copy" className="w-full justify-center mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
