// src/app/api/referral/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to referral data file
const referralFilePath = path.join(process.cwd(), 'src/data/referrals.json');

// Helper to read referrals from file
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

// Helper to write referrals to file
const writeReferrals = (data: any) => {
  try {
    fs.writeFileSync(referralFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing referrals:', error);
    return false;
  }
};

// Generate unique referral code
const generateReferralCode = (staffId: string) => {
  const prefix = 'FIT';
  const staffPart = staffId.slice(-6).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${staffPart}-${timestamp}${random}`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { staffId, staffEmail, staffName } = body;

    if (!staffId) {
      return NextResponse.json(
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    // Read existing referrals
    const data = readReferrals();
    
    // Check if referral code already exists for this staff
    if (data.referrals[staffId]) {
      return NextResponse.json({
        success: true,
        referralCode: data.referrals[staffId].code,
        referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ref/${data.referrals[staffId].code}`,
        message: 'Referral code already exists'
      });
    }

    // Generate new referral code
    const referralCode = generateReferralCode(staffId);
    
    // Store referral data
    data.referrals[staffId] = {
      code: referralCode,
      staffId,
      staffEmail,
      staffName,
      createdAt: new Date().toISOString(),
      clicks: 0,
      conversions: 0,
      revenue: 0,
      status: 'active'
    };
    
    writeReferrals(data);

    return NextResponse.json({
      success: true,
      referralCode: referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ref/${referralCode}`,
      message: 'Referral code generated successfully'
    });
  } catch (error) {
    console.error('Error generating referral code:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral code' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json(
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    const data = readReferrals();
    const referralData = data.referrals[staffId];
    
    if (!referralData) {
      return NextResponse.json(
        { error: 'Referral code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      referralCode: referralData.code,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ref/${referralData.code}`,
      stats: {
        clicks: referralData.clicks || 0,
        conversions: referralData.conversions || 0,
        revenue: referralData.revenue || 0
      }
    });
  } catch (error) {
    console.error('Error fetching referral:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
}