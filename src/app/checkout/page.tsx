'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { Truck, Lock, Building2, User } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  businessName: string;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const customer = useAuthStore((state) => state.customer);
  
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    fullName: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    street: '',
    city: '',
    state: '',
    country: 'Nigeria',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate totals - No Tax, No Shipping
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal; // No tax, no shipping

  const formatNaira = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.street || !formData.city) {
      setError('Please fill in complete address');
      return false;
    }
    setError(null);
    return true;
  };

  // Initialize Paystack Payment
  const handlePayment = () => {
    if (!validateShipping()) {
      return;
    }

    setLoading(true);
    
    const totalInKobo = Math.round(total * 100);
    const reference = `FIT-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
      setError('Payment configuration error. Please try again later.');
      setLoading(false);
      return;
    }

    // Load Paystack script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      const handler = (window as any).PaystackPop.setup({
        key: publicKey,
        email: formData.email,
        amount: totalInKobo,
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: 'Customer Name',
              variable_name: 'customer_name',
              value: formData.fullName
            },
            {
              display_name: 'Business Name',
              variable_name: 'business_name',
              value: formData.businessName || 'N/A'
            },
            {
              display_name: 'Address',
              variable_name: 'address',
              value: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}`
            },
            {
              display_name: 'Cart Items',
              variable_name: 'cart_items',
              value: JSON.stringify(items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })))
            }
          ]
        },
        onSuccess: (response: any) => {
          console.log('Payment Success:', response);
          clearCart();
          alert(`✅ Payment successful! Reference: ${response.reference}`);
          router.push('/order-confirmation?reference=' + response.reference);
          setLoading(false);
        },
        onCancel: () => {
          console.log('Payment cancelled');
          setLoading(false);
        },
      });
      
      handler.openIframe();
    };
    
    script.onerror = () => {
      alert('Failed to load payment gateway. Please check your internet connection.');
      setLoading(false);
    };
    
    document.body.appendChild(script);
  };

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Card className="text-center py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Add items to your cart before checking out
            </p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
            { label: 'Checkout' },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Truck size={24} />
                Shipping Address
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Business Name"
                    name="businessName"
                    placeholder="Your business name (optional)"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    icon={<Building2 size={16} />}
                  />
                  <Input
                    label="Full Name"
                    name="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    icon={<User size={16} />}
                  />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Street Address"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="State/Province"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />

                {/* Free shipping notice */}
                <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 mt-4">
                  <Truck size={20} className="text-green-600" />
                  <div className="text-sm text-green-700">
                    🚚 FREE Shipping on all orders! Your order will be delivered within 3-5 business days.
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={handlePayment}
                  isLoading={loading}
                  className="mt-6"
                >
                  {loading ? 'Processing...' : `Pay ${formatNaira(total)}`}
                </Button>
              </div>
            </Card>
          </div>

          {/* Order Summary - No Tax, No Shipping */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 space-y-6">
              <h3 className="text-xl font-bold">Order Summary</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto border-b pb-4">
                {items.map((item) => (
                  <div key={item.id} className="text-sm">
                    <div className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-medium">{formatNaira(item.price)}</span>
                    </div>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">{formatNaira(total)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-xs text-gray-600">
                <p>✓ Secure Checkout</p>
                <p>✓ Money Back Guarantee</p>
                <p>✓ Free Returns</p>
                <p>✓ Free Shipping on all orders</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}