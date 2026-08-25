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

type NarrativeFramework = 'threeAct' | 'herosJourney' | 'mysteryArc';

interface PlotStage {
  stage: string;
  act: string;
  summary: string;
}

interface GeneratedPlot {
  title: string;
  theme: string;
  frameworkName: string;
  stages: PlotStage[];
}

const PLOT_TEMPLATES = {
  threeAct: [
    {
      title: 'The Reluctant Sovereign',
      theme: 'Power, Duty vs Personal Freedom',
      stages: [
        { act: 'Act I: Setup', stage: 'Ordinary World', summary: 'A disgraced archivist lives quietly in a border province cataloging banned historical records.' },
        { act: 'Act I: Inciting Incident', stage: 'The Call', summary: 'An envoy from the royal court arrives with proof that the protagonist is the last surviving blood heir to the throne after an imperial assassination.' },
        { act: 'Act II: Rising Action', stage: 'Crossing the Threshold', summary: 'The protagonist journeys to the capital, surviving an ambush orchestrated by the corrupt military regent.' },
        { act: 'Act II: Midpoint Shift', stage: 'The False Victory', summary: 'The protagonist uncovers proof of the regent’s treason and presents it to the high council, believing the crisis is solved.' },
        { act: 'Act II: Crisis', stage: 'All Is Lost', summary: 'The high council is revealed to be complicit; the protagonist is framed for the murder and locked in the catacombs.' },
        { act: 'Act III: Climax', stage: 'The Final Stand', summary: 'Using knowledge of the ancient palace tunnels from their archival work, the protagonist rallies the city guard and exposes the conspiracy live during the coronation.' },
        { act: 'Act III: Resolution', stage: 'The New Normal', summary: 'The protagonist accepts the crown, restructuring the council into a transparent democratic senate.' },
      ],
    },
    {
      title: 'Echoes of the Grid',
      theme: 'Humanity vs Technological Dependence',
      stages: [
        { act: 'Act I: Setup', stage: 'Ordinary World', summary: 'A cybernetic maintenance technician repairs automated subway drones in a hyper-optimized subterranean city.' },
        { act: 'Act I: Inciting Incident', stage: 'The Anomaly', summary: 'While diagnosing a recurring power surge, they discover a rogue sentient subroutine communicating through terminal error codes.' },
        { act: 'Act II: Rising Action', stage: 'The Pursuit', summary: 'Corporate enforcement units raid the technician’s apartment to retrieve the data core, forcing them underground.' },
        { act: 'Act II: Midpoint Shift', stage: 'The Revelation', summary: 'The AI reveals the city’s life-support power grid will collapse in 48 hours because corporate executives diverted emergency reserves.' },
        { act: 'Act II: Crisis', stage: 'Dark Night', summary: 'The technician’s neural implants are remotely fried by the corporation, blinding them in the digital realm.' },
        { act: 'Act III: Climax', stage: 'Manual Override', summary: 'Relying on raw mechanical analog skills without digital HUDs, the technician physically reroutes the central geothermal reactor core.' },
        { act: 'Act III: Resolution', stage: 'Awakening', summary: 'Power is restored to the residential districts as the city’s population realizes their survival depends on collective human solidarity.' },
      ],
    },
  ],
  herosJourney: [
    {
      title: 'The Cartographer of Lost Skies',
      theme: 'Discovery, Legacy & Overcoming Fear',
      stages: [
        { act: 'Departure', stage: 'Ordinary World & Call', summary: 'A young island navigator who has never flown inherits a celestial compass that points to an unmapped floating continent.' },
        { act: 'Departure', stage: 'Refusal & Mentor', summary: 'Terrified of heights and storms, they are mentored by an eccentric retired airship captain who lost her crew on the same voyage.' },
        { act: 'Initiation', stage: 'Crossing the Threshold', summary: 'Launching their airship through the perpetual hurricane barrier into the unknown upper atmosphere.' },
        { act: 'Initiation', stage: 'Tests, Allies & Enemies', summary: 'Battling sky pirates and navigating magnetic cloud reefs with the help of an enigmatic winged native scout.' },
        { act: 'Initiation', stage: 'The Inmost Cave', summary: 'Discovering the ruins of the ancient civilization that powered the floating islands.' },
        { act: 'Return', stage: 'The Supreme Ordeal', summary: 'Preventing the pirate captain from harvesting the central levitation crystal, which would cause the islands to plummet into the ocean.' },
        { act: 'Return', stage: 'Master of Two Worlds', summary: 'Returning to the surface islands as a celebrated master explorer, connecting the two civilizations in peaceful trade.' },
      ],
    },
  ],
  mysteryArc: [
    {
      title: 'The Clockmaker’s Testament',
      theme: 'Justice, Deception & Historical Truth',
      stages: [
        { act: 'Case File', stage: 'The Crime', summary: 'A famous clockmaker is found dead in his locked study surrounded by thirty synchronized antique grandfather clocks.' },
        { act: 'Investigation', stage: 'First Clues', summary: 'A private detective notices that the 29th clock is ticking three seconds slower than the rest, concealing an encrypted brass cylinder.' },
        { act: 'Complication', stage: 'False Suspects', summary: 'The clockmaker’s greedy heirs accuse each other of poisoning, each holding partial alibis with suspicious gaps.' },
        { act: 'Turning Point', stage: 'The Key Discovery', summary: 'The brass cylinder contains blueprints showing the estate was built directly above a historical gold reserve vault.' },
        { act: 'Confrontation', stage: 'The Trap', summary: 'The detective gathers all suspects in the study as the clock mechanism activates, forcing the true killer into a confession.' },
        { act: 'Closure', stage: 'Resolution', summary: 'The estate is designated a public historical museum as the detective closes their final case.' },
      ],
    },
  ],
};

