import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/lorem-ipsum-generator`;

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator — Free Placeholder Dummy Text | VEYLO',
  description: 'Generate dummy Lorem Ipsum placeholder text for web design, layouts, and typography. Customize by paragraphs, sentences, or word count with HTML tags. 100% free.',
  keywords: [
    'lorem ipsum generator',
    'dummy text generator',
    'placeholder text',
    'latin text generator',
    'lorem ipsum paragraphs',
    'filler text generator',
    'web design placeholder text',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Lorem Ipsum Generator — Free Placeholder Dummy Text | VEYLO',
    description: 'Generate dummy Lorem Ipsum text by paragraphs, sentences, or words with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lorem Ipsum Generator — Free Placeholder Dummy Text | VEYLO',
    description: 'Generate customizable Lorem Ipsum dummy placeholder text on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Lorem Ipsum Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Lorem Ipsum Generator',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Placeholder and dummy text generator supporting paragraphs, sentences, words, and HTML formatting.',
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
