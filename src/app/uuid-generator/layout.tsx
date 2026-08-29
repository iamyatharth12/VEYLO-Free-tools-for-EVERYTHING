import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/uuid-generator`;

export const metadata: Metadata = {
  title: 'UUID Generator — Free Online UUID v4 & GUID Generator | VEYLO',
  description: 'Generate RFC 4122 compliant UUID v4 identifiers in bulk. Customize uppercase/lowercase, hyphens, and braces with one-click copy and instant export.',
  keywords: [
    'uuid generator',
    'guid generator',
    'uuid v4 generator',
    'bulk uuid generator',
    'random uuid maker',
    'rfc4122 uuid',
    'online uuid tool',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'UUID Generator — Free Online UUID v4 & GUID Generator | VEYLO',
    description: 'Fast, cryptographically secure RFC 4122 UUID v4 generator with bulk export and custom formatting.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UUID Generator — Free Online UUID v4 & GUID Generator | VEYLO',
    description: 'Generate RFC 4122 compliant UUID v4 identifiers in bulk with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'UUID Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO UUID & GUID Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Free browser-based RFC 4122 UUID v4 generator with bulk mode, custom formatting, and zero server logging.',
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
