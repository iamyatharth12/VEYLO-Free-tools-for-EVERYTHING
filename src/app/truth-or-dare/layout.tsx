import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/truth-or-dare`;

export const metadata: Metadata = {
  title: 'Truth or Dare Generator — Fun Party Game Prompts | VEYLO',
  description: 'Play Truth or Dare online with hundreds of curated, family-safe questions and fun dares categorized by party vibe. 100% free and client-side.',
  keywords: [
    'truth or dare generator',
    'truth or dare questions',
    'party game prompts',
    'truth or dare online',
    'family truth or dare',
    'icebreaker truth or dare',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Truth or Dare Generator — Fun Party Game Prompts | VEYLO',
    description: 'Play Truth or Dare online with hundreds of fun, family-safe questions and challenges on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Truth or Dare Generator — Fun Party Game Prompts | VEYLO',
    description: 'Play Truth or Dare online with curated, clean prompts on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Truth or Dare Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Truth or Dare Generator',
  applicationCategory: 'GameApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Online party game generator for Truth or Dare with family-safe prompts and customizable game modes.',
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
