import { db, forms, responses } from '@repo/db';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from '@/lib/session';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { PageFade, WinWindow, StaggerList, AnimRow } from '@/lib/motion';

type Props = { params: Promise<{ id: string }> };

export default async function ResponsesPage({ params }: Props) {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const { id } = await params;

  const [form] = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, session.user.id)));

  if (!form) notFound();

  const allResponses = await db
    .select()
    .from(responses)
    .where(eq(responses.formId, id))
    .orderBy(desc(responses.submittedAt));

  // Only show non-layout fields as columns
  const displayFields = form.fields.filter(
    (f) => !['heading', 'paragraph', 'divider'].includes(f.type),
  );

  // Show first 4 fields as preview columns in the table
  const previewFields = displayFields.slice(0, 4);

  function formatValue(val: unknown): string {
    if (val === null || val === undefined || val === '') return '—';
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }

  function formatDate(d: Date) {
    return new Date(d).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <PageFade className="space-y-4">
      {/* Window */}
      <WinWindow className="win-window">
        <div className="win-titlebar">
          <span className="win-titlebar-title">
            💬 Responses — {form.title}
          </span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <Link href="/dashboard/forms" className="win-ctrl" style={{ textDecoration: 'none', color: 'inherit' }}>✕</Link>
          </div>
        </div>

        {/* Menu bar */}
        <div className="win-menubar">
          <span>File</span>
          <span>View</span>
          <span>Export</span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <Link
            href={`/dashboard/forms/${id}/edit`}
            className="win-btn text-xs px-3 py-1 flex items-center gap-1.5"
          >
            <ArrowLeft style={{ width: 11, height: 11 }} />
            Back to Builder
          </Link>
          <div className="win-separator" style={{ width: 2, height: 20, margin: '0 2px' }} />
          <span className="text-xs font-bold" style={{ color: 'var(--muted-foreground)' }}>
            {allResponses.length} response{allResponses.length !== 1 ? 's' : ''}
          </span>
          <div className="ml-auto">
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
          </div>
        </div>

        {allResponses.length === 0 ? (
          <div className="win-sunken m-4 p-12 text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              No responses yet
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
              {form.isPublished
                ? 'Share your form link to start collecting responses.'
                : 'Publish your form first, then share it to collect responses.'}
            </p>
            {!form.isPublished && (
              <Link href={`/dashboard/forms/${id}/edit`} className="win-btn-primary text-xs px-6 py-2">
                ► Open Builder to Publish
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div
              className="grid text-xs font-bold px-3 py-1.5"
              style={{
                gridTemplateColumns: `60px 140px ${previewFields.map(() => '1fr').join(' ')} 50px`,
                backgroundColor: 'var(--muted)',
                borderBottom: '2px solid var(--border)',
                boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
                color: 'var(--foreground)',
              }}
            >
              <span>#</span>
              <span>Submitted At</span>
              {previewFields.map((f) => (
                <span key={f.id} className="truncate">{f.label}</span>
              ))}
              <span className="text-center">View</span>
            </div>

            {/* Rows */}
            <StaggerList>
              {allResponses.map((resp, i) => (
                <AnimRow
                  key={resp.id}
                  className="grid items-center px-3 py-2 text-xs"
                  style={{
                    gridTemplateColumns: `60px 140px ${previewFields.map(() => '1fr').join(' ')} 50px`,
                    backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--muted)',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  <span className="font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    #{allResponses.length - i}
                  </span>
                  <span style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                    {formatDate(resp.submittedAt)}
                  </span>
                  {previewFields.map((f) => (
                    <span key={f.id} className="truncate pr-2" title={formatValue(resp.values[f.id])}>
                      {formatValue(resp.values[f.id])}
                    </span>
                  ))}
                  <span className="text-center">
                    <Link
                      href={`/dashboard/forms/${id}/responses/${resp.id}`}
                      className="win-btn-sm text-xs px-2 py-0.5 flex items-center gap-1 justify-center"
                    >
                      <Eye style={{ width: 10, height: 10 }} />
                      View
                    </Link>
                  </span>
                </AnimRow>
              ))}
            </StaggerList>

            {/* Status bar */}
            <div className="win-statusbar text-xs justify-between">
              <span className="win-status-panel">{allResponses.length} response(s)</span>
              <span className="win-status-panel">
                {displayFields.length} field(s)
              </span>
              <span className="win-status-panel">
                Latest: {allResponses[0] ? formatDate(allResponses[0].submittedAt) : '—'}
              </span>
            </div>
          </>
        )}
      </WinWindow>
    </PageFade>
  );
}
