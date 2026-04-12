import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  
  // Try different possible cookie names
  const possibleCookies = [
    'session-token',
    'token',
    'next-auth.session-token',
    'auth-token',
    'jwt',
    'user-session',
    'fittrust-session'
  ];
  
  let sessionToken = null;
  
  for (const name of possibleCookies) {
    const cookie = cookieStore.get(name);
    if (cookie?.value) {
      sessionToken = cookie.value;
      console.log('Found session cookie:', name);
      break;
    }
  }
  
  if (!sessionToken) {
    console.log('No session cookie found. Available cookies:', 
      cookieStore.getAll().map(c => c.name)
    );
    return null;
  }
  
  // Try to find user by session - adjust based on your auth system
  // Option 1: If you store userId in cookie directly
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: sessionToken }, // if cookie is userId
          { role: 'STAFF' },    // fallback for testing
        ]
      },
    });
    
    if (user) return user;
  } catch (e) {
    console.error('Error finding user:', e);
  }
  
  // Option 2: If you have a sessions table
  // const session = await prisma.session.findUnique({
  //   where: { token: sessionToken },
  //   include: { user: true }
  // });
  // return session?.user || null;
  
  // Temporary: Return first staff user for testing
  console.log('Returning test staff user');
  return await prisma.user.findFirst({
    where: { role: 'STAFF' }
  });
}

export function requireAuth(user: any) {
  if (!user) {
    return { error: 'Unauthorized', status: 401 };
  }
  if (user.role !== 'STAFF' && user.role !== 'ADMIN') {
    return { error: 'Staff access required', status: 403 };
  }
  return null;
}