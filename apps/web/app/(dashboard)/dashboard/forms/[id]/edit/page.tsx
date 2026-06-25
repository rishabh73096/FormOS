import { db, forms } from '@repo/db';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from '@/lib/session';
import { redirect, notFound } from 'next/navigation';
import { FormBuilder } from '@/components/builder/form-builder';
import { getUserPlan } from '@/lib/plan-guard';

type Props = { params: Promise<{ id: string }> };

export default async function EditFormPage({ params }: Props) {
  const [session, { id }] = await Promise.all([getServerSession(), params]);
  if (!session) redirect('/login');

  const [form, userPlan] = await Promise.all([
    db.select().from(forms).where(and(eq(forms.id, id), eq(forms.userId, session.user.id))).then(r => r[0]),
    getUserPlan(session.user.id),
  ]);

  if (!form) notFound();

  return <FormBuilder form={form} userPlan={userPlan} />;
}
