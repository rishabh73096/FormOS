import { db, forms, responses } from '@repo/db';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from '@/lib/session';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageFade, WinWindow, StaggerList, AnimRow } from '@/lib/motion';

type Props = { params: Promise<{ id: string; responseId: string }> };

export default async function SingleResponsePage({ params }: Props) {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const { id, responseId } = await params;

  // Verify form ownership
  const [form] = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, session.user.id)));

  if (!form) notFound();

  // Fetch the single response
  const [response] = await db
    .select()
    .from(responses)
    .where(and(eq(responses.id, responseId), eq(responses.formId, id)));

  if (!response) notFound();

  // Get all non-layout fields for display
  const displayFields = form.fields.filter(
    (f) => !['heading', 'paragraph', 'divider'].includes(f.type),
  );

  // Compute response number (position among all responses)
  const allResponses = await db
    .select({ id: responses.id })
    .from(responses)
    .where(eq(responses.formId, id));

  const responseNumber = allResponses.findIndex((r) => r.id === responseId) + 1;

  function formatValue(val: unknown): string {
    if (val === null || val === undefined || val === '') return '(empty)';
    if (Array.isArray(val)) return val.length === 0 ? '(none selected)' : val.join(', ');
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'object') return JSON.stringify(val, null, 2);
    return String(val);
  }

  function formatDate(d: Date) {
    return new Date(d).toLocaleString('en-IN', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  }

  const isEmptyAnswer = (val: unknown) =>
    val === null || val === undefined || val === '' ||
    (Array.isArray(val) && val.length === 0);

  const answeredCount = displayFields.filter((f) => !isEmptyAnswer(response.values[f.id])).length;

  return (
    <PageFade className="space-y-4 max-w-2xl mx-auto">
      {/* Main window */}
      <WinWindow className="win-window">
        <div className="win-titlebar">
          <span className="win-titlebar-title">
            📄 Response #{responseNumber} — {form.title}
          </span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <Link
              href={`/dashboard/forms/${id}/responses`}
              className="win-ctrl"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              ✕
            </Link>
          </div>
        </div>

        <div className="win-menubar">
          <span>File</span>
          <span>View</span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <Link
            href={`/dashboard/forms/${id}/responses`}
            className="win-btn text-xs px-3 py-1 flex items-center gap-1.5"
          >
            <ArrowLeft style={{ width: 11, height: 11 }} />
            All Responses
          </Link>
        </div>

        {/* Metadata panel */}
        <div
          className="p-3 flex flex-wrap gap-3"
          style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}
        >
          {[
            { label: 'Response #', value: `#${responseNumber}` },
            { label: 'Submitted', value: formatDate(response.submittedAt) },
            { label: 'Fields answered', value: `${answeredCount} / ${displayFields.length}` },
          ].map(({ label, value }) => (
            <div key={label} className="win-raised px-3 py-1.5">
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
              <p className="text-xs font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono)' }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Fields — property sheet style */}
        <div className="p-0">
          {/* Column headers */}
          <div
            className="grid text-xs font-bold px-3 py-1.5"
            style={{
              gridTemplateColumns: '180px 1fr',
              backgroundColor: 'var(--muted)',
              borderBottom: '2px solid var(--border)',
              boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
              color: 'var(--foreground)',
            }}
          >
            <span>Field</span>
            <span>Answer</span>
          </div>

          {displayFields.length === 0 ? (
            <div className="p-6 text-center text-xs" style={{ color: 'var(--muted-foreground)' }}>
              This form has no fields.
            </div>
          ) : (
            <StaggerList>
              {displayFields.map((field, i) => {
                const val = response.values[field.id];
                const empty = isEmptyAnswer(val);
                return (
                  <AnimRow
                    key={field.id}
                    className="grid px-3 py-2 text-xs"
                    style={{
                      gridTemplateColumns: '180px 1fr',
                      backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--muted)',
                      borderBottom: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      alignItems: 'start',
                    }}
                  >
                    <div className="pr-3">
                      <p className="font-bold truncate">{field.label}</p>
                      <p
                        className="mt-0.5"
                        style={{ fontSize: 10, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
                      >
                        [{field.type}]{field.required ? ' *' : ''}
                      </p>
                    </div>
                    <div
                      className="win-sunken px-2 py-1"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: empty ? 'var(--muted-foreground)' : 'var(--foreground)',
                        fontSize: 11,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {formatValue(val)}
                    </div>
                  </AnimRow>
                );
              })}
            </StaggerList>
          )}
        </div>

        {/* Status bar */}
        <div className="win-statusbar text-xs justify-between">
          <span className="win-status-panel">
            {answeredCount} of {displayFields.length} field(s) answered
          </span>
          {response.metadata?.userAgent && (
            <span className="win-status-panel truncate max-w-xs" title={response.metadata.userAgent}>
              UA: {response.metadata.userAgent.slice(0, 40)}…
            </span>
          )}
          {response.metadata?.referrer && (
            <span className="win-status-panel">
              Ref: {response.metadata.referrer}
            </span>
          )}
        </div>
      </WinWindow>

      {/* Navigation between responses */}
      <WinWindow className="win-window" delay={0.1}>
        <div className="win-titlebar" style={{ padding: '2px 6px' }}>
          <span className="win-titlebar-title" style={{ fontSize: 10 }}>Navigation</span>
        </div>
        <div className="p-2 flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Response {responseNumber} of {allResponses.length}
          </p>
          <div className="flex gap-1">
            {responseNumber > 1 && (
              <Link
                href={`/dashboard/forms/${id}/responses/${allResponses[responseNumber - 2]?.id}`}
                className="win-btn text-xs px-3 py-1"
              >
                ◄ Prev
              </Link>
            )}
            {responseNumber < allResponses.length && (
              <Link
                href={`/dashboard/forms/${id}/responses/${allResponses[responseNumber]?.id}`}
                className="win-btn text-xs px-3 py-1"
              >
                Next ►
              </Link>
            )}
            <Link
              href={`/dashboard/forms/${id}/responses`}
              className="win-btn-primary text-xs px-3 py-1"
            >
              ☰ All Responses
            </Link>
          </div>
        </div>
      </WinWindow>
    </PageFade>
  );
}
