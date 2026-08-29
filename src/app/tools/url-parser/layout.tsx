import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/url-parser`;

export const metadata: Metadata = {
  title: 'URL Parser & Query String Analyzer — Break Down URLs Online | VEYLO',
  description: 'Break down complex URLs into protocol, domain, port, path, and query parameters using browser-native URL API.',
  keywords: [
    'url parser',
    'parse url online',
    'query string parser',
    'url analyzer',
    'query parameter decoder',
    'url structure breakdown',
    'decode query params',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'URL Parser & Query String Analyzer — Break Down URLs Online | VEYLO',
    description: 'Deconstruct web addresses into protocol, host, port, path segments, and query parameters.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Parser & Query String Analyzer — Break Down URLs Online | VEYLO',
    description: 'Parse URLs and inspect query parameters online with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'URL Parser', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO URL Parser & Query Inspector',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Browser-native URL structure breakdown utility with query string key-value parameter table and parameter decoder.',
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
