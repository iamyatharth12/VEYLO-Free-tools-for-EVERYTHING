import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/unix-timestamp`;

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter — Epoch to Date & Date to Epoch | VEYLO',
  description: 'Convert Unix epoch timestamps to human-readable date strings and ISO 8601 format. Live epoch clock with seconds and milliseconds detection.',
  keywords: [
    'unix timestamp converter',
    'epoch converter',
    'unix time to date',
    'timestamp to human readable',
    'epoch timestamp',
    'current unix time',
    'iso 8601 timestamp',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Unix Timestamp Converter — Epoch to Date & Date to Epoch | VEYLO',
    description: 'Convert between Unix epoch timestamps and human-readable dates with timezone breakdowns and live clock.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unix Timestamp Converter — Epoch to Date & Date to Epoch | VEYLO',
    description: 'Convert Unix timestamps to dates and vice versa with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Unix Timestamp Converter', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Unix Timestamp Converter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Precision Unix epoch timestamp converter with seconds vs milliseconds auto-detection, timezone parsing, and ISO 8601 strings.',
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
