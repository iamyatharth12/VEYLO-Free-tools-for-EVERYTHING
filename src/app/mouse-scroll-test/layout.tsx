import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/mouse-scroll-test`;

export const metadata: Metadata = {
  title: 'Mouse Scroll Test - Scroll Wheel & Direction Checker Online',
  description: 'Test your mouse scroll wheel for smooth scrolling, notch detection, scroll direction (up/down/left/right), and middle click button responsiveness.',
  keywords: 'mouse scroll test, mouse wheel test, scroll wheel test, mouse wheel tester, test mouse wheel, mouse scroll checker, scroll wheel direction test',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mouse Scroll Test - Scroll Wheel & Direction Checker Online',
    description: 'Test mouse scroll wheel notches, direction, smooth scroll delta, and tilt wheel inputs online.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse Scroll Test - Test Scroll Wheel & Middle Click',
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      {children}
    </>
  );
}
