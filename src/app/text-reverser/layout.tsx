import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/text-reverser`;

export const metadata: Metadata = {
  title: 'Text Reverser — Reverse Text, Words, & Upside Down Flipper | VEYLO',
  description: 'Reverse text backwards, invert word order, flip letters in place, or generate upside-down Unicode text online. 100% free and client-side.',
  keywords: [
    'text reverser',
    'reverse text online',
    'backwards text generator',
    'reverse words',
    'upside down text generator',
    'flip text generator',
    'reverse string tool',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Text Reverser — Reverse Text, Words, & Upside Down Flipper | VEYLO',
    description: 'Reverse text, invert word order, and generate upside-down Unicode text on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Reverser — Reverse Text, Words, & Upside Down Flipper | VEYLO',
    description: 'Reverse text backwards, reverse words, and flip text upside down online on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Text Reverser', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Text Reverser',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Text reversal utility supporting full string reversal, word order inversion, and upside down character flipping.',
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
