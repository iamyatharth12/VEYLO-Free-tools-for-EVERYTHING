import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/cps-test`;

export const metadata: Metadata = {
  title: 'CPS Test — Free Online Click Speed Tool | VEYLO',
  description: 'Free CPS test (Click Speed Test) by VEYLO. Measure how many clicks per second you can achieve in 1s, 5s, 10s, 30s, or 60s challenges with live ranking.',
  keywords: [
    'CPS test',
    'click speed test',
    'clicks per second test',
    'mouse CPS test',
    'mouse click speed test',
    'CPS tester',
    'click speed tester online',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'CPS Test — Free Online Click Speed Tool | VEYLO',
    description: 'Test your click speed (CPS) online with VEYLO. Compare standard clicking, jitter clicking, and butterfly clicking scores.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CPS Test — Free Online Click Speed Tool | VEYLO',
    description: 'Measure clicks per second (CPS) directly in your browser with VEYLO.',
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a good CPS score?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The average human click speed using standard clicking is between 6.0 and 7.5 CPS. Competitive gamers using jitter or butterfly techniques can achieve 12 to 18+ CPS.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which clicking method is the fastest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Butterfly clicking and drag clicking are the fastest methods, often exceeding 15 to 20+ CPS on compatible switches.',
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}

