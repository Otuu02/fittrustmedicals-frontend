import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to products JSON file
const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

// Helper to read products from file
const readProducts = () => {
  try {
    if (!fs.existsSync(productsFilePath)) {
      fs.writeFileSync(productsFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

// Helper to write products to file
const writeProducts = (products: any[]) => {
  try {
    // Remove duplicates by ID before saving
    const uniqueProducts = products.filter((product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
    );
    fs.writeFileSync(productsFilePath, JSON.stringify(uniqueProducts, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};

// Generate unique ID
const generateUniqueId = () => {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

// GET /api/catalog/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const products = readProducts();
    
    return NextResponse.json({
      success: true,
      products: products,
      total: products.length,
      source: 'database'
    });
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/catalog/products - Add a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const products = readProducts();
    
    console.log('Received product data:', body);
    
    // Generate a truly unique ID
    const uniqueId = generateUniqueId();
    console.log('Generated unique ID:', uniqueId);
    
    // Ensure price is a valid number
    let price = 0;
    if (body.price) {
      price = typeof body.price === 'number' ? body.price : parseFloat(body.price);
      if (isNaN(price)) price = 0;
    }
    
    // Ensure originalPrice is a valid number if provided
    let originalPrice = undefined;
    if (body.originalPrice) {
      originalPrice = typeof body.originalPrice === 'number' ? body.originalPrice : parseFloat(body.originalPrice);
      if (isNaN(originalPrice)) originalPrice = undefined;
    }
    
    // Ensure stock is a valid number
    let stock = 0;
    if (body.stock) {
      stock = typeof body.stock === 'number' ? body.stock : parseInt(body.stock);
      if (isNaN(stock)) stock = 0;
    }
    
    const newProduct = {
      id: uniqueId,
      name: body.name || 'Unnamed Product',
      price: price,
      originalPrice: originalPrice,
      category: body.category || 'Uncategorized',
      description: body.description || '',
      image: body.image || '/placeholder.svg',
      stock: stock,
      status: body.status || 'active',
      isPromotional: body.isPromotional || false,
      discountPercentage: body.discountPercentage ? (typeof body.discountPercentage === 'number' ? body.discountPercentage : parseInt(body.discountPercentage)) : undefined,
      featured: body.featured || false,
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      salesCount: body.salesCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      specifications: body.specifications || {},
      gallery: body.image ? [body.image] : []
    };
    
    console.log('Saving product with ID:', newProduct.id);
    
    products.push(newProduct);
    writeProducts(products);
    
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product added successfully'
    });
  } catch (error) {
    console.error('POST product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add product' },
      { status: 500 }
    );
  }
}

// PUT /api/catalog/products - UPDATE a product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get ID from URL query parameter OR from body
    const { searchParams } = new URL(request.url);
    const urlId = searchParams.get('id');
    const bodyId = body.id;
    const id = urlId || bodyId;
    
    console.log('🔍 PUT request - URL ID:', urlId);
    console.log('🔍 PUT request - Body ID:', bodyId);
    console.log('🔍 PUT request - Final ID:', id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      );
    }
    
    const products = readProducts();
    const productIndex = products.findIndex((p: any) => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Parse numeric values
    const price = body.price !== undefined 
      ? (typeof body.price === 'number' ? body.price : parseFloat(body.price))
      : products[productIndex].price;
    
    const stock = body.stock !== undefined
      ? (typeof body.stock === 'number' ? body.stock : parseInt(body.stock))
      : products[productIndex].stock;
    
    const originalPrice = body.originalPrice !== undefined
      ? (typeof body.originalPrice === 'number' ? body.originalPrice : parseFloat(body.originalPrice))
      : products[productIndex].originalPrice;
    
    const discountPercentage = body.discountPercentage !== undefined
      ? (typeof body.discountPercentage === 'number' ? body.discountPercentage : parseInt(body.discountPercentage))
      : products[productIndex].discountPercentage;
    
    // Update the product
    const updatedProduct = {
      ...products[productIndex],
      name: body.name !== undefined ? body.name : products[productIndex].name,
      price: isNaN(price) ? products[productIndex].price : price,
      originalPrice: originalPrice && !isNaN(originalPrice) ? originalPrice : undefined,
      category: body.category !== undefined ? body.category : products[productIndex].category,
      description: body.description !== undefined ? body.description : products[productIndex].description,
      image: body.image !== undefined ? body.image : products[productIndex].image,
      stock: isNaN(stock) ? products[productIndex].stock : stock,
      isPromotional: body.isPromotional !== undefined ? body.isPromotional : products[productIndex].isPromotional,
      discountPercentage: discountPercentage && !isNaN(discountPercentage) ? discountPercentage : products[productIndex].discountPercentage,
      featured: body.featured !== undefined ? body.featured : products[productIndex].featured,
      status: body.status !== undefined ? body.status : products[productIndex].status,
      updatedAt: new Date().toISOString(),
    };
    
    products[productIndex] = updatedProduct;
    writeProducts(products);
    
    console.log('✅ Product updated successfully:', updatedProduct.id);
    
    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/catalog/products - Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Clear all products
    if (id === 'all' || searchParams.get('clearAll') === 'true') {
      writeProducts([]);
      return NextResponse.json({
        success: true,
        message: 'All products cleared'
      });
    }
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      );
    }
    
    const products = readProducts();
    const filteredProducts = products.filter((p: any) => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    writeProducts(filteredProducts);
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}