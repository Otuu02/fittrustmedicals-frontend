// src/hooks/useProduct.ts
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

// Match this with your API Product type
export interface Product {
  id: string;
  slug: string; // You'll need to generate this from name or API should return it
  name: string;
  description: string;
  price: number; // Convert from priceCents
  originalPrice?: number;
  image: string; // Use first image from imageUrls
  category?: string;
  stock: number;
  rating?: number;
  reviews?: number;
  sku?: string;
  currency?: string;
  imageUrls?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const useProduct = (slug?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.products.getBySlug(slug);
        
        // Transform API response to match your Product interface
        const apiProduct = response.data;
        const transformedProduct: Product = {
          id: apiProduct.id,
          slug: slug, // or apiProduct.slug if available
          name: apiProduct.name,
          description: apiProduct.description,
          price: apiProduct.priceCents / 100, // Convert cents to dollars
          image: apiProduct.imageUrls?.[0] || '', // Use first image
          category: apiProduct.category,
          stock: apiProduct.stock,
          sku: apiProduct.sku,
          currency: apiProduct.currency,
          imageUrls: apiProduct.imageUrls,
          isActive: apiProduct.isActive,
          createdAt: apiProduct.createdAt,
          updatedAt: apiProduct.updatedAt,
        };
        
        setProduct(transformedProduct);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};