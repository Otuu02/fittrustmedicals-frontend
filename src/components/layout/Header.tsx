// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/Button';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  LogOut,
  Heart,
  ChevronDown,
  Check
} from 'lucide-react';

// Helper function to calculate cart item count
const calculateCartCount = (items: any[]) => {
  return items.reduce((total, item) => total + (item.quantity || 1), 0);
};

// List of countries
const countries = [
  { code: 'NG', name: 'Nigeria', currency: '₦', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', currency: '₵', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', currency: 'R', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', currency: 'E£', flag: '🇪🇬' },
  { code: 'US', name: 'United States', currency: '$', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', currency: '£', flag: '🇬🇧' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedCountry');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return countries.find(c => c.code === 'NG') || countries[0];
  });

  // Refs for dropdowns to detect outside clicks
  const categoriesRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  const { customer, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setHelpOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save selected country to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
  }, [selectedCountry]);

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

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setCountryDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-700 text-white text-xs hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5">
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <Link href="/sell" className="hover:text-blue-200 transition">
                Sell on Fittrust
              </Link>
              <Link href="/partner" className="hover:text-blue-200 transition">
                Partner Hub
              </Link>
              <Link href="/payment-shipping" className="hover:text-blue-200 transition">
                Payment & Shipping
              </Link>
              <Link href="/contact" className="hover:text-blue-200 transition">
                Contact Us
              </Link>
            </div>
            <div className="flex gap-6">
              {/* Help Dropdown */}
              <div className="relative" ref={helpRef}>
                <button
                  onClick={() => setHelpOpen(!helpOpen)}
                  className="hover:text-blue-200 transition flex items-center gap-1"
                >
                  Help <ChevronDown className="w-3 h-3" />
                </button>
                {helpOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link
                      href="/faq"
                      onClick={() => setHelpOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      FAQ
                    </Link>
                    <Link
                      href="/returns"
                      onClick={() => setHelpOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Returns Policy
                    </Link>
                    <Link
                      href="/shipping"
                      onClick={() => setHelpOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Shipping Info
                    </Link>
                    <Link
                      href="/support"
                      onClick={() => setHelpOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Support Center
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Country Dropdown */}
              <div className="relative" ref={countryRef}>
                <button
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  className="hover:text-blue-200 transition flex items-center gap-1"
                >
                  <span>{selectedCountry.flag}</span>
                  {selectedCountry.name} <ChevronDown className="w-3 h-3" />
                </button>
                {countryDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border max-h-80 overflow-y-auto">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="text-xs text-gray-400">({country.currency})</span>
                        </span>
                        {selectedCountry.code === country.code && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-blue-700 rounded-lg transition text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 md:w-12 md:h-12">
                  <Image
                    src="/images/logo.png"
                    alt="Fittrust Medicals Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
                    FITTRUST MEDICALS
                  </h1>
                  <p className="text-[10px] text-blue-100">
                    Healthcare Equipment & Supplies
                  </p>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search medical equipment, supplies, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-2.5 pr-28 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                />
                <div className="absolute right-1 top-1 flex gap-1">
                  <button
                    type="button"
                    className="bg-gray-100 px-3 py-1.5 rounded text-xs text-gray-600 hover:bg-gray-200"
                  >
                    All
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Account Dropdown */}
            <div className="hidden lg:flex items-center gap-4 text-white">
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer hover:text-blue-200 transition group"
                >
                  <User className="w-5 h-5" />
                  <div className="text-sm">
                    <div className="text-xs opacity-80">Hello,</div>
                    <div className="font-semibold flex items-center gap-1">
                      {isAuthenticated ? (customer?.name?.split(' ')[0] || 'User') : 'Sign In'}
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                </button>
                
                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    {isAuthenticated ? (
                      <>
                        <Link
                          href="/account"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Wishlist
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative hover:text-blue-200 transition">
                <Heart size={22} />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative hover:text-blue-200 transition">
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation - FIXED: Now clickable */}
      <nav className="bg-white border-b shadow-sm hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {/* Categories Dropdown - FIXED */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2 font-medium"
              >
                <Menu size={16} />
                All Categories
                <ChevronDown size={14} className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-md shadow-lg border z-50 overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border-b border-gray-100 last:border-0"
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="flex-1">{cat.name}</span>
                        <ChevronDown className="w-3 h-3 -rotate-90 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm rounded-md transition whitespace-nowrap font-medium ${
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-4 space-y-3">
            {/* Mobile User Info */}
            {isAuthenticated ? (
              <div className="pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{customer?.name}</div>
                    <Link href="/account" className="text-xs text-blue-600">My Account</Link>
                  </div>
                  <button onClick={handleLogout} className="text-sm text-red-600">
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="pb-3 border-b border-gray-200 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded-md font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full border border-blue-600 text-blue-600 text-center py-2 rounded-md font-semibold hover:bg-blue-50"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </form>

            {/* Mobile Categories */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Categories</h3>
              <div className="grid grid-cols-1 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Country Selector */}
            <div className="pt-3 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Select Country</h3>
              <div className="grid grid-cols-2 gap-2">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      handleCountrySelect(country);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                      selectedCountry.code === country.code
                        ? 'bg-blue-100 text-blue-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="pt-3 border-t border-gray-200">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg font-medium transition ${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Heart size={20} />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <ShoppingCart size={20} />
                <span>Cart ({cartItemCount})</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}