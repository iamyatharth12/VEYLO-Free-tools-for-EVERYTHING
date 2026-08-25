import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/character-name-generator`;

export const metadata: Metadata = {
  title: 'Character Name Generator — Fantasy, Sci-Fi & Modern Names | VEYLO',
  description: 'Generate distinctive character first names, surnames, and epic titles across fantasy, cyberpunk, sci-fi, medieval, and modern genres. 100% free and client-side.',
  keywords: [
    'character name generator',
    'fantasy name generator',
    'sci fi names',
    'novel character names',
    'rpg name maker',
    'medieval names generator',
    'dnd character names',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Character Name Generator — Fantasy, Sci-Fi & Modern Names | VEYLO',
    description: 'Generate distinctive character names across fantasy, sci-fi, modern, and historical genres on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Character Name Generator — Fantasy, Sci-Fi & Modern Names | VEYLO',
    description: 'Generate unique character first names, surnames, and titles on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Character Name Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Character Name Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Character name generator for novelists, screenwriters, and tabletop RPG players.',
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
