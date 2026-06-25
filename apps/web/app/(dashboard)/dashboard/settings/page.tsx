import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { SettingsClient } from '@/components/dashboard/settings-client';
import { getUserPlan } from '@/lib/plan-guard';

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const userPlan = await getUserPlan(session.user.id);

  return (
    <SettingsClient
      user={{
        id:    session.user.id,
        name:  session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }}
      userPlan={userPlan}
    />
  );
}
