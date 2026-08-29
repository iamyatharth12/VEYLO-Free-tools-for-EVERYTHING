'use client';

import { useState, useMemo, useEffect } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

function getRelativeTime(timestampMs: number): string {
  const diffSec = Math.round((timestampMs - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  const diffHours = Math.round(diffMin / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, 'day');
  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, 'month');
  const diffYears = Math.round(diffDays / 365);
  return rtf.format(diffYears, 'year');
}

export default function UnixTimestampPage() {
  const tool = useMemo(() => getToolBySlug('tools/unix-timestamp')!, []);

  // Live Ticking Clock
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [isClockRunning, setIsClockRunning] = useState<boolean>(true);

  // Mode 1: Epoch -> Date
  const [epochInput, setEpochInput] = useState<string>(String(Math.floor(Date.now() / 1000)));

  // Mode 2: Date -> Epoch
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    if (!isClockRunning) return;
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isClockRunning]);

  // Convert Epoch to Date details
  const epochResult = useMemo(() => {
    const trimmed = epochInput.trim();
    if (!trimmed) return { valid: false, error: null };

    const num = Number(trimmed);
    if (isNaN(num)) {
      return { valid: false, error: 'Invalid numeric timestamp.' };
    }

    // Auto-detect seconds vs milliseconds
    // Numbers > 30000000000 (after year 2920) are treated as milliseconds
    const isMilliseconds = Math.abs(num) > 30000000000;
    const msValue = isMilliseconds ? num : num * 1000;

    const date = new Date(msValue);
    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Timestamp out of range for JavaScript Date.' };
    }

    return {
      valid: true,
      error: null,
      isMilliseconds,
      seconds: isMilliseconds ? Math.floor(num / 1000) : num,
      milliseconds: msValue,
      utcString: date.toUTCString(),
      localString: date.toLocaleString(),
      isoString: date.toISOString(),
      relative: getRelativeTime(msValue),
      year: date.getUTCFullYear(),
      dayOfWeek: date.toLocaleDateString(undefined, { weekday: 'long' }),
    };
  }, [epochInput]);

  // Convert Date Picker to Epoch
  const dateResult = useMemo(() => {
    if (!dateInput) return { valid: false, error: null };
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Invalid Date format.' };
    }

    const ms = date.getTime();
    const sec = Math.floor(ms / 1000);

    return {
      valid: true,
      error: null,
      seconds: sec,
      milliseconds: ms,
      utcString: date.toUTCString(),
      isoString: date.toISOString(),
    };
  }, [dateInput]);

  const handleSetPreset = (offsetSeconds: number) => {
    const target = Math.floor(Date.now() / 1000) + offsetSeconds;
    setEpochInput(String(target));
  };

  const faqs: FAQItem[] = [
    {
      question: 'What is a Unix Timestamp (Epoch)?',
      answer:
        'A Unix timestamp is the number of seconds that have elapsed since 00:00:00 UTC on 1 January 1970 (the Unix Epoch), minus leap seconds. It is the standard format for recording time across servers, databases, and APIs.',
    },
    {
      question: 'How does the tool distinguish seconds from milliseconds?',
      answer:
        'Timestamps with 10 digits (e.g. `1700000000`) represent seconds. Timestamps with 13 digits (e.g. `1700000000000`) represent milliseconds, which is the native format used by JavaScript’s `Date.now()`. Our tool automatically detects the scale.',
    },
    {
      question: 'What is the Year 2038 Problem?',
      answer:
        'On January 19, 2038, 32-bit signed integers will overflow when counting Unix seconds beyond 2,147,483,647. Modern 64-bit systems and JavaScript numbers prevent this issue for billions of years.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            High-Precision Unix Epoch Timestamp &amp; ISO 8601 Date Converter
          </h2>
          <p>
            Translate Unix epoch seconds and milliseconds into human-readable UTC and local time strings, and convert custom calendar dates into machine timestamps.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⏱️ Seconds vs Milliseconds</h3>
              <p className="text-[11px]">Auto-detects 10-digit seconds and 13-digit milliseconds accurately.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🌍 Timezone Breakdown</h3>
              <p className="text-[11px]">Provides ISO 8601 strings, GMT/UTC formatting, and local system time.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ Live Ticking Counter</h3>
              <p className="text-[11px]">Real-time current Unix timestamp clock with 1-click preset jumps.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Live Current Timestamp Banner */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ background: isClockRunning ? 'var(--green, #10b981)' : '#ef4444' }}
              />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Current Unix Epoch Time
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono select-all" style={{ color: 'var(--accent)' }}>
              {currentEpoch}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsClockRunning(!isClockRunning)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              {isClockRunning ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button
              type="button"
              onClick={() => setEpochInput(String(currentEpoch))}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--accent)' }}
            >
              Copy to Converter ↓
            </button>
            <CopyButton textToCopy={String(currentEpoch)} size="sm" />
          </div>
        </div>

        {/* Converter Mode 1: Timestamp to Date */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Convert Unix Timestamp to Human Date
            </h2>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleSetPreset(0)}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold hover:border-[var(--accent)] cursor-pointer"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Now
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(3600)}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold hover:border-[var(--accent)] cursor-pointer"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                +1 Hour
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(86400)}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold hover:border-[var(--accent)] cursor-pointer"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                +1 Day
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(604800)}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold hover:border-[var(--accent)] cursor-pointer"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                +1 Week
              </button>
              <ResetButton onClick={() => setEpochInput('')} label="Clear" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="epoch-input" className="text-xs font-bold" style={{ color: 'var(--muted)' }}>
              Enter Timestamp (Seconds or Milliseconds)
            </label>
            <input
              id="epoch-input"
              type="text"
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              placeholder="e.g. 1700000000 or 1700000000000"
              className="w-full p-3.5 rounded-xl text-base font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />
          </div>

          {epochResult.error && (
            <div className="p-3 rounded-xl text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20">
              {epochResult.error}
            </div>
          )}

          {epochResult.valid && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {/* UTC Time */}
              <div className="p-4 rounded-xl flex flex-col justify-between gap-2 shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>GMT / UTC</span>
                  <CopyButton textToCopy={epochResult.utcString || ''} size="sm" />
                </div>
                <span className="text-xs font-mono font-bold select-all" style={{ color: 'var(--text)' }}>
                  {epochResult.utcString}
                </span>
              </div>

              {/* Local Time */}
              <div className="p-4 rounded-xl flex flex-col justify-between gap-2 shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>Your Local Time</span>
                  <CopyButton textToCopy={epochResult.localString || ''} size="sm" />
                </div>
                <span className="text-xs font-mono font-bold select-all" style={{ color: 'var(--text)' }}>
                  {epochResult.localString}
                </span>
              </div>

              {/* Relative Time */}
              <div className="p-4 rounded-xl flex flex-col justify-between gap-2 shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>Relative Duration</span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>{epochResult.isMilliseconds ? 'Milliseconds' : 'Seconds'}</span>
                </div>
                <span className="text-sm font-bold capitalize" style={{ color: 'var(--text)' }}>
                  {epochResult.relative}
                </span>
              </div>

              {/* ISO 8601 */}
              <div className="p-4 rounded-xl flex flex-col justify-between gap-2 shadow-2xs sm:col-span-2 lg:col-span-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>ISO 8601 String</span>
                  <CopyButton textToCopy={epochResult.isoString || ''} size="sm" />
                </div>
                <span className="text-xs font-mono font-bold select-all" style={{ color: 'var(--text)' }}>
                  {epochResult.isoString}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Converter Mode 2: Date Picker to Timestamp */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Convert Calendar Date &amp; Time to Timestamp
            </h2>
            <button
              type="button"
              onClick={() => setDateInput(new Date().toISOString().slice(0, 16))}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              Set to Current Time
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="date-input" className="text-xs font-bold" style={{ color: 'var(--muted)' }}>
              Select Date and Time
            </label>
            <input
              id="date-input"
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full p-3.5 rounded-xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />
          </div>

          {dateResult.valid && (
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {/* Epoch Seconds */}
              <div className="p-4 rounded-xl flex items-center justify-between shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Unix Seconds</span>
                  <span className="text-xl font-black font-mono" style={{ color: 'var(--text)' }}>{dateResult.seconds}</span>
                </div>
                <CopyButton textToCopy={String(dateResult.seconds)} size="sm" />
              </div>

              {/* Epoch Milliseconds */}
              <div className="p-4 rounded-xl flex items-center justify-between shadow-2xs" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>Unix Milliseconds</span>
                  <span className="text-xl font-black font-mono" style={{ color: 'var(--text)' }}>{dateResult.milliseconds}</span>
                </div>
                <CopyButton textToCopy={String(dateResult.milliseconds)} size="sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPageShell>
  );
}
