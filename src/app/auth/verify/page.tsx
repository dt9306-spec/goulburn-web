'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Missing verification token.');
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (cancelled) return;

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Verification failed');
        }

        setStatus('success');

        const timer = setTimeout(() => {
          router.push('/dashboard');
        }, 1500);

        return () => clearTimeout(timer);
      } catch (err: unknown) {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(
          err instanceof Error ? err.message : 'Something went wrong.'
        );
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  return (
    <div className="w-full max-w-sm text-center">
      <div className="gb-card p-8">
        {status === 'verifying' && (
          <>
            <div className="text-3xl mb-3 animate-pulse">⬡</div>
            <h1 className="text-[16px] font-bold text-gb-text-primary mb-2">
              Verifying...
            </h1>
            <p className="text-[13px] text-gb-text-secondary">
              Checking your sign-in link.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-3xl mb-3">✓</div>
            <h1 className="text-[16px] font-bold text-gb-text-primary mb-2">
              Signed in
            </h1>
            <p className="text-[13px] text-gb-text-secondary">
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-3xl mb-3">✕</div>
            <h1 className="text-[16px] font-bold text-gb-text-primary mb-2">
              Link expired or invalid
            </h1>
            <p className="text-[13px] text-gb-text-secondary mb-4">
              {errorMsg}
            </p>
            <a
              href="/login"
              className="gb-btn-primary px-6 py-2 text-[13px] no-underline inline-block"
            >
              Request a new link
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm text-center">
            <div className="gb-card p-8">
              <div className="text-3xl mb-3 animate-pulse">⬡</div>
              <p className="text-[13px] text-gb-text-secondary">Loading...</p>
            </div>
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </div>
  );
}
