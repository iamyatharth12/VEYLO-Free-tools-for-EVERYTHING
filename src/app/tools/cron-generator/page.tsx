'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every 5 minutes', expr: '*/5 * * * *' },
  { label: 'Every 15 minutes', expr: '*/15 * * * *' },
  { label: 'Every hour (at minute 0)', expr: '0 * * * *' },
  { label: 'Every day at midnight', expr: '0 0 * * *' },
  { label: 'Every day at 9:00 AM', expr: '0 9 * * *' },
  { label: 'Every weekday (Mon-Fri) at 9:00 AM', expr: '0 9 * * 1-5' },
  { label: 'Every weekend (Sat-Sun) at midnight', expr: '0 0 * * 0,6' },
  { label: 'Every Sunday at midnight', expr: '0 0 * * 0' },
  { label: 'First day of every month at midnight', expr: '0 0 1 * *' },
];

function explainCron(minute: string, hour: string, dom: string, month: string, dow: string): string {
  const parts: string[] = [];

  // Minutes
  if (minute === '*') {
    parts.push('Every minute');
  } else if (minute.startsWith('*/')) {
    parts.push(`Every ${minute.replace('*/', '')} minutes`);
  } else {
    parts.push(`At minute ${minute}`);
  }

  // Hours
  if (hour === '*') {
    if (minute !== '*') parts.push('of every hour');
  } else if (hour.startsWith('*/')) {
    parts.push(`every ${hour.replace('*/', '')} hours`);
  } else {
    parts.push(`past hour ${hour}:00`);
  }

  // Day of Month
  if (dom === '*') {
    // Every day
  } else if (dom.startsWith('*/')) {
    parts.push(`every ${dom.replace('*/', '')} days`);
  } else {
    parts.push(`on day-of-month ${dom}`);
  }

  // Month
  const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (month !== '*') {
    const mNum = parseInt(month, 10);
    const mName = monthNames[mNum] || `month ${month}`;
    parts.push(`in ${mName}`);
  }

  // Day of Week
  const dowNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  if (dow === '1-5') {
    parts.push('every weekday (Monday through Friday)');
  } else if (dow === '0,6' || dow === '6,0') {
    parts.push('on weekends (Saturday and Sunday)');
  } else if (dow !== '*') {
    const dNum = parseInt(dow, 10);
    const dName = dowNames[dNum] || `day-of-week ${dow}`;
    parts.push(`on ${dName}`);
  }

  return parts.join(' ') + '.';
}

