import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/gamepad-tester`;

export const metadata: Metadata = {
  title: 'Gamepad Tester — Free Online Game Controller Test | VEYLO',
  description: 'Test gamepad and game controllers online using HTML5 Gamepad API. Inspect button signals, trigger pressure, analog stick drift, and vibration rumble.',
  keywords: [
    'gamepad tester',
    'controller tester',
    'game controller test',
    'joystick drift test',
    'xbox controller test',
    'ps5 controller test',
    'switch pro controller test',
    'gamepad api online',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Gamepad Tester — Free Online Game Controller Test | VEYLO',
    description: 'Real-time HTML5 game controller diagnostic tool. Test joystick drift, triggers, buttons, and haptics.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gamepad Tester — Free Online Game Controller Test | VEYLO',
    description: 'Test Xbox, PlayStation, and PC game controllers in your browser with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Gamepad Tester', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Gamepad & Controller Tester',
  applicationCategory: 'GamingApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Full-featured browser game controller hardware diagnostic tool with analog stick drift tracking, button pressure, and vibration motors.',
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
