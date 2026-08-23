import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/mouse-click-test`;

export const metadata: Metadata = {
  title: 'Mouse Click Test - Online Mouse Button & Switch Checker',
  description: 'Free online mouse click test. Test your left click, right click, middle click, and side buttons for instant detection and hardware response.',
  keywords: 'mouse click test, mouse button test, test mouse buttons, left click test, right click test, middle click test, side button test, mouse click checker',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mouse Click Test - Online Mouse Button & Switch Checker',
    description: 'Test your left click, right click, middle click, and side buttons instantly online without installing software.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse Click Test - Online Mouse Button & Switch Checker',
    description: 'Test your mouse buttons instantly in your browser.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Mouse Click Test', item: CANONICAL_URL },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mouse Click Test',
  url: CANONICAL_URL,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Online utility to test left, right, middle, and side mouse buttons for proper click signal transmission.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I test my mouse buttons?',
      acceptedAnswer: { '@type': 'Answer', text: 'Click each button on your mouse while looking at the diagnostic grid. Registered buttons will highlight and update the click counter.' },
    },
    {
      '@type': 'Question',
      name: 'Can this test browser side buttons?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, side buttons (Back and Forward) emit standard DOM mouse events (button index 3 and 4) which are captured when testing is active.' },
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
