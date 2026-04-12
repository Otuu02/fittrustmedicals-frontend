'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Bell, 
  User, 
  LogOut,
  ChevronRight,
  Package
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';

const sidebarItems = [
  { href: '/account', icon: LayoutDashboard, label: 'Dashboard', color: 'blue' },
  { href: '/account/orders', icon: ShoppingBag, label: 'My Orders', color: 'green' },
  { href: '/account/addresses', icon: MapPin, label: 'Addresses', color: 'orange' },
  { href: '/account/wishlist', icon: Heart, label: 'Wishlist', color: 'red' },
  { href: '/account/notifications', icon: Bell, label: 'Notifications', color: 'purple' },
  { href: '/account/profile', icon: User, label: 'Profile Settings', color: 'gray' },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, customer, logout, _hasHydrated, getUnreadCount } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isAuthenticated, _hasHydrated, router]);

  if (!_hasHydrated || !isAuthenticated || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unreadCount = getUnreadCount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">Fittrust</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/account/notifications" 
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              
              <div className="flex items-center space-x-3 pl-4 border-l">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block font-medium text-gray-700">{customer.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-blue-200">{customer.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4 space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? `bg-${item.color}-50 text-${item.color}-600` 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.label === 'Notifications' && unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isActive ? 'opacity-100' : ''
                      }`} />
                    </Link>
                  );
                })}
                
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4 pt-4 border-t"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}