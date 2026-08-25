import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/random-choice-picker`;

export const metadata: Metadata = {
  title: 'Random Choice Picker — Pick a Random Item from List | VEYLO',
  description: 'Paste any list of items, names, or options to pick random winners with elimination raffle mode and preset templates. 100% free and client-side.',
  keywords: [
    'random choice picker',
    'random selector',
    'pick from list',
    'random name picker',
    'raffle picker',
    'list randomizer',
    'random item chooser',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Random Choice Picker — Pick a Random Item from List | VEYLO',
    description: 'Paste any list of items or names to pick random winners with elimination mode on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Choice Picker — Pick a Random Item from List | VEYLO',
    description: 'Randomly pick items or winners from custom lists online with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Random Choice Picker', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Random Choice Picker',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Online random selector and raffle picker for choosing items or names from a custom list.',
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
