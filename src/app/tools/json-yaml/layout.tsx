import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/json-yaml`;

export const metadata: Metadata = {
  title: 'JSON to YAML & YAML to JSON Converter — Free Online Tool | VEYLO',
  description: 'Convert between JSON and YAML formats in real time with syntax error validation, custom indentation, and 1-click direction swap.',
  keywords: [
    'json to yaml',
    'yaml to json',
    'json yaml converter',
    'convert json to yaml online',
    'yaml validator',
    'json to yml',
    'yml to json',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'JSON to YAML & YAML to JSON Converter — Free Online Tool | VEYLO',
    description: 'Convert JSON to YAML and YAML to JSON in real time with client-side syntax error validation.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to YAML & YAML to JSON Converter — Free Online Tool | VEYLO',
    description: 'Convert JSON and YAML files safely client-side with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'JSON to YAML Converter', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO JSON to YAML & YAML to JSON Converter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Client-side bidirectional JSON to YAML and YAML to JSON converter with syntax validation and file export.',
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
