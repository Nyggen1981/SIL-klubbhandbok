import { NextResponse } from 'next/server';
import { createSession, getSessionCookieName, getSessionMaxAge, verifyCredentials } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: 'Brukernavn og passord må fylles ut' }, { status: 400 });
    }

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: 'Admin er ikke konfigurert (ADMIN_PASSWORD mangler på server)' }, { status: 503 });
    }

    if (!verifyCredentials(username, password)) {
      return NextResponse.json({ ok: false, error: 'Ugyldig brukernavn eller passord' }, { status: 401 });
    }

    const { value, maxAge } = createSession();
    const res = NextResponse.json({ ok: true });
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookies.set(getSessionCookieName(), value, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge,
      path: '/',
    });
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Innlogging feilet' }, { status: 500 });
  }
}
