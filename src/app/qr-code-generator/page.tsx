'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

type QrType = 'url' | 'text' | 'wifi' | 'vcard';

export default function QrCodeGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('qr-code-generator')!, []);

  const [qrType, setQrType] = useState<QrType>('url');

  // Input states
  const [urlInput, setUrlInput] = useState<string>('https://veylo.app');
  const [textInput, setTextInput] = useState<string>('Welcome to VEYLO Free Tools for Everything');

  // WiFi states
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState<boolean>(false);

  // vCard states
  const [vcardName, setVcardName] = useState<string>('John Doe');
  const [vcardPhone, setVcardPhone] = useState<string>('+1 (555) 019-2834');
  const [vcardEmail, setVcardEmail] = useState<string>('john@example.com');
  const [vcardOrg, setVcardOrg] = useState<string>('VEYLO');

  // Style states
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [size, setSize] = useState<number>(320);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgDataUrl, setSvgDataUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Construct standard payload
  const payload = useMemo(() => {
    switch (qrType) {
      case 'url':
        return urlInput.trim();
      case 'text':
        return textInput.trim();
      case 'wifi': {
        const ssidEscaped = wifiSsid.replace(/([\\;,:"])/g, '\\$1');
        const passEscaped = wifiPassword.replace(/([\\;,:"])/g, '\\$1');
        return `WIFI:T:${wifiEncryption};S:${ssidEscaped};P:${passEscaped};H:${wifiHidden ? 'true' : 'false'};;`;
      }
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nFN:${vcardName}\nORG:${vcardOrg}\nTEL;TYPE=CELL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      default:
        return '';
    }
  }, [qrType, urlInput, textInput, wifiSsid, wifiPassword, wifiEncryption, wifiHidden, vcardName, vcardPhone, vcardEmail, vcardOrg]);

  // Render QR Code onto Canvas and generate SVG
  const renderQr = useCallback(async () => {
    if (!payload) {
      setError('Please enter content to encode in the QR code.');
      return;
    }
    setError(null);

    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, payload, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: errorCorrection,
        });
      }

      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      setSvgDataUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate QR code';
      setError(message);
    }
  }, [payload, size, fgColor, bgColor, errorCorrection]);

  useEffect(() => {
    renderQr();
  }, [renderQr]);

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const pngUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `veylo-qr-${Date.now()}.png`;
    a.click();
  };

  const handleDownloadSvg = () => {
    if (!svgDataUrl) return;
    const a = document.createElement('a');
    a.href = svgDataUrl;
    a.download = `veylo-qr-${Date.now()}.svg`;
    a.click();
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }, 'image/png');
    } catch {
      // Clipboard item image write might be restricted in some browsers
      setError('Browser does not support direct image clipboard copy. Use Download PNG instead.');
    }
  };

  const handleReset = () => {
    setUrlInput('https://veylo.app');
    setTextInput('');
    setWifiSsid('');
    setWifiPassword('');
    setWifiEncryption('WPA');
    setWifiHidden(false);
    setVcardName('');
    setVcardPhone('');
    setVcardEmail('');
    setVcardOrg('');
    setFgColor('#000000');
    setBgColor('#ffffff');
    setErrorCorrection('M');
    setSize(320);
  };

  const faqs: FAQItem[] = [
    {
      question: 'How do Wi-Fi QR codes work?',
      answer:
        'When scanned by an iOS Camera app or Android Google Lens, the device reads the embedded standard protocol (WIFI:T:WPA;S:SSID;P:PASSWORD;;) and prompts the user to connect automatically without typing the password.',
    },
    {
      question: 'What is the best error correction level?',
      answer:
        'Level M (15% redundancy) is the recommended balance for standard screen and printed codes. Level H (30% redundancy) is ideal if you plan on placing a central logo or printing on textured physical materials.',
    },
    {
      question: 'Are my QR codes saved or tracked by VEYLO?',
      answer:
        'No. Every QR code matrix is generated entirely client-side using JavaScript in your browser tab. No Wi-Fi passwords, contact cards, or links are ever sent to a server.',
    },
    {
      question: 'Should I download PNG or SVG?',
      answer:
        'Use PNG for digital sharing, websites, and presentations. Use SVG (Scalable Vector Graphics) for high-resolution commercial printing, banners, business cards, and billboards as it scales infinitely without pixelation.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            High-Resolution Client-Side QR Code Generator
          </h2>
          <p>
            Create clean, scannable QR codes for marketing campaigns, restaurant menus, Wi-Fi logins, and business cards with complete client-side security.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📶 Wi-Fi &amp; vCard Support</h3>
              <p className="text-[11px]">Instant network connections and address book contact imports.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📐 Vector SVG &amp; PNG</h3>
              <p className="text-[11px]">Export sharp vector SVGs for print design and lossless PNGs for digital media.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔒 100% Client-Side Privacy</h3>
              <p className="text-[11px]">Zero server API calls. Passwords and contact details remain strictly private.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Settings */}
        <div
          className="lg:col-span-7 p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* QR Type Selector Tabs */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              QR Code Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setQrType('url')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  qrType === 'url' ? 'shadow-sm' : 'opacity-75 hover:opacity-100'
                }`}
                style={{
                  background: qrType === 'url' ? 'var(--accent)' : 'var(--surface-2)',
                  color: qrType === 'url' ? '#ffffff' : 'var(--text)',
                  border: qrType === 'url' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                🔗 Website URL
              </button>

              <button
                type="button"
                onClick={() => setQrType('text')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  qrType === 'text' ? 'shadow-sm' : 'opacity-75 hover:opacity-100'
                }`}
                style={{
                  background: qrType === 'text' ? 'var(--accent)' : 'var(--surface-2)',
                  color: qrType === 'text' ? '#ffffff' : 'var(--text)',
                  border: qrType === 'text' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                📝 Plain Text
              </button>

              <button
                type="button"
                onClick={() => setQrType('wifi')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  qrType === 'wifi' ? 'shadow-sm' : 'opacity-75 hover:opacity-100'
                }`}
                style={{
                  background: qrType === 'wifi' ? 'var(--accent)' : 'var(--surface-2)',
                  color: qrType === 'wifi' ? '#ffffff' : 'var(--text)',
                  border: qrType === 'wifi' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                📶 Wi-Fi Network
              </button>

              <button
                type="button"
                onClick={() => setQrType('vcard')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  qrType === 'vcard' ? 'shadow-sm' : 'opacity-75 hover:opacity-100'
                }`}
                style={{
                  background: qrType === 'vcard' ? 'var(--accent)' : 'var(--surface-2)',
                  color: qrType === 'vcard' ? '#ffffff' : 'var(--text)',
                  border: qrType === 'vcard' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                👤 Contact Card
              </button>
            </div>
          </div>

          {/* Dynamic Content Inputs */}
          {qrType === 'url' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="url-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Target URL
              </label>
              <input
                id="url-input"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          )}

          {qrType === 'text' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="text-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Text Message / Content
              </label>
              <textarea
                id="text-input"
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text or note to encode..."
                className="w-full p-3 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="wifi-ssid" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  Network Name (SSID)
                </label>
                <input
                  id="wifi-ssid"
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="MyHomeNetwork"
                  className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="wifi-pass" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                    Password
                  </label>
                  <input
                    id="wifi-pass"
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Wireless password"
                    className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="wifi-enc" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                    Encryption Type
                  </label>
                  <select
                    id="wifi-enc"
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                    className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none"
                    style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                  >
                    <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                    <option value="WEP">WEP (Legacy)</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none pt-1" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={wifiHidden}
                  onChange={(e) => setWifiHidden(e.target.checked)}
                  className="rounded text-[var(--accent)]"
                />
                <span>Hidden Network SSID</span>
              </label>
            </div>
          )}

          {qrType === 'vcard' && (
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="vcard-name" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  Full Name
                </label>
                <input
                  id="vcard-name"
                  type="text"
                  value={vcardName}
                  onChange={(e) => setVcardName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="vcard-phone" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  Phone Number
                </label>
                <input
                  id="vcard-phone"
                  type="tel"
                  value={vcardPhone}
                  onChange={(e) => setVcardPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="vcard-email" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  Email Address
                </label>
                <input
                  id="vcard-email"
                  type="email"
                  value={vcardEmail}
                  onChange={(e) => setVcardEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="vcard-org" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  Organization / Title
                </label>
                <input
                  id="vcard-org"
                  type="text"
                  value={vcardOrg}
                  onChange={(e) => setVcardOrg(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>
            </div>
          )}

          {/* Styling & Color Controls */}
          <div className="flex flex-col gap-4 pt-4" style={{ borderTop: '1px solid var(--border-c)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Custom Appearance
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Foreground Color */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fg-color" className="text-[11px] font-semibold" style={{ color: 'var(--muted)' }}>
                  Foreground
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="fg-color"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--text)' }}>{fgColor}</span>
                </div>
              </div>

              {/* Background Color */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bg-color" className="text-[11px] font-semibold" style={{ color: 'var(--muted)' }}>
                  Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="bg-color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--text)' }}>{bgColor}</span>
                </div>
              </div>

              {/* Error Correction */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ec-level" className="text-[11px] font-semibold" style={{ color: 'var(--muted)' }}>
                  Error Correction
                </label>
                <select
                  id="ec-level"
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="p-1.5 rounded-lg text-xs font-semibold focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                >
                  <option value="L">L (7%)</option>
                  <option value="M">M (15%)</option>
                  <option value="Q">Q (25%)</option>
                  <option value="H">H (30%)</option>
                </select>
              </div>

              {/* Size Resolution */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="qr-size" className="text-[11px] font-semibold" style={{ color: 'var(--muted)' }}>
                  Size: {size}px
                </label>
                <input
                  id="qr-size"
                  type="range"
                  min="200"
                  max="800"
                  step="40"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer accent-[var(--accent)] mt-2"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <ResetButton onClick={handleReset} />
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.25)' }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Live QR Preview & Downloads */}
        <div
          className="lg:col-span-5 p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-between gap-6 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Live QR Code Preview
          </span>

          <div
            className="p-4 rounded-2xl flex items-center justify-center shadow-md transition-transform active:scale-98 max-w-full overflow-hidden"
            style={{ background: bgColor, border: '1px solid var(--border-c)' }}
          >
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
          </div>

          <div className="w-full flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="py-3 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 shadow flex items-center justify-center gap-2"
                style={{ background: 'var(--accent)', color: '#ffffff' }}
              >
                <span>💾</span>
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                className="py-3 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                <span>📐</span>
                <span>Download SVG</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyImage}
              className="w-full py-2.5 rounded-xl font-semibold text-xs transition-all hover:border-[var(--accent)] flex items-center justify-center gap-2"
              style={{
                background: copySuccess ? 'var(--green, #10b981)' : 'var(--surface-2)',
                border: '1px solid var(--border-c)',
                color: copySuccess ? '#fff' : 'var(--text)',
              }}
            >
              <span>{copySuccess ? '✓' : '📋'}</span>
              <span>{copySuccess ? 'Image Copied to Clipboard' : 'Copy Image to Clipboard'}</span>
            </button>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
