// src/app/api/payments/initialize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { email, amount, orderId, customerName } = await request.json();

    if (!email || !amount) {
      return NextResponse.json(
        { success: false, error: 'Email and amount are required' },
        { status: 400 }
      );
    }

    // Initialize payment with Paystack
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Convert to kobo
        reference: `FITTRUST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          orderId,
          customerName,
          custom_fields: [
            {
              display_name: "Customer Email",
              variable_name: "customer_email",
              value: email,
            },
          ],
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: response.data.data,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}