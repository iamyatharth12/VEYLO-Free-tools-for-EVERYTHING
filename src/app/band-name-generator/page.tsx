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

type BandStyle = 'indie' | 'metal' | 'electronic' | 'pop' | 'lofi' | 'hiphop';

const BAND_VOCABULARY: Record<BandStyle, { prefixes: string[]; nouns: string[]; suffixes: string[] }> = {
  indie: {
    prefixes: ['Velvet', 'Tokyo', 'Quiet', 'Sunken', 'Midnight', 'Silver', 'Golden', 'Pale', 'Wilder', 'Neon', 'Lunar', 'Suburban'],
    nouns: ['Sunflowers', 'Foxes', 'Parade', 'Avenue', 'Seas', 'Sundays', 'Hours', 'Lanterns', 'Echoes', 'Orchids', 'Castles', 'Skies'],
    suffixes: ['Club', 'Collective', 'Project', 'Society', 'Trio', 'Band', 'Sounds'],
  },
  metal: {
    prefixes: ['Bleeding', 'Iron', 'Crimson', 'Shadow', 'Frost', 'Abyssal', 'Venom', 'Hollow', 'Obsidian', 'Severed', 'Sovereign', 'Infernal'],
    nouns: ['Crown', 'Throne', 'Blight', 'Reign', 'Wraith', 'Serpent', 'Eclipse', 'Grave', 'Dagger', 'Titan', 'Vortex', 'Chariot'],
    suffixes: ['Empire', 'Core', 'Dominion', 'Cult', 'Horde'],
  },
  electronic: {
    prefixes: ['Cyber', 'Quantum', 'Glitch', 'Binary', 'Synth', 'Neon', 'Hyper', 'Vector', 'Pixel', 'Modem', 'Prism', 'Astral'],
    nouns: ['Matrix', 'Frequency', 'Wave', 'Pulse', 'Circuit', 'Grid', 'Drift', 'Reactor', 'Shift', 'Signal', 'Code', 'Flux'],
    suffixes: ['System', 'Protocol', 'Labs', 'Unit', 'Drive', 'Machine'],
  },
  pop: {
    prefixes: ['Cherry', 'Golden', 'Electric', 'Sugar', 'Honey', 'Cosmic', 'Summer', 'Velvet', 'Secret', 'Daydream', 'Mirror', 'Peachy'],
    nouns: ['Hearts', 'Lovers', 'Diamonds', 'Bliss', 'Roses', 'Sparks', 'Dreams', 'Glitter', 'Glow', 'Stars', 'Girls', 'Boys'],
    suffixes: ['Pop', 'Magic', 'Music', 'Vibes', 'Club', 'Radio'],
  },
  lofi: {
    prefixes: ['Rainy', 'Coffee', 'Sleepy', 'Mellow', 'Dusty', 'Sunday', 'Afternoon', 'Cloudy', 'Vintage', 'Autumn', 'Gentle', 'Quiet'],
    nouns: ['Tapes', 'Beats', 'Notes', 'Window', 'Vinyl', 'Daisies', 'Breeze', 'Sketches', 'Chords', 'Pencils', 'Walks', 'Hours'],
    suffixes: ['Corner', 'Session', 'Tapes', 'Room', 'Loft', 'Lab'],
  },
  hiphop: {
    prefixes: ['King', 'Young', 'Lil', 'Big', 'Savage', 'Prime', 'Real', 'Grand', 'Urban', 'Soul', 'Golden', 'Ghost'],
    nouns: ['Dynasty', 'Mob', 'Squad', 'Syndicate', 'Circle', 'Alliance', 'Crew', 'Empire', 'Nation', 'Vibe', 'Flow'],
    suffixes: ['Gang', 'Clan', 'Collective', 'Records', 'Ent', 'Cartel'],
  },
};

