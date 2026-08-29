import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/http-status-codes`;

export const metadata: Metadata = {
  title: 'HTTP Status Codes Directory & Quick Reference — 1xx to 5xx Codes | VEYLO',
  description: 'Search and inspect HTTP response status codes (100–599) with official RFC definitions, meaning, causes, and troubleshooting guides.',
  keywords: [
    'http status codes',
    'http error codes',
    '404 status code',
    '500 internal server error',
    'http response codes list',
    '401 vs 403',
    '301 vs 302',
    'http status checker',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'HTTP Status Codes Directory & Quick Reference — 1xx to 5xx Codes | VEYLO',
    description: 'Quick searchable reference for all HTTP 1xx, 2xx, 3xx, 4xx, and 5xx response codes with troubleshooting tips.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTTP Status Codes Directory & Quick Reference — 1xx to 5xx Codes | VEYLO',
    description: 'Lookup HTTP status codes, causes, and debugging solutions with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'HTTP Status Codes', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO HTTP Status Code Reference & Checker',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Interactive searchable reference directory for all HTTP 1xx–5xx response status codes with debugging guides.',
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
