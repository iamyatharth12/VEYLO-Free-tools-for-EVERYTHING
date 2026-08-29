import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/color-converter`;

export const metadata: Metadata = {
  title: 'Color Converter — HEX, RGB, HSL, HSV & CMYK Converter | VEYLO',
  description: 'Convert color codes between HEX, RGB, HSL, HSV, and CMYK with live preview, WCAG contrast checks, and shade palette generation. 100% client-side.',
  keywords: [
    'color converter',
    'hex to rgb',
    'rgb to hex',
    'hsl converter',
    'cmyk color converter',
    'color code picker',
    'hsv converter',
    'wcag contrast checker',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Color Converter — HEX, RGB, HSL, HSV & CMYK Converter | VEYLO',
    description: 'Real-time color converter with live preview swatch, WCAG contrast score, and shade generation.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Converter — HEX, RGB, HSL, HSV & CMYK Converter | VEYLO',
    description: 'Convert HEX, RGB, HSL, and CMYK colors online with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Color Code Converter', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Color Code Converter',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Bidirectional color format converter supporting HEX, RGB, HSL, HSV, and CMYK color spaces.',
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
