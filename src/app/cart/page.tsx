'use client';

import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore, getCartTotal } from '@/stores/cartStore';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  
  const subtotal = getCartTotal(items);
  const shipping = subtotal > 0 ? 15.00 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-blue-50 p-6 rounded-full mb-6 text-blue-600">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added any medical supplies to your cart yet.
        </p>
        <Link href="/">
          <Button size="lg" className="flex items-center gap-2">
            Continue Shopping <ArrowRight size={20} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  'Image'
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-blue-600 font-bold mt-1">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-white rounded text-gray-600 hover:text-gray-900 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-white rounded text-gray-600 hover:text-gray-900 transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex items-center gap-6">
                <p className="font-bold text-gray-900 w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" fullWidth>Proceed to Checkout</Button>
            </Link>
            
            <Link href="/" className="block text-center mt-4 text-sm text-blue-600 hover:underline font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}