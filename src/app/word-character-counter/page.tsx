'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_TEXT = `Effective writing communicates complex ideas with utmost clarity. Every word should serve a specific purpose, every sentence should carry emotional resonance, and every paragraph should construct a cohesive argument. By monitoring your word count, reading duration, and sentence length in real time, you ensure your prose is engaging, concise, and impactful for your audience.`;

export default function WordCharacterCounterPage() {
  const tool = useMemo(() => getToolBySlug('word-character-counter')!, []);

  const [text, setText] = useState<string>(SAMPLE_TEXT);

  // Real-time Text Statistics
  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        words: 0,
        charsWithSpaces: text.length,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        avgWordLength: 0,
        avgSentenceLength: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        topKeywords: [],
      };
    }

    const wordsArray = raw.match(/\b[A-Za-z0-9'-]+\b/g) || [];
    const words = wordsArray.length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;

    // Sentences
    const sentencesArray = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentences = Math.max(1, sentencesArray.length);

    // Paragraphs & Lines
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || 1;
    const lines = text.split('\n').length;

    // Averages
    const avgWordLength = words > 0 ? +(charsNoSpaces / words).toFixed(1) : 0;
    const avgSentenceLength = sentences > 0 ? +(words / sentences).toFixed(1) : 0;

    // Reading & Speaking times
    const readingTimeMinutes = +(words / 200).toFixed(1);
    const speakingTimeMinutes = +(words / 130).toFixed(1);

    // Top Keywords & Frequency
    const freqMap: Record<string, number> = {};
    const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'that', 'for', 'it', 'as', 'was', 'with', 'be', 'by', 'on', 'not', 'he', 'at', 'this', 'but', 'his', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'your', 'should', 'every']);

    wordsArray.forEach(w => {
      const clean = w.toLowerCase();
      if (clean.length > 2 && !stopWords.has(clean)) {
        freqMap[clean] = (freqMap[clean] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percent: +((count / Math.max(1, words)) * 100).toFixed(1),
      }));

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      lines,
      avgWordLength,
      avgSentenceLength,
      readingTimeMinutes,
      speakingTimeMinutes,
      topKeywords,
    };
  }, [text]);

  // Social Media Limits Configuration
  const socialLimits = [
    { name: 'X / Twitter Post', max: 280, count: stats.charsWithSpaces },
    { name: 'Instagram Bio', max: 150, count: stats.charsWithSpaces },
    { name: 'SEO Meta Title', max: 60, count: stats.charsWithSpaces },
    { name: 'SEO Meta Description', max: 160, count: stats.charsWithSpaces },
    { name: 'SMS Standard Message', max: 160, count: stats.charsWithSpaces },
  ];

  const handleReset = () => {
    setText('');
  };

  const faqs: FAQItem[] = [
    {
      question: 'How are reading and speaking times estimated?',
      answer:
        'Reading speed is computed using the global standard of 200 words per minute (WPM) for silent comprehension, while speaking time assumes a conversational speech rate of 130 WPM.',
    },
    {
      question: 'Are spaces counted in the character count?',
      answer:
        'We calculate both "Characters (with spaces)" which includes whitespace, tabs, and line breaks, and "Characters (no spaces)" which tallies only alphanumeric characters and punctuation.',
    },
    {
      question: 'Does this tool transmit my text to any third-party?',
      answer:
        'No. All text parsing runs 100% in your local browser memory. Your drafts and notes never touch our servers.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Real-Time Text Analytics, Word Counter &amp; Character Limiter
          </h2>
          <p>
            Analyze written copy for essays, academic papers, marketing advertisements, and social media posts with live metrics.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📊 Comprehensive Metrics</h3>
              <p className="text-[11px]">Track words, characters with/without spaces, sentences, paragraphs, and lines.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📱 Social Character Meters</h3>
              <p className="text-[11px]">Visual progress bars for Twitter (280), Instagram, SEO titles, and SMS.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎙️ Speech Pacing</h3>
              <p className="text-[11px]">Estimate spoken speech duration (130 WPM) and silent reading speed (200 WPM).</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Core Stat Numbers Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Words</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--accent)' }}>{stats.words.toLocaleString()}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Characters</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.charsWithSpaces.toLocaleString()}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>No Spaces</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.charsNoSpaces.toLocaleString()}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Sentences</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.sentences}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Paragraphs</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.paragraphs}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Reading Time</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--green, #10b981)' }}>
              {stats.readingTimeMinutes < 1 ? '<1m' : `${stats.readingTimeMinutes}m`}
            </span>
          </div>
        </div>

        {/* Text Area Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="char-counter-text" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Type or Paste Text Below
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXT)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Sample Text
              </button>
              <CopyButton textToCopy={text} size="sm" label="Copy Text" />
              <ResetButton onClick={handleReset} label="Clear" />
            </div>
          </div>

          <textarea
            id="char-counter-text"
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste content to analyze words, characters, reading time, and social limits..."
            className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
            style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
          />

          {/* Secondary Details */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs" style={{ borderTop: '1px solid var(--border-c)', color: 'var(--muted)' }}>
            <div className="flex items-center gap-4 flex-wrap">
              <span>🎙️ Speaking Time: <strong style={{ color: 'var(--text)' }}>~{stats.speakingTimeMinutes} min</strong></span>
              <span>📏 Avg Word Length: <strong style={{ color: 'var(--text)' }}>{stats.avgWordLength} chars</strong></span>
              <span>📝 Avg Sentence: <strong style={{ color: 'var(--text)' }}>{stats.avgSentenceLength} words</strong></span>
              <span>📄 Lines: <strong style={{ color: 'var(--text)' }}>{stats.lines}</strong></span>
            </div>
            <span>100% Client-Side Privacy</span>
          </div>
        </div>

        {/* Social Media Character Limits Card */}
        <div
          className="p-6 rounded-2xl flex flex-col gap-4 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Social Media &amp; Search Character Limit Indicators
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {socialLimits.map((item) => {
              const remaining = item.max - item.count;
              const isOver = remaining < 0;
              const pct = Math.min(100, Math.round((item.count / item.max) * 100));

              return (
                <div
                  key={item.name}
                  className="p-3.5 rounded-xl flex flex-col gap-2 shadow-2xs"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold" style={{ color: 'var(--text)' }}>{item.name}</span>
                    <span
                      className="font-mono font-bold text-[11px]"
                      style={{ color: isOver ? '#ef4444' : 'var(--muted)' }}
                    >
                      {item.count} / {item.max}
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: isOver ? '#ef4444' : pct > 85 ? '#f59e0b' : 'var(--green, #10b981)',
                      }}
                    />
                  </div>

                  <span className="text-[10px]" style={{ color: isOver ? '#ef4444' : 'var(--muted)' }}>
                    {isOver ? `Over by ${Math.abs(remaining)} chars` : `${remaining} characters remaining`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keyword Density Breakdown */}
        {stats.topKeywords.length > 0 && (
          <div
            className="p-6 rounded-2xl flex flex-col gap-4 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Top Keywords &amp; Density
            </h3>

            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
              {stats.topKeywords.map((kw, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
                >
                  <span className="font-bold text-xs capitalize truncate" style={{ color: 'var(--text)' }}>
                    {kw.word}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md" style={{ background: 'var(--surface)', color: 'var(--accent)' }}>
                    {kw.count}x ({kw.percent}%)
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
