import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/drawing-prompt-generator`;

export const metadata: Metadata = {
  title: 'Drawing Prompt Generator — Daily Sketch Challenges & Ideas | VEYLO',
  description: 'Instant drawing prompts for daily sketchbook practice. Features difficulty levels from quick 5-minute warmups to complex character design challenges with built-in timer. 100% free.',
  keywords: [
    'drawing prompt generator',
    'sketchbook prompts',
    'daily drawing challenge',
    'quick sketch ideas',
    'drawing warmup generator',
    'figure drawing prompts',
    'sketch timer online',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Drawing Prompt Generator — Daily Sketch Challenges & Ideas | VEYLO',
    description: 'Instant drawing prompts for daily sketchbook practice and warmup drills on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drawing Prompt Generator — Daily Sketch Challenges & Ideas | VEYLO',
    description: 'Daily sketchbook prompts and timed drawing warmup challenges on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Drawing Prompt Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Drawing Prompt Generator',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Daily sketchbook challenge generator with warmups, character design prompts, and practice timers.',
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
