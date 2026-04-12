'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard
} from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const { getOrderById } = useAuthStore();
  const order = getOrderById(params.id as string);

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
        <Link href="/account/orders" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const trackingSteps = [
    { status: 'pending', label: 'Order Placed', icon: Clock },
    { status: 'payment_pending', label: 'Payment Pending', icon: CreditCard },
    { status: 'processing', label: 'Processing', icon: Package },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = trackingSteps.findIndex(step => step.status === order.status);

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
        <p className="text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-8">
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.status} className="relative flex items-start">
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  }`}>
                    <Icon className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="ml-12">
                    <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-blue-600 mt-1">Current Status</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900">₦{(item.quantity * item.price).toLocaleString()}</p>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Delivery Address</p>
                <p className="text-sm text-gray-600 mt-1">
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                  {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                </p>
              </div>
            </div>
            {order.trackingNumber && (
              <div className="flex items-start space-x-3">
                <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Tracking Number</p>
                  <p className="text-sm text-gray-600 mt-1">{order.trackingNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}