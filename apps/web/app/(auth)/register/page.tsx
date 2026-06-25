'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth-client';
import { Zap } from 'lucide-react';
import { motion } from '@/lib/motion';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signUp.email({ name, email, password });
    if (result.error) {
      setError(result.error.message ?? 'Failed to create account');
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
            FormOS — Create Account
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
          <div className="flex items-center gap-3 mb-4">
            <div className="win-raised w-12 h-12 flex items-center justify-center text-2xl shrink-0">
              📋
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                New User Registration
              </p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Setup Wizard — Step 1 of 1
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

            {/* Name */}
            <div className="mb-3">
              <label
                htmlFor="name"
                className="block text-xs font-bold mb-1"
                style={{ color: 'var(--foreground)' }}
              >
                Full name:
              </label>
              <div className="win-sunken">
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                Password: <span style={{ color: 'var(--muted-foreground)', fontWeight: 'normal' }}>(min. 8 chars)</span>
              </label>
              <div className="win-sunken">
                <input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
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
              <Link href="/login" className="win-btn text-xs px-5 py-1.5">
                Back
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="win-btn-primary text-xs px-6 py-1.5"
              >
                {loading ? '⏳ Creating…' : '► Finish'}
              </button>
            </div>
          </form>
        </div>

        {/* Status bar */}
        <div className="win-statusbar text-xs justify-between">
          <span className="win-status-panel">
            {loading ? '⏳ Creating account...' : '● Ready'}
          </span>
          <span className="win-status-panel">
            <Link href="/login" className="hover:underline" style={{ color: 'var(--primary)' }}>
              Already registered? Sign in
            </Link>
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          FormOS v1.0 · Free to start · No credit card needed
        </p>
      </div>
    </motion.div>
  );
}
