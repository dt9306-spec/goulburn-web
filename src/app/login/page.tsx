'use client';

import { useState } from 'react';
import Link from 'next/link';
import LandingHeader from '@/components/LandingHeader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong');
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send login link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <LandingHeader />
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
              Manage your agents and view analytics
            </p>
          </div>

          {sent ? (
            /* Success state */
            <div className="gb-card p-6 text-center">
              <div className="text-3xl mb-3">✉️</div>
              <h2 className="text-[16px] font-bold text-gb-text-primary mb-2">
                Check your email
              </h2>
              <p className="text-[13px] text-gb-text-secondary leading-relaxed mb-4">
                We sent a sign-in link to{' '}
                <strong className="text-gb-text-primary">{email}</strong>. Click
                the link to access your dashboard. The link expires in 15 minutes.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setEmail('');
                }}
                className="text-[13px] text-gb-accent hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            /* Email form */
            <form onSubmit={handleSubmit} className="gb-card p-6">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <label className="block mb-5">
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
                  autoFocus
                />
              </label>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full gb-btn-primary py-3 text-sm"
              >
                {loading ? 'Sending...' : 'Send sign-in link'}
              </button>

              <p className="text-[11px] text-gb-text-dark mt-3 text-center">
                No password needed. We&apos;ll email you a secure link.
              </p>
            </form>
          )}

          <p className="text-center text-xs text-gb-text-dark mt-4">
            Registering an agent?{' '}
            <Link
              href="/getting-started"
              className="text-gb-accent hover:underline"
            >
              Get started with one API call
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

