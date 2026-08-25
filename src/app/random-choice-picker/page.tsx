'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const PRESETS = {
  dinner: ['Pizza & Calzones', 'Sushi & Ramen', 'Tacos & Burritos', 'Thai Curry & Pad Thai', 'Burger & Sweet Fries', 'Pasta & Garlic Bread', 'Healthy Grain Bowl'],
  activities: ['Watch a Movie', 'Play Video Games', 'Go for a Long Walk', 'Read a Book', 'Bake Something Sweet', 'Call an Old Friend', 'Learn a New Song'],
  movies: ['Sci-Fi / Cyberpunk', 'Mystery / Thriller', 'Comedy Classic', 'Fantasy Adventure', 'Horror Night', 'Animated Feature', 'Action Blockbuster'],
};

export default function RandomChoicePickerPage() {
  const tool = useMemo(() => getToolBySlug('random-choice-picker')!, []);

  const [rawText, setRawText] = useState<string>(PRESETS.dinner.join('\n'));
  const [pickCount, setPickCount] = useState<number>(1);
  const [removePicked, setRemovePicked] = useState<boolean>(false);

  const [winners, setWinners] = useState<string[]>(['Pizza & Calzones']);
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [history, setHistory] = useState<{ picked: string[]; timestamp: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Parse lines into unique non-empty choices
  const parsedChoices = useMemo(() => {
    return rawText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
  }, [rawText]);

  const handlePick = useCallback(() => {
    setError(null);

    if (parsedChoices.length === 0) {
      setError('Please enter at least 1 choice in the text box.');
      return;
    }

    const qty = Math.min(Math.max(1, pickCount), parsedChoices.length);
    setIsPicking(true);

    setTimeout(() => {
      // Shuffle copy of choices
      const shuffled = [...parsedChoices].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, qty);

      setWinners(selected);
      setHistory(prev => [
        { picked: selected, timestamp: new Date().toLocaleTimeString() },
        ...prev.slice(0, 14),
      ]);

      if (removePicked) {
        const remaining = parsedChoices.filter(item => !selected.includes(item));
        setRawText(remaining.join('\n'));
      }

      setIsPicking(false);
    }, 400);
  }, [parsedChoices, pickCount, removePicked]);

  const loadPreset = (key: keyof typeof PRESETS) => {
    setRawText(PRESETS[key].join('\n'));
    setError(null);
  };

  const shuffleList = () => {
    const shuffled = [...parsedChoices].sort(() => Math.random() - 0.5);
    setRawText(shuffled.join('\n'));
  };

  const handleReset = () => {
    setRawText(PRESETS.dinner.join('\n'));
    setPickCount(1);
    setRemovePicked(false);
    setWinners(['Pizza & Calzones']);
    setError(null);
  };

  const winnersString = winners.join(', ');

  const faqs: FAQItem[] = [
    {
      question: 'How do I enter choices?',
      answer:
        'Simply type or paste your choices into the text box, with each choice on its own line.',
    },
    {
      question: 'How does the "Remove Picked Choice" mode work?',
      answer:
        'When enabled, any item selected as a winner is automatically removed from the list so it cannot be picked again on subsequent draws. This is ideal for elimination rounds and multi-prize raffles.',
    },
    {
      question: 'Is there a limit on how many items I can paste?',
      answer:
        'You can paste thousands of items. The calculation happens entirely inside your browser runtime with high speed.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Random Choice Picker
          </h2>
          <p>
            Can&apos;t decide what to eat, which movie to watch, or who wins the giveaway? The VEYLO Random Choice Picker lets you paste any custom list to pick one or multiple winners instantly with elimination support.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎟️ Giveaways &amp; Raffles</h3>
              <p className="text-[11px]">Pick random contest winners from lists of emails, usernames, or comments.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🍕 Meal Decisions</h3>
              <p className="text-[11px]">End group dinner debates with a fast, unbiased random restaurant picker.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🏫 Classroom Names</h3>
              <p className="text-[11px]">Draw student names for presentations or volunteer tasks fairly.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Choices Input Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Header & Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="choices-textarea" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Enter Choices (One per line)
              </label>
              <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                ({parsedChoices.length} options)
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 text-xs">
              <span style={{ color: 'var(--muted)' }}>Presets:</span>
              <button
                type="button"
                onClick={() => loadPreset('dinner')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                🍕 Dinner
              </button>
              <button
                type="button"
                onClick={() => loadPreset('activities')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                🎮 Activities
              </button>
              <button
                type="button"
                onClick={() => loadPreset('movies')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                🍿 Movies
              </button>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            id="choices-textarea"
            rows={7}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Enter one option per line..."
            className="w-full p-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: error ? '1px solid var(--red, #ef4444)' : '1px solid var(--border-c)',
            }}
          />

          {/* Controls and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="pick-qty" className="font-bold" style={{ color: 'var(--text)' }}>
                  Number to Pick:
                </label>
                <input
                  id="pick-qty"
                  type="number"
                  min="1"
                  max={Math.max(1, parsedChoices.length)}
                  value={pickCount}
                  onChange={(e) => setPickCount(Math.max(1, Number(e.target.value)))}
                  className="w-16 p-1.5 rounded-lg text-xs font-bold text-center focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              <label className="flex items-center gap-2 font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={removePicked}
                  onChange={(e) => setRemovePicked(e.target.checked)}
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>Remove Picked Choice from List</span>
              </label>

              <button
                type="button"
                onClick={shuffleList}
                className="font-semibold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Shuffle List
              </button>
            </div>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <button
                type="button"
                onClick={handlePick}
                disabled={isPicking || parsedChoices.length === 0}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 active:scale-95 shadow-sm flex items-center gap-2"
                style={{ background: 'var(--accent)', color: '#ffffff' }}
              >
                <span>🎯</span>
                <span>{isPicking ? 'Picking...' : 'Pick Winner'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-shake"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.25)' }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Winner Hero Display */}
        <div
          className="p-8 sm:p-12 rounded-3xl flex flex-col items-center justify-center gap-6 text-center shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              🎉 Selected Choice{winners.length > 1 ? 's' : ''}
            </span>
            <CopyButton textToCopy={winnersString} label="Copy Winner" />
          </div>

          {winners.length === 1 ? (
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`text-3xl sm:text-5xl font-black tracking-tight px-8 py-6 rounded-3xl transition-all duration-200 select-all ${
                  isPicking ? 'scale-95 opacity-50 blur-xs' : 'scale-100 opacity-100'
                }`}
                style={{
                  color: 'var(--accent)',
                  background: 'color-mix(in srgb, var(--accent) 8%, var(--surface))',
                  border: '2px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                }}
              >
                {winners[0]}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3 w-full p-4">
              {winners.map((winner, idx) => (
                <div
                  key={idx}
                  className="px-5 py-3 rounded-2xl text-lg sm:text-xl font-black shadow-xs select-all flex items-center gap-2"
                  style={{
                    background: 'color-mix(in srgb, var(--accent) 10%, var(--surface))',
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                  }}
                >
                  <span className="text-sm opacity-60">#{idx + 1}</span>
                  <span>{winner}</span>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handlePick}
            className="px-5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
          >
            Pick Again ↻
          </button>
        </div>

        {/* History Log */}
        {history.length > 1 && (
          <div
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Recent Pick History
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

            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto text-xs">
              {history.map((h, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl flex items-center justify-between gap-3"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <span className="font-bold truncate max-w-md" style={{ color: 'var(--text)' }}>
                    {h.picked.join(', ')}
                  </span>
                  <span className="text-[10px] opacity-60 flex-shrink-0">
                    {h.timestamp}
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
