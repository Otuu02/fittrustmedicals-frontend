'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  UserCog,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  // FIXED: Remove 'isLoading' - it doesn't exist in your store
  const { customer, _hasHydrated, wallet, orders, getFinancialMetrics } = useAuthStore();

  // Use _hasHydrated to check if store is ready
  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is admin
  if (!customer || customer.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Access Denied</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const metrics = getFinancialMetrics?.('daily') || { monthlyRevenue: 0 };
  
  // Calculate today's earnings
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = wallet?.transactions?.filter(
    (t: any) => t.type === 'credit' && t.createdAt?.startsWith(today)
  ) || [];
  const todayEarnings = todayTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);

  const stats = [
    { 
      title: 'Total Products', 
      value: '0', 
      icon: Package, 
      trend: '+12%',
      trendUp: true,
      color: 'blue'
    },
    { 
      title: 'Total Orders', 
      value: orders?.length?.toString() || '0', 
      icon: ShoppingCart, 
      trend: '+5%',
      trendUp: true,
      color: 'green'
    },
    { 
      title: 'Total Customers', 
      value: '6', 
      icon: Users, 
      trend: '-2%',
      trendUp: false,
      color: 'purple'
    },
    { 
      title: 'Revenue', 
      value: `₦${metrics?.monthlyRevenue?.toLocaleString() || 0}`, 
      icon: TrendingUp, 
      trend: '+18%',
      trendUp: true,
      color: 'orange'
    },
  ];

  const quickActions = [
    { href: '/admin/products', label: 'Manage Products', color: 'bg-blue-600 hover:bg-blue-700', icon: Package },
    { href: '/admin/orders', label: 'View Orders', color: 'bg-green-600 hover:bg-green-700', icon: ShoppingCart },
    { href: '/admin/users', label: 'Manage Users', color: 'bg-purple-600 hover:bg-purple-700', icon: UserCog },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {customer?.name || 'Administrator'}!</h1>
        <p className="text-blue-100">Here's what's happening with your store today.</p>
      </div>

      {/* Wallet Balance Card */}
      <Link href="/admin/wallet" className="block bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Available Wallet Balance</p>
            <p className="text-4xl font-bold">₦{(wallet?.balance || 0).toLocaleString()}</p>
            <p className="text-emerald-200 text-sm mt-2">
              +₦{todayEarnings.toLocaleString()} earned today
            </p>
          </div>
          <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
            <Wallet className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="flex items-center mt-6 space-x-6">
          <div>
            <p className="text-emerald-200 text-xs">Total Earned</p>
            <p className="text-xl font-semibold">₦{(wallet?.totalEarned || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-emerald-200 text-xs">Total Withdrawn</p>
            <p className="text-xl font-semibold">₦{(wallet?.totalWithdrawn || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-emerald-200 text-xs">Pending Withdrawals</p>
            <p className="text-xl font-semibold">₦{(wallet?.pendingWithdrawals || 0).toLocaleString()}</p>
          </div>
        </div>
      </Link>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? ArrowUpRight : ArrowDownRight;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="w-4 h-4 mr-1" />
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link 
                key={index}
                href={action.href}
                className={`${action.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-between group`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6" />
                  <span className="font-semibold text-lg">{action.label}</span>
                </div>
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-gray-500">
          <p>No recent activity to display.</p>
          <p className="text-sm mt-1">Activity will appear here as orders come in.</p>
        </div>
      </div>
    </div>
  );
}