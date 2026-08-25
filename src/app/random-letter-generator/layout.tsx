import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/random-letter-generator`;

export const metadata: Metadata = {
  title: 'Random Letter Generator — Free Alphabet Picker | VEYLO',
  description: 'Generate random letters online. Choose alphabet sets (English, Greek, NATO phonetic), uppercase/lowercase, vowels or consonants, and batch quantities.',
  keywords: [
    'random letter generator',
    'random alphabet generator',
    'letter picker',
    'random character generator',
    'random letter picker',
    'NATO phonetic generator',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Random Letter Generator — Free Alphabet Picker | VEYLO',
    description: 'Generate random letters with alphabet selection, case controls, and vowel/consonant filters with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Letter Generator — Free Alphabet Picker | VEYLO',
    description: 'Generate random letters from custom alphabets and cases online with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Random Letter Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Random Letter Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Free online random letter generator with case, alphabet, and vowel/consonant filters.',
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
