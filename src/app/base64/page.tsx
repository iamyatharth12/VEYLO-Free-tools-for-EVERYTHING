'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

// UTF-8 Safe Base64 Helpers
function utf8ToBase64(str: string, urlSafe = false): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  let base64 = btoa(binary);
  if (urlSafe) {
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return base64;
}

function base64ToUtf8(base64: string): string {
  let normalized = base64.trim().replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' if missing
  while (normalized.length % 4 !== 0) {
    normalized += '=';
  }
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export default function Base64Page() {
  const tool = useMemo(() => getToolBySlug('base64')!, []);

  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState<boolean>(false);

  const [inputText, setInputText] = useState<string>('Hello VEYLO! 🚀 100% Free Tools for Everything.');
  const [outputText, setOutputText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // File states
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process text conversion
  const convertText = useCallback(() => {
    if (!inputText) {
      setOutputText('');
      setError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        const res = utf8ToBase64(inputText, urlSafe);
        setOutputText(res);
        setError(null);
      } else {
        const res = base64ToUtf8(inputText);
        setOutputText(res);
        setError(null);
      }
    } catch (err: unknown) {
      setOutputText('');
      setError(err instanceof Error ? err.message : 'Invalid Base64 string.');
    }
  }, [inputText, mode, urlSafe]);

  useEffect(() => {
    convertText();
  }, [convertText]);

  const handleSwap = () => {
    if (outputText) {
      setInputText(outputText);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setError(null);
    setFile(null);
    setFileBase64('');
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      // 10MB limit warning
      if (selected.size > 10 * 1024 * 1024) {
        setError('File exceeds 10MB client-side limit.');
        return;
      }
      setFile(selected);
      setError(null);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFileBase64(reader.result);
          if (selected.type.startsWith('image/')) {
            setFilePreview(reader.result);
          } else {
            setFilePreview(null);
          }
        }
      };
      reader.readAsDataURL(selected);
    }
  };

  const faqs: FAQItem[] = [
    {
      question: 'Why do standard atob() and btoa() fail on emojis or UTF-8?',
      answer:
        'Browser-native btoa() only supports ASCII (Latin-1) strings. VEYLO uses the modern TextEncoder and TextDecoder APIs to properly convert UTF-8 byte streams, ensuring emojis, symbols, and international alphabets encode and decode flawlessly.',
    },
    {
      question: 'What is URL-Safe Base64?',
      answer:
        'Standard Base64 contains "+" and "/" characters as well as "=" padding, which have reserved meanings in URL parameters. URL-Safe Base64 replaces "+" with "-" and "/" with "_", and strips trailing "=" padding.',
    },
    {
      question: 'Are my files uploaded when converting to Data URLs?',
      answer:
        'No. Files are read directly in your browser using the HTML5 FileReader API. No data leaves your machine.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Client-Side UTF-8 Base64 Encoder &amp; Decoder
          </h2>
          <p>
            Convert strings, raw binary tokens, images, and documents into Base64 format with full Unicode and URL-Safe compatibility.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🌐 Full UTF-8 &amp; Emojis</h3>
              <p className="text-[11px]">Lossless encoding for international alphabets, emojis, and special symbols.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔗 URL-Safe RFC 4648</h3>
              <p className="text-[11px]">Generate web-safe tokens ready for URL parameters and HTTP headers.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🖼️ File Data URI Generator</h3>
              <p className="text-[11px]">Convert local images and files to base64 Data URLs with live preview.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Top Control Navigation */}
        <div
          className="p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Main Mode Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'text' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                background: activeTab === 'text' ? 'var(--accent)' : 'var(--surface-2)',
                color: activeTab === 'text' ? '#ffffff' : 'var(--text)',
                border: activeTab === 'text' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              📝 Text Converter
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'file' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                background: activeTab === 'file' ? 'var(--accent)' : 'var(--surface-2)',
                color: activeTab === 'file' ? '#ffffff' : 'var(--text)',
                border: activeTab === 'file' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              📁 File to Base64
            </button>
          </div>

          {activeTab === 'text' && (
            <div className="flex items-center gap-4 text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={urlSafe}
                  onChange={(e) => setUrlSafe(e.target.checked)}
                  className="rounded text-[var(--accent)]"
                />
                <span>URL-Safe (- / _ No =)</span>
              </label>

              <button
                type="button"
                onClick={handleSwap}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:border-[var(--accent)] flex items-center gap-1.5"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                <span>⇄</span>
                <span>Swap ({mode === 'encode' ? 'Encode ➔ Decode' : 'Decode ➔ Encode'})</span>
              </button>
            </div>
          )}
        </div>

        {/* Text Mode Grid */}
        {activeTab === 'text' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <div
              className="p-6 rounded-2xl flex flex-col gap-3"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex items-center justify-between">
                <label htmlFor="b64-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{inputText.length} chars</span>
                  <ResetButton onClick={() => setInputText('')} label="Clear" />
                </div>
              </div>

              <textarea
                id="b64-input"
                rows={12}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Paste Base64 string to decode...'}
                className="w-full p-4 rounded-xl text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: error ? '1px solid #ef4444' : '1px solid var(--border-c)' }}
              />

              {error && (
                <div
                  className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)' }}
                >
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Output Card */}
            <div
              className="p-6 rounded-2xl flex flex-col gap-3"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  {mode === 'encode' ? 'Base64 Result' : 'Decoded Text Result'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{outputText.length} chars</span>
                  <CopyButton textToCopy={outputText} size="sm" label="Copy Result" />
                </div>
              </div>

              <textarea
                rows={12}
                readOnly
                value={outputText}
                placeholder="Conversion output appears here..."
                className="w-full p-4 rounded-xl text-xs sm:text-sm font-mono leading-relaxed focus:outline-none resize-y select-all"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          </div>
        )}

        {/* File Mode */}
        {activeTab === 'file' && (
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div
              className="p-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer text-center transition-colors"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border-c)' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-4xl" aria-hidden="true">📁</span>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                  {file ? file.name : 'Click to choose a file or drag and drop here'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  {file
                    ? `Type: ${file.type || 'Unknown'} · Size: ${(file.size / 1024).toFixed(1)} KB`
                    : 'Supports images, documents, and files up to 10MB'}
                </p>
              </div>
            </div>

            {fileBase64 && (
              <div className="flex flex-col gap-4">
                {filePreview && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      Image Preview
                    </span>
                    <div className="p-4 rounded-xl flex items-center justify-center max-w-sm" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={filePreview} alt="Base64 Preview" className="max-h-48 rounded object-contain" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                      Base64 Data URI ({fileBase64.length.toLocaleString()} characters)
                    </span>
                    <CopyButton textToCopy={fileBase64} label="Copy Data URI" size="sm" />
                  </div>
                  <textarea
                    rows={6}
                    readOnly
                    value={fileBase64}
                    className="w-full p-4 rounded-xl text-xs font-mono select-all leading-relaxed focus:outline-none"
                    style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <ResetButton onClick={handleReset} />
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
