import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/sql-formatter`;

export const metadata: Metadata = {
  title: 'SQL Formatter & Query Beautifier — Clean & Indent SQL Online | VEYLO',
  description: 'Beautify and format messy SQL queries client-side with keyword capitalization, custom indentation, and minification. 100% private.',
  keywords: [
    'sql formatter',
    'sql beautifier',
    'format sql online',
    'sql query formatter',
    'prettify sql',
    'indent sql',
    'minify sql',
    'sql cleaner',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'SQL Formatter & Query Beautifier — Clean & Indent SQL Online | VEYLO',
    description: 'Format, indent, and uppercase keywords in SQL queries client-side with zero database connections.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SQL Formatter & Query Beautifier — Clean & Indent SQL Online | VEYLO',
    description: 'Beautify SQL queries safely in your browser with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'SQL Formatter', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO SQL Formatter & Beautifier',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Client-side SQL query formatter, keyword upper-caser, and minifier with customizable indentation.',
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
