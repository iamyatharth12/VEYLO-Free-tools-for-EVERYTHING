import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/character-generator`;

export const metadata: Metadata = {
  title: 'Character Generator — Fictional Persona & NPC Creator | VEYLO',
  description: 'Generate fleshed-out fictional characters and tabletop RPG NPCs with unique personalities, occupations, flaws, motivations, and backstories. 100% free and client-side.',
  keywords: [
    'character generator',
    'npc generator',
    'character creator',
    'fictional persona maker',
    'rpg character traits',
    'dnd npc generator',
    'writing character maker',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Character Generator — Fictional Persona & NPC Creator | VEYLO',
    description: 'Generate complete fictional characters with personality traits, flaws, motivations, and secrets with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Character Generator — Fictional Persona & NPC Creator | VEYLO',
    description: 'Generate fleshed-out characters and NPCs for stories and tabletop RPGs on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Character Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Character Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Fictional character and NPC generator complete with motivations, personality quirks, strengths, and secrets.',
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
