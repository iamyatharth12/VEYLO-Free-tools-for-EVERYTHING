import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/song-idea-generator`;

export const metadata: Metadata = {
  title: 'Song Idea Generator — Music Songwriting Prompts & Hooks | VEYLO',
  description: 'Generate original song concepts with genre, BPM, musical keys, instrumentation arrangements, and hook themes for songwriters and music producers. 100% free and client-side.',
  keywords: [
    'song idea generator',
    'songwriting prompts',
    'music idea generator',
    'lyric theme ideas',
    'chord progression concept',
    'music producer prompts',
    'beat maker ideas',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Song Idea Generator — Music Songwriting Prompts & Hooks | VEYLO',
    description: 'Generate original songwriting concepts with genre, BPM, mood, and hook themes on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Song Idea Generator — Music Songwriting Prompts & Hooks | VEYLO',
    description: 'Generate songwriting concepts with BPM, instruments, and lyric themes on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Song Idea Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Song Idea Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Songwriting and music production concept generator with BPM, mood, key signatures, and lyrical themes.',
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
