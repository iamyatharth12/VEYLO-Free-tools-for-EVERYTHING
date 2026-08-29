import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/aspect-ratio-calculator`;

export const metadata: Metadata = {
  title: 'Aspect Ratio Calculator — Image & Video Dimension Sizer | VEYLO',
  description: 'Calculate image and video aspect ratios, simplify fraction ratios, scale dimensions proportionally, and preview aspect ratios visually. 100% client-side.',
  keywords: [
    'aspect ratio calculator',
    '16:9 calculator',
    'image ratio sizer',
    'resolution scaler',
    'screen ratio calculator',
    'video aspect ratio',
    '4:3 to 16:9',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Aspect Ratio Calculator — Image & Video Dimension Sizer | VEYLO',
    description: 'Calculate and scale pixel dimensions proportionally across 16:9, 4:3, 21:9, and custom aspect ratios.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aspect Ratio Calculator — Image & Video Dimension Sizer | VEYLO',
    description: 'Calculate aspect ratios and scale resolutions proportionally online with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Aspect Ratio Calculator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Aspect Ratio Calculator',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Proportional aspect ratio dimension calculator with resolution scaling and live canvas preview.',
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
