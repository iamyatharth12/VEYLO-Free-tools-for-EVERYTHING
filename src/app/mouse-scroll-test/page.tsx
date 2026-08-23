import Link from 'next/link';
import ScrollTester from '@/components/tools/ScrollTester';
import RelatedTools from '@/components/ui/RelatedTools';
import AdSlot from '@/components/ui/AdSlot';

export default function MouseScrollTestPage() {
  return (
    <div className="flex flex-col gap-10 py-6 animate-fade-in">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          Mouse Scroll Test
        </h1>
        <p className="text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
          Test your mouse scroll wheel for smooth scrolling, notch accuracy, scroll direction (up/down/horizontal), and middle click functionality.
        </p>
      </section>

      {/* Interactive Tool */}
      <section className="animate-slide-up" aria-label="Interactive scroll wheel tester">
        <ScrollTester />
      </section>

      {/* Internal Navigation Anchor */}
      <div className="p-4 rounded-xl text-center text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}>
        Need to test mouse sensor polling rate? Check your mouse Hz with our{' '}
        <Link href="/mouse-polling-rate-test" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          Mouse Polling Rate Test
        </Link>{' '}
        or perform button tests on{' '}
        <Link href="/mouse-click-test" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          Mouse Click Test
        </Link>.
      </div>

      <AdSlot position="inline" />

      {/* SEO Content */}
      <article className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          Why is My Mouse Scroll Wheel Not Working Properly?
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Mouse scroll wheels rely on rotary optical or mechanical encoders. Over time, dust, lint, or oil from fingers can accumulate inside the wheel housing, causing erratic scrolling behavior—such as scrolling up when moving down, skipping notches, or failing to register middle-click pressure.
        </p>

        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          What This Scroll Test Detects
        </h3>
        <ul className="list-disc list-inside text-sm flex flex-col gap-2" style={{ color: 'var(--muted)' }}>
          <li><strong style={{ color: 'var(--text)' }}>Vertical Wheel Notches:</strong> Counts every discrete scroll step when scrolling up or down.</li>
          <li><strong style={{ color: 'var(--text)' }}>Horizontal / Tilt Scroll:</strong> Captures left and right tilt wheel actions on supported productivity mice.</li>
          <li><strong style={{ color: 'var(--text)' }}>Middle Click Switch:</strong> Verifies whether pressing down on the scroll wheel activates the middle mouse switch.</li>
        </ul>
      </article>

      <RelatedTools />
    </div>
  );
}
