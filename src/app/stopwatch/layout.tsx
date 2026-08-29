import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/stopwatch`;

export const metadata: Metadata = {
  title: 'Online Stopwatch & Lap Timer — Millisecond Accurate Timer | VEYLO',
  description: 'Free online stopwatch with millisecond precision, split lap records, keyboard hotkeys, lap statistics, and CSV export. Immune to tab throttling.',
  keywords: [
    'online stopwatch',
    'stopwatch with laps',
    'lap timer',
    'split timer',
    'millisecond stopwatch',
    'precision stopwatch',
    'browser stopwatch',
    'free stopwatch online',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Online Stopwatch & Lap Timer — Millisecond Accurate Timer | VEYLO',
    description: 'High-precision browser stopwatch with split lap tracking and keyboard hotkey controls.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Stopwatch & Lap Timer — Millisecond Accurate Timer | VEYLO',
    description: 'Millisecond-accurate online stopwatch and lap split timer with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Online Stopwatch & Lap Timer', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Online Stopwatch & Lap Timer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'High-precision browser stopwatch with monotonic performance.now() clock, lap split tracking, and CSV export.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      {children}
    </>
  );
}
