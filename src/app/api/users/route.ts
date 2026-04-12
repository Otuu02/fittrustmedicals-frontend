import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src/data/users.json');

const readUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }, null, 2));
      return { users: [] };
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
};

const writeUsers = (data: any) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    return false;
  }
};

const hashPassword = (password: string) => {
  return Buffer.from(password).toString('base64');
};

// GET - List all users
export async function GET(request: NextRequest) {
  try {
    const { users } = readUsers();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    let filteredUsers = users;
    if (role && role !== 'all') {
      filteredUsers = users.filter((u: any) => u.role === role);
    }
    
    // Remove passwords from response
    const safeUsers = filteredUsers.map((u: any) => {
      const { password, ...user } = u;
      return user;
    });
    
    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST - Create new user (admin/staff)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone } = body;
    
    const { users } = readUsers();
    
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }
    
    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      password: hashPassword(password),
      role: role || 'staff',
      phone: phone || '',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    writeUsers({ users });
    
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create user' }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, role, phone, status } = body;
    
    const data = readUsers();
    const userIndex = data.users.findIndex((u: any) => u.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    data.users[userIndex] = {
      ...data.users[userIndex],
      name: name || data.users[userIndex].name,
      email: email || data.users[userIndex].email,
      role: role || data.users[userIndex].role,
      phone: phone || data.users[userIndex].phone,
      status: status || data.users[userIndex].status,
      updatedAt: new Date().toISOString(),
    };
    
    writeUsers(data);
    
    const { password, ...safeUser } = data.users[userIndex];
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
    }
    
    const data = readUsers();
    const filteredUsers = data.users.filter((u: any) => u.id !== id);
    
    if (filteredUsers.length === data.users.length) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    writeUsers({ users: filteredUsers });
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
  }
}