import { NextRequest, NextResponse } from 'next/server';
import { db, forms } from '@repo/db';
import { eq, desc } from 'drizzle-orm';
import { createFormSchema } from '@repo/validators';
import { DEFAULT_THEME, DEFAULT_SETTINGS } from '@repo/types';
import { nanoid } from 'nanoid';
import { requireSession } from '@/lib/session';
import { getUserPlan, checkFormLimit } from '@/lib/plan-guard';

export async function GET() {
  try {
    const session = await requireSession();

    const userForms = await db
      .select()
      .from(forms)
      .where(eq(forms.userId, session.user.id))
      .orderBy(desc(forms.createdAt));

    return NextResponse.json({ data: userForms });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();

    // Plan check
    const plan = await getUserPlan(session.user.id);
    const limit = await checkFormLimit(session.user.id, plan);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `You've reached the ${limit.limit}-form limit on the Free plan. Upgrade to Pro for unlimited forms.`,
          code: 'PLAN_LIMIT_FORMS',
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const input = createFormSchema.parse(body);

    const [form] = await db
      .insert(forms)
      .values({
        userId: session.user.id,
        title: input.title,
        description: input.description,
        fields: [],
        theme: DEFAULT_THEME,
        settings: DEFAULT_SETTINGS,
        publicId: nanoid(),
      })
      .returning();

    return NextResponse.json({ data: form }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create form' }, { status: 400 });
  }
}
