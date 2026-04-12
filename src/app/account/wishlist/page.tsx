'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

// Mock products data - replace with your actual product fetching logic
const mockProducts = [
  { id: '1', name: 'Digital Blood Pressure Monitor', price: 25000, image: '/products/bp-monitor.jpg' },
  { id: '2', name: 'Stethoscope Pro', price: 15000, image: '/products/stethoscope.jpg' },
];

export default function WishlistPage() {
  const { customer, removeFromWishlist, isInWishlist } = useAuthStore();

  const wishlistProducts = mockProducts.filter(p => isInWishlist(p.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-500 mt-1">Products you've saved for later</p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Your wishlist is empty</p>
          <Link 
            href="/products" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:underline mt-4"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-blue-600 mb-4">₦{product.price.toLocaleString()}</p>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}