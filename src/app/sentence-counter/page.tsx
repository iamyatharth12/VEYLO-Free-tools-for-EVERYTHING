'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_TEXT = `Good writing has rhythm. The speech is at home in the mouth, and the ear hears it before the brain analyzes it. Short sentences add punch. Long sentences allow for deep, meandering thoughts that sweep the reader across intricate landscapes of memory and imagination. By varying your sentence lengths, you create a dynamic musicality in your prose that keeps readers engaged from the opening line to the final conclusion.`;

export default function SentenceCounterPage() {
  const tool = useMemo(() => getToolBySlug('sentence-counter')!, []);

  const [text, setText] = useState<string>(SAMPLE_TEXT);

  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        sentenceCount: 0,
        wordCount: 0,
        avgWordsPerSentence: 0,
        avgCharsPerSentence: 0,
        fleschScore: 100,
        fleschGrade: 'Easy to Read',
        shortestSentence: '',
        longestSentence: '',
        hardSentencesCount: 0,
      };
    }

    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && /[A-Za-z0-9]/.test(s));

    const sentenceCount = Math.max(1, sentences.length);
    const words = raw.match(/\b[A-Za-z0-9'-]+\b/g) || [];
    const wordCount = words.length;

    const avgWordsPerSentence = +(wordCount / sentenceCount).toFixed(1);
    const avgCharsPerSentence = +(raw.length / sentenceCount).toFixed(1);

    // Rough syllable count for Flesch reading ease
    let syllables = 0;
    words.forEach(w => {
      const match = w.toLowerCase().match(/[aeiouy]{1,2}/g);
      syllables += match ? match.length : 1;
    });

    // Flesch Reading Ease Formula = 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    const fleschRaw = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / Math.max(1, wordCount));
    const fleschScore = Math.max(0, Math.min(100, Math.round(fleschRaw)));

    let fleschGrade = 'Standard / Plain English';
    if (fleschScore >= 80) fleschGrade = 'Very Easy (6th Grade)';
    else if (fleschScore >= 60) fleschGrade = 'Standard (8th–9th Grade)';
    else if (fleschScore >= 40) fleschGrade = 'Fairly Difficult (High School)';
    else fleschGrade = 'Complex / Academic (College Level)';

    // Find shortest & longest
    let shortest = sentences[0] || '';
    let longest = sentences[0] || '';
    let hardCount = 0;

    sentences.forEach(s => {
      const sWords = (s.match(/\b[A-Za-z0-9'-]+\b/g) || []).length;
      if (sWords > 25) hardCount++;
      if (s.length < shortest.length && s.length > 3) shortest = s;
      if (s.length > longest.length) longest = s;
    });

    return {
      sentenceCount: sentences.length,
      wordCount,
      avgWordsPerSentence,
      avgCharsPerSentence,
      fleschScore,
      fleschGrade,
      shortestSentence: shortest,
      longestSentence: longest,
      hardSentencesCount: hardCount,
    };
  }, [text]);

  const faqs: FAQItem[] = [
    {
      question: 'What is the ideal average sentence length?',
      answer:
        'For clear, readable web content and non-fiction, an average of 14 to 18 words per sentence is widely recommended. Sentences exceeding 25 words often increase cognitive load.',
    },
    {
      question: 'How is the Flesch Reading Ease calculated?',
      answer:
        'Flesch Reading Ease evaluates average sentence length combined with average syllables per word. Scores above 60 indicate clear, accessible prose suitable for general audiences.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Sentence Counter &amp; Readability Checker
          </h2>
          <p>
            Varying your sentence structure creates engaging, dynamic writing rhythm. The VEYLO Sentence Counter calculates exact sentence tallies, average sentence lengths, and Flesch reading ease scores to ensure your copy is clear and compelling.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📑 Sentence Counts</h3>
              <p className="text-[11px]">Accurately parses punctuation boundaries (. ! ?) across complex paragraphs.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📏 Average Lengths</h3>
              <p className="text-[11px]">Computes words per sentence to help you trim overcomplicated run-on thoughts.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🧠 Readability Grade</h3>
              <p className="text-[11px]">Flesch-Kincaid index score estimating grade-level comprehension difficulty.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Sentences</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--accent)' }}>{stats.sentenceCount}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Avg Words / Sent</span>
            <span className="text-3xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.avgWordsPerSentence}</span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Flesch Score</span>
            <span className="text-3xl font-black font-mono" style={{ color: stats.fleschScore >= 60 ? 'var(--green, #10b981)' : 'var(--accent)' }}>
              {stats.fleschScore}/100
            </span>
          </div>

          <div className="p-4 rounded-2xl flex flex-col gap-1 text-center shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Long Sentences</span>
            <span className="text-3xl font-black font-mono" style={{ color: stats.hardSentencesCount > 0 ? 'var(--red, #ef4444)' : 'var(--text)' }}>
              {stats.hardSentencesCount}
            </span>
          </div>
        </div>

        {/* Input Text Area Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="sentence-textarea" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Input Text for Analysis
              </label>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
                {stats.fleschGrade}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CopyButton textToCopy={text} size="sm" label="Copy" />
              <ResetButton onClick={() => setText('')} label="Clear" />
            </div>
          </div>

          <textarea
            id="sentence-textarea"
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste prose or essays to analyze sentence rhythm and readability..."
            className="w-full p-4 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: '1px solid var(--border-c)',
            }}
          />
        </div>

        {/* Sentence Inspector Cards */}
        {stats.sentenceCount > 1 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl flex flex-col gap-2" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                ⚡ Shortest Sentence ({stats.shortestSentence.split(' ').length} words)
              </span>
              <p className="text-xs sm:text-sm font-semibold italic leading-relaxed" style={{ color: 'var(--text)' }}>
                &ldquo;{stats.shortestSentence}&rdquo;
              </p>
            </div>

            <div className="p-5 rounded-2xl flex flex-col gap-2" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                📜 Longest Sentence ({stats.longestSentence.split(' ').length} words)
              </span>
              <p className="text-xs sm:text-sm font-semibold italic leading-relaxed" style={{ color: 'var(--text)' }}>
                &ldquo;{stats.longestSentence}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
