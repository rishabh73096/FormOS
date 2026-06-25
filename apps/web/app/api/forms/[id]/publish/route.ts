import { NextRequest, NextResponse } from 'next/server';
import { db, forms } from '@repo/db';
import { eq, and } from 'drizzle-orm';
import { requireSession } from '@/lib/session';

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const [form] = await db
      .select({ isPublished: forms.isPublished })
      .from(forms)
      .where(and(eq(forms.id, id), eq(forms.userId, session.user.id)));

    if (!form) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const [updated] = await db
      .update(forms)
      .set({ isPublished: !form.isPublished, updatedAt: new Date() })
      .where(eq(forms.id, id))
      .returning({ id: forms.id, isPublished: forms.isPublished, publicId: forms.publicId });

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
