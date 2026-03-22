// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Mock authentication
    if (email && password) {
      // Mock token
      const token = Buffer.from(`${email}:${password}`).toString('base64');

      return NextResponse.json(
        {
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: '1',
              email,
              name: 'Test User',
              role: 'admin',
            },
            token: `mock_token_${token}`,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}