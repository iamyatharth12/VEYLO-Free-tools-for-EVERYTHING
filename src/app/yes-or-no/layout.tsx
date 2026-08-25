import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/yes-or-no`;

export const metadata: Metadata = {
  title: 'Yes or No Generator — Instant Decision Maker | VEYLO',
  description: 'Get an instant, unbiased Yes or No answer to any question with dynamic reveal animations, decision history, and weighted modes. 100% free and client-side.',
  keywords: [
    'yes or no generator',
    'yes or no wheel',
    'decision maker online',
    'random yes no picker',
    'yes or no oracle',
    'instant decision maker',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Yes or No Generator — Instant Decision Maker | VEYLO',
    description: 'Instant, unbiased Yes or No generator for making fast decisions online with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yes or No Generator — Instant Decision Maker | VEYLO',
    description: 'Get instant Yes or No answers with dynamic reveal animations on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Yes or No Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Yes or No Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Instant client-side decision maker with Yes, No, and Maybe outcomes and decision history tracking.',
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
