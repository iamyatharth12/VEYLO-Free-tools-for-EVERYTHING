'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

type Outcome = 'YES' | 'NO' | 'MAYBE';

export default function YesOrNoPage() {
  const tool = useMemo(() => getToolBySlug('yes-or-no')!, []);

  const [question, setQuestion] = useState<string>('');
  const [includeMaybe, setIncludeMaybe] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<Outcome>('YES');
  const [isDeciding, setIsDeciding] = useState<boolean>(false);

  const [stats, setStats] = useState({
    yes: 0,
    no: 0,
    maybe: 0,
    total: 0,
  });

  const [history, setHistory] = useState<{
    outcome: Outcome;
    question: string;
    timestamp: string;
  }[]>([]);

  const makeDecision = useCallback(() => {
    setIsDeciding(true);

    setTimeout(() => {
      const buf = new Uint32Array(1);
      window.crypto.getRandomValues(buf);
      const rand = buf[0] / (0xffffffff + 1);

      let chosen: Outcome = 'YES';

      if (includeMaybe) {
        if (rand < 0.45) chosen = 'YES';
        else if (rand < 0.90) chosen = 'NO';
        else chosen = 'MAYBE';
      } else {
        chosen = rand < 0.5 ? 'YES' : 'NO';
      }

      setOutcome(chosen);

      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        yes: chosen === 'YES' ? prev.yes + 1 : prev.yes,
        no: chosen === 'NO' ? prev.no + 1 : prev.no,
        maybe: chosen === 'MAYBE' ? prev.maybe + 1 : prev.maybe,
      }));

      setHistory(prev => [
        {
          outcome: chosen,
          question: question.trim() || 'Random Decision',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 14),
      ]);

      setIsDeciding(false);
    }, 450);
  }, [includeMaybe, question]);

  const handleReset = () => {
    setQuestion('');
    setIncludeMaybe(false);
    setOutcome('YES');
    setStats({ yes: 0, no: 0, maybe: 0, total: 0 });
    setHistory([]);
  };

  const faqs: FAQItem[] = [
    {
      question: 'How is the Yes or No answer determined?',
      answer:
        'The decision is generated using cryptographic randomness (crypto.getRandomValues) directly in your browser with exactly 50% probability for Yes and 50% probability for No.',
    },
    {
      question: 'Can I include a "Maybe" option?',
      answer:
        'Yes. Toggle the "Include Maybe Option" switch to add a 10% chance for a "Maybe" wild card outcome.',
    },
    {
      question: 'Is my question stored or shared?',
      answer:
        'Never. Your questions are calculated client-side in your local browser session and are never transmitted to any server.',
    },
  ];

  const getOutcomeColor = (o: Outcome) => {
    if (o === 'YES') return { bg: '#ecfdf5', text: '#059669', border: '#10b981' };
    if (o === 'NO') return { bg: '#fef2f2', text: '#dc2626', border: '#ef4444' };
    return { bg: '#fefce8', text: '#ca8a04', border: '#eab308' };
  };

  const activeColors = getOutcomeColor(outcome);

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Yes or No Decision Maker
          </h2>
          <p>
            Stuck in analysis paralysis or need a fun, spontaneous way to resolve everyday dilemmas? The VEYLO Yes or No Generator provides instant, unbiased answers with dynamic visual animations and decision logs.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ Fast Choices</h3>
              <p className="text-[11px]">Break decision fatigue on meals, workout times, or daily choices instantly.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔮 Wheel Alternative</h3>
              <p className="text-[11px]">Instant, lightweight alternative to slow spinning wheels with zero ads.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📝 Question Tracking</h3>
              <p className="text-[11px]">Type optional questions to log decisions in your recent history feed.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Input & Config Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Question Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="decision-q" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Your Question / Dilemma (Optional)
            </label>
            <input
              id="decision-q"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Should I order pizza tonight? Should I start my project now?"
              onKeyDown={(e) => e.key === 'Enter' && makeDecision()}
              className="w-full p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />
          </div>

          {/* Toggle & Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
            <label className="flex items-center gap-2 font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={includeMaybe}
                onChange={(e) => setIncludeMaybe(e.target.checked)}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span>Include &quot;Maybe&quot; Option (10% Chance)</span>
            </label>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <button
                type="button"
                onClick={makeDecision}
                disabled={isDeciding}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 active:scale-95 shadow-sm flex items-center gap-2"
                style={{ background: 'var(--accent)', color: '#ffffff' }}
              >
                <span>🔮</span>
                <span>{isDeciding ? 'Deciding...' : 'Ask the Generator'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Decision Hero Card */}
        <div
          className="p-10 sm:p-14 rounded-3xl flex flex-col items-center justify-center gap-6 text-center shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {question && (
            <div className="text-sm sm:text-base font-semibold max-w-lg italic" style={{ color: 'var(--muted)' }}>
              &ldquo;{question}&rdquo;
            </div>
          )}

          {/* Large Reveal Card */}
          <div
            className={`py-8 px-12 sm:px-20 rounded-3xl transition-all duration-300 font-black tracking-wider select-all shadow-md ${
              isDeciding ? 'scale-90 opacity-50 blur-xs' : 'scale-100 opacity-100'
            }`}
            style={{
              background: activeColors.bg,
              color: activeColors.text,
              border: `2px solid ${activeColors.border}`,
            }}
          >
            <div className="text-6xl sm:text-9xl font-black">
              {isDeciding ? '...' : outcome}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CopyButton textToCopy={outcome} label="Copy Answer" size="md" />
            <button
              type="button"
              onClick={makeDecision}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              Ask Again ↻
            </button>
          </div>
        </div>

        {/* Statistics & History Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Statistics */}
          <div
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Decision Statistics ({stats.total} Total)
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl flex flex-col gap-0.5" style={{ background: 'var(--surface-2)' }}>
                <span className="text-[11px]" style={{ color: 'var(--muted)' }}>YES</span>
                <span className="text-lg font-black font-mono" style={{ color: '#059669' }}>{stats.yes}</span>
              </div>

              <div className="p-3 rounded-xl flex flex-col gap-0.5" style={{ background: 'var(--surface-2)' }}>
                <span className="text-[11px]" style={{ color: 'var(--muted)' }}>NO</span>
                <span className="text-lg font-black font-mono" style={{ color: '#dc2626' }}>{stats.no}</span>
              </div>

              <div className="p-3 rounded-xl flex flex-col gap-0.5" style={{ background: 'var(--surface-2)' }}>
                <span className="text-[11px]" style={{ color: 'var(--muted)' }}>MAYBE</span>
                <span className="text-lg font-black font-mono" style={{ color: '#ca8a04' }}>{stats.maybe}</span>
              </div>
            </div>
          </div>

          {/* History */}
          <div
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Recent Decisions
            </h3>

            {history.length > 0 ? (
              <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto text-xs">
                {history.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg flex items-center justify-between gap-2"
                    style={{ background: 'var(--surface-2)' }}
                  >
                    <span className="font-medium truncate max-w-[200px]" style={{ color: 'var(--text)' }}>
                      {h.question}
                    </span>
                    <span
                      className="font-black px-2 py-0.5 rounded text-[10px]"
                      style={{
                        background: h.outcome === 'YES' ? '#ecfdf5' : h.outcome === 'NO' ? '#fef2f2' : '#fefce8',
                        color: h.outcome === 'YES' ? '#059669' : h.outcome === 'NO' ? '#dc2626' : '#ca8a04',
                      }}
                    >
                      {h.outcome}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic" style={{ color: 'var(--muted)' }}>
                No decisions recorded yet. Ask a question above!
              </p>
            )}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
