// src/components/product/AnimatedPrice.tsx
import { useEffect, useState } from 'react';

interface AnimatedPriceProps {
  price: number;
  originalPrice?: number;
  className?: string;
}

export const AnimatedPrice = ({ price, originalPrice, className = '' }: AnimatedPriceProps) => {
  const [displayPrice, setDisplayPrice] = useState(price);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPrice(price);
    }, 300);

    return () => clearTimeout(timer);
  }, [price]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-2xl font-bold text-gray-900 transition-all duration-300">
        \${displayPrice.toFixed(2)}
      </span>
      {originalPrice && (
        <>
          <span className="text-lg text-gray-500 line-through">
            \${originalPrice.toFixed(2)}
          </span>
          <span className="text-sm font-semibold text-green-600">
            Save \${(originalPrice - price).toFixed(2)}
          </span>
        </>
      )}
    </div>
  );
};