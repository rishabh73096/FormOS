import { db, users, forms } from '@repo/db';
import { eq, count } from 'drizzle-orm';
import { getPlan, PLANS } from './plans';
import type { Plan } from './plans';

export async function getUserPlan(userId: string): Promise<Plan> {
  const [user] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId));
  return getPlan(user?.plan ?? 'free');
}

export async function checkFormLimit(
  userId: string,
  plan: Plan,
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const limit = PLANS[plan].maxForms;
  if (limit === Infinity) return { allowed: true, current: 0, limit: Infinity };

  const [row] = await db
    .select({ total: count() })
    .from(forms)
    .where(eq(forms.userId, userId));

  const current = row?.total ?? 0;
  return { allowed: current < limit, current, limit };
}

export function checkResponseLimit(
  plan: Plan,
  currentCount: number,
): { allowed: boolean; limit: number } {
  const limit = PLANS[plan].maxResponsesPerForm;
  return { allowed: limit === Infinity || currentCount < limit, limit };
}
