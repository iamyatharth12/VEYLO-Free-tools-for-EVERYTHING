import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/siteConfig';

export const metadata = {
  title: 'VEYLO — Free tools for EVERYTHING',
  description: 'A growing collection of fast, free browser tools for testing, measuring, calculating, converting, creating, and troubleshooting. 100% client-side in your browser.',
  alternates: { canonical: SITE_CONFIG.url },
};

const LIVE_MOUSE_TOOLS = [
  {
    href: '/mouse-tester',
    title: 'Mouse Tester',
    desc: 'Complete hardware diagnostic tool for buttons, scroll wheel, movement tracking, and event logs.',
    icon: '🖱️',
    badge: 'Flagship',
  },
  {
    href: '/mouse-click-test',
    title: 'Mouse Click Test',
    desc: 'Verify left, right, middle wheel, and side thumb button click signal transmission.',
    icon: '🎯',
    badge: 'Live',
  },
  {
    href: '/double-click-test',
    title: 'Double Click Test',
    desc: 'Detect microswitch chatter and measure precise click interval timing in milliseconds.',
    icon: '⚡',
    badge: 'Diagnostic',
  },
  {
    href: '/mouse-scroll-test',
    title: 'Mouse Scroll Test',
    desc: 'Test scroll wheel notches, direction tracking (up/down/tilt), and middle button switch.',
    icon: '📜',
    badge: 'Hardware',
  },
  {
    href: '/mouse-polling-rate-test',
    title: 'Mouse Polling Rate Test',
    desc: 'Measure real-time mouse report frequency (Hz), peak rate, and interval latency.',
    icon: '📡',
    badge: 'Benchmark',
  },
  {
    href: '/mouse-dpi-test',
    title: 'Mouse DPI & eDPI Calculator',
    desc: 'Estimate hardware sensor DPI and calculate eDPI effective sensitivity across video games.',
    icon: '📐',
    badge: 'Calculator',
  },
  {
    href: '/cps-test',
    title: 'CPS Click Speed Test',
    desc: 'Measure your Clicks Per Second across 1s to 60s challenges with live speed ranking.',
    icon: '⏱️',
    badge: 'Speed Test',
  },
];

