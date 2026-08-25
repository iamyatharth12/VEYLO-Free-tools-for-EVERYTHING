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

type MusicStyle = 'synthwave' | 'indie' | 'lofi' | 'pop' | 'rnb' | 'folk';

interface SongConcept {
  title: string;
  genre: string;
  mood: string;
  bpm: number;
  keySig: string;
  instruments: string;
  lyricTheme: string;
  hookConcept: string;
  bridgeShift: string;
}

const SONG_DATABASE: Record<MusicStyle, {
  genreName: string;
  titles: string[];
  moods: string[];
  bpmRange: [number, number];
  keys: string[];
  instrumentations: string[];
  lyricThemes: string[];
  hookConcepts: string[];
  bridgeShifts: string[];
}> = {
  synthwave: {
    genreName: 'Synthwave & Retrowave',
    titles: ['Neon Horizon', 'Midnight Vector', 'Cybernetic Coastline', 'Analog Highway', 'Laser Grid'],
    moods: ['Nostalgic, cinematic, high-speed night drive, futuristic retro'],
    bpmRange: [110, 128],
    keys: ['D Minor', 'A Minor', 'F# Minor', 'B Minor'],
    instrumentations: ['Juno-106 analog synth pads, gated LinnDrum snare, Roland TB-303 arpeggiated bassline, chorus guitar solo'],
    lyricThemes: ['A midnight escape across an empty coastal highway fleeing a glowing city that never sleeps.'],
    hookConcepts: ['Vocal vocoder hook singing about leaving past identities behind in the rear-view mirror.'],
    bridgeShifts: ['Drop all drums into an atmospheric tape-delayed synthesizer chord breakdown with filtered sweeps.'],
  },
  indie: {
    genreName: 'Indie Rock & Dream Pop',
    titles: ['Polaroid Autumn', 'Static on the Wire', 'Glasshouse Bloom', 'Lavender Street', 'Paper Lanterns'],
    moods: ['Melancholic yet uplifting, bittersweet, warm vintage fuzz'],
    bpmRange: [120, 142],
    keys: ['E Major', 'G Major', 'C# Minor', 'A Major'],
    instrumentations: ['Jangle electric guitar with spring reverb, overdriven Fender P-Bass, acoustic drums with room mic bleed, Mellotron strings'],
    lyricThemes: ['Rediscovering a box of forgotten childhood photographs during a stormy Sunday apartment move.'],
    hookConcepts: ['Anthemic gang-vocal harmony chant about how time slips away like water between fingers.'],
    bridgeShifts: ['Fuzz bass swell transitioning into a driving half-time drum groove with layered falsetto harmonies.'],
  },
  lofi: {
    genreName: 'Lo-Fi Hip-Hop & Chillhop',
    titles: ['Rainy Windowpane', 'Coffee Shop Sketches', 'Dusty Vinyl 3AM', 'Tokyo Alleyway', 'Autumn Breeze'],
    moods: ['Cozy, introspective, calming study beats, nostalgic warmth'],
    bpmRange: [72, 88],
    keys: ['Eb Major 7th', 'Bb Minor 9th', 'Ab Major 7th'],
    instrumentations: ['Rhodes electric piano with vinyl crackle & wow/flutter, lazy sidechained kick/snare, upright jazz bass, muted trumpet sample'],
    lyricThemes: ['Watching raindrops trace lines down a café window while sketching passersby in a notebook.'],
    hookConcepts: ['Mellow vocal chop repeating a dreamy reminder to breathe and take the day one step at a time.'],
    bridgeShifts: ['Strip down to solo Rhodes chords with ambient rain and cassette tape hiss background texture.'],
  },
  pop: {
    genreName: 'Modern Alt-Pop & Dance',
    titles: ['Electric Afterglow', 'Silver Lining', 'Mirrorball Echo', 'Zero Gravity', 'Midnight Confession'],
    moods: ['Catchy, energetic, euphoric, danceable vulnerability'],
    bpmRange: [118, 130],
    keys: ['C Major', 'F Major', 'G Major', 'B Minor'],
    instrumentations: ['Punchy 808 sub-bass, four-on-the-floor kick, rhythmic vocal chops, bright pluck synth layers, shimmering hi-hats'],
    lyricThemes: ['The exhilarating rush of admitting feelings to your best friend on a crowded dance floor at 2 AM.'],
    hookConcepts: ['High-energy syncopated vocal melody with infectious stutter syllables and a soaring top-line drop.'],
    bridgeShifts: ['Total acoustic silence followed by a single heartbeat kick build-up into the final explosive chorus.'],
  },
  rnb: {
    genreName: 'R&B & Neo-Soul',
    titles: ['Velvet Hour', 'Silk & Smoke', 'Late Night Dial', 'Golden Hour Groove', 'Soulful Resonance'],
    moods: ['Smooth, sensual, introspective, late-night groove'],
    bpmRange: [80, 96],
    keys: ['Db Major', 'F Minor', 'Gb Major 7th'],
    instrumentations: ['Warm Fender Rhodes, smooth nylon-string guitar riffs, deep sub-bass, crisp rimshot snare, subtle brass horn stabs'],
    lyricThemes: ['The delicate boundary between two creative collaborators realizing their mutual unspoken attraction.'],
    hookConcepts: ['Layered stacked harmonies with intricate vocal runs and velvety falsetto ad-libs.'],
    bridgeShifts: ['A lush key modulation with expressive neo-soul guitar licks and jazz chord extensions.'],
  },
  folk: {
    genreName: 'Acoustic & Indie Folk',
    titles: ['Timber & Pine', 'The Mountain Valley', 'Riverbed Stones', 'Lantern by the Gate', 'Wildflower Ridge'],
    moods: ['Earthy, raw, intimate storytelling, acoustic warmth'],
    bpmRange: [92, 115],
    keys: ['D Major', 'G Major', 'E Minor'],
    instrumentations: ['Fingerpicked acoustic dreadnought guitar, banjo, rustic fiddle, wooden stomp box, upright acoustic bass, cello'],
    lyricThemes: ['A traveler returning to their ancestral mountain hometown after a decade of wandering abroad.'],
    hookConcepts: ['Full-room acoustic vocal chorus accompanied by foot stomps and handclaps.'],
    bridgeShifts: ['A delicate cello and fiddle counter-melody dialogue over soft fingerpicked guitar harmonics.'],
  },
};

