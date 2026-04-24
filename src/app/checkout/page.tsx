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
import { formatPrice } from '@/lib/utils';
import { CreditCard, Truck, Lock, Building2, User } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  businessName: string;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const customer = useAuthStore((state) => state.customer);
  
  const [isMounted, setIsMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
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
    postalCode: '',
    country: 'Nigeria',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: customer?.name || '',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate totals in Naira
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 0; // FREE SHIPPING - Removed shipping method
  const tax = parseFloat((subtotal * 0.075).toFixed(2)); // 7.5% VAT
  const total = subtotal + shipping + tax;

  // Format price in Naira
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
    if (!formData.street || !formData.city || !formData.postalCode) {
      setError('Please fill in complete address');
      return false;
    }
    setError(null);
    return true;
  };

  const validatePayment = () => {
    if (!formData.cardholderName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      setError('Please fill in all payment details');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNextStep = () => {
    if (activeStep === 1 && validateShipping()) {
      setActiveStep(2);
    } else if (activeStep === 2 && validatePayment()) {
      setActiveStep(3);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!validatePayment()) {
        return;
      }

      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearCart();
      router.push(`/order-confirmation?orderId=${Date.now()}&amount=${total}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Review' },
            ].map((step) => (
              <div key={step.num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    activeStep >= step.num ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  {step.num}
                </div>
                <span className={`ml-2 font-medium ${activeStep >= step.num ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.label}
                </span>
                {step.num < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      activeStep > step.num ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder}>
              {activeStep >= 1 && (
                <Card className={`mb-6 ${activeStep !== 1 && 'opacity-50'}`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Truck size={24} />
                    Shipping Address
                  </h2>

                  {activeStep === 1 && (
                    <div className="space-y-4">
                      {/* Updated: Business Name + Full Name instead of First/Last Name */}
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
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Postal Code"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          label="Country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      {/* SHIPPING METHOD SECTION - REMOVED */}
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
                        onClick={handleNextStep}
                        className="mt-6"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}

                  {activeStep > 1 && (
                    <div className="text-sm text-gray-600 space-y-1">
                      {formData.businessName && (
                        <p className="font-medium text-gray-800">{formData.businessName}</p>
                      )}
                      <p>{formData.fullName}</p>
                      <p>{formData.street}</p>
                      <p>{formData.city}, {formData.state} {formData.postalCode}</p>
                      <p className="mt-3 text-green-600 font-medium">🚚 Free Shipping (3-5 business days)</p>
                    </div>
                  )}
                </Card>
              )}

              {activeStep >= 2 && (
                <Card className={`mb-6 ${activeStep !== 2 && 'opacity-50'}`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard size={24} />
                    Payment Information
                  </h2>

                  {activeStep === 2 && (
                    <div className="space-y-4">
                      <Input
                        label="Cardholder Name"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Card Number"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Expiry Date"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          label="CVV"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                        <Lock size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          Your payment information is secure and encrypted. We never store your card details.
                        </div>
                      </div>

                      <div className="flex gap-4 pt-6">
                        <Button
                          variant="secondary"
                          fullWidth
                          size="lg"
                          onClick={() => setActiveStep(1)}
                        >
                          Back
                        </Button>
                        <Button
                          fullWidth
                          size="lg"
                          onClick={handleNextStep}
                        >
                          Review Order
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeStep > 2 && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Card ending in {formData.cardNumber.slice(-4)}</p>
                      <p className="text-xs text-gray-500 mt-1">Cardholder: {formData.cardholderName}</p>
                    </div>
                  )}
                </Card>
              )}

              {activeStep === 3 && (
                <Card>
                  <h2 className="text-2xl font-bold mb-6">Order Review</h2>

                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-bold mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{formatNaira(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-bold mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {formData.businessName && (
                        <><span className="font-medium">{formData.businessName}</span><br /></>
                      )}
                      {formData.fullName}<br />
                      {formData.street}<br />
                      {formData.city}, {formData.state} {formData.postalCode}<br />
                      {formData.country}
                    </p>
                    <p className="text-sm text-green-600 mt-2">🚚 Free Shipping (3-5 business days)</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Payment Method</h3>
                    <p className="text-sm text-gray-600">
                      {formData.cardholderName}<br />
                      Card ending in {formData.cardNumber.slice(-4)}
                    </p>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      variant="secondary"
                      fullWidth
                      size="lg"
                      onClick={() => setActiveStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      isLoading={loading}
                      onClick={handleSubmitOrder}
                    >
                      Place Order
                    </Button>
                  </div>
                </Card>
              )}
            </form>
          </div>

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
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (7.5% VAT)</span>
                  <span>{formatNaira(tax)}</span>
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