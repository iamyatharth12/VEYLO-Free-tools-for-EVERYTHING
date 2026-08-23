import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/mouse-polling-rate-test`;

export const metadata: Metadata = {
  title: 'Mouse Polling Rate Test — Free Online Tool | VEYLO',
  description: 'Test your mouse polling rate (Hz) and report frequency online with VEYLO. Measure peak Hz, average Hz, and signal interval latency in milliseconds.',
  keywords: [
    'mouse polling rate test',
    'mouse polling rate tester',
    'mouse Hz test',
    'mouse report rate test',
    '1000Hz mouse test',
    'mouse polling rate checker',
    'mouse frequency test',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mouse Polling Rate Test — Free Online Tool | VEYLO',
    description: 'Accurately measure your mouse polling frequency (Hz), report rate interval, and peak tracking performance in your browser with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse Polling Rate Test — Free Online Tool | VEYLO',
    description: 'Measure mouse report rate and frequency (Hz) directly online.',
  },
};


const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Mouse Polling Rate Test', item: CANONICAL_URL },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mouse Polling Rate Test',
  url: CANONICAL_URL,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Browser tool to calculate real-time mouse polling rate (Hz) and sensor update intervals.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is mouse polling rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Polling rate (measured in Hz) is how often your mouse sends position data to your computer per second. 1000Hz sends data every 1 millisecond.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is my polling rate test reading lower than 1000Hz?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You need to move your mouse rapidly to generate enough motion events for the sensor to transmit at its maximum polling frequency. Also check that your monitor refresh rate and browser hardware acceleration are enabled.',
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

