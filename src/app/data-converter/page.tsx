'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

type StorageUnit = 'b' | 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB';

const STORAGE_UNITS: { id: StorageUnit; name: string; type: 'decimal' | 'binary' | 'base'; bytes: number }[] = [
  { id: 'b', name: 'Bits (b)', type: 'base', bytes: 0.125 },
  { id: 'B', name: 'Bytes (B)', type: 'base', bytes: 1 },
  // Decimal Units (1000)
  { id: 'KB', name: 'Kilobytes (kB)', type: 'decimal', bytes: 1000 },
  { id: 'MB', name: 'Megabytes (MB)', type: 'decimal', bytes: 1000 ** 2 },
  { id: 'GB', name: 'Gigabytes (GB)', type: 'decimal', bytes: 1000 ** 3 },
  { id: 'TB', name: 'Terabytes (TB)', type: 'decimal', bytes: 1000 ** 4 },
  { id: 'PB', name: 'Petabytes (PB)', type: 'decimal', bytes: 1000 ** 5 },
  // Binary Units (1024 / IEC)
  { id: 'KiB', name: 'Kibibytes (KiB)', type: 'binary', bytes: 1024 },
  { id: 'MiB', name: 'Mebibytes (MiB)', type: 'binary', bytes: 1024 ** 2 },
  { id: 'GiB', name: 'Gibibytes (GiB)', type: 'binary', bytes: 1024 ** 3 },
  { id: 'TiB', name: 'Tebibytes (TiB)', type: 'binary', bytes: 1024 ** 4 },
  { id: 'PiB', name: 'Pebibytes (PiB)', type: 'binary', bytes: 1024 ** 5 },
];

