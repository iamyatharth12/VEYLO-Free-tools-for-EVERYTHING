'use client';

import { useState, useMemo, useEffect } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

interface ParsedUA {
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot / Crawler' | 'Unknown';
  engine: string;
  architecture: string;
}

const SAMPLE_UAS = [
  { label: 'Chrome / Windows 11', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
  { label: 'Safari / iPhone 15', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1' },
  { label: 'Firefox / macOS', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.3; rv:122.0) Gecko/20100101 Firefox/122.0' },
  { label: 'Edge / Windows', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.2365.66' },
  { label: 'Googlebot Crawler', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
];

function parseUserAgent(ua: string): ParsedUA {
  if (!ua.trim()) {
    return {
      browserName: 'Unknown',
      browserVersion: 'Unknown',
      osName: 'Unknown',
      osVersion: 'Unknown',
      deviceType: 'Unknown',
      engine: 'Unknown',
      architecture: 'Unknown',
    };
  }

  let browserName = 'Unknown Browser';
  let browserVersion = 'Unknown';
  let osName = 'Unknown OS';
  let osVersion = '';
  let deviceType: ParsedUA['deviceType'] = 'Desktop';
  let engine = 'Unknown Engine';
  let architecture = 'Unknown';

  // 1. Check for Bots
  if (/bot|crawler|spider|crawling|slurp|duckduckbot|baiduspider|yandexbot/i.test(ua)) {
    deviceType = 'Bot / Crawler';
    browserName = 'Web Crawler / Search Engine Bot';
    if (/googlebot/i.test(ua)) browserName = 'Googlebot';
    if (/bingbot/i.test(ua)) browserName = 'Bingbot';
  }

  // 2. Device & OS Detection
  if (/iPad|Tablet/i.test(ua)) {
    deviceType = 'Tablet';
    osName = 'iPadOS / Tablet';
  } else if (/iPhone/i.test(ua)) {
    deviceType = 'Mobile';
    osName = 'iOS (iPhone)';
    const match = ua.match(/OS (\d+[_\d]*)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
  } else if (/Android/i.test(ua)) {
    deviceType = /Mobile/i.test(ua) ? 'Mobile' : 'Tablet';
    osName = 'Android';
    const match = ua.match(/Android (\d+(\.\d+)*)/);
    if (match) osVersion = match[1];
  } else if (/Windows NT 10\.0/i.test(ua)) {
    osName = 'Windows';
    osVersion = '10 / 11';
    deviceType = 'Desktop';
  } else if (/Windows NT 6\.3/i.test(ua)) {
    osName = 'Windows';
    osVersion = '8.1';
  } else if (/Windows NT 6\.1/i.test(ua)) {
    osName = 'Windows';
    osVersion = '7';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    osName = 'macOS';
    const match = ua.match(/Mac OS X (\d+[_\d]*)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
    deviceType = 'Desktop';
  } else if (/CrOS/i.test(ua)) {
    osName = 'ChromeOS';
    deviceType = 'Desktop';
  } else if (/Ubuntu/i.test(ua)) {
    osName = 'Ubuntu Linux';
    deviceType = 'Desktop';
  } else if (/Linux/i.test(ua)) {
    osName = 'Linux';
    deviceType = 'Desktop';
  }

  // 3. Architecture
  if (/x86_64|Win64|x64|WOW64|amd64/i.test(ua)) {
    architecture = '64-bit (x86_64)';
  } else if (/ARM64|aarch64/i.test(ua)) {
    architecture = 'ARM64';
  } else if (/i686|i386|Win32/i.test(ua)) {
    architecture = '32-bit (x86)';
  } else if (osName === 'macOS') {
    architecture = 'Intel / Apple Silicon (ARM)';
  }

  // 4. Browser & Engine Detection
  if (/Edg\/(\d+(\.\d+)*)/i.test(ua)) {
    browserName = 'Microsoft Edge';
    browserVersion = ua.match(/Edg\/(\d+(\.\d+)*)/i)?.[1] || '';
    engine = 'Blink';
  } else if (/OPR\/(\d+(\.\d+)*)/i.test(ua) || /Opera/i.test(ua)) {
    browserName = 'Opera';
    browserVersion = ua.match(/OPR\/(\d+(\.\d+)*)/i)?.[1] || '';
    engine = 'Blink';
  } else if (/SamsungBrowser\/(\d+(\.\d+)*)/i.test(ua)) {
    browserName = 'Samsung Internet';
    browserVersion = ua.match(/SamsungBrowser\/(\d+(\.\d+)*)/i)?.[1] || '';
    engine = 'Blink';
  } else if (/Firefox\/(\d+(\.\d+)*)/i.test(ua)) {
    browserName = 'Mozilla Firefox';
    browserVersion = ua.match(/Firefox\/(\d+(\.\d+)*)/i)?.[1] || '';
    engine = 'Gecko';
  } else if (/Chrome\/(\d+(\.\d+)*)/i.test(ua)) {
    browserName = 'Google Chrome';
    browserVersion = ua.match(/Chrome\/(\d+(\.\d+)*)/i)?.[1] || '';
    engine = 'Blink';
  } else if (/Version\/(\d+(\.\d+)*).*Safari/i.test(ua)) {
    browserName = 'Apple Safari';
    browserVersion = ua.match(/Version\/(\d+(\.\d+)*)/i)?.[1] || '';
    engine = 'WebKit';
  } else if (/Trident.*rv:(\d+(\.\d+)*)/i.test(ua)) {
    browserName = 'Internet Explorer';
    browserVersion = ua.match(/rv:(\d+(\.\d+)*)/i)?.[1] || '';
    engine = 'Trident';
  }

  return {
    browserName,
    browserVersion,
    osName,
    osVersion,
    deviceType,
    engine,
    architecture,
  };
}

export default function UserAgentParserPage() {
  const tool = useMemo(() => getToolBySlug('tools/user-agent-parser')!, []);

  const [uaString, setUaString] = useState<string>('');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUaString(navigator.userAgent);
    }
  }, []);

  const parsed = useMemo(() => {
    return parseUserAgent(uaString);
  }, [uaString]);

  const handleUseCurrentUa = () => {
    if (typeof navigator !== 'undefined') {
      setUaString(navigator.userAgent);
    }
  };

  const handleReset = () => {
    setUaString('');
  };

  const summaryJson = useMemo(() => {
    return JSON.stringify(parsed, null, 2);
  }, [parsed]);

  const faqs: FAQItem[] = [
    {
      question: 'What is a User-Agent string?',
      answer:
        'A User-Agent is a HTTP request header string sent by your web browser that informs web servers about your browser application, its rendering engine, version number, and host operating system.',
    },
    {
      question: 'Why do modern User-Agent strings mention Safari, Mozilla, and AppleWebKit all together?',
      answer:
        'For historical compatibility. Early web servers served advanced CSS/JS only to browsers identifying as "Mozilla" or "WebKit". Chrome, Edge, and Safari include legacy tokens so legacy websites continue to function properly.',
    },
    {
      question: 'Is User-Agent parsing 100% accurate?',
      answer:
        'User-Agent detection is heuristic. Modern browsers increasingly freeze UA versions (Client Hints) to protect user privacy against fingerprinting. This tool provides accurate structural analysis based on standard RFC patterns.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Client-Side User-Agent String Analyzer &amp; Browser Diagnostics
          </h2>
          <p>
            Parse, inspect, and extract detailed client diagnostic information including browser engine, OS version, device classification, and CPU architecture from any HTTP User-Agent string.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔍 1-Click Current UA Check</h3>
              <p className="text-[11px]">Automatically reads your current browser user agent string on load.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📱 Multi-Device Detection</h3>
              <p className="text-[11px]">Classifies traffic between Desktop, Mobile Phone, Tablet, and Web Crawler bots.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📋 JSON Export</h3>
              <p className="text-[11px]">1-click copy parsed diagnostics object directly as structured JSON.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Input Bar */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 shadow-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="ua-input-field" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Enter Browser User-Agent (UA) String
            </label>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleUseCurrentUa}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--accent)' }}
              >
                Detect My Browser
              </button>
              <ResetButton onClick={handleReset} label="Clear" />
            </div>
          </div>

          <textarea
            id="ua-input-field"
            rows={3}
            value={uaString}
            onChange={(e) => setUaString(e.target.value)}
            placeholder="Paste any User-Agent string..."
            className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
            style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
          />

          {/* Sample Presets */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--muted)' }}>Presets:</span>
            {SAMPLE_UAS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setUaString(s.ua)}
                className="px-2 py-0.5 rounded-lg text-[11px] font-semibold hover:border-[var(--accent)] cursor-pointer"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Parsed Diagnostic Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Browser Name & Version */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-2 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              Web Browser
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black" style={{ color: 'var(--text)' }}>
                {parsed.browserName}
              </span>
              <span className="text-xs font-mono text-[var(--muted)]">
                Version: {parsed.browserVersion || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Operating System */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-2 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
              Operating System
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black" style={{ color: 'var(--text)' }}>
                {parsed.osName} {parsed.osVersion}
              </span>
              <span className="text-xs font-mono text-[var(--muted)]">
                Platform: {parsed.architecture}
              </span>
            </div>
          </div>

          {/* Device Classification */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-2 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>
              Device Type
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black" style={{ color: 'var(--text)' }}>
                {parsed.deviceType}
              </span>
              <span className="text-xs font-mono text-[var(--muted)]">
                Engine: {parsed.engine}
              </span>
            </div>
          </div>

          {/* Rendering Engine */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-2 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              Rendering Engine
            </span>
            <span className="text-base font-bold font-mono" style={{ color: 'var(--text)' }}>
              {parsed.engine}
            </span>
          </div>

          {/* CPU Architecture */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-2 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
              CPU Architecture
            </span>
            <span className="text-base font-bold font-mono" style={{ color: 'var(--text)' }}>
              {parsed.architecture}
            </span>
          </div>

          {/* Quick Copy JSON */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-2 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Diagnostic Output
            </span>
            <div className="flex items-center gap-2">
              <CopyButton textToCopy={summaryJson} size="sm" label="Copy Parsed JSON" />
            </div>
          </div>
        </div>

        {/* Raw JSON View */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-3 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Structured Diagnostics JSON
            </h3>
            <CopyButton textToCopy={summaryJson} size="sm" />
          </div>

          <pre
            className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto select-all"
            style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
          >
            {summaryJson}
          </pre>
        </div>
      </div>
    </ToolPageShell>
  );
}
