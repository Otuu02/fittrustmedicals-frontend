'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<Partial<Product>>({});

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('📡 Fetching product with ID:', productId);
        
        const response = await fetch('/api/catalog/products');
        const data = await response.json();
        
        let products = [];
        if (data.success && data.products) {
          products = data.products;
        } else if (Array.isArray(data)) {
          products = data;
        } else if (data.products) {
          products = data.products;
        }
        
        const product = products.find((p: Product) => p.id === productId);
        
        if (product) {
          setFormData(product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    } else {
      setError('Invalid product ID');
      setLoading(false);
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Prepare the update data with the ID
    const updateData = {
      id: productId,  // Send the ID in the body
      name: formData.name,
      price: formData.price,
      originalPrice: formData.originalPrice,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      stock: formData.stock,
      isPromotional: formData.isPromotional,
      discountPercentage: formData.discountPercentage,
      featured: formData.featured,
      status: formData.status || 'active',
    };

    console.log('📤 Sending update data:', updateData);

    try {
      const response = await fetch('/api/catalog/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      console.log('📥 Update response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      setSuccess('Product updated successfully!');
      
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
      
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        {productId && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            ID: {productId}
          </span>
        )}
      </div>
      
      {error && (
        <Alert type="error" message={error} className="mb-4" onClose={() => setError('')} />
      )}
      
      {success && (
        <Alert type="success" message={success} className="mb-4" onClose={() => setSuccess('')} />
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            name="name"
            required
            value={formData.name || ''}
            onChange={handleChange}
          />
          
          <Input
            label="Price (₦)"
            name="price"
            type="number"
            step="0.01"
            required
            value={formData.price || ''}
            onChange={handleChange}
          />
          
          <Input
            label="Original Price (₦)"
            name="originalPrice"
            type="number"
            step="0.01"
            value={formData.originalPrice || ''}
            onChange={handleChange}
          />
          
          <Input
            label="Category"
            name="category"
            required
            value={formData.category || ''}
            onChange={handleChange}
          />
          
          <Input
            label="Stock Quantity"
            name="stock"
            type="number"
            required
            value={formData.stock || ''}
            onChange={handleChange}
          />
          
          <Input
            label="Discount Percentage"
            name="discountPercentage"
            type="number"
            value={formData.discountPercentage || ''}
            onChange={handleChange}
          />
          
          <Input
            label="Image URL"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            required
            value={formData.description || ''}
            onChange={handleChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPromotional"
              checked={formData.isPromotional || false}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Mark as Promotional</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured || false}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Mark as Featured</span>
          </label>
        </div>
        
        <div className="flex gap-4 pt-4">
          <Button type="submit" isLoading={saving}>
            Save Changes
          </Button>
          
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}