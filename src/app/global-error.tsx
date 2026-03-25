'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#020617] text-[#f1f5f9] font-sans flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-[#94a3b8] text-sm mb-6">
            An unexpected error occurred. This has been logged and we&apos;ll
            look into it.
          </p>
          <button
            onClick={reset}
            className="px-6 py-2.5 text-sm font-bold text-white rounded-lg"
            style={{ background: 'linear-gradient(135deg, #e94560, #c73a52)' }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
