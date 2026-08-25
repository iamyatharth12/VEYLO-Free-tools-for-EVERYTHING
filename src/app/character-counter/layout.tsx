import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/character-counter`;

export const metadata: Metadata = {
  title: 'Character Counter — Online Letter & Character Checker | VEYLO',
  description: 'Count characters, letters, digits, and spaces in real-time. Features social media character limit progress meters for Twitter, Instagram, LinkedIn, and SMS. 100% free.',
  keywords: [
    'character counter',
    'letter counter',
    'character count tool',
    'twitter character counter',
    'social media text limit',
    'sms character counter',
    'meta description length checker',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Character Counter — Online Letter & Character Checker | VEYLO',
    description: 'Real-time character counter with social media limit meters for Twitter, Instagram, and SMS on VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Character Counter — Online Letter & Character Checker | VEYLO',
    description: 'Count characters and track social media length limits in real-time on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Character Counter', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Character Counter',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Character and letter counter with social media limit trackers and character breakdown analytics.',
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
