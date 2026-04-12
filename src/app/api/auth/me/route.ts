import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // Forward to backend
    const backendResponse = await fetch(
      'http://localhost:3001/api/auth/me',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          Cookie: request.headers.get('cookie') || '',
        },
      }
    );

    const data = await backendResponse.json();
    
    // If backend returns error, try to get from local users.json
    if (!backendResponse.ok) {
      // Fallback to local users.json
      const fs = await import('fs');
      const path = await import('path');
      const usersFilePath = path.join(process.cwd(), 'src/data/users.json');
      
      if (fs.existsSync(usersFilePath)) {
        const fileData = fs.readFileSync(usersFilePath, 'utf8');
        const { users } = JSON.parse(fileData);
        
        // Extract user ID from token (simple decode)
        if (token) {
          const decoded = Buffer.from(token, 'base64').toString();
          const userId = decoded.split(':')[0];
          const user = users.find((u: any) => u.id === userId);
          
          if (user) {
            return NextResponse.json({
              success: true,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
              },
            });
          }
        }
      }
      
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('Auth me error:', error);
    
    // Fallback: try to get from localStorage via the token
    try {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');
      
      if (token) {
        const fs = await import('fs');
        const path = await import('path');
        const usersFilePath = path.join(process.cwd(), 'src/data/users.json');
        
        if (fs.existsSync(usersFilePath)) {
          const fileData = fs.readFileSync(usersFilePath, 'utf8');
          const { users } = JSON.parse(fileData);
          
          const decoded = Buffer.from(token, 'base64').toString();
          const userId = decoded.split(':')[0];
          const user = users.find((u: any) => u.id === userId);
          
          if (user) {
            return NextResponse.json({
              success: true,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
              },
            });
          }
        }
      }
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}