export default function SongIdeaGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('song-idea-generator')!, []);

  const [style, setStyle] = useState<MusicStyle>('synthwave');
  const [currentSong, setCurrentSong] = useState<SongConcept>({
    title: 'Neon Horizon',
    genre: 'Synthwave & Retrowave',
    mood: 'Nostalgic, cinematic, high-speed night drive, futuristic retro',
    bpm: 118,
    keySig: 'D Minor',
    instruments: 'Juno-106 analog synth pads, gated LinnDrum snare, Roland TB-303 arpeggiated bassline, chorus guitar solo',
    lyricTheme: 'A midnight escape across an empty coastal highway fleeing a glowing city that never sleeps.',
    hookConcept: 'Vocal vocoder hook singing about leaving past identities behind in the rear-view mirror.',
    bridgeShift: 'Drop all drums into an atmospheric tape-delayed synthesizer chord breakdown with filtered sweeps.',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const generateSong = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const data = SONG_DATABASE[style] || SONG_DATABASE.synthwave;

      const title = data.titles[Math.floor(Math.random() * data.titles.length)];
      const mood = data.moods[Math.floor(Math.random() * data.moods.length)];
      const minBpm = data.bpmRange[0];
      const maxBpm = data.bpmRange[1];
      const bpm = Math.floor(minBpm + Math.random() * (maxBpm - minBpm + 1));
      const keySig = data.keys[Math.floor(Math.random() * data.keys.length)];
      const instruments = data.instrumentations[Math.floor(Math.random() * data.instrumentations.length)];
      const lyricTheme = data.lyricThemes[Math.floor(Math.random() * data.lyricThemes.length)];
      const hookConcept = data.hookConcepts[Math.floor(Math.random() * data.hookConcepts.length)];
      const bridgeShift = data.bridgeShifts[Math.floor(Math.random() * data.bridgeShifts.length)];

      setCurrentSong({
        title,
        genre: data.genreName,
        mood,
        bpm,
        keySig,
        instruments,
        lyricTheme,
        hookConcept,
        bridgeShift,
      });

      setIsGenerating(false);
    }, 150);
  }, [style]);

  const handleReset = () => {
    setStyle('synthwave');
  };

  const copyString = `Song Concept: "${currentSong.title}"\nGenre: ${currentSong.genre} | Tempo: ${currentSong.bpm} BPM | Key: ${currentSong.keySig}\nMood: ${currentSong.mood}\n\nInstrumentation:\n${currentSong.instruments}\n\nLyrical Theme:\n${currentSong.lyricTheme}\n\nHook / Chorus Idea:\n${currentSong.hookConcept}\n\nBridge / Dynamic Shift:\n${currentSong.bridgeShift}`;

  const faqs: FAQItem[] = [
    {
      question: 'Are the lyrics or titles copyrighted?',
      answer:
        'No. All concepts, titles, and chord/instrumentation structures are original and royalty-free for songwriters, producers, and commercial releases.',
    },
    {
      question: 'How do BPM and Key Signature recommendations help?',
      answer:
        'They give you a solid production baseline to set your Digital Audio Workstation (DAW) project tempo and musical scale before laying down your first chord progressions.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Song Idea Generator
          </h2>
          <p>
            Overcome beatmaker block and lyricist fatigue. The VEYLO Song Idea Generator crafts complete songwriting briefs featuring genre guidelines, BPM tempos, key signatures, instrumental arrangements, and original thematic hook concepts.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎹 Beat Producers</h3>
              <p className="text-[11px]">Get instant BPM tempos, key signatures, and signature instrument recipes.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>✍️ Lyricists &amp; Topliners</h3>
              <p className="text-[11px]">Discover fresh emotional themes and chorus hook concepts to write lyrics.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎸 Bands &amp; Jamming</h3>
              <p className="text-[11px]">Break routine jam sessions with unexpected genre fusions and bridge ideas.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Style Selector Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Genre:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'synthwave', label: '⚡ Synthwave' },
                { id: 'indie', label: '🎸 Indie Rock' },
                { id: 'lofi', label: '☕ Lo-Fi Chill' },
                { id: 'pop', label: '✨ Alt-Pop' },
                { id: 'rnb', label: '🎷 R&B / Soul' },
                { id: 'folk', label: '🌾 Acoustic Folk' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setStyle(cat.id as MusicStyle)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    style === cat.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: style === cat.id ? 'var(--accent)' : 'var(--surface-2)',
                    color: style === cat.id ? '#ffffff' : 'var(--text)',
                    border: '1px solid var(--border-c)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ResetButton onClick={handleReset} />
            <GenerateButton onClick={generateSong} loading={isGenerating} label="Generate Song Concept" />
          </div>
        </div>

        {/* Concept Showcase Card */}
        <div
          className="p-8 sm:p-12 rounded-3xl flex flex-col gap-6 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full"
                style={{
                  background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))',
                  color: 'var(--accent)',
                }}
              >
                {currentSong.genre}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
                {currentSong.bpm} BPM
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
                Key: {currentSong.keySig}
              </span>
            </div>

            <CopyButton textToCopy={copyString} label="Copy Song Brief" />
          </div>

          {/* Title and Mood */}
          <div className="flex flex-col gap-1">
            <h2
              className={`text-2xl sm:text-4xl font-black tracking-tight transition-all duration-200 ${
                isGenerating ? 'opacity-30' : 'opacity-100'
              }`}
              style={{ color: 'var(--text)' }}
            >
              &ldquo;{currentSong.title}&rdquo;
            </h2>
            <p className="text-xs sm:text-sm italic" style={{ color: 'var(--muted)' }}>
              Mood: {currentSong.mood}
            </p>
          </div>

          {/* Song Brief Details Grid */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                🎹 Instrumentation Arrangement
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentSong.instruments}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                📖 Lyrical Theme
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentSong.lyricTheme}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                🎤 Chorus Hook Concept
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--accent)' }}>
                {currentSong.hookConcept}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                🔄 Bridge &amp; Dynamic Shift
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentSong.bridgeShift}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
