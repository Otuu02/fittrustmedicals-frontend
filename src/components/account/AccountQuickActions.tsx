'use client';

import Link from 'next/link';
import { ArrowRight, Package, Star, Ticket, DollarSign, Bookmark, Clock, MapPin, Shield, Settings } from 'lucide-react';

const quickActions = [
  { 
    label: 'Your orders', 
    description: 'Track, return, or buy again', 
    href: '/account/orders',
    icon: Package,
    key: 'orders'
  },
  { 
    label: 'Your reviews', 
    description: 'View or edit product feedback', 
    href: '/account/reviews',
    icon: Star,
    key: 'reviews'
  },
  { 
    label: 'Your profile', 
    description: 'Update personal information', 
    href: '/account/profile',
    icon: 'user', // Or import User icon
    key: 'profile'
  },
  { 
    label: 'Coupons & offers', 
    description: 'Apply discounts to your next purchase', 
    href: '/account/coupons',
    icon: Ticket,
    key: 'coupons'
  },
  { 
    label: 'Credit balance', 
    description: 'Check available store credit', 
    href: '/account/balance',
    icon: DollarSign,
    key: 'balance'
  },
  { 
    label: 'Followed stores', 
    description: 'Stay updated with favorite brands', 
    href: '/account/following',
    icon: Bookmark,
    key: 'following'
  },
  { 
    label: 'Browsing history', 
    description: 'Revisit recently viewed products', 
    href: '/account/history',
    icon: Clock,
    key: 'history'
  },
  { 
    label: 'Addresses', 
    description: 'Manage delivery destinations', 
    href: '/account/addresses',
    icon: MapPin,
    key: 'addresses'
  },
  { 
    label: 'Account security', 
    description: 'Update password and security info', 
    href: '/account/security',
    icon: Shield,
    key: 'security'
  },
  { 
    label: 'Permissions', 
    description: 'Control notifications and preferences', 
    href: '/account/permissions',
    icon: Settings,
    key: 'permissions'
  },
];

export function AccountQuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickActions.map((action) => {
        const Icon = action.icon === 'user' ? '👤' : action.icon; // Fallback for user icon
        return (
          <Link
            key={action.key}
            href={action.href}
            className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {typeof Icon === 'string' ? (
                  <span className="text-2xl">{Icon}</span>
                ) : (
                  <Icon size={20} className="text-gray-400 group-hover:text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                  {action.label}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 ml-auto flex-shrink-0" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}