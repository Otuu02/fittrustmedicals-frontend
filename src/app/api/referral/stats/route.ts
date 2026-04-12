// src/app/api/referral/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const referralFilePath = path.join(process.cwd(), 'src/data/referrals.json');

const readReferrals = () => {
  try {
    if (!fs.existsSync(referralFilePath)) {
      const dir = path.dirname(referralFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(referralFilePath, JSON.stringify({ referrals: {} }, null, 2));
      return { referrals: {} };
    }
    const data = fs.readFileSync(referralFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading referrals:', error);
    return { referrals: {} };
  }
};

const writeReferrals = (data: any) => {
  try {
    fs.writeFileSync(referralFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing referrals:', error);
    return false;
  }
};

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-Id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const data = readReferrals();
    const referral = data.referrals[userId];

    if (!referral) {
      return NextResponse.json({
        summary: {
          totalClicks: 0,
          totalConversions: 0,
          totalRevenue: 0,
          totalLinks: 1
        },
        referralCode: '',
        referralLink: ''
      });
    }

    return NextResponse.json({
      summary: {
        totalClicks: referral.clicks || 0,
        totalConversions: referral.conversions || 0,
        totalRevenue: referral.revenue || 0,
        totalLinks: 1
      },
      referralCode: referral.code,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ref/${referral.code}`
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, amount } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const data = readReferrals();
    
    if (!data.referrals[userId]) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      );
    }

    if (action === 'click') {
      data.referrals[userId].clicks = (data.referrals[userId].clicks || 0) + 1;
    } else if (action === 'conversion') {
      data.referrals[userId].conversions = (data.referrals[userId].conversions || 0) + 1;
      if (amount) {
        data.referrals[userId].revenue = (data.referrals[userId].revenue || 0) + amount;
      }
    }

    writeReferrals(data);

    return NextResponse.json({
      success: true,
      stats: data.referrals[userId]
    });
  } catch (error) {
    console.error('Error updating referral stats:', error);
    return NextResponse.json(
      { error: 'Failed to update referral stats' },
      { status: 500 }
    );
  }
}