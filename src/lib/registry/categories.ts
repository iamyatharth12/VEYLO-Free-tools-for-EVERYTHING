export interface ToolCategory {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  order: number;
}

export const CATEGORIES: ToolCategory[] = [
  {
    id: 'mouse-input',
    name: 'Mouse & Input Tools',
    shortName: 'Mouse & Input',
    description: 'Hardware diagnostics, click speed, sensor DPI, microswitch chatter, and polling rate measuring tools.',
    icon: '🖱️',
    order: 1,
  },
  {
    id: 'generators',
    name: 'Generators',
    shortName: 'Generators',
    description: 'Fast, secure client-side generators for passwords, UUIDs, QR codes, dummy data, and hashes.',
    icon: '⚡',
    order: 2,
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    shortName: 'Developer',
    description: 'JSON formatters, regex testers, Base64 converters, JWT decoders, and code utilities.',
    icon: '🛠️',
    order: 3,
  },
  {
    id: 'calculators',
    name: 'Calculators',
    shortName: 'Calculators',
    description: 'High-speed calculators for percentages, time differences, aspect ratios, data sizes, and math.',
    icon: '🧮',
    order: 4,
  },
  {
    id: 'converters',
    name: 'Converters',
    shortName: 'Converters',
    description: 'Instant conversion utilities for color codes, units, data storage, timestamps, and numbers.',
    icon: '🔄',
    order: 5,
  },
  {
    id: 'text',
    name: 'Text & String Tools',
    shortName: 'Text Tools',
    description: 'Case converters, word counters, text diff checkers, string cleaners, and whitespace removers.',
    icon: '📝',
    order: 6,
  },
  {
    id: 'writing',
    name: 'Writing Tools',
    shortName: 'Writing',
    description: 'Readability score checkers, character counters, markdown editors, and content formatting utilities.',
    icon: '✍️',
    order: 7,
  },
  {
    id: 'creativity',
    name: 'Creativity Tools',
    shortName: 'Creativity',
    description: 'Palette generators, name idea generators, prompt builders, and design brainstorming tools.',
    icon: '🎨',
    order: 8,
  },
  {
    id: 'gaming',
    name: 'Gaming & Controller Tools',
    shortName: 'Gaming',
    description: 'Gamepad testers, joystick drift checkers, trigger response viewers, and click latency tests.',
    icon: '🎮',
    order: 9,
  },
  {
    id: 'screen-display',
    name: 'Screen & Display Tools',
    shortName: 'Screen & Display',
    description: 'Dead pixel tests, monitor refresh rate (Hz) checkers, color banding testers, and screen aspect tools.',
    icon: '🖥️',
    order: 10,
  },
  {
    id: 'random',
    name: 'Random Tools',
    shortName: 'Random',
    description: 'Random number pickers, coin flippers, dice rollers, list shufflers, and decision makers.',
    icon: '🎲',
    order: 11,
  },
  {
    id: 'productivity',
    name: 'Productivity Tools',
    shortName: 'Productivity',
    description: 'Focus timers, stopwatches, countdowns, simple task scratchpads, and meeting utilities.',
    icon: '⏱️',
    order: 12,
  },
  {
    id: 'misc',
    name: 'Miscellaneous Tools',
    shortName: 'Miscellaneous',
    description: 'Quick everyday browser utilities, privacy checkers, and technical troubleshooting helpers.',
    icon: '📦',
    order: 13,
  },
];
