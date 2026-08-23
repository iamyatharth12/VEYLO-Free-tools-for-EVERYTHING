'use client';

interface AdSlotProps {
  position: 'top-banner' | 'sidebar' | 'inline' | 'bottom-banner';
  className?: string;
}

/**
 * Reusable AdSlot component reserved for future Google AdSense monetization.
 * Non-intrusive container structured to prevent layout shift (CLS protection).
 * Hidden visually when no active ad script is present, maintaining pristine UX.
 */
export default function AdSlot({ position, className = '' }: AdSlotProps) {
  return (
    <div
      data-ad-slot={position}
      aria-hidden="true"
      className={`ad-slot-placeholder w-full overflow-hidden transition-all ${className}`}
      style={{
        display: 'none', // Active ad scripts will set display block when loaded
        minHeight: position.includes('banner') ? '90px' : '250px',
      }}
    />
  );
}
