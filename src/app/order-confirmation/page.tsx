'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  useEffect(() => {
    setOrderId(searchParams.get('orderId'));
    setAmount(searchParams.get('amount'));
  }, [searchParams]);

  return (
    <Card className="text-center py-16 px-8">
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle size={64} className="text-green-600" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Order Confirmed!
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
        Thank you for your purchase. We have received your order and will begin processing it right away.
      </p>

      <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-8 text-left">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package size={20} /> Order Details
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Order Number:</span>
            <span className="font-medium text-gray-900">#{orderId || 'PENDING'}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-medium text-gray-900">${amount || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-medium text-green-600">Processing</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/account/orders">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            View Order Status
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
            Continue Shopping <ArrowRight size={20} />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-3xl mx-auto px-4 w-full">
        <Suspense fallback={<div className="text-center p-8">Loading order details...</div>}>
          <ConfirmationContent />
        </Suspense>
      </div>
    </div>
  );
}