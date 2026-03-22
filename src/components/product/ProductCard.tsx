'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
  rating: number;
  reviews: number;
}

interface ProductCardProps {
  product: Product;
  onAddSuccess?: () => void;
}

export function ProductCard({ product, onAddSuccess }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      } as any);
      onAddSuccess?.();
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 overflow-hidden group flex items-center justify-center">
        <span className="text-gray-500 text-center text-sm font-medium">{product.name}</span>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
      </div>

      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10"
      >
        <Heart
          size={20}
          className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
        />
      </button>

      <div className="absolute top-4 left-4">
        <Badge label={product.category} variant="primary" />
      </div>

      <div className="flex-grow space-y-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviews})
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t mt-4">
        <div>
          <p className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</p>
          <p className="text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          isLoading={isAdding}
          className="flex items-center gap-2"
        >
          <ShoppingCart size={16} />
          Add
        </Button>
      </div>
    </Card>
  );
}