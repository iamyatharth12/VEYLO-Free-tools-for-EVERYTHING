import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/about`;

export const metadata: Metadata = {
  title: 'About VEYLO — Free tools for EVERYTHING',
  description: 'Learn about VEYLO and our mission to build a massive collection of fast, free, privacy-first browser utilities for testing, calculating, converting, and troubleshooting.',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'About VEYLO', item: CANONICAL_URL },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="flex flex-col gap-8 py-6 max-w-4xl mx-auto animate-fade-in">
        <section className="text-center flex flex-col items-center">
          <span
            className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--accent)' }}
          >
            About VEYLO
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text)' }}>
            Free tools for EVERYTHING.
          </h1>
          <p className="text-base sm:text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>
            VEYLO is built with a single mission: to create one fast, clean place for free browser tools that work directly on your device without software downloads or subscriptions.
          </p>
        </section>

        <article className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Our Mission &amp; Platform Direction</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Everyday computer tasks—from verifying mouse switch chatter and measuring polling rate to formatting JSON strings or testing keyboard ghosting—often force users to download suspicious executables or navigate cluttered ad-ridden websites.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            VEYLO is designed as an open utility platform. We started with our flagship <Link href="/mouse-tester" className="font-semibold underline" style={{ color: 'var(--accent)' }}>Mouse Tester</Link> suite and are expanding into keyboard diagnostics, display tests, audio tools, developer utilities, and fast calculators.
          </p>


          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Our Technical &amp; Privacy Standard</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl flex flex-col gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Client-Side Processing in Your Browser</h3>
              <p style={{ color: 'var(--muted)' }}>
                All click events, cursor movement coordinates, scroll wheel notches, and latency calculations are processed locally inside your browser memory runtime.
              </p>
            </div>

            <div className="p-4 rounded-xl flex flex-col gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Zero Input Logging</h3>
              <p style={{ color: 'var(--muted)' }}>
                We do not track, log, record, or upload your mouse clicks, cursor paths, or test inputs to any remote server or third-party storage.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Explore Our Production Utilities</h2>
          <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
            <Link href="/mouse-tester" className="px-3.5 py-2 rounded-lg transition-colors" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Mouse Tester Suite</Link>
            <Link href="/mouse-click-test" className="px-3.5 py-2 rounded-lg transition-colors" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Mouse Click Test</Link>
            <Link href="/double-click-test" className="px-3.5 py-2 rounded-lg transition-colors" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Double Click Test</Link>
            <Link href="/mouse-scroll-test" className="px-3.5 py-2 rounded-lg transition-colors" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Mouse Scroll Test</Link>
            <Link href="/mouse-polling-rate-test" className="px-3.5 py-2 rounded-lg transition-colors" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Mouse Polling Rate Test</Link>
            <Link href="/mouse-dpi-test" className="px-3.5 py-2 rounded-lg transition-colors" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Mouse DPI Test</Link>
            <Link href="/cps-test" className="px-3.5 py-2 rounded-lg transition-colors" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>CPS Speed Test</Link>
          </div>
        </article>
      </div>
    </>
  );
}

