// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('Frontend proxying login to backend...');
    
    // Proxy to your NestJS backend
    const backendResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: await request.text(), // Forward the exact request body
    });

    // Get response data
    const data = await backendResponse.json();
    
    // Forward cookies from backend to frontend
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Copy all cookies from backend response
    backendResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        response.headers.append(key, value);
      }
    });

    console.log('Login proxy successful:', data);
    return response;

  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 500 }
    );
  }
}