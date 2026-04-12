// src/app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Mock database - replace with your actual database
let transactions: any[] = [];
let walletBalance = 0;
let totalEarned = 0;
let totalWithdrawn = 0;

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Reference is required' },
        { status: 400 }
      );
    }

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data.data;

    if (paymentData.status === 'success') {
      // Create transaction record
      const transaction = {
        id: paymentData.id,
        reference: paymentData.reference,
        amount: paymentData.amount / 100,
        currency: paymentData.currency,
        status: 'completed',
        customerEmail: paymentData.customer?.email,
        customerName: paymentData.metadata?.customerName,
        orderId: paymentData.metadata?.orderId,
        type: 'credit',
        createdAt: new Date(),
      };

      // Save to database
      transactions.push(transaction);
      
      // Update wallet balance
      walletBalance += transaction.amount;
      totalEarned += transaction.amount;

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        data: transaction,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}