'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  Users, 
  Image as ImageIcon, 
  Settings,
  Store,
  LogOut,
  TrendingUp,
  Megaphone,
  ChevronRight,
  Bell,
  UserCog,
  BarChart3,
  Receipt,
  AlertTriangle,
  Wallet
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const sidebarItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', color: 'blue' },
  { href: '/admin/products', icon: Package, label: 'Products', color: 'indigo' },
  { href: '/admin/products/add', icon: PlusCircle, label: 'Add Product', color: 'green' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders', color: 'orange' },
  { href: '/admin/customers', icon: Users, label: 'Customers', color: 'purple' },
  { href: '/admin/users', icon: UserCog, label: 'Users', color: 'red' },
  { href: '/admin/staff-performance', icon: BarChart3, label: 'Staff Performance', color: 'cyan' },
  { href: '/admin/inventory', icon: AlertTriangle, label: 'Inventory', color: 'yellow' },
  { href: '/admin/finance', icon: TrendingUp, label: 'Financials', color: 'emerald' },
  { href: '/admin/wallet', icon: Wallet, label: 'Wallet & Payments', color: 'emerald' },
  { href: '/admin/receipts', icon: Receipt, label: 'Receipts', color: 'pink' },
  { href: '/admin/promotions', icon: Megaphone, label: 'Promotions', color: 'pink' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics', color: 'cyan' },
  { href: '/admin/media', icon: ImageIcon, label: 'Media Library', color: 'teal' },
  { href: '/admin/settings', icon: Settings, label: 'Settings', color: 'gray' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, logout, _hasHydrated, getInventoryAlerts, getUnreadCount, wallet } = useAuthStore();

  const inventoryAlertCount = getInventoryAlerts().filter(a => a.status === 'low' || a.status === 'out').length;
  const unreadCount = getUnreadCount();

  useEffect(() => {
    if (_hasHydrated && (!isAuthenticated || !isAdmin)) {
      router.push('/login?redirect=/admin');
    }
  }, [isAuthenticated, isAdmin, _hasHydrated, router]);

  if (!_hasHydrated || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl flex flex-col z-20">
        <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="flex items-center space-x-3">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"
            >
              <LayoutDashboard className="w-7 h-7" />
            </motion.div>
            <div>
              <h2 className="font-bold text-xl">Fittrustmedicals</h2>
              <p className="text-xs text-blue-200 font-medium">Admin Console</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? `bg-${item.color}-50 text-${item.color}-600 shadow-sm` 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.label === 'Inventory' && inventoryAlertCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {inventoryAlertCount}
                    </span>
                  )}
                  {item.label === 'Wallet & Payments' && wallet.pendingWithdrawals > 0 && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500`}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link 
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Store className="w-5 h-5" />
            <span className="font-medium">View Store</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {sidebarItems.find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label || 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/admin/wallet"
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Wallet className="w-4 h-4" />
              <span className="font-medium">₦{wallet.balance.toLocaleString()}</span>
            </Link>
            
            <Link 
              href="/"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Store className="w-4 h-4" />
              <span>View Public Store</span>
            </Link>
            
            <button className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-3 pl-6 border-l">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-gray-800">Administrator</p>
                <p className="text-xs text-gray-500">admin@fittrust.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}