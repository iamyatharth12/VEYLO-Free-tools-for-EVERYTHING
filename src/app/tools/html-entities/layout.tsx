import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/html-entities`;

export const metadata: Metadata = {
  title: 'HTML Entity Encoder & Decoder — Encode & Decode Special Characters | VEYLO',
  description: 'Convert special characters to HTML entities and back. Supports named entities, decimal codes, hex numeric entities, and Unicode.',
  keywords: [
    'html entity encoder',
    'html entity decoder',
    'html entities',
    'encode html entities',
    'special characters html',
    'html escape tool',
    'html unescape online',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'HTML Entity Encoder & Decoder — Encode & Decode Special Characters | VEYLO',
    description: 'Convert plain text to HTML entities and decode named/numeric entities safely in your browser.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML Entity Encoder & Decoder — Encode & Decode Special Characters | VEYLO',
    description: 'Encode and decode HTML entities safely client-side with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'HTML Entities', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO HTML Entity Encoder & Decoder',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Client-side HTML entity encoder and decoder supporting named, decimal, and hexadecimal entity formats.',
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
