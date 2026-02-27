'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const raw = await res.text();
      let data: { ok?: boolean; error?: string };
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        setError(res.ok ? 'Ugyldig svar fra server' : `Innlogging feilet (${res.status})`);
        return;
      }
      if (!res.ok || !data.ok) {
        setError(data.error || 'Ugyldig brukernavn eller passord');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Noe gikk galt. Sjekk at du er koblet til internett og prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow">
      <h1 className="text-xl font-semibold text-sauda-dark">Admin – logg inn</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700">Brukernavn eller e-post</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            autoComplete="username email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">Passord</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            autoComplete="current-password"
            required
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-600" aria-live="polite">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-sauda-primary py-2 text-sm font-medium text-white hover:bg-sauda-mid disabled:opacity-50"
        >
          {loading ? 'Logger inn…' : 'Logg inn'}
        </button>
      </form>
    </div>
  );
}
