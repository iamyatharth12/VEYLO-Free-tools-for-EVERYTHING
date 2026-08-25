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

type Domain = 'all' | 'business' | 'apps' | 'content' | 'hobbies' | 'school' | 'personal';

interface IdeaConcept {
  title: string;
  category: string;
  target: string;
  problem: string;
  solution: string;
  hook: string;
}

const IDEA_DATABASE: Record<Domain, IdeaConcept[]> = {
  all: [], // filled dynamically
  business: [
    {
      title: 'Subscription Micro-Office Plants',
      category: 'Startup & E-Commerce',
      target: 'Remote tech workers & home office enthusiasts',
      problem: 'Maintaining healthy indoor desk plants requires specific lighting and watering routines that busy professionals forget.',
      solution: 'A curated seasonal box of low-maintenance succulents and air plants paired with an automated NFC watering reminder tag.',
      hook: 'Guaranteed 100% plant survival policy with instant digital botanist chat.',
    },
    {
      title: 'Local Artisan Batch Marketplace',
      category: 'Local Commerce & B2B',
      target: 'Small-batch food producers & boutique coffee shops',
      problem: 'Independent bakers and condiment makers struggle to distribute products beyond Saturday farmer markets.',
      solution: 'A regional wholesale aggregation portal linking neighborhood cafés with verified local food creators for weekly wholesale drops.',
      hook: 'Zero inventory warehousing; direct neighborhood batch consolidation.',
    },
    {
      title: 'Zero-Waste Bulk Pantry Delivery',
      category: 'Sustainable Consumer Goods',
      target: 'Eco-conscious urban families & meal prep cooks',
      problem: 'Single-use plastic packaging waste from staple grocery shopping (rice, oats, spices).',
      solution: 'Deposit-return glass jar delivery of organic kitchen staples on a recurring doorstep subscription schedule.',
      hook: 'Empty jar exchange at doorstep with automated discount replenishment.',
    },
  ],
  apps: [
    {
      title: 'FocusFlow: Micro-Interval Workspace',
      category: 'Web & Desktop App',
      target: 'Software developers, writers & ADHD professionals',
      problem: 'Standard 25-minute Pomodoro intervals cause task-switching fatigue during deep creative coding states.',
      solution: 'An adaptive ambient desktop timer that syncs interval lengths with active keystroke velocity and idle detection.',
      hook: 'Zero notifications until you naturally hit a pause in typing rhythm.',
    },
    {
      title: 'SnippetVault: Universal Markdown Scratchpad',
      category: 'Developer Utility',
      target: 'Full-stack engineers & technical researchers',
      problem: 'Scattered code snippets across Notion, Slack, and terminal scratch files with broken syntax rendering.',
      solution: 'An offline-first, local SQLite markdown scratchpad with keyboard-only commands and instant syntax formatters.',
      hook: 'Lightning-fast 10ms search across 10,000 local snippets with zero cloud lag.',
    },
    {
      title: 'LingoFlash: Contextual Subtitle Flashcards',
      category: 'Language Learning App',
      target: 'Intermediate language learners consuming foreign media',
      problem: 'Flashcard apps teach isolated words without natural conversational emotional context.',
      solution: 'A browser extension that turns streaming TV subtitles into interactive audio-accompanied vocabulary decks.',
      hook: 'Generates cards directly from the specific video scenes you just watched.',
    },
  ],
  content: [
    {
      title: 'The "Built in a Weekend" Tech Challenge Series',
      category: 'YouTube & TikTok Content',
      target: 'Aspiring creators, indie hackers & tech students',
      problem: 'Tech tutorials are often dry, multi-hour lectures without narrative suspense or realistic debugging struggles.',
      solution: 'High-energy, documentary-style 10-minute videos building unconventional micro-SaaS tools from scratch against a 48-hour clock.',
      hook: 'Transparent financial breakdown of domain costs, revenue, and failures shown live on screen.',
    },
    {
      title: 'Deconstructing Viral Game Mechanics',
      category: 'Video Essays & Podcasts',
      target: 'Game designers & enthusiastic gamers',
      problem: 'Gaming critique often focuses purely on story without explaining the hidden psychology of UI feedback and sound design.',
      solution: 'Deep-dive visual breakdowns analyzing the tactile feel, camera shakes, and sound loops that make indie hits addictive.',
      hook: 'Recreating the exact mechanics in real-time engine demonstrations.',
    },
    {
      title: 'Zero to First Dollar: Side Hustle Lab',
      category: 'Newsletter & Case Studies',
      target: 'Solo founders & freelancers seeking first clients',
      problem: 'Generic business advice is too high-level and unverified.',
      solution: 'Step-by-step verified case studies detailing exact outreach scripts, pricing, and client acquisition methods.',
      hook: 'Includes downloadable template files used in each successful case study.',
    },
  ],
  hobbies: [
    {
      title: 'Analog Modular Synth Soundscaping',
      category: 'Creative Music Hobby',
      target: 'Electronic music enthusiasts & sound designers',
      problem: 'Screen fatigue from digital audio workstations (DAWs) limits spontaneous organic improvisation.',
      solution: 'Building compact desktop semi-modular hardware rigs to synthesize ambient generative soundscapes without a computer monitor.',
      hook: 'Recording live cassette tape master loops with tactile mechanical filters.',
    },
    {
      title: 'Micro-Aquascaping & Terrarium Ecosystems',
      category: 'Nature & Crafting Hobby',
      target: 'Apartment dwellers & nature craft hobbyists',
      problem: 'Large aquariums require complex plumbing, heavy maintenance, and significant floor space.',
      solution: 'Creating self-sustaining closed-bottle biospheres using bioactive soils, mosses, and dwarf aquatic plants.',
      hook: 'Requires zero mechanical filters once biological equilibrium is established.',
    },
  ],
  school: [
    {
      title: 'Peer-to-Peer Concept Visualizer',
      category: 'Study Tool & Group Learning',
      target: 'STEM high school & university students',
      problem: 'Abstract physics and calculus equations are hard to visualize through static textbook diagrams.',
      solution: 'Interactive 3D browser simulations where students manipulate variables to watch real-time vector forces and graphs change.',
      hook: 'Gamified challenge modes where students predict formula outcomes to win badges.',
    },
  ],
  personal: [
    {
      title: 'Personal Digital Almanac & Annual Review',
      category: 'Personal Development',
      target: 'Lifelong learners & journalers',
      problem: 'Daily diary entries get forgotten and are rarely synthesized into meaningful life insights.',
      solution: 'An annual interactive yearbook template summarizing favorite books read, skills learned, milestones, and personal stats.',
      hook: 'Generates a clean, exportable personal annual report PDF.',
    },
  ],
};

export default function RandomIdeaGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('random-idea-generator')!, []);

  const [domain, setDomain] = useState<Domain>('all');
  const [currentIdea, setCurrentIdea] = useState<IdeaConcept>(IDEA_DATABASE.business[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<IdeaConcept[]>([]);

  const generateIdea = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      let pool: IdeaConcept[] = [];

      if (domain === 'all') {
        Object.keys(IDEA_DATABASE).forEach(key => {
          if (key !== 'all') {
            pool.push(...IDEA_DATABASE[key as Domain]);
          }
        });
      } else {
        pool = IDEA_DATABASE[domain] || IDEA_DATABASE.business;
      }

      const picked = pool[Math.floor(Math.random() * pool.length)];
      setCurrentIdea(picked);
      setHistory(prev => [picked, ...prev.slice(0, 9)]);
      setIsGenerating(false);
    }, 150);
  }, [domain]);

  const handleReset = () => {
    setDomain('all');
    setCurrentIdea(IDEA_DATABASE.business[0]);
    setHistory([]);
  };

  const copyString = `Title: ${currentIdea.title} (${currentIdea.category})\nTarget: ${currentIdea.target}\nProblem: ${currentIdea.problem}\nSolution: ${currentIdea.solution}\nUnique Hook: ${currentIdea.hook}`;

  const faqs: FAQItem[] = [
    {
      question: 'What domains can I generate ideas for?',
      answer:
        'You can filter across Startup Businesses, Web & Desktop Apps, YouTube/Content Creation, Creative Hobbies, Academic Study Projects, and Personal Life Projects.',
    },
    {
      question: 'Are these ideas generated by an external AI API?',
      answer:
        'No. VEYLO uses structured, curated local concept matrices directly in your browser. It requires zero API keys, no login, and runs at instant speed.',
    },
    {
      question: 'Can I copy the entire concept outline?',
      answer:
        'Yes. Click "Copy Concept" to get the full formatted brief (Title, Target Audience, Problem, Solution, Unique Hook) copied to your clipboard.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Random Idea Generator
          </h2>
          <p>
            Brainstorming your next venture, side hustle, hackathon build, or YouTube series? The VEYLO Random Idea Generator delivers structured project concepts complete with market problem statements, target demographics, and unfair competitive advantages.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>💼 Startups &amp; SaaS</h3>
              <p className="text-[11px]">Discover validated problem niches and modern software application hooks.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📹 Content Creators</h3>
              <p className="text-[11px]">Generate high-engagement video concepts, case studies, and storytelling hooks.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🛠️ Weekend Projects</h3>
              <p className="text-[11px]">Find inspiring developer tools and hands-on maker hobbies for your free time.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Controls Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Domain:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: '🌟 All Domains' },
                { id: 'business', label: '💼 Business' },
                { id: 'apps', label: '📱 Apps & SaaS' },
                { id: 'content', label: '📹 Content / YouTube' },
                { id: 'hobbies', label: '🎨 Hobbies' },
                { id: 'school', label: '🏫 School' },
                { id: 'personal', label: '🌱 Personal' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setDomain(cat.id as Domain)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    domain === cat.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: domain === cat.id ? 'var(--accent)' : 'var(--surface-2)',
                    color: domain === cat.id ? '#ffffff' : 'var(--text)',
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
            <GenerateButton onClick={generateIdea} loading={isGenerating} label="Generate Idea" />
          </div>
        </div>

        {/* Concept Presentation Card */}
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
              {currentIdea.category}
            </span>

            <CopyButton textToCopy={copyString} label="Copy Concept" />
          </div>

          {/* Project Title */}
          <h2
            className={`text-2xl sm:text-4xl font-black tracking-tight transition-all duration-200 ${
              isGenerating ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
            }`}
            style={{ color: 'var(--text)' }}
          >
            {currentIdea.title}
          </h2>

          {/* Detailed Concept Fields */}
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl flex flex-col gap-1.5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                🎯 Target Audience
              </span>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {currentIdea.target}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1.5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                ⚡ Unique Hook &amp; Advantage
              </span>
              <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                {currentIdea.hook}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1.5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                ⚠️ The Problem
              </span>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentIdea.problem}
              </p>
            </div>

            <div className="p-4 rounded-2xl flex flex-col gap-1.5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                💡 Proposed Solution
              </span>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentIdea.solution}
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
                Recent Generated Ideas
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
                    {h.title} <span className="text-xs font-normal opacity-70">({h.category})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentIdea(h)}
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
