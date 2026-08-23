import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/mouse-scroll-test`;

export const metadata: Metadata = {
  title: 'Mouse Scroll Test — Free Online Tool | VEYLO',
  description: 'Test your mouse scroll wheel for smooth scrolling, notch detection, scroll direction, and middle click responsiveness with VEYLO.',
  keywords: [
    'mouse scroll test',
    'mouse wheel test',
    'scroll wheel test',
    'mouse wheel tester',
    'test mouse wheel',
    'mouse scroll checker',
    'scroll wheel direction test',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mouse Scroll Test — Free Online Tool | VEYLO',
    description: 'Test mouse scroll wheel notches, direction, smooth scroll delta, and tilt wheel inputs online with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse Scroll Test — Free Online Tool | VEYLO',
    description: 'Free online browser tool for mouse scroll wheel testing.',
  },
};


const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Mouse Scroll Test', item: CANONICAL_URL },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mouse Scroll Test',
  url: CANONICAL_URL,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Online utility to test scroll wheel notches, scroll directions, and middle click switches.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why does my mouse scroll jump or move in the wrong direction?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This is commonly caused by dust or lint clogging the mechanical rotary encoder inside the mouse wheel. Cleaning the wheel assembly with compressed air often resolves erratic scrolling steps.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can this tool test horizontal or tilt wheel scrolling?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if your mouse supports tilt-wheel horizontal scrolling, tilting the wheel left or right will increment the horizontal scroll counters in real-time.',
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

