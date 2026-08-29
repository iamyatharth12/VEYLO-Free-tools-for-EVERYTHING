import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/tools/markdown-preview`;

export const metadata: Metadata = {
  title: 'Markdown Live Previewer & Editor — GitHub Flavored Markdown | VEYLO',
  description: 'Write and preview GitHub-flavored Markdown in real time with side-by-side split view, sanitized HTML preview, tables, and code blocks.',
  keywords: [
    'markdown previewer',
    'markdown editor',
    'markdown live preview',
    'github markdown preview',
    'markdown to html',
    'gfm previewer',
    'online markdown viewer',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Markdown Live Previewer & Editor — GitHub Flavored Markdown | VEYLO',
    description: 'Real-time side-by-side Markdown editor with sanitized HTML live rendering.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Markdown Live Previewer & Editor — GitHub Flavored Markdown | VEYLO',
    description: 'Edit and preview Markdown in real time with VEYLO.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { '@type': 'ListItem', position: 3, name: 'Markdown Previewer', item: CANONICAL_URL },
  ],
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VEYLO Markdown Live Previewer & Editor',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: CANONICAL_URL,
  description: 'Split-pane real-time GitHub-flavored Markdown editor with XSS-sanitized live rendering and HTML conversion.',
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
