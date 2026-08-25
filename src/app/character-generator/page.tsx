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

type Archetype = 'fantasy' | 'scifi' | 'modern' | 'noir' | 'cyberpunk';

interface CharacterDossier {
  name: string;
  alias: string;
  age: number;
  genre: string;
  occupation: string;
  personality: string;
  quirk: string;
  strength: string;
  flaw: string;
  goal: string;
  secret: string;
}

const ARCHETYPE_DATA: Record<Archetype, {
  genre: string;
  names: { first: string; last: string; alias: string }[];
  occupations: string[];
  personalities: string[];
  quirks: string[];
  strengths: string[];
  flaws: string[];
  goals: string[];
  secrets: string[];
}> = {
  fantasy: {
    genre: 'Fantasy & RPG',
    names: [
      { first: 'Eldrin', last: 'Vaelen', alias: 'The Whispering Blade' },
      { first: 'Lyra', last: 'Sunstrider', alias: 'Keeper of Ember' },
      { first: 'Theron', last: 'Ironwood', alias: 'The Broken Shield' },
      { first: 'Vespera', last: 'Nightshade', alias: 'Mistweaver' },
      { first: 'Kaelen', last: 'Frostpeak', alias: 'Rune Carver' },
    ],
    occupations: ['Court Alchemist', 'Exiled Paladin', 'Guild Cartographer', 'Runic Blacksmith', 'Wandering Bard'],
    personalities: ['Stoic and fiercely loyal, but harbors deep mistrust of authority.', 'Eccentric scholar obsessed with ancient forgotten languages.', 'Charismatic rogue with a soft spot for outcasts.'],
    quirks: ['Always cleans coins with lemon water before spending them.', 'Speaks to crows as if they are former colleagues.', 'Carries a petrified acorn in their gauntlet at all times.'],
    strengths: ['Mastery of elemental defensive wards and tactical battlefield awareness.', 'Incredible memory for ancient dialects and regional maps.', 'Preternatural agility and silent movement in pitch-black terrain.'],
    flaws: ['Recklessly overconfident when defending personal honor.', 'Refuses to accept magical healing due to a past curse.', 'Cannot resist gambling on high-stakes riddles.'],
    goals: ['Recover the shattered ancestral blade of their fallen house.', 'Find a cure for the creeping petrification curse afflicting their village.', 'Expose the corruption of the High Inquisitor.'],
    secrets: ['Was the accidental architect who opened the demon rift five years ago.', 'Is the true heir to the throne they are currently plotting against.', 'Their magical power comes from an unholy pact made in desperation.'],
  },
  scifi: {
    genre: 'Sci-Fi & Deep Space',
    names: [
      { first: 'Dr. Aaron', last: 'Vance', alias: 'Apex Vector' },
      { first: 'Commander Kira', last: 'Reyes', alias: 'Solaris Nine' },
      { first: 'Jax', last: 'Mercer', alias: 'The Drift Runner' },
      { first: 'Nova', last: 'Chen', alias: 'Core Weaver' },
    ],
    occupations: ['Deep-Space Salvage Captain', 'Orbital AI Bio-Ethicist', 'Hyperdrive Flight Engineer', 'Planetary Surveyor'],
    personalities: ['Pragmatic and calculating under pressure, with dry sarcastic humor.', 'Relentlessly curious researcher who prioritizes discovery over personal safety.'],
    quirks: ['Always calculates odds aloud in decimal fractions.', 'Keeps a preserved soil sample from Earth in an environmental pendant.', 'Refuses to step into artificial gravity lifts.'],
    strengths: ['Can reconfigure damaged propulsion systems using improvised spare parts.', 'Photographic memory for stellar navigation coordinates.', 'High tolerance for zero-G high-radiation environments.'],
    flaws: ['Deep claustrophobia when locked inside standard escape pods.', 'Addicted to high-stimulant synthetic focus patches.', 'Slow to trust biological crew members over ship AI.'],
    goals: ['Locate the lost exploration colony ship where their twin was stationed.', 'Publish the classified findings of the Sagittarius anomaly before being silenced.', 'Earn enough credits to purchase their own independent mining vessel.'],
    secrets: ['Their neural drive contains the stolen encrypted source code of the flagship corporate AI.', 'Accidentally vented a cargo bay that caused a quarantine breach.', 'Is actually an escaped bio-synthetic clone of a deceased fleet admiral.'],
  },
  modern: {
    genre: 'Modern Realism',
    names: [
      { first: 'Maya', last: 'Lin', alias: 'The Fact Finder' },
      { first: 'Julian', last: 'Cross', alias: 'The Quiet Architect' },
      { first: 'Elena', last: 'Russo', alias: 'Street Lawyer' },
      { first: 'Marcus', last: 'Holloway', alias: 'Data Ghost' },
    ],
    occupations: ['Investigative Journalist', 'Crisis Negotiator', 'Urban Wildlife Biologist', 'Forensic Accountant'],
    personalities: ['Sharp-witted, relentless, and observant of human behavioral tells.', 'Quiet introvert with an intense passion for systemic justice.'],
    quirks: ['Fiddles with an antique fountain pen whenever nervous.', 'Counts staircase steps in prime numbers.', 'Only drinks black coffee from ceramic diner mugs.'],
    strengths: ['Unmatched ability to trace hidden financial money trails through shell companies.', 'Calm, de-escalating vocal cadence during extreme hostility.', 'Speed-reading complex legal and technical patents in minutes.'],
    flaws: ['Workaholic insomnia that alienates close friends and family.', 'Perfectionist paralysis when starting new investigative leads.', 'Stubborn refusal to seek medical help for chronic stress.'],
    goals: ['Expose the municipal corruption behind the harbor redevelopment project.', 'Clear their late mentor’s name from false embezzlement charges.', 'Publish their definitive research on disappearing coastal wetlands.'],
    secrets: ['Falsified a key piece of research data early in their career to win an academic grant.', 'Maintains an anonymous whistleblower leak channel targeted by federal agencies.', 'Was once a convicted juvenile hacker before changing identities.'],
  },
  noir: {
    genre: 'Noir & Hardboiled',
    names: [
      { first: 'Vincent', last: 'Caine', alias: 'Shadow Step' },
      { first: 'Lorelei', last: 'Vane', alias: 'The Black Orchid' },
      { first: 'Detective Frank', last: 'Malone', alias: 'Old Iron' },
    ],
    occupations: ['Private Investigator', 'Midnight Jazz Pianist', 'Night Shift Coroner', 'Insurance Claims Sleuth'],
    personalities: ['Cynical exterior hiding a deeply wounded moral conscience.', 'Smooth-talking opportunist who always knows when to vanish into the rain.'],
    quirks: ['Always leaves a matchbook behind at crime scenes.', 'Hums 1940s torch ballads when examining evidence.', 'Checks watch hands against mechanical grandfather clocks.'],
    strengths: ['Reads lies in pupil dilation and pulse variations instantly.', 'Expert hand-to-hand barroom brawler and lockpicker.', 'Deep network of contacts across police precincts and underground speakeasies.'],
    flaws: ['Relies heavily on cheap bourbon to numb past trauma.', 'Cynical fatalism that assumes everyone has a hidden selfish motive.', 'Unable to walk away from a client in genuine distress.'],
    goals: ['Solve the decade-old disappearance of the city mayor’s daughter.', 'Avenge their former partner without ending up in state penitentiary.', 'Pay off their backdated office rent and keep the agency open.'],
    secrets: ['Holds the evidence that would send the current police chief to prison.', 'Covered up a crime committed by their own former partner.', 'Is secretly bankrolled by the city’s most dangerous crime syndicate boss.'],
  },
  cyberpunk: {
    genre: 'Cyberpunk',
    names: [
      { first: 'Zero', last: 'Kowalski', alias: 'Hex Reaver' },
      { first: 'Cipher', last: 'Takahashi', alias: 'Neon Phantom' },
      { first: 'Vee', last: 'Sterling', alias: 'Chrome Saint' },
    ],
    occupations: ['Black-Market Neural Ripperdoc', 'Corporate Infiltration Specialist', 'Drone Swarm Operator'],
    personalities: ['Hyper-alert, technologically augmented, with a cynical view of corporate promises.'],
    quirks: ['Taps fingertips on metal surfaces in rhythmic binary code.', 'Constantly re-calibrates optical HUD overlay colors.'],
    strengths: ['Can bypass military-grade ice firewalls using custom neural decks.', 'Enhanced cybernetic reflexes and low-light optical implants.'],
    flaws: ['Cyberware rejection sickness requiring expensive immunosuppressant blockers.', 'Severe insomnia triggered by persistent augmented reality ads.'],
    goals: ['Steal the memory core containing the backup consciousness of their deceased mentor.', 'Escape the neon sprawl and reach the offshore pirate server colony.'],
    secrets: ['Their prosthetic cyberarm contains a covert corporate tracker they haven’t been able to disable.'],
  },
};

