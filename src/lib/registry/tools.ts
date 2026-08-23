export type ToolStatus = 'available' | 'beta' | 'coming-soon';

export interface ToolMetadata {
  slug: string; // e.g. 'mouse-tester'
  name: string;
  shortDescription: string;
  category: string; // matches ToolCategory.id
  icon: string;
  status: ToolStatus;
  featured?: boolean;
  popular?: boolean;
  relatedTools?: string[]; // array of slugs
  seoTitle: string;
  seoDescription: string;
  keywords?: string[];
  lastUpdated?: string;
}

export const TOOLS_REGISTRY: ToolMetadata[] = [
  // ==========================================
  // Mouse & Input Tools (LIVE PRODUCTION)
  // ==========================================
  {
    slug: 'mouse-tester',
    name: 'Mouse Tester',
    shortDescription: 'Complete hardware diagnostic tool for buttons, scroll wheel, movement tracking, and event logs.',
    category: 'mouse-input',
    icon: '🖱️',
    status: 'available',
    featured: true,
    popular: true,
    relatedTools: ['mouse-click-test', 'double-click-test', 'mouse-polling-rate-test', 'mouse-scroll-test', 'cps-test'],
    seoTitle: 'Mouse Tester Online — Free Mouse Test | VEYLO',
    seoDescription: 'Free online mouse tester by VEYLO. Test your mouse buttons, clicks, scroll wheel, movement, and double-click behavior directly in your browser.',
    keywords: ['mouse tester', 'mouse test online', 'mouse button test', 'mouse hardware diagnostics'],
    lastUpdated: '2026-08-23',
  },
  {
    slug: 'mouse-click-test',
    name: 'Mouse Click Test',
    shortDescription: 'Verify left, right, middle wheel, and side thumb button click signal transmission.',
    category: 'mouse-input',
    icon: '🎯',
    status: 'available',
    popular: true,
    relatedTools: ['mouse-tester', 'double-click-test', 'cps-test'],
    seoTitle: 'Mouse Click Test — Free Online Tool | VEYLO',
    seoDescription: 'Test your left click, right click, middle click, and side buttons for instant signal detection with VEYLO.',
    keywords: ['mouse click test', 'mouse button test', 'left click test', 'right click test'],
    lastUpdated: '2026-08-23',
  },
  {
    slug: 'double-click-test',
    name: 'Double Click Test',
    shortDescription: 'Detect microswitch chatter and measure precise click interval timing in milliseconds.',
    category: 'mouse-input',
    icon: '⚡',
    status: 'available',
    popular: true,
    relatedTools: ['mouse-tester', 'mouse-click-test', 'cps-test'],
    seoTitle: 'Double Click Test — Free Online Tool | VEYLO',
    seoDescription: 'Test your mouse for accidental double clicks and microswitch chatter. Measures click interval timing in milliseconds.',
    keywords: ['double click test', 'mouse switch chatter', 'double clicking bug', 'switch chatter test'],
    lastUpdated: '2026-08-23',
  },
  {
    slug: 'mouse-scroll-test',
    name: 'Mouse Scroll Test',
    shortDescription: 'Test scroll wheel notches, direction tracking (up/down/tilt), and middle button switch.',
    category: 'mouse-input',
    icon: '📜',
    status: 'available',
    relatedTools: ['mouse-tester', 'mouse-click-test'],
    seoTitle: 'Mouse Scroll Test — Free Online Tool | VEYLO',
    seoDescription: 'Test your mouse scroll wheel for smooth scrolling, notch detection, scroll direction, and middle click responsiveness with VEYLO.',
    keywords: ['mouse scroll test', 'scroll wheel test', 'mouse wheel tester', 'smooth scroll test'],
    lastUpdated: '2026-08-23',
  },
  {
    slug: 'mouse-polling-rate-test',
    name: 'Mouse Polling Rate Test',
    shortDescription: 'Measure real-time mouse report frequency (Hz), peak rate, and interval latency.',
    category: 'mouse-input',
    icon: '📡',
    status: 'available',
    popular: true,
    relatedTools: ['mouse-tester', 'mouse-dpi-test', 'cps-test'],
    seoTitle: 'Mouse Polling Rate Test — Free Online Tool | VEYLO',
    seoDescription: 'Test your mouse polling rate (Hz) and report frequency online with VEYLO. Measure peak Hz and interval latency in milliseconds.',
    keywords: ['mouse polling rate test', 'mouse hz test', '1000hz mouse test', 'report rate test'],
    lastUpdated: '2026-08-23',
  },
  {
    slug: 'mouse-dpi-test',
    name: 'Mouse DPI & eDPI Calculator',
    shortDescription: 'Estimate hardware sensor DPI and calculate eDPI effective sensitivity across video games.',
    category: 'mouse-input',
    icon: '📐',
    status: 'available',
    relatedTools: ['mouse-tester', 'mouse-polling-rate-test'],
    seoTitle: 'Mouse DPI Test & eDPI Calculator — Free Online Tool | VEYLO',
    seoDescription: 'Test your mouse DPI (Dots Per Inch) and calculate eDPI (Effective DPI) with VEYLO. Measure target mousepad distance against screen pixel movement.',
    keywords: ['mouse dpi test', 'mouse dpi calculator', 'edpi calculator', 'mouse sensitivity test'],
    lastUpdated: '2026-08-23',
  },
  {
    slug: 'cps-test',
    name: 'CPS Click Speed Test',
    shortDescription: 'Measure your Clicks Per Second across 1s to 60s challenges with live speed ranking.',
    category: 'mouse-input',
    icon: '⏱️',
    status: 'available',
    featured: true,
    popular: true,
    relatedTools: ['mouse-tester', 'mouse-click-test', 'double-click-test'],
    seoTitle: 'CPS Test — Free Online Click Speed Tool | VEYLO',
    seoDescription: 'Free CPS test (Click Speed Test) by VEYLO. Measure how many clicks per second you can achieve in 1s, 5s, 10s, 30s, or 60s challenges.',
    keywords: ['cps test', 'click speed test', 'clicks per second', 'jitter click test'],
    lastUpdated: '2026-08-23',
  },

  // ==========================================
  // Generators (Roadmap)
  // ==========================================
  {
    slug: 'password-generator',
    name: 'Secure Password Generator',
    shortDescription: 'Generate strong, customizable cryptographic passwords with entropy score estimation.',
    category: 'generators',
    icon: '🔑',
    status: 'coming-soon',
    seoTitle: 'Password Generator — Free Online Tool | VEYLO',
    seoDescription: 'Generate secure, random cryptographic passwords client-side in your browser with custom character rules.',
  },
  {
    slug: 'uuid-generator',
    name: 'UUID / GUID Generator',
    shortDescription: 'Generate v4, v1, and bulk UUID identifiers with instant batch copy.',
    category: 'generators',
    icon: '🆔',
    status: 'coming-soon',
    seoTitle: 'UUID Generator — Free Online Tool | VEYLO',
    seoDescription: 'Generate RFC4122 compliant version 4 UUIDs instantly in your browser.',
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    shortDescription: 'Create custom downloadable QR codes for URLs, Wi-Fi keys, text, and contacts.',
    category: 'generators',
    icon: '📱',
    status: 'coming-soon',
    seoTitle: 'QR Code Generator — Free Online Tool | VEYLO',
    seoDescription: 'Create high-resolution QR codes with customizable colors and download formats (SVG/PNG).',
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator (SHA-256 / MD5)',
    shortDescription: 'Generate SHA-256, SHA-512, MD5, and HMAC cryptographic hashes client-side.',
    category: 'generators',
    icon: '🔒',
    status: 'coming-soon',
    seoTitle: 'Hash Generator — Free Online Tool | VEYLO',
    seoDescription: 'Calculate SHA-256, MD5, and SHA-512 hashes instantly with Web Crypto API.',
  },

  // ==========================================
  // Developer Tools (Roadmap)
  // ==========================================
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    shortDescription: 'Format, validate, beautify, minify, and inspect JSON tree hierarchy.',
    category: 'developer',
    icon: '🔧',
    status: 'coming-soon',
    seoTitle: 'JSON Formatter & Validator — Free Online Tool | VEYLO',
    seoDescription: 'Parse, format, minify, and validate JSON data client-side with syntax error highlighting.',
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester & Matcher',
    shortDescription: 'Test regular expressions in real-time with capture group extraction and flag toggles.',
    category: 'developer',
    icon: '🔍',
    status: 'coming-soon',
    seoTitle: 'Regex Tester — Free Online Tool | VEYLO',
    seoDescription: 'Test JavaScript Regular Expressions with real-time match highlights and capture group breakdown.',
  },
  {
    slug: 'base64-converter',
    name: 'Base64 Encoder & Decoder',
    shortDescription: 'Encode and decode strings, URLs, and file binaries into Base64 format.',
    category: 'developer',
    icon: '📦',
    status: 'coming-soon',
    seoTitle: 'Base64 Encoder Decoder — Free Online Tool | VEYLO',
    seoDescription: 'Encode and decode UTF-8 strings and files to/from Base64 format safely.',
  },

  // ==========================================
  // Calculators (Roadmap)
  // ==========================================
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDescription: 'Calculate percentage increases, discounts, difference, and fractional parts.',
    category: 'calculators',
    icon: '➗',
    status: 'coming-soon',
    seoTitle: 'Percentage Calculator — Free Online Tool | VEYLO',
    seoDescription: 'Calculate percentage increase, decrease, difference, and fraction shares with instant formulas.',
  },
  {
    slug: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    shortDescription: 'Calculate pixel dimensions, aspect ratio fractions (16:9, 4:3, 21:9), and scale resolutions.',
    category: 'calculators',
    icon: '📐',
    status: 'coming-soon',
    seoTitle: 'Aspect Ratio Calculator — Free Online Tool | VEYLO',
    seoDescription: 'Calculate image and video aspect ratios, resize dimensions proportionally, and verify resolutions.',
  },

  // ==========================================
  // Converters (Roadmap)
  // ==========================================
  {
    slug: 'color-code-converter',
    name: 'Color Code Converter',
    shortDescription: 'Convert between HEX, RGB, HSL, HSV, and CMYK color spaces with live preview.',
    category: 'converters',
    icon: '🎨',
    status: 'coming-soon',
    seoTitle: 'Color Code Converter — Free Online Tool | VEYLO',
    seoDescription: 'Convert color codes between HEX, RGB, HSL, and CMYK with copyable values and contrast checks.',
  },
  {
    slug: 'unit-data-converter',
    name: 'Data Storage & Bandwidth Converter',
    shortDescription: 'Convert Bytes, KB, MB, GB, TB, and transfer speed units (Mbps vs MB/s).',
    category: 'converters',
    icon: '💾',
    status: 'coming-soon',
    seoTitle: 'Data Unit & Bandwidth Converter — Free Online Tool | VEYLO',
    seoDescription: 'Convert data storage units (Bytes, KB, MB, GB, TB) and network bandwidth transfer speeds.',
  },

  // ==========================================
  // Text & Writing Tools (Roadmap)
  // ==========================================
  {
    slug: 'case-converter',
    name: 'Text Case Converter',
    shortDescription: 'Convert text between UPPERCASE, lowercase, camelCase, kebab-case, snake_case, and Title Case.',
    category: 'text',
    icon: '🔤',
    status: 'coming-soon',
    seoTitle: 'Text Case Converter — Free Online Tool | VEYLO',
    seoDescription: 'Transform text case instantly: uppercase, lowercase, title case, camelCase, snake_case, and more.',
  },
  {
    slug: 'word-counter',
    name: 'Word & Character Counter',
    shortDescription: 'Count words, characters, sentences, paragraphs, and estimate reading / speaking time.',
    category: 'writing',
    icon: '📊',
    status: 'coming-soon',
    seoTitle: 'Word Counter & Text Statistics — Free Online Tool | VEYLO',
    seoDescription: 'Real-time word counter, character counter, sentence counter, and reading time estimator.',
  },

  // ==========================================
  // Gaming & Controller Tools (Roadmap)
  // ==========================================
  {
    slug: 'gamepad-tester',
    name: 'Gamepad & Controller Tester',
    shortDescription: 'Inspect Xbox, PlayStation, and USB controller buttons, trigger pressure, and joystick axes.',
    category: 'gaming',
    icon: '🎮',
    status: 'coming-soon',
    seoTitle: 'Gamepad Tester — Free Online Tool | VEYLO',
    seoDescription: 'Test gamepad controllers online using HTML5 Gamepad API. Inspect button signals and analog stick axis values.',
  },

  // ==========================================
  // Screen & Display Tools (Roadmap)
  // ==========================================
  {
    slug: 'dead-pixel-test',
    name: 'Dead Pixel Test',
    shortDescription: 'Full-screen solid primary color canvas to detect stuck or dead LCD/OLED pixels.',
    category: 'screen-display',
    icon: '🖥️',
    status: 'coming-soon',
    seoTitle: 'Dead Pixel Test — Free Online Tool | VEYLO',
    seoDescription: 'Full-screen monitor test to check for dead, stuck, or defective pixels across pure RGB and monochrome backgrounds.',
  },
  {
    slug: 'screen-refresh-rate-test',
    name: 'Screen Refresh Rate (Hz) Test',
    shortDescription: 'Measure true browser frame rate, monitor refresh rate (60Hz, 120Hz, 144Hz, 240Hz), and frame stability.',
    category: 'screen-display',
    icon: '⚡',
    status: 'coming-soon',
    seoTitle: 'Screen Refresh Rate (Hz) Test — Free Online Tool | VEYLO',
    seoDescription: 'Measure display frame rate and monitor Hz frequency using high-precision requestAnimationFrame benchmarking.',
  },

  // ==========================================
  // Random Tools (Roadmap)
  // ==========================================
  {
    slug: 'random-number-generator',
    name: 'Random Number Generator',
    shortDescription: 'Generate truly random numbers between custom ranges with unique and sorting options.',
    category: 'random',
    icon: '🎲',
    status: 'coming-soon',
    seoTitle: 'Random Number Generator — Free Online Tool | VEYLO',
    seoDescription: 'Generate random numbers within any range using cryptographically secure random values.',
  },
  {
    slug: 'coin-flipper',
    name: 'Coin Flipper & Dice Roller',
    shortDescription: 'Flip virtual coins, roll D6/D20 dice, and track toss history with probability statistics.',
    category: 'random',
    icon: '🪙',
    status: 'coming-soon',
    seoTitle: 'Coin Flipper & Dice Roller — Free Online Tool | VEYLO',
    seoDescription: 'Flip virtual coins and roll multi-sided dice online with unbiased random physics simulation.',
  },

  // ==========================================
  // Productivity Tools (Roadmap)
  // ==========================================
  {
    slug: 'stopwatch-timer',
    name: 'Online Stopwatch & Lap Timer',
    shortDescription: 'Millisecond-accurate browser stopwatch with lap split records and sound alerts.',
    category: 'productivity',
    icon: '⏱️',
    status: 'coming-soon',
    seoTitle: 'Online Stopwatch & Lap Timer — Free Online Tool | VEYLO',
    seoDescription: 'High-precision browser stopwatch with split lap tracking and keyboard hotkey controls.',
  },
];