export default function BandNameGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('band-name-generator')!, []);

  const [style, setStyle] = useState<BandStyle>('indie');
  const [customWord, setCustomWord] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(12);

  const [bandNames, setBandNames] = useState<string[]>([
    'Velvet Sunflowers', 'The Midnight Parade', 'Tokyo Echoes',
    'Pale Avenue', 'Silver Lanterns Project', 'Wilder Skies Collective',
    'Quiet Sundays', 'The Sunken Seas', 'Golden Orchids',
    'Lunar Foxes', 'Neon Castles Club', 'Suburban Hours'
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const generateNames = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const vocab = BAND_VOCABULARY[style] || BAND_VOCABULARY.indie;
      const results: string[] = [];

      for (let i = 0; i < quantity; i++) {
        const prefix = vocab.prefixes[Math.floor(Math.random() * vocab.prefixes.length)];
        const noun = vocab.nouns[Math.floor(Math.random() * vocab.nouns.length)];
        const suffix = vocab.suffixes[Math.floor(Math.random() * vocab.suffixes.length)];

        let name = '';
        const custom = customWord.trim();

        if (custom) {
          const cap = custom.charAt(0).toUpperCase() + custom.slice(1);
          if (i % 3 === 0) name = `${prefix} ${cap}`;
          else if (i % 3 === 1) name = `The ${cap} ${noun}`;
          else name = `${cap} & The ${noun}`;
        } else {
          const mode = Math.random();
          if (mode < 0.35) {
            name = `The ${prefix} ${noun}`;
          } else if (mode < 0.70) {
            name = `${prefix} ${noun}`;
          } else {
            name = `${prefix} ${noun} ${suffix}`;
          }
        }

        results.push(name);
      }

      setBandNames(results);
      setIsGenerating(false);
    }, 120);
  }, [style, customWord, quantity]);

  const handleReset = () => {
    setStyle('indie');
    setCustomWord('');
    setQuantity(12);
  };

  const allNamesString = bandNames.join('\n');

  const faqs: FAQItem[] = [
    {
      question: 'How do I incorporate my own word or hometown name?',
      answer:
        'Type your word or city into the "Custom Keyword" input. The generator will blend your keyword naturally into artist names and band titles.',
    },
    {
      question: 'Can I legally use these band names?',
      answer:
        'Yes, all generated name concepts are royalty-free. Before releasing music on platforms like Spotify or registering a trademark, always verify that another active group in your country isn’t already using the exact same name.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Band Name Generator
          </h2>
          <p>
            Naming your musical project is just as important as writing the music. The VEYLO Band Name Generator crafts distinctive names tailored across rock, indie, electronic, heavy metal, lo-fi, and pop genres.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎸 Rock &amp; Indie Groups</h3>
              <p className="text-[11px]">Generate iconic alternative and vintage garage rock trio/quartet names.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ Electronic &amp; DJs</h3>
              <p className="text-[11px]">Discover futuristic synthwave, techno, and cybernetic producer monikers.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>☕ Lo-Fi &amp; Bedroom Pop</h3>
              <p className="text-[11px]">Warm, gentle, and nostalgic titles for chill study beat projects.</p>
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
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Music Style */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="band-style" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Genre Style
              </label>
              <select
                id="band-style"
                value={style}
                onChange={(e) => setStyle(e.target.value as BandStyle)}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="indie">🎸 Indie Rock &amp; Alt</option>
                <option value="metal">🤘 Heavy Metal &amp; Core</option>
                <option value="electronic">⚡ Synthwave &amp; Electronic</option>
                <option value="pop">✨ Pop &amp; Dance</option>
                <option value="lofi">☕ Lo-Fi &amp; Acoustic</option>
                <option value="hiphop">🎤 Hip-Hop &amp; Collective</option>
              </select>
            </div>

            {/* Custom Keyword */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="band-keyword" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Custom Word (Optional)
              </label>
              <input
                id="band-keyword"
                type="text"
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value)}
                placeholder="e.g. Electric, Velvet, London"
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="band-qty" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Quantity
              </label>
              <select
                id="band-qty"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value={6}>6 Names</option>
                <option value={12}>12 Names</option>
                <option value={24}>24 Names</option>
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4 pt-2 text-xs" style={{ borderTop: '1px solid var(--border-c)' }}>
            <span style={{ color: 'var(--muted)' }}>
              100% royalty-free musical names
            </span>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <GenerateButton onClick={generateNames} loading={isGenerating} label="Generate Band Names" />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Generated Band Names ({bandNames.length})
            </span>
            <CopyButton textToCopy={allNamesString} label="Copy All Names" />
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {bandNames.map((name, idx) => (
              <div
                key={`${name}-${idx}`}
                className="p-4 rounded-xl flex items-center justify-between gap-2 transition-all hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
              >
                <span className="text-sm font-bold truncate select-all" style={{ color: 'var(--text)' }}>
                  {name}
                </span>

                <CopyButton textToCopy={name} size="sm" label="Copy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
