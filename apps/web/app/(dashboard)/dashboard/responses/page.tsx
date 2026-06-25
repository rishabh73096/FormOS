import { db, forms, responses } from '@repo/db';
import { eq, desc, inArray } from 'drizzle-orm';
import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { PageFade, WinWindow, StaggerList, AnimRow } from '@/lib/motion';

export default async function AllResponsesPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  // All forms belonging to user
  const userForms = await db
    .select({ id: forms.id, title: forms.title, isPublished: forms.isPublished })
    .from(forms)
    .where(eq(forms.userId, session.user.id));

  const formIds = userForms.map((f) => f.id);
  const formMap = Object.fromEntries(userForms.map((f) => [f.id, f]));

  const allResponses =
    formIds.length === 0
      ? []
      : await db
          .select({
            id:          responses.id,
            formId:      responses.formId,
            values:      responses.values,
            submittedAt: responses.submittedAt,
          })
          .from(responses)
          .where(inArray(responses.formId, formIds))
          .orderBy(desc(responses.submittedAt))
          .limit(200);

  function formatDate(d: Date) {
    return new Date(d).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function previewValues(vals: Record<string, unknown>): string {
    const entries = Object.values(vals).filter((v) => v !== null && v !== undefined && v !== '');
    if (entries.length === 0) return '—';
    const first = Array.isArray(entries[0]) ? entries[0].join(', ') : String(entries[0]);
    return first.length > 60 ? first.slice(0, 60) + '…' : first;
  }

  return (
    <PageFade className="space-y-4">
      <WinWindow className="win-window">
        <div className="win-titlebar">
          <span className="win-titlebar-title">💬 All Responses</span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <div className="win-ctrl">✕</div>
          </div>
        </div>
        <div className="win-menubar">
          <span>File</span>
          <span>View</span>
          <span>Export</span>
          <span>Help</span>
        </div>

        {/* Toolbar */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
        >
          <span className="text-xs font-bold" style={{ color: 'var(--muted-foreground)' }}>
            Showing all responses across {userForms.length} form(s)
          </span>
          <div className="ml-auto flex gap-2">
            <Link href="/dashboard/forms" className="win-btn text-xs px-3 py-1">
              📋 My Forms
            </Link>
            <Link href="/dashboard/analytics" className="win-btn text-xs px-3 py-1">
              📈 Analytics
            </Link>
          </div>
        </div>

        {allResponses.length === 0 ? (
          <div className="win-sunken m-4 p-12 text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              No responses yet
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
              Publish a form and share the link to start collecting responses.
            </p>
            <Link href="/dashboard/forms/new" className="win-btn-primary text-xs px-6 py-2">
              ► Create a Form
            </Link>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div
              className="grid text-xs font-bold px-3 py-1.5"
              style={{
                gridTemplateColumns: '50px 1fr 150px 80px',
                backgroundColor: 'var(--muted)',
                borderBottom: '2px solid var(--border)',
                boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
                color: 'var(--foreground)',
              }}
            >
              <span>#</span>
              <span>Form</span>
              <span>Submitted At</span>
              <span className="text-center">View</span>
            </div>

            <StaggerList>
            {allResponses.map((resp, i) => {
              const form = formMap[resp.formId];
              const preview = previewValues(resp.values as Record<string, unknown>);

              return (
                <AnimRow
                  key={resp.id}
                  className="grid items-center px-3 py-2 text-xs"
                  style={{
                    gridTemplateColumns: '50px 1fr 150px 80px',
                    backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--muted)',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  <span
                    className="font-mono font-bold"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    #{i + 1}
                  </span>

                  <div className="overflow-hidden pr-3">
                    <p className="font-bold truncate">{form?.title ?? 'Unknown Form'}</p>
                    <p
                      className="truncate"
                      style={{ color: 'var(--muted-foreground)', fontSize: 10 }}
                      title={preview}
                    >
                      {preview}
                    </p>
                  </div>

                  <span
                    className="font-mono text-xs"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {formatDate(resp.submittedAt)}
                  </span>

                  <span className="text-center">
                    <Link
                      href={`/dashboard/forms/${resp.formId}/responses/${resp.id}`}
                      className="win-btn-sm text-xs px-2 py-0.5 flex items-center gap-1 justify-center"
                    >
                      <Eye style={{ width: 10, height: 10 }} />
                      View
                    </Link>
                  </span>
                </AnimRow>
              );
            })}
            </StaggerList>

            <div className="win-statusbar text-xs justify-between">
              <span className="win-status-panel">{allResponses.length} response(s) total</span>
              <span className="win-status-panel">{userForms.length} form(s)</span>
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
