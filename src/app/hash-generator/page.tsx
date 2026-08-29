'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

// RFC 1321 MD5 implementation in pure JavaScript
function md5(input: Uint8Array): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  // Convert Uint8Array to 32-bit words
  const length = input.length;
  const nWords = (((length + 8) >> 6) + 1) * 16;
  const x = new Int32Array(nWords);

  for (let i = 0; i < length; i++) {
    x[i >> 2] |= input[i] << ((i % 4) * 8);
  }
  x[length >> 2] |= 0x80 << ((length % 4) * 8);
  x[nWords - 2] = length * 8;

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < nWords; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;

    a = md5ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safeAdd(a, olda);
    d = safeAdd(d, oldd);
    c = safeAdd(c, oldc);
    b = safeAdd(b, oldb);
  }

  const hexChars = '0123456789abcdef';
  let result = '';
  for (const val of [a, b, c, d]) {
    for (let j = 0; j < 4; j++) {
      const byte = (val >> (j * 8)) & 0xff;
      result += hexChars.charAt((byte >> 4) & 0x0f) + hexChars.charAt(byte & 0x0f);
    }
  }
  return result;
}

export default function HashGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('hash-generator')!, []);

  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState<string>('The quick brown fox jumps over the lazy dog');
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<Uint8Array | null>(null);

  const [useHmac, setUseHmac] = useState<boolean>(false);
  const [hmacKey, setHmacKey] = useState<string>('secret-key');
  const [uppercase, setUppercase] = useState<boolean>(false);

  const [hashes, setHashes] = useState<{
    sha256: string;
    sha512: string;
    sha384: string;
    md5: string;
    hmacSha256?: string;
  }>({
    sha256: '',
    sha512: '',
    sha384: '',
    md5: '',
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buffer conversion to Hex
  const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Compute all hashes
  const computeHashes = useCallback(async () => {
    setIsProcessing(true);
    try {
      let dataBytes: Uint8Array;
      if (inputMode === 'file' && fileBuffer) {
        dataBytes = fileBuffer;
      } else {
        dataBytes = new TextEncoder().encode(textInput);
      }

      // SHA-256
      const sha256Buf = await window.crypto.subtle.digest('SHA-256', dataBytes.buffer as ArrayBuffer);
      const sha256Hex = bufferToHex(sha256Buf);

      // SHA-512
      const sha512Buf = await window.crypto.subtle.digest('SHA-512', dataBytes.buffer as ArrayBuffer);
      const sha512Hex = bufferToHex(sha512Buf);

      // SHA-384
      const sha384Buf = await window.crypto.subtle.digest('SHA-384', dataBytes.buffer as ArrayBuffer);
      const sha384Hex = bufferToHex(sha384Buf);

      // MD5
      const md5Hex = md5(dataBytes);

      // HMAC if enabled
      let hmacSha256Hex = '';
      if (useHmac && hmacKey) {
        const keyBytes = new TextEncoder().encode(hmacKey);
        const cryptoKey = await window.crypto.subtle.importKey(
          'raw',
          keyBytes,
          { name: 'HMAC', hash: { name: 'SHA-256' } },
          false,
          ['sign']
        );
        const hmacBuf = await window.crypto.subtle.sign('HMAC', cryptoKey, dataBytes.buffer as ArrayBuffer);
        hmacSha256Hex = bufferToHex(hmacBuf);
      }

      setHashes({
        sha256: uppercase ? sha256Hex.toUpperCase() : sha256Hex.toLowerCase(),
        sha512: uppercase ? sha512Hex.toUpperCase() : sha512Hex.toLowerCase(),
        sha384: uppercase ? sha384Hex.toUpperCase() : sha384Hex.toLowerCase(),
        md5: uppercase ? md5Hex.toUpperCase() : md5Hex.toLowerCase(),
        hmacSha256: hmacSha256Hex ? (uppercase ? hmacSha256Hex.toUpperCase() : hmacSha256Hex.toLowerCase()) : undefined,
      });
    } catch {
      // In case subtle crypto throws on empty or unusual array
    } finally {
      setIsProcessing(false);
    }
  }, [inputMode, textInput, fileBuffer, useHmac, hmacKey, uppercase]);

  useEffect(() => {
    computeHashes();
  }, [computeHashes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          setFileBuffer(new Uint8Array(reader.result));
        }
      };
      reader.readAsArrayBuffer(selected);
    }
  };

  const handleReset = () => {
    setTextInput('The quick brown fox jumps over the lazy dog');
    setFile(null);
    setFileBuffer(null);
    setUseHmac(false);
    setHmacKey('secret-key');
    setUppercase(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const faqs: FAQItem[] = [
    {
      question: 'Is MD5 safe to use for password security?',
      answer:
        'No. MD5 has known practical cryptographic collision vulnerabilities and should NEVER be used for passwords or security credentials. It is included here solely for verifying legacy checksums or file integrity comparisons.',
    },
    {
      question: 'What is HMAC and how does it work?',
      answer:
        'HMAC (Hash-based Message Authentication Code) combines a cryptographic hash algorithm (like SHA-256) with a secret key. It verifies both data integrity and data authenticity, ensuring that the payload was generated by a party in possession of the secret key.',
    },
    {
      question: 'Are my files uploaded when generating checksums?',
      answer:
        'No. The FileReader API reads your file locally into browser memory, and the Web Crypto API processes bytes directly on your local CPU. Zero bytes are uploaded to any server.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Cryptographic Hashing &amp; Checksum Verification
          </h2>
          <p>
            Generate deterministic cryptographic digests for strings, passwords, and local files using the hardware-accelerated Web Crypto API.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔒 SHA-256 &amp; SHA-512</h3>
              <p className="text-[11px]">NIST-standard SHA-2 family cryptographic hash algorithms.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔑 Keyed HMAC Auth</h3>
              <p className="text-[11px]">HMAC-SHA256 signature verification with custom secret keys.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📁 100% Local File Hashing</h3>
              <p className="text-[11px]">Compute file checksums locally with zero server uploads.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Input Configuration Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Mode Selector Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  inputMode === 'text' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: inputMode === 'text' ? 'var(--accent)' : 'var(--surface-2)',
                  color: inputMode === 'text' ? '#ffffff' : 'var(--text)',
                  border: inputMode === 'text' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                📝 Text Input
              </button>

              <button
                type="button"
                onClick={() => setInputMode('file')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  inputMode === 'file' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: inputMode === 'file' ? 'var(--accent)' : 'var(--surface-2)',
                  color: inputMode === 'file' ? '#ffffff' : 'var(--text)',
                  border: inputMode === 'file' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                📁 File Checksum
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded text-[var(--accent)]"
                />
                <span>UPPERCASE Hex</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={useHmac}
                  onChange={(e) => setUseHmac(e.target.checked)}
                  className="rounded text-[var(--accent)]"
                />
                <span>HMAC Secret Key</span>
              </label>
            </div>
          </div>

          {/* Text Input Area */}
          {inputMode === 'text' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="hash-text" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Text String
              </label>
              <textarea
                id="hash-text"
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type or paste string to hash..."
                className="w-full p-3 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y font-mono"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          )}

          {/* File Input Area */}
          {inputMode === 'file' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Select File to Hash
              </label>
              <div
                className="p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer text-center transition-colors"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border-c)' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-3xl" aria-hidden="true">📄</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                    {file ? file.name : 'Click to choose a file or drag and drop here'}
                  </p>
                  {file && (
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                      Size: {(file.size / 1024).toFixed(1)} KB ({file.size.toLocaleString()} bytes)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HMAC Secret Key Field */}
          {useHmac && (
            <div className="flex flex-col gap-1.5 pt-2">
              <label htmlFor="hmac-key" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                HMAC Secret Key
              </label>
              <input
                id="hmac-key"
                type="text"
                value={hmacKey}
                onChange={(e) => setHmacKey(e.target.value)}
                placeholder="Enter secret signing key..."
                className="w-full p-2.5 rounded-xl text-xs font-mono font-semibold focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <ResetButton onClick={handleReset} />
          </div>
        </div>

        {/* Calculated Hash Outputs List */}
        <div className="flex flex-col gap-3">
          {/* SHA-256 */}
          <div
            className="p-5 rounded-2xl flex flex-col gap-2 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                  SHA-256 (Recommended)
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                  256-bit / 64 hex
                </span>
              </div>
              <CopyButton textToCopy={hashes.sha256} size="sm" />
            </div>
            <div
              className="p-3 rounded-xl font-mono text-xs font-semibold break-all select-all"
              style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
            >
              {isProcessing ? 'Calculating...' : hashes.sha256}
            </div>
          </div>

          {/* HMAC SHA-256 (if enabled) */}
          {useHmac && hashes.hmacSha256 && (
            <div
              className="p-5 rounded-2xl flex flex-col gap-2 shadow-xs"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                    HMAC-SHA256
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                    Keyed Hash Signature
                  </span>
                </div>
                <CopyButton textToCopy={hashes.hmacSha256} size="sm" />
              </div>
              <div
                className="p-3 rounded-xl font-mono text-xs font-semibold break-all select-all"
                style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
              >
                {hashes.hmacSha256}
              </div>
            </div>
          )}

          {/* SHA-512 */}
          <div
            className="p-5 rounded-2xl flex flex-col gap-2 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  SHA-512
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                  512-bit / 128 hex
                </span>
              </div>
              <CopyButton textToCopy={hashes.sha512} size="sm" />
            </div>
            <div
              className="p-3 rounded-xl font-mono text-xs font-semibold break-all select-all"
              style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
            >
              {isProcessing ? 'Calculating...' : hashes.sha512}
            </div>
          </div>

          {/* SHA-384 */}
          <div
            className="p-5 rounded-2xl flex flex-col gap-2 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  SHA-384
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                  384-bit / 96 hex
                </span>
              </div>
              <CopyButton textToCopy={hashes.sha384} size="sm" />
            </div>
            <div
              className="p-3 rounded-xl font-mono text-xs font-semibold break-all select-all"
              style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
            >
              {isProcessing ? 'Calculating...' : hashes.sha384}
            </div>
          </div>

          {/* MD5 */}
          <div
            className="p-5 rounded-2xl flex flex-col gap-2 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>
                  MD5 (Checksum / Legacy Only)
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                  ⚠️ Not for Security
                </span>
              </div>
              <CopyButton textToCopy={hashes.md5} size="sm" />
            </div>
            <div
              className="p-3 rounded-xl font-mono text-xs font-semibold break-all select-all"
              style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
            >
              {isProcessing ? 'Calculating...' : hashes.md5}
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
