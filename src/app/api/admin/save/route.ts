import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { dbSavePage, hasDatabase } from '@/lib/db';

export async function POST(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ ok: false, error: 'Ikke innlogget' }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      { ok: false, error: 'DATABASE_URL er ikke satt. Konfigurer Neon (eller annen Postgres) og legg inn connection string.' },
      { status: 500 }
    );
  }

  let body: { slugPath?: string; title?: string; order?: number; chapterTitle?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Ugyldig JSON' }, { status: 400 });
  }

  const slugPath = typeof body.slugPath === 'string' ? body.slugPath.replace(/\.\./g, '').trim() : '';
  if (!slugPath) {
    return NextResponse.json({ ok: false, error: 'slugPath mangler' }, { status: 400 });
  }

  try {
    await dbSavePage({
      slugPath,
      title: typeof body.title === 'string' ? body.title : '',
      order: typeof body.order === 'number' ? body.order : undefined,
      chapterTitle: typeof body.chapterTitle === 'string' ? body.chapterTitle : undefined,
      body: typeof body.body === 'string' ? body.body : '',
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Ukjent feil';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
