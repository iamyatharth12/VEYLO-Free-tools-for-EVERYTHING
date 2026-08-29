import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/regex-tester`;

export const metadata: Metadata = {
  title: 'Regex Tester & Matcher — Real-Time Regular Expression Tool | VEYLO',
  description: 'Test JavaScript regular expressions live with match highlighting, capture groups, named groups, flag toggles, and pattern presets. 100% client-side privacy.',
  keywords: [
    'regex tester',
    'regular expression tester',
    'regex matcher',
    'regex debugger',
    'javascript regex tool',
    'test regex online',
    'regex cheat sheet',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Regex Tester & Matcher — Real-Time Regular Expression Tool | VEYLO',
    description: 'Test and debug regular expressions with real-time match highlighting, capture group extraction, and flags.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Regex Tester & Matcher — Real-Time Regular Expression Tool | VEYLO',
    description: 'Test regular expressions in real-time with capture groups and presets with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Regex Tester & Matcher', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Regex Tester & Matcher',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Real-time client-side regular expression tester with match highlighting, capture groups, named groups, and ReDoS safeguards.',
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
