'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto w-full"
      style={{ borderTop: '1px solid var(--border-c)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--accent)' }}>
              <rect x="5" y="2" width="14" height="20" rx="7"/>
              <line x1="12" y1="2" x2="12" y2="10"/>
              <line x1="8"  y1="6" x2="16" y2="6"/>
            </svg>
            <span>Mouse Tester</span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-4 text-xs" aria-label="Footer navigation">
            {[
              { href: '/',                  label: 'Home'           },
              { href: '/mouse-tester',       label: 'Mouse Tester'   },
              { href: '/privacy',            label: 'Privacy Policy' },
              { href: '/terms',              label: 'Terms of Use'   },
              { href: '/about',              label: 'About'          },
              { href: '/contact',            label: 'Contact'        },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            © {year} Mouse Tester. All rights reserved.
          </p>
        </div>

        {/* Privacy notice */}
        <p
          className="mt-4 text-center text-xs"
          style={{ color: 'var(--muted)', borderTop: '1px solid var(--border-c)', paddingTop: '1rem' }}
        >
          🔒 Your mouse activity is processed locally in your browser. We don&apos;t upload or store your mouse input.
        </p>
      </div>
    </footer>
  );
}
