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

type NameGenre = 'fantasy' | 'scifi' | 'modern' | 'medieval' | 'mythic';
type Gender = 'all' | 'masc' | 'fem';

const NAME_DICTIONARIES: Record<NameGenre, {
  mascFirst: string[];
  femFirst: string[];
  neutralFirst: string[];
  surnames: string[];
  titles: string[];
}> = {
  fantasy: {
    mascFirst: ['Eldrin', 'Theron', 'Kaelen', 'Vaelin', 'Darian', 'Bastian', 'Garrick', 'Orion', 'Sylas', 'Rory'],
    femFirst: ['Lyra', 'Vespera', 'Elianna', 'Seraphina', 'Morrigan', 'Aurelia', 'Sylvie', 'Isolde', 'Maeve', 'Thalia'],
    neutralFirst: ['Rowan', 'Sage', 'Kael', 'Valen', 'Rune', 'Zephyr', 'Morgan', 'Nyx', 'Finley', 'Briar'],
    surnames: ['Sunstrider', 'Shadowthorn', 'Ironwood', 'Silverpeak', 'Mistral', 'Frostwarden', 'Oakhollow', 'Nightshade', 'Starweaver', 'Stormbreaker'],
    titles: ['the Undaunted', 'the Spellbinder', 'Keeper of Embers', 'the Shadow Walker', 'the Silver Hand', 'of the Western Veil'],
  },
  scifi: {
    mascFirst: ['Jax', 'Aaron', 'Cyrus', 'Orson', 'Deckard', 'Corvin', 'Vance', 'Tiberius', 'Riker', 'Silas'],
    femFirst: ['Kira', 'Nova', 'Astra', 'Vesper', 'Tess', 'Juno', 'Lyra', 'Xanthe', 'Sloan', 'Raven'],
    neutralFirst: ['Zero', 'Vector', 'Pixel', 'Echo', 'Flux', 'Cipher', 'Helix', 'Ash', 'Core', 'Reese'],
    surnames: ['Vance', 'Mercer', 'Chen', 'Cross', 'Kowalski', 'Sterling', 'Takahashi', 'Reyes', 'Novak', 'Holloway'],
    titles: ['Prime', 'Flight Commander', 'of Orbital Station 7', 'the Data Courier', 'Sector Specialist', 'Deep Space Surveyor'],
  },
  modern: {
    mascFirst: ['Alexander', 'Julian', 'Lucas', 'Liam', 'Gabriel', 'Henry', 'Marcus', 'Samuel', 'Sebastian', 'Oliver'],
    femFirst: ['Maya', 'Elena', 'Sophia', 'Isla', 'Chloe', 'Amara', 'Victoria', 'Charlotte', 'Grace', 'Harper'],
    neutralFirst: ['Jordan', 'Taylor', 'Morgan', 'Riley', 'Cameron', 'Avery', 'Sam', 'Casey', 'Parker', 'Quinn'],
    surnames: ['Bennett', 'Hayes', 'Foster', 'Russo', 'Sinclair', 'Castillo', 'Whitmore', 'Thornton', 'Blackwood', 'Gallagher'],
    titles: ['Esq.', 'MD', 'Investigative Sleuth', 'Lead Architect', 'Founding Partner'],
  },
  medieval: {
    mascFirst: ['Arthur', 'Godfrey', 'William', 'Geoffrey', 'Alastair', 'Gareth', 'Percival', 'Edmund', 'Baldwin', 'Richard'],
    femFirst: ['Eleanor', 'Gwendolyn', 'Beatrix', 'Matilda', 'Rowena', 'Genevieve', 'Catherine', 'Margot', 'Constance', 'Adelaide'],
    neutralFirst: ['Robin', 'Peyton', 'Kendall', 'Gale', 'Ellis', 'Sinclair', 'Beverly'],
    surnames: ['of Warwick', 'Pendelton', 'de Montfort', 'Blackwood', 'Chaucer', 'Hastings', 'Lancaster', 'Fitzroy', 'Beaumont'],
    titles: ['Knight of the Realm', 'Lord Chancellor', 'Lady of the Lake', 'the Just', 'the Ironhearted'],
  },
  mythic: {
    mascFirst: ['Aurelius', 'Valerius', 'Dionysus', 'Cassian', 'Thaddeus', 'Leander', 'Perseus', 'Evander', 'Atlas', 'Apollo'],
    femFirst: ['Calliope', 'Zephyra', 'Artemis', 'Cassandra', 'Penelope', 'Athena', 'Selene', 'Helena', 'Daphne', 'Hera'],
    neutralFirst: ['Orion', 'Phoenix', 'Sol', 'Nyx', 'Styx', 'Chaos', 'Echo', 'Iris'],
    surnames: ['of Delphi', 'Starlight', 'the Aegis', 'Olympus', 'Aethelgard', 'Chronos', 'Solaris'],
    titles: ['the Oracle', 'Wielder of the Trident', 'the Celestial', 'Voice of the Muses', 'Bringer of Dawn'],
  },
};