const PLATFORM_ROADMAP = [
  {
    category: 'Keyboard Tools',
    icon: '⌨️',
    tools: [
      { name: 'Keyboard Tester', desc: 'Test all keys, key combinations, and detect anti-ghosting limits.' },
      { name: 'Key Tester', desc: 'Verify individual mechanical switch actuation and debounce timing.' },
      { name: 'Keyboard Speed Test', desc: 'Measure typing speed (WPM) and raw key press frequency.' },
    ],
  },
  {
    category: 'Gaming & Controller Tools',
    icon: '🎮',
    tools: [
      { name: 'Gamepad Tester', desc: 'Test Xbox, PlayStation, and USB controller buttons & analog sticks.' },
      { name: 'Controller Drift Checker', desc: 'Inspect analog joystick deadzones, centering, and circularity.' },
      { name: 'Trigger & Pressure Test', desc: 'Monitor analog trigger response curves in real time.' },
    ],
  },
  {
    category: 'Screen & Display Tools',
    icon: '🖥️',
    tools: [
      { name: 'Dead Pixel Test', desc: 'Full-screen solid color test to identify defective or stuck pixels.' },
      { name: 'Screen Refresh Rate (Hz) Test', desc: 'Measure display frame rate and browser sync frequency.' },
      { name: 'Color & Contrast Test', desc: 'Evaluate monitor dynamic range, gamma, and color banding.' },
    ],
  },
  {
    category: 'Audio & Media Utilities',
    icon: '🎙️',
    tools: [
      { name: 'Microphone Test', desc: 'Test audio input waveform, sampling rate, and recording latency.' },
      { name: 'Speaker & Stereo Test', desc: 'Check left/right stereo channel separation and frequency response.' },
      { name: 'Audio Tone Generator', desc: 'Generate pure sine waves and acoustic frequency sweeps.' },
    ],
  },
  {
    category: 'Developer Utilities',
    icon: '🛠️',
    tools: [
      { name: 'JSON Formatter & Validator', desc: 'Parse, format, minify, and validate JSON data client-side.' },
      { name: 'Regex Pattern Tester', desc: 'Test regular expressions with real-time capture group matches.' },
      { name: 'Base64 & Hash Generator', desc: 'Encode/decode strings and generate SHA-256 / MD5 hashes.' },
    ],
  },
  {
    category: 'Converters & Calculators',
    icon: '🧮',
    tools: [
      { name: 'Unit & Data Converter', desc: 'Convert bytes, bandwidth rates, storage units, and frequencies.' },
      { name: 'Screen PPI Calculator', desc: 'Calculate pixel density and aspect ratios from resolution dimensions.' },
      { name: 'Color Code Converter', desc: 'Convert between HEX, RGB, HSL, and CMYK color spaces.' },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-14 py-8 animate-fade-in max-w-7xl mx-auto px-4">
      {/* VEYLO Hero */}
      <section className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <span
          className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-5 inline-flex items-center gap-1.5"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--accent)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} aria-hidden="true" />
          Free Browser Tools
        </span>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-5" style={{ color: 'var(--text)' }}>
          Free tools for <span style={{ color: 'var(--accent)' }}>EVERYTHING.</span>
        </h1>

        <p className="text-base sm:text-lg mb-8 leading-relaxed max-w-2xl" style={{ color: 'var(--muted)' }}>
          A growing collection of fast, free browser tools for testing, measuring, calculating, converting, creating, and troubleshooting.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#tools"
            className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 shadow"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <span>Explore All Tools</span>
            <span>↓</span>
          </a>
          <Link
            href="/mouse-tester"
            className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 flex items-center gap-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
          >
            <span>Mouse Tester</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Featured Tool Spotlight */}
      <section aria-label="Featured Tool">
        <div
          className="w-full p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-left"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🖱️</span>
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))', color: 'var(--accent)' }}
              >
                Featured Tool
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Mouse Tester
            </h2>
            <p className="text-xs sm:text-sm max-w-2xl" style={{ color: 'var(--muted)' }}>
              Test your mouse buttons, movement, scroll wheel, double-click behavior, and more directly in your browser.
            </p>
          </div>

          <Link
            href="/mouse-tester"
            className="flex-shrink-0 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 shadow"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <span>Open Mouse Tester</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Tool Directory */}
      <section id="tools" aria-label="Browse Tools" className="flex flex-col gap-8 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
              Browse Tools
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--muted)' }}>
              Select a tool to launch it instantly. Everything runs client-side in your browser.
            </p>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full hidden sm:inline-block"
            style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border-c)' }}
          >
            7 Tools Live
          </span>
        </div>

        {/* Category: Mouse & Input */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🖱️</span>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Mouse &amp; Input Tools</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LIVE_MOUSE_TOOLS.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-5 rounded-2xl flex flex-col justify-between gap-3.5 transition-all duration-200 hover:-translate-y-1"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tool.icon}</span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--border-c)' }}
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>
                    {tool.title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {tool.desc}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold pt-2 group-hover:underline" style={{ color: 'var(--accent)', borderTop: '1px solid var(--border-c)' }}>
                  Launch Tool →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Platform Categories & Roadmap */}
        <div className="flex flex-col gap-4 pt-6" style={{ borderTop: '1px solid var(--border-c)' }}>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Upcoming Categories &amp; Roadmap</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              New browser utilities currently in development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORM_ROADMAP.map(cat => (
              <div key={cat.category} className="p-5 rounded-2xl flex flex-col gap-3.5" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--text)' }}>{cat.category}</h4>
                </div>

                <div className="flex flex-col gap-2">
                  {cat.tools.map(t => (
                    <div key={t.name} className="p-3 rounded-xl flex items-center justify-between opacity-75" style={{ background: 'var(--surface-2)' }}>
                      <div className="flex flex-col pr-2">
                        <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{t.name}</p>
                        <p className="text-[11px] leading-tight mt-0.5" style={{ color: 'var(--muted)' }}>{t.desc}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium flex-shrink-0" style={{ background: 'var(--surface)', color: 'var(--muted)' }}>
                        In Dev
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Commitment Banner */}
      <section
        className="p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
      >
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
            100% Client-Side Browser Utilities
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            VEYLO tools run locally inside your browser. No mouse coordinates, keystrokes, uploaded files, or personal data are ever sent to our servers.
          </p>
        </div>
        <Link
          href="/about"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-colors"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
        >
          About VEYLO →
        </Link>
      </section>
    </div>
  );
}


