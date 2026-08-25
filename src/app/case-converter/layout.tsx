import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/case-converter`;

export const metadata: Metadata = {
  title: 'Text Case Converter — Uppercase, Lowercase, Title Case | VEYLO',
  description: 'Convert text case instantly: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and PascalCase. 100% free and client-side.',
  keywords: [
    'case converter',
    'uppercase converter',
    'lowercase to uppercase',
    'title case converter',
    'camelcase generator',
    'snake case converter',
    'kebab case converter',
    'change text case',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Text Case Converter — Uppercase, Lowercase, Title Case | VEYLO',
    description: 'Transform text case instantly into UPPERCASE, lowercase, Title Case, camelCase, snake_case on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Case Converter — Uppercase, Lowercase, Title Case | VEYLO',
    description: 'Transform text case into uppercase, lowercase, title case, and code formats on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Text Case Converter', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Text Case Converter',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Online text case conversion tool supporting uppercase, lowercase, title case, camelCase, snake_case, and kebab-case.',
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
