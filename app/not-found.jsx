import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pb-bg flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl font-bold font-mono bg-gradient-to-r from-pb-green to-pb-orange bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-pb-text-muted mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
