import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/sort-lines`;

export const metadata: Metadata = {
  title: 'Sort Lines Online — Alphabetical, Numeric & Length Sorter | VEYLO',
  description: 'Sort lines of text alphabetically (A-Z, Z-A), numerically (1-9, 9-1), by character length, or randomize order. 100% free and client-side.',
  keywords: [
    'sort lines',
    'alphabetize text',
    'sort lines alphabetically',
    'numeric line sorter',
    'list alphabetizer',
    'natural sort text',
    'random line shuffler',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Sort Lines Online — Alphabetical, Numeric & Length Sorter | VEYLO',
    description: 'Sort text lines alphabetically, numerically, by length, or random shuffle on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sort Lines Online — Alphabetical, Numeric & Length Sorter | VEYLO',
    description: 'Alphabetize and sort text lines alphabetically and numerically on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Sort Lines', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Sort Lines',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Online text line sorting tool with alphabetical, numeric, length, and natural sorting algorithms.',
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
