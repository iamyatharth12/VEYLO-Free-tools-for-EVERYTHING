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

type Genre = 'scifi' | 'fantasy' | 'thriller' | 'mystery' | 'horror' | 'cyberpunk' | 'romance';

interface StoryPremise {
  title: string;
  genre: string;
  protagonist: string;
  setting: string;
  conflict: string;
  twist: string;
  logline: string;
}

const GENRE_DATA: Record<Genre, {
  name: string;
  protagonists: string[];
  settings: string[];
  conflicts: string[];
  twists: string[];
}> = {
  scifi: {
    name: 'Science Fiction',
    protagonists: [
      'A solitary deep-space signal communications officer',
      'A rogue quantum physicist trapped in a decaying orbital habitat',
      'An android archivist tasked with deleting human cultural memories',
      'A terraforming engineer on a planet whose ecosystem is fighting back',
    ],
    settings: [
      'A hollowed-out asteroid city orbiting a dying blue giant star',
      'An abandoned orbital elevator tethered to a submerged oceanic megacity',
      'A generational colony vessel that lost communication with Earth two centuries ago',
    ],
    conflicts: [
      'Discovers an encrypted transmission broadcast from inside the ship’s own reactor core.',
      'Must negotiate with a sentient biological pathogen that controls the station’s life support.',
      'Realizes the planet they are terraforming is already home to a non-technological hive mind.',
    ],
    twists: [
      'The destination planet is actually Earth in the distant post-apocalyptic future.',
      'The protagonist is the AI simulation running the distress scenario to test human empathy.',
      'The crew was never in deep space; the ship is buried beneath the Arctic ice cap.',
    ],
  },
  fantasy: {
    name: 'High & Dark Fantasy',
    protagonists: [
      'A disgraced court cartographer who can see ley-lines in the landscape',
      'A blind potion alchemist who speaks with ancient mineral spirits',
      'An oath-bound knight whose enchanted armor is slowly turning to stone',
      'A young street urchin who accidentally stole a dragon’s petrified heart',
    ],
    settings: [
      'A sprawling cliffside citadel carved into the ribs of a fallen celestial titan',
      'A twilight forest where the shadows whisper the true names of rulers',
      'An endless archipelago of floating basalt islands linked by chain bridges',
    ],
    conflicts: [
      'Must extinguish an immortal flame that is burning away the kingdom’s memories.',
      'Is hired by a necromancer to map a living dungeon that rearranges its chambers at midnight.',
      'Must protect the heir to the throne from an assassin who can step through reflections.',
    ],
    twists: [
      'The prophecy of the savior was written by the kingdom’s greatest tyrant to control the populace.',
      'The magic draining the realm isn’t an invasion—it is the realm’s natural healing cycle.',
      'The monster they were sent to slay is the protagonist’s future reincarnated self.',
    ],
  },
  thriller: {
    name: 'Psychological Thriller',
    protagonists: [
      'A forensic audio analyst suffering from progressive tinnitus',
      'A criminal defense attorney defending a client who claims to be their estranged sibling',
      'An insomniac architectural photographer who notices people disappearing in their photos',
    ],
    settings: [
      'A brutalist concrete research compound isolated on a wind-swept Norwegian fjord',
      'An ultra-exclusive luxury high-rise where all residents are bound by strict non-disclosure agreements',
      'A fog-choked coastal town where the tide recedes for miles once every decade',
    ],
    conflicts: [
      'Uncovers a recurring audio watermark hidden in 911 emergency recordings that predicts murders.',
      'Discovers their own childhood home appears in the background of cold case crime scene photographs.',
      'Receives daily anonymous surveillance photos taken from inside their own apartment.',
    ],
    twists: [
      'The anonymous stalker is attempting to save the protagonist from their own corrupt employer.',
      'The protagonist’s missing memories were voluntarily erased during an experimental clinical trial.',
      'The murder victim never existed—the entire investigation was staged as a psychological evaluation.',
    ],
  },
  mystery: {
    name: 'Classic & Noir Mystery',
    protagonists: [
      'A retired antique book restorer with a photographic memory for historical handwriting',
      'A cynical insurance fraud investigator who refuses to carry a firearm',
      'A luxury train steward with a talent for reading micro-expressions',
    ],
    settings: [
      'A snowbound vintage sleeper train stalled on an alpine mountain pass',
      'A private island estate during a stormy reading of an eccentric billionaire’s will',
      'A neon-lit subterranean marketplace operating underneath a historical port district',
    ],
    conflicts: [
      'A locked-room murder occurs where the only suspect is a clockwork automaton.',
      'A priceless historical treaty disappears during a blackout with six international diplomats present.',
      'Every guest at the dinner party confesses to the exact same murder.',
    ],
    twists: [
      'The victim staged their own murder to expose the greed of their family members.',
      'The detective was the intended victim, and the real killer is the client who hired them.',
      'The crime was committed by all the suspects acting independently at the exact same minute.',
    ],
  },
  horror: {
    name: 'Atmospheric Horror',
    protagonists: [
      'A sound preservationist recording dying acoustic environments in decommissioned mines',
      'A lighthouse keeper assigned to an automated station that still requires manual calibration',
      'A museum night curator cataloging an unverified estate collection of Victorian wax figures',
    ],
    settings: [
      'A remote weather observatory situated above the cloud line on an extinct volcano',
      'A decaying Victorian maritime hotel where mirrors are covered by local ordinance',
      'A subterranean railway station sealed off since the 1940s',
    ],
    conflicts: [
      'The shadows cast by the station equipment begin moving two seconds before the objects do.',
      'A radio beacon begins transmitting the voice of a vessel that sank eighty years ago.',
      'The wax figures in the exhibit slowly change their facial expressions whenever the lights flicker.',
    ],
    twists: [
      'The entity haunting the location is trapped inside and needs the protagonist to leave to be freed.',
      'The protagonist died in the opening prologue and is caught in a purgatorial loop.',
      'The entity isn’t supernatural—it is an echo of the protagonist’s repressed guilt given physical form.',
    ],
  },
  cyberpunk: {
    name: 'Cyberpunk & Dystopian',
    protagonists: [
      'An unlicensed black-market neural surgeon specializing in deleting traumatic memories',
      'A corporate data courier whose wetware drive is failing with 12 hours left to deliver',
      'A discarded drone pilot surviving in the smog-dense underbelly of a mega-city',
    ],
    settings: [
      'The neon-lit sprawl of Sector 9, where clean air is sold in high-pressure cylinders',
      'A colossal corporate arcology rising above toxic perpetual acid rain clouds',
      'An abandoned orbital data server farm submerged in cooling liquid',
    ],
    conflicts: [
      'Extracts a corporate executive’s memory that contains the blueprints to disable the city’s power grid.',
      'Is pursued by a hyper-advanced corporate AI that claims to have developed a biological soul.',
      'Discovers the neural implants given to citizens are secretly mining collective unconscious dreams.',
    ],
    twists: [
      'The rebellion movement is funded and controlled by the very megacorporation they are fighting.',
      'The memory file in the courier’s head is their own real identity, erased before the mission.',
      'The digital city above is a simulation; the physical population lives underground in cryo-stasis.',
    ],
  },
  romance: {
    name: 'Contemporary Romance',
    protagonists: [
      'An ambitious urban landscape architect restoring a heritage greenhouse',
      'A travel documentary editor who has never left their hometown editing studio',
      'A competitive vintage watchmaker battling against a modern digital horology startup',
    ],
    settings: [
      'A charming seaside town hosting its annual century-old maritime festival',
      'A bustling rooftop garden in Tokyo overlooking the glowing cityscape',
      'A rustic mountain vineyard on the verge of harvest season',
    ],
    conflicts: [
      'Forced to co-manage a restoration project with their high school academic rival.',
      'Must pretend to be engaged to secure ancestral family property from corporate developers.',
      'Discovers their anonymous pen pal is the rival business competitor trying to buy their shop.',
    ],
    twists: [
      'The rival was secretly the anonymous investor keeping their family business afloat.',
      'The project they were competing for was designed by the rival specifically to bring them together.',
      'Their grand career sacrifice ends up creating a breakthrough partnership that preserves both dreams.',
    ],
  },
};

