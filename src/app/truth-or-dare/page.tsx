'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

type PromptType = 'truth' | 'dare';
type Category = 'party' | 'family' | 'icebreaker' | 'deep';

interface PromptItem {
  type: PromptType;
  category: Category;
  text: string;
}

const PROMPTS: PromptItem[] = [
  // Truths - Party
  { type: 'truth', category: 'party', text: 'What is the most embarrassing song on your current playlist?' },
  { type: 'truth', category: 'party', text: 'What is the silliest thing you have ever lied about to avoid hanging out?' },
  { type: 'truth', category: 'party', text: 'If you had to swap lives with one person in this room for 24 hours, who would it be?' },
  { type: 'truth', category: 'party', text: 'What is the weirdest purchase you have ever made online after midnight?' },
  { type: 'truth', category: 'party', text: 'Have you ever accidentally sent a text message about someone to that exact person?' },
  { type: 'truth', category: 'party', text: 'What is your most useless, bizarre hidden talent?' },
  { type: 'truth', category: 'party', text: 'What fashion trend did you follow in the past that you now deeply regret?' },

  // Dares - Party
  { type: 'dare', category: 'party', text: 'Speak in a dramatic Shakespearean accent for the next two rounds.' },
  { type: 'dare', category: 'party', text: 'Do your best impression of another person in the room until someone guesses who it is.' },
  { type: 'dare', category: 'party', text: 'Sing the chorus of your favorite song like an opera singer.' },
  { type: 'dare', category: 'party', text: 'Narrate everything you do for the next 3 minutes in a sports commentator voice.' },
  { type: 'dare', category: 'party', text: 'Let the group pick a random emoji and text it to the 3rd person in your recent contacts.' },
  { type: 'dare', category: 'party', text: 'Do 15 jumping jacks while reciting the alphabet backward.' },

  // Truths - Family
  { type: 'truth', category: 'family', text: 'What is the funniest childhood memory you still laugh about?' },
  { type: 'truth', category: 'family', text: 'If you could only eat one meal for the rest of your life, what would it be?' },
  { type: 'truth', category: 'family', text: 'What movie or cartoon have you watched the most times?' },
  { type: 'truth', category: 'family', text: 'If you were granted three wishes by a genie, what would you ask for?' },
  { type: 'truth', category: 'family', text: 'What is your absolute biggest irrational fear (e.g. clowns, spiders, elevators)?' },
  { type: 'truth', category: 'family', text: 'If you could have any animal in the world as a pet, which one would you pick?' },

  // Dares - Family
  { type: 'dare', category: 'family', text: 'Balance a spoon on your nose for 20 seconds without letting it drop.' },
  { type: 'dare', category: 'family', text: 'Walk across the room like a penguin without laughing.' },
  { type: 'dare', category: 'family', text: 'Try to juggle 3 small objects for 15 seconds.' },
  { type: 'dare', category: 'family', text: 'Make up a 30-second commercial selling an ordinary pencil as a magic wand.' },
  { type: 'dare', category: 'family', text: 'Talk without closing your mouth for the next two turns.' },
  { type: 'dare', category: 'family', text: 'Act like a robot until your next turn.' },

  // Truths - Icebreakers
  { type: 'truth', category: 'icebreaker', text: 'If you could instantly become an expert in any skill overnight, what would it be?' },
  { type: 'truth', category: 'icebreaker', text: 'What is the coolest or most memorable place you have ever traveled to?' },
  { type: 'truth', category: 'icebreaker', text: 'What is your go-to comfort movie or TV show when you are having a bad day?' },
  { type: 'truth', category: 'icebreaker', text: 'If you could invite any historical figure to dinner, who would you choose?' },
  { type: 'truth', category: 'icebreaker', text: 'What hobby would you pursue if time and money were not a factor?' },

  // Dares - Icebreakers
  { type: 'dare', category: 'icebreaker', text: 'Tell the group a clean, funny joke with a straight face.' },
  { type: 'dare', category: 'icebreaker', text: 'Compliment every person in the room on something unique about them.' },
  { type: 'dare', category: 'icebreaker', text: 'Show the most recent photo in your camera roll and explain the backstory.' },
  { type: 'dare', category: 'icebreaker', text: 'Invent a superhero name and signature pose for yourself right now.' },

  // Truths - Deep & Thoughtful
  { type: 'truth', category: 'deep', text: 'What is a piece of advice you received that genuinely changed how you live?' },
  { type: 'truth', category: 'deep', text: 'What is something you used to believe strongly that you have completely changed your mind about?' },
  { type: 'truth', category: 'deep', text: 'What personal goal are you currently working on that you are most excited about?' },
  { type: 'truth', category: 'deep', text: 'What is a small, everyday moment that always brings you genuine peace?' },

  // Dares - Deep
  { type: 'dare', category: 'deep', text: 'Send a quick text to someone you care about telling them you appreciate them.' },
  { type: 'dare', category: 'deep', text: 'Share one thing you are genuinely proud of achieving in the past year.' },
  { type: 'dare', category: 'deep', text: 'Give a 1-minute motivational speech to the group about following your passions.' },
];

