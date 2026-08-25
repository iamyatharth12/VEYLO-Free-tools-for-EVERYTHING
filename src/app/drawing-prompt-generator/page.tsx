'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  GenerateButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

type Difficulty = 'warmup' | 'intermediate' | 'master';

interface DrawingChallenge {
  difficulty: Difficulty;
  diffLabel: string;
  category: string;
  prompt: string;
  focusSkill: string;
  timeSuggestion: string;
}

const DRAWING_PROMPTS: Record<Difficulty, DrawingChallenge[]> = {
  warmup: [
    {
      difficulty: 'warmup',
      diffLabel: 'Quick Warmup',
      category: 'Object & Texture',
      prompt: 'Draw an open vintage pocket watch with loose clockwork gears spilling onto a table without lifting your pen.',
      focusSkill: 'Continuous line drawing & hand coordination',
      timeSuggestion: '3 - 5 Minutes',
    },
    {
      difficulty: 'warmup',
      diffLabel: 'Quick Warmup',
      category: 'Hands & Gesture',
      prompt: 'Draw your non-dominant hand holding three different small objects (a key, a pen, a coin).',
      focusSkill: 'Foreshortening & organic finger volume',
      timeSuggestion: '5 Minutes',
    },
    {
      difficulty: 'warmup',
      diffLabel: 'Quick Warmup',
      category: 'Organic Shapes',
      prompt: 'Draw a twisted bonsai tree growing out of a cracked ceramic tea mug.',
      focusSkill: 'Organic curve flow & bark texture',
      timeSuggestion: '5 Minutes',
    },
  ],
  intermediate: [
    {
      difficulty: 'intermediate',
      diffLabel: 'Skill Builder',
      category: 'Creature Design',
      prompt: 'Design a hybrid creature combining an owl and a chameleon perched on an ornate streetlamp.',
      focusSkill: 'Feather/scale texture blending & anatomical plausibility',
      timeSuggestion: '15 Minutes',
    },
    {
      difficulty: 'intermediate',
      diffLabel: 'Skill Builder',
      category: 'Prop & Hard-Surface',
      prompt: 'Draw a retro-futuristic cassette player equipped with miniature vacuum tubes and a holographic dial.',
      focusSkill: 'Parallel perspective & bevel reflection shading',
      timeSuggestion: '15 Minutes',
    },
    {
      difficulty: 'intermediate',
      diffLabel: 'Skill Builder',
      category: 'Dynamic Figure',
      prompt: 'Draw a martial artist in mid-air performing a spinning kick with flowing cloth fabric trails.',
      focusSkill: 'Line of action, dynamic weight & cloth drapery folds',
      timeSuggestion: '15 - 20 Minutes',
    },
  ],
  master: [
    {
      difficulty: 'master',
      diffLabel: 'Master Challenge',
      category: 'Complex Scene',
      prompt: 'Draw an underground botanist working in a glass greenhouse train car as it speeds through a bioluminescent cavern.',
      focusSkill: 'Multi-point perspective, interior/exterior lighting contrast & storytelling details',
      timeSuggestion: '30 - 45 Minutes',
    },
    {
      difficulty: 'master',
      diffLabel: 'Master Challenge',
      category: 'Character & Environment',
      prompt: 'Draw an old lighthouse keeper sharing a bowl of soup with a giant, weary sea creature on a wave-battered dock.',
      focusSkill: 'Scale relationship, dramatic water spray & emotional character expression',
      timeSuggestion: '30 - 45 Minutes',
    },
  ],
};

