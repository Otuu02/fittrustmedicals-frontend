'use client';

import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

const categoryPlaceholders: Record<string, string> = {
  'Diagnostic': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400',
  'PPE': 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400',
  'Surgical': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400',
  'Patient Care': 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=400',
  'Pharmacy': 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400',
};

const defaultPlaceholder = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400';

export function getValidImageUrl(src: string | null | undefined, category?: string): string {
  // If it's already a valid URL (http or data URI)
  if (src && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:'))) {
    return src;
  }
  
  // If it's a local file path that failed, use category placeholder
  if (category && categoryPlaceholders[category]) {
    return categoryPlaceholders[category];
  }
  
  // Final fallback
  return defaultPlaceholder;
}

export default function SafeImage({ src, alt, className = '', fallback }: SafeImageProps) {
  const [error, setError] = useState(false);
  
  // Get valid URL on first render
  const validSrc = error && fallback ? fallback : getValidImageUrl(src);
  
  return (
    <img
      src={validSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!error) {
          console.log('Image failed, using fallback:', alt);
          setError(true);
        }
      }}
    />
  );
}