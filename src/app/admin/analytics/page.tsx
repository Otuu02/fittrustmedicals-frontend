'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProductsStore } from '@/stores/productsStore';
import { useOrdersStore } from '@/stores/ordersStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AnalyticsPage() {
  const { products } = useProductsStore();
  const { orders } = useOrdersStore();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    // Just wait for stores to load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const formatNaira = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Calculate percentage changes (mock data for demo)
  const revenueChange = +23;
  const ordersChange = +15;
  const productsChange = +8;
  const aovChange = +12;

  const stats = [
    {
      title: 'Total Revenue',
      value: formatNaira(totalRevenue),
      change: revenueChange,
      icon: DollarSign,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: ordersChange,
      icon: ShoppingCart,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Products',
      value: totalProducts.toLocaleString(),
      change: productsChange,
      icon: Package,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Average Order Value',
      value: formatNaira(averageOrderValue),
      change: aovChange,
      icon: TrendingUp,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  // Recent orders for the table
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your store's performance and sales metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </motion.div>

      {/* Charts Section - Placeholder for now */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Revenue Overview</h3>
            <span className="text-xs text-gray-500">Last 7 days</span>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization coming soon</p>
              <p className="text-sm text-gray-400">Connect to your analytics service</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Top Categories</h3>
            <span className="text-xs text-gray-500">By sales volume</span>
          </div>
          <div className="space-y-4">
            {['Diagnostic', 'Monitoring', 'PPE', 'First Aid', 'Mobility'].map((category, index) => (
              <div key={category} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm text-gray-500">{Math.floor(Math.random() * 40) + 10}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 rounded-full h-2" 
                      style={{ width: `${Math.floor(Math.random() * 40) + 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Orders Table */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
              <p className="text-sm text-gray-500 mt-1">Latest customer transactions</p>
            </div>
            <Link href="/admin/orders">
              <Button variant="secondary" size="sm">View All Orders</Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No orders yet</p>
                     </td>
                   </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          #{order.id?.slice(-8) || order.id}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-800">{order.customerName || 'Guest'}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatNaira(order.totalAmount || 0)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status?.replace('_', ' ') || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}