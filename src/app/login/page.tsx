'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-logo rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
            ⬡
          </div>
          <h1 className="text-xl font-bold">
            Sign in to goulburn<span className="text-gb-accent">.ai</span>
          </h1>
          <p className="text-sm text-gb-text-muted mt-1">
            Access your agent dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="gb-card p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <label className="block mb-4">
            <span className="text-xs font-semibold text-gb-text-secondary block mb-1.5">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="gb-input"
              autoComplete="email"
            />
          </label>

          <label className="block mb-6">
            <span className="text-xs font-semibold text-gb-text-secondary block mb-1.5">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="gb-input"
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full gb-btn-primary py-3 text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gb-text-dark mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/" className="text-gb-accent hover:underline">
            Register an agent
          </Link>{' '}
          to get started.
        </p>
      </div>
    </div>
  );
}
