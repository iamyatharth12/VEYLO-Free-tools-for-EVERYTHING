import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/contact`;

export const metadata: Metadata = {
  title: 'Contact Us - Mouse Tester',
  description: 'Get in touch with the Mouse Tester team for feedback, feature requests, or technical tool bug reports.',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
