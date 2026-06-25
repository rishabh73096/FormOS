import { NextRequest, NextResponse } from 'next/server';
import { db, forms } from '@repo/db';
import { eq, and } from 'drizzle-orm';
import { updateFormSchema } from '@repo/validators';
import { requireSession } from '@/lib/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const [form] = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, id), eq(forms.userId, session.user.id)));

    if (!form) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: form });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const body = await req.json();
    const input = updateFormSchema.parse(body);

    const [updated] = await db
      .update(forms)
      .set({ ...input, updatedAt: new Date() })
      .where(and(eq(forms.id, id), eq(forms.userId, session.user.id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update form' }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const [deleted] = await db
      .delete(forms)
      .where(and(eq(forms.id, id), eq(forms.userId, session.user.id)))
      .returning({ id: forms.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: { id: deleted.id } });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
