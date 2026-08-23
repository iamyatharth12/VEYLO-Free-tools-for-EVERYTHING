'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';

const NAV_LINKS = [
  { href: '/tools',                  label: 'Directory' },
  { href: '/mouse-tester',           label: 'Mouse Tester' },
  { href: '/mouse-click-test',       label: 'Click Test' },
  { href: '/double-click-test',      label: 'Double Click' },
  { href: '/mouse-polling-rate-test', label: 'Polling Rate' },
  { href: '/cps-test',               label: 'CPS Test' },
  { href: '/about',                  label: 'About' },
];


function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggle, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full header-glass" aria-label="Site header">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-black text-lg tracking-tight"
            style={{ color: 'var(--text)' }}
            aria-label="VEYLO Home"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm tracking-tighter"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 30%, transparent)',
              }}
              aria-hidden="true"
            >
              V
            </div>
            <span className="font-extrabold tracking-tight">VEYLO</span>
          </Link>


          {/* Desktop nav + theme toggle */}
          <div className="hidden md:flex items-center gap-1">
            <nav className="flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="nav-link px-2.5 py-1.5 text-xs font-medium rounded-md"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="w-px h-4 mx-2" style={{ background: 'var(--border-2)' }} aria-hidden="true"/>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg nav-link transition-all duration-200 cursor-pointer"
              aria-label={mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` : 'Toggle theme'}
              title={mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` : 'Toggle theme'}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-c)',
              }}
            >
              {mounted ? (theme === 'dark' ? <SunIcon /> : <MoonIcon />) : <SunIcon />}
            </button>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg nav-link cursor-pointer"
              aria-label={mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` : 'Toggle theme'}
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              {mounted ? (theme === 'dark' ? <SunIcon /> : <MoonIcon />) : <SunIcon />}
            </button>

            <button
              className="p-2 rounded-md nav-link cursor-pointer"
              aria-expanded={open}
              aria-label="Toggle menu"
              onClick={() => setOpen(o => !o)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {open
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <nav className="md:hidden pb-3 flex flex-col gap-0.5 animate-slide-up" aria-label="Mobile navigation">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link block px-3 py-2 text-sm rounded-md"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
