'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatters } from '@/lib/formatters'
import { useProductsStore } from '@/stores/productsStore'
import { Heart, Package, DollarSign, Warehouse } from 'lucide-react'

const CATEGORIES = [
  'diagnostics',
  'monitoring', 
  'emergency',
  'mobility',
  'respiratory',
  'surgical',
  'protective',
  'pharmacy'
]

interface UploadedImage {
  url: string
  filename: string
  size: number
  type: string
}

export default function QuickAddProductPage() {
  const router = useRouter()
  const { addProduct } = useProductsStore()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'diagnostics',
    stock: '',
    image_url: ''
  })
  
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (image: UploadedImage) => {
    setFormData(prev => ({
      ...prev,
      image_url: image.url
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Convert price to Naira
      const priceInNaira = formatters.usdToNaira(parseFloat(formData.price) || 0)
      
      // Create product data matching the store's expected interface
      const productData = {
        name: formData.name,
        description: formData.description,
        price: priceInNaira,
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        image: formData.image_url || '/images/placeholder-product.jpg', // Changed from image_url to image
        status: 'active' as const, // Added required field
        specifications: {}, // Added required field (empty object for now)
        // Optional fields
        originalPrice: undefined,
        isPromotional: false,
        discountPercentage: 0,
        featured: true,
      }

      // Call store action directly - it handles id, createdAt, updatedAt, salesCount, rating, reviewCount
      const newProduct = await addProduct(productData)
        
      setSuccess(true)
        
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'diagnostics',
        stock: '',
        image_url: ''
      })

      // Show success message for 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)

      // Notify homepage to refresh (broadcast)
      window.dispatchEvent(new CustomEvent('productAdded', { 
        detail: newProduct 
      }))

    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-full p-3">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Quick Add Product</h1>
            <p className="text-blue-100 mt-1">Add new medical equipment to your store instantly</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Product Added Successfully!</h4>
              <p className="text-green-600">Your product is now live on the homepage and available for customers.</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Product Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Digital Thermometer, Blood Pressure Monitor"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Detailed product description..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Price (USD) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="29.99"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {formData.price && (
                <p className="text-sm text-green-600 mt-1">
                  ≈ {formatters.currency(formatters.usdToNaira(parseFloat(formData.price) || 0))} Nigerian Naira
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <div className="relative">
                <Warehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="50"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {formatters.medicalCategory(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Image</h2>
          
          {/* Current Image Preview */}
          {formData.image_url && (
            <div className="mb-6">
              <Badge label="Selected Image" variant="success" className="mb-3" />
              <div className="relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden border">
                <img 
                  src={formData.image_url} 
                  alt="Selected product"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <ImageUploader
            category="medical"
            onUploadSuccess={handleImageUpload}
            maxFiles={1}
          />
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>* Required fields</p>
              <p>Product will be instantly available on the homepage after submission.</p>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/products/list')}
                className="min-w-[120px]"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={uploading || !formData.name || !formData.price || !formData.description}
                className="min-w-[160px]"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Adding Product...
                  </>
                ) : (
                  'Add Product to Store'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}