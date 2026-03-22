import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
      <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
      <p className="text-gray-500 text-sm mt-2">Preparing your medical supplies</p>
    </div>
  );
}