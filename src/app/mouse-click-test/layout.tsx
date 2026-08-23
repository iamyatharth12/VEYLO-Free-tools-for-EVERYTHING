import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/mouse-click-test`;

export const metadata: Metadata = {
  title: 'Mouse Click Test — Free Online Tool | VEYLO',
  description: 'Free online mouse click test by VEYLO. Test your left click, right click, middle click, and side buttons for instant detection with client-side processing in your browser.',
  keywords: [
    'mouse click test',
    'mouse button test',
    'test mouse buttons',
    'left click test',
    'right click test',
    'middle click test',
    'side button test',
    'mouse click checker',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mouse Click Test — Free Online Tool | VEYLO',
    description: 'Test your left click, right click, middle click, and side buttons instantly online without installing software.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse Click Test — Free Online Tool | VEYLO',
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
      name: 'Why is my right click opening a menu instead of testing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Make sure you click "Start Click Testing" first. When testing is active, context menu interception is enabled so right clicks register in the diagnostic grid.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my mouse input data uploaded or saved to a server?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All mouse input events are processed entirely inside your local browser. No button clicks or coordinates are uploaded to external servers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can this test browser side buttons?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, side buttons (Back and Forward) emit standard DOM mouse events (button index 3 and 4) which are captured when testing is active.',
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

