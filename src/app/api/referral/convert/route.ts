import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = body.code;
    const orderId = body.orderId;
    const saleAmount = body.saleAmount;
    const customerId = body.customerId;

    if (!code || !orderId || !saleAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const referral = await prisma.referralLink.findUnique({
      where: { code: code, isActive: true },
    });

    if (!referral) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { referralCode: code },
    });

    await prisma.referralSale.create({
      data: {
        referralCode: code,
        staffId: referral.staffId,
        orderId: orderId,
        amount: saleAmount,
        customerId: customerId || null,
      },
    });

    await prisma.referralLink.update({
      where: { code: code },
      data: {
        conversions: { increment: 1 },
        revenue: { increment: saleAmount },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Conversion tracked successfully',
      staffId: referral.staffId,
    });

  } catch (error) {
    console.error('Convert referral error:', error);
    return NextResponse.json({ error: 'Failed to track conversion' }, { status: 500 });
  }
}