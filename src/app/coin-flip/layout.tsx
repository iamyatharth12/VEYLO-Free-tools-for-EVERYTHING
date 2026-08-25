import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/coin-flip`;

export const metadata: Metadata = {
  title: 'Coin Flip Online — 3D Coin Toss Simulator & Stats | VEYLO',
  description: 'Flip a coin online with realistic 3D animations and live Heads/Tails statistics. Flip 1, 2, 5, or 20 coins at once. 100% free and unbiased.',
  keywords: [
    'coin flip',
    'flip a coin online',
    'heads or tails',
    'virtual coin toss',
    'coin flipper simulator',
    'random coin toss',
    'coin toss generator',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Coin Flip Online — 3D Coin Toss Simulator & Stats | VEYLO',
    description: 'Flip a virtual 3D coin online with live probability statistics, batch flips, and realistic physics.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coin Flip Online — 3D Coin Toss Simulator & Stats | VEYLO',
    description: 'Flip virtual coins with realistic animations and live statistics on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Coin Flip', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Coin Flip Simulator',
  applicationCategory: 'GameApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Interactive virtual coin flipper with realistic 3D animations, batch tosses, and statistical probability tracking.',
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
