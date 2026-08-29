import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/hash-generator`;

export const metadata: Metadata = {
  title: 'Hash Generator — Free SHA-256, SHA-512, MD5 & HMAC Calculator | VEYLO',
  description: 'Calculate cryptographic hashes client-side with Web Crypto API. Supports SHA-256, SHA-384, SHA-512, MD5, and HMAC for strings and local files.',
  keywords: [
    'hash generator',
    'sha256 generator',
    'sha512 calculator',
    'md5 hash generator',
    'hmac generator',
    'file hash checker',
    'checksum calculator',
    'client-side hashing',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Hash Generator — Free SHA-256, SHA-512, MD5 & HMAC Calculator | VEYLO',
    description: 'Cryptographically secure client-side hash generator for strings, passwords, and local files.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hash Generator — Free SHA-256, SHA-512, MD5 & HMAC Calculator | VEYLO',
    description: 'Calculate SHA-256, SHA-512, MD5, and HMAC hashes online with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Hash Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Cryptographic Hash Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Calculate cryptographic SHA-256, SHA-384, SHA-512, MD5, and HMAC hashes for text and local files entirely client-side.',
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