export default function DataConverterPage() {
  const tool = useMemo(() => getToolBySlug('data-converter')!, []);

  // Storage Converter State
  const [inputVal, setInputVal] = useState<number>(100);
  const [inputUnit, setInputUnit] = useState<StorageUnit>('GB');

  // Download Time Calculator State
  const [downloadFileSize, setDownloadFileSize] = useState<number>(25);
  const [downloadFileUnit, setDownloadFileUnit] = useState<'MB' | 'GB' | 'TB'>('GB');
  const [downloadSpeed, setDownloadSpeed] = useState<number>(100);
  const [downloadSpeedUnit, setDownloadSpeedUnit] = useState<'Mbps' | 'Gbps' | 'MB/s'>('Mbps');

  // Compute all storage conversions from input bytes
  const storageResults = useMemo(() => {
    const unitDef = STORAGE_UNITS.find(u => u.id === inputUnit);
    if (!unitDef || isNaN(inputVal)) return [];

    const totalBytes = inputVal * unitDef.bytes;

    return STORAGE_UNITS.map(u => {
      const converted = totalBytes / u.bytes;
      let formatted: string;
      if (converted >= 1e12 || (converted > 0 && converted < 1e-4)) {
        formatted = converted.toExponential(4);
      } else if (converted >= 1) {
        formatted = converted.toLocaleString(undefined, { maximumFractionDigits: 4 });
      } else {
        formatted = converted.toFixed(6);
      }

      return {
        ...u,
        value: formatted,
        raw: converted,
      };
    });
  }, [inputVal, inputUnit]);

  // Compute transfer time
  const transferTime = useMemo(() => {
    if (downloadFileSize <= 0 || downloadSpeed <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, formatted: '0s', megabytesPerSec: 0 };
    }

    // Convert file size to megabits
    let fileMegabits = 0;
    if (downloadFileUnit === 'MB') fileMegabits = downloadFileSize * 8;
    if (downloadFileUnit === 'GB') fileMegabits = downloadFileSize * 1000 * 8;
    if (downloadFileUnit === 'TB') fileMegabits = downloadFileSize * 1000000 * 8;

    // Convert speed to megabits per second
    let speedMbps = downloadSpeed;
    if (downloadSpeedUnit === 'Gbps') speedMbps = downloadSpeed * 1000;
    if (downloadSpeedUnit === 'MB/s') speedMbps = downloadSpeed * 8;

    const totalSeconds = fileMegabits / speedMbps;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    const megabytesPerSec = +(speedMbps / 8).toFixed(2);

    return {
      hours,
      minutes,
      seconds,
      formatted: parts.join(' '),
      megabytesPerSec,
    };
  }, [downloadFileSize, downloadFileUnit, downloadSpeed, downloadSpeedUnit]);

  const handleReset = () => {
    setInputVal(100);
    setInputUnit('GB');
    setDownloadFileSize(25);
    setDownloadFileUnit('GB');
    setDownloadSpeed(100);
    setDownloadSpeedUnit('Mbps');
  };

  const faqs: FAQItem[] = [
    {
      question: 'What is the difference between MB/s and Mbps?',
      answer:
        'Mbps (Megabits per second, lowercase "b") measures network bandwidth transmission speed, as advertised by ISPs. MB/s (Megabytes per second, capital "B") measures actual file storage write rate. Since 1 Byte = 8 bits, a 100 Mbps internet connection downloads at a theoretical maximum speed of 12.5 MB/s.',
    },
    {
      question: 'Why is 1 GB different in Decimal vs Binary?',
      answer:
        'Decimal prefixes (SI standard: 1 kB = 1,000 Bytes, 1 GB = 1,000,000,000 Bytes) are used by hard drive manufacturers and network specs. Binary prefixes (IEC standard: 1 KiB = 1,024 Bytes, 1 GiB = 1,073,741,824 Bytes) are used by operating systems like Windows to calculate RAM and disk partition capacity.',
    },
    {
      question: 'Why does my real download speed fluctuate?',
      answer:
        'Real-world file downloads include TCP/IP packet header overhead (typically 5-10%), Wi-Fi signal interference, server throttle caps, and storage drive write speeds.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Digital Storage &amp; Network Bandwidth Transfer Calculator
          </h2>
          <p>
            Convert data storage units accurately across decimal (kB, MB, GB, TB) and binary (KiB, MiB, GiB, TiB) systems, and estimate real-world download/upload transfer durations.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>💾 Decimal vs Binary</h3>
              <p className="text-[11px]">Compare base-10 (1000) drive manufacturer specs with base-2 (1024) OS capacity.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ Mbps vs MB/s Speed</h3>
              <p className="text-[11px]">Demystify internet speed testing metrics with 8-bit byte conversions.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⏱️ Download Time Estimator</h3>
              <p className="text-[11px]">Calculate precise ETA for large games, backups, and video uploads.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-8">
        {/* Storage Size Unit Converter Section */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Data Storage Size Converter
            </h2>
            <ResetButton onClick={handleReset} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="storage-val" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Input Value
              </label>
              <input
                id="storage-val"
                type="number"
                min="0"
                value={inputVal}
                onChange={(e) => setInputVal(Number(e.target.value))}
                className="w-full p-3 rounded-xl text-base font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="storage-unit" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Source Unit
              </label>
              <select
                id="storage-unit"
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value as StorageUnit)}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <optgroup label="Decimal Units (Base 10 / 1000)">
                  <option value="KB">Kilobytes (kB)</option>
                  <option value="MB">Megabytes (MB)</option>
                  <option value="GB">Gigabytes (GB)</option>
                  <option value="TB">Terabytes (TB)</option>
                  <option value="PB">Petabytes (PB)</option>
                </optgroup>
                <optgroup label="Binary Units (Base 2 / 1024)">
                  <option value="KiB">Kibibytes (KiB)</option>
                  <option value="MiB">Mebibytes (MiB)</option>
                  <option value="GiB">Gibibytes (GiB)</option>
                  <option value="TiB">Tebibytes (TiB)</option>
                  <option value="PiB">Pebibytes (PiB)</option>
                </optgroup>
                <optgroup label="Base Units">
                  <option value="B">Bytes (B)</option>
                  <option value="b">Bits (b)</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Results Grid: Decimal vs Binary */}
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            {/* Decimal Box */}
            <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Decimal Storage (SI / Base 1000)
              </span>
              <div className="flex flex-col gap-1.5 divide-y divide-[var(--border-c)] text-xs">
                {storageResults.filter(r => r.type === 'decimal' || r.id === 'B').map(r => (
                  <div key={r.id} className="pt-1.5 flex items-center justify-between">
                    <span className="font-semibold" style={{ color: 'var(--muted)' }}>{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold select-all" style={{ color: 'var(--text)' }}>{r.value}</span>
                      <CopyButton textToCopy={r.value} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Binary Box */}
            <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                Binary Storage (IEC / Base 1024)
              </span>
              <div className="flex flex-col gap-1.5 divide-y divide-[var(--border-c)] text-xs">
                {storageResults.filter(r => r.type === 'binary' || r.id === 'b').map(r => (
                  <div key={r.id} className="pt-1.5 flex items-center justify-between">
                    <span className="font-semibold" style={{ color: 'var(--muted)' }}>{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold select-all" style={{ color: 'var(--text)' }}>{r.value}</span>
                      <CopyButton textToCopy={r.value} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Download Time Calculator Section */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Download &amp; Transfer Time Estimator
            </h2>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Estimate how long it will take to download or upload a file given your network speed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* File Size */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="file-size-val" className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                File Size
              </label>
              <input
                id="file-size-val"
                type="number"
                min="1"
                value={downloadFileSize}
                onChange={(e) => setDownloadFileSize(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            {/* File Unit */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="file-unit-select" className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                Size Unit
              </label>
              <select
                id="file-unit-select"
                value={downloadFileUnit}
                onChange={(e) => setDownloadFileUnit(e.target.value as 'MB' | 'GB' | 'TB')}
                className="w-full p-2.5 rounded-xl text-sm font-semibold focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="MB">Megabytes (MB)</option>
                <option value="GB">Gigabytes (GB)</option>
                <option value="TB">Terabytes (TB)</option>
              </select>
            </div>

            {/* Speed */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="speed-val" className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                Internet Speed
              </label>
              <input
                id="speed-val"
                type="number"
                min="1"
                value={downloadSpeed}
                onChange={(e) => setDownloadSpeed(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl text-sm font-bold font-mono focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            {/* Speed Unit */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="speed-unit-select" className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                Speed Unit
              </label>
              <select
                id="speed-unit-select"
                value={downloadSpeedUnit}
                onChange={(e) => setDownloadSpeedUnit(e.target.value as 'Mbps' | 'Gbps' | 'MB/s')}
                className="w-full p-2.5 rounded-xl text-sm font-semibold focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="Mbps">Mbps (Megabits/sec - ISP Standard)</option>
                <option value="MB/s">MB/s (Megabytes/sec - File Rate)</option>
                <option value="Gbps">Gbps (Gigabits/sec - Fiber)</option>
              </select>
            </div>
          </div>

          {/* Time Result Banner */}
          <div
            className="p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex flex-col">
              <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
                Estimated Transfer Time (at ~{transferTime.megabytesPerSec} MB/s)
              </span>
              <span className="text-3xl font-black font-mono" style={{ color: 'var(--accent)' }}>
                {transferTime.formatted}
              </span>
            </div>
            <CopyButton textToCopy={transferTime.formatted} size="sm" label="Copy ETA" />
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
