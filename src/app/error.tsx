'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <Card className="text-center py-16 max-w-md">
        <AlertCircle size={64} className="mx-auto text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
        <p className="text-gray-600 mb-2 text-sm">{error.message}</p>
        <p className="text-xs text-gray-500 mb-8">
          {error.digest && `Error ID: ${error.digest}`}
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={reset} fullWidth>
            Try Again
          </Button>
          <Button href="/" variant="secondary" fullWidth>
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  );
}