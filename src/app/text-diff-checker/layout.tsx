import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/text-diff-checker`;

export const metadata: Metadata = {
  title: 'Text Diff Checker — Compare Text & Find Differences Online | VEYLO',
  description: 'Compare two text files or code snippets side-by-side to highlight added, removed, and modified lines with precise visual diffing. 100% free and client-side.',
  keywords: [
    'text diff checker',
    'diff checker online',
    'compare text',
    'text difference finder',
    'file comparison tool',
    'code diff tool',
    'side by side text diff',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Text Diff Checker — Compare Text & Find Differences Online | VEYLO',
    description: 'Compare two text blocks and highlight additions, deletions, and line changes with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Diff Checker — Compare Text & Find Differences Online | VEYLO',
    description: 'Compare two text snippets side-by-side and highlight additions and deletions on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Text Diff Checker', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Text Diff Checker',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Visual text and code difference checker with line-by-line comparison and side-by-side highlighting.',
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
