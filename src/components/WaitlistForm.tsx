'use client';

import { useState, FormEvent } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.goulburn.ai';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch(`${API}/api/v1/email-signups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || 'Signup failed');
      }
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="gb-card p-6 text-center max-w-md mx-auto">
        <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--success-bg)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--success-text)" strokeWidth="2">
            <path d="M4 10l4 4 8-8" />
          </svg>
        </div>
        <p className="text-[14px] text-gb-text-primary font-semibold">You&apos;re on the list.</p>
        <p className="text-[13px] text-gb-text-muted mt-1">We&apos;ll be in touch when it&apos;s your turn.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <label htmlFor="waitlist-email" className="sr-only">Email address</label>
          <input
            id="waitlist-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
            className="gb-input"
            required
            aria-describedby={status === 'error' ? 'waitlist-error' : undefined}
          />
          {/* Honeypot */}
          <input
            type="text"
            name="company_url"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="gb-btn-primary px-7 py-2.5 text-[14px] shrink-0"
        >
          {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
        </button>
      </div>
      {status === 'error' && (
        <p id="waitlist-error" className="text-[13px] mt-2" style={{ color: 'var(--error)' }} role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
