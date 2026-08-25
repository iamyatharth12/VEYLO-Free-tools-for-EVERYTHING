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

const THEMES: Record<string, { prefixes: string[]; roots: string[]; suffixes: string[] }> = {
  gaming: {
    prefixes: ['Shadow', 'Viper', 'Apex', 'Cyber', 'Neon', 'Phantom', 'Ghost', 'Nova', 'Frost', 'Hyper', 'Rogue', 'Titan', 'Stealth', 'Inferno', 'Echo'],
    roots: ['Striker', 'Slayer', 'Sniper', 'Knight', 'Blade', 'Vortex', 'Hunter', 'Drift', 'Pulse', 'Reaper', 'Specter', 'Wraith', 'Matrix', 'Hawk', 'Ninja'],
    suffixes: ['Gaming', 'Ops', 'Prime', 'Elite', 'HQ', 'Pro', 'God', 'X', 'Zero', 'FPS', 'GG', 'Squad'],
  },
  tech: {
    prefixes: ['Byte', 'Cyber', 'Quantum', 'Pixel', 'Vector', 'Logic', 'Code', 'Binary', 'Hex', 'Synth', 'Nano', 'Data', 'Grid', 'Dev', 'Stack'],
    roots: ['Node', 'Pulse', 'Kernel', 'Flux', 'Cipher', 'Forge', 'Loop', 'Nexus', 'Bit', 'Wave', 'Core', 'Script', 'Byte', 'Sync', 'Vault'],
    suffixes: ['Dev', 'IO', 'Tech', 'Lab', 'Net', 'Cloud', 'Sys', 'OS', 'App', 'AI', 'CLI', 'API'],
  },
  aesthetic: {
    prefixes: ['Velvet', 'Moon', 'Solar', 'Aura', 'Celestial', 'Pastel', 'Astral', 'Cosmic', 'Golden', 'Silver', 'Quiet', 'Lofi', 'Cloudy', 'Lucid', 'Silk'],
    roots: ['Petal', 'Mist', 'Bloom', 'Echo', 'Tide', 'Glow', 'Haven', 'Breeze', 'Rain', 'Dusk', 'Dawn', 'Wander', 'Dream', 'Gleam', 'Oasis'],
    suffixes: ['Vibes', 'Mood', 'Aura', 'Studio', 'Notes', 'Space', 'Club', 'Art', 'Diary', 'Tales'],
  },
  fantasy: {
    prefixes: ['Eldritch', 'Mythic', 'Dragon', 'Rune', 'Arcane', 'Frost', 'Storm', 'Shadow', 'Iron', 'Star', 'Thunder', 'Ancient', 'Silver', 'Blood', 'Moon'],
    roots: ['Weaver', 'Warlock', 'Paladin', 'Mage', 'Fang', 'Claw', 'Grim', 'Lore', 'Vale', 'Keep', 'Crown', 'Spell', 'Flame', 'Rider', 'Shield'],
    suffixes: ['Born', 'Bane', 'Rider', 'Heart', 'Song', 'Craft', 'Bound', 'Soul', 'Walker'],
  },
  cute: {
    prefixes: ['Chibi', 'Boba', 'Mochi', 'Tiny', 'Puffy', 'Honey', 'Sugar', 'Cozy', 'Sunny', 'Peachy', 'Berry', 'Snuggle', 'Mini', 'Sweet', 'Fluffy'],
    roots: ['Bear', 'Bunny', 'Panda', 'Kitten', 'Sprout', 'Bobo', 'Cookie', 'Puppy', 'Pebble', 'Matcha', 'Donut', 'Boba', 'Puff', 'Butter', 'Berry'],
    suffixes: ['Puff', 'Bean', 'Pie', 'Roll', 'Drop', 'Pop', 'Joy', 'Sprinkles', 'Boba'],
  },
};

