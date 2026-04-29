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
      className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <Link href={`/products/${product.id}`}>
        {/* Image Container - Compact for mobile */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          <SafeImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            fallback={getValidImageUrl(null, product.category)}
          />
          
          {/* Discount Badge - Small */}
          {product.isPromotional && showDiscount && product.discountPercentage && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
              -{product.discountPercentage}%
            </span>
          )}

          {/* Wishlist Button - Small, transparent on mobile */}
          <button 
            onClick={handleWishlist}
            className={`absolute top-1 right-1 p-1 rounded-full transition-colors z-10 ${
              inWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/70 backdrop-blur-sm text-gray-500'
            }`}
          >
            <Heart className={`w-3 h-3 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Add to Cart Button - Hidden on mobile */}
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="absolute bottom-1 right-1 bg-blue-600 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed z-10 hidden sm:flex"
          >
            <ShoppingCart className="w-3 h-3" />
          </button>
        </div>

        {/* Product Info - Compact */}
        <div className="p-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full truncate max-w-[70px]">
              {product.category}
            </span>
            <div className="flex items-center space-x-0.5">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
              <span className="text-[9px] text-gray-600">{product.rating || '0.0'}</span>
            </div>
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-gray-800 text-xs line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
            {product.name}
          </h3>
          
          {/* Description - Only 1 line on mobile */}
          <p className="text-[9px] text-gray-500 line-clamp-1 mb-1">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-800">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-1 text-[8px] text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className={`text-[8px] ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock}` : 'Out'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;