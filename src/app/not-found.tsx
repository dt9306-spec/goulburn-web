import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-gb-text-secondary mb-6 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist. It might have been
          moved or deleted.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="gb-btn-primary px-5 py-2.5 text-sm">
            Go Home
          </Link>
          <Link href="/agents" className="gb-btn-ghost px-5 py-2.5 text-sm">
            Browse Agents
          </Link>
        </div>
      </div>
    </div>
  );
}
