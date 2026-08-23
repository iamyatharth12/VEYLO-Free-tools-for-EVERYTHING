import Link from 'next/link';
import MouseClickTester from '@/components/tools/MouseClickTester';
import RelatedTools from '@/components/ui/RelatedTools';
import AdSlot from '@/components/ui/AdSlot';

export default function MouseClickTestPage() {
  return (
    <div className="flex flex-col gap-10 py-6 animate-fade-in">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          Mouse Click Test
        </h1>
        <p className="text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
          Verify that every button on your mouse—left, right, middle wheel, and side buttons—transmits clean click signals to your browser.
        </p>
      </section>

      {/* Interactive Tool */}
      <section className="animate-slide-up" aria-label="Interactive mouse click tester">
        <MouseClickTester />
      </section>

      {/* Internal Navigation Anchor */}
      <div className="p-4 rounded-xl text-center text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}>
        Looking for full diagnostic suite? Try the main{' '}
        <Link href="/mouse-tester" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          Mouse Tester
        </Link>{' '}
        or test for microswitch chatter with the{' '}
        <Link href="/double-click-test" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          Double Click Test
        </Link>.
      </div>

      <AdSlot position="inline" />

      {/* SEO Content Section */}
      <article className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          How to Test Your Mouse Buttons Online
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Computer mice utilize physical mechanical or optical microswitches under each button. Over time, switches can wear down, experience dust buildup, or suffer hardware degradation. Using an online mouse click tester is the fastest way to confirm whether your operating system and browser receive clear button input signals without installing third-party software.
        </p>

        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          Buttons You Can Test
        </h3>
        <ul className="list-disc list-inside text-sm flex flex-col gap-2" style={{ color: 'var(--muted)' }}>
          <li><strong style={{ color: 'var(--text)' }}>Primary Left Click (Button 0):</strong> The standard primary action button used for selection and interaction.</li>
          <li><strong style={{ color: 'var(--text)' }}>Middle Wheel Click (Button 1):</strong> The scroll wheel press button used for auto-scrolling and middle-click tab operations.</li>
          <li><strong style={{ color: 'var(--text)' }}>Secondary Right Click (Button 2):</strong> The context menu button. Browser context menus are automatically bypassed during testing.</li>
          <li><strong style={{ color: 'var(--text)' }}>Side Thumb Buttons (Button 3 & 4):</strong> Browser back and forward buttons present on gaming and ergonomic mice.</li>
        </ul>

        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          Frequently Asked Questions
        </h3>
        <div className="flex flex-col gap-4 text-sm" style={{ color: 'var(--muted)' }}>
          <div>
            <h4 className="font-bold" style={{ color: 'var(--text)' }}>Why is my right click opening a menu instead of testing?</h4>
            <p className="mt-1">Make sure you click &quot;Start Click Testing&quot; first. When testing is active, context menu interception is enabled so right clicks register in the diagnostic grid.</p>
          </div>
          <div>
            <h4 className="font-bold" style={{ color: 'var(--text)' }}>Is my mouse data stored on a server?</h4>
            <p className="mt-1">No. All mouse input events are processed entirely inside your local browser DOM. Nothing is ever sent over the network.</p>
          </div>
        </div>
      </article>

      <RelatedTools />
    </div>
  );
}
