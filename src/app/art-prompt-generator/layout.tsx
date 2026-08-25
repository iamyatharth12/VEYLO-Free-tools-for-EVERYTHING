import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/art-prompt-generator`;

export const metadata: Metadata = {
  title: 'Art Prompt Generator — Visual Concept & Illustration Prompts | VEYLO',
  description: 'Generate rich visual art prompts with lighting, mood, composition, style direction, and color palette swatches for digital and traditional artists. 100% free and client-side.',
  keywords: [
    'art prompt generator',
    'illustration ideas',
    'digital painting prompts',
    'concept art generator',
    'creative drawing ideas',
    'character concept art',
    'color palette prompt',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Art Prompt Generator — Visual Concept & Illustration Prompts | VEYLO',
    description: 'Generate rich art prompts with lighting, composition, and color swatches on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Art Prompt Generator — Visual Concept & Illustration Prompts | VEYLO',
    description: 'Generate creative concept art prompts with lighting and color swatches on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Art Prompt Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Art Prompt Generator',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Art and illustration concept generator with camera angles, lighting conditions, and color palette suggestions.',
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
