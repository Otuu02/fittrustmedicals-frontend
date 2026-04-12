import apiClient, { ApiResponse } from '@/lib/api';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: string;
  cardDetails?: CardDetails;
}

export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: string;
  amount: number;
  timestamp: string;
}

export const paymentService = {
  async processPayment(data: PaymentRequest) {
    try {
      const response = await apiClient.post<ApiResponse<PaymentResponse>>(
        '/payments/process',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPaymentStatus(transactionId: string) {
    try {
      const response = await apiClient.get<ApiResponse<PaymentResponse>>(
        `/payments/${transactionId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async refund(orderId: string, reason: string) {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `/payments/refund`,
        { orderId, reason }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async validateCard(cardDetails: CardDetails) {
    try {
      const response = await apiClient.post<ApiResponse<boolean>>(
        '/payments/validate-card',
        cardDetails
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPaymentMethods() {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/payments/methods');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};