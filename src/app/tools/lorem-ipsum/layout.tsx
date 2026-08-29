import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/lorem-ipsum`;

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator — Custom Dummy Placeholder Text | VEYLO',
  description: 'Generate custom Lorem Ipsum dummy text by paragraphs, sentences, or words for design prototypes with instant copy and HTML markup options.',
  keywords: [
    'lorem ipsum generator',
    'dummy text generator',
    'placeholder text',
    'latin text generator',
    'lipsum maker',
    'lorem ipsum paragraphs',
    'lorem ipsum html',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Lorem Ipsum Generator — Custom Dummy Placeholder Text | VEYLO',
    description: 'Generate customizable Latin dummy placeholder copy for wireframes, websites, and mockups.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lorem Ipsum Generator — Custom Dummy Placeholder Text | VEYLO',
    description: 'Generate custom Lorem Ipsum text online with VEYLO.',
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
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Customizable Lorem Ipsum dummy placeholder text generator with paragraph, sentence, and word count controls.',
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
