'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface UploadedImage {
  url: string
  filename: string
  size: number
  type: string
}

interface ImageUploaderProps {
  category?: string
  onUploadSuccess?: (image: UploadedImage) => void
  maxFiles?: number
  currentImages?: UploadedImage[]
  className?: string
}

export function ImageUploader({ 
  category = 'medical', 
  onUploadSuccess,
  maxFiles = 10,
  currentImages = [],
  className = ''
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>(currentImages)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (files: FileList) => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    for (let i = 0; i < Math.min(files.length, maxFiles - images.length); i++) {
      const file = files[i]
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', category)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          const newImage = {
            url: result.url,
            filename: result.filename,
            size: result.size,
            type: result.type,
          }
          
          setImages(prev => [...prev, newImage])
          onUploadSuccess?.(newImage)
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('Upload error:', error)
        setError(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    setUploading(false)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files)
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-purple-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Medical Equipment Images
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-sm text-gray-500">
              Support: JPG, PNG, WebP • Max 5MB per file • {maxFiles} files max
            </p>
          </div>

          <label className="inline-block">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              disabled={uploading || images.length >= maxFiles}
            />
            <div className={`px-6 py-3 bg-purple-600 text-white rounded-lg font-medium cursor-pointer transition-colors ${
              uploading || images.length >= maxFiles
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-purple-700'
            }`}>
              {uploading ? (
                <>
                  <div className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Uploading...
                </>
              ) : images.length >= maxFiles ? (
                `Maximum ${maxFiles} files reached`
              ) : (
                'Select Images'
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-red-800">Upload Error</h4>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900">
            Uploaded Images ({images.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="relative h-32 w-full">
                  <Image
                    src={image.url}
                    alt={image.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  
                  {/* Success Badge */}
                  <div className="absolute top-2 left-2">
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  {/* Image Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-medium truncate">{image.filename}</p>
                    <p className="text-xs text-gray-300">
                      {(image.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                {/* Copy URL Button */}
                <div className="p-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(image.url)}
                    className="w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader