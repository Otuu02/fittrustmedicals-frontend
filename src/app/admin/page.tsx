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
    <div className="space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-0">
      {/* Welcome Section - Mobile Friendly */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 break-words">
          Welcome back, {customer?.name?.split(' ')[0] || 'Administrator'}!
        </h1>
        <p className="text-xs sm:text-sm text-blue-100">Here's what's happening with your store today.</p>
      </div>

      {/* Wallet Balance Card - Mobile Friendly */}
      <Link href="/admin/wallet" className="block bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex-1">
            <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">Available Wallet Balance</p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">₦{(wallet?.balance || 0).toLocaleString()}</p>
            <p className="text-emerald-200 text-xs sm:text-sm mt-1 sm:mt-2">
              +₦{todayEarnings.toLocaleString()} earned today
            </p>
          </div>
          <div className="hidden sm:block p-3 md:p-4 bg-white/20 rounded-xl backdrop-blur-sm self-start">
            <Wallet className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
          </div>
        </div>
        
        {/* Wallet Stats - Stack on mobile, row on tablet */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:space-x-6 mt-4 sm:mt-6 pt-3 sm:pt-0 border-t border-emerald-400/30 sm:border-t-0">
          <div className="flex justify-between sm:block">
            <p className="text-emerald-200 text-xs">Total Earned</p>
            <p className="text-base sm:text-xl font-semibold">₦{(wallet?.totalEarned || 0).toLocaleString()}</p>
          </div>
          <div className="flex justify-between sm:block">
            <p className="text-emerald-200 text-xs">Total Withdrawn</p>
            <p className="text-base sm:text-xl font-semibold">₦{(wallet?.totalWithdrawn || 0).toLocaleString()}</p>
          </div>
          <div className="flex justify-between sm:block">
            <p className="text-emerald-200 text-xs">Pending Withdrawals</p>
            <p className="text-base sm:text-xl font-semibold">₦{(wallet?.pendingWithdrawals || 0).toLocaleString()}</p>
          </div>
        </div>
      </Link>

      {/* Stats Grid - Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? ArrowUpRight : ArrowDownRight;
          
          // Dynamic color classes - using inline styles for Tailwind dynamic colors
          const bgColorClass = {
            blue: 'bg-blue-50',
            green: 'bg-green-50',
            purple: 'bg-purple-50',
            orange: 'bg-orange-50'
          }[stat.color];
          
          const textColorClass = {
            blue: 'text-blue-600',
            green: 'text-green-600',
            purple: 'text-purple-600',
            orange: 'text-orange-600'
          }[stat.color];
          
          return (
            <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 md:p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg ${bgColorClass}`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${textColorClass}`} />
                </div>
                <div className={`flex items-center text-xs sm:text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium">{stat.title}</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1 break-words">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions - Responsive: 1 col mobile, 3 cols desktop */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link 
                key={index}
                href={action.href}
                className={`${action.color} text-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-between group`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-semibold text-sm sm:text-base md:text-lg">{action.label}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Placeholder - Mobile Friendly */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activity</h2>
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <p className="text-sm sm:text-base">No recent activity to display.</p>
          <p className="text-xs sm:text-sm mt-1">Activity will appear here as orders come in.</p>
        </div>
      </div>
    </div>
  );
}