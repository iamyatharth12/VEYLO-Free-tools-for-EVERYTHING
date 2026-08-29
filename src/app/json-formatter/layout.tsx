import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/json-formatter`;

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator — Beautify, Minify & Inspect JSON | VEYLO',
  description: 'Format, validate, beautify, and minify JSON data client-side with syntax error highlighting, collapsible tree inspector, and instant copy. 100% client-side privacy.',
  keywords: [
    'json formatter',
    'json beautifier',
    'json validator',
    'minify json',
    'json tree viewer',
    'json parser online',
    'fix json syntax',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'JSON Formatter & Validator — Beautify, Minify & Inspect JSON | VEYLO',
    description: 'Format, minify, validate, and inspect JSON structures in real time with line error pointers.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Formatter & Validator — Beautify, Minify & Inspect JSON | VEYLO',
    description: 'Format, minify, and validate JSON client-side with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'JSON Formatter & Validator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO JSON Formatter & Validator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Interactive client-side JSON beautifier, minifier, validator, and collapsible tree viewer with detailed syntax error reporting.',
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
