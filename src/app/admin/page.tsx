// src/app/admin/page.tsx
'use client';

import { Card } from '@/components/ui/Card';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Package,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Orders', value: '1,234', change: '+12.5%', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Products', value: '456', change: '+4.3%', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Customers', value: '2,350', change: '+18.2%', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'Completed', date: '2024-03-20' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'Processing', date: '2024-03-20' },
    { id: 'ORD-003', customer: 'Bob Johnson', amount: 499.99, status: 'Pending', date: '2024-03-19' },
  ];

  const lowStockProducts = [
    { name: 'Digital Thermometer', stock: 5 },
    { name: 'Blood Pressure Monitor', stock: 3 },
    { name: 'Stethoscope', stock: 2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${order.amount.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="text-orange-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Low Stock Alert</h2>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                <p className="text-gray-900">{product.name}</p>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}