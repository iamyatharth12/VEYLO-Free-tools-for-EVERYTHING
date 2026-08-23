import Link from 'next/link';

const TOOLS = [
  {
    href: '/mouse-tester',
    label: 'Mouse Tester',
    desc: 'Full diagnostic suite for buttons, scroll & movement.',
    icon: '🖱️',
    soon: false,
  },
  {
    href: '/mouse-click-test',
    label: 'Mouse Click Test',
    desc: 'Test left, right, middle & side button signals.',
    icon: '🎯',
    soon: false,
  },
  {
    href: '/double-click-test',
    label: 'Double Click Test',
    desc: 'Detect switch chatter & timing intervals.',
    icon: '⚡',
    soon: false,
  },
  {
    href: '/mouse-scroll-test',
    label: 'Mouse Scroll Test',
    desc: 'Check wheel notches, tilt & scroll direction.',
    icon: '📜',
    soon: false,
  },
  {
    href: '/mouse-polling-rate-test',
    label: 'Polling Rate Test',
    desc: 'Measure real-time mouse frequency (Hz).',
    icon: '📡',
    soon: false,
  },
  {
    href: '/mouse-dpi-test',
    label: 'Mouse DPI Test',
    desc: 'Estimate hardware DPI & calculate eDPI.',
    icon: '📐',
    soon: false,
  },
  {
    href: '/cps-test',
    label: 'CPS Speed Test',
    desc: 'Measure clicks per second & rank speed.',
    icon: '⏱️',
    soon: false,
  },
] as const;

export default function RelatedTools() {
  return (
    <section id="tools" aria-labelledby="related-tools-heading">
      <h2
        id="related-tools-heading"
        className="text-base font-semibold mb-4"
        style={{ color: 'var(--text)' }}
      >
        Mouse &amp; Hardware Tool Suite
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {TOOLS.map(tool => (
          <Link
            key={tool.label}
            href={tool.href}
            className="rounded-xl p-3.5 flex flex-col gap-2 transition-all duration-150 hover:-translate-y-0.5"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-c)',
            }}
            aria-label={tool.label}
          >
            <span className="text-xl" aria-hidden="true">{tool.icon}</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{tool.label}</p>
              <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--muted)' }}>{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
