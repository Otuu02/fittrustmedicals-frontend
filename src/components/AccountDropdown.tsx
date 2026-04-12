'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaShoppingBag, FaStar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuthStore } from '@/stores/authStore';

export default function AccountDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: 'OTUU OBINNA', email: 'otuu@example.com' });
  const { logout } = useAuthStore();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const menuItems = [
    { 
      icon: FaUser, 
      label: 'Your profile', 
      href: '/account/profile' 
    },
    { 
      icon: FaShoppingBag, 
      label: 'Your orders', 
      href: '/account/orders',
      badge: '5'
    },
    { 
      icon: FaStar, 
      label: 'Your reviews', 
      href: '/account/reviews'
    },
    { 
      icon: FaCog, 
      label: 'Account security', 
      href: '/account/security'
    },
    { 
      icon: FaCog, 
      label: 'Addresses', 
      href: '/account/addresses'
    },
    { 
      icon: FaStar, 
      label: 'Coupons & offers', 
      href: '/account/coupons'
    },
    { 
      icon: FaShoppingBag, 
      label: 'Credit balance', 
      href: '/account/credit'
    },
    { 
      icon: FaUser, 
      label: 'Permissions', 
      href: '/account/permissions'
    }
  ];

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FaUser className="w-5 h-5" />
        <span>{user.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>

          <div className="py-1 max-h-80 overflow-y-auto">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-1">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}