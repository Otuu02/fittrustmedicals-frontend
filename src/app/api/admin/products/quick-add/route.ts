import { NextRequest, NextResponse } from 'next/server'

// In-memory storage (replace with real database later)
let products: any[] = []

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.price || !productData.description) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and description are required' },
        { status: 400 }
      )
    }

    // Add timestamp and ensure proper structure
    const newProduct = {
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Add the product to storage (newest first)
    products.unshift(newProduct)

    console.log(`✅ New product added: ${productData.name} (Total: ${products.length})`)

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      product: newProduct,
      total: products.length
    })

  } catch (error) {
    console.error('Quick add product error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add product' },
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

// DELETE method for removing products
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      )
    }

    products = products.filter(product => product.id !== productId)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      count: products.length
    })

  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete product' },
      { status: 500 }
    )
  }
}