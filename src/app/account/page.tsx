'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { User, Package, Heart, Settings, LogOut, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isMounted, router]);

  if (!isMounted || !isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-500 mt-1">Manage your profile, orders, and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <Card className="p-2 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg bg-blue-50 text-blue-700 font-medium">
              <User size={20} />
              Profile Overview
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-50 transition">
              <Package size={20} />
              Order History
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-50 transition">
              <Heart size={20} />
              Wishlist
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-50 transition">
              <MapPin size={20} />
              Saved Addresses
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-50 transition">
              <Settings size={20} />
              Settings
            </button>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
          {/* Profile Overview Card */}
          <Card>
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name || 'User'}</h2>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button variant="secondary">Edit Profile</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Account Details</h3>
                <div className="space-y-2 text-gray-900">
                  <p><span className="text-gray-500 inline-block w-24">Role:</span> {user?.role || 'Customer'}</p>
                  <p><span className="text-gray-500 inline-block w-24">Phone:</span> Not provided</p>
                  <p><span className="text-gray-500 inline-block w-24">Joined:</span> Just now</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Default Address</h3>
                <div className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-gray-600 text-sm mt-1">No default address set.</p>
                  <button className="text-blue-600 text-sm font-medium mt-2 hover:underline">Add Address</button>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Orders Snapshot */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>
            
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <Package size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">No orders yet</p>
              <p className="text-sm text-gray-500 mt-1">When you place an order, it will appear here.</p>
              <Button className="mt-4" onClick={() => router.push('/products')}>Start Shopping</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}