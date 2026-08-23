import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/siteConfig';

export const metadata = {
  title: 'Free Online Browser Tools & Hardware Utilities — Mouse Tester',
  description: 'Free, instant browser utilities for hardware diagnostics, mouse testing, input speed tests, and developer tools. 100% private & client-side.',
  alternates: { canonical: SITE_CONFIG.url },
};

const FEATURED_TOOLS = [
  {
    href: '/mouse-tester',
    title: 'Mouse Tester (Full Suite)',
    desc: 'Complete interactive hardware diagnostic tool for mouse buttons, scroll wheel, movement tracking, and event logs.',
    icon: '🖱️',
    badge: 'Featured Pillar Tool',
    category: 'Hardware & Input Testing',
  },
  {
    href: '/mouse-click-test',
    title: 'Mouse Click Test',
    desc: 'Verify left, right, middle wheel, and side button click signal transmission.',
    icon: '🎯',
    badge: 'Popular',
    category: 'Hardware & Input Testing',
  },
  {
    href: '/double-click-test',
    title: 'Double Click Test',
    desc: 'Detect microswitch chatter and measure click timing in milliseconds to find faulty mouse switches.',
    icon: '⚡',
    badge: 'Diagnostic',
    category: 'Hardware & Input Testing',
  },
  {
    href: '/mouse-scroll-test',
    title: 'Mouse Scroll Test',
    desc: 'Test scroll wheel notches, direction tracking (up/down/tilt), and middle button click.',
    icon: '📜',
    badge: 'Hardware',
    category: 'Hardware & Input Testing',
  },
  {
    href: '/mouse-polling-rate-test',
    title: 'Mouse Polling Rate Test',
    desc: 'Measure real-time mouse frequency (Hz), peak report rate, and interval latency.',
    icon: '📡',
    badge: 'Gaming Benchmark',
    category: 'Hardware & Input Testing',
  },
  {
    href: '/mouse-dpi-test',
    title: 'Mouse DPI & eDPI Calculator',
    desc: 'Estimate hardware DPI and calculate eDPI effective sensitivity across video games.',
    icon: '📐',
    badge: 'Calculator',
    category: 'Hardware & Input Testing',
  },
  {
    href: '/cps-test',
    title: 'CPS Click Speed Test',
    desc: 'Measure your Clicks Per Second across 1s to 60s challenges and get ranked.',
    icon: '⏱️',
    badge: 'Speed Challenge',
    category: 'Hardware & Input Testing',
  },
];

const FUTURE_CATEGORIES = [
  {
    category: 'Hardware & Controller Testers',
    tools: [
      { name: 'Keyboard Tester', desc: 'Test key press matrix & anti-ghosting.', icon: '⌨️' },
      { name: 'Gamepad & Controller Tester', desc: 'Test Xbox/PlayStation joystick axes & buttons.', icon: '🎮' },
      { name: 'Microphone & Speaker Test', desc: 'Check audio input latency & frequency output.', icon: '🎙️' },
    ],
  },
  {
    category: 'Developer & Text Utilities',
    tools: [
      { name: 'JSON Formatter & Validator', desc: 'Format and lint JSON strings locally.', icon: '🛠️' },
      { name: 'Regex Tester', desc: 'Test regular expression matches in real-time.', icon: '🔍' },
      { name: 'Base64 & URL Encoder', desc: 'Convert text strings and tokens safely.', icon: '🔤' },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-8 animate-fade-in max-w-7xl mx-auto px-4">
      {/* Hero Banner */}
      <section className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <span className="px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--accent)' }}>
          🔒 100% Client-Side · Zero Server Logging
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--text)' }}>
          Free Browser Utilities &amp; Hardware Tools
        </h1>
        <p className="text-base sm:text-lg mb-6" style={{ color: 'var(--muted)' }}>
          Instant, privacy-friendly online utilities to test computer input devices, benchmark hardware performance, and solve technical problems.
        </p>

        <Link
          href="/mouse-tester"
          className="px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95 flex items-center gap-3 shadow-lg"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          <span>Open Mouse Tester Suite</span>
          <span>→</span>
        </Link>
      </section>

      {/* Featured Tools Grid */}
      <section aria-label="Featured input tools">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
            Mouse &amp; Input Diagnostic Tools
          </h2>
          <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>7 Production Tools Available</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_TOOLS.map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group p-6 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-1"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{tool.icon}</span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--border-c)' }}
                  >
                    {tool.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>
                  {tool.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {tool.desc}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold pt-2 group-hover:underline" style={{ color: 'var(--accent)', borderTop: '1px border-c' }}>
                Launch Tool →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Expansion Roadmap Categories */}
      <section className="flex flex-col gap-6 pt-6" style={{ borderTop: '1px solid var(--border-c)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          Tool Directory &amp; Future Utility Roadmap
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {FUTURE_CATEGORIES.map(cat => (
            <div key={cat.category} className="p-6 rounded-2xl flex flex-col gap-4" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
              <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>{cat.category}</h3>
              <div className="flex flex-col gap-3">
                {cat.tools.map(t => (
                  <div key={t.name} className="p-3 rounded-xl flex items-center justify-between opacity-70" style={{ background: 'var(--surface-2)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.icon}</span>
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
                        <p className="text-[11px]" style={{ color: 'var(--muted)' }}>{t.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium" style={{ background: 'var(--surface)', color: 'var(--muted)' }}>
                      In Development
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
