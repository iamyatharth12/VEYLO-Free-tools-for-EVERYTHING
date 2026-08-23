import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/privacy`;

export const metadata: Metadata = {
  title: 'Privacy Policy — VEYLO',
  description: 'Our privacy policy explains VEYLO\'s 100% client-side browser processing architecture and commitment to zero input logging.',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: CANONICAL_URL },
  ],
};


export default function PrivacyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="flex flex-col gap-8 py-6 max-w-4xl mx-auto animate-fade-in">
        <section className="text-center">
          <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--text)' }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Last updated: August 23, 2026
          </p>
        </section>

        <article className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6 text-sm leading-relaxed" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>1. Client-Side Processing in Your Browser</h2>
          <p>
            At Mouse Tester and across our browser utilities, we prioritize your privacy. All mouse button clicks, cursor movements, scroll wheel events, polling rate measurements, and speed scores are processed 100% locally within your web browser runtime memory. No input data, event logs, coordinates, or keystroke information is ever uploaded to or stored on our servers.
          </p>

          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>2. Cookies &amp; Local Storage</h2>
          <p>
            We use browser standard <code style={{ color: 'var(--accent)' }}>localStorage</code> solely for remembering your UI theme preference (Light/Dark mode) and storing your personal high scores for click speed challenges. No personal identity data is stored in cookies or local storage.
          </p>

          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>3. Third-Party Advertising &amp; Analytics</h2>
          <p>
            Future advertising partners (such as Google AdSense) may use cookies or web beacons to serve advertisements based on non-personally identifiable visit data. You can manage or disable ad personalization cookies in your browser settings at any time.
          </p>

          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>4. Contact &amp; Inquiries</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please visit our <Link href="/contact" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Contact Page</Link>.
          </p>
        </article>
      </div>
    </>
  );
}