export default function CharacterGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('character-generator')!, []);

  const [archetype, setArchetype] = useState<Archetype>('fantasy');
  const [character, setCharacter] = useState<CharacterDossier>({
    name: 'Eldrin Vaelen',
    alias: 'The Whispering Blade',
    age: 29,
    genre: 'Fantasy & RPG',
    occupation: 'Exiled Paladin',
    personality: 'Stoic and fiercely loyal, but harbors deep mistrust of authority.',
    quirk: 'Always cleans coins with lemon water before spending them.',
    strength: 'Mastery of elemental defensive wards and tactical battlefield awareness.',
    flaw: 'Recklessly overconfident when defending personal honor.',
    goal: 'Recover the shattered ancestral blade of their fallen house.',
    secret: 'Was the accidental architect who opened the demon rift five years ago.',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<CharacterDossier[]>([]);

  const generateCharacter = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const data = ARCHETYPE_DATA[archetype] || ARCHETYPE_DATA.fantasy;

      const nameObj = data.names[Math.floor(Math.random() * data.names.length)];
      const fullName = `${nameObj.first} ${nameObj.last}`;
      const occupation = data.occupations[Math.floor(Math.random() * data.occupations.length)];
      const personality = data.personalities[Math.floor(Math.random() * data.personalities.length)];
      const quirk = data.quirks[Math.floor(Math.random() * data.quirks.length)];
      const strength = data.strengths[Math.floor(Math.random() * data.strengths.length)];
      const flaw = data.flaws[Math.floor(Math.random() * data.flaws.length)];
      const goal = data.goals[Math.floor(Math.random() * data.goals.length)];
      const secret = data.secrets[Math.floor(Math.random() * data.secrets.length)];
      const age = Math.floor(22 + Math.random() * 38);

      const dossier: CharacterDossier = {
        name: fullName,
        alias: nameObj.alias,
        age,
        genre: data.genre,
        occupation,
        personality,
        quirk,
        strength,
        flaw,
        goal,
        secret,
      };

      setCharacter(dossier);
      setHistory(prev => [dossier, ...prev.slice(0, 9)]);
      setIsGenerating(false);
    }, 150);
  }, [archetype]);

  const handleReset = () => {
    setArchetype('fantasy');
    setHistory([]);
  };

  const copyString = `Character Dossier: ${character.name} ("${character.alias}")\nAge: ${character.age} | Genre: ${character.genre} | Role: ${character.occupation}\n\nPersonality: ${character.personality}\nQuirk: ${character.quirk}\nKey Strength: ${character.strength}\nFatal Flaw: ${character.flaw}\nCore Goal: ${character.goal}\nDark Secret: ${character.secret}`;

  const faqs: FAQItem[] = [
    {
      question: 'How can I use these character profiles?',
      answer:
        'They are ideal for fiction writers developing protagonists or antagonists, Dungeon Masters creating rich NPCs for D&D/Pathfinder, and game developers drafting character dossiers.',
    },
    {
      question: 'Are the character names and traits royalty-free?',
      answer:
        'Yes. All generated characters, traits, and secrets are 100% free to use in commercial novels, games, and creative projects.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Character Generator
          </h2>
          <p>
            Create complex, multidimensional characters in seconds. The VEYLO Character Generator constructs realistic personas featuring internal psychological conflicts, distinctive behavioral quirks, fatal flaws, and secret motivations.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎭 Novel Writing</h3>
              <p className="text-[11px]">Generate secondary cast members and foil characters with deep backstory hooks.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎲 Tabletop NPCs</h3>
              <p className="text-[11px]">Instantly equip tavern keepers, bounty hunters, and guild masters with secrets.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎮 Game Design</h3>
              <p className="text-[11px]">Draft game quest givers and companion backstory dialogues.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Archetype Selector Card */}
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
                { id: 'fantasy', label: '🐉 Fantasy & RPG' },
                { id: 'scifi', label: '🚀 Sci-Fi' },
                { id: 'modern', label: '🏙️ Modern Realism' },
                { id: 'noir', label: '🕵️ Noir Detective' },
                { id: 'cyberpunk', label: '⚡ Cyberpunk' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setArchetype(cat.id as Archetype)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    archetype === cat.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: archetype === cat.id ? 'var(--accent)' : 'var(--surface-2)',
                    color: archetype === cat.id ? '#ffffff' : 'var(--text)',
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
            <GenerateButton onClick={generateCharacter} loading={isGenerating} label="Generate Character" />
          </div>
        </div>

        {/* Character Dossier Card */}
        <div
          className="p-8 sm:p-12 rounded-3xl flex flex-col gap-6 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full"
                style={{
                  background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))',
                  color: 'var(--accent)',
                }}
              >
                {character.genre}
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
                Age {character.age} · {character.occupation}
              </span>
            </div>

            <CopyButton textToCopy={copyString} label="Copy Character Dossier" />
          </div>

          {/* Name & Alias Banner */}
          <div className="flex flex-col gap-1">
            <h2
              className={`text-2xl sm:text-4xl font-black tracking-tight transition-all duration-200 ${
                isGenerating ? 'opacity-30' : 'opacity-100'
              }`}
              style={{ color: 'var(--text)' }}
            >
              {character.name}
            </h2>
            <p className="text-sm font-semibold italic" style={{ color: 'var(--accent)' }}>
              &ldquo;{character.alias}&rdquo;
            </p>
          </div>

          {/* Dossier Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                🧠 Personality
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {character.personality}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                ✨ Unique Quirk
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {character.quirk}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                💪 Key Strength
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {character.strength}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--red, #ef4444)' }}>
                ⚠️ Fatal Flaw
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {character.flaw}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                🎯 Core Motivation / Goal
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {character.goal}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                🔒 Dark Secret / Plot Hook
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: 'var(--accent)' }}>
                {character.secret}
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
                Recent Character Dossiers
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
                    {h.name} ({h.occupation} · {h.genre})
                  </span>
                  <button
                    type="button"
                    onClick={() => setCharacter(h)}
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
