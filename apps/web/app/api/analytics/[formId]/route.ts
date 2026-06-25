import { NextRequest, NextResponse } from 'next/server';
import { db, forms, analyticsEvents, responses } from '@repo/db';
import { eq, and, gte, count, sql } from 'drizzle-orm';
import { requireSession } from '@/lib/session';

type Params = { params: Promise<{ formId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { formId } = await params;

    const [form] = await db
      .select({ viewCount: forms.viewCount, responseCount: forms.responseCount })
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.userId, session.user.id)));

    if (!form) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Submissions per day for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySubmissions = await db
      .select({
        date: sql<string>`date_trunc('day', ${responses.submittedAt})::date::text`,
        count: count(),
      })
      .from(responses)
      .where(and(eq(responses.formId, formId), gte(responses.submittedAt, thirtyDaysAgo)))
      .groupBy(sql`date_trunc('day', ${responses.submittedAt})`);

    const conversionRate =
      form.viewCount > 0 ? ((form.responseCount / form.viewCount) * 100).toFixed(1) : '0';

    return NextResponse.json({
      data: {
        viewCount: form.viewCount,
        responseCount: form.responseCount,
        conversionRate,
        dailySubmissions,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// Track a view event (called from the public form page)
export async function POST(_req: NextRequest, { params }: Params) {
  const { formId } = await params;

  await db.insert(analyticsEvents).values({ formId, type: 'view' });
  await db
    .update(forms)
    .set({ viewCount: sql`${forms.viewCount} + 1` })
    .where(eq(forms.id, formId));

  return NextResponse.json({ ok: true });
}
