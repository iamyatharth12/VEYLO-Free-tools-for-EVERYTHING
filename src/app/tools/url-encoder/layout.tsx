import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/url-encoder`;

export const metadata: Metadata = {
  title: 'URL Encoder & Decoder — Encode & Decode URI Components Online | VEYLO',
  description: 'Encode and decode URLs and URI query parameters client-side. Convert special characters and UTF-8 strings safely.',
  keywords: [
    'url encoder',
    'url decoder',
    'encode url',
    'decode url',
    'uri component encoder',
    'percent encoding',
    'url percent encoder',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'URL Encoder & Decoder — Encode & Decode URI Components Online | VEYLO',
    description: 'Convert plain text and query strings to percent-encoded URLs and decode encoded URIs in real time.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Encoder & Decoder — Encode & Decode URI Components Online | VEYLO',
    description: 'Encode and decode URLs safely client-side with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'URL Encoder & Decoder', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO URL Encoder & Decoder',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Client-side URL and URI component percent encoder and decoder supporting full UTF-8 Unicode characters.',
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
