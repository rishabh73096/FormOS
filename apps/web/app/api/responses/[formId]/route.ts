import { NextRequest, NextResponse } from 'next/server';
import { db, forms, responses, analyticsEvents } from '@repo/db';
import { eq, and, desc } from 'drizzle-orm';
import { submitResponseSchema } from '@repo/validators';
import { requireSession } from '@/lib/session';
import { getUserPlan, checkResponseLimit } from '@/lib/plan-guard';

type Params = { params: Promise<{ formId: string }> };

// GET — owner fetches responses for their form
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { formId } = await params;

    const [form] = await db
      .select({ id: forms.id })
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.userId, session.user.id)));

    if (!form) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const data = await db
      .select()
      .from(responses)
      .where(eq(responses.formId, formId))
      .orderBy(desc(responses.submittedAt));

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// POST — public submission (no auth required)
export async function POST(req: NextRequest, { params }: Params) {
  const { formId } = await params;

  const [form] = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, formId), eq(forms.isPublished, true)));

  if (!form) {
    return NextResponse.json({ error: 'Form not found or not published' }, { status: 404 });
  }

  // Check expiry
  if (form.settings.expiresAt && new Date(form.settings.expiresAt) < new Date()) {
    return NextResponse.json({ error: 'Form has expired' }, { status: 410 });
  }

  // Check max responses (form setting)
  if (form.settings.maxResponses && form.responseCount >= form.settings.maxResponses) {
    return NextResponse.json({ error: 'Form response limit reached' }, { status: 410 });
  }

  // Check plan response limit for the form owner
  const ownerPlan = await getUserPlan(form.userId);
  const planCheck = checkResponseLimit(ownerPlan, form.responseCount);
  if (!planCheck.allowed) {
    return NextResponse.json(
      { error: 'This form has reached its response limit. The owner needs to upgrade to Pro.' },
      { status: 429 },
    );
  }

  const body = await req.json();
  const input = submitResponseSchema.parse(body);

  const userAgent = req.headers.get('user-agent') ?? undefined;
  const referrer = req.headers.get('referer') ?? undefined;

  const [response] = await db
    .insert(responses)
    .values({
      formId,
      values: input.values,
      metadata: { userAgent, referrer },
    })
    .returning();

  // Increment counter
  await db
    .update(forms)
    .set({ responseCount: form.responseCount + 1, updatedAt: new Date() })
    .where(eq(forms.id, formId));

  // Track analytics event
  await db.insert(analyticsEvents).values({
    formId,
    type: 'submit',
    metadata: { userAgent },
  });

  return NextResponse.json({ data: { id: response?.id } }, { status: 201 });
}
