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
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            <div
              className="w-5 h-5 rounded flex items-center justify-center font-black text-xs"
              style={{ background: 'var(--accent)', color: '#fff' }}
              aria-hidden="true"
            >
              V
            </div>
            <span className="font-extrabold">VEYLO</span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs" aria-label="Footer navigation">
            {[
              { href: '/tools',                  label: 'All Tools'      },
              { href: '/mouse-tester',           label: 'Mouse Tester'   },
              { href: '/mouse-click-test',       label: 'Click Test'     },
              { href: '/double-click-test',      label: 'Double Click'   },
              { href: '/mouse-scroll-test',      label: 'Scroll Test'    },
              { href: '/mouse-polling-rate-test', label: 'Polling Rate'  },
              { href: '/mouse-dpi-test',         label: 'DPI Calculator' },
              { href: '/cps-test',               label: 'CPS Test'       },
              { href: '/about',                  label: 'About'          },
              { href: '/privacy',                label: 'Privacy Policy' },
              { href: '/terms',                  label: 'Terms of Use'   },
              { href: '/contact',                label: 'Contact'        },
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
            © {year} VEYLO. All rights reserved.
          </p>
        </div>

        {/* Privacy notice */}
        <p
          className="mt-6 text-center text-xs"
          style={{ color: 'var(--muted)', borderTop: '1px solid var(--border-c)', paddingTop: '1rem' }}
        >
          🔒 Client-side processing in your browser. Inputs and diagnostics are calculated locally and never uploaded to our servers.
        </p>
      </div>
    </footer>
  );
}

