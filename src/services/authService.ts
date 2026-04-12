import apiClient, { ApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
  };
  token: string;
}

export const authService = {
  async login(credentials: LoginRequest) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.data) {
        const { user, token } = data.data;
        
        useAuthStore.setState({
          customer: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            addresses: [],
            wishlist: [],
            notifications: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            role: user.role,
          },
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
        
        localStorage.setItem('token', token);
        return data.data;
      }

      throw new Error(data.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  },

  async register(data: RegisterRequest) {
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
          phone: '',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      if (result.success && result.data) {
        const { user, token } = result.data;
        
        useAuthStore.setState({
          customer: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            addresses: [],
            wishlist: [],
            notifications: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            role: user.role,
          },
          isAuthenticated: true,
          isAdmin: false,
        });
        
        localStorage.setItem('token', token);
        return result.data;
      }

      throw new Error(result.message || 'Registration failed');
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      localStorage.removeItem('token');
      useAuthStore.getState().logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        useAuthStore.setState({
          customer: data.user,
          isAuthenticated: true,
          isAdmin: data.user.role === 'admin',
        });
        return data.user;
      }
      throw new Error('Failed to fetch user');
    } catch (error) {
      throw error;
    }
  },
};