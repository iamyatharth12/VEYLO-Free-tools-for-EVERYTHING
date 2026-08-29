import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/user-agent-parser`;

export const metadata: Metadata = {
  title: 'User-Agent Parser & Device Inspector — Analyze UA Strings | VEYLO',
  description: 'Parse and analyze browser User-Agent strings in real time. Detect browser name, version, OS, device type, and rendering engine with 1-click current UA check.',
  keywords: [
    'user agent parser',
    'parse user agent',
    'ua parser online',
    'user agent lookup',
    'browser detection tool',
    'user agent string analyzer',
    'my user agent',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'User-Agent Parser & Device Inspector — Analyze UA Strings | VEYLO',
    description: 'Deconstruct and inspect browser User-Agent strings to detect client browser, OS, and hardware type.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'User-Agent Parser & Device Inspector — Analyze UA Strings | VEYLO',
    description: 'Parse User-Agent strings client-side with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'User-Agent Parser', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO User-Agent Parser & Device Inspector',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Client-side User-Agent string parsing and hardware device category diagnostic tool.',
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
