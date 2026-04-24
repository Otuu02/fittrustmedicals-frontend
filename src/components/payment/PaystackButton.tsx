'use client';

import { usePaystackPayment } from 'paystack-react-lite';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PaystackButtonProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function PaystackButton({ onSuccess, onClose }: PaystackButtonProps) {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { customer, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Calculate total in kobo (Paystack uses kobo: 1 NGN = 100 kobo)
  const totalInKobo = Math.round((getTotalPrice() || 0) * 100);
  
  // Get customer email
  const customerEmail = customer?.email || 'customer@fittrust.com';
  
  // Generate unique transaction reference
  const generateReference = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `FIT-${timestamp}-${random}`;
  };

  const reference = generateReference();

  const config = {
    reference: reference,
    email: customerEmail,
    amount: totalInKobo,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    currency: 'NGN',
    metadata: {
      custom_fields: [
        {
          display_name: 'Cart Items',
          variable_name: 'cart_items',
          value: JSON.stringify(items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })))
        },
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: customer?.name || 'Guest'
        }
      ]
    },
    onSuccess: (response: any) => {
      console.log('Payment Success:', response);
      
      // Clear cart on successful payment
      clearCart();
      
      // Call custom onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Show success message
      alert(`✅ Payment successful! Reference: ${response.reference}`);
      
      // Redirect to success page or home
      router.push('/payment/success?reference=' + response.reference);
    },
    onClose: () => {
      console.log('Payment modal closed');
      if (onClose) {
        onClose();
      }
    },
  };

  const initializePayment = usePaystackPayment(config);

  if (totalInKobo <= 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
      >
        Cart is empty
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        if (!isAuthenticated) {
          alert('Please login to continue with payment');
          router.push('/login');
          return;
        }
        setLoading(true);
        initializePayment();
        setLoading(false);
      }}
      disabled={loading}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : `Pay ₦${(totalInKobo / 100).toLocaleString()}`}
    </button>
  );
}