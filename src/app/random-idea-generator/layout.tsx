import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/random-idea-generator`;

export const metadata: Metadata = {
  title: 'Random Idea Generator — Business, App & Project Concepts | VEYLO',
  description: 'Generate creative ideas for startups, web apps, mobile tools, YouTube content, and personal projects with structured hooks and target niches. 100% free and client-side.',
  keywords: [
    'random idea generator',
    'business idea generator',
    'app idea generator',
    'creative project ideas',
    'brainstorming tool',
    'startup ideas',
    'side project generator',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Random Idea Generator — Business, App & Project Concepts | VEYLO',
    description: 'Instant brainstorming generator for startups, web apps, content creators, and personal projects with VEYLO.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Idea Generator — Business, App & Project Concepts | VEYLO',
    description: 'Generate creative ideas for startups, apps, and content creation on VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Random Idea Generator', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Random Idea Generator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Brainstorming tool that generates structured startup, app, content, and personal project ideas.',
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
