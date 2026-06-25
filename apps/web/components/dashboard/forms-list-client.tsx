'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, MessageSquare, Pencil, Trash2, Globe, Copy, BarChart2 } from 'lucide-react';

interface Form {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  publicId: string;
  viewCount: number;
  responseCount: number;
  createdAt: Date;
}

export function FormsListClient({ forms }: { forms: Form[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Delete this form?\n\nAll responses will be permanently lost.\n\nAre you sure?')) return;
    setDeletingId(id);
    const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Form deleted');
      router.refresh();
    } else {
      toast.error('Failed to delete form');
    }
    setDeletingId(null);
  }

  async function handleTogglePublish(id: string, isPublished: boolean) {
    const res = await fetch(`/api/forms/${id}/publish`, { method: 'POST' });
    if (res.ok) {
      toast.success(isPublished ? 'Form unpublished' : 'Form published!');
      router.refresh();
    } else {
      toast.error('Failed to update form');
    }
  }

  function copyPublicLink(publicId: string) {
    navigator.clipboard.writeText(`${window.location.origin}/f/${publicId}`);
    toast.success('Link copied to clipboard');
  }

  if (forms.length === 0) {
    return (
      <div className="win-sunken p-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-sm font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          No forms found
        </p>
        <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>
          Create your first form to start collecting responses.
        </p>
        <Link href="/dashboard/forms/new" className="win-btn-primary text-xs px-6 py-2">
          ► Create your first form
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Column headers */}
      <div
        className="grid text-xs font-bold px-3 py-1.5"
        style={{
          gridTemplateColumns: '1fr 70px 90px 100px',
          backgroundColor: 'var(--muted)',
          color: 'var(--foreground)',
          borderBottom: '2px solid var(--border)',
          boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
        }}
      >
        <span>Form Name</span>
        <span className="text-center">Views</span>
        <span className="text-center">Responses</span>
        <span className="text-center">Status</span>
      </div>

      {/* Rows */}
      {forms.map((form, i) => {
        const isSelected = selectedId === form.id;
        return (
          <div
            key={form.id}
            onClick={() => setSelectedId(form.id)}
            className="grid px-3 py-2 text-xs cursor-pointer"
            style={{
              gridTemplateColumns: '1fr 70px 90px 100px',
              backgroundColor: isSelected ? 'var(--primary)' : i % 2 === 0 ? 'var(--card)' : 'var(--muted)',
              color: isSelected ? 'var(--primary-foreground)' : 'var(--foreground)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div className="overflow-hidden pr-2">
              <p className="font-bold truncate">{form.title}</p>
              {form.description && (
                <p
                  className="truncate mt-0.5"
                  style={{ fontSize: 10, color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--muted-foreground)' }}
                >
                  {form.description}
                </p>
              )}
            </div>
            <span className="text-center self-center flex items-center justify-center gap-1">
              <Eye style={{ width: 10, height: 10 }} />
              {form.viewCount}
            </span>
            <span className="text-center self-center flex items-center justify-center gap-1">
              <MessageSquare style={{ width: 10, height: 10 }} />
              {form.responseCount}
            </span>
            <span className="text-center self-center">
              <span
                className="px-2 py-0.5 text-xs font-bold"
                style={
                  form.isPublished
                    ? { background: '#008000', color: '#fff' }
                    : { background: '#808080', color: '#fff' }
                }
              >
                {form.isPublished ? '● Live' : '○ Draft'}
              </span>
            </span>
          </div>
        );
      })}

      {/* Action toolbar at bottom */}
      <div
        className="flex items-center gap-1 p-2 mt-2"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <p className="text-xs mr-2 font-bold" style={{ color: 'var(--muted-foreground)' }}>
          {selectedId ? 'Actions:' : 'Select a form to edit'}
        </p>

        {selectedId && (() => {
          const form = forms.find((f) => f.id === selectedId)!;
          return (
            <>
              <Link
                href={`/dashboard/forms/${selectedId}/edit`}
                className="win-btn text-xs px-3 py-1 flex items-center gap-1"
              >
                <Pencil style={{ width: 10, height: 10 }} /> Edit
              </Link>
              <Link
                href={`/dashboard/forms/${selectedId}/responses`}
                className="win-btn text-xs px-3 py-1 flex items-center gap-1"
              >
                <BarChart2 style={{ width: 10, height: 10 }} /> Responses
              </Link>
              <button
                onClick={() => copyPublicLink(form.publicId)}
                className="win-btn text-xs px-3 py-1 flex items-center gap-1"
              >
                <Copy style={{ width: 10, height: 10 }} /> Copy Link
              </button>
              <button
                onClick={() => handleTogglePublish(form.id, form.isPublished)}
                className="win-btn text-xs px-3 py-1 flex items-center gap-1"
              >
                <Globe style={{ width: 10, height: 10 }} />
                {form.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => handleDelete(form.id)}
                disabled={deletingId === form.id}
                className="win-btn text-xs px-3 py-1 flex items-center gap-1"
                style={{ color: '#cc0000' }}
              >
                <Trash2 style={{ width: 10, height: 10 }} />
                {deletingId === form.id ? 'Deleting…' : 'Delete'}
              </button>
            </>
          );
        })()}
      </div>
    </div>
  );
}
