// src/app/admin/orders/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Eye, Download, Filter } from 'lucide-react';

export default function AdminOrdersPage() {
  const [filterStatus, setFilterStatus] = useState('all');

  const orders = [
    { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', total: 299.99, status: 'completed', date: '2024-03-20', items: 3 },
    { id: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', total: 149.50, status: 'processing', date: '2024-03-20', items: 2 },
    { id: 'ORD-003', customer: 'Bob Johnson', email: 'bob@example.com', total: 499.99, status: 'pending', date: '2024-03-19', items: 5 },
    { id: 'ORD-004', customer: 'Alice Williams', email: 'alice@example.com', total: 89.99, status: 'shipped', date: '2024-03-19', items: 1 },
    { id: 'ORD-005', customer: 'Charlie Brown', email: 'charlie@example.com', total: 199.99, status: 'cancelled', date: '2024-03-18', items: 2 },
  ];

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'primary';
      case 'shipped': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <Download size={20} />
          Export CSV
        </Button>
      </div>

      {/* Filter Tabs */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.items} items</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      variant={getStatusColor(order.status) as any}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800 p-1">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No orders found with status: {filterStatus}</p>
        </div>
      )}
    </div>
  );
}