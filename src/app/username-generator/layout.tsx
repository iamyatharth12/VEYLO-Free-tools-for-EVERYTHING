import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/username-generator`;

export const metadata: Metadata = {
  title: 'Username Generator — Free Online Gamertag & Handle Creator | VEYLO',
  description: 'Generate cool, unique usernames and gamer handles by style, keyword prefix, numbers, and separators with one-click copy. 100% free and client-side.',
  keywords: [
    'username generator',
    'gamertag generator',
    'cool usernames',
    'handle generator',
    'online nickname maker',
    'gamer tag creator',
    'random username generator',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Username Generator — Free Online Gamertag & Handle Creator | VEYLO',
    description: 'Generate cool, unique usernames and gamer handles across gaming, tech, and aesthetic styles with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Username Generator — Free Online Gamertag & Handle Creator | VEYLO',
    description: 'Generate unique usernames and gamer handles across gaming, tech, and aesthetic styles.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Username Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Username Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Free online username generator for gaming handles, social media tags, and creative usernames.',
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
