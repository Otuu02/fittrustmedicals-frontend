// src/app/staff/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, TrendingUp, Package, DollarSign, Star, Award, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StaffStats {
  totalSalesRep: number;
  totalRevenue: number;
  totalOrders: number;
  avgRating: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Processing';
  date: string;
}

export default function StaffPage() {
  const [stats, setStats] = useState<StaffStats>({
    totalSalesRep: 0,
    totalRevenue: 0,
    totalOrders: 0,
    avgRating: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch staff stats and recent orders
    const mockStats: StaffStats = {
      totalSalesRep: 24,
      totalRevenue: 45250.00,
      totalOrders: 1240,
      avgRating: 4.7,
    };

    const mockOrders: RecentOrder[] = [
      {
        id: 'ORD-001',
        customer: 'John Doe',
        amount: '$245.99',
        status: 'Completed',
        date: '2024-03-18',
      },
      {
        id: 'ORD-002',
        customer: 'Jane Smith',
        amount: '$189.50',
        status: 'Pending',
        date: '2024-03-17',
      },
      {
        id: 'ORD-003',
        customer: 'Michael Johnson',
        amount: '$425.00',
        status: 'Completed',
        date: '2024-03-16',
      },
      {
        id: 'ORD-004',
        customer: 'Sarah Williams',
        amount: '$95.75',
        status: 'Processing',
        date: '2024-03-15',
      },
      {
        id: 'ORD-005',
        customer: 'Robert Brown',
        amount: '$312.25',
        status: 'Completed',
        date: '2024-03-14',
      },
    ];

    setStats(mockStats);
    setRecentOrders(mockOrders);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading staff dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
          <p className="text-gray-600">
            Welcome to Fittrustmedicals staff portal. Manage your sales and performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Staff */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Total Staff Members</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSalesRep}</p>
            <p className="text-sm text-green-600 mt-2">↑ 5 new this month</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Total Revenue</h3>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              \${stats.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Total Orders</h3>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-sm text-green-600 mt-2">↑ 8% increase</p>
          </div>

          {/* Avg Rating */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Avg Rating</h3>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star size={24} className="text-yellow-600" fill="currentColor" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
            <p className="text-sm text-green-600 mt-2">Excellent performance</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Performance */}
          <Link href="/staff/performance">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer h-full border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance Tracking</h3>
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <p className="text-gray-700 mb-4">
                Track your sales performance, targets, and achievements in real-time.
              </p>
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                View Performance <ArrowRight size={16} />
              </Button>
            </div>
          </Link>

          {/* Referral */}
          <Link href="/staff/referral">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer h-full border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Referral Program</h3>
                <Award size={24} className="text-green-600" />
              </div>
              <p className="text-gray-700 mb-4">
                Earn commissions by referring new customers to Fittrustmedicals.
              </p>
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                View Referrals <ArrowRight size={16} />
              </Button>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/staff/orders" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900 font-medium">{order.id}</td>
                    <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                    <td className="py-3 px-4 text-gray-900 font-semibold">{order.amount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{order.date}</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Staff */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performers</h2>

            <div className="space-y-4">
              {[
                { name: 'Alice Johnson', sales: '$12,450', rank: 1 },
                { name: 'Bob Smith', sales: '$10,230', rank: 2 },
                { name: 'Carol Davis', sales: '$9,580', rank: 3 },
                { name: 'David Lee', sales: '$8,920', rank: 4 },
                { name: 'Emma Wilson', sales: '$8,150', rank: 5 },
              ].map((performer) => (
                <div key={performer.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                      {performer.rank}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{performer.name}</p>
                      <p className="text-xs text-gray-600">Sales Rep</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{performer.sales}</p>
                    <p className="text-xs text-green-600">This Month</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/staff/performance">
              <Button variant="secondary" className="w-full mt-6">
                View Full Rankings
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>

            <div className="space-y-6">
              {/* Conversion Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-700 font-medium">Conversion Rate</p>
                  <p className="text-gray-900 font-bold">24.5%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24.5%' }}></div>
                </div>
              </div>

              {/* Customer Satisfaction */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-700 font-medium">Customer Satisfaction</p>
                  <p className="text-gray-900 font-bold">92%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              {/* Avg Order Value */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-700 font-medium">Avg Order Value</p>
                  <p className="text-gray-900 font-bold">\$156.50</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              {/* Repeat Customers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-700 font-medium">Repeat Customers</p>
                  <p className="text-gray-900 font-bold">45%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Latest Announcements</h2>

          <div className="space-y-4">
            {[
              {
                title: 'Spring Sale Campaign Started',
                content: 'New spring collection is now available with exclusive discounts for staff.',
                date: '2024-03-18',
                priority: 'high',
              },
              {
                title: 'Monthly Training Session',
                content: 'Join us for product knowledge training on March 20th at 2 PM EST.',
                date: '2024-03-15',
                priority: 'medium',
              },
              {
                title: 'Referral Bonus Update',
                content: 'Referral commissions increased by 10% for March and April.',
                date: '2024-03-10',
                priority: 'high',
              },
            ].map((announcement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  announcement.priority === 'high'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-yellow-50 border-yellow-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                    <p className="text-gray-700 text-sm mb-2">{announcement.content}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar size={12} />
                      {announcement.date}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      announcement.priority === 'high'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {announcement.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}