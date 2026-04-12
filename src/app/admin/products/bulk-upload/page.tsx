'use client'
import { useState, useCallback } from 'react'
import { formatPrice, convertToNaira } from '@/lib/currency'
import Link from 'next/link'

interface ProductRow {
  name: string
  description: string
  price: string
  category: string
  image_url: string
  stock: string
  [key: string]: string
}

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [products, setProducts] = useState<ProductRow[]>([])
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<ProductRow[]>([])
  const [uploadResult, setUploadResult] = useState<{success: boolean, count: number, message: string} | null>(null)

  // Parse CSV file
  const parseCSV = useCallback((file: File) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split('\n').filter(line => line.trim())
        
        if (lines.length < 2) {
          alert('CSV file must have at least a header row and one data row')
          return
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
          const product: ProductRow = {
            name: '',
            description: '',
            price: '',
            category: '',
            image_url: '',
            stock: ''
          }
          
          headers.forEach((header, index) => {
            product[header] = values[index] || ''
          })
          
          return product
        }).filter(product => product.name && product.price) // Remove empty rows

        setProducts(data)
        setPreview(data.slice(0, 5)) // Show first 5 for preview
      } catch (error) {
        console.error('Error parsing CSV:', error)
        alert('Error parsing CSV file. Please check the format.')
      }
    }
    
    reader.readAsText(file)
  }, [])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        alert('Please upload a CSV file')
        return
      }
      
      setFile(selectedFile)
      parseCSV(selectedFile)
      setUploadResult(null)
    }
  }

  // Upload products to backend
  const handleBulkUpload = async () => {
    if (!products.length) {
      alert('No products to upload')
      return
    }

    setUploading(true)
    
    try {
      // Process products - convert prices to Naira
      const processedProducts = products.map(product => ({
        ...product,
        price: convertToNaira(parseFloat(product.price) || 0),
        stock: parseInt(product.stock) || 0,
        currency: 'NGN',
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      }))

      const response = await fetch('/api/admin/products/bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: processedProducts })
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult({
          success: true,
          count: result.count,
          message: `Successfully uploaded ${result.count} products!`
        })
        
        // Clear form
        setProducts([])
        setPreview([])
        setFile(null)
        
        // Reset file input
        const fileInput = document.getElementById('csv-file') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        throw new Error(result.message || 'Upload failed')
      }
    } catch (error: any) {
      setUploadResult({
        success: false,
        count: 0,
        message: `Upload failed: ${error.message}`
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Product Upload</h1>
        <p className="text-gray-600 mt-2">Upload multiple products at once using CSV format</p>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className={`p-4 rounded-lg mb-6 ${
          uploadResult.success 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="font-medium">{uploadResult.message}</p>
          {uploadResult.success && (
            <Link 
              href="/admin/products/list" 
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View uploaded products →
            </Link>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">📝 CSV Format Requirements</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Required columns:</strong> name, description, price, category, stock</p>
          <p><strong>Optional columns:</strong> image_url</p>
          <p><strong>Price:</strong> Enter in USD (will be converted to Naira automatically)</p>
          <p><strong>Categories:</strong> Diagnostics, Monitoring, Emergency, Mobility, etc.</p>
        </div>
        
        <div className="mt-4 flex items-center space-x-4">
          <a 
            href="/sample-products.csv" 
            download
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            📥 Download Sample CSV Template
          </a>
          <span className="text-blue-600">|</span>
          <Link 
            href="/admin/products/list" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            📋 View Existing Products
          </Link>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select CSV File
        </label>
        
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV files only</p>
            </div>
            <input 
              id="csv-file"
              type="file" 
              className="hidden" 
              accept=".csv"
              onChange={handleFileChange}
            />
          </label>
        </div>
        
        {file && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">
            Preview (First 5 Products)
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (USD → NGN)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.price} → {formatPrice(parseFloat(product.price) || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Total products ready to upload:</strong> {products.length}
            </p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {products.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-6">
          <div>
            <p className="text-lg font-medium text-gray-900">
              Ready to upload {products.length} products
            </p>
            <p className="text-sm text-gray-500">
              All prices will be converted from USD to Nigerian Naira (₦)
            </p>
          </div>
          
          <button
            onClick={handleBulkUpload}
            disabled={uploading}
            className={`px-6 py-3 text-white font-medium rounded-lg transition-colors ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              `Upload ${products.length} Products`
            )}
          </button>
        </div>
      )}
    </div>
  )
}