export default function DrawingPromptGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('drawing-prompt-generator')!, []);

  const [difficulty, setDifficulty] = useState<Difficulty>('warmup');
  const [currentChallenge, setCurrentChallenge] = useState<DrawingChallenge>(DRAWING_PROMPTS.warmup[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Practice Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 min default
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const generatePrompt = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const pool = DRAWING_PROMPTS[difficulty] || DRAWING_PROMPTS.warmup;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      setCurrentChallenge(picked);
      setIsGenerating(false);
    }, 150);
  }, [difficulty]);

  const handleReset = () => {
    setDifficulty('warmup');
    setCurrentChallenge(DRAWING_PROMPTS.warmup[0]);
    setTimerRunning(false);
    setTimerSeconds(300);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins}:${remainingSec < 10 ? '0' : ''}${remainingSec}`;
  };

  const copyString = `Daily Drawing Prompt (${currentChallenge.diffLabel} · ${currentChallenge.category}):\n"${currentChallenge.prompt}"\n\nFocus Skill: ${currentChallenge.focusSkill}\nSuggested Time: ${currentChallenge.timeSuggestion}`;

  const faqs: FAQItem[] = [
    {
      question: 'How should I use the drawing prompt timer?',
      answer:
        'Setting a hard time limit (like 5 or 15 minutes) forces your brain to capture big shapes, loose gestures, and silhouettes without getting trapped in premature micro-details.',
    },
    {
      question: 'Are these prompts suitable for beginners?',
      answer:
        'Yes! Start with the "Quick Warmup" difficulty to practice continuous line drawing, basic hand poses, and simple organic textures.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Drawing Prompt Generator
          </h2>
          <p>
            Consistent daily sketchbook practice is the single fastest way to improve your draftsmanship. The VEYLO Drawing Prompt Generator delivers timed exercises tailored across gesture warmups, creature anatomy, perspective drills, and full narrative scenes.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🟢 5-Minute Warmups</h3>
              <p className="text-[11px]">Loosen up hand-eye coordination with gesture lines and blind contour drills.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🟡 15-Minute Studies</h3>
              <p className="text-[11px]">Practice creature design, hard-surface props, and cloth drapery folds.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔴 Master Challenges</h3>
              <p className="text-[11px]">Full multi-character compositions with cinematic atmospheric lighting.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Controls & Difficulty Filter */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Difficulty Tier:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'warmup', label: '🟢 Quick Warmup (5m)' },
                { id: 'intermediate', label: '🟡 Skill Builder (15m)' },
                { id: 'master', label: '🔴 Master Challenge (30m+)' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setDifficulty(cat.id as Difficulty)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    difficulty === cat.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: difficulty === cat.id ? 'var(--accent)' : 'var(--surface-2)',
                    color: difficulty === cat.id ? '#ffffff' : 'var(--text)',
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
            <GenerateButton onClick={generatePrompt} loading={isGenerating} label="Generate Prompt" />
          </div>
        </div>

        {/* Prompt Card */}
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
                {currentChallenge.diffLabel} · {currentChallenge.category}
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
                Target: {currentChallenge.timeSuggestion}
              </span>
            </div>

            <CopyButton textToCopy={copyString} label="Copy Challenge" />
          </div>

          {/* Big Prompt Text */}
          <div
            className={`p-6 rounded-2xl flex flex-col gap-2 transition-all duration-200 ${
              isGenerating ? 'opacity-30' : 'opacity-100'
            }`}
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              ✏️ Your Drawing Prompt
            </span>
            <p className="text-lg sm:text-2xl font-bold leading-relaxed" style={{ color: 'var(--text)' }}>
              &ldquo;{currentChallenge.prompt}&rdquo;
            </p>
          </div>

          {/* Skill Focus & Timer Bar */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                🎯 Focus Skill
              </span>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {currentChallenge.focusSkill}
              </p>
            </div>

            {/* Built-in Sketch Timer */}
            <div className="p-4 rounded-2xl flex items-center justify-between gap-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  ⏱️ Practice Timer
                </span>
                <span className="text-2xl font-black font-mono" style={{ color: timerSeconds === 0 ? 'var(--red, #ef4444)' : 'var(--text)' }}>
                  {formatTimer(timerSeconds)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                  style={{
                    background: timerRunning ? 'var(--red, #ef4444)' : 'var(--accent)',
                    color: '#ffffff',
                  }}
                >
                  {timerRunning ? 'Pause' : 'Start Timer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(300);
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
