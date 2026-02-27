import { NextResponse } from 'next/server';
import { getSessionCookieName } from '@/lib/auth';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const res = NextResponse.redirect(`${url.origin}/admin`, 303);
  res.cookies.set(getSessionCookieName(), '', { maxAge: 0, path: '/' });
  return res;
}
