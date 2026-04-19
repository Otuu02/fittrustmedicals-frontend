'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import {
  ShoppingCart,
  User,
  Search,
  LogOut,
  Heart,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

// Helper function to calculate cart item count
const calculateCartCount = (items: any[]) => {
  return items.reduce((total, item) => total + (item.quantity || 1), 0);
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);

  const { customer, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartItemCount = isClient ? calculateCartCount(items) : 0;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const categories = [
    { name: 'Diagnostic Equipment', href: '/products?category=diagnostic', icon: '🔬' },
    { name: 'Surgical Supplies', href: '/products?category=surgical', icon: '🩺' },
    { name: 'Patient Monitoring', href: '/products?category=monitoring', icon: '📊' },
    { name: 'PPE & Safety', href: '/products?category=ppe', icon: '🛡️' },
    { name: 'First Aid', href: '/products?category=first-aid', icon: '🩹' },
    { name: 'Lab Equipment', href: '/products?category=lab', icon: '🧪' },
    { name: 'Mobility Aids', href: '/products?category=mobility', icon: '🦽' },
    { name: 'Hospital Furniture', href: '/products?category=furniture', icon: '🛏️' },
    { name: 'Pharmaceuticals', href: '/products?category=pharma', icon: '💊' },
    { name: 'Dental Equipment', href: '/products?category=dental', icon: '🦷' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm w-full">
      {/* Simple Header - Like Jumia (No top bar on mobile) */}
      <div className="bg-white">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Hamburger Menu - Mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
            >
              <Menu size={22} />
            </button>

            {/* Logo + Name - Simple like Jumia */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                  <Image
                    src="/images/logo.png"
                    alt="Fittrust Medicals"
                    fill
                    sizes="32px"
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-blue-600 whitespace-nowrap">
                  FITTRUST
                </span>
              </div>
            </Link>

            {/* Search Bar - Clean, no overlap */}
            <div className="flex-1 max-w-[50%] sm:max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-9 pr-14 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-gray-50"
                />
                <Search 
                  size={15} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-700 transition"
                >
                  Go
                </button>
              </form>
            </div>

            {/* Icons - Cart + Account (like Jumia) */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Account Icon */}
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <User size={20} />
                </button>
                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    {isAuthenticated ? (
                      <>
                        <Link href="/account" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          My Account
                        </Link>
                        <Link href="/orders" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          My Orders
                        </Link>
                        <Link href="/wishlist" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Wishlist
                        </Link>
                        <hr className="my-1" />
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Sign In
                        </Link>
                        <Link href="/register" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation - Simple horizontal scroll (visible on all screens) */}
      <div className="bg-white border-t border-b border-gray-100">
        <div className="px-3">
          <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
            <button
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-medium whitespace-nowrap"
            >
              <Menu size={14} />
              All Categories
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap font-medium ${
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR MENU - Contains all the extra links (Sell, Partner, Help, Country, etc.) */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <span className="font-bold text-blue-600">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* User section */}
              {isAuthenticated ? (
                <div className="pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">{customer?.name}</div>
                      <button onClick={handleLogout} className="text-xs text-red-600">Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pb-3 border-b">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full bg-blue-600 text-white text-center py-2 rounded-md text-sm font-semibold">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full border border-blue-600 text-blue-600 text-center py-2 rounded-md text-sm font-semibold">
                    Create Account
                  </Link>
                </div>
              )}

              {/* Sell on Fittrust & Partner Hub - moved to dropdown */}
              <div className="pt-2">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">For Sellers</h3>
                <Link href="/sell" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">
                  Sell on Fittrust
                </Link>
                <Link href="/partner" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">
                  Partner Hub
                </Link>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Shop by Category</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Quick Links</h3>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Support & Help */}
              <div className="pt-3 border-t">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Support</h3>
                <Link href="/payment-shipping" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">
                  Payment & Shipping
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">
                  Contact Us
                </Link>
                <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">
                  Help & FAQ
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}