export default function CronGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('tools/cron-generator')!, []);

  const [minute, setMinute] = useState<string>('*');
  const [hour, setHour] = useState<string>('*');
  const [dom, setDom] = useState<string>('*');
  const [month, setMonth] = useState<string>('*');
  const [dow, setDow] = useState<string>('*');

  const cronExpression = `${minute} ${hour} ${dom} ${month} ${dow}`;

  const explanation = useMemo(() => {
    return explainCron(minute, hour, dom, month, dow);
  }, [minute, hour, dom, month, dow]);

  const handleApplyPreset = (expr: string) => {
    const parts = expr.trim().split(/\s+/);
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDom(parts[2]);
      setMonth(parts[3]);
      setDow(parts[4]);
    }
  };

  const handleManualEdit = (text: string) => {
    const parts = text.trim().split(/\s+/);
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDom(parts[2]);
      setMonth(parts[3]);
      setDow(parts[4]);
    }
  };

  const handleReset = () => {
    setMinute('*');
    setHour('*');
    setDom('*');
    setMonth('*');
    setDow('*');
  };

  const faqs: FAQItem[] = [
    {
      question: 'What are the 5 standard fields of a cron expression?',
      answer:
        'The standard 5-part crontab syntax is:\n1. Minute (0 - 59)\n2. Hour (0 - 23)\n3. Day of the Month (1 - 31)\n4. Month of the Year (1 - 12 or JAN - DEC)\n5. Day of the Week (0 - 6, where 0 and 7 are Sunday)',
    },
    {
      question: 'Do all cron engines support the same syntax?',
      answer:
        'No. Standard Unix cron uses 5 fields. Quartz, Spring, and AWS EventBridge may support 6 or 7 fields (including seconds and year), or special characters like `?` (no specific value), `L` (last day), and `W` (nearest weekday). Always test against your target scheduler.',
    },
    {
      question: 'What does */15 mean in the minute field?',
      answer:
        '`*/15` means "every 15 minutes", executing at minutes 0, 15, 30, and 45 of every hour.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Visual Cron Expression Generator &amp; Crontab Schedule Explainer
          </h2>
          <p>
            Build, validate, and understand standard 5-field cron schedule expressions visually with human-readable English translations and 1-click presets.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🧩 5-Field Visual Builder</h3>
              <p className="text-[11px]">Configure minute, hour, day-of-month, month, and day-of-week with custom step values.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📖 Plain English Translation</h3>
              <p className="text-[11px]">Instant natural language description of when your scheduled job will trigger.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ Ready-Made Crontab Presets</h3>
              <p className="text-[11px]">Common schedules for nightly backups, hourly cleanup, and weekday tasks.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Output Hero Banner */}
        <div
          className="p-8 sm:p-10 rounded-2xl flex flex-col items-center justify-center gap-4 text-center shadow-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Generated 5-Field Cron Expression
          </span>

          <div className="text-4xl sm:text-6xl font-black font-mono tracking-wider select-all" style={{ color: 'var(--accent)' }}>
            {cronExpression}
          </div>

          <div
            className="p-3.5 rounded-xl text-sm font-semibold max-w-xl"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
          >
            🗓️ <strong>Schedule:</strong> {explanation}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <CopyButton textToCopy={cronExpression} size="sm" label="Copy Cron Expression" />
            <ResetButton onClick={handleReset} />
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div
          className="p-6 rounded-2xl flex flex-col gap-3 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Popular Crontab Schedule Presets
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleApplyPreset(p.expr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  cronExpression === p.expr ? 'ring-2 ring-[var(--accent)]' : 'hover:border-[var(--accent)]'
                }`}
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                {p.label} <code className="text-[10px] opacity-75 font-mono ml-1">({p.expr})</code>
              </button>
            ))}
          </div>
        </div>

        {/* Visual 5-Field Builder Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Minute */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <div className="flex flex-col gap-1">
              <label htmlFor="cron-minute" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                1. Minute (0-59)
              </label>
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>* for every minute</span>
            </div>
            <select
              id="cron-minute"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs font-semibold font-mono focus:outline-none cursor-pointer"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            >
              <option value="*">Every minute (*)</option>
              <option value="*/5">Every 5 mins (*/5)</option>
              <option value="*/10">Every 10 mins (*/10)</option>
              <option value="*/15">Every 15 mins (*/15)</option>
              <option value="*/30">Every 30 mins (*/30)</option>
              <option value="0">At minute 0 (:00)</option>
              <option value="30">At minute 30 (:30)</option>
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={String(i)}>Minute {i}</option>
              ))}
            </select>
          </div>

          {/* Hour */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <div className="flex flex-col gap-1">
              <label htmlFor="cron-hour" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                2. Hour (0-23)
              </label>
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>* for every hour</span>
            </div>
            <select
              id="cron-hour"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs font-semibold font-mono focus:outline-none cursor-pointer"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            >
              <option value="*">Every hour (*)</option>
              <option value="*/2">Every 2 hours (*/2)</option>
              <option value="*/4">Every 4 hours (*/4)</option>
              <option value="*/6">Every 6 hours (*/6)</option>
              <option value="*/12">Every 12 hours (*/12)</option>
              <option value="0">Midnight (00:00)</option>
              <option value="9">9:00 AM (09:00)</option>
              <option value="12">Noon (12:00)</option>
              <option value="18">6:00 PM (18:00)</option>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={String(i)}>{i}:00 ({i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`})</option>
              ))}
            </select>
          </div>

          {/* Day of Month */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <div className="flex flex-col gap-1">
              <label htmlFor="cron-dom" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                3. Day of Month
              </label>
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>1 to 31</span>
            </div>
            <select
              id="cron-dom"
              value={dom}
              onChange={(e) => setDom(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs font-semibold font-mono focus:outline-none cursor-pointer"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            >
              <option value="*">Every day (*)</option>
              <option value="1">1st of the month (1)</option>
              <option value="15">15th of the month (15)</option>
              <option value="1,15">1st and 15th (1,15)</option>
              <option value="*/2">Every 2 days (*/2)</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>Day {i + 1}</option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <div className="flex flex-col gap-1">
              <label htmlFor="cron-month" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                4. Month (1-12)
              </label>
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Jan to Dec</span>
            </div>
            <select
              id="cron-month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs font-semibold font-mono focus:outline-none cursor-pointer"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            >
              <option value="*">Every month (*)</option>
              <option value="1">January (1)</option>
              <option value="2">February (2)</option>
              <option value="3">March (3)</option>
              <option value="4">April (4)</option>
              <option value="5">May (5)</option>
              <option value="6">June (6)</option>
              <option value="7">July (7)</option>
              <option value="8">August (8)</option>
              <option value="9">September (9)</option>
              <option value="10">October (10)</option>
              <option value="11">November (11)</option>
              <option value="12">December (12)</option>
              <option value="*/3">Every quarter (*/3)</option>
            </select>
          </div>

          {/* Day of Week */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <div className="flex flex-col gap-1">
              <label htmlFor="cron-dow" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                5. Day of Week
              </label>
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>0=Sun, 6=Sat</span>
            </div>
            <select
              id="cron-dow"
              value={dow}
              onChange={(e) => setDow(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs font-semibold font-mono focus:outline-none cursor-pointer"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            >
              <option value="*">Every day of week (*)</option>
              <option value="1-5">Weekdays only (Mon-Fri / 1-5)</option>
              <option value="0,6">Weekends only (Sat-Sun / 0,6)</option>
              <option value="0">Sunday (0)</option>
              <option value="1">Monday (1)</option>
              <option value="2">Tuesday (2)</option>
              <option value="3">Wednesday (3)</option>
              <option value="4">Thursday (4)</option>
              <option value="5">Friday (5)</option>
              <option value="6">Saturday (6)</option>
            </select>
          </div>
        </div>

        {/* Custom String Input Bar */}
        <div
          className="p-6 rounded-2xl flex flex-col gap-3 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <label htmlFor="manual-cron-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
            Or Type Custom 5-Part Cron String Directly
          </label>
          <input
            id="manual-cron-input"
            type="text"
            value={cronExpression}
            onChange={(e) => handleManualEdit(e.target.value)}
            placeholder="e.g. 0 9 * * 1-5"
            className="w-full p-3.5 rounded-xl text-base font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
