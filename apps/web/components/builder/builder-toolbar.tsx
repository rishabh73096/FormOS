'use client';

import Link from 'next/link';
import { useFormBuilder } from '@/store/form-builder';
import { ArrowLeft, Save, Globe, Eye, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onSave: () => void;
}

export function BuilderToolbar({ onSave }: Props) {
  const { title, setTitle, isPublished, publicId, formId, isSaving, isDirty } = useFormBuilder();

  async function handlePublishToggle() {
    const res = await fetch(`/api/forms/${formId}/publish`, { method: 'POST' });
    if (res.ok) {
      const { data } = await res.json();
      useFormBuilder.setState({ isPublished: data.isPublished });
      toast.success(data.isPublished ? 'Form published!' : 'Form unpublished');
    } else {
      toast.error('Failed to update publish status');
    }
  }

  function openPreview() {
    window.open(`/f/${publicId}`, '_blank');
  }

  return (
    <div
      style={{
        flexShrink: 0,
        borderBottom: '2px solid #404040',
        backgroundColor: 'var(--card)',
        boxShadow: 'inset 0 -1px 0 #ffffff',
      }}
    >
      {/* Title bar */}
      <div className="win-titlebar">
        <span className="win-titlebar-title">
          📝 Form Builder — {title || 'Untitled'}
        </span>
        <div className="win-titlebar-controls">
          <div className="win-ctrl">_</div>
          <div className="win-ctrl">□</div>
          <Link href="/dashboard/forms" className="win-ctrl" style={{ textDecoration: 'none', color: 'inherit' }}>
            ✕
          </Link>
        </div>
      </div>

      {/* Toolbar row */}
      <div className="win-taskbar flex items-center gap-1 px-2 py-1.5">
        <Link
          href="/dashboard/forms"
          className="win-btn text-xs px-2 py-1 flex items-center gap-1"
        >
          <ArrowLeft style={{ width: 11, height: 11 }} />
          Back
        </Link>

        <div className="win-separator" style={{ width: 2, height: 20, margin: '0 4px' }} />

        {/* Editable title */}
        <div className="win-sunken flex-1 max-w-xs">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Form"
            className="w-full px-2 py-1 text-xs font-bold outline-none"
            style={{
              background: 'transparent',
              color: 'var(--foreground)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        <div className="win-separator" style={{ width: 2, height: 20, margin: '0 4px' }} />

        {/* Save state */}
        <span
          className="text-xs px-2 font-mono"
          style={{
            color: isSaving ? 'var(--muted-foreground)' : isDirty ? '#cc6600' : '#008000',
          }}
        >
          {isSaving ? (
            <span className="flex items-center gap-1">
              <Loader2 style={{ width: 10, height: 10 }} className="animate-spin" />
              Saving…
            </span>
          ) : isDirty ? (
            '● Unsaved'
          ) : (
            <span className="flex items-center gap-1">
              <CheckCircle2 style={{ width: 10, height: 10 }} />
              Saved
            </span>
          )}
        </span>

        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="win-btn text-xs px-3 py-1 flex items-center gap-1"
        >
          <Save style={{ width: 10, height: 10 }} />
          Save
        </button>

        <button
          onClick={openPreview}
          disabled={!isPublished}
          className="win-btn text-xs px-3 py-1 flex items-center gap-1"
        >
          <Eye style={{ width: 10, height: 10 }} />
          Preview
        </button>

        <button
          onClick={handlePublishToggle}
          className="win-btn-primary text-xs px-4 py-1 flex items-center gap-1"
        >
          <Globe style={{ width: 10, height: 10 }} />
          {isPublished ? 'Unpublish' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
