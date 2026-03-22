import { apiClient } from '@/lib/api';
import { User, ApiResponse } from '@/lib/types';
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
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginRequest) {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/login',
        credentials
      );

      if (response.data.data) {
        const { user, token } = response.data.data;
        useAuthStore.getState().login(user, token);
        return response.data.data;
      }

      throw new Error(response.data.error || 'Login failed');
    } catch (error) {
      throw error;
    }
  },

  async register(data: RegisterRequest) {
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/register',
        {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }
      );

      if (response.data.data) {
        const { user, token } = response.data.data;
        useAuthStore.getState().login(user, token);
        return response.data.data;
      }

      throw new Error(response.data.error || 'Registration failed');
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
      useAuthStore.getState().logout();
    } catch (error) {
      useAuthStore.getState().logout();
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      if (response.data.data) {
        useAuthStore.getState().setUser(response.data.data);
        return response.data.data;
      }
      throw new Error('Failed to fetch user');
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(data: Partial<User>) {
    try {
      const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data);

      if (response.data.data) {
        useAuthStore.getState().setUser(response.data.data);
        return response.data.data;
      }

      throw new Error(response.data.error || 'Update failed');
    } catch (error) {
      throw error;
    }
  },

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async resetPassword(email: string) {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async verifyToken(token: string) {
    try {
      const response = await apiClient.post<ApiResponse<User>>('/auth/verify-token', {
        token,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};