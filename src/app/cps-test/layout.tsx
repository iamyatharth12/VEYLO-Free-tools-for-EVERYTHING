import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/cps-test`;

export const metadata: Metadata = {
  title: 'CPS Test - Click Speed Test Online (Clicks Per Second)',
  description: 'Free CPS test (Click Speed Test). Measure how many clicks per second you can achieve in 1s, 5s, 10s, 30s, or 60s challenges with live ranking.',
  keywords: 'CPS test, click speed test, clicks per second test, mouse CPS test, mouse click speed test, CPS tester, click speed tester online',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'CPS Test - Click Speed Test Online (Clicks Per Second)',
    description: 'Test your click speed (CPS) online. Compare jitter clicking, butterfly clicking, and drag clicking scores.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CPS Click Speed Test Online',
    description: 'Measure clicks per second (CPS) directly in your browser.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'CPS Test', item: CANONICAL_URL },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CPS Click Speed Test',
  url: CANONICAL_URL,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Browser application to test and rank click speed (clicks per second).',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      {children}
    </>
  );
}
