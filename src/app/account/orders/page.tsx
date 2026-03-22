'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Pagination } from '@/components/ui/Pagination';
import { Alert } from '@/components/ui/Alert';
import { Calendar, MapPin, DollarSign, ChevronRight, Package, Loader2 } from 'lucide-react';

// CORRECTED IMPORT for API client
import api from '@/lib/api'; // Changed from { api } to default import 'api'

// --- Mock Component for OrderTracker ---
// If you have a specific OrderTracker component, import it here.
// For now, we'll use a simple mock to resolve the error.
const OrderTracker = ({ status }: { status: string }) => {
  const statusMap: Record<string, React.ReactNode> = {
    'Processing': <div className="text-blue-600 font-medium">Processing</div>,
    'Shipped': <div className="text-blue-600 font-medium">Shipped</div>,
    'Delivered': <div className="text-green-600 font-medium">Delivered</div>,
    'Cancelled': <div className="text-red-600 font-medium">Cancelled</div>,
    'Pending': <div className="text-yellow-600 font-medium">Pending</div>,
  };
  return statusMap[status] || <div className="text-gray-500 font-medium">Unknown</div>;
};
// --- End Mock Component ---


interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  itemCount: number;
  // You might want to add more fields like shipping address etc.
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // State for total pages

  const itemsPerPage = 10; // Define how many items per page

  const fetchOrders = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      // Use the imported 'api' client for the request
      const response = await api.get(`/orders?page=${page}&limit=${itemsPerPage}`);
      setOrders(response.data.orders); // Assuming API returns { orders: [...], totalPages: X }
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch orders.');
      setOrders([]); // Clear orders on error
      setTotalPages(1); // Reset total pages on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]); // Re-fetch when currentPage changes

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fallback mock data if API call fails or returns empty results
  const mockOrders: Order[] = [
    { id: 'ORD-001', createdAt: '2024-03-15T10:00:00Z', status: 'Delivered', total: 149.99, itemCount: 3 },
    { id: 'ORD-002', createdAt: '2024-03-10T14:30:00Z', status: 'Shipped', total: 89.99, itemCount: 2 },
    { id: 'ORD-003', createdAt: '2024-03-05T09:15:00Z', status: 'Processing', total: 249.99, itemCount: 5 },
    { id: 'ORD-004', createdAt: '2024-02-28T11:00:00Z', status: 'Delivered', total: 75.50, itemCount: 1 },
    { id: 'ORD-005', createdAt: '2024-02-20T16:00:00Z', status: 'Cancelled', total: 199.00, itemCount: 4 },
  ];

  // Determine what to display: loading, error, empty state, or actual orders
  const displayOrders = orders.length > 0 ? orders : []; // Use fetched orders if available
  const showInitialLoading = loading && orders.length === 0;
  const showEmptyState = !loading && !error && displayOrders.length === 0;
  const showOrders = !loading && !error && displayOrders.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'My Account', href: '/account' },
            { label: 'Order History' },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Order History</h1>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />
        )}

        {showInitialLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-gray-400" size={40} />
          </div>
        )}

        {showEmptyState && (
          <Card className="text-center py-16">
            <p className="text-gray-600 mb-4">You have no previous orders.</p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </Card>
        )}

        {showOrders && (
          <>
            <div className="grid grid-cols-1 gap-6">
              {displayOrders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={18} className="text-gray-500" />
                        {/* Link to order detail page - assuming it exists at /account/orders/[id] */}
                        <Link href={`/account/orders/${order.id}`} className="font-bold text-blue-600 hover:underline truncate">
                          {order.id}
                        </Link>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <Calendar size={16} className="inline-block mr-1 text-gray-500" />
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <MapPin size={16} className="inline-block mr-1 text-gray-500" />
                        Delivered to:
                        {/* Placeholder for address - you'd fetch this from order details */}
                        <span className="font-medium"> Your Address</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 mb-1">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {order.itemCount} item{order.itemCount !== 1 && 's'}
                      </p>
                      <div className="flex items-center gap-2">
                        {/* Using the mock OrderTracker */}
                        <OrderTracker status={order.status} />
                        <Link href={`/account/orders/${order.id}`}>
                          <Button size="sm" variant="outline">
                            View Details <ChevronRight size={16} className="ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Only show pagination if there are multiple pages */}
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}