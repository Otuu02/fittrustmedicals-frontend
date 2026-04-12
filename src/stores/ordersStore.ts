import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 
  | 'order_placed'
  | 'payment_pending'
  | 'payment_confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  receiptUrl?: string;
}

interface OrdersStore {
  orders: Order[];
  getCustomerOrders: (customerId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  addTrackingNumber: (orderId: string, trackingNumber: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  getOrderStatistics: (customerId: string) => {
    total: number;
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
  clearAllOrders: () => void;  // NEW METHOD
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],

      getCustomerOrders: (customerId) => 
        get().orders.filter((o) => o.customerId === customerId).sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),

      createOrder: async (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Date.now()}`,
          status: 'order_placed',
          statusHistory: [
            {
              status: 'order_placed',
              timestamp: new Date().toISOString(),
              note: 'Order placed successfully',
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [...state.orders, newOrder],
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId, status, note) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  statusHistory: [
                    ...o.statusHistory,
                    {
                      status,
                      timestamp: new Date().toISOString(),
                      note,
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      addTrackingNumber: (orderId, trackingNumber) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  trackingNumber,
                  status: 'shipped',
                  statusHistory: [
                    ...o.statusHistory,
                    {
                      status: 'shipped',
                      timestamp: new Date().toISOString(),
                      note: `Tracking number: ${trackingNumber}`,
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      cancelOrder: (orderId, reason) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'cancelled',
                  statusHistory: [
                    ...o.statusHistory,
                    {
                      status: 'cancelled',
                      timestamp: new Date().toISOString(),
                      note: reason || 'Order cancelled by customer',
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      getOrderStatistics: (customerId) => {
        const customerOrders = get().getCustomerOrders(customerId);
        return {
          total: customerOrders.length,
          pending: customerOrders.filter((o) => ['order_placed', 'payment_pending'].includes(o.status)).length,
          processing: customerOrders.filter((o) => ['payment_confirmed', 'processing'].includes(o.status)).length,
          delivered: customerOrders.filter((o) => o.status === 'delivered').length,
          cancelled: customerOrders.filter((o) => o.status === 'cancelled').length,
        };
      },

      // NEW METHOD - Clear all orders
      clearAllOrders: () => {
        set({ orders: [] });
      },
    }),
    {
      name: 'fittrust-orders',
    }
  )
);