import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/jwt-generator`;

export const metadata: Metadata = {
  title: 'JWT Generator — Generate Signed JSON Web Tokens Online | VEYLO',
  description: 'Generate HMAC-SHA256 (HS256) signed JSON Web Tokens client-side with custom payload claims and secret key using Web Crypto API.',
  keywords: [
    'jwt generator',
    'generate jwt token',
    'create jwt online',
    'hs256 jwt generator',
    'sign jwt client side',
    'json web token maker',
    'hmac sha256 jwt',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'JWT Generator — Generate Signed JSON Web Tokens Online | VEYLO',
    description: 'Generate and cryptographically sign JSON Web Tokens client-side with Web Crypto API.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JWT Generator — Generate Signed JSON Web Tokens Online | VEYLO',
    description: 'Generate signed JWT tokens client-side with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'JWT Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO JWT Generator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Client-side JSON Web Token generator with Web Crypto HMAC-SHA256 cryptographic signing and custom payload editor.',
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
