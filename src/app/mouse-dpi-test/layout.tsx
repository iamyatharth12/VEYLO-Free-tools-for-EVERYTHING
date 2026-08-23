import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/mouse-dpi-test`;

export const metadata: Metadata = {
  title: 'Mouse DPI Test & eDPI Calculator — Free Online Tool | VEYLO',
  description: 'Test your mouse DPI (Dots Per Inch) and calculate eDPI (Effective DPI) with VEYLO. Measure target mousepad distance against screen pixel movement online.',
  keywords: [
    'mouse DPI test',
    'mouse DPI checker',
    'how to test mouse DPI',
    'how to check mouse DPI',
    'mouse sensitivity test',
    'mouse DPI calculator online',
    'eDPI calculator',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mouse DPI Test & eDPI Calculator — Free Online Tool | VEYLO',
    description: 'Calculate mouse DPI and eDPI (effective sensitivity) online by dragging physical target distance on your mousepad.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse DPI Test & Calculator — Free Online Tool | VEYLO',
    description: 'Calculate true hardware DPI and in-game eDPI sensitivity with VEYLO.',
  },
};


const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Mouse DPI Test', item: CANONICAL_URL },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mouse DPI Test',
  url: CANONICAL_URL,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Online utility to estimate mouse hardware DPI and calculate eDPI across games.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between DPI and eDPI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DPI (Dots Per Inch) is the hardware resolution of your mouse sensor. eDPI (Effective DPI) is your true in-game sensitivity, calculated as Hardware DPI multiplied by your In-Game Sensitivity setting.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why should I match eDPI across games?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Matching your eDPI preserves muscle memory for crosshair placement and flick shots when switching between competitive first-person shooter titles.',
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

