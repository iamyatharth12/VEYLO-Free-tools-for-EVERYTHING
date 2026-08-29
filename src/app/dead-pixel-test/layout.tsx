import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/dead-pixel-test`;

export const metadata: Metadata = {
  title: 'Dead Pixel Test — Free Fullscreen Screen Test | VEYLO',
  description: 'Check your monitor, laptop, or phone screen for dead or stuck pixels with full-screen solid RGB colors, monochrome backgrounds, and keyboard shortcuts. 100% free.',
  keywords: [
    'dead pixel test',
    'stuck pixel test',
    'screen test online',
    'monitor dead pixel check',
    'pixel checker fullscreen',
    'oled dead pixel test',
    'lcd test screen',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Dead Pixel Test — Free Fullscreen Screen Test | VEYLO',
    description: 'Fullscreen solid primary color canvas for inspecting dead or stuck monitor and phone pixels.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dead Pixel Test — Free Fullscreen Screen Test | VEYLO',
    description: 'Test your screen for dead and stuck pixels fullscreen with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Dead Pixel Test', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Dead Pixel Test',
  applicationCategory: 'DisplayApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Fullscreen solid color display diagnostic canvas for identifying stuck subpixels and dead LCD/OLED pixels.',
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
