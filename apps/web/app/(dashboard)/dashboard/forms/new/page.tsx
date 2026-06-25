'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from '@/lib/motion';

export default function NewFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined }),
    });

    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Failed to create form');
      setLoading(false);
      return;
    }

    toast.success('Form created!');
    router.push(`/dashboard/forms/${json.data.id}/edit`);
  }

  return (
    <div className="flex items-start justify-center p-4">
      <motion.div
        className="win-window w-full max-w-md"
        initial={{ opacity: 0, y: -10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {/* Title bar */}
        <div className="win-titlebar">
          <span className="win-titlebar-title">
            📋 New Form — Setup
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

        <div className="p-5">
          {/* Icon header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="win-raised w-12 h-12 flex items-center justify-center text-2xl shrink-0">
              📝
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                Create New Form
              </p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Enter a name and optional description, then open the builder.
              </p>
            </div>
          </div>

          <div className="win-separator mb-4" />

          <form onSubmit={handleCreate}>
            {/* Title */}
            <div className="mb-3">
              <label
                htmlFor="title"
                className="block text-xs font-bold mb-1"
                style={{ color: 'var(--foreground)' }}
              >
                Form title: <span style={{ color: '#cc0000' }}>*</span>
              </label>
              <div className="win-sunken">
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Customer Feedback Survey"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  required
                  autoFocus
                  className="w-full px-2 py-1.5 text-xs outline-none"
                  style={{
                    background: 'transparent',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-mono), monospace',
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label
                htmlFor="description"
                className="block text-xs font-bold mb-1"
                style={{ color: 'var(--foreground)' }}
              >
                Description: <span style={{ color: 'var(--muted-foreground)', fontWeight: 'normal' }}>(optional)</span>
              </label>
              <div className="win-sunken">
                <textarea
                  id="description"
                  placeholder="What is this form for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  className="w-full px-2 py-1.5 text-xs outline-none resize-none"
                  style={{
                    background: 'transparent',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-mono), monospace',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            <div className="win-separator mb-4" />

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard/forms"
                className="win-btn text-xs px-4 py-1.5 flex items-center gap-1.5"
              >
                <ArrowLeft style={{ width: 11, height: 11 }} />
                Back
              </Link>
              <div className="flex gap-2">
                <Link href="/dashboard/forms" className="win-btn text-xs px-4 py-1.5">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={!title.trim() || loading}
                  className="win-btn-primary text-xs px-6 py-1.5"
                >
                  {loading ? '⏳ Creating…' : '► Create & Open Builder'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Status bar */}
        <div className="win-statusbar text-xs">
          <span className="win-status-panel">
            {loading ? '⏳ Creating form...' : '● Ready'}
          </span>
          <span className="win-status-panel">
            {title.length}/200 chars
          </span>
        </div>
      </motion.div>
    </div>
  );
}
