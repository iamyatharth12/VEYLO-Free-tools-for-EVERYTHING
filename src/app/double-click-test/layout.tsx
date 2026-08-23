import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/double-click-test`;

export const metadata: Metadata = {
  title: 'Double Click Test — Free Online Tool | VEYLO',
  description: 'Test your mouse for accidental double clicks and microswitch chatter with VEYLO. Measures click interval timing in milliseconds to detect faulty mouse switches.',
  keywords: [
    'double click test',
    'mouse double click test',
    'double click tester',
    'is my mouse double clicking',
    'mouse switch double click test',
    'switch chatter checker',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Double Click Test — Free Online Tool | VEYLO',
    description: 'Check if your mouse switch is double clicking accidentally. Test click intervals in milliseconds online with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Double Click Test — Free Online Tool | VEYLO',
    description: 'Measure microswitch chatter timing directly in your browser.',
  },
};


const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Double Click Test', item: CANONICAL_URL },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Double Click Test',
  url: CANONICAL_URL,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Browser tool to test mouse microswitches for double-click chatter and timing irregularities.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why is my mouse double clicking when I only click once?',
      acceptedAnswer: { '@type': 'Answer', text: 'Mechanical microswitches use metal contact leaves that can oxidize or lose tension over time. When pressed, the contacts bounce against each other (chatter), sending two electric pulses to the micro-controller within a few milliseconds.' },
    },
    {
      '@type': 'Question',
      name: 'What threshold should I use for double click testing?',
      acceptedAnswer: { '@type': 'Answer', text: 'Human intentional double clicks rarely occur faster than 80ms to 100ms. If click intervals register under 80ms, it is a strong indicator of hardware switch chatter.' },
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
