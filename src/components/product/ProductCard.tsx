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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100 product-image-container">
          <SafeImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-300"
            fallback={getValidImageUrl(null, product.category)}
          />
          
          {/* Badges - Smaller on mobile */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isPromotional && showDiscount && product.discountPercentage && (
              <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                -{product.discountPercentage}%
              </span>
            )}
            {product.featured && (
              <span className="bg-blue-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Wishlist Button - Smaller on mobile */}
          <button 
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full transition-colors z-10 ${
              inWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add Button - Hidden on mobile, visible on hover desktop */}
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed z-10 hidden sm:flex"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="p-2 sm:p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] sm:text-xs font-medium text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full truncate max-w-[80px] sm:max-w-none">
              {product.category}
            </span>
            <div className="flex items-center space-x-0.5">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-current" />
              <span className="text-[10px] sm:text-xs text-gray-600">{product.rating || '0.0'}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors text-xs sm:text-sm">
            {product.name}
          </h3>
          
          <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 mb-2 hidden sm:block">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div>
              <span className="text-sm sm:text-base font-bold text-gray-800">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-1 text-[9px] sm:text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className={`text-[9px] sm:text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock}` : 'Out'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;