// src/app/api/referral/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const referralFilePath = path.join(process.cwd(), 'src/data/referrals.json');

const readReferrals = () => {
  try {
    if (!fs.existsSync(referralFilePath)) {
      return { referrals: {} };
    }
    const data = fs.readFileSync(referralFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { referrals: {} };
  }
};

const writeReferrals = (data: any) => {
  try {
    fs.writeFileSync(referralFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, action, amount } = body;

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    const data = readReferrals();
    
    // Find the staff by referral code
    let staffId = null;
    for (const [id, referral] of Object.entries(data.referrals)) {
      if ((referral as any).code === referralCode) {
        staffId = id;
        break;
      }
    }

    if (!staffId) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    if (action === 'click') {
      data.referrals[staffId].clicks = (data.referrals[staffId].clicks || 0) + 1;
    } else if (action === 'conversion' && amount) {
      data.referrals[staffId].conversions = (data.referrals[staffId].conversions || 0) + 1;
      data.referrals[staffId].revenue = (data.referrals[staffId].revenue || 0) + amount;
    }

    writeReferrals(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking referral:', error);
    return NextResponse.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    );
  }
}