'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="win-btn-sm w-8 h-7" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="win-btn-sm flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold"
      title={isDark ? 'Switch to Light' : 'Switch to Dark'}
    >
      {isDark ? (
        <>
          <span className="text-amber-400">☀</span>
          <span className="hidden sm:inline">LIGHT</span>
        </>
      ) : (
        <>
          <span>◉</span>
          <span className="hidden sm:inline">DARK</span>
        </>
      )}
    </button>
  );
}
