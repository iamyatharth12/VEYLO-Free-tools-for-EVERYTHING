'use client';

import { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

export default function FAQSection({
  items,
  title = 'Frequently Asked Questions',
  className = '',
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section
        aria-label="FAQ"
        className={`p-6 sm:p-8 rounded-2xl flex flex-col gap-5 ${className}`}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-c)',
        }}
      >
        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          {title}
        </h2>

        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border-c)' }}>
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const headingId = `faq-q-${idx}`;
            const panelId = `faq-a-${idx}`;

            return (
              <div key={item.question} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 text-left font-semibold text-sm transition-colors hover:text-[var(--accent)]"
                  style={{ color: 'var(--text)' }}
                >
                  <span>{item.question}</span>
                  <span
                    className="text-xs transition-transform duration-200 flex-shrink-0"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: 'var(--muted)',
                    }}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="mt-2.5 text-xs sm:text-sm leading-relaxed animate-fade-in"
                    style={{ color: 'var(--muted)' }}
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
