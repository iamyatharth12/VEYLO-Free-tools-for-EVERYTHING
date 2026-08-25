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

interface HybridGenre {
  name: string;
  parents: string[];
  vibe: string;
  bpm: string;
  instruments: string;
  productionTip: string;
}

const GENRE_FUSIONS: HybridGenre[] = [
  {
    name: 'Cyber-Folk (Acoustic Cyberpunk)',
    parents: ['Appalachian Folk', 'Cyberpunk Darksynth'],
    vibe: 'Post-apocalyptic acoustic warmth blended with industrial sub-bass pulses and distorted analog saw waves.',
    bpm: '95 - 110 BPM',
    instruments: 'Fingerpicked banjo, acoustic 12-string guitar, aggressive 808 sub-drops, bitcrushed drum loops',
    productionTip: 'Run acoustic wooden instrument recordings through tape-saturation and modular bitcrush filters.',
  },
  {
    name: 'Glitch-Bossa (Bossa Nova IDM)',
    parents: ['Brazilian Bossa Nova', 'IDM / Glitch-Hop'],
    vibe: 'Breezy, sophisticated Latin jazz chords interrupted by micro-glitch stutter percussion and intricate time signature shifts.',
    bpm: '120 - 135 BPM',
    instruments: 'Nylon classical guitar, upright jazz bass, sampled vinyl shakers, granulating vocal cuts',
    productionTip: 'Keep the harmony breezy and analog while chopping drum breaks into syncopated 32nd-note micro-repeats.',
  },
  {
    name: 'Doom-Disco (Gothic Synth Funk)',
    parents: ['Gothic Post-Punk', 'Italo-Disco'],
    vibe: 'Hypnotic four-on-the-floor disco dance grooves overlaid with brooding baritone vocals and cold subterranean synth leads.',
    bpm: '122 - 128 BPM',
    instruments: 'Punchy four-on-the-floor kick, slurred electric bass riffs, icy choir synths, flanged clean guitar',
    productionTip: 'Drench minor-scale synth leads in stereo chorus and plate reverb while keeping the bassline tight and monophonic.',
  },
  {
    name: 'Trap-Orchestral (Symphonic Drill)',
    parents: ['Classical Chamber Symphony', 'UK / Brooklyn Drill'],
    vibe: 'Sweeping dramatic string quartets and grand piano melodies underpinned by sliding 808 sub-bass and syncopated hi-hat rolls.',
    bpm: '140 - 144 BPM',
    instruments: 'Virtuosic cello & violin stabs, concert grand piano, sliding 808 bass, stuttering 32nd hi-hat triplets',
    productionTip: 'Pitch down classical string samples by 4 semitones with half-speed tape warping before layering 808 slides.',
  },
  {
    name: 'Ambient-Math (Atmospheric Math Rock)',
    parents: ['Midwest Math Rock', 'Deep Ambient Drone'],
    vibe: 'Intricate, tapping electric guitar chord intervals drifting across endless shimmer reverb washes and soft tape loops.',
    bpm: '80 - 100 BPM (Fluid)',
    instruments: 'Clean single-coil electric guitar with shimmer reverb, e-bow swells, subtle modular synth drone, delicate ride cymbal',
    productionTip: 'Use dynamic volume swells and open guitar tunings (FACGCE) with dual delay pedals set to dotted eighth notes.',
  },
  {
    name: 'Afro-Synth (Afrobeats Synthwave)',
    parents: ['West African Afrobeats', '80s Outrun Synthwave'],
    vibe: 'Irresistible syncopated polyrhythmic log-drum grooves fused with warm analog synthesizer arpeggios and neon brass.',
    bpm: '105 - 116 BPM',
    instruments: 'Afrobeats percussion shakers, melodic log-drum 808s, Juno synth chords, lush vocoder hooks',
    productionTip: 'Blend traditional 3-against-2 African polyrhythms with bright 80s analog brass stabs.',
  },
];

