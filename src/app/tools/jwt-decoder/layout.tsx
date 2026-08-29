import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/jwt-decoder`;

export const metadata: Metadata = {
  title: 'JWT Decoder & Token Inspector — Decode JSON Web Tokens Online | VEYLO',
  description: 'Free client-side JWT decoder. Inspect JSON Web Token header, claims payload, expiration status, and signature safely without server transmission.',
  keywords: [
    'jwt decoder',
    'decode jwt',
    'jwt token decoder',
    'jwt inspector',
    'jwt viewer online',
    'json web token parser',
    'jwt claims inspector',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'JWT Decoder & Token Inspector — Decode JSON Web Tokens Online | VEYLO',
    description: 'Inspect JWT header algorithms, claims payloads, expiration status, and signatures safely client-side.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JWT Decoder & Token Inspector — Decode JSON Web Tokens Online | VEYLO',
    description: 'Decode and inspect JSON Web Tokens client-side with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'JWT Decoder', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO JWT Decoder & Token Inspector',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Client-side JWT decoding and payload claims inspector with expiration timestamps and signature display.',
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
