'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-8 py-6 max-w-2xl mx-auto animate-fade-in">
      <section className="text-center">
        <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--text)' }}>
          Contact &amp; Feedback
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Have suggestions, feature requests, or technical bug reports? Send us a message below.
        </p>
      </section>

      <div className="p-6 sm:p-8 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        {submitted ? (
          <div className="p-6 rounded-xl text-center flex flex-col gap-2" style={{ background: 'color-mix(in srgb, var(--green) 12%, var(--surface-2))', border: '1px solid var(--green)' }}>
            <span className="text-2xl">✅</span>
            <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>Thank You for Your Feedback!</h2>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Your message has been received locally. We review all feedback to improve tool accuracy.
            </p>
            <button
              onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold w-fit mx-auto cursor-pointer"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="p-3 rounded-xl border text-sm font-medium"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="p-3 rounded-xl border text-sm font-medium"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Message / Feedback</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your question or tool suggestion..."
                className="p-3 rounded-xl border text-sm font-medium resize-none"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl font-bold text-sm cursor-pointer transition-all active:scale-95 text-white"
              style={{ background: 'var(--accent)' }}
            >
              Submit Message
            </button>

            <p className="text-[11px] text-center mt-2" style={{ color: 'var(--muted)' }}>
              🔒 Your contact details are never shared or sold. See our <a href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