export default function MusicGenreGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('music-genre-generator')!, []);

  const [currentGenre, setCurrentGenre] = useState<HybridGenre>(GENRE_FUSIONS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<HybridGenre[]>([]);

  const generateGenre = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const picked = GENRE_FUSIONS[Math.floor(Math.random() * GENRE_FUSIONS.length)];
      setCurrentGenre(picked);
      setHistory(prev => [picked, ...prev.slice(0, 9)]);
      setIsGenerating(false);
    }, 150);
  }, []);

  const copyString = `Hybrid Music Genre: ${currentGenre.name}\nInfluences: ${currentGenre.parents.join(' + ')}\nTempo: ${currentGenre.bpm}\n\nVibe Description:\n${currentGenre.vibe}\n\nInstrumentation:\n${currentGenre.instruments}\n\nProduction Tip:\n${currentGenre.productionTip}`;

  const faqs: FAQItem[] = [
    {
      question: 'How are hybrid genres created?',
      answer:
        'They blend contrasting musical conventions (e.g. acoustic folk instruments paired with industrial synthwave basslines) to spark unique songwriting and sound design directions.',
    },
    {
      question: 'Can I use these concepts for my Spotify releases?',
      answer:
        'Yes! Defining your music under a unique subgenre hook is one of the most effective ways for indie artists and beatmakers to stand out on streaming algorithms.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Music Genre Generator
          </h2>
          <p>
            Tired of creating the exact same chord progressions? The VEYLO Music Genre Generator invents experimental fusion styles that blend contrasting sonic traditions, giving music producers and beatmakers innovative sound design boundaries.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎧 Unique Production Hooks</h3>
              <p className="text-[11px]">Break genre conventions with unexpected rhythm and synth pairings.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎛️ Sound Design Tips</h3>
              <p className="text-[11px]">Actionable plugin and mix tips to blend contrasting audio textures.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🏷️ Artist Branding</h3>
              <p className="text-[11px]">Establish a memorable subgenre identity for your EP and album releases.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Action Header Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Hybrid Genre Studio
            </span>
            <p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Explore unexpected cross-genre musical fusions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ResetButton onClick={() => setCurrentGenre(GENRE_FUSIONS[0])} />
            <GenerateButton onClick={generateGenre} loading={isGenerating} label="Generate Hybrid Genre" />
          </div>
        </div>

        {/* Genre Presentation Card */}
        <div
          className="p-8 sm:p-12 rounded-3xl flex flex-col gap-6 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {currentGenre.parents.map((p, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                >
                  {p}
                </span>
              ))}
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
                {currentGenre.bpm}
              </span>
            </div>

            <CopyButton textToCopy={copyString} label="Copy Genre Profile" />
          </div>

          {/* Genre Title */}
          <h2
            className={`text-2xl sm:text-4xl font-black tracking-tight transition-all duration-200 ${
              isGenerating ? 'opacity-30' : 'opacity-100'
            }`}
            style={{ color: 'var(--text)' }}
          >
            {currentGenre.name}
          </h2>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
            {currentGenre.vibe}
          </p>

          {/* Details Grid */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                🎹 Key Instruments &amp; Textures
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentGenre.instruments}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                💡 Mixing &amp; Production Tip
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--accent)' }}>
                {currentGenre.productionTip}
              </p>
            </div>
          </div>
        </div>

        {/* History Log */}
        {history.length > 1 && (
          <div
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Recent Generated Genres
              </h3>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-[11px] font-semibold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Clear History
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto text-xs">
              {history.map((h, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl flex items-center justify-between gap-3"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <span className="font-bold truncate max-w-md" style={{ color: 'var(--text)' }}>
                    {h.name} <span className="text-xs font-normal opacity-70">({h.bpm})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentGenre(h)}
                    className="text-[10px] font-bold hover:underline flex-shrink-0"
                    style={{ color: 'var(--accent)' }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
