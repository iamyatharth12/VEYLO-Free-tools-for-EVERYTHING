import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/remove-duplicate-lines`;

export const metadata: Metadata = {
  title: 'Remove Duplicate Lines — Deduplicate Lists & Text Online | VEYLO',
  description: 'Quickly remove duplicate lines from lists, data sets, and text files. Supports case-sensitivity, whitespace trimming, and line sorting. 100% free and client-side.',
  keywords: [
    'remove duplicate lines',
    'deduplicate list',
    'duplicate line remover',
    'unique lines extractor',
    'clean list online',
    'remove duplicates text',
    'dedupe text online',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Remove Duplicate Lines — Deduplicate Lists & Text Online | VEYLO',
    description: 'Deduplicate text lists, remove repeated lines, and extract unique items with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remove Duplicate Lines — Deduplicate Lists & Text Online | VEYLO',
    description: 'Extract unique items and remove duplicate lines online on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Remove Duplicate Lines', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Duplicate Line Remover',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Online list deduplication utility with case-sensitivity and whitespace trimming controls.',
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
