import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/sentence-counter`;

export const metadata: Metadata = {
  title: 'Sentence Counter — Count Sentences & Readability Analyzer | VEYLO',
  description: 'Count sentences in any text, compute average words per sentence, and analyze readability scores for essays and copy. 100% free and client-side.',
  keywords: [
    'sentence counter',
    'count sentences',
    'readability checker',
    'average sentence length',
    'text analyzer',
    'flesch reading ease',
    'sentence length analyzer',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Sentence Counter — Count Sentences & Readability Analyzer | VEYLO',
    description: 'Count sentences and analyze readability scores and average sentence lengths with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sentence Counter — Count Sentences & Readability Analyzer | VEYLO',
    description: 'Count sentences and analyze readability metrics online on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Sentence Counter', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Sentence Counter',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Text readability and sentence counter analyzing sentence complexity and average length.',
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
