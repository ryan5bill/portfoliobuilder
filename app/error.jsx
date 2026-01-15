'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-pb-bg flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-pb-text-muted mb-6">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="btn btn-primary">
            Try Again
          </button>
          <a href="/" className="btn btn-secondary">
            Go Home
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-8 p-4 bg-pb-bg-card rounded-lg text-left text-xs text-red-400 overflow-auto">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  );
}
