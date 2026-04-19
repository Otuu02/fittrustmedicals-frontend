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
    setAccountDropdownOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setCountryDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - NOW VISIBLE ON ALL SCREENS (removed hidden lg:block) */}
      <div className="bg-blue-700 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2">
          {/* Stack vertically on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              <Link href="/sell" className="hover:text-blue-200 transition py-1">
                Sell on Fittrust
              </Link>
              <Link href="/partner" className="hover:text-blue-200 transition py-1">
                Partner Hub
              </Link>
              <Link href="/payment-shipping" className="hover:text-blue-200 transition py-1">
                Payment & Shipping
              </Link>
              <Link href="/contact" className="hover:text-blue-200 transition py-1">
                Contact Us
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              {/* Help Dropdown */}
              <div className="relative" ref={helpRef}>
                <button
                  onClick={() => setHelpOpen(!helpOpen)}
                  className="hover:text-blue-200 transition flex items-center gap-1 py-1"
                >
                  Help <ChevronDown className="w-3 h-3" />
                </button>
                {helpOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link href="/faq" onClick={() => setHelpOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      FAQ
                    </Link>
                    <Link href="/returns" onClick={() => setHelpOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      Returns Policy
                    </Link>
                    <Link href="/shipping" onClick={() => setHelpOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      Shipping Info
                    </Link>
                    <Link href="/support" onClick={() => setHelpOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      Support Center
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Country Dropdown */}
              <div className="relative" ref={countryRef}>
                <button
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  className="hover:text-blue-200 transition flex items-center gap-1 py-1"
                >
                  <span>{selectedCountry.flag}</span>
                  <span className="hidden xs:inline">{selectedCountry.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {countryDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border max-h-80 overflow-y-auto">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
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
          {/* Stack on mobile, row on desktop */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            {/* Logo - always visible */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 md:w-12 md:h-12">
                  <Image
                    src="/images/logo.png"
                    alt="Fittrust Medicals Logo"
                    fill
                    sizes="(max-width: 768px) 40px, 48px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight">
                    FITTRUST MEDICALS
                  </h1>
                  <p className="text-[8px] sm:text-[10px] text-blue-100">
                    Healthcare Equipment & Supplies
                  </p>
                </div>
              </div>
            </Link>

            {/* Search Bar - full width on mobile */}
            <div className="flex-1 w-full md:max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search medical equipment, supplies, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pr-28 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm"
                />
                <div className="absolute right-1 top-1 flex gap-1">
                  <button
                    type="button"
                    className="bg-gray-100 px-2 sm:px-3 py-1.5 rounded text-xs text-gray-600 hover:bg-gray-200"
                  >
                    All
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 rounded text-sm font-semibold hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Account, Wishlist, Cart - NOW ALWAYS VISIBLE (removed hidden lg:flex) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-white w-full md:w-auto">
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:text-blue-200 transition"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="text-xs sm:text-sm">
                    <div className="text-[10px] sm:text-xs opacity-80">Hello,</div>
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
                        <Link href="/account" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          My Account
                        </Link>
                        <Link href="/orders" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          My Orders
                        </Link>
                        <Link href="/wishlist" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          Wishlist
                        </Link>
                        <hr className="my-1" />
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          Sign In
                        </Link>
                        <Link href="/register" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative hover:text-blue-200 transition">
                <Heart size={20} className="sm:w-[22px] sm:h-[22px]" />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative hover:text-blue-200 transition">
                <ShoppingCart size={20} className="sm:w-[22px] sm:h-[22px]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation - NOW VISIBLE ON ALL SCREENS (removed hidden lg:block) */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Wrap on mobile, row on desktop */}
          <div className="flex flex-wrap items-center gap-1 py-2">
            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-1 sm:gap-2 font-medium"
              >
                <Menu size={14} className="sm:w-4 sm:h-4" />
                All Categories
                <ChevronDown size={12} className={`sm:w-[14px] sm:h-[14px] transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 sm:w-72 bg-white rounded-md shadow-lg border z-50 overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100 last:border-0"
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

            {/* Navigation Links - wrap on mobile */}
            <div className="flex flex-wrap gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md transition whitespace-nowrap font-medium ${
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
        </div>
      </nav>
    </header>
  );
}

// Import Menu icon at the top
import { Menu } from 'lucide-react';