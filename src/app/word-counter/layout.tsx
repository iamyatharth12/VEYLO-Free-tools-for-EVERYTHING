import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/word-counter`;

export const metadata: Metadata = {
  title: 'Word Counter — Real-Time Word & Character Counter | VEYLO',
  description: 'Free online word counter and text statistics analyzer. Measures words, characters with/without spaces, sentences, paragraphs, reading time, and keyword density. 100% client-side.',
  keywords: [
    'word counter',
    'character counter',
    'word count online',
    'text length checker',
    'reading time calculator',
    'word counter tool',
    'essay word counter',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Word Counter — Real-Time Word & Character Counter | VEYLO',
    description: 'Count words, characters, sentences, paragraphs, and reading time in real-time with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word Counter — Real-Time Word & Character Counter | VEYLO',
    description: 'Free online word counter and text statistics analyzer on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Word Counter', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Word Counter',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Real-time word and character counter with reading time estimation and keyword density metrics.',
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
