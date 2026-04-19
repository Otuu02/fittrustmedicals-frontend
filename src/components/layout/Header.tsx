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
  Check,
  Menu,
  X
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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* TOP BAR - Hidden on mobile, visible on tablet+ */}
      <div className="hidden md:block bg-blue-700 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5">
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <Link href="/sell" className="hover:text-blue-200">Sell on Fittrust</Link>
              <Link href="/partner" className="hover:text-blue-200">Partner Hub</Link>
              <Link href="/payment-shipping" className="hover:text-blue-200">Payment & Shipping</Link>
              <Link href="/contact" className="hover:text-blue-200">Contact Us</Link>
            </div>
            <div className="flex gap-6">
              <div className="relative" ref={helpRef}>
                <button onClick={() => setHelpOpen(!helpOpen)} className="hover:text-blue-200 flex items-center gap-1">
                  Help <ChevronDown className="w-3 h-3" />
                </button>
                {helpOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link href="/faq" onClick={() => setHelpOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">FAQ</Link>
                    <Link href="/returns" onClick={() => setHelpOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Returns Policy</Link>
                    <Link href="/shipping" onClick={() => setHelpOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Shipping Info</Link>
                    <Link href="/support" onClick={() => setHelpOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Support Center</Link>
                  </div>
                )}
              </div>
              <div className="relative" ref={countryRef}>
                <button onClick={() => setCountryDropdownOpen(!countryDropdownOpen)} className="hover:text-blue-200 flex items-center gap-1">
                  <span>{selectedCountry.flag}</span> {selectedCountry.name} <ChevronDown className="w-3 h-3" />
                </button>
                {countryDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border max-h-80 overflow-y-auto">
                    {countries.map((country) => (
                      <button key={country.code} onClick={() => handleCountrySelect(country)} className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <span className="flex items-center gap-2"><span>{country.flag}</span> <span>{country.name}</span></span>
                        {selectedCountry.code === country.code && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN HEADER - COMPACT like Jumia on mobile */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          {/* Row: Logo + Search + Icons (compact) */}
          <div className="flex items-center gap-2">
            {/* Hamburger Menu - Mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>

            {/* Logo - Smaller on mobile */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="relative w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10">
                  <Image
                    src="/images/logo.png"
                    alt="Fittrust Medicals"
                    fill
                    sizes="(max-width: 768px) 28px, 40px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="hidden xs:block">
                  <h1 className="text-xs sm:text-sm font-bold text-blue-600 tracking-tight leading-tight">
                    FITTRUST MEDICALS
                  </h1>
                  <p className="text-[8px] text-gray-500 leading-none">Healthcare Supplies</p>
                </div>
              </div>
            </Link>

            {/* Search Bar - Compact on mobile */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 sm:py-2 pr-16 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-gray-50"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-0.5 sm:top-1 bg-blue-600 text-white px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Icons Row - Compact */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* User Icon */}
              <div className="relative">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <User size={18} className="sm:w-5 sm:h-5" />
                </button>
                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    {isAuthenticated ? (
                      <>
                        <Link href="/account" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                        <Link href="/orders" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                        <Link href="/wishlist" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Wishlist</Link>
                        <hr className="my-1" />
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign In</Link>
                        <Link href="/register" onClick={() => setAccountDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="p-1.5 rounded-lg hover:bg-gray-100">
                <Heart size={18} className="sm:w-5 sm:h-5" />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-1.5 rounded-lg hover:bg-gray-100">
                <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY BAR - Scrollable horizontal like Jumia */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-3">
          <div className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-hide">
            {/* Categories Button */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-md text-xs font-medium whitespace-nowrap"
              >
                <Menu size={12} />
                All Categories
                <ChevronDown size={10} />
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border z-50 max-h-80 overflow-y-auto">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 border-b last:border-0"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Nav Links - Horizontal scroll */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR MENU (slide-out drawer) */}
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

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Categories</h3>
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

              {/* Navigation */}
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

              {/* Footer links */}
              <div className="pt-3 border-t">
                <Link href="/sell" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-sm text-gray-600">Sell on Fittrust</Link>
                <Link href="/partner" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-sm text-gray-600">Partner Hub</Link>
                <Link href="/payment-shipping" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-sm text-gray-600">Payment & Shipping</Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-sm text-gray-600">Contact Us</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}