import { NextRequest, NextResponse } from 'next/server'

// Mock database - in production, use your actual database
const mockProducts = [
  {
    id: 'sample_1',
    name: 'Digital Thermometer',
    description: 'High-precision digital thermometer for accurate temperature readings',
    price: 44985, // Already in Naira
    currency: 'NGN',
    category: 'diagnostics',
    stock: 50,
    image_url: '/images/thermometer.jpg',
    slug: 'digital-thermometer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample_2',
    name: 'Blood Pressure Monitor',
    description: 'Automatic digital blood pressure monitor with memory function',
    price: 119985, // Already in Naira
    currency: 'NGN',
    category: 'monitoring',
    stock: 25,
    image_url: '/images/bp-monitor.jpg',
    slug: 'blood-pressure-monitor',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    products: mockProducts,
    count: mockProducts.length
  })
}