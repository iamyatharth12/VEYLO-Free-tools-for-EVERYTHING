import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/dice-roller`;

export const metadata: Metadata = {
  title: 'Dice Roller Online — D&D & RPG Multi-Dice Simulator | VEYLO',
  description: 'Virtual polyhedral dice roller for D&D and tabletop RPGs. Roll d4, d6, d8, d10, d12, d20, and d100 dice with custom modifiers and critical hit tracking.',
  keywords: [
    'dice roller',
    'dnd dice roller',
    'd20 roller',
    'roll dice online',
    'tabletop dice simulator',
    'd4 d6 d8 d10 d12 d20',
    'rpg dice roller',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Dice Roller Online — D&D & RPG Multi-Dice Simulator | VEYLO',
    description: 'Virtual polyhedral dice roller for tabletop gaming. Roll d4, d6, d8, d10, d12, d20, and d100 with modifiers on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dice Roller Online — D&D & RPG Multi-Dice Simulator | VEYLO',
    description: 'Roll tabletop RPG dice (d4-d100) with custom modifiers on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Dice Roller', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Dice Roller',
  applicationCategory: 'GameApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Virtual polyhedral dice roller for Dungeons & Dragons, Pathfinder, and tabletop board games.',
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
