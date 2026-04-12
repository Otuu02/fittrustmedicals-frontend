import apiClient, { ApiResponse } from '@/lib/api';
import { Order } from '@/lib/types';
import { useCartStore } from '@/stores/cartStore';

// Define Address interface locally
interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface CreateOrderRequest {
  shippingAddress: Address;
  paymentMethod: string;
  notes?: string;
}

export interface OrderResponse {
  order: Order;
  paymentUrl?: string;
}

export const orderService = {
  async getAll(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(
        `/orders?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async create(data: CreateOrderRequest) {
    try {
      const cartItems = useCartStore.getState().items;

      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const response = await apiClient.post<ApiResponse<OrderResponse>>('/orders', {
        ...data,
        items: cartItems,
      });

      if (response.data.data) {
        useCartStore.getState().clearCart();
        return response.data.data;
      }

      throw new Error(response.data.error || 'Failed to create order');
    } catch (error) {
      throw error;
    }
  },

  async updateStatus(id: string, status: string) {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(
        `/orders/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async cancel(id: string) {
    try {
      const response = await apiClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getTracking(id: string) {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/orders/${id}/tracking`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async downloadInvoice(id: string) {
    try {
      const response = await apiClient.get(`/orders/${id}/invoice`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ADDED: Fetch all orders (for admin dashboard)
  async fetchAllOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // ADDED: Get order statistics
  async getOrderStats() {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/orders/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ADDED: Get recent orders (for dashboard)
  async getRecentOrders(limit: number = 5) {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(`/orders/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ADDED: Delete an order (admin only)
  async deleteOrder(id: string) {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ADDED: Bulk update order statuses
  async bulkUpdateStatus(ids: string[], status: string) {
    try {
      const response = await apiClient.put<ApiResponse<Order[]>>('/orders/bulk-status', {
        ids,
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};