'use client';

import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import SafeImage, { getValidImageUrl } from '@/components/ui/SafeImage';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  status: string;
  isPromotional?: boolean;
  discountPercentage?: number;
  featured?: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductCardProps {
  product: Product;
  showDiscount?: boolean;
  onAddSuccess?: () => void;
}

export function ProductCard({ product, showDiscount, onAddSuccess }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isAuthenticated, addToWishlist, removeFromWishlist, isInWishlist } = useAuthStore();
  
  const inWishlist = isInWishlist(product.id);
  const [imageError, setImageError] = useState(false);

  const imageUrl = imageError 
    ? getValidImageUrl(null, product.category)
    : getValidImageUrl(product.image, product.category);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: imageUrl,
      category: product.category,
      maxStock: product.stock,
    });
    
    onAddSuccess?.();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const formatPrice = (price: number) => {
    if (!price && price !== 0) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <SafeImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            fallback={getValidImageUrl(null, product.category)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isPromotional && showDiscount && product.discountPercentage && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                -{product.discountPercentage}%
              </span>
            )}
            {product.featured && (
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button 
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              inWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add Button */}
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating || '0.0'}</span>
            </div>
          </div>
          
          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-800">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;