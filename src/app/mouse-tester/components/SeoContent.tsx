export default function SeoContent() {
  return (
    <article className="flex flex-col gap-10 mt-12" style={{ color: 'var(--muted)' }}>

      {/* ── What is a mouse tester ─────────────────────────────────────── */}
      <section>
        <h2
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text)' }}
        >
          What is a Mouse Tester?
        </h2>
        <p className="text-sm leading-relaxed">
          A mouse tester is a browser-based tool that lets you verify whether your mouse hardware 
          is working correctly — without installing any software. You can check all your mouse buttons, 
          test your scroll wheel, track mouse movement, and measure your clicking speed directly in the browser. 
          Everything runs locally on your device.
        </p>
      </section>

      {/* ── How to test your mouse ────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>
          How to Test Your Mouse
        </h2>
        <ol className="flex flex-col gap-2 text-sm leading-relaxed list-decimal list-inside">
          <li>Open this page in any modern browser — no installation needed.</li>
          <li>Click the <strong style={{ color: 'var(--text)' }}>Start Testing</strong> button to activate the test area.</li>
          <li>Press your left, right, and middle mouse buttons — the visual mouse will highlight each one.</li>
          <li>Move your mouse across the screen and watch the movement trail update in real time.</li>
          <li>Scroll up, down, and horizontally using your scroll wheel.</li>
          <li>Double-click rapidly to test the double-click detection.</li>
          <li>Try the CPS test to measure your click speed.</li>
          <li>Check the Event Monitor to see a detailed log of every action.</li>
          <li>Press <strong style={{ color: 'var(--text)' }}>Reset</strong> to clear all results and start fresh.</li>
        </ol>
      </section>

      {/* ── What can you test ─────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>
          What Can You Test?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            { title: 'Left Click',      body: 'Verifies the primary mouse button registers correctly on press and release.' },
            { title: 'Right Click',     body: 'Tests the secondary button. Right-click context menus are suppressed while testing.' },
            { title: 'Middle Click',    body: 'Tests the scroll wheel button click. Useful for checking middle-click paste or tab closing.' },
            { title: 'Mouse Movement',  body: 'Tracks X/Y position and total distance moved. Draws a live trail on the canvas.' },
            { title: 'Scroll Wheel',    body: 'Counts scroll up, scroll down, and horizontal scroll events separately.' },
            { title: 'Double Clicking', body: 'Detects rapid repeated clicks and shows the time between them.' },
            { title: 'Extra Buttons',   body: 'Back and Forward side buttons are shown when detected by the browser.' },
            { title: 'CPS',             body: 'Measures your clicks per second over a 1, 5, or 10-second test period.' },
          ].map(item => (
            <div key={item.title}>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
                {item.title}
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Troubleshooting ────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>
          How to Tell If Your Mouse Is Working Correctly
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          A working mouse should register every click cleanly on both press and release with no unexpected 
          extra events. If you notice any of the following, your mouse may need attention:
        </p>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed list-disc list-inside">
          <li>A single click registers as two clicks (switch chatter).</li>
          <li>Buttons don&apos;t respond every time you press them.</li>
          <li>The scroll wheel skips steps or scrolls in the wrong direction.</li>
          <li>The cursor moves erratically or jumps around.</li>
          <li>Extra mouse events appear without a corresponding physical input.</li>
        </ul>
      </section>

      {/* ── Why is my mouse double clicking ───────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>
          Why Is My Mouse Double Clicking?
        </h2>
        <p className="text-sm leading-relaxed">
          Unintended double-clicking is usually caused by a worn or dirty mechanical switch inside the mouse. 
          The switch contact bounces briefly on release, which the operating system interprets as two separate clicks. 
          Common causes include heavy use over time, dust contamination, or manufacturing variance in lower-cost 
          mice. While you can observe this behavior in a browser test, a browser cannot inspect your hardware directly 
          or tell you whether the switch needs replacement. If the problem persists, try the mouse in another 
          application to confirm the behavior before opening the device.
        </p>
      </section>

      {/* ── How to test a scroll wheel ─────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>
          How to Test a Mouse Scroll Wheel
        </h2>
        <ol className="flex flex-col gap-2 text-sm leading-relaxed list-decimal list-inside">
          <li>Use the scroll wheel on this page — the Scroll Test panel will count each event.</li>
          <li>Scroll upward and check that the &quot;Scroll Up&quot; counter increases.</li>
          <li>Scroll downward and check that the &quot;Scroll Down&quot; counter increases.</li>
          <li>If your mouse has a tilt wheel, push it left or right to test horizontal scrolling.</li>
          <li>Press down on the scroll wheel to test the middle-click button.</li>
          <li>If any direction does not register, try reconnecting the mouse or testing on a different surface.</li>
        </ol>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-5">
          {[
            {
              q: 'How do I test my mouse?',
              a: 'Open this page and interact with your mouse — click buttons, move it around, and use the scroll wheel. All results appear instantly without any software installation.',
            },
            {
              q: 'How do I test my mouse buttons?',
              a: 'Click each button while looking at the mouse visual at the top of the page. The corresponding button will highlight on press. The Button Diagnostics section shows whether each button has been detected.',
            },
            {
              q: 'How do I know if my mouse is working?',
              a: 'If all buttons register cleanly, the scroll wheel counts events in the correct direction, and the movement trail updates smoothly, your mouse is functioning correctly within the browser\'s detection range.',
            },
            {
              q: 'How do I test a mouse scroll wheel?',
              a: 'Scroll anywhere on this page. The Scroll Test panel tracks up, down, and horizontal events separately. If a direction does not register, that channel of your scroll wheel may have an issue.',
            },
            {
              q: 'Can I test a mouse without installing software?',
              a: 'Yes. This tool runs entirely in your browser with no downloads, no extensions, and no account required.',
            },
            {
              q: 'Can this website detect a broken mouse switch?',
              a: 'A browser can observe mouse button events, but it cannot access hardware internals or guarantee a diagnosis. If a single click repeatedly registers as two clicks, that pattern is consistent with switch chatter — but to confirm, test the mouse in multiple applications and consider professional inspection.',
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{q}</h3>
              <p className="text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

    </article>
  );
}
