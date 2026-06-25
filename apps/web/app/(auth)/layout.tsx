import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Mini taskbar */}
      <header className="win-taskbar flex items-center justify-between px-3 h-10" style={{ borderBottom: '2px solid #404040' }}>
        <Link href="/" className="win-btn flex items-center gap-1.5 px-3 py-1 text-xs font-bold">
          <Zap className="h-3.5 w-3.5" style={{ color: 'var(--primary)' }} />
          Start
        </Link>
        <div className="flex items-center gap-2" style={{ boxShadow: 'inset 1px 1px 0 #404040, inset -1px -1px 0 #ffffff', padding: '2px 8px' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Desktop area */}
      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
