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

type ArtGenre = 'scifi' | 'fantasy' | 'environment' | 'cyberpunk' | 'character';

interface ArtPrompt {
  title: string;
  genre: string;
  subject: string;
  environment: string;
  lighting: string;
  composition: string;
  mood: string;
  style: string;
  palette: { name: string; hex: string }[];
}

const ART_PROMPT_DATABASE: Record<ArtGenre, {
  genreName: string;
  titles: string[];
  subjects: string[];
  environments: string[];
  lightings: string[];
  compositions: string[];
  moods: string[];
  styles: string[];
  palettes: { name: string; hex: string }[][];
}> = {
  scifi: {
    genreName: 'Sci-Fi Concept Art',
    titles: ['Deep Orbit Discovery', 'Titan Rover Recon', 'The Derelict Signal', 'Solar Flare Harvest'],
    subjects: ['An astronaut in a heavily patched EVA suit kneeling before a glowing crystalline monolith'],
    environments: ['The dusty ring system of a turquoise gas giant reflecting stellar radiation'],
    lightings: ['Harsh directional blue stellar rim light with soft interior golden helmet glow'],
    compositions: ['Cinematic wide low-angle establishing shot with rule-of-thirds focal balance'],
    moods: ['Quiet awe, cosmic isolation, suspenseful scientific wonder'],
    styles: ['Semi-realistic concept art with detailed hard-surface machinery textures'],
    palettes: [
      [{ name: 'Deep Space', hex: '#0f172a' }, { name: 'Cyan Glow', hex: '#06b6d4' }, { name: 'Stellar Gold', hex: '#fbbf24' }, { name: 'Dust Violet', hex: '#6366f1' }],
    ],
  },
  fantasy: {
    genreName: 'High Fantasy Illustration',
    titles: ['Sanctuary of the Moon Owl', 'The Titan’s Ribs', 'Alchemist at Midnight', 'Rune of the Forgotten Gate'],
    subjects: ['A robed archivist holding an enchanted glass lantern that reveals hidden spectral glyphs'],
    environments: ['An overgrown cathedral carved into the petrified roots of an ancient world tree'],
    lightings: ['Ethereal bioluminescent blue spore glow contrasted by warm golden lantern radiance'],
    compositions: ['Three-quarter perspective looking up through dramatic vaulted gothic stone arches'],
    moods: ['Mystical, ancient, sacred reverence, tranquil mystery'],
    styles: ['Lush digital oil painting with textured brushwork and atmospheric fog depth'],
    palettes: [
      [{ name: 'Midnight Moss', hex: '#14532d' }, { name: 'Ethereal Teal', hex: '#2dd4bf' }, { name: 'Lantern Amber', hex: '#f59e0b' }, { name: 'Ancient Stone', hex: '#78716c' }],
    ],
  },
  environment: {
    genreName: 'Landscape & Environment',
    titles: ['Fog over the Sunken Valley', 'The Solitary Lighthouse', 'Autumn Cloudbreak', 'Glacial Bastion'],
    subjects: ['A lone wooden suspension bridge spanning a deep misty canyon between towering basalt spires'],
    environments: ['A windswept Scottish highland plateau during late autumn sunset'],
    lightings: ['Golden hour volumetric sun shafts cutting through dense drifting mountain valley fog'],
    compositions: ['Panoramic panoramic landscape with strong leading lines created by the canyon river'],
    moods: ['Vast, serene, untamed wilderness, breathtaking scale'],
    styles: ['Atmospheric matte painting with deep focal depth-of-field separation'],
    palettes: [
      [{ name: 'Mist Charcoal', hex: '#334155' }, { name: 'Highland Rust', hex: '#b45309' }, { name: 'Sunset Peach', hex: '#fb923c' }, { name: 'Pine Forest', hex: '#1e3a2f' }],
    ],
  },
  cyberpunk: {
    genreName: 'Cyberpunk & Dystopian Streetscape',
    titles: ['Alleyway Noodle Bar 2099', 'Rain on Holograms', 'Drone Courier Haven', 'Neon High-Rise'],
    subjects: ['A cybernetically augmented delivery courier huddled under a vinyl umbrella next to a food stall'],
    environments: ['A cramped, vertical Tokyo alleyway choked with cables, steam vents, and glowing neon kanji signs'],
    lightings: ['Vivid magenta and electric cyan neon reflections shimmering in rain-soaked asphalt puddles'],
    compositions: ['Intimate dutch-angle street-level perspective with foreground steam framing the subject'],
    moods: ['Gritty, rain-drenched, high-tech melancholy, vibrant urban energy'],
    styles: ['Stylized cel-shaded digital illustration with sharp edge highlights and chromatic aberration'],
    palettes: [
      [{ name: 'Cyber Magenta', hex: '#ec4899' }, { name: 'Electric Cyan', hex: '#22d3ee' }, { name: 'Asphalt Black', hex: '#020617' }, { name: 'Warning Yellow', hex: '#eab308' }],
    ],
  },
  character: {
    genreName: 'Character Portrait & Persona',
    titles: ['The Wandering Herbalist', 'The Clockwork Duelist', 'Oracle of the Obsidian Sea', 'The Starchaser'],
    subjects: ['A close-up character portrait of an aged desert nomad with intricate facial markings and brass goggles'],
    environments: ['A warm desert tent illuminated by burning aromatic incense and floating candle globes'],
    lightings: ['Warm chiaroscuro side-lighting casting dramatic sculptural shadows across facial features'],
    compositions: ['Tight bust portrait with slight head turn, intense eye-contact, and shallow depth of field'],
    moods: ['Intense, wise, weathered resilience, storytelling gaze'],
    styles: ['Classical portraiture rendering with realistic skin sub-surface scattering'],
    palettes: [
      [{ name: 'Desert Terracotta', hex: '#9a3412' }, { name: 'Brass Ochre', hex: '#d97706' }, { name: 'Warm Cream', hex: '#fef3c7' }, { name: 'Indigo Shadow', hex: '#1e1b4b' }],
    ],
  },
};

