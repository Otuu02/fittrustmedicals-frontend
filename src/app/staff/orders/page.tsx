// src/app/staff/orders/page.tsx
'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye, MoreVertical, X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'John Doe',
      email: 'john@example.com',
      date: '2024-03-18',
      status: 'delivered',
      items: [
        { id: '1', name: 'Blood Pressure Monitor', quantity: 1, price: 45.99 },
        { id: '2', name: 'Digital Thermometer', quantity: 2, price: 12.99 },
      ],
      total: 245.99,
      paymentStatus: 'paid',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      date: '2024-03-17',
      status: 'shipped',
      items: [
        { id: '2', name: 'Pulse Oximeter', quantity: 2, price: 29.99 },
      ],
      total: 189.50,
      paymentStatus: 'paid',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customer: 'Michael Johnson',
      email: 'michael@example.com',
      date: '2024-03-16',
      status: 'confirmed',
      items: [
        { id: '3', name: 'Digital Thermometer', quantity: 3, price: 12.99 },
        { id: '4', name: 'Face Masks (50 Pack)', quantity: 1, price: 19.99 },
      ],
      total: 425.00,
      paymentStatus: 'paid',
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customer: 'Sarah Williams',
      email: 'sarah@example.com',
      date: '2024-03-15',
      status: 'pending',
      items: [
        { id: '4', name: 'First Aid Kit', quantity: 1, price: 34.99 },
      ],
      total: 95.75,
      paymentStatus: 'pending',
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      customer: 'Robert Brown',
      email: 'robert@example.com',
      date: '2024-03-14',
      status: 'delivered',
      items: [
        { id: '5', name: 'Face Masks (50 Pack)', quantity: 2, price: 19.99 },
        { id: '6', name: 'Hand Sanitizer (500ml)', quantity: 3, price: 8.99 },
      ],
      total: 312.25,
      paymentStatus: 'paid',
    },
    {
      id: '6',
      orderNumber: 'ORD-2024-006',
      customer: 'Emily Davis',
      email: 'emily@example.com',
      date: '2024-03-13',
      status: 'shipped',
      items: [
        { id: '7', name: 'Glucose Meter with Strips', quantity: 1, price: 36.99 },
      ],
      total: 156.99,
      paymentStatus: 'paid',
    },
    {
      id: '7',
      orderNumber: 'ORD-2024-007',
      customer: 'James Wilson',
      email: 'james@example.com',
      date: '2024-03-12',
      status: 'cancelled',
      items: [
        { id: '8', name: 'Compression Bandage', quantity: 2, price: 14.99 },
      ],
      total: 65.50,
      paymentStatus: 'failed',
    },
  ];

  const filteredOrders = orders
    .filter((order) => {
      if (filterStatus !== 'all' && order.status !== filterStatus) return false;
      if (searchTerm && !order.orderNumber.includes(searchTerm.toUpperCase()) &&
          !order.customer.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'amount') {
        return b.total - a.total;
      }
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    pending: orders.filter((o) => o.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-600">
              Manage and track all customer orders
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Download size={18} />
            Export Orders
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-2">All time</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Delivered</p>
            <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
            <p className="text-xs text-gray-500 mt-2">Successfully shipped</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-500 mt-2">Awaiting action</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">
              \${stats.totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">From all orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Date (Newest)</option>
                <option value="amount">Amount (Highest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Payment</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-6 text-center">
                      <p className="text-gray-500">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-xs text-gray-600">{order.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-700">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">
                          \${order.total.toFixed(2)}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedOrder.orderNumber}</h2>
                  <p className="text-gray-600">{selectedOrder.customer}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                      Order Date
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(selectedOrder.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                      Payment Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getPaymentStatusColor(
                        selectedOrder.paymentStatus
                      )}`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                      Total Amount
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      \${selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="text-gray-900 font-medium">
                          \${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <p className="text-gray-700">
                      <strong>Name:</strong> {selectedOrder.customer}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong> {selectedOrder.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t flex gap-3">
                <Button className="flex-1 flex items-center justify-center gap-2">
                  <Printer size={18} />
                  Print Invoice
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}