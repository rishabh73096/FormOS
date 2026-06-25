import { db, forms } from '@repo/db';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PageFade, WinWindow, StaggerList, AnimRow } from '@/lib/motion';

export default async function AnalyticsPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const userForms = await db
    .select()
    .from(forms)
    .where(eq(forms.userId, session.user.id))
    .orderBy(desc(forms.responseCount));

  const totalViews     = userForms.reduce((a, f) => a + f.viewCount, 0);
  const totalResponses = userForms.reduce((a, f) => a + f.responseCount, 0);
  const totalForms     = userForms.length;
  const publishedCount = userForms.filter((f) => f.isPublished).length;
  const overallRate    = totalViews > 0 ? ((totalResponses / totalViews) * 100).toFixed(1) : '0.0';

  const stats = [
    { label: 'Total Forms',   value: totalForms,     emoji: '📋', sub: `${publishedCount} published` },
    { label: 'Total Views',   value: totalViews,     emoji: '👁', sub: 'across all forms' },
    { label: 'Total Responses', value: totalResponses, emoji: '💬', sub: 'all time' },
    { label: 'Conversion',    value: `${overallRate}%`, emoji: '📈', sub: 'views → responses' },
  ];

  return (
    <PageFade className="space-y-4">

      {/* Header */}
      <div className="win-window">
        <div className="win-titlebar">
          <span className="win-titlebar-title">📈 Analytics — Overview</span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <div className="win-ctrl">✕</div>
          </div>
        </div>
        <div className="win-menubar">
          <span>View</span>
          <span>Export</span>
          <span>Help</span>
        </div>
        <div className="p-3">
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Showing analytics across all your forms. All time.
          </p>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, emoji, sub }, i) => (
          <WinWindow key={label} className="win-window" delay={i * 0.07}>
            <div className="win-titlebar">
              <span className="win-titlebar-title">{emoji} {label}</span>
            </div>
            <div className="p-3 text-center">
              <div
                className="win-sunken p-2 mb-1"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 26,
                  fontWeight: 900,
                  color: 'var(--primary)',
                }}
              >
                {value}
              </div>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>
            </div>
          </WinWindow>
        ))}
      </div>

      {/* Per-form breakdown */}
      <WinWindow className="win-window" delay={0.18}>
        <div className="win-titlebar">
          <span className="win-titlebar-title">📋 Per-Form Breakdown</span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
          </div>
        </div>
        <div className="win-menubar"><span>File</span><span>View</span></div>

        {userForms.length === 0 ? (
          <div className="win-sunken m-4 p-8 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>No forms yet</p>
            <p className="text-xs mt-1 mb-4" style={{ color: 'var(--muted-foreground)' }}>
              Create a form to start seeing analytics.
            </p>
            <Link href="/dashboard/forms/new" className="win-btn-primary text-xs px-6 py-2">
              ► Create Form
            </Link>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div
              className="grid text-xs font-bold px-3 py-1.5"
              style={{
                gridTemplateColumns: '1fr 70px 90px 90px 100px 90px',
                backgroundColor: 'var(--muted)',
                borderBottom: '2px solid var(--border)',
                boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
                color: 'var(--foreground)',
              }}
            >
              <span>Form</span>
              <span className="text-center">Status</span>
              <span className="text-center">Views</span>
              <span className="text-center">Responses</span>
              <span className="text-center">Conversion</span>
              <span className="text-center">Action</span>
            </div>

            <StaggerList>
            {userForms.map((form, i) => {
              const rate = form.viewCount > 0
                ? ((form.responseCount / form.viewCount) * 100).toFixed(1)
                : '0.0';
              const rateNum = parseFloat(rate);

              return (
                <AnimRow
                  key={form.id}
                  className="grid items-center px-3 py-2 text-xs"
                  style={{
                    gridTemplateColumns: '1fr 70px 90px 90px 100px 90px',
                    backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--muted)',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  <div className="overflow-hidden pr-2">
                    <p className="font-bold truncate">{form.title}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>
                      /f/{form.publicId}
                    </p>
                  </div>

                  <span className="text-center">
                    <span
                      className="px-1.5 py-0.5 text-xs font-bold"
                      style={form.isPublished
                        ? { background: '#008000', color: '#fff' }
                        : { background: '#808080', color: '#fff' }}
                    >
                      {form.isPublished ? '●' : '○'}
                    </span>
                  </span>

                  <span
                    className="text-center font-mono font-bold"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {form.viewCount.toLocaleString()}
                  </span>

                  <span
                    className="text-center font-mono font-bold"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {form.responseCount.toLocaleString()}
                  </span>

                  <span className="text-center">
                    <div
                      className="win-progress-track mx-auto"
                      style={{ height: 12, maxWidth: 70 }}
                    >
                      <div
                        className="win-progress-bar"
                        style={{ width: `${Math.min(rateNum, 100)}%`, height: '100%' }}
                      />
                    </div>
                    <span className="text-xs font-mono" style={{ color: 'var(--primary)' }}>
                      {rate}%
                    </span>
                  </span>

                  <span className="text-center flex gap-1 justify-center">
                    <Link
                      href={`/dashboard/forms/${form.id}/responses`}
                      className="win-btn text-xs px-2 py-0.5"
                    >
                      💬
                    </Link>
                    <Link
                      href={`/dashboard/forms/${form.id}/edit`}
                      className="win-btn text-xs px-2 py-0.5"
                    >
                      ✎
                    </Link>
                  </span>
                </AnimRow>
              );
            })}
            </StaggerList>

            <div className="win-statusbar text-xs justify-between">
              <span className="win-status-panel">{totalForms} form(s)</span>
              <span className="win-status-panel">Total: {totalViews} views · {totalResponses} responses</span>
              <span className="win-status-panel">Avg conversion: {overallRate}%</span>
            </div>
          </>
        )}
      </WinWindow>

      {/* Top performing forms */}
      {userForms.length > 0 && (
        <WinWindow className="win-window" delay={0.28}>
          <div className="win-titlebar">
            <span className="win-titlebar-title">🏆 Top Performing Forms</span>
          </div>
          <div className="p-3">
            <div className="space-y-2">
              {userForms.slice(0, 5).map((form, i) => {
                const pct = totalResponses > 0
                  ? Math.round((form.responseCount / totalResponses) * 100)
                  : 0;
                return (
                  <div key={form.id} className="flex items-center gap-3">
                    <span
                      className="win-raised text-xs font-bold font-mono text-center shrink-0"
                      style={{
                        width: 22, height: 22,
                        background: i === 0 ? '#fbbf24' : 'var(--muted)',
                        color: i === 0 ? '#000' : 'var(--foreground)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold flex-1 truncate" style={{ color: 'var(--foreground)' }}>
                      {form.title}
                    </span>
                    <div className="win-progress-track flex-1 max-w-30" style={{ height: 12 }}>
                      <div className="win-progress-bar" style={{ width: `${pct}%`, height: '100%' }} />
                    </div>
                    <span className="text-xs font-mono w-16 text-right" style={{ color: 'var(--primary)' }}>
                      {form.responseCount} resp.
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </WinWindow>
      )}
    </PageFade>
  );
}
