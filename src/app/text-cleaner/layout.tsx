import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/text-cleaner`;

export const metadata: Metadata = {
  title: 'Text Cleaner — Remove Extra Spaces, Blank Lines & HTML | VEYLO',
  description: 'Clean and format messy text online. Strip duplicate whitespace, remove blank lines, sanitize line endings, strip HTML tags, and remove emojis. 100% free and client-side.',
  keywords: [
    'text cleaner',
    'remove extra spaces',
    'remove blank lines',
    'strip html tags',
    'whitespace remover online',
    'clean messy text',
    'normalize line breaks',
    'remove emojis text',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Text Cleaner — Remove Extra Spaces, Blank Lines & HTML | VEYLO',
    description: 'Clean messy text by stripping duplicate spaces, empty lines, and HTML tags with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Cleaner — Remove Extra Spaces, Blank Lines & HTML | VEYLO',
    description: 'Clean extra whitespace, empty lines, and HTML tags from text online on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Text Cleaner', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Text Cleaner',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Online text sanitation tool stripping redundant spaces, blank lines, HTML tags, and formatting artifacts.',
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
