import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/music-genre-generator`;

export const metadata: Metadata = {
  title: 'Music Genre Generator — Fusion Subgenre & Style Creator | VEYLO',
  description: 'Discover fresh musical fusion genres and experimental subgenres with tempo guidelines and stylistic rhythm profiles. 100% free and client-side.',
  keywords: [
    'music genre generator',
    'fusion genre maker',
    'random music styles',
    'subgenre creator',
    'music production inspiration',
    'hybrid genre generator',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Music Genre Generator — Fusion Subgenre & Style Creator | VEYLO',
    description: 'Discover fresh musical fusion genres and experimental subgenres with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Genre Generator — Fusion Subgenre & Style Creator | VEYLO',
    description: 'Create unique hybrid music genres and subgenres on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Music Genre Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Music Genre Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Music style and fusion subgenre generator for producers and sound designers.',
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
