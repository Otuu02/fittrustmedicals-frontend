// src/app/api/orders/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In production, fetch from database
    const orders = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        date: '2024-03-15',
        status: 'delivered',
        total: 125000,
        items: [
          {
            id: '1',
            name: 'Digital Blood Pressure Monitor',
            quantity: 1,
            price: 25000,
            image: '/placeholder.svg',
          },
          {
            id: '2',
            name: '3M N95 Respirator Mask (10 Pack)',
            quantity: 2,
            price: 5000,
            image: '/placeholder.svg',
          },
        ],
        shippingAddress: {
          fullName: 'John Doe',
          address: '123 Main Street',
          city: 'Lagos',
          state: 'Lagos',
          zipCode: '100001',
          phone: '+234 123 456 7890',
        },
        paymentMethod: 'Card',
      },
    ];

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}