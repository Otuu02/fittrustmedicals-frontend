import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src/data/users.json');

// Helper to read users
const readUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }, null, 2));
      return { users: [] };
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return { users: [] };
  }
};

// Helper to write users
const writeUsers = (data: any) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
};

// Simple hash function
const hashPassword = (password: string) => {
  return Buffer.from(password).toString('base64');
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password required' },
        { status: 400 }
      );
    }

    const { users } = readUsers();
    
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      password: hashPassword(password),
      role: 'customer',
      phone: phone || '',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers({ users });

    // Generate token
    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}