export default function UsernameGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('username-generator')!, []);

  const [theme, setTheme] = useState<string>('gaming');
  const [keyword, setKeyword] = useState<string>('');
  const [separator, setSeparator] = useState<'none' | 'underscore' | 'hyphen' | 'dot'>('none');
  const [numberFormat, setNumberFormat] = useState<'none' | 'two' | 'three' | 'random'>('two');
  const [quantity, setQuantity] = useState<number>(12);

  const [usernames, setUsernames] = useState<string[]>([
    'ViperStrike99', 'ShadowReaper_77', 'NovaPulseX', 'CyberKnight42',
    'ApexVortex_01', 'GhostHunter88', 'HyperSpecter', 'StealthBlade_24',
    'FrostStriker99', 'NeonDrift_07', 'PhantomSniper', 'TitanWraith_55'
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const generateUsernames = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const selectedTheme = THEMES[theme] || THEMES.gaming;
      const results: string[] = [];

      const sepMap = {
        none: '',
        underscore: '_',
        hyphen: '-',
        dot: '.',
      };
      const sep = sepMap[separator];

      for (let i = 0; i < quantity; i++) {
        const pList = selectedTheme.prefixes;
        const rList = selectedTheme.roots;
        const sList = selectedTheme.suffixes;

        const prefix = pList[Math.floor(Math.random() * pList.length)];
        const root = rList[Math.floor(Math.random() * rList.length)];
        const suffix = sList[Math.floor(Math.random() * sList.length)];

        let numStr = '';
        if (numberFormat === 'two') {
          numStr = String(Math.floor(10 + Math.random() * 90));
        } else if (numberFormat === 'three') {
          numStr = String(Math.floor(100 + Math.random() * 900));
        } else if (numberFormat === 'random') {
          numStr = Math.random() > 0.5 ? String(Math.floor(1 + Math.random() * 99)) : '';
        }

        let name = '';
        const custom = keyword.trim();

        if (custom) {
          const capitalizedCustom = custom.charAt(0).toUpperCase() + custom.slice(1);
          if (i % 3 === 0) {
            name = `${capitalizedCustom}${sep}${root}${numStr ? sep + numStr : ''}`;
          } else if (i % 3 === 1) {
            name = `${prefix}${sep}${capitalizedCustom}${numStr ? sep + numStr : ''}`;
          } else {
            name = `${capitalizedCustom}${sep}${suffix}${numStr ? sep + numStr : ''}`;
          }
        } else {
          if (i % 2 === 0) {
            name = `${prefix}${sep}${root}${numStr ? (sep || '') + numStr : ''}`;
          } else {
            name = `${prefix}${sep}${suffix}${numStr ? (sep || '') + numStr : ''}`;
          }
        }

        results.push(name);
      }

      setUsernames(results);
      setIsGenerating(false);
    }, 60);
  }, [theme, keyword, separator, numberFormat, quantity]);

  const handleReset = () => {
    setTheme('gaming');
    setKeyword('');
    setSeparator('none');
    setNumberFormat('two');
    setQuantity(12);
  };

  const allUsernamesString = usernames.join('\n');

  const faqs: FAQItem[] = [
    {
      question: 'Can I use a custom keyword or my real name in the generator?',
      answer:
        'Yes. Type your custom keyword, alias, or game character into the "Custom Keyword" input. The generator will blend your keyword intelligently with curated prefixes, styles, and suffixes.',
    },
    {
      question: 'Are these usernames available on platforms like Discord, Twitch, or Steam?',
      answer:
        'Because these names are generated procedurally, many are fresh and unregistered. However, availability depends on each specific platform’s current registrations.',
    },
    {
      question: 'What styles are supported?',
      answer:
        'VEYLO includes presets for Gaming & Esports, Tech & Developer, Aesthetic & Minimalist, Fantasy & RPG, and Cute & Playful.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Username Generator
          </h2>
          <p>
            Finding a unique, memorable username for Discord, Steam, YouTube, Twitch, TikTok, or GitHub can be difficult. The VEYLO Username Generator creates stylized handles tailored to your preferred aesthetic.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎮 Gamertags</h3>
              <p className="text-[11px]">Generate high-impact handles for Valorant, CS2, Fortnite, Apex, and Steam.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>💻 Dev &amp; Tech Handles</h3>
              <p className="text-[11px]">Craft sleek developer aliases for GitHub, X (Twitter), and Discord.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>✨ Aesthetic Profiles</h3>
              <p className="text-[11px]">Create dreamy, clean, and minimalist tags for Instagram and TikTok.</p>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Theme / Style */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="theme-select" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Theme / Style
              </label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="gaming">🎮 Gaming &amp; Esports</option>
                <option value="tech">💻 Tech &amp; Cyber</option>
                <option value="aesthetic">✨ Aesthetic &amp; Minimal</option>
                <option value="fantasy">🐉 Fantasy &amp; RPG</option>
                <option value="cute">🌸 Cute &amp; Playful</option>
              </select>
            </div>

            {/* Custom Keyword */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="keyword-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Custom Keyword (Optional)
              </label>
              <input
                id="keyword-input"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Alex, Ninja, Raven"
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            {/* Numbers Option */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="num-select" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Include Numbers
              </label>
              <select
                id="num-select"
                value={numberFormat}
                onChange={(e) => setNumberFormat(e.target.value as 'none' | 'two' | 'three' | 'random')}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="two">2-Digit Number (e.g. 99)</option>
                <option value="three">3-Digit Number (e.g. 707)</option>
                <option value="random">Random Chance</option>
                <option value="none">No Numbers</option>
              </select>
            </div>

            {/* Separator */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sep-select" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Separator Style
              </label>
              <select
                id="sep-select"
                value={separator}
                onChange={(e) => setSeparator(e.target.value as 'none' | 'underscore' | 'hyphen' | 'dot')}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="none">None (CamelCase)</option>
                <option value="underscore">Underscore (_)</option>
                <option value="hyphen">Hyphen (-)</option>
                <option value="dot">Dot (.)</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="qty-select" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Quantity
              </label>
              <select
                id="qty-select"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value={6}>6 Suggestions</option>
                <option value={12}>12 Suggestions</option>
                <option value={24}>24 Suggestions</option>
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4 pt-4 text-xs" style={{ borderTop: '1px solid var(--border-c)' }}>
            <span style={{ color: 'var(--muted)' }}>
              100% free · Instant one-click copy
            </span>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <GenerateButton onClick={generateUsernames} loading={isGenerating} label="Generate Usernames" />
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
              Generated Handles ({usernames.length})
            </span>
            <CopyButton textToCopy={allUsernamesString} label="Copy All Names" />
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {usernames.map((name, idx) => (
              <div
                key={`${name}-${idx}`}
                className="group p-4 rounded-xl flex items-center justify-between gap-2 transition-all hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
              >
                <span className="text-sm font-bold font-mono truncate select-all" style={{ color: 'var(--text)' }}>
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