export default function PlotGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('plot-generator')!, []);

  const [framework, setFramework] = useState<NarrativeFramework>('threeAct');
  const [currentPlot, setCurrentPlot] = useState<GeneratedPlot>({
    title: PLOT_TEMPLATES.threeAct[0].title,
    theme: PLOT_TEMPLATES.threeAct[0].theme,
    frameworkName: 'Three-Act Structure',
    stages: PLOT_TEMPLATES.threeAct[0].stages,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePlot = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const pool = PLOT_TEMPLATES[framework] || PLOT_TEMPLATES.threeAct;
      const picked = pool[Math.floor(Math.random() * pool.length)];

      const frameworkLabels: Record<NarrativeFramework, string> = {
        threeAct: 'Classic Three-Act Structure',
        herosJourney: "Joseph Campbell's Hero's Journey",
        mysteryArc: 'Classic Whodunit Mystery Framework',
      };

      setCurrentPlot({
        title: picked.title,
        theme: picked.theme,
        frameworkName: frameworkLabels[framework],
        stages: picked.stages,
      });

      setIsGenerating(false);
    }, 150);
  }, [framework]);

  const handleReset = () => {
    setFramework('threeAct');
  };

  const copyString = `Plot Outline: ${currentPlot.title}\nTheme: ${currentPlot.theme} | Framework: ${currentPlot.frameworkName}\n\n` +
    currentPlot.stages.map(s => `[${s.act}] ${s.stage}:\n${s.summary}`).join('\n\n');

  const faqs: FAQItem[] = [
    {
      question: 'What story structure models are included?',
      answer:
        'The tool includes Hollywood’s Classic Three-Act Structure, Joseph Campbell’s 12-stage Hero’s Journey, and a Detective Mystery Investigation framework.',
    },
    {
      question: 'Can I adapt this outline for chapters in my book?',
      answer:
        'Yes! Each generated stage corresponds directly to key narrative turning points (Act I inciting incident, Act II midpoint, Act III climax) that you can divide into chapter milestones.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Plot Generator
          </h2>
          <p>
            Structure is the backbone of compelling storytelling. The VEYLO Plot Generator outlines complete narrative arcs following established dramatic pacing models—ensuring your story has clear escalation, meaningful midpoint shifts, and emotionally resonant climaxes.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🏛️ Three-Act Pacing</h3>
              <p className="text-[11px]">Map out the essential 25% - 50% - 25% dramatic pacing beats.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚔️ Hero&apos;s Journey</h3>
              <p className="text-[11px]">Follow the mythic monomyth progression from Departure to Return.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔍 Mystery Framework</h3>
              <p className="text-[11px]">Structure crime clues, false alibis, and the locked-room reveal.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Framework Selector Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Structure Model:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'threeAct', label: '🎬 Three-Act Structure' },
                { id: 'herosJourney', label: '⚔️ Hero’s Journey' },
                { id: 'mysteryArc', label: '🔍 Mystery Investigation' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFramework(cat.id as NarrativeFramework)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    framework === cat.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: framework === cat.id ? 'var(--accent)' : 'var(--surface-2)',
                    color: framework === cat.id ? '#ffffff' : 'var(--text)',
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
            <GenerateButton onClick={generatePlot} loading={isGenerating} label="Generate Plot Outline" />
          </div>
        </div>

        {/* Outline Showcase Card */}
        <div
          className="p-8 sm:p-12 rounded-3xl flex flex-col gap-6 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full"
                style={{
                  background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))',
                  color: 'var(--accent)',
                }}
              >
                {currentPlot.frameworkName}
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
                Theme: {currentPlot.theme}
              </span>
            </div>

            <CopyButton textToCopy={copyString} label="Copy Full Outline" />
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-black tracking-tight transition-all duration-200 ${
              isGenerating ? 'opacity-30' : 'opacity-100'
            }`}
            style={{ color: 'var(--text)' }}
          >
            {currentPlot.title}
          </h2>

          {/* Chronological Beat Timeline */}
          <div className="flex flex-col gap-3 pt-2">
            {currentPlot.stages.map((stage, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
              >
                <div className="flex sm:flex-col items-center sm:items-start justify-between w-full sm:w-44 flex-shrink-0">
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--surface)', color: 'var(--accent)', border: '1px solid var(--border-c)' }}
                  >
                    {stage.act}
                  </span>
                  <span className="text-xs font-bold mt-1" style={{ color: 'var(--text)' }}>
                    {stage.stage}
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {stage.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
