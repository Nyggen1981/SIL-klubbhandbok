import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dager

function getSecret(): string {
  const s = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error('ADMIN_SECRET or ADMIN_PASSWORD must be set');
  return s;
}

export function createSession(): { value: string; maxAge: number } {
  const payload = JSON.stringify({ t: Date.now() });
  const secret = getSecret();
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const value = Buffer.from(`${payload}.${sig}`).toString('base64url');
  return { value, maxAge: MAX_AGE };
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return false;
  try {
    const decoded = Buffer.from(cookie.value, 'base64url').toString('utf-8');
    const [payload, sig] = decoded.split('.');
    if (!payload || !sig) return false;
    const secret = getSecret();
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (sig !== expected) return false;
    const data = JSON.parse(payload) as { t: number };
    if (Date.now() - data.t > MAX_AGE * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

export function getSessionMaxAge(): number {
  return MAX_AGE;
}

export function verifyCredentials(usernameOrEmail: string, password: string): boolean {
  const wantUser = process.env.ADMIN_USERNAME || 'admin';
  const wantEmail = process.env.ADMIN_EMAIL || '';
  const wantPass = process.env.ADMIN_PASSWORD;
  if (!wantPass) return false;
  const loginOk = usernameOrEmail === wantUser || (wantEmail !== '' && usernameOrEmail === wantEmail);
  return loginOk && password === wantPass;
}
