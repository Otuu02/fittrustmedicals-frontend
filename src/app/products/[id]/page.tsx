// src/app/products/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useCartStore } from '@/stores/cartStore';
import { Star, Heart, ShoppingCart, Truck, Shield, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [adding, setAdding] = useState(false);

  // Mock product data (replace with API call)
  const product = {
    id: params.id as string,
    name: 'Digital Thermometer',
    price: 29.99,
    description: 'Accurate digital thermometer for home and professional use. Features fast readings, memory recall, and fever alerts.',
    longDescription: `This premium digital thermometer provides clinical accuracy in seconds. Perfect for home use, medical professionals, or traveling families. 
    
    Features include:
    • Fast 10-second readings
    • Memory recall for last 10 readings
    • Fever alert with beep
    • Auto shut-off
    • Waterproof tip for easy cleaning
    • Comes with protective case`,
    image: '/placeholder.jpg',
    stock: 50,
    category: 'Diagnostics',
    rating: 4.8,
    reviews: 120,
    sku: 'THERM-001',
    brand: 'MedTech Pro',
  };

  const handleAddToCart = () => {
    setAdding(true);
    addItem({
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
    });
    setTimeout(() => {
      setAdding(false);
      router.push('/cart');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: product.name },
          ]}
        />

        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 mt-4"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
              <span className="text-gray-500 text-lg">Product Image</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <Badge label={product.category} variant="primary" className="mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-2">
                Stock: <span className={product.stock > 10 ? 'text-green-600' : 'text-orange-600'}>
                  {product.stock} available
                </span>
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{product.longDescription}</p>
            </div>

            {/* Product Details */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Button
                size="lg"
                onClick={handleAddToCart}
                isLoading={adding}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <Heart
                  size={20}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="text-blue-600" size={24} />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-blue-600" size={24} />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <Card className="p-6">
            <p className="text-gray-600 text-center py-8">Reviews coming soon...</p>
          </Card>
        </div>
      </div>
    </div>
  );
}