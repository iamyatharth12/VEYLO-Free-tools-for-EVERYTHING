import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/password-generator`;

export const metadata: Metadata = {
  title: 'Secure Password Generator — Free Cryptographic Generator | VEYLO',
  description: 'Generate strong, random cryptographic passwords client-side using the Web Crypto API. Customize length, uppercase, numbers, symbols, and batch generation with entropy score estimation.',
  keywords: [
    'password generator',
    'secure password generator',
    'random password generator',
    'strong password maker',
    'cryptographic password generator',
    'client-side password generator',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Secure Password Generator — Free Cryptographic Generator | VEYLO',
    description: 'Generate strong, random cryptographic passwords securely in your browser using the Web Crypto API. 100% client-side privacy.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secure Password Generator — Free Cryptographic Generator | VEYLO',
    description: 'Generate secure random cryptographic passwords client-side with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Secure Password Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Secure Password Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Cryptographically secure client-side password generator with entropy calculation, custom rules, and zero server transmission.',
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
