'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_TEXT = `The art of clear communication lies not in the abundance of words, but in the precision of thoughts. Every sentence should advance your narrative, every paragraph should illuminate a deeper truth, and every pause should allow the reader to reflect. When writing essays, reports, or stories, monitoring your word velocity ensures that your message remains sharp, engaging, and memorable.`;

export default function WordCounterPage() {
  const tool = useMemo(() => getToolBySlug('word-counter')!, []);

  const [text, setText] = useState<string>(SAMPLE_TEXT);

  // Compute text statistics in real time
  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        words: 0,
        charsWithSpaces: text.length,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        estimatedPages: 0,
        topKeywords: [],
      };
    }

    const wordsArray = raw.match(/\b[A-Za-z0-9'-]+\b/g) || [];
    const words = wordsArray.length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;

    // Sentences count
    const sentencesArray = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentences = sentencesArray.length;

    // Paragraphs count
    const paragraphsArray = text.split(/\n+/).filter(p => p.trim().length > 0);
    const paragraphs = paragraphsArray.length;

    // Reading & Speaking times
    const readingTimeMinutes = +(words / 200).toFixed(1); // 200 wpm
    const speakingTimeMinutes = +(words / 130).toFixed(1); // 130 wpm
    const estimatedPages = +(words / 250).toFixed(1); // 250 words per page

    // Keyword density
    const freqMap: Record<string, number> = {};
    const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'that', 'for', 'it', 'as', 'was', 'with', 'be', 'by', 'on', 'not', 'he', 'at', 'this', 'but', 'his', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'your', 'should']);

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
      readingTimeMinutes,
      speakingTimeMinutes,
      estimatedPages,
      topKeywords,
    };
  }, [text]);

  const faqs: FAQItem[] = [
    {
      question: 'How is reading time calculated?',
      answer:
        'Reading time is based on the universal reading speed standard of 200 words per minute (WPM), while speaking time is computed at an average conversational pace of 130 WPM.',
    },
    {
      question: 'Does this tool upload my text to external servers?',
      answer:
        'No. Everything is calculated 100% locally inside your browser memory. Your drafts, essays, and notes are never stored or transmitted.',
    },
    {
      question: 'How are sentences and paragraphs counted?',
      answer:
        'Sentences are detected via punctuation boundary tokens (. ? !), and paragraphs are determined by line breaks containing non-empty content.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Real-Time Word Counter
          </h2>
          <p>
            Whether you&apos;re adhering to strict academic essay length requirements, drafting blog posts, or timing a keynote speech, the VEYLO Word Counter provides instantaneous metrics on character counts, reading durations, and keyword densities.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📚 Essays &amp; Academics</h3>
              <p className="text-[11px]">Track word limits and estimated page counts (250 words per single page).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⏱️ Speech &amp; Audio Pacing</h3>
              <p className="text-[11px]">Estimate spoken speech duration (130 WPM) and silent reading speed (200 WPM).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔍 Keyword Density</h3>
              <p className="text-[11px]">Analyze frequent core terms to avoid repetitive phrasing and improve SEO.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Live Stat Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label htmlFor="counter-textarea" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Type or Paste Text Below
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXT)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Sample Text
              </button>
              <CopyButton textToCopy={text} size="sm" label="Copy Text" />
              <ResetButton onClick={() => setText('')} label="Clear" />
            </div>
          </div>

          <textarea
            id="counter-textarea"
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to analyze words, characters, and reading time..."
            className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: '1px solid var(--border-c)',
            }}
          />

          {/* Secondary Stats Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs" style={{ borderTop: '1px solid var(--border-c)', color: 'var(--muted)' }}>
            <div className="flex items-center gap-4 flex-wrap">
              <span>🎙️ Speaking Time: <strong style={{ color: 'var(--text)' }}>~{stats.speakingTimeMinutes} min</strong></span>
              <span>📄 Estimated Pages: <strong style={{ color: 'var(--text)' }}>~{stats.estimatedPages} pages</strong></span>
            </div>

            <span>100% client-side privacy</span>
          </div>
        </div>

        {/* Top Keywords Analysis */}
        {stats.topKeywords.length > 0 && (
          <div
            className="p-6 rounded-2xl flex flex-col gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Top Frequent Keywords &amp; Density
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
