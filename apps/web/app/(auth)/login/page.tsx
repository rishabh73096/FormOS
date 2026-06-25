'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth-client';
import { Zap } from 'lucide-react';
import { motion } from '@/lib/motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn.email({ email, password });
    if (result.error) {
      setError(result.error.message ?? 'Invalid credentials');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  }

  return (
    <motion.div
      className="w-full max-w-sm"
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Window */}
      <div className="win-window">
        {/* Title bar */}
        <div className="win-titlebar">
          <span className="win-titlebar-title">
            <Zap className="h-3 w-3" />
            FormOS — Sign In
          </span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <div className="win-ctrl">✕</div>
          </div>
        </div>

        {/* Menu bar */}
        <div className="win-menubar">
          <span>File</span>
          <span>Help</span>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Icon + heading */}
          <div className="flex items-center gap-3 mb-5">
            <div className="win-raised w-12 h-12 flex items-center justify-center text-2xl shrink-0">
              🔐
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Welcome back</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Enter your credentials to continue
              </p>
            </div>
          </div>

          <div className="win-separator mb-4" />

          <form onSubmit={handleSubmit}>
            {error && (
              <div
                className="mb-3 p-2 text-xs font-bold flex items-center gap-2"
                style={{
                  background: '#ff0000',
                  color: '#ffffff',
                  boxShadow: 'inset 1px 1px 0 #404040, inset -1px -1px 0 #ffffff',
                }}
              >
                ⚠ {error}
              </div>
            )}

            {/* Email */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-xs font-bold mb-1"
                style={{ color: 'var(--foreground)' }}
              >
                Email address:
              </label>
              <div className="win-sunken">
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-2 py-1.5 text-xs outline-none"
                  style={{
                    background: 'transparent',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-mono), monospace',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-xs font-bold mb-1"
                style={{ color: 'var(--foreground)' }}
              >
                Password:
              </label>
              <div className="win-sunken">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-2 py-1.5 text-xs outline-none"
                  style={{
                    background: 'transparent',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-mono), monospace',
                  }}
                />
              </div>
            </div>

            <div className="win-separator mb-4" />

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Link href="/" className="win-btn text-xs px-5 py-1.5">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="win-btn-primary text-xs px-6 py-1.5"
              >
                {loading ? '⏳ Signing in…' : '► OK'}
              </button>
            </div>
          </form>
        </div>

        {/* Status bar */}
        <div className="win-statusbar text-xs justify-between">
          <span className="win-status-panel">
            {loading ? '⏳ Authenticating...' : '● Ready'}
          </span>
          <span className="win-status-panel">
            <Link href="/register" className="hover:underline" style={{ color: 'var(--primary)' }}>
              New user? Register here
            </Link>
          </span>
        </div>
      </div>

      {/* Decorative desktop icon below */}
      <div className="mt-4 text-center">
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          FormOS v1.0 · © 2026
        </p>
      </div>
    </motion.div>
  );
}
