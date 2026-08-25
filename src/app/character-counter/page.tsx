'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SOCIAL_LIMITS = [
  { name: 'X / Twitter Post', max: 280, icon: '🐦' },
  { name: 'SMS Message (1 Segment)', max: 160, icon: '💬' },
  { name: 'SEO Meta Description', max: 160, icon: '🔍' },
  { name: 'YouTube Video Title', max: 100, icon: '▶️' },
  { name: 'Instagram Caption', max: 2200, icon: '📸' },
  { name: 'LinkedIn Post', max: 3000, icon: '💼' },
];

export default function CharacterCounterPage() {
  const tool = useMemo(() => getToolBySlug('character-counter')!, []);

  const [text, setText] = useState<string>('Mastering concise writing is an essential skill for social media posts, advertising copy, and SEO meta descriptions.');

  const stats = useMemo(() => {
    const total = text.length;
    const noSpaces = text.replace(/\s+/g, '').length;
    const spaces = (text.match(/\s/g) || []).length;
    const letters = (text.match(/[A-Za-z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const symbols = (text.match(/[^A-Za-z0-9\s]/g) || []).length;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;

    return {
      total,
      noSpaces,
      spaces,
      letters,
      digits,
      symbols,
      lines,
    };
  }, [text]);

  const faqs: FAQItem[] = [
    {
      question: 'Why is tracking character count without spaces important?',
      answer:
        'Many formal applications, translation services, and academic submissions bill or calculate quotas based exclusively on non-whitespace character counts.',
    },
    {
      question: 'What happens when I exceed a social media character limit?',
      answer:
        'The progress meters below automatically display negative remaining counts and switch from blue to red warning colors so you can trim your copy accurately.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Character Counter
          </h2>
          <p>
            Whether formatting a Twitter post, checking Google SERP snippet lengths, or monitoring character boundaries for text messaging SMS campaigns, the VEYLO Character Counter breaks down exact character, digit, and symbol metrics with visual limit meters.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🐦 Social Media Gauges</h3>
              <p className="text-[11px]">Real-time visual progress bars for Twitter (280), Instagram (2200), and LinkedIn (3000).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔍 SEO Optimization</h3>
              <p className="text-[11px]">Prevent Google SERP truncation by keeping meta descriptions under 160 characters.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>💬 SMS Quotas</h3>
              <p className="text-[11px]">Track 160-character single-segment standard SMS limits for marketing campaigns.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Breakdown Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-3.5 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Total Chars</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--accent)' }}>{stats.total.toLocaleString()}</span>
          </div>

          <div className="p-3.5 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>No Spaces</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.noSpaces.toLocaleString()}</span>
          </div>

          <div className="p-3.5 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Spaces</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.spaces}</span>
          </div>

          <div className="p-3.5 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Letters</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.letters}</span>
          </div>

          <div className="p-3.5 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Digits</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.digits}</span>
          </div>

          <div className="p-3.5 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Symbols</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.symbols}</span>
          </div>

          <div className="p-3.5 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Lines</span>
            <span className="text-2xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.lines}</span>
          </div>
        </div>

        {/* Input Text Area Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <label htmlFor="char-textarea" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Input Text
            </label>

            <div className="flex items-center gap-2">
              <CopyButton textToCopy={text} size="sm" label="Copy" />
              <ResetButton onClick={() => setText('')} label="Clear" />
            </div>
          </div>

          <textarea
            id="char-textarea"
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to track character and platform limits..."
            className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: '1px solid var(--border-c)',
            }}
          />
        </div>

        {/* Social Media Character Limit Gauges */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Platform Character Limits &amp; Progress Meters
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOCIAL_LIMITS.map(limit => {
              const remaining = limit.max - stats.total;
              const isOver = remaining < 0;
              const percent = Math.min(100, Math.round((stats.total / limit.max) * 100));

              return (
                <div
                  key={limit.name}
                  className="p-4 rounded-2xl flex flex-col gap-2.5 shadow-2xs"
                  style={{
                    background: 'var(--surface-2)',
                    border: isOver ? '1px solid var(--red, #ef4444)' : '1px solid var(--border-c)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text)' }}>
                      <span>{limit.icon}</span>
                      <span>{limit.name}</span>
                    </span>

                    <span
                      className="text-xs font-bold font-mono"
                      style={{ color: isOver ? 'var(--red, #ef4444)' : 'var(--muted)' }}
                    >
                      {isOver ? `${remaining}` : `${remaining} left`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                    <div
                      className="h-full transition-all duration-200"
                      style={{
                        width: `${percent}%`,
                        background: isOver ? 'var(--red, #ef4444)' : 'var(--accent)',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] opacity-60 font-mono">
                    <span>{stats.total} chars</span>
                    <span>Max {limit.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
