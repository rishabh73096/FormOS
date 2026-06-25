import { db, forms } from '@repo/db';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { FormsListClient } from '@/components/dashboard/forms-list-client';
import { PageFade, WinWindow } from '@/lib/motion';

export default async function FormsPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const userForms = await db
    .select()
    .from(forms)
    .where(eq(forms.userId, session.user.id))
    .orderBy(desc(forms.createdAt));

  return (
    <PageFade className="space-y-4">
      <WinWindow className="win-window">
        <div className="win-titlebar">
          <span className="win-titlebar-title">📋 My Forms — Form Manager</span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <div className="win-ctrl">✕</div>
          </div>
        </div>
        <div className="win-menubar">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Help</span>
        </div>

        {/* Toolbar */}
        <div
          className="flex items-center gap-2 p-2"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <Link href="/dashboard/forms/new" className="win-btn-primary text-xs px-4 py-1 flex items-center gap-1.5">
            <Plus style={{ width: 11, height: 11 }} />
            New Form
          </Link>
          <div className="win-separator" style={{ width: 2, height: 20, margin: '0 2px' }} />
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {userForms.length} form{userForms.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="p-3">
          <FormsListClient forms={userForms} />
        </div>

        <div className="win-statusbar text-xs">
          <span className="win-status-panel">{userForms.length} object(s)</span>
          <span className="win-status-panel">FormOS v1.0</span>
        </div>
      </WinWindow>
    </PageFade>
  );
}
