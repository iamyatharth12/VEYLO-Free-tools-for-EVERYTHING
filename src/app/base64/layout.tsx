import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/base64`;

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder — Free Online UTF-8 Base64 Tool | VEYLO',
  description: 'Encode and decode UTF-8 text, URLs, and files to and from Base64 format safely in your browser. Supports URL-safe encoding and image preview.',
  keywords: [
    'base64 encoder',
    'base64 decoder',
    'base64 converter',
    'encode base64 online',
    'utf8 base64',
    'url safe base64',
    'file to base64',
    'image to base64',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Base64 Encoder & Decoder — Free Online UTF-8 Base64 Tool | VEYLO',
    description: 'Fast, secure UTF-8 Base64 encoder and decoder for strings, URLs, and files with URL-safe support.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Encoder & Decoder — Free Online UTF-8 Base64 Tool | VEYLO',
    description: 'Encode and decode UTF-8 strings and files with Base64 safely with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Base64 Encoder & Decoder', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Base64 Encoder & Decoder',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Client-side UTF-8 and URL-safe Base64 encoder/decoder for text and file data URIs.',
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
