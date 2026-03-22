'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { Search, SlidersHorizontal } from 'lucide-react';

// Reusing mock data for structure
const MOCK_PRODUCTS = [
  { id: '1', name: 'Digital Thermometer', price: 29.99, category: 'Diagnostics', description: 'Accurate fast reading.', image: '', stock: 50, rating: 4.5, reviews: 12 },
  { id: '2', name: 'Blood Pressure Monitor', price: 89.99, category: 'Monitoring', description: 'Arm cuff monitor.', image: '', stock: 15, rating: 4.8, reviews: 124 },
  { id: '3', name: 'Pulse Oximeter', price: 34.50, category: 'Monitoring', description: 'Oxygen saturation monitor.', image: '', stock: 100, rating: 4.6, reviews: 89 },
  { id: '4', name: 'N95 Face Masks (50 Pack)', price: 45.00, category: 'Protection', description: 'Medical grade masks.', image: '', stock: 500, rating: 4.9, reviews: 450 },
  { id: '5', name: 'First Aid Kit Pro', price: 120.00, category: 'First Aid', description: 'Comprehensive emergency kit.', image: '', stock: 25, rating: 4.7, reviews: 56 },
  { id: '6', name: 'Standard Wheelchair', price: 250.00, category: 'Mobility', description: 'Lightweight folding wheelchair.', image: '', stock: 5, rating: 4.4, reviews: 18 },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter logic
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-1">Browse our complete catalog of medical supplies</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <SlidersHorizontal size={20} />
              <h2 className="font-bold text-lg">Filters</h2>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`w-full text-left flex justify-between items-center px-2 py-1.5 rounded transition ${activeCategory === 'All' ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Products
                </button>
              </li>
              {PRODUCT_CATEGORIES.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left flex justify-between items-center px-2 py-1.5 rounded transition ${activeCategory === category ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredProducts.length} results
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-16 text-center border border-gray-100">
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-6 text-blue-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}