export default function TruthOrDarePage() {
  const tool = useMemo(() => getToolBySlug('truth-or-dare')!, []);

  const [category, setCategory] = useState<Category>('party');
  const [currentPrompt, setCurrentPrompt] = useState<PromptItem>({
    type: 'truth',
    category: 'party',
    text: 'What is the most embarrassing song on your current playlist?',
  });
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [history, setHistory] = useState<PromptItem[]>([]);

  const pickPrompt = useCallback((desiredType?: PromptType) => {
    setIsRevealing(true);

    setTimeout(() => {
      let pool = PROMPTS.filter(p => p.category === category);

      if (desiredType) {
        pool = pool.filter(p => p.type === desiredType);
      }

      if (pool.length === 0) {
        pool = PROMPTS;
      }

      const randomItem = pool[Math.floor(Math.random() * pool.length)];

      setCurrentPrompt(randomItem);
      setHistory(prev => [randomItem, ...prev.slice(0, 14)]);
      setIsRevealing(false);
    }, 250);
  }, [category]);

  const handleReset = () => {
    setCategory('party');
    setCurrentPrompt({
      type: 'truth',
      category: 'party',
      text: 'What is the most embarrassing song on your current playlist?',
    });
    setHistory([]);
  };

  const isTruth = currentPrompt.type === 'truth';

  const faqs: FAQItem[] = [
    {
      question: 'Are all questions and dares safe for family and school?',
      answer:
        'Yes. VEYLO Truth or Dare prompts are strictly clean, fun, and safe for all ages. There is zero inappropriate or adult content.',
    },
    {
      question: 'Can I choose specific vibes like Icebreaker or Family?',
      answer:
        'Yes. Use the Category selector to toggle between "Friends & Party", "Family-Friendly", "Icebreakers & Casual", and "Deep & Thoughtful".',
    },
    {
      question: 'Can I choose between Truth, Dare, or a Random Surprise?',
      answer:
        'Yes. Click the blue "Truth" button for a question, the rose "Dare" button for a challenge, or the "Random (50/50)" button to let the generator decide for you.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Truth or Dare Generator
          </h2>
          <p>
            Looking for fun party game questions without awkward or inappropriate prompts? The VEYLO Truth or Dare Generator offers curated, family-safe challenges and conversation starters designed to bring friends, coworkers, and families together.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎉 Party &amp; Game Nights</h3>
              <p className="text-[11px]">Hilarious challenges and funny questions to liven up any gathering.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>👨‍👩‍👧 Family-Friendly</h3>
              <p className="text-[11px]">Safe, wholesome prompts suitable for kids, teens, and all family members.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🤝 Team Icebreakers</h3>
              <p className="text-[11px]">Fun team building and remote meeting icebreakers to get to know colleagues.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Category Controls Card */}
        <div
          className="p-5 sm:p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Party Vibe:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'party', label: '🎉 Friends & Party' },
                { id: 'family', label: '👨‍👩‍👧 Family-Friendly' },
                { id: 'icebreaker', label: '🤝 Icebreakers' },
                { id: 'deep', label: '💭 Deep & Thoughtful' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as Category)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    category === cat.id ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: category === cat.id ? 'var(--accent)' : 'var(--surface-2)',
                    color: category === cat.id ? '#ffffff' : 'var(--text)',
                    border: '1px solid var(--border-c)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <ResetButton onClick={handleReset} label="Reset Game" />
        </div>

        {/* Big Prompt Card */}
        <div
          className="p-8 sm:p-14 rounded-3xl flex flex-col items-center justify-center gap-8 text-center shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Prompt Type Badge */}
          <span
            className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-colors shadow-xs"
            style={{
              background: isTruth ? '#e0f2fe' : '#fce7f3',
              color: isTruth ? '#0369a1' : '#be185d',
              border: isTruth ? '1px solid #7dd3fc' : '1px solid #f472b6',
            }}
          >
            {isTruth ? '🔍 TRUTH' : '🔥 DARE'}
          </span>

          {/* Prompt Text Display */}
          <div
            className={`text-xl sm:text-3xl font-black max-w-2xl leading-relaxed select-all transition-all duration-200 min-h-[100px] flex items-center justify-center ${
              isRevealing ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
            }`}
            style={{ color: 'var(--text)' }}
          >
            &ldquo;{currentPrompt.text}&rdquo;
          </div>

          {/* Choice Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-2">
            <button
              type="button"
              onClick={() => pickPrompt('truth')}
              disabled={isRevealing}
              className="flex-1 py-3.5 px-6 rounded-2xl font-black text-sm transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center gap-2"
              style={{
                background: '#0284c7',
                color: '#ffffff',
              }}
            >
              <span>🔍</span>
              <span>Truth</span>
            </button>

            <button
              type="button"
              onClick={() => pickPrompt('dare')}
              disabled={isRevealing}
              className="flex-1 py-3.5 px-6 rounded-2xl font-black text-sm transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center gap-2"
              style={{
                background: '#db2777',
                color: '#ffffff',
              }}
            >
              <span>🔥</span>
              <span>Dare</span>
            </button>

            <button
              type="button"
              onClick={() => pickPrompt()}
              disabled={isRevealing}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl font-bold text-xs transition-all duration-150 active:scale-95"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                border: '1px solid var(--border-c)',
              }}
            >
              🎲 Random (50/50)
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <CopyButton textToCopy={currentPrompt.text} label="Copy Prompt" />
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
                Played Prompts History
              </h3>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{history.length} Prompts</span>
            </div>

            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto text-xs">
              {history.map((h, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl flex items-center justify-between gap-3"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <span className="font-medium truncate max-w-md" style={{ color: 'var(--text)' }}>
                    {h.text}
                  </span>
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded flex-shrink-0"
                    style={{
                      background: h.type === 'truth' ? '#e0f2fe' : '#fce7f3',
                      color: h.type === 'truth' ? '#0369a1' : '#be185d',
                    }}
                  >
                    {h.type.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
