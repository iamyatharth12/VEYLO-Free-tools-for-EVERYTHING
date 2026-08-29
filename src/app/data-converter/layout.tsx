import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/data-converter`;

export const metadata: Metadata = {
  title: 'Data Unit & Bandwidth Converter — Storage & Speed Calculator | VEYLO',
  description: 'Convert data storage units (Bytes, KB, MB, GB, TB in Decimal vs Binary) and network transfer bandwidth (Mbps vs MB/s) with download time estimator.',
  keywords: [
    'data converter',
    'byte converter',
    'mb to gb',
    'bandwidth calculator',
    'mbps to mbs',
    'download time calculator',
    'kib to kb',
    'storage size converter',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Data Unit & Bandwidth Converter — Storage & Speed Calculator | VEYLO',
    description: 'Convert data storage sizes and bandwidth transfer speeds with live download time estimation.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Unit & Bandwidth Converter — Storage & Speed Calculator | VEYLO',
    description: 'Convert storage units and calculate download times with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Data Storage & Bandwidth Converter', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Data Storage & Bandwidth Converter',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Precision decimal and binary storage data converter and internet speed download time calculator.',
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
