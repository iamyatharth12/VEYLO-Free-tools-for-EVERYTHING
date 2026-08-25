import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/team-generator`;

export const metadata: Metadata = {
  title: 'Random Team Generator — Divide Names into Balanced Groups | VEYLO',
  description: 'Quickly split a list of player, employee, or student names into fair, randomized teams. Choose by number of teams or group size. 100% free and client-side.',
  keywords: [
    'team generator',
    'random team generator',
    'group maker',
    'split into teams',
    'balanced team picker',
    'random group generator',
    'random team divider',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Random Team Generator — Divide Names into Balanced Groups | VEYLO',
    description: 'Evenly divide names into fair, randomized teams and balanced groups with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Team Generator — Divide Names into Balanced Groups | VEYLO',
    description: 'Split names into balanced, randomized teams online with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Random Team Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Random Team Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Free online tool to split lists of names into randomized, balanced teams or groups.',
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
