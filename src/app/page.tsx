'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, Filter } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
  rating: number;
  reviews: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Mock products data - Replace with API call later
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Digital Thermometer',
      price: 29.99,
      description: 'Fast and accurate temperature reading in seconds',
      image: '🌡️',
      stock: 15,
      category: 'Diagnostics',
      rating: 4.5,
      reviews: 128,
    },
    {
      id: '2',
      name: 'Blood Pressure Monitor',
      price: 49.99,
      description: 'Automatic digital BP monitor with LCD display',
      image: '📊',
      stock: 8,
      category: 'Monitoring',
      rating: 4.8,
      reviews: 256,
    },
    {
      id: '3',
      name: 'Pulse Oximeter',
      price: 39.99,
      description: 'Portable oxygen saturation monitor',
      image: '📱',
      stock: 12,
      category: 'Monitoring',
      rating: 4.6,
      reviews: 192,
    },
    {
      id: '4',
      name: 'Medical Gloves (100 pack)',
      price: 19.99,
      description: 'Latex-free protective gloves for safety',
      image: '🧤',
      stock: 50,
      category: 'Protection',
      rating: 4.3,
      reviews: 89,
    },
    {
      id: '5',
      name: 'First Aid Kit',
      price: 34.99,
      description: 'Complete home first aid kit with essentials',
      image: '🏥',
      stock: 20,
      category: 'First Aid',
      rating: 4.7,
      reviews: 145,
    },
    {
      id: '6',
      name: 'Stethoscope',
      price: 59.99,
      description: 'Professional dual-head stethoscope',
      image: '🔊',
      stock: 5,
      category: 'Diagnostics',
      rating: 4.9,
      reviews: 178,
    },
    {
      id: '7',
      name: 'Wheelchair',
      price: 299.99,
      description: 'Lightweight folding wheelchair',
      image: '♿',
      stock: 3,
      category: 'Mobility',
      rating: 4.4,
      reviews: 67,
    },
    {
      id: '8',
      name: 'Walking Cane',
      price: 24.99,
      description: 'Adjustable aluminum walking cane',
      image: '🎋',
      stock: 18,
      category: 'Mobility',
      rating: 4.2,
      reviews: 56,
    },
    {
      id: '9',
      name: 'Oxygen Tank',
      price: 199.99,
      description: 'Portable oxygen cylinder with regulator',
      image: '🔵',
      stock: 4,
      category: 'Respiratory',
      rating: 4.7,
      reviews: 94,
    },
    {
      id: '10',
      name: 'Heating Pad',
      price: 44.99,
      description: 'Electric heating pad for pain relief',
      image: '🔥',
      stock: 11,
      category: 'First Aid',
      rating: 4.5,
      reviews: 123,
    },
    {
      id: '11',
      name: 'Knee Brace',
      price: 34.99,
      description: 'Compression knee support brace',
      image: '🦵',
      stock: 22,
      category: 'Protection',
      rating: 4.3,
      reviews: 110,
    },
    {
      id: '12',
      name: 'Face Mask (50 pack)',
      price: 14.99,
      description: '3-ply medical face masks',
      image: '😷',
      stock: 100,
      category: 'Protection',
      rating: 4.6,
      reviews: 301,
    },
  ];

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProducts(mockProducts);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fittrust Medicals
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover quality medical equipment and supplies
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={20} />}
              className="pl-10 bg-white text-gray-900 border-0"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20">
              {/* Filter Toggle for Mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 bg-white p-3 rounded-lg border"
              >
                <Filter size={20} />
                Filters
              </button>

              {/* Filters Container */}
              <div
                className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
              >
                {/* Category Filter */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      All Products
                    </button>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Sort By</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'newest', label: 'Newest' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                      { value: 'rating', label: 'Highest Rated' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${
                          sortBy === option.value
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range - Optional */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Filters</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Products available: <span className="font-bold">{filteredProducts.length}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all'
                  ? 'All Products'
                  : selectedCategory}
              </h2>
              <span className="text-gray-600">
                Showing {filteredProducts.length} products
              </span>
            </div>

            {/* Loading State */}
            {loading && <Loading />}

            {/* No Results */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-4">
                  No products found matching your criteria
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                >
                  View All Products
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddSuccess={() => {
                      // You can add a toast notification here
                      console.log(`${product.name} added to cart!`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      {!loading && filteredProducts.length > 0 && (
        <div className="bg-blue-600 text-white py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Special Offers Available</h2>
            <p className="text-xl text-blue-100 mb-8">
              Get quality medical supplies at competitive prices
            </p>
            <Button variant="secondary" size="lg">
              View Deals
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}