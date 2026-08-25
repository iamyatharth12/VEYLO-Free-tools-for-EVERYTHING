import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/band-name-generator`;

export const metadata: Metadata = {
  title: 'Band Name Generator — Creative Artist & Band Name Maker | VEYLO',
  description: 'Generate catchy, memorable band names and music artist aliases filtered by style: rock, indie, electronic, synthwave, metal, and lo-fi. 100% free and client-side.',
  keywords: [
    'band name generator',
    'music artist names',
    'rock band names',
    'dj name generator',
    'indie band name maker',
    'cool band names',
    'music group name generator',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Band Name Generator — Creative Artist & Band Name Maker | VEYLO',
    description: 'Generate catchy band names and music artist aliases across rock, indie, electronic, and metal on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Band Name Generator — Creative Artist & Band Name Maker | VEYLO',
    description: 'Generate creative band names across rock, indie, electronic, and metal styles on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Band Name Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Band Name Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Free online band name and music artist alias generator filtered by music genre and aesthetic style.',
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
