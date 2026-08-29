import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/percentage-calculator`;

export const metadata: Metadata = {
  title: 'Percentage Calculator — Free Online Percent Calculation Tool | VEYLO',
  description: 'Calculate percentage increase, percentage decrease, discounts, percentage difference, and fraction shares with instant formulas and step-by-step breakdown.',
  keywords: [
    'percentage calculator',
    'percent increase calculator',
    'discount calculator',
    'percent difference',
    'calculate percentage',
    'math percentage tool',
    'free percent calculator',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Percentage Calculator — Free Online Percent Calculation Tool | VEYLO',
    description: 'Instant percentage calculator for percentage increase, discounts, shares, and differences.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Percentage Calculator — Free Online Percent Calculation Tool | VEYLO',
    description: 'Calculate percentage changes, discounts, and fractions online with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Percentage Calculator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Percentage Calculator',
  applicationCategory: 'CalculatorApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'High-speed browser-based percentage calculator covering increases, decreases, discounts, and fractions.',
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
