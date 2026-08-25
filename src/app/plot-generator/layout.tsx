import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/plot-generator`;

export const metadata: Metadata = {
  title: 'Plot Generator — Three-Act Story & Narrative Outline Creator | VEYLO',
  description: 'Generate structured three-act plot outlines and Hero’s Journey story arcs with inciting incidents, midpoint twists, and climaxes for writers. 100% free and client-side.',
  keywords: [
    'plot generator',
    'story outline generator',
    'narrative structure',
    'novel plot creator',
    'creative writing outline',
    'three act structure generator',
    'heros journey generator',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Plot Generator — Three-Act Story & Narrative Outline Creator | VEYLO',
    description: 'Generate three-act narrative plot frameworks and story outlines on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plot Generator — Three-Act Story & Narrative Outline Creator | VEYLO',
    description: 'Generate narrative plot structures with inciting incidents and climaxes on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Plot Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Plot Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Narrative structure generator crafting multi-stage story outlines based on classic dramatic pacing models.',
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
