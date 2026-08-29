import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/qr-code-generator`;

export const metadata: Metadata = {
  title: 'QR Code Generator — Free Custom QR Code Creator | VEYLO',
  description: 'Create custom QR codes for URLs, text, Wi-Fi, and contacts with custom colors, error correction, and instant PNG/SVG download. 100% client-side privacy.',
  keywords: [
    'qr code generator',
    'free qr code maker',
    'custom qr code',
    'wifi qr code generator',
    'vcard qr code',
    'download qr code png',
    'download qr code svg',
    'client-side qr code',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'QR Code Generator — Free Custom QR Code Creator | VEYLO',
    description: 'Generate high-resolution QR codes for links, Wi-Fi networks, text, and contacts with custom styling.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator — Free Custom QR Code Creator | VEYLO',
    description: 'Create customizable QR codes for URLs, text, and Wi-Fi online with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'QR Code Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO QR Code Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'High-resolution client-side QR code generator with support for URLs, Wi-Fi, contacts, custom color schemes, and SVG/PNG exports.',
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
