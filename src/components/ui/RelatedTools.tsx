const TOOLS = [
  {
    href:   null,
    label:  'Mouse Click Test',
    desc:   'Measure your raw clicking speed.',
    icon:   '🖱️',
    soon:   true,
  },
  {
    href:   null,
    label:  'Double Click Test',
    desc:   'Detect and measure double-clicks.',
    icon:   '⚡',
    soon:   true,
  },
  {
    href:   null,
    label:  'Polling Rate Test',
    desc:   'Estimate your mouse polling rate.',
    icon:   '📡',
    soon:   true,
  },
  {
    href:   null,
    label:  'Keyboard Tester',
    desc:   'Test every key on your keyboard.',
    icon:   '⌨️',
    soon:   true,
  },
  {
    href:   null,
    label:  'Gamepad Tester',
    desc:   'Test buttons and axes on controllers.',
    icon:   '🎮',
    soon:   true,
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
        Related Tools
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {TOOLS.map(tool => (
          <div
            key={tool.label}
            className="rounded-xl p-3 flex flex-col gap-2 cursor-default"
            style={{
              background:  'var(--surface)',
              border:      '1px solid var(--border-c)',
              opacity:     tool.soon ? 0.6 : 1,
            }}
            aria-label={tool.soon ? `${tool.label} (Coming soon)` : tool.label}
          >
            <span className="text-xl" aria-hidden="true">{tool.icon}</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{tool.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{tool.desc}</p>
            </div>
            {tool.soon && (
              <span
                className="text-xs px-1.5 py-0.5 rounded w-fit font-medium"
                style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}
              >
                Coming soon
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
