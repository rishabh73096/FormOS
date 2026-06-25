import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/session';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { Toaster } from '@/components/ui/sonner';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect('/login');

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <DashboardSidebar user={session.user} />
      <main className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: 'var(--background)' }}>
        {children}
      </main>
      <Toaster richColors />
    </div>
  );
}
