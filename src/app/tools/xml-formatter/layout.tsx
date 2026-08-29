import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/xml-formatter`;

export const metadata: Metadata = {
  title: 'XML Formatter & Validator — Beautify & Minify XML Online | VEYLO',
  description: 'Format, beautify, indent, and validate XML documents in your browser. Features DOMParser syntax error highlighting and minification.',
  keywords: [
    'xml formatter',
    'xml beautifier',
    'xml validator',
    'format xml online',
    'xml minifier',
    'prettify xml',
    'xml syntax checker',
    'indent xml',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'XML Formatter & Validator — Beautify & Minify XML Online | VEYLO',
    description: 'Format, beautify, indent, and validate XML documents in your browser with real-time error detection.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XML Formatter & Validator — Beautify & Minify XML Online | VEYLO',
    description: 'Format and validate XML documents safely client-side with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'XML Formatter', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO XML Formatter & Validator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Client-side XML beautifier, minifier, and well-formedness syntax validator using browser DOMParser.',
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
