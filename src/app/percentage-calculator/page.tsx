'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  FAQItem,
} from '@/components/tool-ui';

export default function PercentageCalculatorPage() {
  const tool = useMemo(() => getToolBySlug('percentage-calculator')!, []);

  // Mode 1: What is X% of Y?
  const [calc1X, setCalc1X] = useState<number>(15);
  const [calc1Y, setCalc1Y] = useState<number>(200);

  // Mode 2: X is what % of Y?
  const [calc2X, setCalc2X] = useState<number>(45);
  const [calc2Y, setCalc2Y] = useState<number>(180);

  // Mode 3: Percentage increase / decrease from X to Y
  const [calc3X, setCalc3X] = useState<number>(80);
  const [calc3Y, setCalc3Y] = useState<number>(120);

  // Mode 4: Percentage difference between X and Y
  const [calc4X, setCalc4X] = useState<number>(100);
  const [calc4Y, setCalc4Y] = useState<number>(125);

  // Mode 5: Discount Calculator
  const [calc5Original, setCalc5Original] = useState<number>(150);
  const [calc5Discount, setCalc5Discount] = useState<number>(25);

  // Calculations
  const res1 = useMemo(() => {
    const val = (calc1X / 100) * calc1Y;
    return isFinite(val) ? +val.toFixed(4) : 0;
  }, [calc1X, calc1Y]);

  const res2 = useMemo(() => {
    if (calc2Y === 0) return { val: 0, error: 'Cannot divide by zero' };
    const val = (calc2X / calc2Y) * 100;
    return { val: +val.toFixed(4), error: null };
  }, [calc2X, calc2Y]);

  const res3 = useMemo(() => {
    if (calc3X === 0) return { val: 0, isIncrease: true, error: 'Initial value cannot be zero' };
    const diff = calc3Y - calc3X;
    const pct = (diff / Math.abs(calc3X)) * 100;
    return {
      val: +Math.abs(pct).toFixed(4),
      isIncrease: diff >= 0,
      diff: +(diff).toFixed(4),
      error: null,
    };
  }, [calc3X, calc3Y]);

  const res4 = useMemo(() => {
    const avg = (calc4X + calc4Y) / 2;
    if (avg === 0) return { val: 0, error: 'Average is zero' };
    const diff = Math.abs(calc4X - calc4Y);
    const pct = (diff / Math.abs(avg)) * 100;
    return { val: +pct.toFixed(4), error: null };
  }, [calc4X, calc4Y]);

  const res5 = useMemo(() => {
    const savings = (calc5Discount / 100) * calc5Original;
    const finalPrice = calc5Original - savings;
    return {
      savings: +savings.toFixed(2),
      finalPrice: +finalPrice.toFixed(2),
    };
  }, [calc5Original, calc5Discount]);

  const faqs: FAQItem[] = [
    {
      question: 'What is the formula for percentage increase?',
      answer:
        'Percentage Increase = ((New Value - Old Value) / |Old Value|) × 100. If the result is negative, it represents a percentage decrease.',
    },
    {
      question: 'How is percentage difference calculated?',
      answer:
        'Percentage Difference is used when comparing two values where neither is the reference point: (|Value 1 - Value 2| / ((Value 1 + Value 2) / 2)) × 100.',
    },
    {
      question: 'How does discount pricing work?',
      answer:
        'Final Price = Original Price - (Original Price × (Discount Rate / 100)). Savings = Original Price × (Discount Rate / 100).',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Instant Mathematical &amp; Commercial Percentage Calculators
          </h2>
          <p>
            Perform percentage calculations for sales discounts, business profit margins, statistical changes, and math homework instantly with formula breakdowns.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📈 Growth &amp; Change</h3>
              <p className="text-[11px]">Calculate percentage increase, decrease, and variance between two values.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🏷️ Retail Discounts</h3>
              <p className="text-[11px]">Find final sales prices and total dollar savings on clearance items.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🧮 Exact Formula Transparency</h3>
              <p className="text-[11px]">Step-by-step mathematical expressions for educational and business clarity.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calculator 1: What is X% of Y? */}
        <div
          className="p-6 rounded-2xl flex flex-col justify-between gap-5 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              What is <span style={{ color: 'var(--accent)' }}>X%</span> of <span style={{ color: 'var(--accent)' }}>Y</span>?
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="c1-x" className="text-[11px]" style={{ color: 'var(--muted)' }}>Percentage (X%)</label>
                <input
                  id="c1-x"
                  type="number"
                  value={calc1X}
                  onChange={(e) => setCalc1X(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              <span className="text-sm font-bold pt-4" style={{ color: 'var(--muted)' }}>of</span>

              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="c1-y" className="text-[11px]" style={{ color: 'var(--muted)' }}>Total Value (Y)</label>
                <input
                  id="c1-y"
                  type="number"
                  value={calc1Y}
                  onChange={(e) => setCalc1Y(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
            <div className="flex flex-col">
              <span className="text-[11px]" style={{ color: 'var(--muted)' }}>Result</span>
              <span className="text-2xl font-black font-mono" style={{ color: 'var(--accent)' }}>{res1}</span>
            </div>
            <CopyButton textToCopy={String(res1)} size="sm" />
          </div>
        </div>

        {/* Calculator 2: X is what % of Y? */}
        <div
          className="p-6 rounded-2xl flex flex-col justify-between gap-5 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              <span style={{ color: 'var(--accent)' }}>X</span> is what percentage of <span style={{ color: 'var(--accent)' }}>Y</span>?
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="c2-x" className="text-[11px]" style={{ color: 'var(--muted)' }}>Number (X)</label>
                <input
                  id="c2-x"
                  type="number"
                  value={calc2X}
                  onChange={(e) => setCalc2X(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              <span className="text-sm font-bold pt-4" style={{ color: 'var(--muted)' }}>out of</span>

              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="c2-y" className="text-[11px]" style={{ color: 'var(--muted)' }}>Total (Y)</label>
                <input
                  id="c2-y"
                  type="number"
                  value={calc2Y}
                  onChange={(e) => setCalc2Y(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
            <div className="flex flex-col">
              <span className="text-[11px]" style={{ color: 'var(--muted)' }}>Result</span>
              <span className="text-2xl font-black font-mono" style={{ color: 'var(--accent)' }}>
                {res2.error ? res2.error : `${res2.val}%`}
              </span>
            </div>
            {!res2.error && <CopyButton textToCopy={`${res2.val}%`} size="sm" />}
          </div>
        </div>

        {/* Calculator 3: Percentage Increase / Decrease */}
        <div
          className="p-6 rounded-2xl flex flex-col justify-between gap-5 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Percentage Increase / Decrease
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="c3-x" className="text-[11px]" style={{ color: 'var(--muted)' }}>Initial Value</label>
                <input
                  id="c3-x"
                  type="number"
                  value={calc3X}
                  onChange={(e) => setCalc3X(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              <span className="text-sm font-bold pt-4" style={{ color: 'var(--muted)' }}>➔</span>

              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="c3-y" className="text-[11px]" style={{ color: 'var(--muted)' }}>Final Value</label>
                <input
                  id="c3-y"
                  type="number"
                  value={calc3Y}
                  onChange={(e) => setCalc3Y(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
            <div className="flex flex-col">
              <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
                {res3.isIncrease ? '📈 Percentage Increase' : '📉 Percentage Decrease'}
              </span>
              <span
                className="text-2xl font-black font-mono"
                style={{ color: res3.isIncrease ? 'var(--green, #10b981)' : '#ef4444' }}
              >
                {res3.error ? res3.error : `${res3.isIncrease ? '+' : '-'}${res3.val}%`}
              </span>
            </div>
            {!res3.error && <CopyButton textToCopy={`${res3.isIncrease ? '+' : '-'}${res3.val}%`} size="sm" />}
          </div>
        </div>

        {/* Calculator 4: Percentage Difference */}
        <div
          className="p-6 rounded-2xl flex flex-col justify-between gap-5 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Percentage Difference Between Two Values
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="c4-x" className="text-[11px]" style={{ color: 'var(--muted)' }}>Value A</label>
                <input
                  id="c4-x"
                  type="number"
                  value={calc4X}
                  onChange={(e) => setCalc4X(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              <span className="text-sm font-bold pt-4" style={{ color: 'var(--muted)' }}>and</span>

              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="c4-y" className="text-[11px]" style={{ color: 'var(--muted)' }}>Value B</label>
                <input
                  id="c4-y"
                  type="number"
                  value={calc4Y}
                  onChange={(e) => setCalc4Y(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
            <div className="flex flex-col">
              <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
                Percentage Difference
              </span>
              <span className="text-2xl font-black font-mono" style={{ color: 'var(--accent)' }}>
                {res4.error ? res4.error : `${res4.val}%`}
              </span>
            </div>
            {!res4.error && <CopyButton textToCopy={`${res4.val}%`} size="sm" />}
          </div>
        </div>

        {/* Calculator 5: Discount Calculator */}
        <div
          className="p-6 rounded-2xl flex flex-col justify-between gap-5 shadow-xs sm:col-span-2"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Discount &amp; Savings Calculator
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="c5-orig" className="text-[11px]" style={{ color: 'var(--muted)' }}>Original Price ($)</label>
                <input
                  id="c5-orig"
                  type="number"
                  value={calc5Original}
                  onChange={(e) => setCalc5Original(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="c5-disc" className="text-[11px]" style={{ color: 'var(--muted)' }}>Discount (%)</label>
                <input
                  id="c5-disc"
                  type="number"
                  value={calc5Discount}
                  onChange={(e) => setCalc5Discount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
            <div className="flex flex-col">
              <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
                Final Price (You save ${res5.savings})
              </span>
              <span className="text-2xl font-black font-mono" style={{ color: 'var(--green, #10b981)' }}>
                ${res5.finalPrice}
              </span>
            </div>
            <CopyButton textToCopy={`$${res5.finalPrice}`} size="sm" />
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
