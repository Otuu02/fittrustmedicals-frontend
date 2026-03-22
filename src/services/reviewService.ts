import { apiClient } from '@/lib/api';
import { Review, ApiResponse } from '@/lib/types';

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}

export const reviewService = {
  async getByProduct(productId: string, page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get<ApiResponse<Review[]>>(
        `/products/${productId}/reviews?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async create(data: CreateReviewRequest) {
    try {
      const response = await apiClient.post<ApiResponse<Review>>(
        '/reviews',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id: string, data: Partial<CreateReviewRequest>) {
    try {
      const response = await apiClient.put<ApiResponse<Review>>(
        `/reviews/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getMyReviews(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get<ApiResponse<Review[]>>(
        `/reviews/my?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};