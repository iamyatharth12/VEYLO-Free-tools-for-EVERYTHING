import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools`;

export const metadata: Metadata = {
  title: 'All Free Online Tools & Utilities Directory | VEYLO',
  description: 'Browse the complete VEYLO directory of fast, free browser tools. Hardware diagnostics, mouse testing, calculators, converters, generators, and developer utilities.',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'All Free Online Tools & Utilities Directory | VEYLO',
    description: 'Explore the complete directory of free browser tools by VEYLO. 100% client-side processing.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Free Online Tools & Utilities Directory | VEYLO',
    description: 'Explore the complete directory of free browser tools by VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'All Tools', item: CANONICAL_URL },
  ],
};

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'VEYLO Free Tools Directory',
  description: 'A growing collection of fast, free browser tools for testing, measuring, calculating, converting, and troubleshooting.',
  url: CANONICAL_URL,
  publisher: {
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </>
  );
}
