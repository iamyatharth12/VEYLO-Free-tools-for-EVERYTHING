import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/contact`;

export const metadata: Metadata = {
  title: 'Contact VEYLO — Free Online Tools & Feedback',
  description: 'Get in touch with the VEYLO team for feedback, feature requests, or technical tool suggestions.',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: CANONICAL_URL },
  ],
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}

