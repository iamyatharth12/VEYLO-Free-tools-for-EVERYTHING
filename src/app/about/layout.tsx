import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/about`;

export const metadata: Metadata = {
  title: 'About Mouse Tester - Free Client-Side Hardware Utilities',
  description: 'Learn about Mouse Tester, our privacy-first philosophy, and how our client-side browser testing utilities work without data collection.',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
