// src/lib/prisma.ts
// Replaced Prisma with API calls to backend
// This is a frontend-compatible database interface

import { api } from './api';

// User interface matching your backend response
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock Prisma interface using API calls
const db = {
  user: {
    // Find single user by unique field
    findUnique: async (query: { where: { id?: string; email?: string } }): Promise<User | null> => {
      try {
        if (query.where.id) {
          const response = await api.users.getById(query.where.id);
          return response.data || null;
        }
        if (query.where.email) {
          // Use getAll with email filter or create specific endpoint
          const response = await api.users.getAll();
          const users = response.data || [];
          return users.find((u: User) => u.email === query.where.email) || null;
        }
        return null;
      } catch {
        return null;
      }
    },

    // Find many users
    findMany: async (query?: { where?: any; orderBy?: any }): Promise<User[]> => {
      try {
        const response = await api.users.getAll();
        return response.data || [];
      } catch {
        return [];
      }
    },

    // Create user
    create: async (data: { data: any }): Promise<User> => {
      const response = await api.auth.register(data.data);
      return response.data?.user || response.data;
    },

    // Update user
    update: async (query: { where: { id: string }; data: any }): Promise<User> => {
      const response = await api.users.update(query.where.id, query.data);
      return response.data;
    },

    // Delete user
    delete: async (query: { where: { id: string } }): Promise<User> => {
      const response = await api.users.delete(query.where.id);
      return response.data;
    },
  },

  // Add other models as needed (products, orders, etc.)
  product: {
    findUnique: async (query: { where: { id?: string; slug?: string } }) => {
      try {
        if (query.where.id) {
          const response = await api.products.getById(query.where.id);
          return response.data || null;
        }
        if (query.where.slug) {
          const response = await api.products.getBySlug(query.where.slug);
          return response.data || null;
        }
        return null;
      } catch {
        return null;
      }
    },

    findMany: async (query?: { where?: any }) => {
      try {
        const response = await api.products.getAll(query?.where);
        return response.data || [];
      } catch {
        return [];
      }
    },
  },
};

// Export as prisma for compatibility
export const prisma = db;
export default db;