export default function ArtPromptGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('art-prompt-generator')!, []);

  const [genre, setGenre] = useState<ArtGenre>('scifi');
  const [currentPrompt, setCurrentPrompt] = useState<ArtPrompt>({
    title: 'Deep Orbit Discovery',
    genre: 'Sci-Fi Concept Art',
    subject: 'An astronaut in a heavily patched EVA suit kneeling before a glowing crystalline monolith',
    environment: 'The dusty ring system of a turquoise gas giant reflecting stellar radiation',
    lighting: 'Harsh directional blue stellar rim light with soft interior golden helmet glow',
    composition: 'Cinematic wide low-angle establishing shot with rule-of-thirds focal balance',
    mood: 'Quiet awe, cosmic isolation, suspenseful scientific wonder',
    style: 'Semi-realistic concept art with detailed hard-surface machinery textures',
    palette: [
      { name: 'Deep Space', hex: '#0f172a' },
      { name: 'Cyan Glow', hex: '#06b6d4' },
      { name: 'Stellar Gold', hex: '#fbbf24' },
      { name: 'Dust Violet', hex: '#6366f1' },
    ],
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const generateArtPrompt = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const data = ART_PROMPT_DATABASE[genre] || ART_PROMPT_DATABASE.scifi;

      const title = data.titles[Math.floor(Math.random() * data.titles.length)];
      const subject = data.subjects[Math.floor(Math.random() * data.subjects.length)];
      const environment = data.environments[Math.floor(Math.random() * data.environments.length)];
      const lighting = data.lightings[Math.floor(Math.random() * data.lightings.length)];
      const composition = data.compositions[Math.floor(Math.random() * data.compositions.length)];
      const mood = data.moods[Math.floor(Math.random() * data.moods.length)];
      const style = data.styles[Math.floor(Math.random() * data.styles.length)];
      const palette = data.palettes[Math.floor(Math.random() * data.palettes.length)];

      setCurrentPrompt({
        title,
        genre: data.genreName,
        subject,
        environment,
        lighting,
        composition,
        mood,
        style,
        palette,
      });

      setIsGenerating(false);
    }, 150);
  }, [genre]);

  const handleReset = () => {
    setGenre('scifi');
  };

  const copyString = `Art Prompt: "${currentPrompt.title}" (${currentPrompt.genre})\n\nSubject: ${currentPrompt.subject}\nEnvironment: ${currentPrompt.environment}\nLighting: ${currentPrompt.lighting}\nComposition: ${currentPrompt.composition}\nMood: ${currentPrompt.mood}\nStyle: ${currentPrompt.style}\n\nColor Palette:\n` +
    currentPrompt.palette.map(c => `• ${c.name} (${c.hex})`).join('\n');

  const faqs: FAQItem[] = [
    {
      question: 'How do these multi-layer prompts help digital & traditional artists?',
      answer:
        'Instead of generic one-liners, this generator structures the 6 fundamental pillars of strong illustration: Subject, Environment, Lighting, Composition, Mood, and Color Theory.',
    },
    {
      question: 'Can I use these prompts for 3D modeling and rendering practice?',
      answer:
        'Absolutely! Blender, Maya, and ZBrush 3D artists use these briefs to practice asset set-dressing, environmental lighting rigs, and shader creation.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Art Prompt Generator
          </h2>
          <p>
            Break artistic block with structured visual briefs. The VEYLO Art Prompt Generator supplies digital painters, illustrators, and concept artists with comprehensive composition framing, dramatic lighting scenarios, and curated color palettes.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎨 Digital Painting</h3>
              <p className="text-[11px]">Practice atmospheric depth, texture rendering, and lighting contrast.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📐 Composition Study</h3>
              <p className="text-[11px]">Learn cinematic camera angles, dutch tilts, and rule-of-thirds framing.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🌈 Color Harmonies</h3>
              <p className="text-[11px]">Get 4-color hex swatches curated for emotional mood and value balance.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Genre Selector Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Category:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'scifi', label: '🚀 Sci-Fi Concept' },
                { id: 'fantasy', label: '🐉 High Fantasy' },
                { id: 'environment', label: '🏞️ Environment' },
                { id: 'cyberpunk', label: '⚡ Cyberpunk' },
                { id: 'character', label: '👤 Character Portrait' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setGenre(cat.id as ArtGenre)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    genre === cat.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: genre === cat.id ? 'var(--accent)' : 'var(--surface-2)',
                    color: genre === cat.id ? '#ffffff' : 'var(--text)',
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
            <GenerateButton onClick={generateArtPrompt} loading={isGenerating} label="Generate Art Brief" />
          </div>
        </div>

        {/* Prompt Showcase Card */}
        <div
          className="p-8 sm:p-12 rounded-3xl flex flex-col gap-6 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full"
              style={{
                background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))',
                color: 'var(--accent)',
              }}
            >
              {currentPrompt.genre}
            </span>

            <CopyButton textToCopy={copyString} label="Copy Art Brief" />
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-black tracking-tight transition-all duration-200 ${
              isGenerating ? 'opacity-30' : 'opacity-100'
            }`}
            style={{ color: 'var(--text)' }}
          >
            {currentPrompt.title}
          </h2>

          {/* Color Palette Swatches */}
          <div className="p-4 rounded-2xl flex flex-col gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              🎨 Recommended Color Palette
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {currentPrompt.palette.map((color, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl flex items-center gap-2.5 shadow-2xs"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 shadow-xs border border-white/20"
                    style={{ background: color.hex }}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                      {color.name}
                    </span>
                    <span className="text-[10px] font-mono opacity-60">
                      {color.hex}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Art Elements Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                🎯 Primary Subject
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentPrompt.subject}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                🏞️ Environment &amp; Background
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentPrompt.environment}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                💡 Lighting &amp; Atmosphere
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--accent)' }}>
                {currentPrompt.lighting}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                📐 Composition &amp; Camera Angle
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentPrompt.composition}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
