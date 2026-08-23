import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/mouse-dpi-test`;

export const metadata: Metadata = {
  title: 'Mouse DPI Test & eDPI Calculator - Check Mouse Sensitivity Online',
  description: 'Test your mouse DPI (Dots Per Inch) and calculate eDPI (Effective DPI). Measure target mousepad distance against screen pixel movement online.',
  keywords: 'mouse DPI test, mouse DPI checker, how to test mouse DPI, how to check mouse DPI, mouse sensitivity test, mouse DPI calculator online, eDPI calculator',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mouse DPI Test & eDPI Calculator - Check Mouse Sensitivity Online',
    description: 'Calculate mouse DPI and eDPI (effective sensitivity) online by dragging physical target distance on your mousepad.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse DPI Test & Calculator Online',
    description: 'Calculate true hardware DPI and in-game eDPI sensitivity.',
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      {children}
    </>
  );
}
