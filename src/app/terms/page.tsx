export default function TermsPage() {
  return (
    <div className="flex flex-col gap-8 py-6 max-w-4xl mx-auto animate-fade-in">
      <section className="text-center">
        <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--text)' }}>
          Terms of Use
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Last updated: August 23, 2026
        </p>
      </section>

      <article className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6 text-sm leading-relaxed" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Mouse Tester (mousetester.app), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our utilities.
        </p>

        <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>2. Use of Diagnostic Utilities</h2>
        <p>
          Our tools are provided free of charge for hardware diagnostic testing, benchmark estimation, and personal utility. Measurements provided (e.g., polling rate Hz, click latency, DPI estimation) are provided &quot;as is&quot; based on browser DOM event API capabilities.
        </p>

        <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>3. Limitation of Liability</h2>
        <p>
          Mouse Tester and its maintainers shall not be held liable for hardware degradation, microswitch wear from rapid clicking, or software misconfigurations resulting from third-party software changes.
        </p>
      </article>
    </div>
  );
}
