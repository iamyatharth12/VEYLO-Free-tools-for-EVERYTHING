import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/refresh-rate-test`;

export const metadata: Metadata = {
  title: 'Screen Refresh Rate Test — Monitor Hz & Browser FPS Test | VEYLO',
  description: 'Measure your monitor display refresh rate (60Hz, 120Hz, 144Hz, 240Hz, 360Hz) and browser frame rate stability using high-precision frame timing. 100% free.',
  keywords: [
    'refresh rate test',
    'screen hz test',
    'monitor hz test',
    'fps test online',
    'browser refresh rate checker',
    '144hz test',
    '240hz test',
    'frame timing stability',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Screen Refresh Rate Test — Monitor Hz & Browser FPS Test | VEYLO',
    description: 'High-precision browser display refresh rate and frame timing benchmark.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Screen Refresh Rate Test — Monitor Hz & Browser FPS Test | VEYLO',
    description: 'Measure your monitor refresh rate (Hz) and browser FPS with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Screen Refresh Rate Test', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Screen Refresh Rate Test',
  applicationCategory: 'DisplayApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'High-precision browser frame timing benchmark for detecting display refresh rate (Hz) and frame stability.',
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
