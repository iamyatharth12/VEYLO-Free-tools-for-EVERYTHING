import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/terms`;

export const metadata: Metadata = {
  title: 'Terms of Use - Mouse Tester',
  description: 'Terms of Use for accessing and using Mouse Tester online utilities and hardware tools.',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
