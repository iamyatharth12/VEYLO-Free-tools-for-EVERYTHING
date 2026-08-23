import type { ReactNode } from 'react';

interface ToolShellProps {
  children: ReactNode;
  maxWidth?: string;
}

export default function ToolShell({ children, maxWidth = '1200px' }: ToolShellProps) {
  return (
    <main className="flex-1 w-full" id="main-content">
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </main>
  );
}