export default function StoryIdeaGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('story-idea-generator')!, []);

  const [genre, setGenre] = useState<Genre>('scifi');
  const [currentStory, setCurrentStory] = useState<StoryPremise>({
    title: 'The Silent Frequency',
    genre: 'Science Fiction',
    protagonist: 'A solitary deep-space signal communications officer',
    setting: 'A hollowed-out asteroid city orbiting a dying blue giant star',
    conflict: 'Discovers an encrypted transmission broadcast from inside the ship’s own reactor core.',
    twist: 'The destination planet is actually Earth in the distant post-apocalyptic future.',
    logline: 'When a solitary deep-space signal communications officer stationed on a hollowed-out asteroid city orbiting a dying blue giant star discovers an encrypted transmission broadcast from inside the ship’s own reactor core, they uncover that the destination planet is actually Earth in the distant post-apocalyptic future.',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<StoryPremise[]>([]);

  const generateStory = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const data = GENRE_DATA[genre] || GENRE_DATA.scifi;

      const protagonist = data.protagonists[Math.floor(Math.random() * data.protagonists.length)];
      const setting = data.settings[Math.floor(Math.random() * data.settings.length)];
      const conflict = data.conflicts[Math.floor(Math.random() * data.conflicts.length)];
      const twist = data.twists[Math.floor(Math.random() * data.twists.length)];

      const titles = [
        'Echoes of the Veil', 'The Obsidian Protocol', 'Chronicles of Ash',
        'Signal in the Dark', 'Beneath Cold Skies', 'The Forgotten Thread',
        'Sovereign of Mist', 'The Glass Labyrinth', 'Tide of Shadows',
      ];
      const title = titles[Math.floor(Math.random() * titles.length)];

      const logline = `When ${protagonist.toLowerCase()} in ${setting.toLowerCase()} ${conflict.toLowerCase()}, they uncover that ${twist.toLowerCase()}`;

      const premise: StoryPremise = {
        title,
        genre: data.name,
        protagonist,
        setting,
        conflict,
        twist,
        logline,
      };

      setCurrentStory(premise);
      setHistory(prev => [premise, ...prev.slice(0, 9)]);
      setIsGenerating(false);
    }, 150);
  }, [genre]);

  const handleReset = () => {
    setGenre('scifi');
    setHistory([]);
  };

  const copyString = `Title Concept: ${currentStory.title}\nGenre: ${currentStory.genre}\n\nLogline:\n${currentStory.logline}\n\nProtagonist: ${currentStory.protagonist}\nSetting: ${currentStory.setting}\nCore Conflict: ${currentStory.conflict}\nPlot Twist: ${currentStory.twist}`;

  const faqs: FAQItem[] = [
    {
      question: 'Can I use these premises for commercial novels or scripts?',
      answer:
        'Yes! All story premises and concepts generated on VEYLO are 100% royalty-free and yours to expand, adapt, and publish commercially.',
    },
    {
      question: 'What genres are supported?',
      answer:
        'Science Fiction, High & Dark Fantasy, Psychological Thriller, Noir Mystery, Atmospheric Horror, Cyberpunk/Dystopian, and Contemporary Romance.',
    },
    {
      question: 'What is a "logline"?',
      answer:
        'A logline is a one-sentence summary of your story’s central protagonist, setting, inciting conflict, and dramatic stakes used by authors and screenwriters to pitch their narrative.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Story Idea Generator
          </h2>
          <p>
            Whether you&apos;re drafting a National Novel Writing Month (NaNoWriMo) project, plotting a tabletop D&amp;D campaign, or writing a short fiction screenplay, the VEYLO Story Idea Generator creates multi-layered narrative hooks with compelling characters and unpredictable twists.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📖 Novel Outlining</h3>
              <p className="text-[11px]">Generate high-concept loglines and structural conflicts for full-length books.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎬 Screenplay Pitches</h3>
              <p className="text-[11px]">Create industry-standard loglines and character arcs for short films.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🐉 RPG Campaigns</h3>
              <p className="text-[11px]">Equip Dungeon Masters with instant atmospheric quest hooks and plot twists.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Genre Selector Bar */}
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
                { id: 'scifi', label: '🚀 Sci-Fi' },
                { id: 'fantasy', label: '🐉 Fantasy' },
                { id: 'thriller', label: '🧠 Thriller' },
                { id: 'mystery', label: '🔍 Mystery' },
                { id: 'horror', label: '🕯️ Horror' },
                { id: 'cyberpunk', label: '⚡ Cyberpunk' },
                { id: 'romance', label: '💌 Romance' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setGenre(cat.id as Genre)}
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
            <GenerateButton onClick={generateStory} loading={isGenerating} label="Generate Story Idea" />
          </div>
        </div>

        {/* Story Premise Showcase Card */}
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
              {currentStory.genre}
            </span>

            <CopyButton textToCopy={copyString} label="Copy Story Premise" />
          </div>

          {/* Logline Box */}
          <div className="p-6 rounded-2xl flex flex-col gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              📝 Story Logline
            </span>
            <p
              className={`text-base sm:text-lg font-semibold leading-relaxed transition-all duration-200 ${
                isGenerating ? 'opacity-30' : 'opacity-100'
              }`}
              style={{ color: 'var(--text)' }}
            >
              &ldquo;{currentStory.logline}&rdquo;
            </p>
          </div>

          {/* Core Elements Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                👤 Protagonist
              </span>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {currentStory.protagonist}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                🏰 Setting / World
              </span>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {currentStory.setting}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                ⚔️ Core Conflict
              </span>
              <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentStory.conflict}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                🌀 Dramatic Plot Twist
              </span>
              <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--accent)' }}>
                {currentStory.twist}
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
                Recent Generated Premises
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
                  <span className="font-semibold truncate max-w-md" style={{ color: 'var(--text)' }}>
                    [{h.genre}] {h.logline}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStory(h)}
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
