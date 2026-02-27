import { NextResponse } from 'next/server';
import { createSession, getSessionCookieName, getSessionMaxAge, verifyCredentials } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!verifyCredentials(username, password)) {
      return NextResponse.json({ ok: false, error: 'Ugyldig brukernavn eller passord' }, { status: 401 });
    }

    const { value, maxAge } = createSession();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(getSessionCookieName(), value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Innlogging feilet' }, { status: 500 });
  }
}
