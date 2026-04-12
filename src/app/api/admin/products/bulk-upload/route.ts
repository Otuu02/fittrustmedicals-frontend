import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with your actual database
let products: any[] = []

export async function POST(req: NextRequest) {
  try {
    const { products: newProducts } = await req.json()

    if (!newProducts || !Array.isArray(newProducts) || newProducts.length === 0) {
      return NextResponse.json(
        { message: 'No products provided' },
        { status: 400 }
      )
    }

    // Validate required fields
    const validProducts = newProducts.filter(product => 
      product.name && 
      product.price && 
      product.category
    )

    if (validProducts.length === 0) {
      return NextResponse.json(
        { message: 'No valid products found. Please ensure name, price, and category are provided.' },
        { status: 400 }
      )
    }

    // Process products for database insertion
    const processedProducts = validProducts.map((product, index) => ({
      id: `prod_${Date.now()}_${index}`,
      name: String(product.name).trim(),
      description: String(product.description || '').trim(),
      price: Number(product.price) || 0,
      currency: 'NGN',
      category: String(product.category).trim(),
      image_url: String(product.image_url || '/images/placeholder-product.jpg').trim(),
      stock: Number(product.stock) || 0,
      slug: String(product.slug || product.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    // Add to mock database
    products.push(...processedProducts)

    return NextResponse.json({
      success: true,
      count: processedProducts.length,
      message: `Successfully uploaded ${processedProducts.length} products!`,
      products: processedProducts
    })

  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error during bulk upload',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// GET method to retrieve all products
export async function GET() {
  return NextResponse.json({
    success: true,
    products,
    count: products.length
  })
}