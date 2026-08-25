import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/story-idea-generator`;

export const metadata: Metadata = {
  title: 'Story Idea Generator — Creative Writing Prompts & Premise Creator | VEYLO',
  description: 'Generate complete story concepts for novels, screenplays, and short fiction with customizable genres, protagonists, settings, conflicts, and dramatic twists. 100% free.',
  keywords: [
    'story idea generator',
    'writing prompts',
    'story premise generator',
    'creative writing generator',
    'plot hook generator',
    'novel idea generator',
    'screenplay ideas',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Story Idea Generator — Creative Writing Prompts & Premise Creator | VEYLO',
    description: 'Generate engaging story concepts with genre, protagonist, conflict, and twists on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Story Idea Generator — Creative Writing Prompts & Premise Creator | VEYLO',
    description: 'Generate creative writing premises with protagonists, settings, and twists on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Story Idea Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Story Idea Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Creative fiction generator creating story premises with genre, protagonist, setting, and plot twists.',
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
