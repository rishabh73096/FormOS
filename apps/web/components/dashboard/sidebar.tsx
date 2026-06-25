'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Zap } from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion } from '@/lib/motion';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', emoji: '📊' },
  { href: '/dashboard/forms', label: 'My Forms', emoji: '📋' },
  { href: '/dashboard/responses', label: 'Responses', emoji: '💬' },
  { href: '/dashboard/analytics', label: 'Analytics', emoji: '📈' },
  { href: '/dashboard/settings', label: 'Settings', emoji: '⚙' },
];

interface Props {
  user: { name: string; email: string; image?: string | null };
}

export function DashboardSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside
      className="flex flex-col"
      style={{
        width: 196,
        flexShrink: 0,
        borderRight: '2px solid #404040',
        boxShadow: 'inset -1px 0 0 #ffffff',
        backgroundColor: 'var(--card)',
      }}
    >
      {/* Title bar */}
      <div className="win-titlebar" style={{ flexShrink: 0 }}>
        <span className="win-titlebar-title">
          <Zap style={{ width: 11, height: 11 }} />
          FormOS
        </span>
        <div className="win-titlebar-controls">
          <div className="win-ctrl">_</div>
          <div className="win-ctrl">□</div>
        </div>
      </div>

      {/* Menu bar */}
      <div className="win-menubar" style={{ flexShrink: 0 }}>
        <span>File</span>
        <span>View</span>
        <span>Help</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-1.5">
        <p
          className="px-2 pt-1 pb-0.5 text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Menu
        </p>

        {navItems.map(({ href, label, emoji }, i) => {
          const active =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href));

          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: i * 0.05, ease: 'easeOut' }}
            >
              <Link
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  background: active ? 'var(--primary)' : 'transparent',
                  color: active ? 'var(--primary-foreground)' : 'var(--foreground)',
                  boxShadow: active
                    ? 'inset 1px 1px 0 rgba(255,255,255,0.15), inset -1px -1px 0 rgba(0,0,0,0.25)'
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--accent-foreground)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--foreground)';
                  }
                }}
              >
                <span style={{ fontSize: 13, lineHeight: 1 }}>{emoji}</span>
                {label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Separator */}
      <div className="win-separator mx-2" />

      {/* User info */}
      <div className="p-1.5">
        <p
          className="px-2 pb-0.5 text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Account
        </p>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div
            className="win-raised flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              width: 26,
              height: 26,
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate" style={{ color: 'var(--foreground)' }}>
              {user.name}
            </p>
            <p className="truncate" style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="p-1.5 flex flex-col gap-1" style={{ borderTop: '1px solid var(--border)' }}>
        <ThemeToggle />
        <button
          onClick={handleSignOut}
          className="win-btn flex items-center gap-2 text-xs px-2 py-1 w-full"
        >
          <LogOut style={{ width: 11, height: 11, flexShrink: 0 }} />
          Sign Out
        </button>
      </div>

      {/* Status bar */}
      <div className="win-statusbar">
        <span className="win-status-panel text-xs">● Ready</span>
      </div>
    </aside>
  );
}
