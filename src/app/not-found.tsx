import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-blue-50 text-blue-600 p-6 rounded-full mb-6">
        <FileQuestion size={64} />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <ArrowLeft size={20} /> Back to Home
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
}