import { db, forms } from '@repo/db';
import { eq, desc, count } from 'drizzle-orm';
import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getUserPlan } from '@/lib/plan-guard';
import { PLANS } from '@/lib/plans';
import { UpgradeBanner } from '@/components/dashboard/upgrade-dialog';
import { PageFade, WinWindow, StaggerList, AnimRow, PopIn } from '@/lib/motion';

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const [userForms, totalRow, userPlan] = await Promise.all([
    db.select().from(forms).where(eq(forms.userId, session.user.id)).orderBy(desc(forms.createdAt)).limit(5),
    db.select({ totalForms: count(forms.id) }).from(forms).where(eq(forms.userId, session.user.id)).then(r => r[0]),
    getUserPlan(session.user.id),
  ]);

  const totalViews     = userForms.reduce((acc, f) => acc + f.viewCount, 0);
  const totalResponses = userForms.reduce((acc, f) => acc + f.responseCount, 0);
  const publishedCount = userForms.filter((f) => f.isPublished).length;
  const planLimits     = PLANS[userPlan];
  const totalForms     = totalRow?.totalForms ?? 0;
  const showFormBanner = userPlan === 'free' && totalForms >= Math.floor(planLimits.maxForms * 0.6);

  const stats = [
    { label: 'Total Forms', value: totalForms,     emoji: '📋' },
    { label: 'Total Views', value: totalViews,     emoji: '👁' },
    { label: 'Responses',   value: totalResponses, emoji: '💬' },
    { label: 'Published',   value: publishedCount, emoji: '🌐' },
  ];

  const firstName = session.user.name.split(' ')[0];

  return (
    <PageFade className="space-y-4">
      {/* Header */}
      <WinWindow className="win-window">
        <div className="win-titlebar">
          <span className="win-titlebar-title">📊 Dashboard — {firstName}&apos;s Workspace</span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <div className="win-ctrl">✕</div>
          </div>
        </div>
        <div className="p-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>
              Welcome back, {firstName}!
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Here&apos;s an overview of your forms and activity.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PopIn delay={0.3}>
              <span
                className="text-xs font-bold px-2 py-0.5"
                style={{
                  background: userPlan === 'pro' ? 'linear-gradient(90deg, #4a0080, #8b5cf6)' : '#808080',
                  color: '#ffffff',
                }}
              >
                {userPlan === 'pro' ? '★ PRO' : '○ FREE'}
              </span>
            </PopIn>
            <Link href="/dashboard/forms/new" className="win-btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
              <Plus style={{ width: 11, height: 11 }} />
              New Form
            </Link>
          </div>
        </div>
        {showFormBanner && (
          <div className="px-3 pb-3">
            <UpgradeBanner current={totalForms} limit={planLimits.maxForms as number} resource="Forms used" />
          </div>
        )}
      </WinWindow>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, emoji }, i) => (
          <WinWindow key={label} className="win-window" delay={i * 0.07}>
            <div className="win-titlebar">
              <span className="win-titlebar-title">{emoji} {label}</span>
            </div>
            <div className="p-3">
              <div
                className="win-sunken p-3 text-center"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 900, color: 'var(--primary)' }}
              >
                {value.toLocaleString()}
              </div>
            </div>
          </WinWindow>
        ))}
      </div>

      {/* Recent forms */}
      <WinWindow className="win-window" delay={0.18}>
        <div className="win-titlebar">
          <span className="win-titlebar-title">📋 Recent Forms</span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
          </div>
        </div>
        <div className="win-menubar"><span>File</span><span>View</span></div>

        {userForms.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>No forms yet</p>
            <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
              Create your first form to start collecting responses.
            </p>
            <Link href="/dashboard/forms/new" className="win-btn-primary text-xs px-6 py-2">► Create Form</Link>
          </div>
        ) : (
          <>
            <div
              className="grid text-xs font-bold px-3 py-1"
              style={{
                gridTemplateColumns: '1fr 80px 80px 90px 140px',
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
              }}
            >
              <span>Name</span>
              <span className="text-center">Views</span>
              <span className="text-center">Responses</span>
              <span className="text-center">Status</span>
              <span className="text-center">Actions</span>
            </div>

            <StaggerList>
              {userForms.map((form, i) => (
                <AnimRow
                  key={form.id}
                  className="grid items-center px-3 py-2 text-xs"
                  style={{
                    gridTemplateColumns: '1fr 80px 80px 90px 140px',
                    borderBottom: i < userForms.length - 1 ? '1px solid var(--border)' : 'none',
                    backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--muted)',
                    color: 'var(--foreground)',
                  }}
                >
                  <span className="font-bold truncate pr-2">{form.title}</span>
                  <span className="text-center" style={{ color: 'var(--muted-foreground)' }}>{form.viewCount}</span>
                  <span className="text-center" style={{ color: 'var(--muted-foreground)' }}>{form.responseCount}</span>
                  <span className="text-center">
                    <span
                      className="px-2 py-0.5 text-xs font-bold"
                      style={form.isPublished
                        ? { background: '#008000', color: '#ffffff' }
                        : { background: 'var(--muted-foreground)', color: '#ffffff' }}
                    >
                      {form.isPublished ? '● Live' : '○ Draft'}
                    </span>
                  </span>
                  <span className="text-center flex gap-1 justify-center">
                    <Link href={`/dashboard/forms/${form.id}/responses`} className="win-btn text-xs px-2 py-0.5">💬</Link>
                    <Link href={`/dashboard/forms/${form.id}/edit`} className="win-btn text-xs px-2 py-0.5">Edit ►</Link>
                  </span>
                </AnimRow>
              ))}
            </StaggerList>

            <div className="win-statusbar text-xs justify-between">
              <span className="win-status-panel">{userForms.length} item(s)</span>
              <Link href="/dashboard/forms" className="win-status-panel" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                View all forms →
              </Link>
            </div>
          </>
        )}
      </WinWindow>
    </PageFade>
  );
}