export default function CharacterNameGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('character-name-generator')!, []);

  const [genre, setGenre] = useState<NameGenre>('fantasy');
  const [gender, setGender] = useState<Gender>('all');
  const [includeTitle, setIncludeTitle] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(12);

  const [generatedNames, setGeneratedNames] = useState<string[]>([
    'Eldrin Sunstrider the Undaunted',
    'Lyra Shadowthorn, Keeper of Embers',
    'Theron Ironwood the Silver Hand',
    'Vespera Mistral of the Western Veil',
    'Kaelen Frostwarden the Shadow Walker',
    'Elianna Starweaver the Spellbinder',
    'Rowan Nightshade the Undaunted',
    'Darian Stormbreaker, Keeper of Embers',
    'Isolde Silverpeak the Silver Hand',
    'Sylas Oakhollow of the Western Veil',
    'Maeve Sunstrider the Spellbinder',
    'Bastian Shadowthorn the Shadow Walker'
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const generateNames = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const dict = NAME_DICTIONARIES[genre] || NAME_DICTIONARIES.fantasy;
      const results: string[] = [];

      for (let i = 0; i < quantity; i++) {
        let firstPool: string[] = [];

        if (gender === 'masc') {
          firstPool = dict.mascFirst;
        } else if (gender === 'fem') {
          firstPool = dict.femFirst;
        } else {
          firstPool = [...dict.mascFirst, ...dict.femFirst, ...dict.neutralFirst];
        }

        const first = firstPool[Math.floor(Math.random() * firstPool.length)];
        const last = dict.surnames[Math.floor(Math.random() * dict.surnames.length)];
        const title = dict.titles[Math.floor(Math.random() * dict.titles.length)];

        let fullName = `${first} ${last}`;
        if (includeTitle && Math.random() > 0.3) {
          fullName = `${first} ${last} ${title.startsWith('the') || title.startsWith('of') ? title : `, ${title}`}`;
        }

        results.push(fullName);
      }

      setGeneratedNames(results);
      setIsGenerating(false);
    }, 120);
  }, [genre, gender, includeTitle, quantity]);

  const handleReset = () => {
    setGenre('fantasy');
    setGender('all');
    setIncludeTitle(true);
    setQuantity(12);
  };

  const allNamesString = generatedNames.join('\n');

  const faqs: FAQItem[] = [
    {
      question: 'Can I generate character names for my D&D campaign?',
      answer:
        'Yes! The Fantasy, Medieval, and Mythic presets are specifically tuned with surnames and titles that fit tabletop RPG campaigns seamlessly.',
    },
    {
      question: 'Are these names safe to use in published books and games?',
      answer:
        'Yes, all character name combinations are 100% royalty-free and available for commercial publishing.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Character Name Generator
          </h2>
          <p>
            Find the perfect name for your novel protagonist, D&amp;D adventurer, or video game character. The VEYLO Character Name Generator combines authentic first names, heritage surnames, and legendary epithets across 5 major fiction genres.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🐉 Fantasy &amp; RPG</h3>
              <p className="text-[11px]">Heroic elven, dwarven, and wizarding names with evocative clan titles.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🚀 Cyberpunk &amp; Sci-Fi</h3>
              <p className="text-[11px]">Sleek callsigns, pilot ranks, and futuristic corporate aliases.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚔️ Medieval &amp; Mythic</h3>
              <p className="text-[11px]">Noble house lineages and ancient Greco-Roman pantheon monikers.</p>
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
            {/* Genre */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="char-genre" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Genre Style
              </label>
              <select
                id="char-genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value as NameGenre)}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="fantasy">🐉 High Fantasy &amp; RPG</option>
                <option value="scifi">🚀 Sci-Fi &amp; Cyberpunk</option>
                <option value="modern">🏙️ Modern Realism</option>
                <option value="medieval">⚔️ Historical &amp; Medieval</option>
                <option value="mythic">⚡ Mythological &amp; Ancient</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gender-filter" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Gender Preference
              </label>
              <select
                id="gender-filter"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="all">All / Neutral Blend</option>
                <option value="masc">Masculine Leaning</option>
                <option value="fem">Feminine Leaning</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="char-qty" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Quantity
              </label>
              <select
                id="char-qty"
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
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs" style={{ borderTop: '1px solid var(--border-c)' }}>
            <label className="flex items-center gap-2 font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={includeTitle}
                onChange={(e) => setIncludeTitle(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Include Character Titles &amp; Epithets</span>
            </label>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <GenerateButton onClick={generateNames} loading={isGenerating} label="Generate Names" />
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
              Generated Character Names ({generatedNames.length})
            </span>
            <CopyButton textToCopy={allNamesString} label="Copy All Names" />
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {generatedNames.map((name, idx) => (
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
