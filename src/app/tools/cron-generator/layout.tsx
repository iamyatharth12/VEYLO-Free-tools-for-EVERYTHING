import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/cron-generator`;

export const metadata: Metadata = {
  title: 'Cron Expression Generator & Schedule Explainer — Build Cron Jobs | VEYLO',
  description: 'Generate, validate, and understand cron expressions visually with natural language translations, presets, and standard 5-part syntax.',
  keywords: [
    'cron generator',
    'cron expression generator',
    'cron schedule builder',
    'crontab generator',
    'cron explainer',
    'cron syntax validator',
    'crontab guru alternative',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Cron Expression Generator & Schedule Explainer — Build Cron Jobs | VEYLO',
    description: 'Visual cron schedule builder and validator with natural language translations and common presets.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cron Expression Generator & Schedule Explainer — Build Cron Jobs | VEYLO',
    description: 'Build and explain cron expressions visually with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Cron Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Cron Expression Generator & Explainer',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Visual 5-part cron expression generator with natural language schedule translation, validation, and crontab presets.',
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
