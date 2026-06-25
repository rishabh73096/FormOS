import { db, forms } from '@repo/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { PublicForm } from '@/components/public-form/public-form';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { getUserPlan } from '@/lib/plan-guard';
import { PLANS } from '@/lib/plans';

type Props = { params: Promise<{ publicId: string }> };

export default async function PublicFormPage({ params }: Props) {
  const { publicId } = await params;
  const [form] = await db.select().from(forms).where(eq(forms.publicId, publicId));
  if (!form || !form.isPublished) notFound();

  const ownerPlan = await getUserPlan(form.userId);
  const showBranding = !PLANS[ownerPlan].features.removeBranding;

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Mini taskbar */}
      <div
        className="win-taskbar fixed inset-x-0 top-0 flex items-center justify-between px-3 h-9 z-50"
        style={{ borderBottom: '2px solid #404040' }}
      >
        <Link href="/" className="win-btn flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold">
          <Zap style={{ width: 11, height: 11, color: 'var(--primary)' }} />
          FormOS
        </Link>
        <div
          className="text-xs font-mono"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {form.title}
        </div>
        <div
          className="win-status-panel text-xs"
          style={{ color: '#008000' }}
        >
          ● Live Form
        </div>
      </div>

      {/* Center the form window */}
      <div className="flex items-start justify-center pt-12">
        <div className="w-full max-w-xl animate-scan-in">
          <PublicForm form={form} />
        </div>
      </div>

      {/* Footer — only for Free plan owners */}
      {showBranding && (
        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Powered by{' '}
            <Link href="/" className="font-bold hover:underline" style={{ color: 'var(--primary)' }}>
              FormOS
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
