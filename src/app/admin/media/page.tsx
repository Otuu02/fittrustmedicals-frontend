'use client'

import { useState, useEffect } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Upload, 
  Image as ImageIcon,
  Eye,
  Trash2,
  Copy
} from 'lucide-react'
import Image from 'next/image'

interface UploadedImage {
  url: string
  filename: string
  size: number
  type: string
  uploadedAt?: string
  category?: string
}

export default function MediaLibraryPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [filteredImages, setFilteredImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedImages, setSelectedImages] = useState<number[]>([])

  const categories = ['all', 'medical', 'diagnostics', 'monitoring', 'emergency', 'mobility']

  // Load existing images on mount
  useEffect(() => {
    fetchImages()
  }, [])

  // Filter images based on category and search
  useEffect(() => {
    let filtered = images

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(img => 
        img.filename.toLowerCase().includes(query)
      )
    }

    setFilteredImages(filtered)
  }, [images, selectedCategory, searchQuery])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/upload')
      const data = await response.json()
      
      if (data.success) {
        setImages(data.files || [])
      } else {
        // Mock data for demo if no API
        setImages([
          {
            url: '/images/thermometer.jpg',
            filename: 'thermometer.jpg',
            size: 125000,
            type: 'image/jpeg',
            uploadedAt: new Date().toISOString(),
            category: 'medical'
          },
          {
            url: '/images/stethoscope.jpg',
            filename: 'stethoscope.jpg',
            size: 180000,
            type: 'image/jpeg',
            uploadedAt: new Date().toISOString(),
            category: 'diagnostics'
          }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
      // Fallback to mock data
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (newImage: UploadedImage) => {
    const imageWithMeta = {
      ...newImage,
      uploadedAt: new Date().toISOString(),
      category: 'medical'
    }
    setImages(prev => [imageWithMeta, ...prev])
  }

  const handleImageSelect = (index: number) => {
    setSelectedImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const copyImageUrl = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
    // You can add a toast notification here
    alert(`Image URL copied: ${fullUrl}`)
  }

  const deleteImage = (index: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setImages(prev => prev.filter((_, i) => i !== index))
      setSelectedImages(prev => prev.filter(i => i !== index))
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              📸 Media Library
            </h1>
            <p className="text-purple-100 text-lg">
              Upload and manage your medical equipment images
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
            <ImageIcon className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{images.length}</div>
            <div className="text-purple-200 text-sm">Total Images</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">
              {(images.reduce((acc, img) => acc + img.size, 0) / 1024 / 1024).toFixed(1)}MB
            </div>
            <div className="text-purple-200 text-sm">Total Size</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{filteredImages.length}</div>
            <div className="text-purple-200 text-sm">Filtered Results</div>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 rounded-full p-2">
            <Upload className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Upload New Images</h2>
        </div>
        
        <ImageUploader 
          category="medical"
          onUploadSuccess={handleUploadSuccess}
          maxFiles={20}
          currentImages={[]}
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search images by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2"
            >
              <Grid size={16} />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2"
            >
              <List size={16} />
              List
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              {category !== 'all' && (
                <span className="ml-2 opacity-75">
                  ({images.filter(img => img.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedImages.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-purple-800 font-medium">
              {selectedImages.length} images selected
            </span>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download size={16} />
              Download Selected
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => {
                if (confirm(`Delete ${selectedImages.length} selected images?`)) {
                  setImages(prev => prev.filter((_, index) => !selectedImages.includes(index)))
                  setSelectedImages([])
                }
              }}
            >
              <Trash2 size={16} />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {/* Images Display */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Image Library ({filteredImages.length})
          </h3>
          
          {filteredImages.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge 
                label={`${filteredImages.filter(img => img.type.startsWith('image/')).length} Images`} 
                variant="primary" 
              />
              <Badge 
                label={`${(filteredImages.reduce((acc, img) => acc + img.size, 0) / 1024 / 1024).toFixed(1)}MB`} 
                variant="secondary" 
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading media library...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h4 className="text-xl font-medium text-gray-900 mb-2">No Images Found</h4>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms or filters' 
                : 'Upload some images to get started with your media library'
              }
            </p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="flex items-center gap-2"
            >
              <Eye size={16} />
              {searchQuery || selectedCategory !== 'all' ? 'Clear Filters' : 'Upload Images'}
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
              : "space-y-4"
          }>
            {filteredImages.map((image, index) => (
              <div 
                key={`${image.filename}-${index}`}
                className={`group relative bg-gray-50 rounded-lg overflow-hidden border-2 transition-all hover:border-purple-300 hover:shadow-md ${
                  selectedImages.includes(index) ? 'ring-2 ring-purple-500 border-purple-500' : 'border-gray-200'
                } ${viewMode === 'list' ? 'flex items-center p-4 space-x-4' : 'aspect-square'}`}
              >
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedImages.includes(index)}
                  onChange={() => handleImageSelect(index)}
                  className="absolute top-2 left-2 z-10 w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                />

                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-16 h-16 flex-shrink-0' : 'w-full h-full'}`}>
                  <Image
                    src={image.url}
                    alt={image.filename}
                    fill
                    className="object-cover"
                    sizes={viewMode === 'list' ? '64px' : '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw'}
                  />
                </div>

                {/* Image Info */}
                <div className={`${
                  viewMode === 'list' 
                    ? 'flex-1 min-w-0' 
                    : 'absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity'
                }`}>
                  <p className={`font-medium truncate ${viewMode === 'list' ? 'text-gray-900 text-sm' : 'text-white text-xs'}`}>
                    {image.filename}
                  </p>
                  <p className={`text-xs ${viewMode === 'list' ? 'text-gray-500' : 'text-gray-300'} mt-1`}>
                    {(image.size / 1024).toFixed(1)} KB • {image.type}
                  </p>
                  {viewMode === 'list' && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => copyImageUrl(image.url)}
                        className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium"
                      >
                        <Copy size={12} />
                        Copy URL
                      </button>
                      <button
                        onClick={() => deleteImage(index)}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Grid View Actions */}
                {viewMode === 'grid' && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyImageUrl(image.url)}
                        className="bg-white text-gray-700 p-1.5 rounded shadow-md hover:bg-gray-50"
                        title="Copy URL"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={() => deleteImage(index)}
                        className="bg-white text-red-600 p-1.5 rounded shadow-md hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}