import Link from 'next/link';
import DoubleClickTester from '@/components/tools/DoubleClickTester';
import RelatedTools from '@/components/ui/RelatedTools';
import AdSlot from '@/components/ui/AdSlot';

export default function DoubleClickTestPage() {
  return (
    <div className="flex flex-col gap-10 py-6 animate-fade-in">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          Double Click Test
        </h1>
        <p className="text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
          Is your mouse double-clicking accidentally? Test microswitch chatter and measure precise click interval timing in milliseconds.
        </p>
      </section>

      {/* Interactive Tool */}
      <section className="animate-slide-up" aria-label="Interactive double click tester">
        <DoubleClickTester />
      </section>

      {/* Internal Link Callout */}
      <div className="p-4 rounded-xl text-center text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}>
        Want to test raw click speed instead? Try the{' '}
        <Link href="/cps-test" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          CPS Click Speed Test
        </Link>{' '}
        or perform full button diagnostics on the{' '}
        <Link href="/mouse-tester" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          Mouse Tester Pillar Page
        </Link>.
      </div>

      <AdSlot position="inline" />

      {/* SEO Content Section */}
      <article className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          What is Mouse Switch Chatter (Accidental Double Clicking)?
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Microswitch chatter occurs when mechanical metal contact leaves inside your mouse button degrade, corrode, or lose structural tension. When you press the button once, the worn contact leaf physically vibrates (bounces) against the terminal, generating two or more rapid electrical signals within a split second.
        </p>

        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          How to Interpret Your Test Results
        </h3>
        <ul className="list-disc list-inside text-sm flex flex-col gap-2" style={{ color: 'var(--muted)' }}>
          <li><strong style={{ color: 'var(--green)' }}>Normal Click (&gt;100ms):</strong> Intentional user clicks typically range from 120ms to 400ms apart.</li>
          <li><strong style={{ color: 'var(--accent)' }}>Fast Double Click (80ms - 120ms):</strong> Rapid intentional double clicking (such as gaming or double-clicking files).</li>
          <li><strong style={{ color: 'var(--red)' }}>Switch Chatter (&lt;80ms):</strong> Physical impossibility for human fingers. If registered without deliberate jitter-clicking, your mouse switch is faulty.</li>
        </ul>

        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          How to Fix a Double Clicking Mouse
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          1. Clean out dust around the switch using compressed air.<br />
          2. Adjust debouncing algorithm settings in software (e.g., Logitech G HUB, Razer Synapse, SteelSeries GG).<br />
          3. Replace the mechanical microswitch or upgrade to optical switches which eliminate physical contact bounce entirely.
        </p>
      </article>

      <RelatedTools />
    </div>
  );
}
